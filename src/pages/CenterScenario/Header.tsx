import React, { memo, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
import { Form2 } from '@/containers';
import ThemeSelect from '@/containers/ThemeSelect';
import { IFormColDef } from '@/components/type';
import ThemeInputNumber from '@/containers/ThemeInputNumber';

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const Header = memo(props => {
  const [searchFormData, setSearchFormData] = useState({});

  const onSearchFormChange = () => {
    console.log('searchFormChange');
  };

  const onSearch = () => {
    console.log('onSearch');
  };

  const searchFormControls: IFormColDef[] = [
    {
      title: '标的物',
      dataIndex: 'underlyer',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({})(
            <ThemeSelect
              options={[
                {
                  label: '000010.SHF',
                  value: '000010.SHF',
                },
                {
                  label: '81828.SHF',
                  value: '81828.SHF',
                },
              ]}
            ></ThemeSelect>,
          )}
        </FormItem>
      ),
    },
    {
      title: '情景个数',
      dataIndex: 'seniorNumber',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({})(
            <ThemeInputNumber style={{ minWidth: 200 }}></ThemeInputNumber>,
          )}
        </FormItem>
      ),
    },
  ];

  return (
    <FormItemWrapper>
      <Form2
        dataSource={searchFormData}
        onFieldsChange={onSearchFormChange}
        onSubmitButtonClick={onSearch}
        submitText="确定"
        resetable={false}
        columns={searchFormControls}
        layout="inline"
      ></Form2>
    </FormItemWrapper>
  );
});

export default Header;
