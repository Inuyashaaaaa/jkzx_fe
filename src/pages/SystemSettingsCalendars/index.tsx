import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable, Table2 } from '@/containers';
import Page from '@/containers/Page';
import { createCalendar, queryCalendar, removeCalendar } from '@/services/calendars';
import { delay, getMoment } from '@/tools';
import { Button, Col, DatePicker, message, Modal, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { DEFAULT_CALENDAR, HOLIDAY_FORMAT } from './constants';
import { TABLE_COLUMN_DEFS } from './tools';
import { createFormControls } from './services';
const { RangePicker } = DatePicker;

class SystemTradeDate extends PureComponent<any, any> {
  public $table: Table2 = null;

  public $createForm: Form2 = null;

  public state = {
    loading: false,
    activeTabKey: 'list',
    open: true,
    holidays: [],
    createFormData: {},
    visible: false,
    confirmLoading: false,
  };

  public componentDidMount = () => {
    this.onFetch();
  };

  public getSortedTableData = data => {
    return data.sort((a, b) => {
      const am = moment(a.holiday);
      const bm = moment(b.holiday);
      if (am.isBefore(bm)) {
        return -1;
      }
      if (am.isSame(bm)) {
        return 0;
      }
      return 1;
    });
  };

  public dateRender = current => {
    let style;
    if (
      this.state.holidays.find(item => current.isSame(moment(item.holiday, HOLIDAY_FORMAT), 'day'))
    ) {
      style = {
        border: '1px solid #1890ff',
        background: '#1890ff',
        color: '#fff',
      };
    }
    return (
      <div className="ant-calendar-date" style={style}>
        {current.date()}
      </div>
    );
  };

  public onCreate = async () => {
    if (this.$createForm) {
      const result = await this.$createForm.validate();
      if (result.error) return;
    }
    this.setState({ confirmLoading: true });
    const { createFormData, holidays: tableDataSource } = this.state;

    const createFormDataValues = Form2.getFieldsValue(createFormData);

    const { error } = await createCalendar({
      calendarId: DEFAULT_CALENDAR,
      holidays: [createFormDataValues],
    });

    this.setState({ confirmLoading: false });

    if (error) {
      message.error('创建失败');
      return;
    }

    const newOne = {
      ...createFormDataValues,
      holiday: getMoment(createFormDataValues.holiday).format(HOLIDAY_FORMAT),
      uuid: uuidv4(),
    };
    const holidays = this.getSortedTableData(tableDataSource.concat(newOne));

    this.setState(
      {
        holidays,
        createFormData: {},
        visible: false,
        open: true,
      },
      () => message.success('创建成功')
    );
  };

  public onFetch = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await queryCalendar({
      calendarId: DEFAULT_CALENDAR,
    });

    this.setState({
      loading: false,
    });

    if (error) return;

    const holidays = this.getSortedTableData(data.holidays);

    this.setState({
      holidays,
    });
  };

  public onOpenCreateModal = async () => {
    const nextVisible = !this.state.visible;
    this.setState({
      open: !nextVisible,
    });
    await delay(250);
    this.setState({
      visible: nextVisible,
    });
  };

  public onCloseCreateModal = async () => {
    const nextVisible = !this.state.visible;
    this.setState({
      visible: nextVisible,
    });
    await delay(250);
    this.setState({
      open: !nextVisible,
    });
  };

  public onRemove = async rowData => {
    const { error } = await removeCalendar({
      calendarId: DEFAULT_CALENDAR,
      holidays: [
        {
          holiday: rowData.holiday,
        },
      ],
    });
    if (error) return;
    this.onFetch();
  };

  public onCreateFormChange = (props, changedFields) => {
    this.setState({
      createFormData: {
        ...this.state.createFormData,
        ...changedFields,
      },
    });
  };

  public render() {
    const lastDate = _.get(_.last(this.state.holidays), 'holiday') || undefined;
    const firstDate = _.get(_.first(this.state.holidays), 'holiday') || undefined;

    const rangePickerValue = [
      firstDate ? moment(firstDate) : undefined,
      lastDate ? moment(lastDate) : undefined,
    ];

    return (
      <Page>
        <Row type="flex" justify="space-around" align="top" gutter={8}>
          <Col xs={24} sm={12}>
            <RangePicker
              size="large"
              open={this.state.open}
              dateRender={this.dateRender}
              value={rangePickerValue as any[]}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Button
              type="primary"
              style={{ marginBottom: VERTICAL_GUTTER }}
              onClick={this.onOpenCreateModal}
            >
              创建
            </Button>
            <SmartTable
              loading={this.state.loading}
              rowKey="uuid"
              size="small"
              ref={node => (this.$table = node)}
              columns={TABLE_COLUMN_DEFS(this.onRemove)}
              dataSource={this.state.holidays}
            />
          </Col>
        </Row>
        <Modal
          title="创建交易日"
          visible={this.state.visible}
          onOk={this.onCreate}
          onCancel={this.onCloseCreateModal}
          confirmLoading={this.state.confirmLoading}
        >
          <Form2
            ref={node => (this.$createForm = node)}
            onFieldsChange={this.onCreateFormChange}
            dataSource={this.state.createFormData}
            footer={false}
            columnNumberOneRow={1}
            columns={createFormControls(this.state.holidays)}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemTradeDate;
