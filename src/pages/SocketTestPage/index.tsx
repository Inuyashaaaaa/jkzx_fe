import { Form2, Input } from '@/design/components';
import { getToken } from '@/lib/utils/authority';
import { message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import produce from 'immer';
import React, { PureComponent } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class SocketTestPage extends PureComponent {
  public form: Form2;

  public sock: any;

  public stomp: Stomp;

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
        () => this.stomp.disconnect()
      );
    }

    const values = this.form.decoratorForm.getFieldsValue();
    const { address, channel, sendChannel } = values;
    if (!address) return message.error('address not exist.');
    if (!channel) return message.error('channel not exist.');
    if (!sendChannel) return message.error('sendChannel not exist.');

    return this.setState(
      {
        linked: true,
      },
      () => this.createSocket(address, channel, sendChannel)
    );
  };

  public createSocket = (address, channel, sendChannel) => {
    const sock = (this.sock = new SockJS(address));
    const stomp = (this.stomp = Stomp.over(sock));
    // sock.onopen = () => {
    //   this.print('sock:open');
    // };

    // sock.onmessage = e => {
    //   this.print('sock:message: ' + JSON.stringify(e.data));
    // };

    // sock.onclose = e => {
    //   this.print('sock:close');
    // };

    stomp.sendChannel = sendChannel;
    stomp.channel = channel;
    stomp.connect(
      'admin',
      '12345',
      frame => {
        stomp.subscribe(channel, message => {
          this.print('stomp:message: ' + JSON.stringify(message));
        });
      },
      error => {
        console.error(error);
      }
    );
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

    this.print('stomp:send: ' + JSON.stringify(message));
    this.stomp.send(this.stomp.sendChannel, {}, JSON.stringify(message));
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
                      initialValue: 'http://10.1.100.219:16000/wsReport',
                    })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: 'channel',
              dataIndex: 'channel',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem hasFeedback={true}>
                    {form.getFieldDecorator('channel', {
                      initialValue: '/topic/notice',
                    })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: 'send:channel',
              dataIndex: 'sendChannel',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem hasFeedback={true}>
                    {form.getFieldDecorator('sendChannel', {
                      initialValue: '/topic/message',
                    })(<Input />)}
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
