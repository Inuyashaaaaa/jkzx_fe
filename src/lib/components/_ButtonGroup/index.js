import ButtonPlus from '@/lib/components/_ButtonPlus';
import { Col, Divider, Row } from 'antd';
import classNames from 'classnames';
import React, { Fragment, PureComponent } from 'react';
import './index.less';
import { ButtonGroup as types } from './types';

class ButtonGroup extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    text: false,
    gutter: 8,
    justify: 'start',
    align: 'top',
  };

  render() {
    const {
      items,
      gutter,
      align,
      justify,
      style,
      text,
      onClick,
      className,
      ...commonProps
    } = this.props;

    return (
      <Row
        className={classNames(className, 'tongyu-button-group')}
        type="flex"
        justify={justify}
        gutter={text ? undefined : gutter}
        align={text ? 'middle' : align}
        style={style}
      >
        {text
          ? items.map((buttonProps, index) => {
              const { name } = buttonProps;
              return (
                <Fragment key={name}>
                  <ButtonPlus {...commonProps} text={text} {...buttonProps} onClick={onClick} />
                  {index !== items.length - 1 && <Divider type="vertical" />}
                </Fragment>
              );
            })
          : items.map(buttonProps => {
              const { name } = buttonProps;
              return (
                <Col key={name}>
                  <ButtonPlus {...commonProps} {...buttonProps} onClick={onClick} />
                </Col>
              );
            })}
      </Row>
    );
  }
}

export default ButtonGroup;
