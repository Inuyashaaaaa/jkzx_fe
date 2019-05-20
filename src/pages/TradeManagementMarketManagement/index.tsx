import { Form2, Select } from '@/components';
import SourceTable from '@/components/_SourceTable';
import Page from '@/containers/Page';
import { mktInstrumentSearch, mktQuotesListPaged } from '@/services/market-data-service';
import { Button, Divider, Row, Table, Tooltip, Icon } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { columns } from './constants';
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

  public componentDidMount = () => {
    this.clean = setInterval(() => {
      this.setState({
        lastUpdateTime: moment().format('HH:mm:ss'),
      });
      this.fetchTable(false);
    }, 1000 * 30);

    this.fetchTable(true);
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
      <Page>
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
                        fetchOptionsOnSearch={true}
                        editing={editing}
                        style={{ minWidth: 180, maxWidth: 400 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        mode="multiple"
                        options={async (value: string = '') => {
                          const { data, error } = await mktInstrumentSearch({
                            instrumentIdPart: value,
                          });
                          if (error) return [];
                          return data.slice(0, 50).map(item => ({
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
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between" align="bottom">
          <Button type="primary" onClick={this.handleSubjectBtnClick}>
            标的物管理
          </Button>
          <span>
            {`最近刷新时间 ${this.state.lastUpdateTime}`}
            <Tooltip title="每隔30秒自动刷新行情" placement="topRight" arrowPointAtCenter={true}>
              <Icon style={{ marginLeft: 4 }} type="info-circle" theme="twoTone" />
            </Tooltip>
          </span>
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
          rowKey={'instrumentId'}
          size="middle"
          scroll={this.state.tableDataSource ? { x: '1800px' } : { x: false }}
        />
      </Page>
    );
  }
}

export default TradeManagementMarketManagement;
