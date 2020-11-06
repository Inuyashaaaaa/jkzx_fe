import { IUrlMapper, RAPPER_TYPE } from './types';
export interface IRapper {
    /** 必填，redux、normal 等 */
    type: RAPPER_TYPE;
    /** 必填，api仓库地址，从仓库的数据按钮可以获得 */
    apiUrl: string;
    /** api 地址 */
    apiOrigin?: string;
    /** 选填，rap平台前端地址，默认是 http://rap2.taobao.org */
    rapUrl?: string;
    /** 选填，生成出 rapper 的文件夹地址, 默认 ./src/rapper */
    rapperPath?: string;
    /** 选填，url映射，可用来将复杂的url映射为简单的url */
    urlMapper?: IUrlMapper;
    /** 选填，输出模板代码的格式 */
    codeStyle?: {};
    /** 选填，类型变换 type Selector<T> = T */
    resSelector?: string;
    /** 选填，resSelector 需要的外部的类型 */
    typeRef?: string;
}
export default function ({ type, rapUrl, apiUrl, rapperPath, urlMapper, codeStyle, resSelector, typeRef, apiOrigin, }: IRapper): Promise<unknown>;
