import { COMPUTED_LEG_FIELD_MAP } from '@/constants/global';
import { COMPUTED_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Form2 } from '@/containers';
import { InputBase } from '@/components/type';
import { Tag, Icon } from 'antd';
import Import4 from '@/containers/DeltaModalInput';
import _ from 'lodash';
import { LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';

class DeltaModalInput extends InputBase {
  public state = {
    visible: false,
  };

  public hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  public renderEditing() {
    const { value = {}, onChange, onValueChange, record } = this.props;
    return (
      <>
        <div style={{ position: 'relative' }}>
          {_.values(value).join(', ')}
          <Icon
            type="alert"
            theme="twoTone"
            onClick={() => {
              this.setState({ visible: true });
            }}
            style={{
              position: 'absolute',
              right: 0,
              transform: 'translateY(-50%)',
              top: '50%',
            }}
          />
        </div>
        <Import4
          visible={this.state.visible}
          value={record}
          onChange={onChange}
          onValueChange={onValueChange}
          hideModal={this.hideModal}
        />
      </>
    );
  }

  public renderRendering() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return <>{_.values(value).join(', ')}</>;
  }
}

// {
//   /* <FormItem>{form.getFieldDecorator()(<UnitInputNumber unit="手" editing={false} />)}</FormItem> */
// }

export const Delta: ILegColDef = {
  title: 'DELTA',
  dataIndex: COMPUTED_LEG_FIELD_MAP.DELTA,
  defaultEditing: false,
  onHeaderCell: () => {
    return {
      style: COMPUTED_HEADER_CELL_STYLE,
    };
  },
  getUnit: () => '手',
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator()(
          record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.SPREAD_EUROPEAN ||
            record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RATIO_SPREAD_EUROPEAN ? (
            <DeltaModalInput record={record} />
          ) : (
            <UnitInputNumber unit="手" editing={false} />
          )
        )}
      </FormItem>
    );
  },
};
