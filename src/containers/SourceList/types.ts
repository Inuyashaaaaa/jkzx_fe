import { ListProps } from 'antd/lib/list';
import { RowProps } from 'antd/lib/row';
import { CSSProperties } from 'react';
import { ISourceRowParams, Omit } from '../common/types';
import { Form2Props, IFormChangeHandle, IFormControl } from '../Form/types';
import { ButtonProps } from 'antd/lib/button';

export interface RenderItemProps extends RowProps {
  onClick?: () => void;
  selected?: boolean;
  selectable?: boolean;
}

export interface ListHeaderProps {
  title?: string;
}

export interface SourceDisplayerProps {
  resetable?: boolean;
  resetButtonProps?: ButtonProps;
  resetLoading?: boolean;
  resetText?: string;
  onResetButtonClick?: (params: { searchFormData: any; domEvent: MouseEvent }) => void;
  searchText?: string;
  searchButtonProps?: ButtonProps;
  searchFormData?: object;
  searchable?: boolean;
  onSearchButtonClick?: (params: { searchFormData: any; domEvent?: MouseEvent }) => void;
  onSearchFormChange?: IFormChangeHandle;
  searchFormControls?: IFormControl[];
  searchFormProps?: Form2Props;
}

export interface SourceListBaseProps
  extends Omit<ListProps, 'dataSource' | 'loading' | 'renderItem'>,
    SourceDisplayerProps {
  dataSource?: any[];
  title?: string;
  style?: CSSProperties;
  rowKey: string;
  rowSelection?: 'single' | 'multiple';
  selectable?: boolean;
  loading?: boolean;
  selectedRowKeys?: string[];
  onSelectRow?: ISourceListSelectRowHandle;
  renderItem?: (params: ISourceRowParams) => React.ReactNode;
  action?: React.ReactNode;
}

export interface SourceListProps extends SourceListBaseProps {}

export interface SourceListState {
  selectedRowKeys?: string[];
}

export type ISourceListSelectRowHandle<P = any> = (
  params: {
    selectedRowKeys: string[];
    selectedRows: any[];
  } & P
) => void;
