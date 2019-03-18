import classnames from 'classnames';
import React, { PureComponent } from 'react';
import './index.less';
import { RenderItemProps } from './types';

class RenderItem extends PureComponent<RenderItemProps> {
  public render() {
    const { selected, selectable, onClick, children } = this.props;
    return (
      <div
        onClick={onClick}
        className={classnames('tongyu-source-list-render-item', { selected, selectable })}
      >
        {children}
      </div>
    );
  }
}

export default RenderItem;
