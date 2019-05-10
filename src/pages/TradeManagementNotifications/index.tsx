import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { removeCalendar } from '@/services/calendars';
import { traTradeLCMNotificationSearch } from '@/services/trade-service';
import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import Calendars from './Calendars';
import { DEFAULT_CALENDAR, SEARCH_FORM_DEFS, TABLE_COLUMN_DEFS } from './constants';
import { Form2, Select } from '@/design/components';
import { Divider, Table, DatePicker } from 'antd';
import {
  EVENT_TYPE_OPTIONS,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
} from '@/constants/common';
import FormItem from 'antd/lib/form/FormItem';

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
              dataSource={this.state.tableDataSource}
              columns={[
                {
                  title: '事件类型',
                  dataIndex: 'notificationEventType',
                  render: (text, record, index) => {
                    const i = _.findIndex(EVENT_TYPE_OPTIONS, option => {
                      return option.value === text;
                    });
                    return EVENT_TYPE_OPTIONS[i].label;
                  },
                },
                {
                  title: '事件日期',
                  dataIndex: 'notificationTime',
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
                },
                {
                  title: '当前价格 (¥)',
                  dataIndex: 'underlyerPrice',
                  render: (text, record, index) => {
                    return text ? text.toFixed(4) : text;
                  },
                },
                {
                  title: '障碍价 (¥)',
                  dataIndex: 'barriers',
                },
                {
                  title: '支付类型',
                  dataIndex: 'paymentType',
                },
                {
                  title: '支付金额 (¥)',
                  dataIndex: 'payment',
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
