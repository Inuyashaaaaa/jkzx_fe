import { JSONSchema4 } from 'json-schema';
import { Validator } from 'jsonschema';
export { JSONSchema4, Validator };
declare type IJSON = string | number | boolean | null | {
    [property: string]: IJSON;
} | IJSON[];
/** 请求的额外参数类型 */
export interface IExtra {
    /**
     * 请求的类型，默认不传 代表redux请求，会发送 Action，也存入redux store
     * normal 代表普通请求，不发送 Action，也不存入redux store
     * redux 代表redux请求，会发送 Action，也存入redux store
     */
    type?: 'normal' | 'redux';
    /**
     * 请求头 content-type，默认是 'application/json'
     */
    contentType?: 'application/json' | 'multipart/form-data' | 'application/x-www-form-urlencoded' | 'text/plain' | 'text/html' | 'application/javascript';
    /**
     * 请求 url 后面拼接的 query 参数，比如 POST 请求需要拼接 token 参数
     */
    query?: {
        [key: string]: any;
    };
    /**
     * 用户自定义的queryString函数，默认使用JSON.stringify处理，例如 { a: 1, b: 2 } 结果是 a=1&b=2
     */
    queryStringFn?: (input: any[] | object) => string;
    /** 是否开启 mock */
    mock?: boolean;
    /** 扩展字段 */
    [key: string]: any;
}
/** defaultFetch 参数 */
export interface IDefaultFetchParams {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD';
    params?: any;
    schemas?: {
        request: JSONSchema4;
        response: JSONSchema4;
    };
    extra?: IExtra;
    fetchOption: Omit<RequestInit, 'body' | 'method'>;
}
/** defaultFetch 参数 */
export interface IUserFetchParams {
    url: string;
    method: IDefaultFetchParams['method'];
    params?: object;
    schemas?: {
        request: JSONSchema4;
        response: JSONSchema4;
    };
    extra?: IExtra;
}
declare type TQueryFunc = () => {
    [key: string]: IJSON;
};
interface IDefaultConfigObj {
    /** 'prefix' 前缀，统一设置 url 前缀，默认是 '' */
    prefix?: string;
    /** fetch 的第二参数，除了 body 和 method 都可以自定义 */
    fetchOption?: IDefaultFetchParams['fetchOption'];
    /** 全局的query参数，可以配置 object，或者自定义函数 */
    query?: {
        [key: string]: IJSON;
    } | TQueryFunc;
}
declare type FetchConfigObj = Partial<IDefaultConfigObj>;
declare type FetchConfigFunc = (params: IUserFetchParams) => Promise<any>;
export declare type RequesterOption = FetchConfigObj | FetchConfigFunc;
export declare const defaultFetch: ({ url, method, params, extra, schemas, fetchOption, }: IDefaultFetchParams) => Promise<any>;
export declare const getRapperRequest: (fetchConfig: RequesterOption) => (fetchParams: IUserFetchParams) => Promise<any>;
