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
    const { editing, value = {}, onChange, onValueChange, record } = this.props;
    console.log(this.props);
    return (
      <>
        <div style={{ position: 'relative' }}>
          {_.values(value).join(', ')}
          {/* <a
          href="javascript:;"
          style={{ position: 'absolute', right: 20, transform: 'translateY(-50%)', top: '50%' }}
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          详情
        </a> */}
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
    return (
      <>
        {_.values(value).join(', ')}
        <a
          href="javascript:;"
          style={{ position: 'absolute', right: 20, transform: 'translateY(-50%)', top: '50%' }}
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          详情
        </a>
      </>
    );
  }
}

{
  /* <FormItem>{form.getFieldDecorator()(<UnitInputNumber unit="手" editing={false} />)}</FormItem> */
}

export const Delta: ILegColDef = {
  title: 'DELTA',
  dataIndex: COMPUTED_LEG_FIELD_MAP.DELTA,
  defaultEditing: false,
  onHeaderCell: () => {
    return {
      style: COMPUTED_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return <FormItem>{form.getFieldDecorator()(<DeltaModalInput record={record} />)}</FormItem>;
  },
};
