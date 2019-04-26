import LoadingButton from '@/components/LoadingButton';
import PopconfirmButton from '@/components/PopconfirmButton';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Select, Table2 } from '@/design/components';
import ModalButton from '@/design/components/ModalButton';
import { trdTradeListBySimilarTradeId, trdTradeSearchIndexPaged } from '@/services/general-service';
import {
  trdPortfolioDelete,
  trdPortfolioUpdate,
  trdTradePortfolioCreateBatch,
} from '@/services/trade-service';
import { Button, Icon, Input, message, Modal, Popconfirm, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { RESOURCE_FORM_CONTROLS } from '.';
import styles from './actionCol.less';
import { BOOKING_TABLE_COLUMN_DEFS } from './constants';

class ActionCol extends PureComponent<any, any> {
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
        pageSize: 10,
        total: 0,
      },
      pageSizeCurrent: 0,
      bookList: [],
      tableDataSource: [],
      portfolioName: props.params.data.portfolioName,
    };
  }

  public componentDidMount = () => {
    // this.status = this.props.status;
    // this.onTradeTableSearch();
  };

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
    if (error) return;
    // return () => {
    //   this.props.reload();
    // };
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
      pageSize: 10,
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

  public onBatch = ({ domEvent }) => {
    domEvent.preventDefault();
    // this.onTradeTableSearch({ current: 1, pageSize: 10 });
    // const { searchFormData, pagination } = this.state;
    const newFormData = this.getFormData();
    const formatValues = _.mapValues(newFormData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });
    formatValues.tradeId.forEach(async item => {
      const { error, data } = await trdTradePortfolioCreateBatch({
        tradeId: item,
        portfolioNames: [this.state.portfolio.portfolioName],
      });
      if (error) return message.error(`交易ID${item}加入投资组失败`);
      message.success(`交易ID${item}加入投资组成功`);
    });
    this.onTradeTableSearch({
      current: 1,
      pageSize: 10,
      portfolioNames: [this.state.portfolio.portfolioName],
    });
  };

  public search = () => {
    this.onTradeTableSearch();
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
        bookIdList: [],
      },
      () => {
        this.onTradeTableSearch({ current: 1, pageSize: 10 });
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
    // const newFormData = this.getFormData();
    // const formatValues = _.mapValues(newFormData, (val, key) => {
    //   if (isMoment(val)) {
    //     return val.format('YYYY-MM-DD');
    //   }
    //   return val;
    // });

    this.setState({ loading: true });
    const { error, data } = await trdTradeSearchIndexPaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: 10,
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

    this.setState({
      tableDataSource,
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

  public onPagination = (current, pageSize) => {
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.onTradeTableSearch({ current, pageSize });
      }
    );
  };

  public render() {
    const { params } = this.props;
    return (
      <Row type="flex" align="middle" style={{ height: params.context.rowHeight }}>
        <Button.Group>
          <Button type="primary" onClick={this.showModal}>
            查看/修改
          </Button>
          <PopconfirmButton
            type="danger"
            size="small"
            popconfirmProps={{
              onConfirm: this.onRemove,
              title: '确认删除?',
            }}
          >
            删除
          </PopconfirmButton>
        </Button.Group>
        <Modal
          title="投资组合详情"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1200}
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
            // dataSource={this.state.tableDataSource}
            submitText="加入投资组合"
            resetable={false}
            onSubmitButtonClick={this.onBatch}
            // onResetButtonClick={this.onReset}
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
                          mode="multiple"
                          options={
                            this.state.bookIdList.length
                              ? this.state.bookIdList.map(item => {
                                  return {
                                    label: item,
                                    value: item,
                                  };
                                })
                              : async (value: string = '') => {
                                  const { data, error } = await trdTradeListBySimilarTradeId({
                                    similarTradeId: value,
                                  });
                                  if (error) return [];
                                  let _data = data.map(item => ({
                                    label: item,
                                    value: item,
                                  }));
                                  _data = _data.filter(
                                    item =>
                                      !this.state.tableDataSource
                                        .map(t => t.tradeId)
                                        .includes(item.value)
                                  );
                                  return _data;
                                }
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
            <Table
              size="middle"
              pagination={{
                position: 'bottom',
                //   showSizeChanger: true,
                //   onShowSizeChange: this.onShowSizeChange,
                showQuickJumper: true,
                current: this.state.pagination.current,
                pageSize: this.state.pageSizeCurrent,
                onChange: this.onPaginationChange,
                total: this.state.pagination.total,
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

export default ActionCol;
