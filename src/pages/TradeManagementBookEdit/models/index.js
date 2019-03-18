/* eslint-disable no-param-reassign */
import { delay } from '@/lib/utils';
import { allLeg } from '@/constants/leg';
import { createDataSourceItem } from '@/lib/components/_MultiLeg';

// const localKey = 'bookEdit-local';

// const localData = JSON.parse(localStorage.getItem(localKey) || null);

export default {
  namespace: 'bookEdit',

  state: {
    panel: null,
  },

  effects: {
    // eslint-disable-next-line
    *saveBook({ payload }, { call, put, select }) {
      yield delay(1000);
      return true;
    },

    // eslint-disable-next-line
    *fetchBook({ payload: values }, { call, put, select }) {
      yield delay(1000);
      yield put({
        type: 'fetchBookSuccess',
      });
      return true;
    },
  },

  reducers: {
    addRow(state, { payload }) {
      const { type } = payload;
      const [leg] = allLeg.filter(item => item.type === type);
      state.panel.dataSource.push(
        createDataSourceItem({
          title: leg.type + `${Math.random() * 100}`.slice(0, 2),
          leg,
        })
      );
    },

    changeDataSourceItem(state, { payload }) {
      state.panel.dataSource = state.panel.dataSource.map(item => {
        if (item.id === payload.id) {
          return payload;
        }
        return item;
      });
    },

    changeDataSource(state, { payload }) {
      const { dataSource } = payload;
      state.panel.dataSource = dataSource;
    },

    // 修改 panel 下 formData
    changeCommonForm(state, { payload }) {
      const { field } = payload;
      const { name, value } = field;
      state.panel.formData[name] = value;
    },

    fetchBookSuccess(state) {
      state.panel = {
        name: '3102.',
        id: '1536228988983',
        dataSource: [
          {
            $title: '双鲨 - 非年化38',
            $type: '双鲨 - 非年化',
            $types: ['双鲨 - 非年化'],
            data: {
              instrument_id: '0',
              initial_spot: 123,
              strike_low: 123,
              strike_low_percent: '100.00',
              barrier_low: 123,
              barrier_low_percent: '100.00',
              rebate_low: 123,
              strike_high: 123,
              strike_high_percent: '100.00',
              barrier_high: 123123123,
              barrier_high_percent: '100100100.00',
              rebate_high: 123123,
              num_trade_days: 123,
              multiplier: '5',
              notional: 123,
              num_of_options: '1.00',
              num_of_underlyer_contracts: '0.20',
              premium: 123123,
              premium_percent: '100100.00',
              direction: 'buy',
            },
            id: '1536228988985',
          },
        ],
        formData: {},
      };
    },

    // generateBookSuccess(state, { payload }) {
    //   const { formData, curPanelId } = payload;
    //   // const curPanel = selectCurPanelScope(state, curPanelId);
    //   state.panels = state.panels.filter(item => item.id !== curPanelId);
    // },
  },
};
