import { OB_DAY_FIELD } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';

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

export function convertObservetions(nextDataSourceItem) {
  const days = Object.keys(nextDataSourceItem.fixingObservations);
  if (!days.length) return [];
  return days.map(day => {
    return {
      [OB_DAY_FIELD]: day,
      weight: nextDataSourceItem.fixingWeights && nextDataSourceItem.fixingWeights[day],
      price: nextDataSourceItem.fixingObservations && nextDataSourceItem.fixingObservations[day],
    };
  });
}
