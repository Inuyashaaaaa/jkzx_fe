import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import { Button, Form, Icon, Modal, Row, Popconfirm, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { Form2 } from '@/containers';
import { IFormColDef } from '@/components/type';
import ThemeInput from '@/containers/ThemeInput';
import ThemeInputPassword from '@/containers/ThemeInputPassword';
import ThemeButton from '@/containers/ThemeButton';

const Wrap = styled.div`
  background: rgba(27, 38, 80, 1);
  height: 100vh;
  padding-top: 20vh;
  .wrap {
    height: 290px;
    width: 390px;
    margin: 0 auto;
    padding-top: 61px;
    border: 1px solid rgba(0, 232, 232, 1);
    background: rgba(0, 115, 139, 0.8);
    border-radius: 3;
  }
`;

const UserLayout = props => {
  const { login, submitting } = props;
  const [formData, setFormData] = useState({});

  const columns: IFormColDef[] = [
    {
      dataIndex: 'username',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <ThemeInput
              size="large"
              placeholder="请输入用户名"
              prefix={<Icon type="user" style={{ color: '#00BBFD' }} />}
            />,
          )}
        </FormItem>
      ),
    },
    {
      dataIndex: 'password',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <ThemeInputPassword
              size="large"
              prefix={<Icon type="lock" style={{ color: '#00BBFD' }} />}
              placeholder="请输入密码"
            />,
          )}
        </FormItem>
      ),
    },
  ];

  const handleSubmit = async () => {
    const { error, values } = await formData.validate();
    if (error) return;
    values.captcha = '';
    props.dispatch({
      type: 'login/login',
      payload: {
        loginParams: values,
        skipMenu: false,
        defaultRedirect: '/center/underlying',
        loginUrl: '/center/login',
        rootRouteTag: 'centerRoute',
        skipPermission: true,
      },
    });
  };
  return (
    <Wrap>
      <div className="wrap">
        <Form2
          ref={form => {
            setFormData(form);
          }}
          columnNumberOneRow={1}
          wrapperCol={{ span: 16, offset: 4 }}
          dataSource={login.loginFormData}
          onFieldsChange={(props2, fields) => {
            props.dispatch({
              type: 'login/changeForm',
              payload: {
                ...login.loginFormData,
                ...fields,
              },
            });
          }}
          columns={columns}
          footer={
            <Form.Item>
              <ThemeButton
                htmlType="submit"
                size="large"
                type="primary"
                block
                onClick={handleSubmit}
                loading={submitting}
              >
                登 录
              </ThemeButton>
            </Form.Item>
          }
        />
      </div>
    </Wrap>
  );
};

export default memo(
  connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login'],
  }))(UserLayout),
);
