import _ from 'lodash';
import moment from 'moment';

export const sortByCreateAt = dataSource => {
  const data = [...dataSource];
  return data.sort((item1, item2) => {
    if (moment(item1.createdAt).valueOf() - moment(item2.createdAt).valueOf() > 0) {
      return -1;
    } else if (moment(item1.createdAt).valueOf() - moment(item2.createdAt).valueOf() < 0) {
      return 1;
    } else {
      return 0;
    }
  });
};
