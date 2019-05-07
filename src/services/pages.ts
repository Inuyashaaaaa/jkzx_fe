import {
  LEG_ENV_FIELD,
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_NAME_FIELD,
  LEG_TYPE_FIELD,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  STRIKE_TYPES_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { uuid } from '@/design/utils';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import { getLegByType } from '@/tools';
import { ILeg } from '@/types/leg';
import { getMoment } from '@/utils';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { Form2 } from '@/design/components';

export const createLegDataSourceItem = (leg: ILeg, env: string) => {
  return {
    [LEG_ID_FIELD]: uuid(),
    [LEG_TYPE_FIELD]: leg.type,
    [LEG_NAME_FIELD]: leg.name,
    [LEG_ENV_FIELD]: env,
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

export const getAddLegItem = (leg: ILeg, dataSourceItem: any, isPricing = false) => {
  return leg.getDefault(dataSourceItem, isPricing);
};

export const convertTradePositions = (tableDataSource, tableFormData, env) => {
  const positions: any[] = tableDataSource.map(dataSourceItem => {
    dataSourceItem = miniumlPercent(dataSourceItem);
    const type = dataSourceItem[LEG_TYPE_FIELD];
    const leg = getLegByType(type);

    if (!leg) {
      throw new Error('not found Leg type');
    }

    return {
      lcmEventType: 'OPEN',
      positionAccountCode: 'empty',
      positionAccountName: 'empty',
      counterPartyAccountCode: 'empty',
      counterPartyAccountName: 'empty',
      counterPartyCode: tableFormData.counterPartyCode,
      counterPartyName: tableFormData.counterPartyCode,
      ...leg.getPosition(env, dataSourceItem, tableDataSource),
    };
  });

  return positions;
};

export const convertTradePageData2ApiData = (tableDataSource, tableFormData, userName, env) => {
  const positions: any[] = convertTradePositions(tableDataSource, tableFormData, env);
  const params: any = _.omit(tableFormData, ['counterPartyCode']);

  params.comment = 'empty';
  params.tradeStatus = 'LIVE';
  params.partyCode = 'empty';
  params.partyName = 'empty';
  params.salesCommission = '0';
  params.salesName = tableFormData.salesCode;
  params.salesCode = tableFormData.salesCode;
  params.positions = positions;
  params.tradeDate = getMoment(params.tradeDate).format('YYYY-MM-DDTHH:mm:ss');
  params.trader = userName;

  return params;
};

export const getTradeCreateModalData = (apiData: any = {}) => {
  const tableFormData: any = {};
  const { positions } = apiData;

  tableFormData.salesCode = apiData.salesCode;
  tableFormData.counterPartyCode = _.get(positions, '[0].counterPartyCode');
  tableFormData.bookName = apiData.bookName;
  tableFormData.tradeId = apiData.tradeId;
  tableFormData.salesCode = apiData.salesCode;
  tableFormData.tradeDate = apiData.tradeDate;

  return tableFormData;
};

function miniumlPercent(item) {
  const clone = { ...item };

  if (clone[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] !== undefined) {
    clone[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] = new BigNumber(
      clone[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM]
    )
      .multipliedBy(0.01)
      .toNumber();
  }

  if (clone[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.AUTO_CALL_STRIKE] !== undefined) {
      clone[LEG_FIELD.AUTO_CALL_STRIKE] = new BigNumber(clone[LEG_FIELD.AUTO_CALL_STRIKE])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.DOWN_BARRIER_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.DOWN_BARRIER] !== undefined) {
      clone[LEG_FIELD.DOWN_BARRIER] = new BigNumber(clone[LEG_FIELD.DOWN_BARRIER])
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] !== undefined) {
      clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] = new BigNumber(
        clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE]
      )
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.COUPON_BARRIER] !== undefined) {
    clone[LEG_FIELD.COUPON_BARRIER] = new BigNumber(clone[LEG_FIELD.COUPON_BARRIER])
      .multipliedBy(0.01)
      .toNumber();
  }

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

  if (clone[LEG_FIELD.DOWN_BARRIER] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] !== undefined) {
      clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] = new BigNumber(
        clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE]
      )
        .multipliedBy(0.01)
        .toNumber();
    }
  }

  return clone;
}

export function backConvertPercent(item) {
  const clone = { ...Form2.getFieldsValue(item) };

  if (clone[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] !== undefined) {
    clone[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] = new BigNumber(
      clone[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM]
    )
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.AUTO_CALL_STRIKE] !== undefined) {
      clone[LEG_FIELD.AUTO_CALL_STRIKE] = new BigNumber(clone[LEG_FIELD.AUTO_CALL_STRIKE])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] !== undefined) {
      clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] = new BigNumber(
        clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE]
      )
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.COUPON_BARRIER] !== undefined) {
    clone[LEG_FIELD.COUPON_BARRIER] = new BigNumber(clone[LEG_FIELD.COUPON_BARRIER])
      .multipliedBy(100)
      .toNumber();
  }

  if (clone[LEG_FIELD.DOWN_BARRIER_TYPE] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.DOWN_BARRIER] !== undefined) {
      clone[LEG_FIELD.DOWN_BARRIER] = new BigNumber(clone[LEG_FIELD.DOWN_BARRIER])
        .multipliedBy(100)
        .toNumber();
    }
  }

  if (clone[LEG_FIELD.DOWN_BARRIER] === UNIT_ENUM_MAP.PERCENT) {
    if (clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] !== undefined) {
      clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE] = new BigNumber(
        clone[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE]
      )
        .multipliedBy(100)
        .toNumber();
    }
  }

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
  return Form2.createFields(clone);
}
