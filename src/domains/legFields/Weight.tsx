import { InputBase } from '@/components/type';
import { LEG_FIELD } from '@/constants/common';
import { Import2 } from '@/containers/InstrumentModalInput';
import { getRequiredRule, legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Icon, Tag } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

class WeightModalInput extends InputBase {
  public state = {
    visible: false,
  };

  public hideModal = () => {
    this.setState({ visible: false });
  };
  public renderEditing() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        <div style={{ position: 'relative' }}>
          {value.map((item, index) => {
            return <Tag key="index">{item.weight}</Tag>;
          })}
          <Icon
            type="alert"
            onClick={() => {
              this.setState({ visible: true });
            }}
            style={{
              position: 'absolute',
              top: '50%',
              right: 10,
            }}
          />
        </div>

        <Import2
          visible={this.state.visible}
          value={value}
          onChange={onChange}
          onValueChange={onValueChange}
          hideModal={this.hideModal}
        />
      </>
    );
  }

  public renderRendering() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        {value.map((item, index) => {
          return <Tag key="index">{item.weight}</Tag>;
        })}
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
        })(<WeightModalInput editing={editing} record={record} />)}
      </FormItem>
    );
  },
};
