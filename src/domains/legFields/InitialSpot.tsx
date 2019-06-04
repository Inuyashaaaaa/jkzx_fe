import { LEG_FIELD, RULES_REQUIRED, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import { InputBase } from '@/components/type';
import { Import2 } from '@/containers/InstrumentModalInput';
import { Tag, Icon } from 'antd';
import React from 'react';

class InstrumentModalInput extends InputBase {
  public renderEditing() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        <div style={{ position: 'relative' }}>
          {value.map((item, index) => {
            return <Tag key="index">{item.initialSpot}</Tag>;
          })}
          <Icon
            type="alert"
            theme="twoTone"
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
            }}
          />
        </div>
        <Import2 value={value} onChange={onChange} onValueChange={onValueChange} />
      </>
    );
  }

  public renderRendering() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        {value.map((item, index) => {
          return <Tag key="index">{item.initialSpot}</Tag>;
        })}
      </>
    );
  }
}

export const InitialSpot: ILegColDef = {
  title: '期初价格',
  dataIndex: LEG_FIELD.INITIAL_SPOT,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          record[LEG_TYPE_FIELD].includes('SPREAD_EUROPEAN') ? (
            <InstrumentModalInput editing={editing} />
          ) : (
            <UnitInputNumber
              autoSelect={isBooking || isPricing}
              editing={isBooking || isPricing ? editing : false}
            />
          )
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
