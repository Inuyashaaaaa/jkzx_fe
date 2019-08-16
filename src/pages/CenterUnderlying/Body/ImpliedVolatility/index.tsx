import { IFormColDef } from '@/components/type';
import { Form2 } from '@/containers';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import ThemeSelect from '@/containers/ThemeSelect';
import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useRef, useState } from 'react';
import styled from 'styled-components';
import VolSurfaceCompare from './VolSurfaceCompare';

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const ImpliedVolatility = memo(props => {
  const formRef = useRef<Form2>(null);
  const [formData, setFormData] = useState({});

  const onSearch = () => {
    console.log(Form2.getFieldsValue(formData));
  };

  const onFormChange = (text, changedFields, allFields) => {
    setFormData({
      ...formData,
      ...changedFields,
    });
  };

  const FORM_CONTROLS: IFormColDef[] = [
    {
      title: '观察日期',
      dataIndex: 'valuationDate',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '观察日期是必填项',
              },
            ],
          })(<ThemeDatePickerRanger></ThemeDatePickerRanger>)}
        </FormItem>
      ),
    },
    {
      title: '窗口',
      dataIndex: 'window',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '窗口是必填项',
              },
            ],
          })(
            <ThemeSelect
              options={[1, 3, 5, 10, 22, 44, 66, 132].map(item => ({
                label: item,
                value: item,
              }))}
            ></ThemeSelect>,
          )}
        </FormItem>
      ),
    },
  ];

  return (
    <div style={{ border: '1px solid #05507b', padding: '15px 15px' }}>
      <Row type="flex" gutter={18}>
        <Col>
          <FormItemWrapper>
            <Form2
              hideRequiredMark
              ref={node => {
                formRef.current = node;
              }}
              dataSource={formData}
              onFieldsChange={onFormChange}
              columns={FORM_CONTROLS}
              layout="inline"
              footer={false}
            ></Form2>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton onClick={onSearch} type="primary">
            确定
          </ThemeButton>
        </Col>
      </Row>
      <VolSurfaceCompare></VolSurfaceCompare>
    </div>
  );
});

export default ImpliedVolatility;
