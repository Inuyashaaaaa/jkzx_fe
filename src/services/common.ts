import { OB_DAY_FIELD } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import { OB_PRICE_FIELD } from '@/pages/TradeManagementBookEdit/constants';
import { isAutocallPhoenix } from '@/tools';
import _ from 'lodash';

export const getCanUsedTranors = usedTranors => {
  return TRNORS_OPTS.filter(item => {
    return !usedTranors.includes(item.name);
  }).map(item => ({
    label: item.name,
    value: item.name,
  }));
};

// 获取所有可用的期限下拉 options 选项
export const getCanUsedTranorsOtions = (
  tableDataSource: Array<{ tenor: any }>,
  record: { tenor }
) => {
  return getCanUsedTranors(
    tableDataSource.map(item => item.tenor).filter(item => item !== record.tenor)
  );
};

export const getCanUsedTranorsOtionsNotIncludingSelf = (tableDataSource: Array<{ tenor: any }>) => {
  return getCanUsedTranors(tableDataSource.map(item => item.tenor));
};

// @todo remove and replace for leg selef pageData convertion
// 将观察日接口数据转换成字段数据
export function convertObservetions(nextDataSourceItem) {
  if (isAutocallPhoenix(nextDataSourceItem)) {
    return _.toPairs(nextDataSourceItem.fixingObservations).map(([price, day]) => {
      return {
        [OB_DAY_FIELD]: day,
        [OB_PRICE_FIELD]: price,
      };
    });
  }

  const days = Object.keys(nextDataSourceItem.fixingObservations);
  if (!days.length) return [];
  return days.map(day => {
    return {
      [OB_DAY_FIELD]: day,
      weight: nextDataSourceItem.fixingWeights && nextDataSourceItem.fixingWeights[day],
      [OB_PRICE_FIELD]:
        nextDataSourceItem.fixingObservations && nextDataSourceItem.fixingObservations[day],
    };
  });
}
