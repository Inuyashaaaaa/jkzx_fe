import _ from 'lodash';
import moment from 'moment';
import { getMoment, getCurDateMoment } from '@/tools';
import {
  ASSET_CLASS_MAP,
  EXERCISETYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  PAYMENT_TYPE_MAP,
  OBSERVATION_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  GENERAL_COMPUTED_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
  TOTAL_EDITING_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import { ILeg } from '@/types/leg';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../../constants/common';
import { Direction } from '../../containers/legFields';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
import { AlUnwindNotionalAmount } from '../../containers/legFields/infos/AlUnwindNotionalAmount';
import { InitialNotionalAmount } from '../../containers/legFields/infos/InitialNotionalAmount';
import { LcmEventType } from '../../containers/legFields/infos/LcmEventType';
import { PositionId } from '../../containers/legFields/infos/PositionId';
import { InitialSpot } from '../../containers/legFields/InitialSpot';
import { IsAnnual } from '../../containers/legFields/IsAnnual';
import { MinimumPremium } from '../../containers/legFields/MinimumPremium';
import { NotionalAmount } from '../../containers/legFields/NotionalAmount';
import { NotionalAmountType } from '../../containers/legFields/NotionalAmountType';
import { OptionType } from '../../containers/legFields/OptionType';
import { ParticipationRate } from '../../containers/legFields/ParticipationRate';
import { Premium } from '../../containers/legFields/Premium';
import { PremiumType } from '../../containers/legFields/PremiumType';
import { SettlementDate } from '../../containers/legFields/SettlementDate';
import { SpecifiedPrice } from '../../containers/legFields/SpecifiedPrice';
import { Strike } from '../../containers/legFields/Strike';
import { StrikeType } from '../../containers/legFields/StrikeType';
import { Term } from '../../containers/legFields/Term';
import { UnderlyerInstrumentId } from '../../containers/legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../../containers/legFields/UnderlyerMultiplier';
import { commonLinkage } from '../common';
import { PaymentType } from '../../containers/legFields/PaymentType';
import { Payment } from '../../containers/legFields/Payment';
import { RebateType } from '../../containers/legFields/RebateType';
import { ObservationType } from '../../containers/legFields/ObservationType';
import { Unit } from '../../containers/legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../../containers/legFields/TradeNumber';

export const DigitalLegEuropean: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.DIGITAL_EUROPEAN],
  type: LEG_TYPE_MAP.DIGITAL_EUROPEAN,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        NotionalAmountType,
        EffectiveDate,
        StrikeType,
        InitialSpot,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        OptionType,
        Strike,
        Term,
        ExpirationDate,
        Payment,
        ParticipationRate,
        NotionalAmount,
        ObservationType,
        TradeNumber,
        ...TOTAL_TRADESCOL_FIELDS,
        ...GENERAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        IsAnnual,
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        StrikeType,
        Strike,
        Term,
        SpecifiedPrice,
        SettlementDate,
        DaysInYear,
        ParticipationRate,
        NotionalAmountType,
        NotionalAmount,
        PaymentType,
        Payment,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        ExpirationDate,
        // ExpirationTime,
        EffectiveDate,
        ObservationType,
        RebateType,
        Unit,
        TradeNumber,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        IsAnnual,
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        StrikeType,
        Strike,
        Term,
        SpecifiedPrice,
        SettlementDate,
        DaysInYear,
        ParticipationRate,
        NotionalAmountType,
        NotionalAmount,
        PaymentType,
        Payment,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        ExpirationDate,
        EffectiveDate,
        ObservationType,
        RebateType,
        Unit,
        TradeNumber,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    const curDateMoment = getCurDateMoment();
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [IsAnnual.dataIndex]: true,
      [LEG_FIELD.EXPIRATION_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: curDateMoment.clone(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.MINIMUM_PREMIUM]: 0,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      ...(env === LEG_ENV.PRICING
        ? {
            [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : null),
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.OBSERVATION_TYPE]: OBSERVATION_TYPE_MAP.TERMINAL,
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
      'tradeNumber',
    ];

    nextPosition.productType = LEG_TYPE_MAP.DIGITAL;
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

    nextPosition.asset.exerciseType = EXERCISETYPE_MAP.EUROPEAN;
    nextPosition.asset.annualized = !!dataItem[LEG_FIELD.IS_ANNUAL];

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
