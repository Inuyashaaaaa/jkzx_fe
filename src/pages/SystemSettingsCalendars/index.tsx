import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2 } from '@/design/components';
import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { delay } from '@/lib/utils';
import { createCalendar, queryCalendar, removeCalendar } from '@/services/calendars';
import { getMoment } from '@/utils';
import { Button, Col, DatePicker, message, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { DEFAULT_CALENDAR, HOLIDAY_FORMAT, TABLE_COLUMN_DEFS } from './constants';
import { createFormControls } from './services';
const { RangePicker } = DatePicker;

class SystemTradeDate extends PureComponent<any, any> {
  public $sourceTable: SourceTable = null;

  public $createForm: Form2 = null;

  public state = {
    loading: false,
    activeTabKey: 'list',
    open: true,
    holidays: [],
    createFormData: {},
    visible: false,
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
    const { createFormData, holidays: tableDataSource } = this.state;

    const createFormDataValues = Form2.getFieldsValue(createFormData);

    const { error } = await createCalendar({
      calendarId: DEFAULT_CALENDAR,
      holidays: [createFormDataValues],
    });

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

  public onRemove = async event => {
    const { rowData, rowIndex } = event;
    const { error } = await removeCalendar({
      calendarId: DEFAULT_CALENDAR,
      holidays: [
        {
          holiday: rowData.holiday,
        },
      ],
    });
    if (error) return;
    this.setState(
      produce((state: any) => {
        state.holidays.splice(rowIndex, 1);
      })
    );
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
      <PageHeaderWrapper>
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
            <SourceTable
              loading={this.state.loading}
              rowKey="uuid"
              ref={node => (this.$sourceTable = node)}
              columnDefs={TABLE_COLUMN_DEFS}
              dataSource={this.state.holidays}
              header={
                <Row style={{ marginBottom: VERTICAL_GUTTER }}>
                  <ModalButton
                    type="primary"
                    onClick={this.onOpenCreateModal}
                    modalProps={{
                      visible: this.state.visible,
                      onCancel: this.onCloseCreateModal,
                      onOk: this.onCreate,
                      title: '创建交易日',
                    }}
                    content={
                      <Form2
                        ref={node => (this.$createForm = node)}
                        onFieldsChange={this.onCreateFormChange}
                        dataSource={this.state.createFormData}
                        footer={false}
                        columnNumberOneRow={1}
                        columns={createFormControls(this.state.holidays)}
                      />
                    }
                  >
                    创建
                  </ModalButton>
                </Row>
              }
              rowActions={[
                <Button key="remove" type="danger" onClick={this.onRemove}>
                  删除
                </Button>,
              ]}
              pagination={false}
            />
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default SystemTradeDate;
