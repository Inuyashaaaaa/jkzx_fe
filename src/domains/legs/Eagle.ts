import { getMoment } from '@/tools';
import {
  ASSET_CLASS_MAP,
  BIG_NUMBER_CONFIG,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  TOTAL_COMPUTED_FIELDS,
  TOTAL_EDITING_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/containers/type';
import { ILeg } from '@/types/leg';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
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
import { ParticipationRate1 } from '../legFields/ParticipationRate1';
import { ParticipationRate2 } from '../legFields/ParticipationRate2';
import { Premium } from '../legFields/Premium';
import { PremiumType } from '../legFields/PremiumType';
import { SettlementDate } from '../legFields/SettlementDate';
import { SpecifiedPrice } from '../legFields/SpecifiedPrice';
import { Strike1 } from '../legFields/Strike1';
import { Strike2 } from '../legFields/Strike2';
import { Strike3 } from '../legFields/Strike3';
import { Strike4 } from '../legFields/Strike4';
import { StrikeType } from '../legFields/StrikeType';
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';
import { Unit } from '../legFields/Unit';
import { commonLinkage } from '../common';
import { legPipeLine } from '../_utils';

export const Eagle: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.EAGLE],
  type: LEG_TYPE_MAP.EAGLE,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        NotionalAmountType,
        InitialSpot,
        EffectiveDate,
        StrikeType,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        Strike1,
        Strike2,
        Strike3,
        Strike4,
        Term,
        ParticipationRate1,
        ParticipationRate2,
        ExpirationDate,
        NotionalAmount,
        ...TOTAL_TRADESCOL_FIELDS,
        ...TOTAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        IsAnnual,
        Direction,
        DaysInYear,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        InitialSpot,
        SpecifiedPrice,
        SettlementDate,
        ParticipationRate1,
        ParticipationRate2,
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        StrikeType,
        Strike1,
        Strike2,
        Strike3,
        Strike4,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        Unit,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        IsAnnual,
        Direction,
        DaysInYear,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        InitialSpot,
        SpecifiedPrice,
        SettlementDate,
        ParticipationRate1,
        ParticipationRate2,
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        StrikeType,
        Strike1,
        Strike2,
        Strike3,
        Strike4,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        Unit,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [IsAnnual.dataIndex]: true,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE1]: 100,
      [LEG_FIELD.PARTICIPATION_RATE2]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      ...(env === LEG_ENV.PRICING
        ? {
            [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : null),
    });
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
      'unit',
    ];

    nextPosition.productType = LEG_TYPE_MAP.EAGLE;
    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.IS_ANNUAL,
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
      nextPosition.asset.effectiveDate &&
      getMoment(nextPosition.asset.effectiveDate).format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate &&
      getMoment(nextPosition.asset.expirationDate).format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate &&
      getMoment(nextPosition.asset.settlementDate).format('YYYY-MM-DD');

    nextPosition.asset.annualized = dataItem[LEG_FIELD.IS_ANNUAL] ? true : false;

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {},
  onDataChange: (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoading: (colId: string, loading: boolean) => void,
    setLoading: (rowId: string, colId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: IFormField) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    commonLinkage(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData
    );

    const { changedFields } = changeFieldsParams;

    if (
      changedFields[LEG_FIELD.PARTICIPATION_RATE1] ||
      changedFields[LEG_FIELD.PARTICIPATION_RATE2] ||
      changedFields[LEG_FIELD.STRIKE1] ||
      changedFields[LEG_FIELD.STRIKE2] ||
      changedFields[LEG_FIELD.STRIKE3]
    ) {
      const participationRate1 = Form2.getFieldValue(record[LEG_FIELD.PARTICIPATION_RATE1]);
      const participationRate2 = Form2.getFieldValue(record[LEG_FIELD.PARTICIPATION_RATE2]);
      const strike1 = Form2.getFieldValue(record[LEG_FIELD.STRIKE1]);
      const strike2 = Form2.getFieldValue(record[LEG_FIELD.STRIKE2]);
      const strike3 = Form2.getFieldValue(record[LEG_FIELD.STRIKE3]);

      if (participationRate1 && participationRate2 && strike1 && strike2 && strike3) {
        record[LEG_FIELD.STRIKE4] = Form2.createField(
          new BigNumber(participationRate1)
            .dividedBy(participationRate2)
            .multipliedBy(new BigNumber(strike2).minus(strike1))
            .plus(strike3)
            .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
            .toNumber()
        );
      }
    }
  },
});
