/* eslint-disable */
import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState } from 'react';
import { Divider, Button, notification, Row } from 'antd';
import { wkApproveGroupList } from '@/services/auditing';
import { Form2, Select, Table2 } from '@/containers';
import {
  wkProcessConfigModify,
  wkProcessGet,
  wkProcessInstanceListByProcessName,
  wkProcessModify,
  wkProcessStatusModify,
  wkTaskApproveGroupBind,
} from '@/services/approvalProcessConfiguration';

const { Option } = Select;
const GroupSelcet = memo<{
  value: any;
  record: object;
  index: number;
  form?: any;
  editing?: any;
}>(props => {
  const [options, setOptions] = useState(null);
  const { record, index, form, editing, processName, fetchData } = props;
  const [open, setOpen] = useState();
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    fetchOptions();
  }, [props.record]);

  const fetchOptions = async () => {
    const { data, error } = await wkApproveGroupList();
    if (error) return;
    const optionsData = data.map(item => ({
      value: item.approveGroupId,
      label: item.approveGroupName,
    }));
    setOptions(_.sortBy(optionsData, 'label'));
  };

  const handleOk = async () => {
    // 修改单个审批组
    const task = Form2.getFieldsValue(record);
    const { error, data } = await wkTaskApproveGroupBind({
      processName,
      taskList: [
        {
          taskId: task.taskId,
          approveGroupList: value,
        },
      ],
    });
    if (error) {
      return;
    }
    const cloneData = { ...data };
    cloneData.tasks = cloneData.tasks.map(item => {
      item.approveGroupList = item.approveGroups.map(i => i.approveGroupId);
      return item;
    });

    notification.success({
      message: `${processName}流程保存成功`,
    });
    // 页面刷新数据
    if (fetchData) {
      fetchData();
    }
  };

  if (!options) {
    return (
      <Select
        defaultOpen
        autoSelect
        mode="multiple"
        options={options}
        editing={editing}
        value={[]}
      />
    );
  }

  if (!_.get(props, 'editing')) {
    return (
      <Select
        defaultOpen
        autoSelect
        mode="multiple"
        options={options}
        editing={editing}
        value={value}
      />
    );
  }
  return (
    <Select
      defaultOpen
      autoSelect
      mode="multiple"
      options={options}
      editing={editing}
      value={value}
      onChange={val => {
        setValue(val);
      }}
      dropdownRender={menu => (
        <>
          {menu}
          <Divider style={{ margin: '4px 0' }} />
          <Row
            onMouseDown={e => e.preventDefault()}
            type="flex"
            justify="end"
            style={{ padding: '8px' }}
          >
            <Button size="small" type="primary" onClick={handleOk}>
              确认
            </Button>
          </Row>
        </>
      )}
    />
  );
});

export default GroupSelcet;
