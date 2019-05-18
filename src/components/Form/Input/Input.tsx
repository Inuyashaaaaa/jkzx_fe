import { Icon, Input as AntdInput, Tooltip } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import classnames from 'classnames';
import React, { PureComponent } from 'react';
import Loading from '../../Loading';
import { INPUT_COM_MAP, STATUS_ICON_MAP } from './constants';
import './Input.less';
import { InputPolymProps, InputProps } from './interface';

const GROUP_CHUNK_WIDTH = 120;

const InputGroup = AntdInput.Group;

class Input extends PureComponent<InputProps> {
  public static defaultProps = {
    subtype: 'editing',
    statusTipPlacement: 'topRight',
  };

  public getInput = (width?: number | string) => {
    const {
      raw,
      type: _type,
      loading,
      status,
      statusTip,
      wrapperStyle,
      statusTipVisible,
      wrapperClassName,
      statusTipPlacement,
      onStatusTipMouseLeave,
      onStatusTipMouseEnter,
      after,
      before,
      ...omitedProps
    } = this.props as InputProps;

    const type = this.getType();

    const element = typeof type === 'string' ? (INPUT_COM_MAP as any)[type] : type;

    return React.createElement(element, {
      ...omitedProps,
      style: {
        ...omitedProps.style,
        width,
      },
    });
  };

  public getType = () => {
    if ('type' in this.props) {
      return this.props.type;
    }
    return 'input';
  };

  public onTipMouseEnter = event => {
    if (this.props.onStatusTipMouseEnter) {
      this.props.onStatusTipMouseEnter(event);
    }
  };

  public onTipMouseLeave = event => {
    if (this.props.onStatusTipMouseLeave) {
      this.props.onStatusTipMouseLeave(event);
    }
  };

  public getGroupInput = () => {
    const { before, after, style = {} } = this.props;

    if (!before && !after) {
      return this.getInput(style.width);
    }

    let width = 0;
    if (before) width += GROUP_CHUNK_WIDTH;
    if (after) width += GROUP_CHUNK_WIDTH;
    return (
      <InputGroup compact={true}>
        {before &&
          React.cloneElement(before, {
            style: {
              ...before.props.style,
              width: GROUP_CHUNK_WIDTH,
            },
          })}
        {this.getInput(width ? `calc(100% - ${width}px)` : style.width)}
        {after &&
          React.cloneElement(after, {
            style: {
              ...after.props.style,
              width: GROUP_CHUNK_WIDTH,
            },
          })}
      </InputGroup>
    );
  };

  public hasRightInputGourp = () => {
    const { after } = this.props;
    return !!after;
  };

  public getRightOffset = () => {
    const subtype = (this.props as InputPolymProps).subtype;

    if (subtype !== 'editing') return;

    const type = this.getType();

    let right = 8;
    if (['email', 'number', 'cascader', 'select'].indexOf(type) !== -1) {
      right = 28;
    }
    if (['date', 'time'].indexOf(type) !== -1) {
      right = 32;
    }
    if (this.hasRightInputGourp()) {
      right += GROUP_CHUNK_WIDTH;
    }
    return right;
  };

  public render() {
    const {
      raw,
      status,
      statusTip,
      wrapperClassName,
      statusTipVisible,
      loading,
      wrapperStyle,
      statusTipPlacement,
    } = this.props as InputProps;

    const tooltipProps: TooltipProps = {
      title: statusTip,
      placement: statusTipPlacement,
      arrowPointAtCenter: true,
    };

    if ('statusTipVisible' in this.props) {
      tooltipProps.visible = statusTipVisible;
    }

    if (raw) {
      return this.getGroupInput();
    }

    return (
      <Loading loading={!!loading}>
        <div className={classnames(`tongyu-input`, wrapperClassName)} style={wrapperStyle}>
          {this.getGroupInput()}
          {status && (
            <Tooltip {...tooltipProps}>
              <span
                onMouseEnter={this.onTipMouseEnter}
                onMouseLeave={this.onTipMouseLeave}
                className={`tongyu-input-status`}
                style={{ right: this.getRightOffset() }}
              >
                <Icon type={STATUS_ICON_MAP[status] || status} />
              </span>
            </Tooltip>
          )}
        </div>
      </Loading>
    );
  }
}

export default Input;
