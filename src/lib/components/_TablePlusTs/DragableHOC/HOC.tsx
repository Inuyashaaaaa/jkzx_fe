import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { DragableBaseRowProps } from '../types';
import './index.less';

const rowSource = {
  beginDrag(props: DragableBaseRowProps) {
    return {
      rowId: props.rowId,
      index: props.index,
    };
  },
};

const rowTarget = {
  hover(props: DragableBaseRowProps, monitor, component) {
    const dragId = monitor.getItem().rowId;
    const dragIndex = monitor.getItem().index;
    const { vertical, rowId: hoverId, index: hoverIndex } = props;

    // Don't replace items with themselves
    if (dragId === hoverId) {
      return;
    }

    // Determine rectangle on screen
    const node = findDOMNode(component) as Element;
    const hoverBoundingRect = node.getBoundingClientRect();

    // Get vertical middle
    const moveDistance = vertical
      ? hoverBoundingRect.right - hoverBoundingRect.left
      : hoverBoundingRect.bottom - hoverBoundingRect.top;
    const hoverMiddle = moveDistance / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClient = vertical
      ? clientOffset.x - hoverBoundingRect.left
      : clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClient < hoverMiddle) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClient > hoverMiddle) {
      return;
    }

    // Time to actually perform the action
    props.onMove(dragIndex, hoverIndex, dragId, hoverId);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const WrapRowHOC = (BaseRow: React.ComponentClass) =>
  DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }))(
    DragSource('row', rowSource, (connect, monitor) => {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
      };
    })(BaseRow)
  );

export default WrapRowHOC;
