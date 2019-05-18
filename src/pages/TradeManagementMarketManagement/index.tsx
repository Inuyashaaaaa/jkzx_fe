import { Form2, Select } from '@/components';
import SourceTable from '@/components/_SourceTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { mktInstrumentSearch, mktQuotesListPaged } from '@/services/market-data-service';
import { Button, Divider, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { columns, searchFormControls, TABLE_COLUMN_DEFS } from './constants';
class TradeManagementMarketManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public clean = null;

  public state = {
    columnDefs: [],
    dataSource: [],
    lastUpdateTime: '',
    searchFormData: {},
    tableDataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    total: 0,
    loading: false,
  };

  public paginationChange = (current, pageSize) => {
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.fetchTable(true);
      }
    );
  };

  public componentWillMount = () => {
    this.fetchTable(true);
  };

  public componentDidMount = () => {
    this.clean = setInterval(() => {
      this.setState({
        lastUpdateTime: moment().format('HH:mm:ss'),
      });
      this.fetchTable(false);
    }, 1000 * 30);
  };

  public componentWillUnmount = () => {
    if (this.clean) {
      clearInterval(this.clean);
    }
  };

  public fetchTable = loading => {
    const pagination = this.state.pagination;
    this.setState({
      lastUpdateTime: moment().format('HH:mm:ss'),
      loading,
    });
    return mktQuotesListPaged({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      ...Form2.getFieldsValue(this.state.searchFormData),
    }).then(result => {
      this.setState({
        loading: false,
      });
      if (result.error) return undefined;
      this.setState({
        tableDataSource: result.data.page,
        total: result.data.totalCount,
      });
    });
  };

  public handleSubjectBtnClick = () => {
    router.push('/trade-management/subject-store');
  };

  public onSearchFormChange = event => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      () => {
        this.fetchTable(true);
      }
    );
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      () => {
        this.fetchTable(true);
      }
    );
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public render() {
    console.log(this.state.tableDataSource);
    return (
      <PageHeaderWrapper>
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText={'查询'}
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.onSearchFormChange}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onFieldsChange}
          columns={[
            {
              title: '标的物列表',
              dataIndex: 'instrumentIds',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        mode="multiple"
                        options={async (value: string = '') => {
                          const { data, error } = await mktInstrumentSearch({
                            instrumentIdPart: value,
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
          ]}
        />
        <Divider type="horizontal" />
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between">
          <Button type="primary" onClick={this.handleSubjectBtnClick}>
            标的物管理
          </Button>
          <Button type="primary" onClick={this.onSearchFormChange}>
            {`刷新 ${this.state.lastUpdateTime}`}
          </Button>
        </Row>
        <Table
          dataSource={this.state.tableDataSource}
          columns={columns}
          pagination={{
            ...this.state.pagination,
            total: this.state.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: this.paginationChange,
          }}
          loading={this.state.loading}
          rowKey={(data, index) => index}
          size="middle"
          scroll={this.state.tableDataSource ? { x: '1800px' } : { x: false }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementMarketManagement;
