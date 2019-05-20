import React, { PureComponent } from 'react';
import Input from '../Input';

class InputState extends PureComponent<any, any> {
  public render() {
    return (
      <>
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="input" />
        <Input
          status="success"
          wrapperStyle={{ marginTop: 10 }}
          type="select"
          options={[{ label: 'name1', value: 'name1' }]}
        />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="number" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="date" range="day" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="date" range="week" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="date" range="month" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="date" range="range" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="time" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="email" />
        <Input
          status="success"
          wrapperStyle={{ marginTop: 10 }}
          type="cascader"
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ]}
        />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="checkbox" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="number" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="textarea" />
        <Input status="success" wrapperStyle={{ marginTop: 10 }} type="upload" />
      </>
    );
  }
}

export default {
  component: InputState,
  title: 'Input多类型',
};
