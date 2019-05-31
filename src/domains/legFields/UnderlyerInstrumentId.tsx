import { InputBase } from '@/components/type';
import { LEG_FIELD, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import { Input, Select } from '@/containers';
import { Import2 } from '@/containers/InstrumentModalInput';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';
import { getRequiredRule, legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Tag, Icon } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

class InstrumentModalInput extends InputBase {
  public renderEditing() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        <div style={{ position: 'relative' }}>
          {value.map((item, index) => {
            return <Tag key="index">{item.underlyerInstrumentId}</Tag>;
          })}
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
        {value.map((item, index) => {
          return <Tag key="index">{item.underlyerInstrumentId}</Tag>;
        })}
      </>
    );
  }
}

export const UnderlyerInstrumentId: ILegColDef = {
  title: '标的物',
  dataIndex: LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
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
        })(
          record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.SPREAD_EUROPEAN ? (
            <InstrumentModalInput editing={editing} />
          ) : editing ? (
            <Select
              defaultOpen={isBooking || isPricing}
              {...{
                editing,
                fetchOptionsOnSearch: true,
                placeholder: '请输入内容搜索',
                autoSelect: true,
                showSearch: true,
                options: async (value: string) => {
                  // const { data, error } = await mktInstrumentSearch({
                  //   instrumentIdPart: value,
                  // });
                  const { data, error } = await mktInstrumentWhitelistSearch({
                    instrumentIdPart: value,
                  });
                  if (error) return [];
                  return data.slice(0, 50).map(item => ({
                    label: item,
                    value: item,
                  }));
                },
              }}
            />
          ) : (
            <Input editing={editing} />
          )
        )}
      </FormItem>
    );
  },
};
