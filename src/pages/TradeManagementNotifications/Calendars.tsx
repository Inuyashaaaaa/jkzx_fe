import { EVENT_TYPE_MAP, EVENT_TYPE_ZHCN_MAP, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { toggleItem } from '@/design/utils';
import { traTradeLCMNotificationSearch } from '@/services/trade-service';
import { Badge, Calendar, Col, Popover, Row } from 'antd';
import _ from 'lodash';
import memo from 'memoize-one';
import moment from 'moment';
import React, { PureComponent } from 'react';
import styles from './index.less';

class Calendars extends PureComponent<any, any> {
  public static defaultProps = {
    dataSource: [],
  };

  public state = {
    mode: 'month',
    disabledTypes: [],
    dataSource: [],
  };

  public getSameDataSourceByDate = memo((dataSource: any[] = [], format) => {
    const sameDataSourceByDate = dataSource.reduce((container, item) => {
      const { eventInfo = {} } = item;
      const date = moment(eventInfo.notificationTime).format(format);
      if (container[date]) {
        container[date].push(item);
      } else {
        container[date] = [item];
      }
      return container;
    }, {});
    return sameDataSourceByDate;
  });

  public componentDidMount = () => {
    this.onFetch(
      moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
      this.state.mode
    );
  };

  public getCompareDateFormat = () => {
    return this.state.mode === 'month' ? 'YYYY-MM-DD' : 'YYYY-MM';
  };

  public getListData = value => {
    const format = this.getCompareDateFormat();
    const sameDataSourceByDate = this.getSameDataSourceByDate(this.state.dataSource, format);
    console.log(sameDataSourceByDate);
    return sameDataSourceByDate[value.format(format)];
  };

  public dateCellRender = value => {
    const listData = this.getListData(value);
    if (!listData) return null;
    return (
      <ul className={styles.events}>
        {listData
          .filter(item => {
            return !this.judgeEventTypeIsDisabled(item.notificationEventType);
          })
          .map((item, index) => {
            return (
              <Popover
                key={index}
                trigger="click"
                content={
                  <ul className={styles.events}>
                    <li>交易ID: {item.tradeId}</li>
                    <li>持仓ID: {item.positionId}</li>
                    <li>期权类型: {LEG_TYPE_ZHCH_MAP[item.eventInfo.productType]}</li>
                    <li>标的物: {item.eventInfo.underlyerInstrumentId}</li>
                    <li>当前价格: {item.eventInfo.underlyerPrice}</li>
                  </ul>
                }
                title={EVENT_TYPE_ZHCN_MAP[item.notificationEventType]}
              >
                <li key={item.content}>
                  {this.getBadge(item.notificationEventType, item.tradeId)}
                </li>
              </Popover>
            );
          })}
      </ul>
    );
  };

  public getBadge = (notificationEventType, tradeId) => {
    return (
      <Badge
        status="processing"
        text={`${tradeId}:${EVENT_TYPE_ZHCN_MAP[notificationEventType]}`}
      />
    );
  };

  public getBadgeInteraction = notificationEventType => {
    const disabled = this.judgeEventTypeIsDisabled(notificationEventType);
    return (
      <div
        onClick={this.bindTagButtonClick(notificationEventType)}
        style={{
          cursor: 'pointer',
        }}
      >
        <Badge
          className={disabled ? styles.disabledText : null}
          status={disabled ? 'default' : 'processing'}
          text={EVENT_TYPE_ZHCN_MAP[notificationEventType]}
        />
      </div>
    );
  };

  public judgeEventTypeIsDisabled = notificationEventType => {
    return this.state.disabledTypes.findIndex(item => item === notificationEventType) !== -1;
  };

  public onPanelChange = (date, mode: string) => {
    let startDate;
    let endDate;
    if (mode === 'month') {
      startDate = moment(date)
        .startOf('month')
        .format('YYYY-MM-DD');
      endDate = moment(date)
        .endOf('month')
        .format('YYYY-MM-DD');
    } else {
      startDate = moment(date)
        .startOf('year')
        .format('YYYY-MM-DD');
      endDate = moment(date)
        .endOf('year')
        .format('YYYY-MM-DD');
    }
    this.onFetch(startDate, endDate, mode);
  };

  public onFetch = async (startDate, endDate, mode) => {
    const { error, data } = await traTradeLCMNotificationSearch({
      after: startDate,
      before: endDate,
    });
    if (error) return;

    this.setState({ mode, dataSource: data });
  };

  public bindTagButtonClick = notificationEventType => () => {
    this.setState({
      disabledTypes: toggleItem(this.state.disabledTypes, notificationEventType),
    });
  };

  public render() {
    return (
      <>
        <Row type="flex">
          {_.values(EVENT_TYPE_MAP).map(type => {
            return (
              <Col key={type} style={{ width: 60 }}>
                {this.getBadgeInteraction(type)}
              </Col>
            );
          })}
        </Row>
        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.dateCellRender}
          mode={this.state.mode}
          onPanelChange={this.onPanelChange}
        />
        ;
      </>
    );
  }
}

export default Calendars;
