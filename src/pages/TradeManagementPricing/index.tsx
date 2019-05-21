import { Form2 } from '@/components';
import { IFormField } from '@/components/type';
import {
  BIG_NUMBER_CONFIG,
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import {
  COMPUTED_LEG_FIELDS,
  COMPUTED_LEG_FIELD_MAP,
  TOTAL_FIELD,
  TRADESCOLDEFS_LEG_FIELD_MAP,
  TRADESCOL_FIELDS,
} from '@/constants/global';
import { LEG_ENV, TOTAL_COMPUTED_FIELDS, TOTAL_TRADESCOL_FIELDS } from '@/constants/legs';
import { PRICING_FROM_EDITING } from '@/constants/trade';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import Page from '@/containers/Page';
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
import { convertTradePositions, createLegDataSourceItem } from '@/services/pages';
import { prcTrialPositionsService } from '@/services/pricing';
import { prcPricingEnvironmentsList } from '@/services/pricing-service';
import { getActualNotionAmountBigNumber } from '@/services/trade';
import { getLegByRecord } from '@/tools';
import { getMoment, insert, remove, uuid } from '@/utils';
import { Divider, Menu, message, notification } from 'antd';
import BigNumber from 'bignumber.js';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import ActionBar from './ActionBar';
import './index.less';

const DATE_ARRAY = [LEG_FIELD.SETTLEMENT_DATE, LEG_FIELD.EFFECTIVE_DATE, LEG_FIELD.EXPIRATION_DATE];

const TradeManagementBooking = props => {
  const tableData = _.map(props.pricingData.tableData, iitem => {
    return _.mapValues(iitem, (item, key) => {
      if (_.includes(DATE_ARRAY, key)) {
        return {
          type: 'field',
          value: getMoment(item.value),
        };
      }
      return item;
    });
  });
  const { location, tradeManagementBookEditPageData } = props;
  const tableEl = useRef<IMultiLegTableEl>(null);
  const [curPricingEnv, setCurPricingEnv] = useState(null);

  const setTableData = payload => {
    props.dispatch({
      type: 'pricingData/setTableData',
      payload,
    });
  };

  const { query } = location;
  const { from } = query;

  useLifecycles(() => {
    const { tableData: editingTableData = [] } = tradeManagementBookEditPageData;

    if (from === PRICING_FROM_EDITING) {
      const recordTypeIsModelXY = record => {
        return Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.MODEL_XY;
      };

      if (editingTableData.some(recordTypeIsModelXY)) {
        message.info('暂不支持自定义产品试定价');
      }

      const next = editingTableData
        .filter(record => !recordTypeIsModelXY(record))
        .map(record => {
          const leg = getLegByRecord(record);
          if (!leg) return record;
          const omits = _.difference(
            leg.getColumns(LEG_ENV.EDITING).map(item => item.dataIndex),
            leg.getColumns(LEG_ENV.PRICING).map(item => item.dataIndex)
          );
          return {
            ...createLegDataSourceItem(leg, LEG_ENV.PRICING),
            ...leg.getDefaultData(LEG_ENV.PRICING),
            ..._.omit(record, [...omits, ...LEG_INJECT_FIELDS]),
            [LEG_FIELD.UNDERLYER_PRICE]: record[LEG_FIELD.INITIAL_SPOT],
          };
        });
      setTableData(next);
    }
  });

  const [fetched, setFetched] = useState(false);

  useEffect(
    () => {
      if (from === PRICING_FROM_EDITING) {
        if (fetched) return;
        if (!curPricingEnv || !curPricingEnv.length) return;
        if (_.isEmpty(tableData)) return;
        tableData.forEach(record => fetchDefaultPricingEnvData(record));
        setFetched(true);
      }
    },
    [tableData, curPricingEnv]
  );

  const judgeLegColumnsHasError = record => {
    const leg = getLegByRecord(record);

    if (!leg) {
      throw new Error('leg is not defiend.');
    }

    const leftColumns = _.reject(
      leg.getColumns(LEG_ENV.PRICING),
      item =>
        !![...TOTAL_TRADESCOL_FIELDS, ...TOTAL_COMPUTED_FIELDS].find(
          iitem => iitem.dataIndex === item.dataIndex
        )
    );

    const leftKeys = leftColumns.map(item => item.dataIndex);

    const fills = leftKeys.reduce((obj, key) => {
      obj[key] = record[key] || undefined;
      return obj;
    }, {});

    const leftValues = Form2.getFieldsValue(_.pick(fills, leftKeys));

    if (_.some(leftValues, val => val == null)) {
      return true;
    }

    return false;
  };

  const getSelfTradesColDataIndexs = record => {
    const leg = getLegByRecord(record);
    const selfTradesColDataIndexs = _.intersection(
      leg.getColumns(LEG_ENV.PRICING).map(item => item.dataIndex),
      TRADESCOL_FIELDS
    );
    return selfTradesColDataIndexs;
  };

  const fetchDefaultPricingEnvData = _.debounce(async (record, reload = false) => {
    if (judgeLegColumnsHasError(record)) {
      return;
    }

    const inlineSetLoadings = loading => {
      requiredTradeOptions.forEach(colId => {
        tableEl.current.setLoadings(record[LEG_ID_FIELD], colId, loading);
      });
    };

    // const rsps = await tableEl.current.validate({ silence: true });
    // if (rsps.some(item => item.errors)) {
    //   return;
    // }

    const requiredTradeOptions = getSelfTradesColDataIndexs(record).filter(
      item =>
        item !== TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE &&
        item !== TRADESCOLDEFS_LEG_FIELD_MAP.Q
    );

    // val，q 等都为空，视为默认
    if (
      !reload &&
      _.some(_.pick(record, requiredTradeOptions), item => Form2.getFieldValue(item) != null)
    ) {
      return;
    }

    if (!curPricingEnv) {
      return message.warn('定价环境不能为空');
    }

    inlineSetLoadings(true);

    const { error, data = [], raw } = await prcTrialPositionsService({
      positions: convertTradePositions(
        [Form2.getFieldsValue(_.omit(record, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]))],
        {},
        LEG_ENV.PRICING
      ),
      pricingEnvironmentId: curPricingEnv,
    });

    inlineSetLoadings(false);

    if (error) return;

    if (!_.isEmpty(raw.diagnostics)) {
      return notification.error({
        message: '请求错误',
        description: _.get(raw.diagnostics, '[0].message'),
      });
    }

    const rowId = record[LEG_ID_FIELD];

    setTableData(pre => {
      return pre.map(item => {
        if (item[LEG_ID_FIELD] === rowId) {
          const selfTradesColDataIndexs = getSelfTradesColDataIndexs(item);
          return {
            ...item,
            ...Form2.createFields(
              _.mapValues(
                _.pick<{
                  [key: string]: number;
                }>(
                  _.first(data),
                  selfTradesColDataIndexs.filter(
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
            ),
          };
        }
        return item;
      });
    });
  }, 250);

  const [pricingEnvironmentsList, setPricingEnvironmentsList] = useState([]);

  const loadPricingEnv = async () => {
    const { error, data } = await prcPricingEnvironmentsList();
    if (error) return;
    setPricingEnvironmentsList(data);
    setCurPricingEnv(data[0]);
  };

  useLifecycles(() => {
    loadPricingEnv();
  });

  const [pricingLoading, setPricingLoading] = useState(false);

  const testPricing = async params => {
    if (_.isEmpty(tableData)) {
      message.warn('请添加期权结构');
      return;
    }

    const results = await tableEl.current.table.validate();

    if (results.some(item => item.errors)) return;

    setPricingLoading(true);

    const positions = convertTradePositions(
      tableData.map(item =>
        Form2.getFieldsValue(_.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]))
      ),
      {},
      LEG_ENV.PRICING
    );

    const rsps = await Promise.all(
      positions.map((item, index) => {
        return prcTrialPositionsService({
          // 需要计算的值，可选price, delta, gamma, vega, theta, rhoR和rhoQ。若为空数组或null，则计算所有值
          // requests,
          // pricingEnvironmentId,
          // valuationDateTime,
          // timezone,
          positions: [item],
          ..._.mapValues(
            Form2.getFieldsValue(_.pick(tableData[index], TRADESCOL_FIELDS)),
            (val, key) => {
              if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                return val;
              }
              return val ? new BigNumber(val).multipliedBy(0.01).toNumber() : val;
            }
          ),
          ...(item.productType === LEG_TYPE_MAP.FORWARD ? { vol: 1 } : undefined),
          pricingEnvironmentId: curPricingEnv,
        });
      })
    );

    setPricingLoading(false);

    const rspIsError = rsp => {
      const { raw, error } = rsp;
      if (error || (raw && raw.diagnostics && raw.diagnostics.length)) {
        return true;
      }
      return false;
    };

    const rspIsEmpty = rsp => {
      return _.isEmpty(rsp.data);
    };

    setTableData(pre => {
      return rsps
        .reduce((pre, next) => {
          const isError = rspIsError(next);
          if (isError || rspIsEmpty(next)) {
            if (isError) {
              notification.error({
                message: _.get(next.raw.diagnostics, '[0].message', []),
              });
            }
            return pre.concat(null);
          }
          return pre.concat(next.data);
        }, [])
        .map((item, index) => {
          const record = pre[index];

          if (item == null) return record;

          return {
            ...record,
            ...Form2.createFields({
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
                getActualNotionAmountBigNumber(Form2.getFieldsValue(record))
              ),
              [COMPUTED_LEG_FIELD_MAP.STD_DELTA]: countStdDelta(item.delta, item.quantity),
              [COMPUTED_LEG_FIELD_MAP.DELTA]: countDelta(
                item.delta,
                Form2.getFieldValue(record[LEG_FIELD.UNDERLYER_MULTIPLIER])
              ),
              [COMPUTED_LEG_FIELD_MAP.DELTA_CASH]: countDeltaCash(item.delta, item.underlyerPrice),
              [COMPUTED_LEG_FIELD_MAP.GAMMA]: countGamma(
                item.gamma,
                Form2.getFieldValue(record[LEG_FIELD.UNDERLYER_MULTIPLIER]),
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
            }),
          };
        });
    });
  };

  return (
    <Page>
      <ActionBar
        setTableData={setTableData}
        curPricingEnv={curPricingEnv}
        setCurPricingEnv={setCurPricingEnv}
        tableData={tableData}
        pricingEnvironmentsList={pricingEnvironmentsList}
        fetchDefaultPricingEnvData={fetchDefaultPricingEnvData}
        testPricing={testPricing}
        pricingLoading={pricingLoading}
      />
      <Divider />
      <MultiLegTable
        totalColumnIds={COMPUTED_LEG_FIELDS}
        totalable={true}
        env={LEG_ENV.PRICING}
        tableEl={tableEl}
        onCellFieldsChange={params => {
          const { record } = params;
          const leg = getLegByRecord(record);

          setTableData(pre => {
            const newData = pre.map(item => {
              if (item[LEG_ID_FIELD] === params.rowId) {
                return {
                  ...item,
                  ...params.changedFields,
                };
              }
              return item;
            });
            if (leg.onDataChange) {
              leg.onDataChange(
                LEG_ENV.PRICING,
                params,
                newData[params.rowIndex],
                newData,
                (colId: string, loading: boolean) => {
                  tableEl.current.setLoadings(params.rowId, colId, loading);
                },
                tableEl.current.setLoadingsByRow,
                (colId: string, newVal: IFormField) => {
                  setTableData(pre => {
                    return pre.map(item => {
                      if (item[LEG_ID_FIELD] === params.rowId) {
                        return {
                          ...item,
                          [colId]: newVal,
                        };
                      }
                      return item;
                    });
                  });
                },
                setTableData
              );
            }
            return newData;
          });
        }}
        onCellEditingChanged={params => {
          fetchDefaultPricingEnvData(params.record);
        }}
        dataSource={tableData}
        getContextMenu={params => {
          const { record } = params;
          if (record[TOTAL_FIELD]) {
            return null;
          }

          return (
            <Menu
              onClick={event => {
                if (event.key === 'copy') {
                  setTableData(pre => {
                    const next = insert(pre, params.rowIndex, {
                      ..._.cloneDeep(params.record),
                      [LEG_ID_FIELD]: uuid(),
                    });
                    return next;
                  });
                }
                if (event.key === 'remove') {
                  setTableData(pre => {
                    const next = remove(pre, params.rowIndex);
                    return next;
                  });
                }
              }}
            >
              <Menu.Item key="copy">复制</Menu.Item>
              <Menu.Item key="remove">删除</Menu.Item>
            </Menu>
          );
        }}
      />
    </Page>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
    tradeManagementBookEditPageData: state.tradeManagementBookEdit,
  }))(TradeManagementBooking)
);
