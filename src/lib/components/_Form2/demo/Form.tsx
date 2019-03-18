import React, { PureComponent } from 'react';
import Form2 from '..';

class Form extends PureComponent<any, any> {
  public render() {
    return (
      <>
        <Form2
          controlNumberOneRow={3}
          controls={[
            {
              control: {
                label: 'name',
              },
              dataIndex: 'name',
              input: {
                type: 'input',
              },
              options: {
                rules: [
                  {
                    required: true,
                    message: 'name must be exsit',
                  },
                ],
              },
            },
            {
              control: {
                label: 'age',
              },
              dataIndex: 'age',
              input: {
                type: 'number',
                precision: 2,
                format: '0,0.00',
              },
            },
            {
              control: {
                label: 'dell',
              },
              dataIndex: 'dell',
              input: {
                type: 'select',
                options: [
                  {
                    label: 'name1',
                    value: 'name1',
                  },
                ],
              },
            },
          ]}
        />
      </>
    );
  }
}

export default {
  component: Form,
  title: 'Form一般使用',
  desc: ['可以单纯使用 JSON 语言描述表单，快速生成', '支持数据完全受控'],
};
