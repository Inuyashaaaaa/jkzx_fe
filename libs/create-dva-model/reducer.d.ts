import { Draft } from 'immer';
import { AnyAction } from 'redux';
import { CaseEffectsActions, SliceCaseEffects, SubscriptionsMapObject } from './effect';
export interface Action<T = any> {
    type: T;
}
export declare type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
    payload: P;
    type: T;
} & ([M] extends [never] ? {} : {
    meta: M;
}) & ([E] extends [never] ? {} : {
    error: E;
});
export declare type PrepareAction<P> = ((...args: any[]) => {
    payload: P;
}) | ((...args: any[]) => {
    payload: P;
    meta: any;
}) | ((...args: any[]) => {
    payload: P;
    error: any;
}) | ((...args: any[]) => {
    payload: P;
    meta: any;
    error: any;
});
export declare type CaseReducer<S = any, A extends Action = AnyAction> = (state: Draft<S>, action: A) => S | void;
export declare type CaseReducerWithPrepare<State, Action extends PayloadAction> = {
    reducer: CaseReducer<State, Action>;
    prepare: PrepareAction<Action['payload']>;
};
export declare type SliceCaseReducers<State> = {
    [K: string]: CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;
};
export declare interface ActionCreatorWithPreparedPayload<Args extends unknown[], P, T extends string = string, E = never, M = never> extends BaseActionCreator<P, T, M, E> {
    (...args: Args): PayloadAction<P, T, M, E>;
}
declare type _ActionCreatorWithPreparedPayload<PA extends PrepareAction<any> | void, T extends string = string> = PA extends PrepareAction<infer P> ? ActionCreatorWithPreparedPayload<Parameters<PA>, P, T, ReturnType<PA> extends {
    error: infer E;
} ? E : never, ReturnType<PA> extends {
    meta: infer M;
} ? M : never> : void;
declare type ActionCreatorForCaseReducerWithPrepare<CR extends {
    prepare: any;
}> = _ActionCreatorWithPreparedPayload<CR['prepare'], string>;
declare interface BaseActionCreator<P, T extends string, M = never, E = never> {
    type: T;
    match(action: Action<unknown>): action is PayloadAction<P, T, M, E>;
}
export declare interface ActionCreatorWithoutPayload<T extends string = string> extends BaseActionCreator<undefined, T> {
    (): PayloadAction<undefined, T>;
}
declare type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false) ? True : False;
declare type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;
export declare interface ActionCreatorWithPayload<P, T extends string = string> extends BaseActionCreator<P, T> {
    (payload: P): PayloadAction<P, T>;
}
export declare interface ActionCreatorWithNonInferrablePayload<T extends string = string> extends BaseActionCreator<unknown, T> {
    <PT extends unknown>(payload: PT): PayloadAction<PT, T>;
}
declare type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False;
declare type IfVoid<P, True, False> = [void] extends [P] ? True : False;
declare type IsEmptyObj<T, True, False = never> = T extends any ? keyof T extends never ? IsUnknown<T, False, IfMaybeUndefined<T, False, IfVoid<T, False, True>>> : False : never;
declare type AtLeastTS35<True, False> = [True, False][IsUnknown<ReturnType<(<T>() => T)>, 0, 1>];
declare type IsUnknownOrNonInferrable<T, True, False> = AtLeastTS35<IsUnknown<T, True, False>, IsEmptyObj<T, True, IsUnknown<T, True, False>>>;
export declare interface ActionCreatorWithOptionalPayload<P, T extends string = string> extends BaseActionCreator<P, T> {
    (payload?: P): PayloadAction<P, T>;
}
export declare type PayloadActionCreator<P = void, T extends string = string, PA extends PrepareAction<P> | void = void> = IfPrepareActionMethodProvided<PA, _ActionCreatorWithPreparedPayload<PA, T>, IsAny<P, ActionCreatorWithPayload<any, T>, IsUnknownOrNonInferrable<P, ActionCreatorWithNonInferrablePayload<T>, IfVoid<P, ActionCreatorWithoutPayload<T>, IfMaybeUndefined<P, ActionCreatorWithOptionalPayload<P, T>, ActionCreatorWithPayload<P, T>>>>>>;
declare type IfPrepareActionMethodProvided<PA extends PrepareAction<any> | void, True, False> = PA extends (...args: any[]) => any ? True : False;
declare type ActionCreatorForCaseReducer<CR> = CR extends (state: any, action: infer Action) => any ? Action extends {
    payload: infer P;
} ? PayloadActionCreator<P> : ActionCreatorWithoutPayload : ActionCreatorWithoutPayload;
export declare type CaseReducerActions<CaseReducers extends SliceCaseReducers<any>> = {
    [Type in keyof CaseReducers]: CaseReducers[Type] extends {
        prepare: any;
    } ? ActionCreatorForCaseReducerWithPrepare<CaseReducers[Type]> : ActionCreatorForCaseReducer<CaseReducers[Type]>;
};
export declare interface Slice<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string, CaseEffects extends SliceCaseEffects<State> = SliceCaseEffects<State>> {
    namespace: Name;
    actions: CaseReducerActions<CaseReducers>;
    asyncActions: CaseEffectsActions<CaseEffects>;
}
export declare function createSlice<State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(options: CreateSliceOptions<State, CaseReducers, Name>): Slice<State, CaseReducers, Name>;
export declare type ValidateSliceCaseReducers<S, ACR extends SliceCaseReducers<S>> = ACR & {
    [T in keyof ACR]: ACR[T] extends {
        reducer(s: S, action?: infer A): any;
    } ? {
        prepare(...a: never[]): Omit<A, 'type'>;
    } : {};
};
export declare interface CreateSliceOptions<State = any, CR extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string, CE extends SliceCaseEffects<State> = SliceCaseEffects<State>> {
    namespace: Name;
    state: State;
    reducers: ValidateSliceCaseReducers<State, CR>;
    effects?: CE;
    subscriptions?: SubscriptionsMapObject;
}
export {};
