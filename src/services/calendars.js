import { request } from '@/lib/utils';
import { HOST_TEST } from '@/constants/global';

export async function createCalendar(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refTradingHolidaysAdd',
      params,
    },
  });
}

export async function queryCalendar(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refTradingCalendarGet',
      params,
    },
  });
}

export async function removeCalendar(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refTradingHolidaysDelete',
      params,
    },
  });
}
