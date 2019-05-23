import { Icon, Tooltip } from 'antd';
import { TooltipPlacement, TooltipProps } from 'antd/lib/tooltip';
import classnames from 'classnames';
import React, { CSSProperties } from 'react';
import Loading from '../_Loading2';
import './Input.less';
import Cascader2, { Cascader2Props } from './types/Cascader';
import Checkbox2, { Checkbox2Props } from './types/Checkbox';
import DatePicker2, { DatePicker2Props } from './types/Date';
import Email2, { Email2Props } from './types/Email';
import Input2, { Input2Props, InputCommonProps } from './types/Input';
import InputNumber2, { InputNumber2Props } from './types/InputNumber';
import Select2, { Select2Props } from './types/Select';
import { FunctionShowInputProps } from './types/subtypes/ShowInput';
import { StaticInputProps } from './types/subtypes/StaticInput';
import TextArea2, { TextArea2Props } from './types/TextArea';
import TimePicker2, { TimePicker2Props } from './types/Time';
import Upload2, { Upload2Props } from './types/Upload';

export type InputType =
  | 'select'
  | 'input'
  | 'number'
  | 'date'
  | 'time'
  | 'checkbox'
  | 'textarea'
  | 'upload'
  | 'email'
  | 'cascader';

export type AllInputProps = InputProps &
  (
    | Input2Props
    | InputNumber2Props
    | Cascader2Props
    | DatePicker2Props
    | TimePicker2Props
    | Select2Props
    | Checkbox2Props
    | TextArea2Props
    | Upload2Props
    | Email2Props
    | FunctionShowInputProps
    | StaticInputProps
    | InputCommonProps);

export interface InputProps {
  type?: InputType;
  loading?: boolean;
  status?: 'error' | 'warning' | 'success' | 'validating' | 'info';
  statusTip?: string;
  wrapperStyle?: CSSProperties;
  statusTipVisible?: boolean;
  raw?: boolean;
  wrapperClassName?: string;
  onStatusTipMouseEnter?: (event: MouseEvent) => void;
  onStatusTipMouseLeave?: (event: MouseEvent) => void;
  statusTipPlacement?: TooltipPlacement;
}

const statusIconMap = {
  error: 'close-circle',
  success: 'check-circle',
  warning: 'warning',
  validating: 'loading',
  info: 'info-circle',
};

const InputComsMap = {
  input: Input2,
  select: Select2,
  number: InputNumber2,
  date: DatePicker2,
  time: TimePicker2,
  checkbox: Checkbox2,
  textarea: TextArea2,
  upload: Upload2,
  email: Email2,
  cascader: Cascader2,
};

class Input extends React.PureComponent<AllInputProps> {
  public static defaultProps = {
    subtype: 'editing',
    statusTipPlacement: 'topRight',
  };

  public getInput = () => {
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
      ...omitedProps
    } = this.props as InputProps;

    const type = this.getType();

    return React.createElement(InputComsMap[type], omitedProps);
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

    const subtype = (this.props as InputCommonProps).subtype;

    return raw ? (
      this.getInput()
    ) : (
      <Loading loading={!!loading}>
        <div className={classnames(`tongyu-input`, wrapperClassName)} style={wrapperStyle}>
          {this.getInput()}
          {status && (
            <Tooltip {...tooltipProps}>
              <span
                onMouseEnter={this.onTipMouseEnter}
                onMouseLeave={this.onTipMouseLeave}
                className={classnames(`tongyu-input-status`, {
                  offset: subtype === 'editing' && this.getType() === 'number',
                  'offset-lg':
                    subtype === 'editing' &&
                    ['date', 'time', 'select'].indexOf(this.getType()) !== -1,
                })}
              >
                <Icon type={statusIconMap[status] || status} />
              </span>
            </Tooltip>
          )}
        </div>
      </Loading>
    );
  }
}

export default Input;
