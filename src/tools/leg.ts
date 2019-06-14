import { qlIsHoliday } from '@/services/volatility';
import { message } from 'antd';

export const validateExpirationDate = async date => {
  if (!date) return;
  const rootState = window.g_app._store.getState() || {};
  const { expirationDate = {} } = rootState;
  const { volatilityCalendars } = expirationDate;
  if (!volatilityCalendars) return;
  const formatDate = date.format('YYYY-MM-DD');
  const { error, data } = await qlIsHoliday({
    calendars: volatilityCalendars,
    date: formatDate,
  });
  if (error) return;
  if (data) {
    message.warning(`${formatDate}属于非交易日`);
  }
};
