import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import {
  ASSET_CLASS_MAP,
  EXERCISETYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  LEG_TYPE_FIELD,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  GENERAL_COMPUTED_FIELDS,
  TOTAL_COMPUTED_FIELDS,
  TOTAL_EDITING_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { getMoment, getCurDateMoment } from '@/tools';
import { ILeg } from '@/types/leg';
import _ from 'lodash';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../../constants/common';
import { commonLinkage, inline } from '../common';
import { Direction } from '../../containers/legFields';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
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
import { legPipeLine } from '../_utils';
import { Weight } from '../../containers/legFields/Weight';
import { Cega } from '../../containers/legFields/computed/Cega';

export const SpreadEuropean: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.SPREAD_EUROPEAN],
  type: LEG_TYPE_MAP.SPREAD_EUROPEAN,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        Direction,
        NotionalAmountType,
        InitialSpot,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        OptionType,
        StrikeType,
        EffectiveDate,
        Strike,
        Term,
        ExpirationDate,
        ParticipationRate,
        NotionalAmount,
        SpecifiedPrice,
        Weight,
        ...TOTAL_TRADESCOL_FIELDS,
        ...TOTAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        StrikeType,
        Strike,
        Term,
        EffectiveDate,
        ExpirationDate,
        SpecifiedPrice,
        DaysInYear,
        SettlementDate,
        ParticipationRate,
        NotionalAmountType,
        NotionalAmount,
        PremiumType,
        Premium,
        MinimumPremium,
        FrontPremium,
        Weight,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        StrikeType,
        Strike,
        Term,
        EffectiveDate,
        ExpirationDate,
        SpecifiedPrice,
        DaysInYear,
        SettlementDate,
        ParticipationRate,
        NotionalAmountType,
        NotionalAmount,
        PremiumType,
        Premium,
        MinimumPremium,
        FrontPremium,
        Weight,
        // DynamicUnderlyer,
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
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      ...(env === LEG_ENV.PRICING
        ? {
            // [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
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
      'tradeNumber',
      'underlyerInstrumentId',
      'underlyerMultiplier',
      'initialSpot',
      'weight',
    ];

    const constituents = dataItem[LEG_FIELD.UNDERLYER_INSTRUMENT_ID].map(item => {
      return _.omit(item, 'name');
    });

    nextPosition.productType = LEG_TYPE_MAP.SPREAD_EUROPEAN;
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

    nextPosition.asset.constituents = constituents;
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate &&
      getMoment(nextPosition.asset.effectiveDate).format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate &&
      getMoment(nextPosition.asset.expirationDate).format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate &&
      getMoment(nextPosition.asset.settlementDate).format('YYYY-MM-DD');

    nextPosition.asset.annualized = true;
    return nextPosition;
  },
  getPageData: (env: string, position: any) => {
    if (position.asset.constituents) {
      const values = position.asset.constituents.map((item, index) => {
        return {
          ...item,
          name: '标的物' + (index + 1),
        };
      });

      return Form2.createFields({
        [LEG_FIELD.UNDERLYER_INSTRUMENT_ID]: values,
        [LEG_FIELD.UNDERLYER_MULTIPLIER]: values,
        [LEG_FIELD.INITIAL_SPOT]: values,
        [LEG_FIELD.WEIGHT]: values,
      });
    }
    const value = [
      _.mapKeys(
        _.pick(position.asset, [
          'underlyerInstrumentId1',
          'underlyerMultiplier1',
          'initialSpot1',
          'weight1',
        ]),
        (value, key) => {
          return key.substr(0, key.length - 1);
        }
      ),
      _.mapKeys(
        _.pick(position.asset, [
          'underlyerInstrumentId2',
          'underlyerMultiplier2',
          'initialSpot2',
          'weight2',
        ]),
        (value, key) => {
          return key.substr(0, key.length - 1);
        }
      ),
    ].map((item, index) => {
      return {
        ...item,
        name: '标的物' + (index + 1),
      };
    });
    return Form2.createFields({
      [LEG_FIELD.UNDERLYER_INSTRUMENT_ID]: value,
      [LEG_FIELD.UNDERLYER_MULTIPLIER]: value,
      [LEG_FIELD.INITIAL_SPOT]: value,
      [LEG_FIELD.WEIGHT]: value,
    });
  },
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
    const { changedFields } = changeFieldsParams;

    if (Form2.fieldValueIsChange(LEG_FIELD.UNDERLYER_INSTRUMENT_ID, changedFields)) {
      if (record[LEG_TYPE_FIELD].includes('SPREAD_EUROPEAN')) {
        const value = _.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value']);
        record[LEG_FIELD.INITIAL_SPOT] = Form2.createField(value);
        record[LEG_FIELD.WEIGHT] = Form2.createField(value);
        record[LEG_FIELD.UNDERLYER_MULTIPLIER] = Form2.createField(value);
      }
    }

    inline(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData
    );
  },
});
