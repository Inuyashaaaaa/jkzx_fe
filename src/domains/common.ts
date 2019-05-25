import {
  BIG_NUMBER_CONFIG,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
} from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { Form2 } from '@/containers';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import { mktInstrumentInfo, mktQuotesListPaged } from '@/services/market-data-service';
import { getLegByRecord, getMoment } from '@/tools';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { ILeg } from '@/types/leg';

const fetchUnderlyerMultiplierAndUnit = _.debounce(
  (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoading: (colId: string, loading: boolean) => void,
    setLoading: (rowId: string, colId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: IFormField) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    const instrumentId = _.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value']);

    const curLegHasUnitField = !!getLegByRecord(record)
      .getColumns(env)
      .find(col => col.dataIndex === LEG_FIELD.UNIT);

    setColLoading(LEG_FIELD.UNDERLYER_MULTIPLIER, true);
    setColLoading(LEG_FIELD.UNIT, true);
    mktInstrumentInfo({
      instrumentId,
    })
      .then(rsp => {
        const multiplier =
          rsp.error || rsp.data.instrumentInfo.multiplier === undefined
            ? 1
            : new BigNumber(rsp.data.instrumentInfo.multiplier)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber();
        const unit =
          rsp.error || rsp.data.instrumentInfo.unit === undefined
            ? '-'
            : rsp.data.instrumentInfo.unit;
        return { multiplier, unit };
      })
      .then(val => {
        setColValue(LEG_FIELD.UNDERLYER_MULTIPLIER, Form2.createField(val.multiplier));

        if (curLegHasUnitField) {
          setColValue(LEG_FIELD.UNIT, Form2.createField(val.unit));
        }
      })
      .finally(() => {
        setColLoading(LEG_FIELD.UNDERLYER_MULTIPLIER, false);
        if (curLegHasUnitField) {
          setColLoading(LEG_FIELD.UNIT, false);
        }
      });
  },
  50
);

const fetchInitialSpot = _.debounce(
  (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoading: (colId: string, loading: boolean) => void,
    setLoading: (rowId: string, colId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: IFormField) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    const instrumentId = _.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value']);

    setColLoading(LEG_FIELD.INITIAL_SPOT, true);
    mktQuotesListPaged({
      instrumentIds: [instrumentId],
    })
      .then(rsp => {
        if (rsp.error) return undefined;
        return new BigNumber(
          _.chain(rsp)
            .get('data.page[0]')
            .omitBy(_.isNull)
            .get('last', 1)
            .value()
        )
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber();
      })
      .then(val => {
        const initialSpot = Form2.createField(val);

        setColValue(LEG_FIELD.INITIAL_SPOT, initialSpot);
        if (env === LEG_ENV.PRICING) {
          setColValue(TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE, initialSpot);
        }
      })
      .finally(() => {
        setColLoading(LEG_FIELD.INITIAL_SPOT, false);
      });
  },
  50
);

const computedTradeNumber = (
  env: string,
  changeFieldsParams: ITableTriggerCellFieldsChangeParams,
  record: ITableData,
  tableData: ITableData[],
  setColLoading: (colId: string, loading: boolean) => void,
  setLoading: (rowId: string, colId: string, loading: boolean) => void,
  setColValue: (colId: string, newVal: IFormField) => void,
  setTableData: (newData: ITableData[]) => void
) => {
  const notionalAmountType = Form2.getFieldValue(record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE]);
  const notionalAmount = Form2.getFieldValue(record[LEG_FIELD.NOTIONAL_AMOUNT]);
  const multipler = Form2.getFieldValue(record[LEG_FIELD.UNDERLYER_MULTIPLIER]);
  const initialSpotVal = Form2.getFieldValue(record[LEG_FIELD.INITIAL_SPOT]);
  const notional =
    notionalAmountType === 'LOT'
      ? notionalAmount
      : new BigNumber(notionalAmount).div(initialSpotVal).toNumber();

  record[LEG_FIELD.TRADE_NUMBER] = Form2.createField(
    new BigNumber(notional)
      .multipliedBy(multipler)
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber()
  );
};

export const commonLinkage = (
  env: string,
  changeFieldsParams: ITableTriggerCellFieldsChangeParams,
  record: ITableData,
  tableData: ITableData[],
  setColLoading: (colId: string, loading: boolean) => void,
  setLoading: (rowId: string, colId: string, loading: boolean) => void,
  setColValue: (colId: string, newVal: IFormField) => void,
  setTableData: (newData: ITableData[]) => void
) => {
  const { changedFields } = changeFieldsParams;
  if (Form2.fieldValueIsChange(LEG_FIELD.UNDERLYER_INSTRUMENT_ID, changedFields)) {
    fetchUnderlyerMultiplierAndUnit(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData
    );
  }

  if (Form2.fieldValueIsChange(LEG_FIELD.UNDERLYER_INSTRUMENT_ID, changedFields)) {
    fetchInitialSpot(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData
    );
  }

  if (
    Form2.fieldValueIsChange(LEG_FIELD.TERM, changedFields) ||
    Form2.fieldValueIsChange(LEG_FIELD.EFFECTIVE_DATE, changedFields)
  ) {
    const term = Form2.getFieldValue(record[LEG_FIELD.TERM]);
    const effectiveDate = Form2.getFieldValue(record[LEG_FIELD.EFFECTIVE_DATE]);
    if (term !== undefined && effectiveDate !== undefined) {
      record[LEG_FIELD.EXPIRATION_DATE] = Form2.createField(
        getMoment(effectiveDate, true).add(term, 'days')
      );
      record[LEG_FIELD.SETTLEMENT_DATE] = Form2.createField(
        getMoment(effectiveDate, true).add(term, 'days')
      );
    }
  }

  if (Form2.fieldValueIsChange(LEG_FIELD.EXPIRATION_DATE, changedFields)) {
    const expirationDate = Form2.getFieldValue(record[LEG_FIELD.EXPIRATION_DATE]);
    if (expirationDate !== undefined) {
      record[LEG_FIELD.SETTLEMENT_DATE] = Form2.createField(getMoment(expirationDate, true));
    }
  }

  if (
    Form2.fieldValueIsChange(LEG_FIELD.NOTIONAL_AMOUNT, changedFields) ||
    Form2.fieldValueIsChange(LEG_FIELD.NOTIONAL_AMOUNT_TYPE, changedFields)
  ) {
    if (
      record[LEG_FIELD.INITIAL_SPOT] &&
      record[LEG_FIELD.UNDERLYER_MULTIPLIER] &&
      record[LEG_FIELD.NOTIONAL_AMOUNT]
    ) {
      computedTradeNumber(
        env,
        changeFieldsParams,
        record,
        tableData,
        setColLoading,
        setLoading,
        setColValue,
        setTableData
      );
    }
  }

  if (
    Form2.fieldValueIsChange(LEG_FIELD.PREMIUM, changedFields) ||
    Form2.fieldValueIsChange(LEG_FIELD.MINIMUM_PREMIUM, changedFields)
  ) {
    const permium = Form2.getFieldValue(record[LEG_FIELD.PREMIUM], 0);
    const miniumPermium = Form2.getFieldValue(record[LEG_FIELD.MINIMUM_PREMIUM], 0);
    record[LEG_FIELD.FRONT_PREMIUM] = Form2.createField(
      new BigNumber(miniumPermium)
        .plus(permium)
        .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
        .toNumber()
    );
  }

  if (Form2.fieldValueIsChange(LEG_FIELD.PREMIUM_TYPE, changedFields)) {
    const permiumType = Form2.getFieldValue(record[LEG_FIELD.PREMIUM_TYPE]);
    record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] =
      permiumType === PREMIUM_TYPE_MAP.PERCENT
        ? Form2.createField(NOTIONAL_AMOUNT_TYPE_MAP.CNY)
        : Form2.createField(NOTIONAL_AMOUNT_TYPE_MAP.LOT);
  }

  if (Form2.fieldValueIsChange(LEG_FIELD.IS_ANNUAL, changedFields)) {
    const isAnnual = Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL]);
    record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] = Form2.createField(
      isAnnual ? NOTIONAL_AMOUNT_TYPE_MAP.CNY : NOTIONAL_AMOUNT_TYPE_MAP.LOT
    );
  }

  if (env === LEG_ENV.PRICING) {
    if (!Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL])) {
      if (Form2.fieldValueIsChange(LEG_FIELD.EXPIRATION_DATE, changedFields)) {
        record[LEG_FIELD.TERM] = Form2.createField(
          getMoment(Form2.getFieldValue(record[LEG_FIELD.EXPIRATION_DATE])).diff(
            getMoment(Form2.getFieldValue(record[LEG_FIELD.EFFECTIVE_DATE])),
            'days'
          )
        );
      }
    }

    if (Form2.fieldValueIsChange(LEG_FIELD.INITIAL_SPOT, changedFields)) {
      const initialSpot = Form2.getFieldValue(record[LEG_FIELD.INITIAL_SPOT]);
      record[TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE] = Form2.createField(initialSpot);
    }
  }
  if (Form2.fieldValueIsChange(LEG_FIELD.INITIAL_SPOT, changedFields)) {
    if (record[LEG_FIELD.NOTIONAL_AMOUNT] && record[LEG_FIELD.UNDERLYER_MULTIPLIER]) {
      computedTradeNumber(
        env,
        changeFieldsParams,
        record,
        tableData,
        setColLoading,
        setLoading,
        setColValue,
        setTableData
      );
    }
  }
};

export const commonGetPosition = (leg: ILeg) => {
  return leg;
};
