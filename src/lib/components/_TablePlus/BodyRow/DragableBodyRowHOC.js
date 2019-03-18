import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const { vertical, index: hoverIndex } = props;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

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
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const wrapRow = BaseRow =>
  DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }))(
    DragSource('row', rowSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      dragRow: monitor.getItem(),
      clientOffset: monitor.getClientOffset(),
      initialClientOffset: monitor.getInitialClientOffset(),
      isDragging: monitor.isDragging(),
    }))(BaseRow)
  );

export default wrapRow;
