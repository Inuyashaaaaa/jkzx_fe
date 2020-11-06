import { IExtra } from './commonLib';
/** 常量定义 */
export declare const RAPPER_REQUEST = "$$RAPPER_REQUEST";
export declare const RAPPER_CLEAR_STORE = "$$RAPPER_CLEAR_STORE";
export declare const RAPPER_UPDATE_STORE = "$$RAPPER_UPDATE_STORE";
export declare const RAPPER_STATE_KEY = "$$rapperResponseData";
/** useAPI 的 extra */
export interface IUseAPIExtra extends Omit<IExtra, 'type'> {
    /**
     * 支持三种模式
     * paramsMatch，参数匹配模式（默认模式），判断缓存中是否有请求参数相同的数据，有就返回，没有就自动发送请求
     * notMatch，不进行参数匹配模式，判断缓存是否有接口数据，有就返回，没有就自动发送请求
     * manual，手动模式，不自动发送请求，返回数据是通过 request 请求得到的最新数据
     */
    mode?: 'paramsMatch' | 'notMatch' | 'manual';
}
/** 请求类型 */
declare type REQUEST_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
interface IAction<T = any> {
    type: T;
}
export interface IAnyAction extends IAction {
    [extraProps: string]: any;
}
export interface IRequestAction {
    type: typeof RAPPER_REQUEST;
    payload?: {
        modelName: string;
        url: string;
        method?: REQUEST_METHOD;
        params?: any;
        types: string[];
    };
}
export declare type TAction = IAnyAction | IRequestAction;
/** store enhancer 参数 */
export interface IEnhancerProps {
    /** 缓存数据最大长度 */
    maxCacheLength?: number;
}
declare type Dispatch<A = IAnyAction> = <T extends A>(action: T, ...extraArgs: any[]) => T;
declare type Unsubscribe = () => void;
export declare type Reducer<S = any, A = IAnyAction> = (state: S | undefined, action: A) => S;
declare type ExtendState<IState, Extension> = [Extension] extends [never] ? IState : IState & Extension;
declare type Observer<T> = {
    next?(value: T): void;
};
declare type Observable<T> = {
    subscribe: (observer: Observer<T>) => {
        unsubscribe: Unsubscribe;
    };
    [Symbol.observable](): Observable<T>;
};
export declare type StoreEnhancer<Ext = {}, StateExt = {}> = (next: StoreEnhancerStoreCreator) => StoreEnhancerStoreCreator<Ext, StateExt>;
export declare type StoreEnhancerStoreCreator<Ext = {}, StateExt = {}> = <S = any, A extends IAction = IAnyAction>(reducer: Reducer<S, A>, preloadedState?: DeepPartial<S>) => IStore<S & StateExt, A> & Ext;
export declare type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
/** IStore */
export interface IStore<S = any, A = TAction, StateExt = never, Ext = {}> {
    dispatch: Dispatch<A>;
    getState(): S;
    subscribe(listener: () => void): Unsubscribe;
    replaceReducer<NewState, NewActions>(nextReducer: Reducer<NewState, NewActions>): IStore<ExtendState<NewState, StateExt>, NewActions, StateExt, Ext> & Ext;
    [Symbol.observable](): Observable<S>;
}
declare const $CombinedState: unique symbol;
export declare type CombinedState<S> = {
    readonly [$CombinedState]?: undefined;
} & S;
export declare type PreloadedState<S> = Required<S> extends {
    [$CombinedState]: undefined;
} ? S extends CombinedState<infer S1> ? {
    [K in keyof S1]?: S1[K] extends object ? PreloadedState<S1[K]> : S1[K];
} : never : {
    [K in keyof S]: S[K] extends object ? PreloadedState<S[K]> : S[K];
};
export interface IStoreCreator {
    <S, A extends IAction, Ext = {}, StateExt = never>(reducer: Reducer<S, A>, enhancer?: StoreEnhancer<Ext, StateExt>): IStore<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;
    <S, A extends IAction, Ext = {}, StateExt = never>(reducer: Reducer<S, A>, preloadedState?: PreloadedState<S>, enhancer?: StoreEnhancer<Ext>): IStore<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;
}
interface IFilterObj<Req> {
    request?: Req;
}
declare type FilterFunc<Item> = (storeData: Item) => boolean;
export interface IState {
    [key: string]: any;
}
/** 以Hooks方式获取response数据 */
export declare function useResponseData<M, Req, Res, Item extends {
    request: Req;
}>(modelName: M, filter?: IFilterObj<Req> | FilterFunc<Item>): [Res, {
    /** 本次请求的唯一id */
    id: number;
    /** 是否正在请求中 */
    isPending: boolean;
    /** 请求错误信息 */
    errorMessage?: string;
}];
/** class component获取response数据 */
export declare function getResponseData<M, Req, Res, Item extends {
    request: Req;
}>(state: IState, modelName: M, filter?: IFilterObj<Req> | FilterFunc<Item>): [Res, {
    id: number;
    isPending: boolean;
    errorMessage?: string;
}];
/** class component获取response数据 */
export declare function getRapperDataSelector<M, Res>(state: IState, modelName: M): Res;
interface IRapperCommonParams<M, Req, Item, IFetcher> {
    modelName: M;
    fetcher: IFetcher;
    requestParams?: Req;
    extra?: IUseAPIExtra;
    filter?: IFilterObj<Req> | FilterFunc<Item>;
}
/** useAPI */
export declare function useAPICommon<M, Req, Res, IFetcher extends (requestParams?: Req, extra?: IExtra) => any>({ modelName, fetcher, requestParams, extra }: IRapperCommonParams<M, Req, {}, IFetcher>): [Res, {
    /** 是否正在请求中 */
    isPending: boolean;
    /** 请求错误信息 */
    errorMessage?: string;
    /** 请求函数 */
    request: IFetcher;
}];
export interface IInterfaceInfo {
    /** 请求的唯一id，暂时等于requestTime */
    id: number;
    /** 请求时间 */
    requestTime: number;
    /** 是否正在 fetching */
    isPending: boolean;
    /** 错误信息 */
    errorMessage?: string;
    /** 响应时间 */
    reponseTime?: number;
}
export declare const rapperReducers: {
    $$rapperResponseData: (state?: {}) => {};
};
/** store enhancer */
export declare function rapperEnhancer(config?: IEnhancerProps): any;
/** 发送请求 */
export declare function dispatchAction<Res>(action: IAnyAction, fetch?: any): Promise<IAnyAction | Res>;
export {};
