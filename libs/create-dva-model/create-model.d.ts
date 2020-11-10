import { SliceCaseEffects, SubscriptionsMapObject } from './effect';
import { CreateSliceOptions, Slice, SliceCaseReducers } from './reducer';
declare function createModel<State, CaseReducers extends SliceCaseReducers<State>, CaseEffects extends SliceCaseEffects<State, CaseReducers>, Name extends string, Subscriptions extends SubscriptionsMapObject<State, CaseReducers, CaseEffects>>(options: CreateSliceOptions<State, CaseReducers, Name>, effects?: CaseEffects, subscriptions?: Subscriptions): Slice<State, CaseReducers, CaseEffects> & CreateSliceOptions<State, CaseReducers, Name> & {
    effects?: CaseEffects;
    subscriptions?: Subscriptions;
};
export { createModel };
