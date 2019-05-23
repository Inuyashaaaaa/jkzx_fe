import { omit } from 'lodash';
import React from 'react';
import { InputPolymProps } from './interface';
import ShowInput from './subtypes/ShowInput';
import { ShowInputProps } from './subtypes/ShowInput/types';
import StaticInput from './subtypes/StaticInput';
import { StaticInputProps } from './subtypes/StaticInput/types';

export abstract class InputPolym<P, S = any> extends React.PureComponent<
  InputPolymProps & P & (ShowInputProps | StaticInputProps),
  S
> {
  public abstract formatValue(value: any): any;

  public abstract parseValue(value: any): any;

  public abstract formatChangeEvent(...params: any[]): { origin: any; normal: any };

  public abstract renderEditing(
    omitedProps: any,
    onChange: (...params: any[]) => any
  ): React.ReactNode;

  public renderShow(props, onChange) {
    return <ShowInput {...props} value={this._formatValue(props.value)} />;
  }

  public renderStatic(props, onChange) {
    return <StaticInput {...props} value={this._formatValue(props.value)} />;
  }

  public _onChange = event => {
    const { origin, normal } = this._getChangedValue(event);
    if ('onChange' in this.props) {
      this.props.onChange(origin);
    }
    if ('onValueChange' in this.props) {
      this.props.onValueChange(normal);
    }
  };

  public render() {
    const omitedProps = omit(this.props, ['formatValue', 'onValueChange', 'subtype', 'getValue']);

    const { subtype } = this.props;

    if (subtype === 'show') {
      return this.renderShow(this.getChildProps(omitedProps), this._onChange);
    }

    if (subtype === 'static') {
      return this.renderStatic(this.getChildProps(omitedProps), this._onChange);
    }

    return this.renderEditing(this.getChildProps(omitedProps), this._onChange);
  }

  private _getChangedValue = event => {
    if ('formatChangeEvent' in this.props) {
      return this.props.formatChangeEvent(event);
    }
    return this.formatChangeEvent(event);
  };

  private _formatValue = value => {
    if ('formatValue' in this.props) {
      return this.props.formatValue(value);
    }

    return this.formatValue(value);
  };

  private _parseValue = () => {
    if ('parseValue' in this.props) {
      return this.props.parseValue(this.props.value);
    }
    return this.parseValue(this.props.value);
  };

  private getChildProps = omitedProps => {
    if ('value' in this.props) {
      return { ...omitedProps, value: this._parseValue() };
    }
    return omitedProps;
  };
}
