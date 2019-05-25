import { uuid } from '../utils/uuid';

export const unionId = () => {
  return uuid() + new Date().getTime();
};
