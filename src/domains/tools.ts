import {
  BIG_NUMBER_CONFIG,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
} from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import { LEG_ENV } from '@/constants/legs';
import { Form2 } from '@/design/components';
import {
  IFormField,
  ITableData,
  ITableTriggerCellFieldsChangeParams,
} from '@/design/components/type';
import { mktInstrumentInfo, mktQuotesListPaged } from '@/services/market-data-service';
import { legEnvIsPricing } from '@/tools';
import { getMoment } from '@/utils';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

const fetchUnderlyerMultiplier = _.debounce(
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

    setColLoading(LEG_FIELD.UNDERLYER_MULTIPLIER, true);
    mktInstrumentInfo({
      instrumentId,
    })
      .then(rsp => {
        if (rsp.error || undefined === rsp.data.instrumentInfo.multiplier) return 1;
        return new BigNumber(rsp.data.instrumentInfo.multiplier)
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber();
      })
      .then(val => {
        setColValue(LEG_FIELD.UNDERLYER_MULTIPLIER, Form2.createField(val));
      })
      .finally(() => {
        setColLoading(LEG_FIELD.UNDERLYER_MULTIPLIER, false);
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
    fetchUnderlyerMultiplier(
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
          getMoment(
            Form2.getFieldValue(Form2.fieldValueIsChange(LEG_FIELD.EXPIRATION_DATE, changedFields))
          ).diff(getMoment(Form2.getFieldValue(record[LEG_FIELD.EFFECTIVE_DATE])), 'days')
        );
      }
    }

    if (Form2.fieldValueIsChange(LEG_FIELD.INITIAL_SPOT, changedFields)) {
      const initialSpot = Form2.getFieldValue(record[LEG_FIELD.INITIAL_SPOT]);
      record[TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE] = Form2.createField(initialSpot);
    }
  }
};
