import { Input, Row } from 'antd';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import { TextArea2Props } from './types';

const { TextArea } = Input;

export interface ITextArea2Props extends TextArea2Props {
  showMaxLength?: boolean;
  showResetButton?: boolean;
}

class TextArea2 extends InputPolym<ITextArea2Props> {
  public cacheValue: string;

  public formatValue = (value): string => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return value;
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event.target.value,
    };
  };

  public parseValue = value => {
    return value;
  };

  public catchInitValue = value => {
    if (value && !this.cacheValue) {
      this.cacheValue = value;
    }
  };

  public resetValue = () => {
    this._onChange({ target: { value: this.cacheValue } });
  };

  public renderEditing(props, onChange) {
    this.catchInitValue(props.value);

    const { showMaxLength, showResetButton, ...rest } = props;
    return (
      <>
        <TextArea {...rest} onChange={onChange} />
        {(showMaxLength || showResetButton) && (
          <Row type="flex" justify="end">
            {showResetButton && (
              <a
                href="javascript:;"
                onClick={this.resetValue}
                style={{
                  fontSize: 12,
                  paddingRight: 6,
                }}
              >
                恢复默认
              </a>
            )}
            {showMaxLength && (
              <span style={{ color: '#777', fontSize: 12 }}>
                {props.value.length} / {props.maxLength}
              </span>
            )}
          </Row>
        )}
      </>
    );
  }
}

export default TextArea2;
