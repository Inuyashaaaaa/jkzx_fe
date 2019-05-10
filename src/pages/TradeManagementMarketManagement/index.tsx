import { Form2, Select } from '@/design/components';
import SourceTable from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
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
      pageSize: 20,
      total: 20,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page, pagesize) => this.paginationChange(page, pagesize),
      onShowSizeChange: (page, pagesize) => this.paginationChange(page, pagesize),
    },
    loading: false,
  };

  public paginationChange = (a, b) => {
    const { pagination } = this.state;
    pagination.current = a;
    pagination.pageSize = b;
    this.setState(
      {
        pagination,
      },
      () => {
        this.fetchTable({ page: a - 1, pageSize: b }, null, true);
      }
    );
  };

  public componentWillMount = () => {
    this.fetchTable(
      { page: this.state.pagination.current - 1, pageSize: this.state.pagination.pageSize },
      null,
      true
    );
  };

  public componentDidMount = () => {
    this.clean = setInterval(() => {
      this.setState({
        lastUpdateTime: moment().format('HH:mm:ss'),
      });
      this.fetchTable(
        { page: this.state.pagination.current - 1, pageSize: this.state.pagination.pageSize },
        null,
        false
      );
    }, 1000 * 30);
  };

  public componentWillUnmount = () => {
    if (this.clean) {
      clearInterval(this.clean);
    }
  };

  public fetchTable = (data, fields = null, loading) => {
    this.setState({
      lastUpdateTime: moment().format('HH:mm:ss'),
      loading: loading ? true : false,
    });
    return mktQuotesListPaged({
      page: data.page,
      pageSize: data.pageSize,
      ...fields,
    }).then(result => {
      this.setState({
        loading: false,
      });
      if (result.error) return undefined;
      const { pagination } = this.state;
      this.setState({
        tableDataSource: result.data.page,
        current: data.page,
        pagination: _.assign(pagination, { total: result.data.totalCount }),
      });
    });
  };

  public handleSubjectBtnClick = () => {
    router.push('/trade-management/subject-store');
  };

  public onSearchFormChange = event => {
    event.domEvent.preventDefault();
    this.fetchTable(
      { page: this.state.pagination.current - 1, pageSize: this.state.pagination.pageSize },
      this.getFormData(),
      true
    );
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.fetchTable(
          { page: this.state.pagination.current - 1, pageSize: this.state.pagination.pageSize },
          this.getFormData(),
          true
        );
      }
    );
  };

  public getFormData = () => {
    return _.mapValues(this.state.searchFormData, item => {
      return _.get(item, 'value');
    });
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState(
      {
        searchFormData: allFields,
      },
      () => {
        this.fetchTable(
          { page: this.state.pagination.current - 1, pageSize: this.state.pagination.pageSize },
          this.getFormData(),
          true
        );
      }
    );
  };

  public render() {
    console.log(this.state.tableDataSource);
    return (
      <PageHeaderWrapper>
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText={`刷新 ${this.state.lastUpdateTime}`}
          submitButtonProps={{
            icon: 'reload',
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
        <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Button type="primary" onClick={this.handleSubjectBtnClick}>
            标的物管理
          </Button>
        </Row>
        <Table
          dataSource={this.state.tableDataSource}
          columns={columns}
          pagination={this.state.pagination}
          loading={this.state.loading}
          rowKey={(data, index) => index}
          scroll={this.state.tableDataSource ? { x: '2000px' } : { x: false }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementMarketManagement;
