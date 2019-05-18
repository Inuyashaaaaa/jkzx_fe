import { LEG_FIELD } from '@/constants/common';
import { DatePicker, Form2 } from '@/components';
import { qlIsHoliday } from '@/services/volatility';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Icon, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';

const Cpt = memo<any>(
  connect(state => {
    return {
      expirationDate: state.expirationDate,
    };
  })(props => {
    const { form, editing, value, expirationDate, record } = props;
    const { volatilityCalendars } = expirationDate;
    const [showTip, setShowTip] = useState(false);

    const handleDatePickerChange = _.debounce(async () => {
      if (!volatilityCalendars) return;
      const { error, data } = await qlIsHoliday({
        calendars: volatilityCalendars,
        date: value.format('YYYY-MM-DD'),
      });

      if (error) return;
      setShowTip(!data);
    }, 350);

    useEffect(() => {
      console.log(record);
      if (!editing && Form2.fieldValueIsChange(LEG_FIELD.EXPIRATION_DATE, record)) {
        console.log(form.getFieldValue(LEG_FIELD.EXPIRATION_DATE), value);
        handleDatePickerChange();
      }
    });

    const visible = volatilityCalendars && showTip;

    return (
      <FormItem>
        {visible ? (
          <Tooltip
            title="该到期日并非交易日"
            trigger="hover"
            placement="right"
            arrowPointAtCenter={true}
          >
            {form.getFieldDecorator(LEG_FIELD.EXPIRATION_DATE, {
              rules: [getRequiredRule()],
            })(<DatePicker defaultOpen={true} editing={editing} format={'YYYY-MM-DD'} />)}
            <Icon
              type="alert"
              theme="twoTone"
              style={{
                position: 'absolute',
                right: 10,
                transform: 'translateY(-50%)',
                top: '50%',
              }}
            />
          </Tooltip>
        ) : (
          form.getFieldDecorator(LEG_FIELD.EXPIRATION_DATE, {
            rules: [getRequiredRule()],
          })(<DatePicker defaultOpen={true} editing={editing} format={'YYYY-MM-DD'} />)
        )}
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
    return <Cpt value={value} form={form} editing={editing} record={record} />;
  },
};
