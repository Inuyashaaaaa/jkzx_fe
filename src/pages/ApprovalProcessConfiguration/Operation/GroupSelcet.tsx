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
  // useEffect(
  //   () => {
  //     if (props.value) {
  //       console.log(props.value)
  //       fetchData();
  //     }
  //   },
  //   [props.value]
  // );

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
  console.log(value);
  return (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '至少选择一个审批组',
          },
        ],
      })(
        <Select
          defaultOpen={false}
          autoSelect={true}
          mode="multiple"
          options={fetchOptions}
          editing={editing}
        />
      )}
    </FormItem>
  );
});

export default GroupSelcet;
