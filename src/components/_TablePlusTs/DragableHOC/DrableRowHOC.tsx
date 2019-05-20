import React, { PureComponent } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DragableBaseRowProps } from '../types';
import WrapRowHOC from './HOC';
import './index.less';

const DragableBaseRowHOC = (OldRow: React.ReactType) =>
  class DragableBaseRow extends PureComponent<DragableBaseRowProps> {
    public render() {
      if (!this.props.dragable) {
        return React.cloneElement(this.props.oldRow, this.props);
      }

      const {
        isOver,
        connectDragSource,
        connectDropTarget,
        onMove,
        isDragging,
        style,
        vertical,
        index,
        dragable,
        className,
        rowId,
        ...pickedProps
      } = this.props;

      const opacity = isDragging ? 0 : 1;
      const mergedStyle = { opacity, cursor: 'move', ...style };

      return (
        <Draggable key={rowId} draggableId={rowId} index={index}>
          {(provided, snapshot) =>
            React.createElement(OldRow, {
              ...pickedProps,
              style: mergedStyle,
              className,
              ref: provided.innerRef,
              ...provided.draggableProps,
              ...provided.dragHandleProps,
              // className: cns(className, `${prefix}-table-plus-drable-row`, {
              //   hover: this.state.hover,
              // }),
            })
          }
        </Draggable>
      );
    }
  };

export default (OldRow: React.ReactType) => DragableBaseRowHOC(OldRow);
