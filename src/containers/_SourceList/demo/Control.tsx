import { delay, mockData } from '@/tools';
import React, { PureComponent } from 'react';
import SourceList from '..';

class GeneraSourceList extends PureComponent {
  public state = {
    dataSource: mockData({
      name: '@name',
    }),
  };

  public onCreate = values => {
    return delay(1000, {
      id: Math.random() + '',
      name: values.name,
    }).then(result => {
      this.setState({
        dataSource: this.state.dataSource.concat(result),
      });
      return true;
    });
  };

  public onRemove = (data, index) => {
    return delay(1000, true).then(result => {
      if (!result) return false;
      const list = [...this.state.dataSource];
      list.splice(index, 1);
      this.setState({
        dataSource: list,
      });
      return true;
    });
  };

  public render() {
    return (
      <SourceList
        rowKey="id"
        title="title"
        style={{ width: 300 }}
        dataSource={this.state.dataSource}
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
  title: '完全受控',
};
