export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface ISourceRowParams {
  rowId: string;
  rowData: any;
  rowIndex: number;
}

export type IStateCallback = () => void;

export type IResultState<S> = S | [S, IStateCallback];

export type IActionReturnValue<S> =
  | boolean
  | void
  | IResultState<S>
  | Promise<boolean | void | IResultState<S>>;

export type IActionHandle<P, T> = (params: P) => IActionReturnValue<T>;
