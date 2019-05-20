import { uuid } from './uuid';

export const unionId = () => {
  return uuid() + new Date().getTime();
};
