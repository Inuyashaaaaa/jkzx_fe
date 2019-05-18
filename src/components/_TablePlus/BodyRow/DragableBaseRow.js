import React, { PureComponent } from 'react';

class DragableBaseRow extends PureComponent {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      dragable,
      isDragging,
      style,
      vertical,
      ...restProps
    } = this.props;

    const opacity = isDragging ? 0 : 1;
    const mergedStyle = { ...style, opacity, cursor: 'move' };

    return connectDragSource(connectDropTarget(<tr {...restProps} style={mergedStyle} />));
  }
}

export default DragableBaseRow;
