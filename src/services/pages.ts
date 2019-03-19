import {
  EXERCISETYPE_MAP,
  LEG_ANNUALIZED_FIELD,
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_INJECT_FIELDS,
  LEG_NAME_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  OBSERVATION_TYPE_MAP,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
  REBATETYPE_UNIT_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/legColDefs';
import { AutoCallSnowAnnual } from '@/constants/legColDefs/AutoCallSnowAnnual';
import { LEG_E2E_MAP, LEG_MAP } from '@/constants/legType';
import { IFormControl } from '@/design/components/Form/types';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

export const createLegDataSourceItem = (leg: ILegType) => {
  return {
    [LEG_ID_FIELD]: uuidv4(),
    [LEG_TYPE_FIELD]: leg.type,
    [LEG_NAME_FIELD]: leg.name,
    [LEG_ANNUALIZED_FIELD]: leg.isAnnualized,
  };
};

export const bookingTableFormControls: () => IFormControl[] = () => [
  {
    control: {
      label: '交易簿',
    },
    input: {
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await trdBookListBySimilarBookName({
          similarBookName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
    field: 'bookName',
  },
  {
    control: {
      label: '交易编号',
    },
    field: 'tradeId',
  },
  {
    control: {
      label: '交易对手',
    },
    field: 'counterPartyCode',
    input: {
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    control: {
      label: '销售',
    },
    field: 'salesCode',
    input: {
      type: 'input',
      subtype: 'show',
      hoverIcon: 'lock',
    },
  },
  {
    control: {
      label: '交易日',
    },
    field: 'tradeDate',
    input: {
      type: 'date',
      range: 'day',
    },
  },
];

export const getAddLegItem = (leg: ILegType, dataSourceItem: any, isPricing = false) => {
  const expirationDate = moment().add(DEFAULT_TERM, 'days');
  let nextDataSourceItem = {
    [LEG_FIELD.EXPIRATION_DATE]: expirationDate,
    [LEG_FIELD.SETTLEMENT_DATE]: expirationDate,
    ...dataSourceItem,
  };

  if (leg.type === LEG_TYPE_MAP.AUTO_CALL_SNOW_ANNUAL) {
    return leg.getDefault(nextDataSourceItem, isPricing);
  }

  if (
    leg.type === LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL ||
    leg.type === LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
    };
  } else if (
    leg.type === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
    leg.type === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.STRIKE]: 100,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL ||
    leg.type === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.OBSERVATION_TYPE]:
        leg.type === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL
          ? OBSERVATION_TYPE_MAP.CONTINUOUS
          : OBSERVATION_TYPE_MAP.TERMINAL,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL ||
    leg.type === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.OBSERVATION_TYPE]:
        leg.type === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL
          ? OBSERVATION_TYPE_MAP.CONTINUOUS
          : OBSERVATION_TYPE_MAP.TERMINAL,
    };
  } else if (leg.type === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_UNANNUAL) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (leg.type === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_ANNUAL) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.BARRIER_ANNUAL ||
    leg.type === LEG_TYPE_MAP.BARRIER_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.STRIKE]: 100,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_ANNUAL ||
    leg.type === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.LOW_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.HIGH_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (leg.type === LEG_TYPE_MAP.EAGLE_ANNUAL || leg.type === LEG_TYPE_MAP.EAGLE_UNANNUAL) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE1]: 100,
      [LEG_FIELD.PARTICIPATION_RATE2]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.DOUBLE_TOUCH_ANNUAL ||
    leg.type === LEG_TYPE_MAP.DOUBLE_TOUCH_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_ANNUAL ||
    leg.type === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.CONCAVA_ANNUAL ||
    leg.type === LEG_TYPE_MAP.CONCAVA_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (leg.type === LEG_TYPE_MAP.CONVEX_ANNUAL || leg.type === LEG_TYPE_MAP.CONVEX_UNANNUAL) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.DOUBLE_DIGITAL_ANNUAL ||
    leg.type === LEG_TYPE_MAP.DOUBLE_DIGITAL_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL ||
    leg.type === LEG_TYPE_MAP.TRIPLE_DIGITAL_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
    leg.type === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  } else if (
    leg.type === LEG_TYPE_MAP.STRADDLE_ANNUAL ||
    leg.type === LEG_TYPE_MAP.STRADDLE_UNANNUAL
  ) {
    nextDataSourceItem = {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.LOW_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.HIGH_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: leg.isAnnualized
        ? NOTIONAL_AMOUNT_TYPE_MAP.CNY
        : NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      ...(leg.isAnnualized
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
            [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
          }
        : undefined),
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  }

  return nextDataSourceItem;
};

export const convertTradePositions = (tableDataSource, tableFormData, isPricing = false) => {
  const positions: any[] = tableDataSource.map(dataSourceItem => {
    dataSourceItem = miniumlPercent(dataSourceItem);

    const productType = dataSourceItem[LEG_TYPE_FIELD];

    const nextPosition: any = {
      lcmEventType: 'OPEN',
      positionAccountCode: 'empty',
      positionAccountName: 'empty',
      counterPartyAccountCode: 'empty',
      counterPartyAccountName: 'empty',
      counterPartyCode: tableFormData.counterPartyCode,
      counterPartyName: tableFormData.counterPartyCode,
    };

    if (productType === LEG_TYPE_MAP.AUTO_CALL_SNOW_ANNUAL) {
      const Leg = LEG_MAP[productType];
      return Leg.getPosition(nextPosition, dataSourceItem, tableDataSource);
    }

    if (
      productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL ||
      productType === LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL ||
      productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
      productType === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL
    ) {
      const COMPUTED_FIELDS = [
        'numOfOptions',
        'strikePercent',
        'numOfUnderlyerContracts',
        'premiumPerUnit',
        'trigger',
        'notional',
        'premiumPercent',
      ];

      nextPosition.productType = getVanillaLegType(productType);
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);

      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate &&
        nextPosition.asset.effectiveDate.format('YYYY-MM-DDTHH:mm:ss');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.exerciseType = getVanillaExerciseType(productType);

      nextPosition.asset.annualized = getVanillaAnnualized(productType);

      function getVanillaLegType(productType) {
        if (
          productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
          productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL
        ) {
          return LEG_TYPE_MAP.VANILLA_EUROPEAN;
        }
        if (
          productType === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL ||
          productType === LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL
        ) {
          return LEG_TYPE_MAP.VANILLA_AMERICAN;
        }
        throw new Error('getVanillaLegType no match');
      }

      function getVanillaExerciseType(productType) {
        if (
          productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
          productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL
        ) {
          return EXERCISETYPE_MAP.EUROPEAN;
        }
        if (
          productType === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL ||
          productType === LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL
        ) {
          return EXERCISETYPE_MAP.AMERICAN;
        }
        throw new Error('getVanillaExerciseType no match');
      }

      function getVanillaAnnualized(productType) {
        if (
          productType === LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL ||
          productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL
        ) {
          return false;
        }
        if (
          productType === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL ||
          productType === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL
        ) {
          return true;
        }
        throw new Error('getVanillaAnnualized no match');
      }
    }

    if (
      productType === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL ||
      productType === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL ||
      productType === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL ||
      productType === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL
    ) {
      const COMPUTED_FIELDS = [
        'numOfOptions',
        'strikePercent',
        'numOfUnderlyerContracts',
        'premiumPerUnit',
        'trigger',
        'notional',
        'premiumPercent',
      ];

      nextPosition.productType = LEG_TYPE_MAP.DIGITAL;
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate &&
        nextPosition.asset.effectiveDate.format('YYYY-MM-DDTHH:mm:ss');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.exerciseType = getDigitalExerciseType(productType);

      nextPosition.asset.annualized = getDigitalAnnualized(productType);

      function getDigitalExerciseType(productType) {
        if (
          productType === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL ||
          productType === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL
        ) {
          return EXERCISETYPE_MAP.EUROPEAN;
        }
        if (
          productType === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL ||
          productType === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL
        ) {
          return EXERCISETYPE_MAP.AMERICAN;
        }
        throw new Error('getDigitalExerciseType no match');
      }

      function getDigitalAnnualized(productType) {
        if (
          productType === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL ||
          productType === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL
        ) {
          return true;
        }
        if (
          productType === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL ||
          productType === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL
        ) {
          return false;
        }
        throw new Error('getDigitalAnnualized no match');
      }
    }

    if (
      productType === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_UNANNUAL ||
      productType === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_ANNUAL
    ) {
      const COMPUTED_FIELDS = [
        'numOfOptions',
        'strikePercent',
        'numOfUnderlyerContracts',
        'premiumPerUnit',
        'trigger',
        'notional',
        'premiumPercent',
      ];

      nextPosition.productType = LEG_TYPE_MAP.VERTICAL_SPREAD;
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate &&
        nextPosition.asset.effectiveDate.format('YYYY-MM-DDTHH:mm:ss');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.exerciseType = EXERCISETYPE_MAP.EUROPEAN;

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_ANNUAL ? true : false;
    }

    if (
      productType === LEG_TYPE_MAP.BARRIER_UNANNUAL ||
      productType === LEG_TYPE_MAP.BARRIER_ANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.BARRIER;
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized = productType === LEG_TYPE_MAP.BARRIER_ANNUAL ? true : false;
    }

    if (
      productType === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_ANNUAL ||
      productType === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.DOUBLE_SHARK_FIN;
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_ANNUAL ? true : false;
    }

    if (productType === LEG_TYPE_MAP.EAGLE_ANNUAL || productType === LEG_TYPE_MAP.EAGLE_UNANNUAL) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.EAGLE;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');
      // nextPosition.asset.expirationTime = moment.isMoment(nextPosition.asset.expirationTime)
      //   ? nextPosition.asset.expirationTime.format('HH:mm:ss')
      //   : nextPosition.asset.expirationTime;

      nextPosition.asset.annualized = productType === LEG_TYPE_MAP.EAGLE_ANNUAL ? true : false;
    }

    if (
      productType === LEG_TYPE_MAP.DOUBLE_TOUCH_ANNUAL ||
      productType === LEG_TYPE_MAP.DOUBLE_TOUCH_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.DOUBLE_TOUCH;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');
      // nextPosition.asset.expirationTime = moment.isMoment(nextPosition.asset.expirationTime)
      //   ? nextPosition.asset.expirationTime.format('HH:mm:ss')
      //   : nextPosition.asset.expirationTime;

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.DOUBLE_TOUCH_ANNUAL ? true : false;
      nextPosition.asset.touched = true;
    }

    if (
      productType === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_ANNUAL ||
      productType === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.DOUBLE_NO_TOUCH;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_ANNUAL ? true : false;
      nextPosition.asset.touched = false;
    }

    if (
      productType === LEG_TYPE_MAP.CONCAVA_ANNUAL ||
      productType === LEG_TYPE_MAP.CONCAVA_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.CONCAVA;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized = productType === LEG_TYPE_MAP.CONCAVA_ANNUAL ? true : false;
      nextPosition.asset.concavaed = true;
    }

    if (
      productType === LEG_TYPE_MAP.CONVEX_ANNUAL ||
      productType === LEG_TYPE_MAP.CONVEX_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.CONVEX;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized = productType === LEG_TYPE_MAP.CONVEX_ANNUAL ? true : false;
      nextPosition.asset.concavaed = false;
    }

    if (
      productType === LEG_TYPE_MAP.DOUBLE_DIGITAL_ANNUAL ||
      productType === LEG_TYPE_MAP.DOUBLE_DIGITAL_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.DOUBLE_DIGITAL;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.DOUBLE_DIGITAL_ANNUAL ? true : false;
    }

    if (
      productType === LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL ||
      productType === LEG_TYPE_MAP.TRIPLE_DIGITAL_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.TRIPLE_DIGITAL;
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL ? true : false;
    }

    if (
      productType === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
      productType === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.RANGE_ACCRUALS;
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized =
        productType === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ? true : false;
    }

    if (
      productType === LEG_TYPE_MAP.STRADDLE_ANNUAL ||
      productType === LEG_TYPE_MAP.STRADDLE_UNANNUAL
    ) {
      const COMPUTED_FIELDS = [];

      nextPosition.productType = LEG_TYPE_MAP.STRADDLE;
      nextPosition.lcmEventType = 'OPEN';
      nextPosition.positionAccountCode = 'empty';
      nextPosition.positionAccountName = 'empty';
      nextPosition.counterPartyAccountCode = 'empty';
      nextPosition.counterPartyAccountName = 'empty';
      nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
      nextPosition.asset.effectiveDate =
        nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
      nextPosition.asset.expirationDate =
        nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
      nextPosition.asset.settlementDate =
        nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

      nextPosition.asset.annualized = productType === LEG_TYPE_MAP.STRADDLE_ANNUAL ? true : false;
    }

    return nextPosition;
  });

  return positions;
};

export const convertTradePageData2ApiData = (tableDataSource, tableFormData, userName) => {
  const positions: any[] = convertTradePositions(tableDataSource, tableFormData);
  const params: any = _.omit(tableFormData, ['counterPartyCode']);

  params.comment = 'empty';
  params.tradeStatus = 'LIVE';
  params.partyCode = 'empty';
  params.partyName = 'empty';
  params.salesCommission = '0';
  params.salesName = tableFormData.salesCode;
  params.salesCode = tableFormData.salesCode;
  params.positions = positions;
  params.tradeDate = params.tradeDate.format('YYYY-MM-DDTHH:mm:ss');
  params.trader = userName;

  return params;
};

export const convertTradeApiData2PageData = (apiData: any = {}) => {
  const tableFormData: any = {};
  const { positions } = apiData;

  tableFormData.salesCode = apiData.salesCode;
  tableFormData.counterPartyCode = positions[0].counterPartyCode;
  tableFormData.bookName = apiData.bookName;
  tableFormData.tradeId = apiData.tradeId;
  tableFormData.salesCode = apiData.salesCode;
  tableFormData.tradeDate = apiData.tradeDate;

  const tableDataSource = positions.map(position => {
    if (position.productType === LEG_TYPE_MAP.AUTO_CALL_SNOW) {
      const productType = position.productType;
      const Leg = LEG_MAP[LEG_E2E_MAP[productType]];

      const nextPageDataItem: any = backConvertPercent({
        ..._.omitBy(position.asset, _.isNull),
        lcmEventType: position.lcmEventType,
        ...createLegDataSourceItem(Leg),
        id: position.positionId,
        productType: Leg.type,
      });

      return Leg.getPageData(nextPageDataItem, position);
    }

    const productType = position.productType;

    let nextPosition: any = {
      ..._.omitBy(position.asset, _.isNull),
      lcmEventType: position.lcmEventType,
    };

    if (productType === LEG_TYPE_MAP.CALL_SPREAD) {
      nextPosition = {
        ...nextPosition,
        productType: position.productType,
      };
    } else if (
      productType === LEG_TYPE_MAP.VANILLA_EUROPEAN ||
      productType === LEG_TYPE_MAP.VANILLA_AMERICAN
    ) {
      const _productType = getVanillaAnnualLegTypeByAnnualized(
        productType,
        position.asset.annualized
      );
      nextPosition = {
        ...nextPosition,
        productType: _productType,
        strikePercentAndNumber: position.asset.strike,
      };

      nextPosition = backConvertPercent(nextPosition);

      function getVanillaAnnualLegTypeByAnnualized(productType, isAnnualized) {
        if (productType === LEG_TYPE_MAP.VANILLA_EUROPEAN) {
          if (isAnnualized) {
            return LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL;
          } else {
            return LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL;
          }
        }
        if (productType === LEG_TYPE_MAP.VANILLA_AMERICAN) {
          if (isAnnualized) {
            return LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL;
          } else {
            return LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL;
          }
        }
        throw new Error('getVanillaAnnualLegTypeByAnnualized no match');
      }
    } else if (productType === LEG_TYPE_MAP.DIGITAL) {
      const productType = getDigitalAnnualLegTypeByAnnualized(
        position.asset.exerciseType,
        position.asset.annualized
      );
      nextPosition = {
        ...nextPosition,
        productType,
        strikePercentAndNumber: position.asset.strike,
      };

      nextPosition = backConvertPercent(nextPosition);

      function getDigitalAnnualLegTypeByAnnualized(exerciseType, isAnnualized) {
        if (exerciseType === EXERCISETYPE_MAP.EUROPEAN) {
          if (isAnnualized) {
            return LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL;
          } else {
            return LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL;
          }
        }
        if (exerciseType === EXERCISETYPE_MAP.AMERICAN) {
          if (isAnnualized) {
            return LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL;
          } else {
            return LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL;
          }
        }
        throw new Error('getDigitalAnnualLegTypeByAnnualized no match');
      }
    } else if (productType === LEG_TYPE_MAP.VERTICAL_SPREAD) {
      nextPosition = {
        ...nextPosition,
        productType: getVerticalSpreadegTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getVerticalSpreadegTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_ANNUAL;
        } else {
          return LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.BARRIER) {
      nextPosition = {
        ...nextPosition,
        productType: getBarrierTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getBarrierTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.BARRIER_ANNUAL;
        } else {
          return LEG_TYPE_MAP.BARRIER_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.DOUBLE_SHARK_FIN) {
      nextPosition = {
        ...nextPosition,
        productType: getSharkTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getSharkTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.DOUBLE_SHARK_FIN_ANNUAL;
        } else {
          return LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.EAGLE) {
      nextPosition = {
        ...nextPosition,
        productType: getEagleTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getEagleTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.EAGLE_ANNUAL;
        } else {
          return LEG_TYPE_MAP.EAGLE_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.DOUBLE_TOUCH) {
      nextPosition = {
        ...nextPosition,
        productType: getTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.DOUBLE_TOUCH_ANNUAL;
        } else {
          return LEG_TYPE_MAP.DOUBLE_TOUCH_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.DOUBLE_NO_TOUCH) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.DOUBLE_NO_TOUCH_ANNUAL;
        } else {
          return LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.CONCAVA) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.CONCAVA_ANNUAL;
        } else {
          return LEG_TYPE_MAP.CONCAVA_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.CONVEX) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.CONVEX_ANNUAL;
        } else {
          return LEG_TYPE_MAP.CONVEX_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.DOUBLE_DIGITAL) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.DOUBLE_DIGITAL_ANNUAL;
        } else {
          return LEG_TYPE_MAP.DOUBLE_DIGITAL_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.TRIPLE_DIGITAL) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL;
        } else {
          return LEG_TYPE_MAP.TRIPLE_DIGITAL_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.RANGE_ACCRUALS) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL;
        } else {
          return LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL;
        }
      }
    } else if (productType === LEG_TYPE_MAP.STRADDLE) {
      nextPosition = {
        ...nextPosition,
        productType: getNoTouchTypeByAnnualized(position.asset.annualized),
      };

      nextPosition = backConvertPercent(nextPosition);

      function getNoTouchTypeByAnnualized(isAnnualized) {
        if (isAnnualized) {
          return LEG_TYPE_MAP.STRADDLE_ANNUAL;
        } else {
          return LEG_TYPE_MAP.STRADDLE_UNANNUAL;
        }
      }
    }

    nextPosition = {
      ...nextPosition,
      ...createLegDataSourceItem(LEG_MAP[nextPosition.productType]),
      id: position.positionId,
    };

    return nextPosition;
  });

  return {
    tableDataSource,
    tableFormData,
  };
};

function miniumlPercent(item) {
  const clone = { ...item };

  if (clone[LEG_FIELD.UP_BARRIER_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.UP_BARRIER] !== undefined) {
      clone[LEG_FIELD.UP_BARRIER] = new BigNumber(clone[LEG_FIELD.UP_BARRIER])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.COUPON_PAYMENT] !== undefined) {
    clone[LEG_FIELD.COUPON_PAYMENT] = new BigNumber(clone[LEG_FIELD.COUPON_PAYMENT])
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.STEP] !== undefined) {
    clone[LEG_FIELD.STEP] = new BigNumber(clone[LEG_FIELD.STEP]).multipliedBy(0.01).toNumber();
  }

  if (clone[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
    if (clone[LEG_FIELD.STRIKE] !== undefined) {
      clone[LEG_FIELD.STRIKE] = new BigNumber(clone[LEG_FIELD.STRIKE])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.LOW_STRIKE] !== undefined) {
      clone[LEG_FIELD.LOW_STRIKE] = new BigNumber(clone[LEG_FIELD.LOW_STRIKE])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.HIGH_STRIKE] !== undefined) {
      clone[LEG_FIELD.HIGH_STRIKE] = new BigNumber(clone[LEG_FIELD.HIGH_STRIKE])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE1] !== undefined) {
      clone[LEG_FIELD.STRIKE1] = new BigNumber(clone[LEG_FIELD.STRIKE1])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE2] !== undefined) {
      clone[LEG_FIELD.STRIKE2] = new BigNumber(clone[LEG_FIELD.STRIKE2])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE3] !== undefined) {
      clone[LEG_FIELD.STRIKE3] = new BigNumber(clone[LEG_FIELD.STRIKE3])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE4] !== undefined) {
      clone[LEG_FIELD.STRIKE4] = new BigNumber(clone[LEG_FIELD.STRIKE4])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.PARTICIPATION_RATE] !== undefined) {
    clone[LEG_FIELD.PARTICIPATION_RATE] = new BigNumber(clone[LEG_FIELD.PARTICIPATION_RATE])
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.PARTICIPATION_RATE1] !== undefined) {
    clone[LEG_FIELD.PARTICIPATION_RATE1] = new BigNumber(clone[LEG_FIELD.PARTICIPATION_RATE1])
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.PARTICIPATION_RATE2] !== undefined) {
    clone[LEG_FIELD.PARTICIPATION_RATE2] = new BigNumber(clone[LEG_FIELD.PARTICIPATION_RATE2])
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.HIGH_PARTICIPATION_RATE] !== undefined) {
    clone[LEG_FIELD.HIGH_PARTICIPATION_RATE] = new BigNumber(
      clone[LEG_FIELD.HIGH_PARTICIPATION_RATE]
    )
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.LOW_PARTICIPATION_RATE] !== undefined) {
    clone[LEG_FIELD.LOW_PARTICIPATION_RATE] = new BigNumber(clone[LEG_FIELD.LOW_PARTICIPATION_RATE])
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.PERCENT) {
    if (clone[LEG_FIELD.PREMIUM] !== undefined) {
      clone[LEG_FIELD.PREMIUM] = new BigNumber(clone[LEG_FIELD.PREMIUM])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.FRONT_PREMIUM] !== undefined) {
      clone[LEG_FIELD.FRONT_PREMIUM] = new BigNumber(clone[LEG_FIELD.FRONT_PREMIUM])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.MINIMUM_PREMIUM] !== undefined) {
      clone[LEG_FIELD.MINIMUM_PREMIUM] = new BigNumber(clone[LEG_FIELD.MINIMUM_PREMIUM])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.PAYMENT_TYPE] === PAYMENT_TYPE_MAP.PERCENT) {
    if (clone[LEG_FIELD.PAYMENT] !== undefined) {
      clone[LEG_FIELD.PAYMENT] = new BigNumber(clone[LEG_FIELD.PAYMENT])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.HIGH_PAYMENT] !== undefined) {
      clone[LEG_FIELD.HIGH_PAYMENT] = new BigNumber(clone[LEG_FIELD.HIGH_PAYMENT])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.LOW_PAYMENT] !== undefined) {
      clone[LEG_FIELD.LOW_PAYMENT] = new BigNumber(clone[LEG_FIELD.LOW_PAYMENT])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.PAYMENT1] !== undefined) {
      clone[LEG_FIELD.PAYMENT1] = new BigNumber(clone[LEG_FIELD.PAYMENT1])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.PAYMENT2] !== undefined) {
      clone[LEG_FIELD.PAYMENT2] = new BigNumber(clone[LEG_FIELD.PAYMENT2])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.PAYMENT3] !== undefined) {
      clone[LEG_FIELD.PAYMENT3] = new BigNumber(clone[LEG_FIELD.PAYMENT3])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.BARRIER] !== undefined) {
      clone[LEG_FIELD.BARRIER] = new BigNumber(clone[LEG_FIELD.BARRIER])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.LOW_BARRIER] !== undefined) {
      clone[LEG_FIELD.LOW_BARRIER] = new BigNumber(clone[LEG_FIELD.LOW_BARRIER])
        .multipliedBy(0.01)
        .toNumber();
    }
    if (clone[LEG_FIELD.HIGH_BARRIER] !== undefined) {
      clone[LEG_FIELD.HIGH_BARRIER] = new BigNumber(clone[LEG_FIELD.HIGH_BARRIER])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.REBATE] !== undefined) {
    clone[LEG_FIELD.REBATE] = new BigNumber(clone[LEG_FIELD.REBATE]).multipliedBy(0.01).toNumber();
  }
  if (clone[LEG_FIELD.LOW_REBATE] !== undefined) {
    clone[LEG_FIELD.LOW_REBATE] = new BigNumber(clone[LEG_FIELD.LOW_REBATE])
      .multipliedBy(0.01)
      .toNumber();
  }
  if (clone[LEG_FIELD.HIGH_REBATE] !== undefined) {
    clone[LEG_FIELD.HIGH_REBATE] = new BigNumber(clone[LEG_FIELD.HIGH_REBATE])
      .multipliedBy(0.01)
      .toNumber();
  }

  return clone;
}

function backConvertPercent(item) {
  const clone = { ...item };

  if (clone[LEG_FIELD.UP_BARRIER_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.UP_BARRIER] !== undefined) {
      clone[LEG_FIELD.UP_BARRIER] = new BigNumber(clone[LEG_FIELD.UP_BARRIER])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.COUPON_PAYMENT] !== undefined) {
    clone[LEG_FIELD.COUPON_PAYMENT] = new BigNumber(clone[LEG_FIELD.COUPON_PAYMENT])
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.STEP] !== undefined) {
    clone[LEG_FIELD.STEP] = new BigNumber(clone[LEG_FIELD.STEP]).multipliedBy(100).toNumber();
  }

  if (clone[LEG_FIELD.PAYMENT_TYPE] === PAYMENT_TYPE_MAP.PERCENT) {
    if (clone[LEG_FIELD.PAYMENT] !== undefined) {
      clone[LEG_FIELD.PAYMENT] = new BigNumber(clone[LEG_FIELD.PAYMENT])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.HIGH_PAYMENT] !== undefined) {
      clone[LEG_FIELD.HIGH_PAYMENT] = new BigNumber(clone[LEG_FIELD.HIGH_PAYMENT])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.LOW_PAYMENT] !== undefined) {
      clone[LEG_FIELD.LOW_PAYMENT] = new BigNumber(clone[LEG_FIELD.LOW_PAYMENT])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.PAYMENT1] !== undefined) {
      clone[LEG_FIELD.PAYMENT1] = new BigNumber(clone[LEG_FIELD.PAYMENT1])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.PAYMENT2] !== undefined) {
      clone[LEG_FIELD.PAYMENT2] = new BigNumber(clone[LEG_FIELD.PAYMENT2])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.PAYMENT3] !== undefined) {
      clone[LEG_FIELD.PAYMENT3] = new BigNumber(clone[LEG_FIELD.PAYMENT3])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.PARTICIPATION_RATE1] !== undefined) {
    clone[LEG_FIELD.PARTICIPATION_RATE1] = new BigNumber(clone[LEG_FIELD.PARTICIPATION_RATE1])
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.PARTICIPATION_RATE2] !== undefined) {
    clone[LEG_FIELD.PARTICIPATION_RATE2] = new BigNumber(clone[LEG_FIELD.PARTICIPATION_RATE2])
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.HIGH_PARTICIPATION_RATE] !== undefined) {
    clone[LEG_FIELD.HIGH_PARTICIPATION_RATE] = new BigNumber(
      clone[LEG_FIELD.HIGH_PARTICIPATION_RATE]
    )
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.LOW_PARTICIPATION_RATE] !== undefined) {
    clone[LEG_FIELD.LOW_PARTICIPATION_RATE] = new BigNumber(clone[LEG_FIELD.LOW_PARTICIPATION_RATE])
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
    if (clone[LEG_FIELD.STRIKE] !== undefined) {
      clone[LEG_FIELD.STRIKE] = new BigNumber(clone[LEG_FIELD.STRIKE]).multipliedBy(100).toNumber();
    }
    if (clone[LEG_FIELD.LOW_STRIKE] !== undefined) {
      clone[LEG_FIELD.LOW_STRIKE] = new BigNumber(clone[LEG_FIELD.LOW_STRIKE])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.HIGH_STRIKE] !== undefined) {
      clone[LEG_FIELD.HIGH_STRIKE] = new BigNumber(clone[LEG_FIELD.HIGH_STRIKE])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE1] !== undefined) {
      clone[LEG_FIELD.STRIKE1] = new BigNumber(clone[LEG_FIELD.STRIKE1])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE2] !== undefined) {
      clone[LEG_FIELD.STRIKE2] = new BigNumber(clone[LEG_FIELD.STRIKE2])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE3] !== undefined) {
      clone[LEG_FIELD.STRIKE3] = new BigNumber(clone[LEG_FIELD.STRIKE3])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.STRIKE4] !== undefined) {
      clone[LEG_FIELD.STRIKE4] = new BigNumber(clone[LEG_FIELD.STRIKE4])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.PARTICIPATION_RATE] !== undefined) {
    clone[LEG_FIELD.PARTICIPATION_RATE] = new BigNumber(clone[LEG_FIELD.PARTICIPATION_RATE])
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.PERCENT) {
    if (clone[LEG_FIELD.PREMIUM] !== undefined) {
      clone[LEG_FIELD.PREMIUM] = new BigNumber(clone[LEG_FIELD.PREMIUM])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.FRONT_PREMIUM] !== undefined) {
      clone[LEG_FIELD.FRONT_PREMIUM] = new BigNumber(clone[LEG_FIELD.FRONT_PREMIUM])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.MINIMUM_PREMIUM] !== undefined) {
      clone[LEG_FIELD.MINIMUM_PREMIUM] = new BigNumber(clone[LEG_FIELD.MINIMUM_PREMIUM])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.BARRIER] !== undefined) {
      clone[LEG_FIELD.BARRIER] = new BigNumber(clone[LEG_FIELD.BARRIER])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.LOW_BARRIER] !== undefined) {
      clone[LEG_FIELD.LOW_BARRIER] = new BigNumber(clone[LEG_FIELD.LOW_BARRIER])
        .multipliedBy(100)
        .toNumber();
    }
    if (clone[LEG_FIELD.HIGH_BARRIER] !== undefined) {
      clone[LEG_FIELD.HIGH_BARRIER] = new BigNumber(clone[LEG_FIELD.HIGH_BARRIER])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.REBATE] !== undefined) {
    clone[LEG_FIELD.REBATE] = new BigNumber(clone[LEG_FIELD.REBATE]).multipliedBy(100).toNumber();
  }
  if (clone[LEG_FIELD.LOW_REBATE] !== undefined) {
    clone[LEG_FIELD.LOW_REBATE] = new BigNumber(clone[LEG_FIELD.LOW_REBATE])
      .multipliedBy(100)
      .toNumber();
  }
  if (clone[LEG_FIELD.HIGH_REBATE] !== undefined) {
    clone[LEG_FIELD.HIGH_REBATE] = new BigNumber(clone[LEG_FIELD.HIGH_REBATE])
      .multipliedBy(100)
      .toNumber();
  }
  return clone;
}
