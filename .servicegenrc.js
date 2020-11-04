module.exports = {
  type: 'normal',
  rapUrl: 'http://api.tongyu.tech:3000',
  apiUrl:
    'http://api.tongyu.tech:38080/repository/get?id=32&token=6C-p2st4L4HaAa0Q4kz1ZHRColEk3Xa0',
  rapperPath: 'src/__apis__',
  typeRef: 'import { ResponseData, ResultData, BCTAPIData } from "@/utils/request-new";',
  resSelector: 'type ResSelector<T extends BCTAPIData> = ResponseData<ResultData<T>>',
};
