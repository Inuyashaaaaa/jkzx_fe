import { mockData } from '@/utils';
import React, { PureComponent } from '@/components/_CascaderSourceList/demo/node_modules/react';
import CascaderSourceList from '..';

const options = [
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
            children: [
              {
                value: 'hangzhou2',
                label: 'Hangzhou2',
              },
            ],
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
];

class General extends PureComponent {
  public render() {
    return (
      <CascaderSourceList
        list={[
          {
            title: 'title',
            rowSelection: 'multiple',
            createFormControls: value => [
              {
                dataIndex: 'nihao',
                control: {
                  label: '省份',
                },
              },
            ],
          },
          {
            title: 'title',
            createFormControls: value => [
              {
                dataIndex: 'city',
                control: {
                  label: '城市',
                },
              },
              {
                dataIndex: 'nihao',
                control: {
                  label: '省份',
                },
                input: {
                  type: 'select',
                  options: value[0]
                    ? value[0].map(item => {
                        return {
                          label: item,
                          value: item,
                        };
                      })
                    : [],
                },
              },
            ],
          },
          {
            title: 'title',
          },
        ]}
        options={options}
      />
    );
  }
}

export default {
  component: General,
  title: '一般使用',
  desc: 'list 长度和 option 深度得手动保证一致，暂不做验证，提高效率',
};
