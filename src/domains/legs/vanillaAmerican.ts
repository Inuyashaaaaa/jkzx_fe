import {
  ASSET_CLASS_MAP,
  BIG_NUMBER_CONFIG,
  EXERCISETYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
} from '@/constants/common';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM } from '@/constants/legColDefs';
import { LEG_ENV } from '@/constants/legs';
import { Form2 } from '@/design/components';
import { ITableData, ITableTriggerCellFieldsChangeParams } from '@/design/components/type';
import { delay } from '@/design/utils';
import { mktInstrumentInfo, mktQuotesListPaged } from '@/services/market-data-service';
import { ILeg } from '@/types/leg';
import { getMoment } from '@/utils';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../../constants/common';
import { Direction } from '../legFields';
import { DaysInYear } from '../legFields/DaysInYear';
import { EffectiveDate } from '../legFields/EffectiveDate';
import { ExpirationDate } from '../legFields/ExpirationDate';
import { FrontPremium } from '../legFields/FrontPremium';
import { InitialSpot } from '../legFields/InitialSpot';
import { IsAnnual } from '../legFields/IsAnnual';
import { MinimumPremium } from '../legFields/MinimumPremium';
import { NotionalAmount } from '../legFields/NotionalAmount';
import { NotionalAmountType } from '../legFields/NotionalAmountType';
import { OptionType } from '../legFields/OptionType';
import { ParticipationRate } from '../legFields/ParticipationRate';
import { Premium } from '../legFields/Premium';
import { PremiumType } from '../legFields/PremiumType';
import { SettlementDate } from '../legFields/SettlementDate';
import { SpecifiedPrice } from '../legFields/SpecifiedPrice';
import { Strike } from '../legFields/Strike';
import { StrikeType } from '../legFields/StrikeType';
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';

const fetchUnderlyerMultiplier = _.debounce(
  (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoadings: (colId: string, loading: boolean) => void,
    setLoadings: (colId: string, rowId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: ITableData) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    const instrumentId = _.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value']);

    setColLoadings(LEG_FIELD.UNDERLYER_MULTIPLIER, true);
    delay(100).then(() => {
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
          setColLoadings(LEG_FIELD.UNDERLYER_MULTIPLIER, false);
        });
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
    setColLoadings: (colId: string, loading: boolean) => void,
    setLoadings: (colId: string, rowId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: ITableData) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    const instrumentId = _.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value']);

    setColLoadings(LEG_FIELD.INITIAL_SPOT, true);
    delay(100).then(() => {
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
          setColLoadings(LEG_FIELD.INITIAL_SPOT, false);
          setColValue(LEG_FIELD.INITIAL_SPOT, Form2.createField(val));
        })
        .finally(() => {
          setColLoadings(LEG_FIELD.INITIAL_SPOT, false);
        });
    });
  },
  50
);

export const VanillaAmerican: ILeg = {
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.VANILLA_AMERICAN],
  type: LEG_TYPE_MAP.VANILLA_AMERICAN,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    return [
      Direction,
      OptionType,
      UnderlyerInstrumentId,
      UnderlyerMultiplier,
      InitialSpot,
      ParticipationRate,
      StrikeType,
      Strike,
      Term,
      IsAnnual,
      ExpirationDate,
      SpecifiedPrice,
      EffectiveDate,
      SettlementDate,
      DaysInYear,
      PremiumType,
      Premium,
      MinimumPremium,
      FrontPremium,
      NotionalAmountType,
      NotionalAmount,
    ];
  },
  getDefaultData: env => {
    return _.mapValues(
      {
        // expirationTime: '15:00:00',
        [IsAnnual.dataIndex]: true,
        [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
        [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
        [LEG_FIELD.EFFECTIVE_DATE]: moment(),
        [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
        [LEG_FIELD.PARTICIPATION_RATE]: 100,
        [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
        [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
        [LEG_FIELD.TERM]: DEFAULT_TERM,
        [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
        [LEG_FIELD.STRIKE]: 100,
        [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
        ...(env === LEG_ENV.PRICING
          ? {
              [LEG_FIELD.TERM]: DEFAULT_TERM,
            }
          : null),
      },
      val => Form2.createField(val)
    );
  },
  getPosition: (env: string, dataItem: any, baseInfo: any) => {
    const nextPosition: any = {};
    const COMPUTED_FIELDS = [
      'numOfOptions',
      'strikePercent',
      'numOfUnderlyerContracts',
      'premiumPerUnit',
      'trigger',
      'notional',
      'premiumPercent',
    ];

    nextPosition.productType = LEG_TYPE_MAP.VANILLA_AMERICAN;
    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      ...COMPUTED_FIELDS,
      ...(dataItem[LEG_FIELD.IS_ANNUAL]
        ? []
        : [
            LEG_FIELD.TERM,
            LEG_FIELD.DAYS_IN_YEAR,
            MinimumPremium.dataIndex,
            FrontPremium.dataIndex,
          ]),
    ]);

    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

    nextPosition.asset.exerciseType = EXERCISETYPE_MAP.AMERICAN;
    nextPosition.asset.annualized = true;

    return nextPosition;
  },
  getPageData: () => {
    return {};
  },
  onDataChange: (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoadings: (colId: string, loading: boolean) => void,
    setLoadings: (colId: string, rowId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: ITableData) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    const { changedFields } = changeFieldsParams;
    if (Form2.fieldIsEffective(changedFields[LEG_FIELD.UNDERLYER_INSTRUMENT_ID])) {
      fetchUnderlyerMultiplier(
        env,
        changeFieldsParams,
        record,
        tableData,
        setColLoadings,
        setLoadings,
        setColValue,
        setTableData
      );
    }

    if (Form2.fieldIsEffective(changedFields[LEG_FIELD.UNDERLYER_INSTRUMENT_ID])) {
      fetchInitialSpot(
        env,
        changeFieldsParams,
        record,
        tableData,
        setColLoadings,
        setLoadings,
        setColValue,
        setTableData
      );
    }

    if (changedFields[LEG_FIELD.TERM] || changedFields[LEG_FIELD.EFFECTIVE_DATE]) {
      const term = _.get(record, [LEG_FIELD.TERM, 'value']);
      const effectiveDate = _.get(record, [LEG_FIELD.EFFECTIVE_DATE, 'value']);
      if (term !== undefined && effectiveDate !== undefined) {
        record[LEG_FIELD.EXPIRATION_DATE] = Form2.createField(
          getMoment(effectiveDate, true).add(term, 'days')
        );
        record[LEG_FIELD.SETTLEMENT_DATE] = Form2.createField(
          getMoment(effectiveDate, true).add(term, 'days')
        );
      }
    }

    if (changedFields[LEG_FIELD.PREMIUM] || changedFields[LEG_FIELD.MINIMUM_PREMIUM]) {
      const permium = _.get(record, [LEG_FIELD.PREMIUM, 'value'], 0);
      const miniumPermium = _.get(record, [LEG_FIELD.MINIMUM_PREMIUM, 'value'], 0);
      record[LEG_FIELD.FRONT_PREMIUM] = Form2.createField(
        new BigNumber(miniumPermium)
          .plus(permium)
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber()
      );
    }

    if (changedFields[LEG_FIELD.PREMIUM_TYPE]) {
      const permiumType = _.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']);
      record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] =
        permiumType === PREMIUM_TYPE_MAP.PERCENT
          ? Form2.createField(NOTIONAL_AMOUNT_TYPE_MAP.CNY)
          : Form2.createField(NOTIONAL_AMOUNT_TYPE_MAP.LOT);
    }
  },
};
