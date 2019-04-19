import { Form2, Select, Table2 } from '@/design/components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { wkApproveGroupList, wkApproveGroupModify } from '@/services/auditing';
import { queryAuthDepartmentList } from '@/services/department';
import { Button, Input, notification, Popconfirm, Row, Tabs } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Item from 'antd/lib/list/Item';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import styles from './customModel.less';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

const tabPaneData = [
  {
    tab: '标的物价格',
    content: 1,
  },
  {
    tab: 'DELTA',
    content: 1,
  },
  {
    tab: 'GAMMA',
    content: 1,
  },
  {
    tab: 'VEGA',
    content: 1,
  },
  {
    tab: 'THETA',
    content: 1,
  },
];

const columns = [
  {
    title: '标的物价格',
    dataIndex: 'legalName',
  },
  {
    title: '2019-04-19 09:00',
    dataIndex: 'accountId',
  },
  {
    title: '2019-04-19 11:00',
    dataIndex: 'salesName',
  },
  {
    title: '2019-04-19 13:00',
    dataIndex: 'masterAgreementId',
  },
  {
    title: '2019-04-19 15:00',
    dataIndex: 'masterAgreementId',
  },
];

const CustomModel = memo(() => {
  const [listLoading, setListLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [modelList, setmodelList] = useState([]);
  const [searchList, setSearchList] = useState([1, 2, 3]);
  const [tableData, setTableData] = useState([]);

  return (
    <div className={styles.customModel}>
      <PageHeaderWrapper title="自定义模型（MODEL_XY）">
        <div style={{ width: '400px', background: '#FFF', padding: '30px' }}>
          <p>
            <Search
              placeholder="输入标的物代码查询"
              onSearch={value => console.log(value)}
              style={{ width: '100%' }}
            />
          </p>
          <ul style={{ marginTop: '20px' }} className={styles.searchList}>
            {searchList.map((item, index) => {
              return (
                <li key={index} className={index === 0 ? styles.checked : styles.liItme}>
                  <span className={styles.itemName}>{item.approveGroupName}test</span>
                  <Popconfirm
                    title="确认删除此模型"
                    // onConfirm={this.confirm(item)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <a style={{ color: 'red' }}>移除</a>
                  </Popconfirm>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          style={{
            marginLeft: '20px',
            background: '#FFF',
            padding: '30px',
            width: '100%',
            position: 'relative',
          }}
        >
          {modelList ? (
            <div>
              <Row style={{ marginBottom: '10px', maxHeight: '28px' }}>
                <Button style={{ marginRight: '15px' }}>下载</Button>
                <Button size="default" type="primary" loading={importLoading}>
                  导入
                </Button>
              </Row>
              <Tabs type="card" style={{ marginTop: '25px' }}>
                {tabPaneData.map((item, index) => {
                  return (
                    <TabPane tab={item.tab} key={index}>
                      <Table2
                        size="middle"
                        pagination={false}
                        rowKey={'accountId'}
                        dataSource={tableData}
                        loading={tableLoading}
                        columns={columns}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          ) : (
            <span className={styles.center}>请先选中一个标的物</span>
          )}
        </div>
      </PageHeaderWrapper>
    </div>
  );
});

export default CustomModel;
