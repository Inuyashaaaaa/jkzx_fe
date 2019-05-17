import { Form2 } from '@/design/components';
import { Alert, Button, Form, Icon, Input, Modal, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import _ from 'lodash';
import React, { Component } from 'react';
import styles from './Login.less';
import UpdatePassword from './UpdatePassword';

// const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

// eslint-disable-next-line react/no-multi-comp
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
  pwdUpdating: loading.effects['login/updatePassword'],
}))
class LoginPage extends Component<any> {
  public componentDidMount() {
    this.queryCaptcha();
  }

  public queryCaptcha = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/queryCaptcha',
      payload: {},
    });
  };

  public handleSubmit = async () => {
    const { error, values } = await this.loginForm.validate();
    if (error) return;

    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: values,
    });
  };

  public hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/hideUpdatePassword',
      payload: {},
    });
  };

  public handleModalOK = async () => {
    const { error, values } = await this.$updatePassword.validate();
    const { username, oldPassword, password } = values;
    const params = {
      username,
      newPassword: password,
      oldPassword,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'login/updatePassword',
      payload: params,
    });
  };

  public render() {
    const { login, submitting, pwdUpdating } = this.props;
    return (
      <div className={styles.main}>
        <Form2
          ref={form => {
            this.loginForm = form;
          }}
          columnNumberOneRow={1}
          layout="horizontal"
          wrapperCol={{ span: 24 }}
          dataSource={login.loginFormData}
          onFieldsChange={(props, fields) => {
            this.props.dispatch({
              type: 'login/changeForm',
              payload: {
                ...login.loginFormData,
                ...fields,
              },
            });
          }}
          columns={[
            {
              dataIndex: 'username',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true, message: '请输入用户名' }],
                    })(
                      <Input
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="请输入用户名"
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              dataIndex: 'password',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true, message: '请输入密码' }],
                    })(
                      <Input.Password
                        size="large"
                        style={{ width: '100%' }}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入密码"
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              dataIndex: 'captcha',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    <Row type="flex" justify="space-between">
                      {form.getFieldDecorator({
                        rules: [{ required: true, message: '请输入验证码' }],
                      })(
                        <Input
                          size="large"
                          placeholder="请输入验证码"
                          style={{ width: 'auto', flexGrow: 1 }}
                          prefix={
                            <Icon type="security-scan" style={{ color: 'rgba(0,0,0,.25)' }} />
                          }
                        />
                      )}

                      <img
                        style={{ width: 150, cursor: 'pointer' }}
                        src={login.img}
                        alt="验证码"
                        onClick={() => this.queryCaptcha()}
                      />
                    </Row>
                  </FormItem>
                );
              },
            },
          ]}
          footer={
            <Form.Item>
              <Button
                size="large"
                type="primary"
                block={true}
                onClick={this.handleSubmit}
                loading={submitting}
              >
                登 录
              </Button>
            </Form.Item>
          }
        />

        <Modal
          title="更新密码"
          visible={login.showPasswordUpdate}
          onCancel={this.hideModal}
          onOk={this.handleModalOK}
          confirmLoading={pwdUpdating}
        >
          <Alert
            showIcon={true}
            type="info"
            message="密码超过有效期，请修改新密码，更新后请重新登录"
            style={{ marginBottom: 20 }}
          />
          <UpdatePassword
            username={_.get(login.loginFormData, 'username')}
            ref={node => (this.$updatePassword = node)}
          />
        </Modal>
      </div>
    );
  }
}

export default LoginPage;
