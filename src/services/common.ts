import _ from 'lodash';
import { OB_DAY_FIELD } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import { OB_PRICE_FIELD } from '@/pages/TradeManagementBookEdit/constants';
import { isAutocallPhoenix, isAsian } from '@/tools';

export const getCanUsedTranors = usedTranors =>
  TRNORS_OPTS.filter(item => !usedTranors.includes(item.name)).map(item => ({
    label: item.name,
    value: item.name,
  }));

// 获取所有可用的期限下拉 options 选项
export const getCanUsedTranorsOtions = (
  tableDataSource: { tenor: any }[],
  record: { tenor?: any },
) =>
  getCanUsedTranors(tableDataSource.map(item => item.tenor).filter(item => item !== record.tenor));

export const getCanUsedTranorsOtionsNotIncludingSelf = (tableDataSource: { tenor: any }[]) =>
  getCanUsedTranors(tableDataSource.map(item => item.tenor));

// @todo remove and replace for leg selef pageData convertion
// 将观察日接口数据转换成字段数据
export function convertObservetions(nextDataSourceItem) {
  if (isAutocallPhoenix(nextDataSourceItem)) {
    return _.toPairs(nextDataSourceItem.fixingObservations).map(([price, day]) => ({
      [OB_DAY_FIELD]: day,
      [OB_PRICE_FIELD]: price,
    }));
  }

  if (isAsian(nextDataSourceItem)) {
    return nextDataSourceItem.OBSERVATION_DATES;
  }

  const days = Object.keys(nextDataSourceItem.fixingObservations);
  if (!days.length) return [];
  return days.map(day => ({
    [OB_DAY_FIELD]: day,
    weight: nextDataSourceItem.fixingWeights && nextDataSourceItem.fixingWeights[day],
    [OB_PRICE_FIELD]:
      nextDataSourceItem.fixingObservations && nextDataSourceItem.fixingObservations[day],
  }));
}
