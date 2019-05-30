import { wkApproveGroupList } from '@/services/auditing';
import _ from 'lodash';
import { Select } from '@/containers';
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

  const fetchOptions = async () => {
    const { data, error } = await wkApproveGroupList();
    if (error) return;
    setValue(props.value);
    return _.sortBy(
      data.map(item => ({
        value: item.approveGroupId,
        label: item.approveGroupName,
      }))
    );
  };

  return (
    <Select
      defaultOpen={false}
      autoSelect={true}
      mode="multiple"
      value={value}
      options={fetchOptions}
      editing={editing}
    />
  );
});

export default GroupSelcet;
