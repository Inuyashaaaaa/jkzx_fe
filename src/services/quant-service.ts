import { HOST_TEST } from '@/constants/global';
import request from '@/utils/request';

export async function qlDateScheduleCreate(params = {}) {
  return request(`${HOST_TEST}quant-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'qlDateScheduleCreate',
      params,
    },
  });
}
