import { Checkbox2Props } from '@/containers/_Form2/types/Checkbox';
import { Checkbox as AntdCheckbox } from 'antd';
import { omit } from 'lodash';
import React from 'react';
import { InputBase } from '../../components/type';

export interface ICheckbox2Props extends Checkbox2Props {
  renderingLabels: React.ReactNode[];
}

class Checkbox extends InputBase<ICheckbox2Props> {
  public static defaultProps = {
    editing: true,
    renderingLabels: ['是', '否'],
  };

  public onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(event.target.checked);
    }
  };

  public renderEditing() {
    return (
      <AntdCheckbox
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        style={{
          width: '100%',
          ...this.props.style,
        }}
        onChange={this.onChange}
        checked={this.props.value}
      />
    );
  }

  public renderRendering() {
    const { value, renderingLabels } = this.props;
    return (
      <span style={{ display: 'inline-block', width: '100%' }}>
        {value == null ? value : value ? renderingLabels[0] : renderingLabels[1]}
      </span>
    );
  }
}

export default Checkbox;
