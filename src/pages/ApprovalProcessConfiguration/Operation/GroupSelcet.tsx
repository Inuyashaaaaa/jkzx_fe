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
  const { record, index, formData } = props;
  const { form } = formData;
  const [editing, setEditing] = useState(formData.editing);
  const [value, setValue] = useState([]);

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
    setValue(props.value);
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
          options={options}
          editing={editing}
        />
      )}
    </FormItem>
  );
});

export default GroupSelcet;
