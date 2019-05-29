import Page from '@/containers/Page';
import TabHeader from '@/containers/TabHeader';
import {
  wkProcessGet,
  wkProcessStatusModify,
  wkProcessConfigModify,
} from '@/services/approvalProcessConfiguration';
import { wkApproveGroupList } from '@/services/auditing';
import _ from 'lodash';
import { GTE_PROCESS_CONFIGS, REVIEW_DATA, TASKTYPE } from '../constants';
import { List, Switch, notification, Row, Col, Checkbox, Alert, Tag, Modal, Button } from 'antd';
import { Table2, Select, Form2, Input } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState } from 'react';

const GroupSelcet = memo<{
  value: any;
  record: object;
  index: number;
  formData?: any;
}>(props => {
  const [options, setOptions] = useState([]);
  const { record, index, formData } = props;
  const { form } = formData;
  const [editing, setEditing] = useState(formData.editing);
  const [value, setValue] = useState([]);
  useEffect(
    () => {
      if (props.value) {
        fetchData();
      }
    },
    [props.value]
  );

  const fetchData = async () => {
    const { data, error } = await wkApproveGroupList();
    if (error) return;
    setOptions(
      _.sortBy(
        data.map(item => ({
          value: item.approveGroupId,
          label: item.approveGroupName,
        }))
      )
    );
    setValue(props.value);
  };
  return (
    <FormItem>
      {form.getFieldDecorator({
        rules: [{ required: true }],
      })(
        <Select
          defaultOpen={false}
          autoSelect={true}
          mode="multiple"
          // value={value}
          options={options}
          editing={editing}
        />
      )}
    </FormItem>
  );
});

export default GroupSelcet;
