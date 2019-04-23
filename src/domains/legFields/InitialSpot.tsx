import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const InitialSpot: ILegColDef = {
  title: '期初价格',
  dataIndex: LEG_FIELD.INITIAL_SPOT,
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <UnitInputNumber
            autoSelect={!(isBooking || isPricing)}
            editing={isBooking || isPricing ? true : editing}
          />
        )}
      </FormItem>
    );
  },
  //   getValue: {
  //     depends: [LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
  //     value: record => {
  //       return mktQuotesListPaged({
  //         instrumentIds: [record[LEG_FIELD.UNDERLYER_INSTRUMENT_ID]],
  //       }).then(rsp => {
  //         if (rsp.error) return undefined;
  //         return new BigNumber(
  //           _.chain(rsp)
  //             .get('data.page[0]')
  //             .omitBy(_.isNull)
  //             .get('last', 1)
  //             .value()
  //         )
  //           .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
  //           .toNumber();
  //       });
  //     },
  //   },
};
