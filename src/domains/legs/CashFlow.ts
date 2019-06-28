import _ from 'lodash';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import {
  ASSET_CLASS_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  PAYMENT_STATE_TYPE_MAP,
  TRADESCOLDEFS_LEG_FIELDS,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import {
  GENERAL_COMPUTED_FIELDS,
  LEG_ENV,
  TOTAL_EDITING_FIELDS,
  CASH_TOTAL_EDITING_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { getMoment } from '@/tools';
import { ILeg } from '@/types/leg';
import { LEG_FIELD } from '../../constants/common';
import { Currency } from '../../containers/legFields/Currency';
import { IsAnnual } from '../../containers/legFields/IsAnnual';
import { PaymentAmount } from '../../containers/legFields/PaymentAmount';
import { PaymentDate } from '../../containers/legFields/PaymentDate';
import { PaymentDirection } from '../../containers/legFields/PaymentDirection';
import { PaymentState } from '../../containers/legFields/PaymentState';
import { commonLinkage } from '../common';
import { legPipeLine } from '../_utils';

export const CashFlow: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.CASH_FLOW],
  type: LEG_TYPE_MAP.CASH_FLOW,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        PaymentAmount,
        PaymentDate,
        PaymentDirection,
        PaymentState,
        Currency,
        ...GENERAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        IsAnnual,
        PaymentAmount,
        PaymentDate,
        PaymentDirection,
        PaymentState,
        Currency,
        ...CASH_TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [IsAnnual, PaymentAmount, PaymentDate, PaymentDirection, PaymentState, Currency];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env =>
    Form2.createFields({
      [IsAnnual.dataIndex]: false,
      [LEG_FIELD.CURRENCY]: UNIT_ENUM_MAP.CNY,
      [LEG_FIELD.PAYMENT_STATE]: PAYMENT_STATE_TYPE_MAP.UNPAID,
    }),
  getPosition: (env: string, dataItem: any, baseInfo: any) => {
    const nextPosition: any = {};
    const COMPUTED_FIELDS = [
      LEG_FIELD.PAYMENT_DATE,
      LEG_FIELD.UNIT,
      LEG_FIELD.TRADE_NUMBER,
      LEG_FIELD.TERM,
      LEG_FIELD.PREMIUM,
    ];
    nextPosition.productType = LEG_TYPE_MAP.CASH_FLOW;
    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.IS_ANNUAL,
      ...COMPUTED_FIELDS,
      ...TRADESCOLDEFS_LEG_FIELDS,
    ]);

    nextPosition.asset.settlementDate =
      dataItem[LEG_FIELD.PAYMENT_DATE] &&
      getMoment(dataItem[LEG_FIELD.PAYMENT_DATE]).format('YYYY-MM-DD');
    return nextPosition;
  },
  getPageData: (env: string, position: any) =>
    Form2.createFields({
      [LEG_FIELD.IS_ANNUAL]: false,
      [LEG_FIELD.PAYMENT_DATE]: getMoment(position.asset[LEG_FIELD.SETTLEMENT_DATE]),
    }),
  onDataChange: (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoading: (colId: string, loading: boolean) => void,
    setLoading: (rowId: string, colId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: IFormField) => void,
    setTableData: (newData: ITableData[]) => void,
  ) => {
    commonLinkage(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData,
    );
  },
});
