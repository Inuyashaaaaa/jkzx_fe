import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Input, Select } from '@/design/components';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ParticipationRate: ILegColDef = {
  title: '参与率',
  dataIndex: LEG_FIELD.PARTICIPATION_RATE,
  editable: true,
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber unit="%" autoSelect={true} editing={editing} />)}
      </FormItem>
    );
  },
};
