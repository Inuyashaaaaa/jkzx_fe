import { Form2 } from '@/containers';
import { Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';

class UpdatePassword extends PureComponent<any> {
  public state = {
    formData: {},
  };

  public validate = () => {
    return this.form.validate();
  };

  public testPassword = (rule, value, callback) => {
    const reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/;
    if (value && !reg.test(value)) {
      callback('密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位');
    } else {
      callback();
    }
  };

  public validateConfirm = (rule, value, callback) => {
    if (value && value !== Form2.getFieldValue(_.get(this.state.formData, 'password'))) {
      callback('请与新密码保持一致');
    } else {
      callback();
    }
  };

  public render() {
    return (
      <Form2
        footer={false}
        ref={node => {
          this.form = node;
        }}
        dataSource={{
          ...this.state.formData,
          username: this.props.username,
        }}
        onFieldsChange={(props, fields) => {
          this.setState({
            formData: {
              ...this.state.formData,
              ...fields,
            },
          });
        }}
        columns={[
          {
            title: '用户名',
            dataIndex: 'username',
            render: (val, record, index, { form }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名',
                      },
                    ],
                  })(<Input disabled={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: '原密码',
            dataIndex: 'oldPassword',
            render: (val, record, index, { form }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '请输入原密码',
                      },
                    ],
                  })(<Input.Password />)}
                </FormItem>
              );
            },
          },
          {
            title: '新密码',
            dataIndex: 'password',
            render: (val, record, index, { form }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '请输入新密码',
                      },
                      {
                        validator: this.testPassword,
                      },
                    ],
                  })(<Input.Password />)}
                </FormItem>
              );
            },
          },
          {
            title: '确认密码',
            dataIndex: 'confirmPassword',
            render: (val, record, index, { form }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '请输入与新密码一致的确认密码',
                      },
                      {
                        validator: this.validateConfirm,
                      },
                    ],
                  })(<Input.Password />)}
                </FormItem>
              );
            },
          },
        ]}
      />
    );
  }
}

export default UpdatePassword;
