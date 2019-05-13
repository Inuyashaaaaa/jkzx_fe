import { LEG_FIELD } from '@/constants/common';
import { InputNumber } from '@/design/components';
import { getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const UnderlyerMultiplier: ILegColDef = {
  title: '合约乘数',
  dataIndex: LEG_FIELD.UNDERLYER_MULTIPLIER,
  editable: record => {
    return false;
  },
  defaultEditing: false,
  render: (val, record, dataIndex, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<InputNumber editing={false} />)}
      </FormItem>
    );
  },
  //   getValue: {
  //     depends: [LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
  //     value: record => {
  //       return mktInstrumentInfo({
  //         instrumentId: record[LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
  //       }).then(rsp => {
  //         if (rsp.error || undefined === rsp.data.instrumentInfo.multiplier) return 1;
  //         return new BigNumber(rsp.data.instrumentInfo.multiplier)
  //           .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
  //           .toNumber();
  //       });
  //     },
  //   },
};
