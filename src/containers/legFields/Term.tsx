import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Form2 } from '@/containers';

export const Term: ILegColDef = {
  title: '期限',
  dataIndex: LEG_FIELD.TERM,
  exsitable: record => {
    if (Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL])) {
      return true;
    }
    return false;
  },
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const isAnnual = Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL]);

    if (isBooking) {
      return true;
    }

    if (isPricing) {
      if (isAnnual) {
        return true;
      }
      return false;
    }

    if (isEditing) {
      return false;
    }

    throw new Error('env not match!');
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getProps = () => {
      const commonProps = {
        unit: '天',
        precision: 0,
      };

      if (isPricing) {
        const isAnnual = Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL]);
        if (isAnnual) {
          return {
            ...commonProps,
            autoSelect: true,
            editing,
          };
        }
        return {
          ...commonProps,
          autoSelect: true,
          editing: false,
        };
      }

      if (isBooking) {
        return {
          ...commonProps,
          autoSelect: true,
          editing,
        };
      }

      if (isEditing) {
        return {
          ...commonProps,
          autoSelect: false,
          editing: false,
        };
      }

      throw new Error('env not match!');
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <UnitInputNumber autoSelect editing={editing} unit="天" precision={0} {...getProps()} />,
        )}
      </FormItem>
    );
  },
};
