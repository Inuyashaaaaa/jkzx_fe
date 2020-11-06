import { SliceCaseEffects } from './effect';
import { CreateSliceOptions, Slice, SliceCaseReducers } from './reducer';
declare function createModel<State, CaseReducers extends SliceCaseReducers<State>, CaseEffects extends SliceCaseEffects<State>, Name extends string = string>(options: CreateSliceOptions<State, CaseReducers, Name, CaseEffects>): Slice<State, CaseReducers, Name, CaseEffects>;
export { createModel };
