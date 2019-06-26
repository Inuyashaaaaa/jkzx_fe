import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Divider, Button, notification, Row } from 'antd';
import { Select, Table2 } from '@/containers';

const GroupSelcet = memo<any>(props => {
  const { cellApi, value: _value } = props;
  const [value, setValue] = useState(_value);
  const { options, mode, editing, onChange } = props;

  const handleOk = () => {
    cellApi.saveCell();
  };

  return (
    <Select
      open={editing}
      editing={editing}
      autoSelect={true}
      options={options}
      mode={mode}
      value={value}
      onChange={val => {
        onChange(val);
        setValue(val);
      }}
      dropdownRender={menu => {
        return (
          <>
            {menu}
            <Divider style={{ margin: '6px 0' }} />
            <Row type="flex" justify="end" style={{ padding: '8px' }}>
              <Button size="small" type="primary" onClick={handleOk}>
                确认
              </Button>
            </Row>
          </>
        );
      }}
    />
  );
});

export default GroupSelcet;
