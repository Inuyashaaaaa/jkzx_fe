import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Select, Table2, SmartTable } from '@/containers';
import { trdTradeListBySimilarTradeId, trdTradeSearchIndexPaged } from '@/services/general-service';
import {
  trdPortfolioDelete,
  trdPortfolioUpdate,
  trdTradePortfolioCreateBatch,
} from '@/services/trade-service';
import { Button, Icon, Input, message, Modal, Popconfirm, Row, Table, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import styles from './Action.less';
import { BOOKING_TABLE_COLUMN_DEFS } from './constants';
import { PAGE_SIZE } from '@/constants/component';

class Action extends PureComponent<any, any> {
  public $table2: Table2 = null;
  public status: any;

  constructor(props) {
    super(props);
    this.state = {
      portfolio: props.params.data,
      visible: false,
      editabled: false,
      loading: false,
      searchFormData: {},
      bookIdList: [],
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      pageSizeCurrent: 0,
      bookList: [],
      tableDataSource: [],
      portfolioName: props.params.data.portfolioName,
      tradeIdsData: [],
    };
  }

  public onChange = async () => {
    const { error, data } = await trdPortfolioUpdate({
      uuid: this.props.params.data.uuid,
      portfolioName: this.state.portfolio.portfolioName,
    });
    if (error) return;
    return () => {
      this.props.reload();
    };
  };

  public onRemove = async () => {
    const { params } = this.props;
    const { error, data } = await trdPortfolioDelete({
      portfolioName: params.data.portfolioName,
    });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.props.reload();
  };

  public onValueChange = async params => {
    this.setState({
      portfolio: params.values,
    });
  };

  public showModal = () => {
    this.setState({
      visible: true,
    });
    this.onTradeTableSearch({
      current: 1,
      pageSize: PAGE_SIZE,
      portfolioNames: [this.state.portfolio.portfolioName],
    });
  };

  public handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  public handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  public onEdit = () => {
    this.setState({
      editabled: true,
    });
  };

  public onBatch = async ({ domEvent }) => {
    domEvent.preventDefault();
    const { searchFormData } = this.state;
    if (JSON.stringify(searchFormData) === '{}' || !searchFormData) {
      return;
    }
    const newFormData = this.getFormData();
    const formatValues = _.mapValues(newFormData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });
    const count = formatValues.tradeId.length;
    const results = await Promise.all(
      formatValues.tradeId.map(item => {
        return trdTradePortfolioCreateBatch({
          tradeId: item,
          portfolioNames: [this.state.portfolio.portfolioName],
        });
      })
    );
    const errors = results.filter(item => item.error);
    message.success(`${count - errors.length}笔加入投资组成功`);
    this.onTradeTableSearch({
      current: 1,
      pageSize: PAGE_SIZE,
      portfolioNames: [this.state.portfolio.portfolioName],
    });
    this.setState({
      searchFormData: {},
    });
  };

  public search = () => {
    this.onTradeTableSearch({
      current: 1,
      pageSize: PAGE_SIZE,
      portfolioNames: [this.state.portfolio.portfolioName],
    });
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
        bookIdList: [],
      },
      () => {
        this.onTradeTableSearch({ current: 1, pageSize: PAGE_SIZE });
      }
    );
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public getFormData = () => {
    return _.mapValues(this.state.searchFormData, item => {
      return _.get(item, 'value');
    });
  };

  public onTradeTableSearch = async (paramsPagination?) => {
    this.setState({
      loading: true,
    });
    const { searchFormData, pagination } = this.state;

    this.setState({ loading: true });
    const { error, data } = await trdTradeSearchIndexPaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: PAGE_SIZE,
      portfolioNames: paramsPagination ? paramsPagination.portfolioNames : null,
    });
    this.setState({ loading: false });

    if (error) return;
    if (_.isEmpty(data)) return;

    const dataSource = data.page.map(item => {
      return [
        ...item.positions.map((node, key) => {
          return {
            ...item,
            ..._.omit(node, ['bookName']),
            ...node.asset,
            ...(item.positions.length > 1 ? { style: { background: '#f2f4f5' } } : null),
            ...(item.positions.length <= 1
              ? null
              : key === 0
              ? { timeLineNumber: item.positions.length }
              : null),
          };
        }),
      ];
    });
    const tableDataSource = _.reduce(
      dataSource,
      (result, next) => {
        return result.concat(next);
      },
      []
    );

    const tradeIds = await trdTradeListBySimilarTradeId({
      similarTradeId: '',
    });
    if (tradeIds.error) return [];
    const tableDataTrade = tradeIds.data.map(item => ({
      label: item,
      value: item,
    }));
    const tradeIdsData = tableDataTrade.filter(
      item => !tableDataSource.map(t => t.tradeId).includes(item.value)
    );

    this.setState({
      tableDataSource,
      tradeIdsData,
      pagination: {
        ...pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
      pageSizeCurrent: tableDataSource.length,
    });
  };

  public handlePortfolioName = e => {
    this.setState({
      portfolioName: e.target.value,
    });
  };

  public onSave = async () => {
    const { error, data } = await trdPortfolioUpdate({
      uuid: this.state.portfolio.uuid,
      portfolioName: this.state.portfolioName,
    });
    if (error) return message.error('修改投资组名称失败');
    message.success('修改投资组名称成功');
    this.setState({
      portfolio: data,
      editabled: false,
    });
  };

  public onCancel = () => {
    this.setState({
      editabled: false,
    });
  };

  public onPaginationChange = (current, pageSize) => {
    this.onPagination(current, pageSize);
  };

  public handleShowSizeChange = (current, pageSize) => {
    this.onPagination(current, pageSize);
  };

  public onPagination = (current, pageSize) => {
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.onTradeTableSearch({
          current,
          pageSize,
          portfolioNames: [this.state.portfolio.portfolioName],
        });
      }
    );
  };

  public render() {
    const { params } = this.props;
    return (
      <Row type="flex" align="middle">
        <a onClick={this.showModal}>查改</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除？" onConfirm={this.onRemove} style={{ color: 'red' }}>
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
        <Modal
          title="投资组合详情"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1200}
          footer={null}
        >
          {!this.state.editabled ? (
            <p>
              {this.state.portfolio.portfolioName}
              <Icon
                type="form"
                style={{ color: '#1890ff', marginLeft: '8px' }}
                onClick={this.onEdit}
              />
            </p>
          ) : (
            <p className={styles.from}>
              <Input
                defaultValue={this.state.portfolio.portfolioName}
                onChange={this.handlePortfolioName}
              />
              <Button type="primary" onClick={this.onSave}>
                保存
              </Button>
              <Button onClick={this.onCancel}>放弃</Button>
            </p>
          )}
          <Form2
            ref={node => (this.$table2 = node)}
            layout="inline"
            dataSource={this.state.searchFormData}
            submitText="加入投资组合"
            resetable={false}
            onSubmitButtonClick={this.onBatch}
            onFieldsChange={this.onFieldsChange}
            columns={[
              {
                dataIndex: 'tradeId',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({})(
                        <Select
                          style={{ minWidth: 180 }}
                          placeholder="请输入交易ID查询"
                          allowClear={true}
                          showSearch={true}
                          fetchOptionsOnSearch={true}
                          style={{ minWidth: '200px' }}
                          mode="multiple"
                          options={
                            this.state.bookIdList.length
                              ? this.state.bookIdList.map(item => {
                                  return {
                                    label: item,
                                    value: item,
                                  };
                                })
                              : this.state.tradeIdsData
                          }
                        />
                      )}
                    </FormItem>
                  );
                },
              },
            ]}
          />
          <div style={{ marginTop: VERTICAL_GUTTER }}>
            <SmartTable
              pagination={{
                position: 'bottom',
                showQuickJumper: true,
                current: this.state.pagination.current,
                // pageSize: this.state.pageSizeCurrent,
                pageSize: this.state.pagination.pageSize,
                onChange: this.onPaginationChange,
                total: this.state.pagination.total,
                onShowSizeChange: this.handleShowSizeChange,
              }}
              rowKey={'positionId'}
              scroll={{ x: 2300 }}
              loading={this.state.loading}
              dataSource={this.state.tableDataSource}
              columns={BOOKING_TABLE_COLUMN_DEFS(this.state.portfolio.portfolioName, this.search)}
              onRow={record => {
                return record.style ? { style: record.style } : null;
              }}
            />
          </div>
        </Modal>
      </Row>
    );
  }
}

export default Action;
