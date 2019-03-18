import { FormComponentProps } from 'antd/lib/form';
import { TableProps } from 'antd/lib/table';
import { HTMLAttributes } from 'react';
import { ConnectDragSource, ConnectDropTarget } from 'react-dnd';

export interface AntdTableProps extends TableProps<{}> {}

export type IOnMove = (
  dragIndex: number,
  hoverIndex: number,
  dragId: string,
  hoverId: string
) => void;

export interface DragableProps extends AntdTableProps {
  onMove?: (
    dragIndex: number,
    hoverIndex: number,
    dragId: string,
    hoverId: string,
    dragRow: {}
  ) => void;
  vertical?: boolean;
  dragable?: boolean;
}

export interface InjectDragbleBaseRowProps {
  vertical: boolean;
  index: number;
  rowId: string;
  onMove: IOnMove;
  oldRow: React.ReactElement<any>;
  dragable: boolean;
}

export type IOnRow<T> = (record: T, index: number) => any;

export interface DragableBaseRowProps extends InjectDragbleBaseRowProps, HTMLAttributes<any> {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  isDragging: boolean;
}

export interface EditableProps extends AntdTableProps {
  editable: boolean;
}

export interface InjectEditableBaseRowProps {
  index: number;
  rowId: string;
  oldRow: React.ReactElement<any>;
  editable: boolean;
}

export interface EditableBaseRowProps extends InjectEditableBaseRowProps, FormComponentProps {}

export interface TablePlusProps extends DragableProps, EditableProps {}
