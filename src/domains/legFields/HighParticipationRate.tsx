import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP, UNIT_ENUM_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { Form2 } from '@/design/components';

export const HighParticipationRate: ILegColDef = {
  title: '高参与率',
  dataIndex: LEG_FIELD.HIGH_PARTICIPATION_RATE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber autoSelect={true} editing={editing} unit={'%'} />)}
      </FormItem>
    );
  },
};
