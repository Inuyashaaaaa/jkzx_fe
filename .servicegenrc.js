module.exports = {
  type: 'normal',
  rapUrl: 'http://10.1.5.117:3000',
  apiUrl: 'http://10.1.5.117:38080/repository/get?id=33&token=MZzwEq0bYstOHX1CIdQajiyeJFmoT6xh',
  rapperPath: 'src/__apis__',
  typeRef: 'import { ResponseData, ResultData, BCTAPIData } from "@/utils/request";',
  resSelector: 'type ResSelector<T extends BCTAPIData> = ResponseData<ResultData<T>>',
};
