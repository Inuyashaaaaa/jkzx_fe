import { InputBase } from '@/components/type';
import { LEG_FIELD } from '@/constants/common';
import { Import2 } from '@/containers/InstrumentModalInput';
import { getRequiredRule, legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Icon, Tag } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

class WeightModalInput extends InputBase {
  public renderEditing() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        <div style={{ position: 'relative' }}>
          {value
            .map((item, index) => {
              return item.weight;
            })
            .join(', ')}
          <Icon
            type="alert"
            theme="twoTone"
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
            }}
          />
        </div>
        <Import2 value={value} onChange={onChange} onValueChange={onValueChange} />
      </>
    );
  }

  public renderRendering() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        {value
          .map((item, index) => {
            return item.weight;
          })
          .join(', ')}
      </>
    );
  }
}

export const Weight: ILegColDef = {
  title: '权重',
  dataIndex: LEG_FIELD.WEIGHT,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    editing = isBooking || isPricing ? editing : false;
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<WeightModalInput editing={editing} />)}
      </FormItem>
    );
  },
};
