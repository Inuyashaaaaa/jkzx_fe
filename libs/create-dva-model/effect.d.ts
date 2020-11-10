import { Action, AnyAction } from 'redux';
import { call, cancel, select, take } from 'redux-saga/effects';
import { WrappedEffectFnTagTagCont } from './constants';
import { ActionCreatorWithoutPayload, CaseReducerActions, PayloadAction, PayloadActionCreator, SliceCaseReducers } from './reducer';
export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): Promise<any> | T;
}
export interface SubscriptionAPI<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, CaseEffects extends SliceCaseEffects<State, CaseReducers> = SliceCaseEffects<State, CaseReducers>> {
    history: History;
    dispatch: Dispatch<any>;
    actions: CaseReducerActions<CaseReducers>;
    asyncActions: CaseEffectsActions<State, CaseReducers, CaseEffects>;
}
export interface SubscriptionsMapObject<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, CaseEffects extends SliceCaseEffects<State, CaseReducers> = SliceCaseEffects<State, CaseReducers>> {
    [key: string]: ((api: SubscriptionAPI<State, CaseReducers, CaseEffects>, done: Function) => void) & {
        [key in typeof WrappedEffectFnTagTagCont]?: boolean;
    };
}
export interface EffectsCommandMap<S = any, CaseReducers extends SliceCaseReducers<S> = SliceCaseReducers<S>> {
    put: <A extends AnyAction>(action: A) => any;
    call: typeof call;
    select: typeof select;
    take: typeof take;
    cancel: typeof cancel;
    actions: CaseReducerActions<CaseReducers>;
    [key: string]: any;
}
export declare type CaseEffect<S = any, A extends Action = AnyAction, CaseReducers extends SliceCaseReducers<S> = SliceCaseReducers<S>> = (action: A, sagas: EffectsCommandMap<S, CaseReducers>) => Generator<S | void>;
export interface SliceCaseEffects<State, CaseReducers extends SliceCaseReducers<State>> {
    [K: string]: CaseEffect<State, PayloadAction<any>, CaseReducers> & {
        [key in typeof WrappedEffectFnTagTagCont]?: boolean;
    };
}
declare type ActionCreatorForCaseEffect<CE, State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>> = CE extends (action: infer Action, sagas: EffectsCommandMap<State, CaseReducers>) => any ? Action extends {
    payload: infer P;
} ? PayloadActionCreator<P> : ActionCreatorWithoutPayload : ActionCreatorWithoutPayload;
export declare type CaseEffectsActions<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, CaseEffects extends SliceCaseEffects<State, CaseReducers> = SliceCaseEffects<State, CaseReducers>> = {
    [Type in keyof CaseEffects]: ActionCreatorForCaseEffect<CaseEffects[Type], State, CaseReducers>;
};
export {};
