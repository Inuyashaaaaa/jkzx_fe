import { Form2, Input } from '@/design/components';
import { message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import produce from 'immer';
import React, { PureComponent } from 'react';
import SockJS from 'sockjs-client';

class SocketTestPage extends PureComponent {
  public form: Form2;

  public sock: any;

  public state = {
    contents: [],
    linked: false,
  };

  public link = e => {
    e.domEvent.preventDefault();

    if (this.state.linked) {
      if (!this.sock) return message.error('sock 未建立连接');
      return this.setState(
        {
          linked: false,
        },
        () => this.sock.close()
      );
    }

    const values = this.form.decoratorForm.getFieldsValue();
    const { address, token } = values;
    if (!address) return message.error('address not exist.');
    if (!token) return message.error('token not exist.');

    return this.setState(
      {
        linked: true,
      },
      () => this.createSocket(address, token)
    );
  };

  public createSocket = (address, token) => {
    const sock = (this.sock = new SockJS(address + '?' + token));

    sock.onopen = () => {
      this.print('open');
    };

    sock.onmessage = e => {
      this.print('message: ' + e.data);
    };

    sock.onclose = e => {
      this.print('close');
    };
  };

  public print = (message: string) => {
    this.setState(
      produce((state: any) => {
        state.contents.push(message);
      })
    );
  };

  public send = () => {
    const values = this.form.decoratorForm.getFieldsValue();
    const { message } = values;

    if (!message) return message.warn('消息内容不能是空');
    if (!this.sock) return message.warn('请先建立 socket 连接');

    this.print('send: ' + message);
    this.sock.send(message);
  };

  public getRef = node => (this.form = node);

  public render() {
    return (
      <div>
        <Form2
          ref={this.getRef}
          columns={[
            {
              title: '连接地址',
              dataIndex: 'address',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem hasFeedback={true}>
                    {form.getFieldDecorator('address', {
                      initialValue: value,
                    })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: 'query',
              dataIndex: 'token',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem hasFeedback={true}>
                    {form.getFieldDecorator('token', {
                      initialValue: value,
                    })(<Input placeholder="形式为 auth=xxxx" />)}
                  </FormItem>
                );
              },
            },
            {
              title: '消息内容',
              dataIndex: 'message',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem hasFeedback={true}>
                    {form.getFieldDecorator('message', {
                      initialValue: value,
                    })(<Input />)}
                  </FormItem>
                );
              },
            },
          ]}
          resetText="发送消息"
          submitText={this.state.linked ? '关闭连接' : '开始连接'}
          onSubmitButtonClick={this.link}
          onResetButtonClick={this.send}
        />
        <div style={{ padding: 10, border: '1px solid #000', margin: 20 }}>
          <div>监听内容</div>
          {this.state.contents.map(item => (
            <p>{item}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default SocketTestPage;
