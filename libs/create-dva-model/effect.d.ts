import { Action, AnyAction } from 'redux';
import { call, cancel, select, take } from 'redux-saga/effects';
import { ActionCreatorWithoutPayload, PayloadAction, PayloadActionCreator } from './reducer';
export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): Promise<any> | T;
}
export interface SubscriptionAPI {
    history: History;
    dispatch: Dispatch<any>;
}
export declare type Subscription = (api: SubscriptionAPI, done: Function) => void;
export interface SubscriptionsMapObject {
    [key: string]: Subscription;
}
export interface EffectsCommandMap {
    put: <A extends AnyAction>(action: A) => any;
    call: typeof call;
    select: typeof select;
    take: typeof take;
    cancel: typeof cancel;
    [key: string]: any;
}
export declare type CaseEffect<S = any, A extends Action = AnyAction> = (action: A, sagas: EffectsCommandMap) => Generator<S | void>;
export interface SliceCaseEffects<State> {
    [K: string]: CaseEffect<State, PayloadAction<any>>;
}
declare type ActionCreatorForCaseEffect<CR> = CR extends (action: infer Action, sagas: EffectsCommandMap) => any ? Action extends {
    payload: infer P;
} ? PayloadActionCreator<P> : ActionCreatorWithoutPayload : ActionCreatorWithoutPayload;
export declare type CaseEffectsActions<CaseEffects extends SliceCaseEffects<any>> = {
    [Type in keyof CaseEffects]: ActionCreatorForCaseEffect<CaseEffects[Type]>;
};
export {};
