import { Form, Input } from 'antd';
import React, { PureComponent } from 'react';

class PasswordModify extends PureComponent {
  public testPassword = (rule, value, callback) => {
    const reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/;
    if (value && !reg.test(value)) {
      callback('密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位');
    } else {
      callback();
    }
  };

  public validateConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('请与新密码保持一致');
    } else {
      callback();
    }
  };

  public render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form>
        <Form.Item label="新密码" {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入新密码！',
              },
              {
                validator: this.testPassword,
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item label="确认密码" {...formItemLayout}>
          {getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: '请输入与新密码一致的确认密码！',
              },
              {
                validator: this.validateConfirm,
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
      </Form>
    );
  }
}

const PasswordForm = Form.create({ name: 'modifyPassword' })(PasswordModify);
export default PasswordForm;
