import { DatePicker, Form2 } from '@/containers';
import { LEG_FIELD } from '@/constants/common';
import { qlIsHoliday } from '@/services/volatility';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Icon, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import React, { memo, useState } from 'react';

const ExpirationDateInput = memo<any>(
  connect(state => {
    return {
      expirationDate: state.expirationDate,
    };
  })(props => {
    const { form, editing, expirationDate } = props;
    const { volatilityCalendars } = expirationDate;
    const [showTip, setShowTip] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDatePickerChange = async date => {
      if (!volatilityCalendars) return;
      setLoading(true);
      const { error, data } = await qlIsHoliday({
        calendars: volatilityCalendars,
        date: date.format('YYYY-MM-DD'),
      });
      setLoading(false);

      if (error) return;
      setShowTip(data);
    };

    const visible = volatilityCalendars && showTip;

    return (
      <FormItem>
        <Tooltip
          title="该到期日并非交易日"
          trigger="hover"
          placement="right"
          arrowPointAtCenter={true}
          visible={visible}
        >
          {form.getFieldDecorator({
            rules: [getRequiredRule()],
          })(
            <DatePicker
              onChange={handleDatePickerChange}
              defaultOpen={true}
              editing={editing}
              format={'YYYY-MM-DD'}
              suffixIcon={loading ? <Icon type="loading" /> : null}
            />
          )}
        </Tooltip>
      </FormItem>
    );
  })
);

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
  defaultEditing: false,
  render: (value, record, index, { form, editing, colDef }) => {
    return <ExpirationDateInput value={value} form={form} editing={editing} record={record} />;
  },
};
