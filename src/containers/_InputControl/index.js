import BigCascader from '@/containers/BigCascader';
import ButtonItem from '@/containers/ButtonPlus';
import CascaderPlus from '@/containers/CascaderPlus';
import CheckboxPlus from '@/containers/CheckboxPlus';
import DatePickerPlus from '@/containers/DatePickerPlus';
import { FormControl as types } from '@/containers/_InputControl/types';
import InputNumberPlus from '@/containers/_InputNumberPlus';
import InputPlus from '@/containers/_InputPlus';
import SelectPlus from '@/containers/_SelectPlus';
import TimePickerPlus from '@/containers/_TimePickerPlus';
import ToolEditor from '@/containers/_ToolEditor';
import UploadPlus from '@/containers/_UploadPlus';
import { Input } from 'antd';
import React, { PureComponent } from 'react';

const InputGroup = Input.Group;

const formControlMaps = {
  select: SelectPlus,
  number: InputNumberPlus,
  time: TimePickerPlus,
  date: DatePickerPlus,
  input: InputPlus,
  cascader: CascaderPlus,
  file: UploadPlus,
  checkbox: CheckboxPlus,
  toolEditor: ToolEditor,
  bigCascader: BigCascader,
};

class FormControl extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    type: 'input',
  };

  getInputGroup = ({ cellComponent, after, before }) => {
    return (
      <InputGroup compact style={{ width: '100%' }}>
        <div style={{ display: 'flex' }}>
          {before?.map(item => {
            return <ButtonItem key={item.name} {...item} />;
          })}
          {cellComponent}
          {after?.map(item => {
            return <ButtonItem key={item.name} {...item} />;
          })}
        </div>
      </InputGroup>
    );
  };

  // 将所有表单中回调的值改成一致的格式
  handleConsistentChange = (...args) => {
    const { type, onChange, onChangePlus } = this.props;

    let beautyValue;

    if (type === 'number') {
      const [value] = args;
      beautyValue = value;
    } else if (type === 'select') {
      const [value] = args;
      beautyValue = value;
    } else if (type === 'input') {
      beautyValue = args[0].target.value;
    }

    onChange?.(...args);
    onChangePlus?.({ type, value: beautyValue });
  };

  render() {
    const {
      type,
      style,
      addonAfterBtnItems,
      addonBeforeBtnItems,
      onChangePlus,
      ...rest
    } = this.props;

    const cellProps = {
      ...rest,
      style: {
        ...style,
        ...(addonAfterBtnItems || addonBeforeBtnItems ? { flexGrow: 1 } : undefined),
      },
      onChange: this.handleConsistentChange,
    };

    if (!formControlMaps[type]) {
      throw new Error(`FormControl: ${type} is not valid!`);
    }

    const cellComponent = React.createElement(formControlMaps[type], cellProps);

    if (addonBeforeBtnItems || addonAfterBtnItems) {
      return this.getInputGroup({
        cellComponent,
        after: addonAfterBtnItems,
        before: addonBeforeBtnItems,
      });
    }

    return cellComponent;
  }
}

export default FormControl;
