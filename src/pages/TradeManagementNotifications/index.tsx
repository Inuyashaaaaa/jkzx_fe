import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { removeCalendar } from '@/services/calendars';
import { traTradeLCMNotificationSearch } from '@/services/trade-service';
import produce from 'immer';
import moment from 'moment';
import React, { PureComponent } from 'react';
import Calendars from './Calendars';
import { DEFAULT_CALENDAR, SEARCH_FORM_DEFS, TABLE_COLUMN_DEFS } from './constants';

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
      searchFormData: this.getInitialSearchFormData(),
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
    if (type === 'all') {
      return '';
    }
    return type;
  };

  public onFetch = async () => {
    this.setState({
      loading: true,
    });

    const { searchFormData } = this.state;

    const { error, data } = await traTradeLCMNotificationSearch({
      after: searchFormData.date[0].format('YYYY-MM-DD'),
      before: searchFormData.date[1].format('YYYY-MM-DD'),
      notificationEventType: this.getNotificationEventType(searchFormData.notificationEventType),
    });

    this.setState({
      loading: false,
    });

    if (error) return;

    this.setState({
      tableDataSource: data.map(item => {
        const { eventInfo = {} } = item;
        return {
          ...item,
          ...eventInfo,
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

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
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
        searchFormData: this.getInitialSearchFormData(),
      },
      () => this.onFetch()
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
          <SourceTable
            loading={this.state.loading}
            searchable={true}
            resetable={true}
            onSearchButtonClick={this.onFetch}
            onResetButtonClick={this.onReset}
            rowKey="notificationUUID"
            ref={node => (this.$sourceTable = node)}
            searchFormData={this.state.searchFormData}
            onSearchFormChange={this.onSearchFormChange}
            columnDefs={TABLE_COLUMN_DEFS}
            dataSource={this.state.tableDataSource}
            searchFormControls={SEARCH_FORM_DEFS}
          />
        )}

        {this.state.activeTabKey === 'calendars' && (
          <Calendars dataSource={this.state.tableDataSource} />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementNotifications;
