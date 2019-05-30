import { Divider } from 'antd';
import classnames from 'classnames';
import React, { HTMLAttributes, PureComponent } from 'react';
import './index.less';

interface SectionProps extends HTMLAttributes<HTMLDivElement> {}

class Section extends PureComponent<SectionProps, any> {
  public render() {
    const { className, children } = this.props;
    return (
      <Divider orientation="left" className={classnames(`tongyu-section`, className)}>
        {children}
      </Divider>
    );
  }
}

export default Section;
