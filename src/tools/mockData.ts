import _ from 'lodash';
import Mock from 'mockjs';
import { uuid } from '../utils/uuid';

export const mockData = (fields, range = '5-10'): any => {
  const fake = Mock.mock({
    [`list|${range}`]: [
      {
        ..._.mapValues(fields, val => {
          if (Array.isArray(val)) {
            return () => {
              return val[_.random(val.length - 1)];
            };
          }
          return val;
        }),
      },
    ],
  }).list;

  if (Array.isArray(fake)) {
    return fake.map(item => {
      return { ...item, id: uuid() };
    });
  }

  return {
    ...fake,
    id: uuid(),
  };
};
