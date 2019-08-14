import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import { Button, Form, Icon, Modal, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { Form2 } from '@/containers';
import { IFormColDef } from '@/components/type';
import ThemeInput from '@/containers/ThemeInput';
import ThemeInputPassword from '@/containers/ThemeInputPassword';
import ThemeButton from '@/containers/ThemeButton';
// import user from '@/models/user';

const AdminWrap = styled.div`
  position: absolute;
  bottom: 22px;
  left: 40px;
  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  p {
    font-size: 14px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(197, 212, 231, 1);
    line-height: 32px;
    text-align: center;
  }
`;

const UserLayout = memo(props => {
  //   const { dispatch } = props;
  const [logon, setLogon] = useState(true);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState({
    pirture:
      'https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000',
    name: 'admin',
  });

  const handleSubmit = async () => {
    const values = Form2.getFieldsValue(formData);
    props.dispatch({
      type: 'login/login',
      payload: values,
    });
    setLogon(false);
  };

  const bodyStyle = {
    height: 290,
    background: 'rgba(0,115,139,0.8)',
    border: '1px solid rgba(0,232,232,1)',
    borderRadius: 3,
  };

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

  return (
    <>
      <AdminWrap>
        <img src={user.pirture} alt="头像" onClick={() => setLogon(true)}></img>
        <p>{user.name}</p>
      </AdminWrap>
      <Modal
        visible={logon}
        footer={false}
        closable={false}
        bodyStyle={bodyStyle}
        style={bodyStyle}
        width="410px"
      >
        <div style={{ marginTop: 25 }}>
          <Form2
            columnNumberOneRow={1}
            wrapperCol={{ span: 16, offset: 4 }}
            dataSource={formData}
            onFieldsChange={(props2, changedFields, allFields) => {
              setFormData({
                ...formData,
                ...changedFields,
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
                  //   loading={submitting}
                >
                  登 录
                </ThemeButton>
              </Form.Item>
            }
          />
        </div>
      </Modal>
    </>
  );
});

export default UserLayout;
