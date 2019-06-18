import {
  EXERCISETYPE_MAP,
  LCM_EVENT_TYPE_MAP,
  LEG_ENV_FIELD,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PRODUCT_TYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_ID_FIELD,
} from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV, TOTAL_LEGS } from '@/constants/legs';
import { AutoCallSnow } from '@/domains/legs/AutoCallSnow';
import { BarrierLeg } from '@/domains/legs/Barrier';
import { DigitalLegAmerican } from '@/domains/legs/DigitalLegAmerican';
import { DigitalLegEuropean } from '@/domains/legs/DigitalLegEuropean';
import { DoubleSharkFin } from '@/domains/legs/DoubleSharkFin';
import { DoubleTouch } from '@/domains/legs/DoubleTouch';
import { DoubleNoTouch } from '@/domains/legs/DoubleNoTouch';
import { Concava } from '@/domains/legs/Concava';
import { Convex } from '@/domains/legs/Convex';
import { Eagle } from '@/domains/legs/Eagle';
import { RangeAccruals } from '@/domains/legs/RangeAccruals';
import { TripleDigital } from '@/domains/legs/TripleDigital';
import { DoubleDigital } from '@/domains/legs/DoubleDigital';
import { RatioSpreadEuropean } from '@/domains/legs/RatioSpreadEuropean';
import { ModelXy } from '@/domains/legs/ModelXy';
import { VanillaAmerican } from '@/domains/legs/VanillaAmerican';
import { VanillaEuropean } from '@/domains/legs/VanillaEuropean';
import { VerticalSpread } from '@/domains/legs/VerticalSpread';
import { SpreadEuropean } from '@/domains/legs/SpreadEuropean';
import _ from 'lodash';
import { AutoCallPhoenix } from '@/domains/legs/AutoCallPhoenix';
import { Asia } from '@/domains/legs/Asia';
import { Straddle } from '@/domains/legs/Straddle';
import { Forward } from '@/domains/legs/Forward';
import { createLegDataSourceItem, backConvertPercent } from '@/services/pages';
import { Form2 } from '@/containers';
import { ITableData } from '@/components/type';
import { ILeg } from '@/types/leg';
import BigNumber from 'bignumber.js';
import { notification } from 'antd';
import moment, { isMoment } from 'moment';
import mapTree from './mapTree';
import request from './request';

export const isModelXY = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.MODEL_XY_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.MODEL_XY_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.MODEL_XY
  );
};

export const isAutocallPhoenix = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX
  );
};

export const isAutocallSnow = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL
  );
};

export const isAsian = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN
  );
};

export const isRangeAccruals = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS
  );
};

export const isKnockIn = data => {
  return data[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.KNOCK_IN;
};

export const getMinRule = (message: string = '不允许小于0') => {
  return {
    message,
    validator: (rule, value, callback) => {
      if (value < 0) {
        return callback(true);
      }
      return callback();
    },
  };
};

export const getRequiredRule = (message: string = '必填') => {
  return {
    message,
    required: true,
  };
};

export function arr2treeOptions(arr, paths, labelPaths) {
  if (!arr || arr.length === 0) return [];
  const length = paths.length;
  if (paths.length !== labelPaths.length) {
    throw new Error('arr2treeOptions: paths.length should be equal with labelPaths.length.');
  }
  const deeps = _.unionBy(arr, paths[0]).map(item => item[paths[0]]);
  function getTreeData(a, index) {
    if (index === length) {
      return;
    }
    if (a === null) return;
    const data = _.uniq(
      arr
        .filter(iitem => {
          return iitem[paths[index]] === a;
        })
        .map(value => value[paths[index + 1]])
    );
    return {
      [a]: data.map(c => getTreeData(c, index + 1)),
    };
  }
  const x = deeps.map(item => {
    return getTreeData(item, 0);
  });
  function getTree(deep, index = 0) {
    if (!deep) return [];

    return deep.map(value => {
      if (Object.keys(value)[0] === undefined) return;
      if (_.values(value)[0][0] === undefined) {
        return {
          data: _.values(value)[0],
          label: arr.find(params => params[paths[index]] === Object.keys(value)[0])[
            labelPaths[index]
          ],
          value: Object.keys(value)[0],
          children: [],
        };
      }
      return {
        data: _.values(value)[0],
        label: arr.find(params => params[paths[index]] === Object.keys(value)[0])[
          labelPaths[index]
        ],
        value: Object.keys(value)[0],
        children: getTree(_.values(value)[0], index + 1),
      };
    });
  }
  return getTree(x);
}

export const getLegByRecord = record => {
  const leg = TOTAL_LEGS.find(item => item.type === record[LEG_TYPE_FIELD]);
  return leg;
};

export const legEnvIsBooking = record => record[LEG_ENV_FIELD] === LEG_ENV.BOOKING;

export const legEnvIsPricing = record => record[LEG_ENV_FIELD] === LEG_ENV.PRICING;

export const legEnvIsEditing = record => record[LEG_ENV_FIELD] === LEG_ENV.EDITING;

export const getLegEnvs = record => ({
  isBooking: legEnvIsBooking(record),
  isPricing: legEnvIsPricing(record),
  isEditing: legEnvIsEditing(record),
});

export const getFormEditingMeta = (
  status: 'EDITING_NO_CONVERT' | 'NO_EDITING_CAN_CONVERT' | 'SHOW'
) => {
  if (status === FORM_EDITABLE_STATUS.EDITING_NO_CONVERT) {
    return {
      editable: false,
    };
  } else if (status === FORM_EDITABLE_STATUS.NO_EDITING_CAN_CONVERT) {
    return {
      editable: true,
    };
  } else {
    return {
      editable: false,
      editing: false,
    };
  }
};

export const getLegByType = (type: string) => {
  return TOTAL_LEGS.find(item => item.type === type);
};

export const getLegByProductType = (productType, exerciseType?) => {
  if (productType === PRODUCT_TYPE_MAP.DIGITAL) {
    if (exerciseType === EXERCISETYPE_MAP.AMERICAN) {
      return DigitalLegAmerican;
    }
    if (exerciseType === EXERCISETYPE_MAP.EUROPEAN) {
      return DigitalLegEuropean;
    }
  }
  if (productType === PRODUCT_TYPE_MAP.STRADDLE) {
    return Straddle;
  }
  if (productType === PRODUCT_TYPE_MAP.DOUBLE_TOUCH) {
    return DoubleTouch;
  }
  if (productType === PRODUCT_TYPE_MAP.DOUBLE_NO_TOUCH) {
    return DoubleNoTouch;
  }
  if (productType === PRODUCT_TYPE_MAP.CONVEX) {
    return Convex;
  }
  if (productType === PRODUCT_TYPE_MAP.CONCAVA) {
    return Concava;
  }
  if (productType === PRODUCT_TYPE_MAP.VANILLA_AMERICAN) {
    return VanillaAmerican;
  }
  if (productType === PRODUCT_TYPE_MAP.VANILLA_EUROPEAN) {
    return VanillaEuropean;
  }
  if (productType === PRODUCT_TYPE_MAP.VERTICAL_SPREAD) {
    return VerticalSpread;
  }
  if (productType === PRODUCT_TYPE_MAP.BARRIER) {
    return BarrierLeg;
  }
  if (productType === PRODUCT_TYPE_MAP.DOUBLE_SHARK_FIN) {
    return DoubleSharkFin;
  }
  if (productType === PRODUCT_TYPE_MAP.EAGLE) {
    return Eagle;
  }
  if (productType === PRODUCT_TYPE_MAP.RANGE_ACCRUALS) {
    return RangeAccruals;
  }
  if (productType === PRODUCT_TYPE_MAP.TRIPLE_DIGITAL) {
    return TripleDigital;
  }
  if (productType === PRODUCT_TYPE_MAP.DOUBLE_DIGITAL) {
    return DoubleDigital;
  }
  if (productType === PRODUCT_TYPE_MAP.MODEL_XY) {
    return ModelXy;
  }
  if (productType === PRODUCT_TYPE_MAP.AUTOCALL) {
    return AutoCallSnow;
  }
  if (productType === PRODUCT_TYPE_MAP.AUTOCALL_PHOENIX) {
    return AutoCallPhoenix;
  }
  if (productType === PRODUCT_TYPE_MAP.ASIAN) {
    return Asia;
  }
  if (productType === PRODUCT_TYPE_MAP.FORWARD) {
    return Forward;
  }
  if (productType === PRODUCT_TYPE_MAP.SPREAD_EUROPEAN) {
    return SpreadEuropean;
  }
  if (productType === PRODUCT_TYPE_MAP.RATIO_SPREAD_EUROPEAN) {
    return RatioSpreadEuropean;
  }
  throw new Error('not match productType!');
};

export const convertLegDataByEnv = (record: ITableData, toEnv: string) => {
  const leg = getLegByRecord(record);
  if (!leg) return record;
  const omits = _.difference(
    leg.getColumns(record[LEG_ENV_FIELD], record).map(record => record.dataIndex),
    leg.getColumns(toEnv, record).map(record => record.dataIndex)
  );
  return {
    ...createLegDataSourceItem(leg, toEnv),
    ...leg.getDefaultData(toEnv),
    ..._.omit(record, [...omits, ...LEG_INJECT_FIELDS]),
  };
};

export const createLegRecordByPosition = (leg: ILeg, position, env: string) => {
  const isAnnualized = position.asset.annualized;

  const pageData = leg.getPageData(env, position);

  return {
    ...createLegDataSourceItem(leg, env),
    [LEG_ID_FIELD]: position.positionId,
    ...backConvertPercent({
      ...Form2.createFields({
        ..._.omitBy(
          _.omit(position.asset, ['counterpartyCode', 'annualized', 'exerciseType']),
          _.isNull
        ),
        [LEG_FIELD.IS_ANNUAL]: isAnnualized,
      }),
    }),
    ...pageData,
  };
};

export const formatNumber = (
  value: BigNumber.Value,
  decimalPlaces?: number,
  roundingMode?: BigNumber.RoundingMode,
  config?: BigNumber.Format
) => {
  if (!_.isNumber(value)) {
    return '';
  }
  return new BigNumber(value).toFormat(decimalPlaces, roundingMode, config);
};

export const formatMoney = (
  value,
  config?: {
    unit?: string;
    space?: boolean;
    decimalPlaces?: number;
  }
) => {
  const { unit = '', space = false, decimalPlaces = 4 } = config || {};
  return formatNumber(value, decimalPlaces, null, {
    // the decimal separator
    decimalSeparator: '.',
    // the grouping separator of the integer part
    groupSeparator: ',',
    // the primary grouping size of the integer part
    groupSize: 3,
    // the secondary grouping size of the integer part
    secondaryGroupSize: 0,
    // the grouping separator of the fraction part
    fractionGroupSeparator: ' ',
    // the grouping size of the fraction part
    fractionGroupSize: 0,
    // string to append
    suffix: '',
    prefix: `${unit}${space ? ' ' : ''}`,
  });
};

export const parseMoney = (value, unit = '', space = false) =>
  (value != null ? value : '').replace(new RegExp(`${unit}${space ? ' ' : ''}\s?|(,*)`, 'g'), '');

export const catchCallbackError = (target: any) => {
  const handleError = error => {
    notification.error({
      message: '抱歉，发送了未知错误',
      description: error + '',
    });
  };
  return function() {
    try {
      const result = target.apply(this, arguments);
      if (result instanceof Promise) {
        result.catch(error => {
          handleError(error);
        });
      }
    } catch (error) {
      handleError(error);
    }
  };
};

export const getLocaleId = (parent, item) => {
  const parentName = parent && parent.name;
  if (parentName) {
    return `menu.${parentName}.${item.name}`;
  }
  return `menu.${item.name}`;
};

export { request };
export { mapTree };
export * from './utils';
export * from './extensibleProduce';

export const convertOptions = (maps, zhcn) => {
  return Object.keys(maps).map(key => ({
    label: zhcn[key],
    value: maps[key],
  }));
};

// NOTE: 如果 val 是空，则返回当前时间
export const getMoment = (val, clone = false) => {
  return isMoment(val) ? (clone ? val.clone() : val) : !!val ? moment(val) : moment();
};

export * from './delay';
export * from '../utils/eventBus';
export * from '../utils/isShallowEqual';
export * from './mockData';
export * from './someDeep';
export * from '../utils/uuid';
export * from './utils';
export * from './toggleItem';
export * from './getDiffAttrs';
export * from './pathTools';
