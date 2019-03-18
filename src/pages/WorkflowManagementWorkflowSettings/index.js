import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { PureStateComponent } from '@/lib/components/_Components';
import StandardForm from '@/lib/components/_StandardForm';
import StandardTable from '@/lib/components/_StandardTable';
import { delay } from '@/lib/utils';
import { Modal, Tabs } from 'antd';
import lodash from 'lodash';
import Mock from 'mockjs';
import React from 'react';

const mockData = type =>
  Mock.mock({
    'list|5-10': [
      {
        'id|+1': 1,
        title: type,
      },
    ],
  }).list;

const { TabPane } = Tabs;

class Component extends PureStateComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  switchVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  render() {
    const { visible } = this.state;
    const inputTableProps = {
      edit: ['up', 'down'],
      selectedRowKeys: false,
      lineNumber: '顺序',
      extra: [
        {
          name: '新建角色',
        },
        {
          name: '保存',
          type: 'primary',
        },
      ],
      title: () => (
        <StandardForm
          footer={false}
          items={[
            {
              label: '审批方式',
              dataIndex: '审批方式',
              type: 'select',
              options() {
                return delay(1000, [
                  {
                    name: '事前核对',
                    value: '事前核对',
                  },
                  {
                    name: '事后核对',
                    value: '事后核对',
                  },
                ]);
              },
            },
          ]}
        />
      ),
      columns: [
        {
          title: '角色人员',
          dataIndex: 'role',
        },
      ],
      dataSource() {
        return delay(1000, [
          {
            id: 0,
            role: '风控部',
          },
          {
            id: 1,
            role: 'micheal',
          },
          {
            id: 2,
            role: '法律部',
          },
        ]);
      },
      onBtnClick: event => {
        console.log(event);
        if (event.name === '新建角色') {
          this.switchVisible();
        }
      },
    };

    return (
      <PageHeaderWrapper>
        <Tabs animated={false} defaultActiveKey="1">
          <TabPane tab="录入核对管理" key="1">
            <StandardTable {...inputTableProps} />
          </TabPane>
          <TabPane tab="结算核对" key="2">
            <StandardTable {...inputTableProps} />
          </TabPane>
          <TabPane tab="资金核对管理" key="3">
            <StandardTable {...inputTableProps} />
          </TabPane>
          <TabPane tab="客户信息更改核对" key="4">
            <StandardTable {...inputTableProps} />
          </TabPane>
        </Tabs>
        <Modal
          width={800}
          title="新建角色"
          visible={visible}
          onOk={this.switchVisible}
          onCancel={this.switchVisible}
        >
          <StandardForm
            {...{
              chunkSize: 1,
              footer: false,
              items: [
                {
                  label: '',
                  dataIndex: 'xxx',
                  type: 'BigCascader',
                  commonFormItems: [
                    {
                      label: '标题',
                      dataIndex: 'title',
                      type: 'input',
                      required: true,
                    },
                    {
                      label: 'other',
                      dataIndex: 'other',
                      type: 'input',
                      required: true,
                    },
                  ],

                  onChange() {},

                  onCreate() {
                    return delay(1000, true);
                  },

                  onRemove() {
                    return delay(1000, true);
                  },

                  material: [
                    {
                      id: 0,
                      title: '部门',
                      dataSource() {
                        return delay(
                          1000,
                          mockData(() => {
                            const metas = ['交易部', '风控部', '合规', '法律', '部门领导'];
                            return metas[lodash.random(0, metas.length - 1)];
                          })
                        );
                      },
                    },
                    {
                      id: 1,
                      title: '人员',
                      dataSource(value) {
                        if (value[0]?.length) {
                          return delay(1000, mockData('@first'));
                        }
                        return [];
                      },
                    },
                  ],
                },
              ],
            }}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Component;
