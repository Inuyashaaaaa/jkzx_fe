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
  const [options, setOptions] = useState(null);
  const { record, index, form, editing } = props;
  const { value } = props;

  useEffect(
    () => {
      fetchOptions();
    },
    [props.record]
  );

  const fetchOptions = async () => {
    const { data, error } = await wkApproveGroupList();
    if (error) return;
    const optionsData = data.map(item => ({
      value: item.approveGroupId,
      label: item.approveGroupName,
    }));
    setOptions(_.sortBy(optionsData, 'label'));
  };

  if (!options) {
    return (
      <Select
        defaultOpen={false}
        autoSelect={true}
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
        defaultOpen={false}
        autoSelect={true}
        mode="multiple"
        options={options}
        editing={editing}
        value={value}
      />
    );
  }
  return (
    <Select
      defaultOpen={false}
      autoSelect={true}
      mode="multiple"
      options={options}
      editing={editing}
      value={value}
      onChange={val => {
        props.onChange(val);
      }}
    />
  );
});

export default GroupSelcet;
