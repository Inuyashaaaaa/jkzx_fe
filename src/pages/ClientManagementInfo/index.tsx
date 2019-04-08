import { VERTICAL_GUTTER } from '@/constants/global';
import { Cascader, Form2, Input, Select, Table2 } from '@/design/components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { clientAccountSearch, refSimilarLegalNameList } from '@/services/reference-data-service';
import { queryCompleteCompanys } from '@/services/sales';
import { arr2treeOptions } from '@/tools';
import { getMoment } from '@/utils';
import { Card, Divider, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import CreateModalButton from './CreateModalButton';

const SALER_CASCADER = 'SALER_CASCADER';

const useTableData = initFormData => {
  // stateful logic
  const [searchLoading, setSearchLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const fetchTableData = async formData => {
    setSearchLoading(true);
    const { data, error } = await clientAccountSearch(formData);
    setSearchLoading(false);
    if (error) return;
    setTableData(data);
  };

  useLifecycles(() => {
    fetchTableData(initFormData);
  });

  return {
    searchLoading,
    tableData,
    fetchTableData,
  };
};

const ClientManagementInfo = memo(() => {
  const formEl = useRef<Form2>(null);
  const { searchLoading, tableData, fetchTableData } = useTableData({});

  const [salesCascaderList, setSalesCascaderList] = useState([]);

  const getFetchData = () => {
    const formData = formEl.current.decoratorForm.getFieldsValue();
    if (Array.isArray(formData[SALER_CASCADER])) {
      const [subsidiaryName, branchName, salesName] = formData[SALER_CASCADER];
      return {
        ..._.omit(formData, [SALER_CASCADER]),
        subsidiaryName,
        branchName,
        salesName,
      };
    }
    return formData;
  };

  const fetchBranchSalesList = async () => {
    const { error, data } = await queryCompleteCompanys();
    if (error) return;
    const newData = arr2treeOptions(
      data,
      ['subsidiary', 'branch', 'salesName'],
      ['subsidiary', 'branch', 'salesName']
    );
    const branchSalesList = newData.map(subsidiary => {
      return {
        value: subsidiary.value,
        label: subsidiary.label,
        children: subsidiary.children.map(branch => {
          return {
            value: branch.value,
            label: branch.label,
            children: branch.children.map(salesName => {
              return {
                value: salesName.value,
                label: salesName.label,
              };
            }),
          };
        }),
      };
    });
    setSalesCascaderList(branchSalesList);
  };

  useLifecycles(() => {
    fetchBranchSalesList();
  });

  const formRefs = {};

  return (
    <PageHeaderWrapper title="客户信息管理" card={false}>
      <Card>
        <Form2
          onSubmitButtonClick={({ domEvent }) => {
            domEvent.preventDefault();
            const formData = getFetchData();
            fetchTableData(formData);
          }}
          ref={node => (formEl.current = node)}
          layout="inline"
          submitText="查询"
          submitButtonProps={{
            icon: 'search',
          }}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        allowClear={true}
                        fetchOptionsOnSearch={true}
                        showSearch={true}
                        options={async value => {
                          const { data, error } = await refSimilarLegalNameList({
                            similarLegalName: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
                            label: item,
                            value: item,
                          }));
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '主协议编号',
              dataIndex: 'masterAgreementId',
              render: (value, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
              },
            },
            {
              title: '销售',
              dataIndex: SALER_CASCADER,
              render: (value, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Cascader
                        style={{ width: 250 }}
                        options={salesCascaderList}
                        placeholder=""
                        showSearch={{
                          filter: (inputValue, path) => {
                            return path.some(
                              option =>
                                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                            );
                          },
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (value, record, index, { form }) => {
                return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
              },
            },
          ]}
        />
      </Card>
      <Card style={{ marginTop: VERTICAL_GUTTER }}>
        <Row type="flex" style={{ marginBottom: VERTICAL_GUTTER }}>
          <CreateModalButton />
        </Row>
        <Table2
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
          }}
          rowKey={'accountId'}
          dataSource={tableData}
          loading={searchLoading}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
            },
            {
              title: '账户编号',
              dataIndex: 'accountId',
            },
            {
              title: '开户销售',
              dataIndex: 'salesName',
            },
            {
              title: '协议编号',
              dataIndex: 'masterAgreementId',
            },
            {
              title: '状态',
              dataIndex: 'normalStatus',
              render: (value, record, index) => {
                if (value) {
                  return '正常';
                }
                return '错误';
              },
            },
            {
              title: '账户信息',
              dataIndex: 'accountInformation',
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              render: (value, record, index) => {
                return getMoment(value).format('YYYY-MM-DD HH:mm:ss');
              },
            },
            {
              title: '更新时间',
              dataIndex: 'updatedAt',
              render: (value, record, index) => {
                return getMoment(value).format('YYYY-MM-DD HH:mm:ss');
              },
            },
            {
              width: 150,
              title: '操作',
              dataIndex: 'actions',
              render: (value, record, index) => {
                return (
                  <span>
                    <a href="javascript:;">查看</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" style={{ color: 'red' }}>
                      删除
                    </a>
                  </span>
                );
              },
            },
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
});

export default ClientManagementInfo;
