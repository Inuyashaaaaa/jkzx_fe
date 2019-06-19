import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Divider, Button, notification } from 'antd';
import { Form2, Select, Table2 } from '@/containers';

const GroupSelcet = memo<any>(props => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(props.value);
  const {
    handleValueChanged,
    defaultOpen,
    autoSelect,
    options,
    mode,
    record,
    index,
    form,
    editing,
  } = props;

  const handleOk = () => {
    handleValueChanged(record, value);
    setOpen(false);
  };

  const handleCancle = () => {
    setOpen(false);
  };

  return (
    <Select
      open={open}
      editing={editing}
      autoSelect={true}
      options={options}
      mode={mode}
      value={value}
      onChange={val => {
        setValue(val);
      }}
      onFocus={() => {
        setOpen(true);
      }}
      dropdownRender={menu => {
        return (
          <>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ padding: '8px', cursor: 'pointer' }}>
              <Button type="primary" style={{ marginRight: '15px' }} onClick={handleOk}>
                确认
              </Button>
              <Button onClick={handleCancle}>取消</Button>
            </div>
          </>
        );
      }}
    />
  );
});

export default GroupSelcet;
