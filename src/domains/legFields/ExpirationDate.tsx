import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Form2 } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, legEnvIsEditing, getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ExpirationDate: ILegColDef = {
  title: '到期日',
  dataIndex: LEG_FIELD.EXPIRATION_DATE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const isAnnual = Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL]);
    if (isPricing) {
      if (isAnnual) {
        return false;
      } else {
        return true;
      }
    }
    if (isBooking) {
      return true;
    }
    if (isEditing) {
      return false;
    }
    throw new Error('env not match!');
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const isAnnual = Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL]);

    const getProps = () => {
      const commonProps = {
        defaultOpen: true,
        format: 'YYYY-MM-DD',
      };

      if (isPricing) {
        if (isAnnual) {
          return {
            ...commonProps,
            defaultOpen: false,
            editing: false,
          };
        } else {
          return {
            ...commonProps,
            defaultOpen: true,
            editing,
          };
        }
      }

      if (isBooking) {
        return {
          ...commonProps,
          editing,
        };
      }

      if (isEditing) {
        return {
          ...commonProps,
          defaultOpen: false,
          editing: false,
        };
      }

      throw new Error('env not match!');
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<DatePicker {...getProps()} />)}
      </FormItem>
    );
  },
  //   getValue: {
  //     depends: [LEG_FIELD.TERM, LEG_FIELD.EFFECTIVE_DATE],
  //     value: record => {
  //       const effectiveDate = record[LEG_FIELD.EFFECTIVE_DATE];
  //       const term = record[LEG_FIELD.TERM];
  //       if (record[LEG_FIELD.TERM] !== undefined && effectiveDate !== undefined) {
  //         return getMoment(effectiveDate, true).add(term, 'days');
  //       }
  //       return record[LEG_FIELD.EXPIRATION_DATE];
  //     },
  //   },
};
