import { BIG_NUMBER_CONFIG, LEG_FIELD } from '@/constants/common';
import { orderLegColDefs } from '@/constants/legColDefs/common/order';
import {
  COMPUTED_LEG_FIELD_MAP,
  COMPUTED_LEG_FIELDS,
  ComputedColDefs,
} from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import {
  TRADESCOL_FIELDS,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import { IColDef } from '@/design/components/Table/types';
import {
  countDelta,
  countDeltaCash,
  countGamaCash,
  countGamma,
  countPrice,
  countPricePer,
  countRhoR,
  countStdDelta,
  countTheta,
  countVega,
} from '@/services/cash';
import { getActualNotionAmountBigNumber, handleJudge } from '@/services/trade';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

export default {
  namespace: 'pricingData',

  state: {
    columnDefs: [],
    dataSource: [],
  },

  effects: {
    // *fetchCurrent(_, { call, put }) {
    //   // const response = yield call(queryUserInfo);
    //   if (response.error) return;
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: response.data,
    //   });
    // },
  },

  reducers: {
    removeLegData(state, { payload: { id, rowKey } }) {
      const index = state.dataSource.findIndex(item => item[rowKey] === id);
      state.dataSource.splice(index, 1);

      if (state.dataSource.length === 0) {
        state.columnDefs = [];
      }
    },

    pricingLegData(state, action) {
      const {
        payload: { rsps },
      } = action;
      state.dataSource = rsps
        .reduce((pre, next) => {
          return pre.concat(next.data);
        }, [])
        .map((item, index) => {
          const cur = state.dataSource[index];

          return {
            ...cur,
            ..._.mapValues(_.pick(item, TRADESCOL_FIELDS), (val, key) => {
              val = new BigNumber(val).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();
              if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                return val;
              }
              return val
                ? new BigNumber(val)
                    .multipliedBy(100)
                    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                    .toNumber()
                : val;
            }),
            [COMPUTED_LEG_FIELD_MAP.PRICE]: countPrice(item.price),
            [COMPUTED_LEG_FIELD_MAP.PRICE_PER]: countPricePer(
              item.price,
              getActualNotionAmountBigNumber(cur)
            ),
            [COMPUTED_LEG_FIELD_MAP.STD_DELTA]: countStdDelta(item.delta, item.quantity),
            [COMPUTED_LEG_FIELD_MAP.DELTA]: countDelta(
              item.delta,
              cur[LEG_FIELD.UNDERLYER_MULTIPLIER]
            ),
            [COMPUTED_LEG_FIELD_MAP.DELTA_CASH]: countDeltaCash(item.delta, item.underlyerPrice),
            [COMPUTED_LEG_FIELD_MAP.GAMMA]: countGamma(
              item.gamma,
              cur[LEG_FIELD.UNDERLYER_MULTIPLIER],
              item.underlyerPrice
            ),
            [COMPUTED_LEG_FIELD_MAP.GAMMA_CASH]: countGamaCash(item.gamma, item.underlyerPrice),
            [COMPUTED_LEG_FIELD_MAP.VEGA]: countVega(item.vega),
            [COMPUTED_LEG_FIELD_MAP.THETA]: countTheta(item.theta),
            [COMPUTED_LEG_FIELD_MAP.RHO_R]: countRhoR(item.rhoR),
            // [COMPUTED_LEG_FIELD_MAP.RHO]: new BigNumber(item.rho)
            // .multipliedBy(100)
            // .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
            // .toNumber(),
          };
        });
    },

    setPricingDefault(state, action) {
      const {
        payload: { data, rowId },
      } = action;

      state.dataSource.forEach(item => {
        if (item.id === rowId) {
          Object.assign(
            item,
            _.mapValues(
              _.pick(
                data,
                TRADESCOL_FIELDS.filter(
                  item => item !== TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE
                )
              ),
              val => {
                if (val) {
                  return new BigNumber(val)
                    .multipliedBy(100)
                    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                    .toNumber();
                }
                return val;
              }
            )
          );
        }
      });
    },

    clearPricingDefault(state, action) {
      state.dataSource.forEach(item => {
        Object.assign(
          item,
          _.fromPairs(
            [
              ...TRADESCOL_FIELDS.filter(
                item => item !== TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE
              ),
              ...COMPUTED_LEG_FIELDS,
            ].map(item => [item, undefined])
          )
        );
      });
    },

    addLegData(state, action) {
      const {
        payload: { cacheTyeps, computedLeg, computedAllLegTypes, nextTradesColDefs, rowData },
      } = action;
      if (cacheTyeps.indexOf(computedLeg.type) !== -1) {
        state.columnDefs = orderLegColDefs(
          _.unionBy<IColDef>(
            state.columnDefs.concat(
              // 这里的 leg 中的 columnDefs 是 computedAllLegTypes 查找到的
              computedLeg.columnDefs.map(col => {
                return {
                  ...col,
                  suppressMenu: true,
                  editable: col.editable
                    ? params => {
                        if (typeof col.editable === 'function') {
                          if (col.editable(params)) {
                            return handleJudge(params, computedAllLegTypes);
                          } else {
                            return false;
                          }
                        }
                        return handleJudge(params, computedAllLegTypes);
                      }
                    : false,
                  exsitable: params => {
                    const legExsitable = handleJudge(params, computedAllLegTypes);
                    if (!legExsitable) return false;
                    if (typeof col.exsitable === 'function') {
                      return col.exsitable(params);
                    }
                    return col.exsitable === undefined ? true : col.exsitable;
                  },
                };
              })
            ),
            item => item.field
          )
        );
      }
      state.columnDefs = _.unionBy<IColDef>(state.columnDefs, item => item.field);
      _.remove(state.columnDefs, (item: any) =>
        [...nextTradesColDefs, ...ComputedColDefs].find(iitem => iitem.field === item.field)
      );
      state.columnDefs = state.columnDefs.concat(nextTradesColDefs).concat(ComputedColDefs);
      state.dataSource.push(rowData);
    },
  },
};
