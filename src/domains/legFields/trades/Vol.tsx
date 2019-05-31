import { RULES_REQUIRED, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { legEnvIsPricing, getRequiredRule } from '@/tools';
import { Tag } from 'antd';
import { InputBase } from '@/components/type';
import InstrumentModalInput, { Import3 } from '@/containers/InstrumentModalInput';

// class VolModalInput extends InputBase {
//   public renderEditing() {
//     const { editing, value = [], onChange, onValueChange } = this.props;
//     return (
//       <>
//         {value.map((item, index) => {
//           return <Tag key="index">{item.instrumentId}</Tag>;
//         })}
//         <Import2 visible={true} value={value} onChange={onChange} onValueChange={onValueChange} />
//       </>
//     );
//   }

//   public renderRendering() {
//     const { editing, value = [], onChange, onValueChange } = this.props;
//     return (
//       <>
//         {value.map((item, index) => {
//           return <Tag key="index">{item.instrumentId}</Tag>;
//         })}
//       </>
//     );
//   }
// }

// record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.SPREAD_VERTICAL ? (
//   <InstrumentModalInput />
// ) :

export const Vol: ILegColDef = {
  editable: record => {
    const isPricing = legEnvIsPricing(record);
    if (isPricing) {
      return true;
    }
    return false;
  },
  title: '波动率',
  dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.VOL,
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<UnitInputNumber unit="%" editing={editing} autoSelect={true} />)}
      </FormItem>
    );
  },
};
