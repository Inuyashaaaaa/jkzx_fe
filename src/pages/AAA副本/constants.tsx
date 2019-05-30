import _ from 'lodash';

export const PROCESS_CONFIGS = [
  {
    label: '不允许审批自己发起的审批单',
    value: 'can_start_by_self',
  },
];

export const TASKTYPE = {
  insertData: 'INPUT_DATA',
  modifyData: 'MODIFY_DATA',
  reviewData: 'REVIEW_DATA',
};

export const REVIEW_DATA = 'reviewData';

export function GTE_PROCESS_CONFIGS(value) {
  const index = _.findIndex(PROCESS_CONFIGS, item => {
    return item.value === value;
  });
  if (index < 0) {
    return value;
  }
  return PROCESS_CONFIGS[index].label;
}
