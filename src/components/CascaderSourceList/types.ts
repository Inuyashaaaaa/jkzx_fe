import { CascaderOptionType } from 'antd/lib/cascader';
import { Omit } from '../common/types';
import { IFormControl } from '../Form/types';
import {
  ISourceListCreateHandle,
  ISourceListRemoveHandle,
  SourceListProps,
} from '../SourceList/types';

export interface ICascaderSourceListIndex {
  index: number;
}

export interface CascaderSourceListItemBaseProps extends SourceListProps {}

export interface CascaderSourceListItemProps
  extends Omit<CascaderSourceListItemBaseProps, 'createFormControls'> {
  createFormControls?: IFormControl[] | ((params: CascaderSourceListState) => IFormControl[]);
}

export interface CascaderSourceListBaseProps {
  options?: CascaderOptionType[];
  list?: Array<
    Omit<
      CascaderSourceListItemBaseProps,
      'rowKey' | 'dataSource' | 'selectedRowKeys' | 'onCreate' | 'onRemove' | 'onSelectRow'
    >
  >;
  value?: string[][];
  width?: number | string;
  loading?: boolean;
  onChange?: (value: string[][]) => void;
  onRemove?: ISourceListRemoveHandle<ICascaderSourceListIndex>;
  onCreate?: ISourceListCreateHandle<ICascaderSourceListIndex>;
  createable?: boolean;
  removeable?: boolean;
}

export interface CascaderSourceListProps extends Omit<CascaderSourceListBaseProps, 'list'> {
  list?: CascaderSourceListItemProps[];
}

export interface CascaderSourceListState {
  value?: string[][];
  filterList?: any[];
  list?: CascaderSourceListItemProps[];
}
