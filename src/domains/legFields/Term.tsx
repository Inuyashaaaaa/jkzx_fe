import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { Form2 } from '@/design/components';

export const Term: ILegColDef = {
  title: '期限',
  dataIndex: LEG_FIELD.TERM,
  exsitable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isPricing) {
      return true;
    }
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
      } else {
        return false;
      }
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
        } else {
          return {
            ...commonProps,
            autoSelect: true,
            editing: false,
          };
        }
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
          <UnitInputNumber
            autoSelect={true}
            editing={editing}
            unit="天"
            precision={0}
            {...getProps()}
          />
        )}
      </FormItem>
    );
  },
};
