import { delay, mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';
import SourceList from '..';

class GeneraSourceList extends PureComponent {
  public onCreate = values => {
    return delay(1000, {
      id: Math.random() + '',
      name: values.name,
    });
  };

  public onFetch = () => {
    return delay(
      1000,
      mockData({
        name: '@name',
      })
    );
  };

  public onRemove = () => {
    return delay(1000, true);
  };

  public render() {
    return (
      <SourceList
        rowKey="id"
        title="title"
        style={{ width: 300 }}
        onFetch={this.onFetch}
        onRemove={this.onRemove}
        renderItem={data => <span>{data.name}</span>}
        onCreate={this.onCreate}
        createFormControls={[
          {
            dataIndex: 'name',
            input: {
              type: 'input',
            },
            control: {
              label: 'name',
            },
          },
        ]}
      />
    );
  }
}

export default {
  component: GeneraSourceList,
  title: '一般用法',
};
