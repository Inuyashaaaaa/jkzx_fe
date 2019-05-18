import { EVENT_TYPE_OPTIONS, PRODUCT_TYPE_OPTIONS, EVENT_TYPE_MAP } from '@/constants/common';
import { Form2, Select } from '@/components';
import SourceTable from '@/components/SourceTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { removeCalendar } from '@/services/calendars';
import { traTradeLCMNotificationSearch } from '@/services/trade-service';
import { DatePicker, Divider, Table, Icon, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import Calendars from './Calendars';
import { DEFAULT_CALENDAR } from './constants';

const { RangePicker } = DatePicker;

class TradeManagementNotifications extends PureComponent<any, any> {
  public $sourceTable: SourceTable = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activeTabKey: 'list',
      open: true,
      tableDataSource: [],
      visible: false,
      searchFormData: Form2.createFields(this.getInitialSearchFormData()),
    };
  }

  public getInitialSearchFormData = () => {
    return {
      notificationEventType: 'all',
      date: [moment(), moment().add(7, 'days')],
    };
  };

  public componentDidMount = () => {
    this.onFetch();
  };

  public getNotificationEventType = type => {
    if (type.value === 'all') {
      return '';
    }
    return type.value;
  };

  public onFetch = async () => {
    this.setState({
      loading: true,
    });

    const { searchFormData } = this.state;
    const { error, data } = await traTradeLCMNotificationSearch({
      after: _.get(searchFormData, 'date.value[0]').format('YYYY-MM-DD'),
      before: _.get(searchFormData, 'date.value[1]').format('YYYY-MM-DD'),
      notificationEventType: this.getNotificationEventType(searchFormData.notificationEventType),
    });

    this.setState({
      loading: false,
    });

    if (error) return;

    this.setState({
      tableDataSource: data.map(item => {
        const { eventInfo = {} } = item;
        let barriers;
        if (item.notificationEventType === 'KNOCK_OUT') {
          if (eventInfo.productType === 'DOUBLE_SHARK_FIN') {
            barriers = _.values(_.pick(eventInfo, ['lowBarrier', 'highBarrier'])).join('/');
          } else if (eventInfo.productType === 'BARRIER') {
            barriers = eventInfo.barrier;
          }
        }
        return {
          ...item,
          ...eventInfo,
          barriers,
        };
      }),
    });
  };

  public onRemove = async event => {
    const { rowData, rowIndex } = event;
    const { error } = await removeCalendar({
      calendarId: DEFAULT_CALENDAR,
      tableDataSource: [
        {
          holiday: rowData.holiday,
        },
      ],
    });
    if (error) return;
    this.setState(
      produce((state: any) => {
        state.tableDataSource.splice(rowIndex, 1);
      })
    );
  };

  public onSearchFormChange = async (props, changedFields) => {
    this.setState({
      searchFormData: {
        ...this.state.searchFormData,
        ...changedFields,
      },
    });
  };

  public onHeaderTabChange = key => {
    this.setState({
      activeTabKey: key,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: Form2.createFields(this.getInitialSearchFormData()),
      },
      () => {
        this.onFetch();
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper
        title="事件提醒"
        tabList={[
          {
            key: 'list',
            tab: '以列表展示',
          },
          {
            key: 'calendars',
            tab: '以日历展示',
          },
        ]}
        tabActiveKey={this.state.activeTabKey}
        onTabChange={this.onHeaderTabChange}
      >
        {this.state.activeTabKey === 'list' && (
          <div>
            <Form2
              ref={node => (this.$sourceTable = node)}
              layout="inline"
              dataSource={this.state.searchFormData}
              submitText={`搜索`}
              submitButtonProps={{
                icon: 'search',
              }}
              onSubmitButtonClick={this.onFetch}
              onResetButtonClick={this.onReset}
              onFieldsChange={this.onSearchFormChange}
              columns={[
                {
                  title: '选择日期',
                  dataIndex: 'date',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{form.getFieldDecorator({})(<RangePicker />)}</FormItem>;
                  },
                },
                {
                  title: '事件类型',
                  dataIndex: 'notificationEventType',
                  render: (value, record, index, { form, editing }) => {
                    return (
                      <FormItem>
                        {form.getFieldDecorator({})(
                          <Select
                            style={{ minWidth: 180 }}
                            placeholder="请输入内容搜索"
                            allowClear={true}
                            showSearch={true}
                            fetchOptionsOnSearch={true}
                            options={[
                              {
                                label: '全部',
                                value: 'all',
                              },
                              ...EVENT_TYPE_OPTIONS,
                            ]}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
            <Divider type="horizontal" />
            <Table
              scroll={{
                x: 2300,
              }}
              dataSource={this.state.tableDataSource}
              rowKey="tradeId"
              columns={[
                {
                  title: () => (
                    <span>
                      <span>事件类型</span>
                      <Tooltip title="当标的物价格与障碍价相差不足10%，会触发敲出提醒">
                        <Icon style={{ paddingLeft: 2 }} type="question-circle" theme="twoTone" />
                      </Tooltip>
                    </span>
                  ),
                  dataIndex: 'notificationEventType',
                  fixed: 'left',
                  width: 200,
                  render: (text, record) => {
                    const find = _.find(EVENT_TYPE_OPTIONS, option => {
                      return option.value === text;
                    });
                    return find.label;
                  },
                },
                {
                  title: '事件日期',
                  dataIndex: 'notificationTime',
                  width: 200,
                  render: (text, record, index) => {
                    return text.split('T')[0];
                  },
                },
                {
                  title: '交易ID',
                  dataIndex: 'tradeId',
                },
                {
                  title: '持仓ID',
                  dataIndex: 'positionId',
                },
                {
                  title: '期权类型',
                  dataIndex: 'productType',
                  width: 200,
                  render: (text, record, index) => {
                    const i = _.findIndex(PRODUCT_TYPE_OPTIONS, option => {
                      return option.value === text;
                    });
                    return PRODUCT_TYPE_OPTIONS[i].label;
                  },
                },
                {
                  title: '标的物',
                  dataIndex: 'underlyerInstrumentId',
                  width: 200,
                },
                {
                  title: '当前价格 (¥)',
                  dataIndex: 'underlyerPrice',
                  width: 200,
                  render: (text, record, index) => {
                    return text ? text.toFixed(4) : text;
                  },
                },
                {
                  title: '障碍价 (¥)',
                  dataIndex: 'barriers',
                  width: 200,
                },
                {
                  title: '支付类型',
                  dataIndex: 'paymentType',
                  width: 200,
                },
                {
                  title: '支付金额 (¥)',
                  dataIndex: 'payment',
                  width: 200,
                  render: (text, record, index) => {
                    return text ? text.toFixed(4) : text;
                  },
                },
              ]}
              pagination={this.state.pagination}
              loading={this.state.loading}
            />
          </div>
        )}

        {this.state.activeTabKey === 'calendars' && (
          <Calendars dataSource={this.state.tableDataSource} />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementNotifications;
