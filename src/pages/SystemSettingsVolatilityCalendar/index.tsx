// import Table from '@/lib/components/_Table2';
import SourceTable from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  addVolSpecialDates,
  deleteVolSpecialDates,
  queryVolCalendar,
  queryVolCalendarsList,
  setVolWeekendWeight,
  updateVolSpecialDates,
} from '@/services/volatility';
import { Button, Calendar, Col, Input, message, Modal, notification, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { PAGE_TABLE_COL_DEFS } from './constants';

class VolatilityCalendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      loading: false,
      weekendWeight: '',
      calendarMoment: moment(),
      calendar: {},
    };
  }

  public componentDidMount() {
    this.fetchData();
  }

  public fetchData = async () => {
    this.setState({
      loading: true,
    });
    const list = await queryVolCalendarsList();
    if (list.error) {
      this.setState({
        loading: false,
      });
      return;
    }
    const cal = list.data[0];
    const calendar = await queryVolCalendar({
      calendarId: cal.calendarId,
    });
    this.setState({
      loading: false,
    });
    this.setCalendars(calendar);
  };

  public setCalendars = calendar => {
    if (calendar.error) {
      return;
    }
    const { data } = calendar;
    this.setState({
      dates: this.sortDate(data.specialDates) || [],
      weekendWeight: data.weekendWeight,
      calendar: data,
    });
  };

  public formatFormItems = tag => {
    const date = {
      type: 'date',
      label: '特殊日期',
      property: 'specialDate',
      required: true,
      formatter: 'YYYY-MM-DD',
      rule: value => {
        const { dates, modalType } = this.state;
        if (modalType === 'create' && dates.find(d => d.specialDate === value)) {
          return '该日期已存在';
        }
      },
    };
    const weight = {
      type: 'text',
      label: '权重',
      property: 'weight',
      required: true,
      placeholder: '请输入权重',
      rule: value => {
        const reg = /^\d+\.*\d*$/;
        if (!reg.test(value)) {
          return '权重输入值必须为数字类型';
        }
      },
    };
    const remark = {
      type: 'textArea',
      label: '备注',
      property: 'note',
      required: false,
    };
    if (tag === 'create') {
      return [date, weight, remark];
    }
    if (tag === 'modify') {
      date.disabled = true;
      const temp = [date, weight, remark];
      temp.forEach(t => {
        let data = this.editDate[t.property];
        if (t.property === 'weight') {
          data = data;
        }
        t.value = data;
      });
      return temp;
    }
  };

  public hideModal = () => {
    this.editDate = {};
    this.setState({
      modalVisible: false,
      formItems: [],
      loading: false,
    });
  };

  public showModal = (action, record) => {
    this.editDate = record;
    const title = action === 'create' ? '新增特殊日期' : '编辑特殊日期';
    this.setState({
      modalVisible: true,
      modalTitle: title,
      modalType: action,
      formItems: this.formatFormItems(action),
    });
  };

  public confirmUpdate = () => {
    if (this.$formBuilder) {
      this.$formBuilder.validateForm(values => {
        console.log(values);
        this.executeUpdate(values);
      });
    }
  };

  public executeUpdate = async date => {
    this.setState({
      modalLoading: true,
    });
    const { calendar, dates, modalType } = this.state;
    const newDates = [...dates];
    const isModify = modalType === 'modify';
    let params = {};
    if (isModify) {
      params = {
        specialDateUUID: this.editDate.uuid,
        weight: parseFloat(date.weight),
        note: date.note,
      };
    } else {
      newDates.push(date);
      params = {
        calendarId: calendar.calendarId,
        specialDates: newDates,
      };
    }
    const executeMethod = isModify ? updateVolSpecialDates : addVolSpecialDates;
    const result = await executeMethod(params);
    this.setState({
      modalLoading: false,
    });
    if (result.error) {
      return;
    }
    const tip = isModify ? '更新' : '添加';
    if (result.data) {
      notification.success({
        message: `${tip}成功`,
      });
      this.hideModal();
      this.fetchData();
    }
  };

  public sortDate = data => {
    return data.sort((item1, item2) => {
      return moment(item1.specialDate).valueOf() - moment(item2.specialDate).valueOf();
    });
  };

  public updateWeekendWeight = async () => {
    const { calendar, weekendWeight } = this.state;
    const result = await setVolWeekendWeight({
      calendarId: calendar.calendarId,
      weight: weekendWeight || weekendWeight === 0 ? parseFloat(weekendWeight, 10) : 0,
    });
    if (result.error) {
      message.error('设置失败');
      return;
    }
    message.success('设置成功');
    this.setCalendars(result);
  };

  public getRowActions = event => {
    const { rowData } = event;
    return [
      <Button key="edit" type="primary" onClick={() => this.showModal('modify', rowData)}>
        编辑
      </Button>,
    ];
  };

  public highLightSpecialDates = date => {
    // console.log()
    const { calendarMoment, dates } = this.state;
    const isSpecial = dates.find(d => d.specialDate === date.format('YYYY-MM-DD'));
    const isValid = calendarMoment.isSame(date, 'month');
    const spanStyle = isValid
      ? isSpecial
        ? { backgroundColor: '#1890ff', color: '#ffffff', paddingLeft: 3, paddingRight: 3 }
        : {}
      : { color: '#e6e6e6' };
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={spanStyle}>{date.format('DD')}</span>
      </div>
    );
  };

  public handleCalendarChange = date => {
    this.setState({
      calendarMoment: date,
    });
  };

  public onRemove = async e => {
    const { rowData } = e;
    const res = deleteVolSpecialDates({
      specialDateUUIDs: [rowData.uuid],
    });
    if (res.error) {
      return false;
    }
    notification.success({
      message: '删除成功',
    });
    this.fetchData();

    return true;
  };

  public render() {
    const {
      dates,
      loading,
      modalTitle,
      modalVisible,
      formItems,
      weekendWeight,
      modalLoading,
    } = this.state;
    return (
      <PageHeaderWrapper>
        <Row>
          <Col span={8}>
            <Calendar
              fullscreen={false}
              dateFullCellRender={this.highLightSpecialDates}
              onPanelChange={this.handleCalendarChange}
              onSelect={this.handleCalendarChange}
            />
          </Col>
          <Col span={12}>
            <div style={{ paddingLeft: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ width: 80 }}>周末权重:</div>
                <Input
                  style={{ width: 200 }}
                  value={weekendWeight}
                  onChange={value => {
                    let newValue = value.target.value;
                    newValue = newValue.trim();
                    const reg = /^\d+\.*\d*$/;
                    if (newValue && !reg.test(newValue)) {
                      return;
                    }
                    this.setState({ weekendWeight: newValue || '' });
                  }}
                  onPressEnter={this.updateWeekendWeight}
                />
                <Button
                  style={{ marginLeft: 15 }}
                  key="weekendWeight"
                  type="primary"
                  onClick={this.updateWeekendWeight}
                >
                  确定
                </Button>
              </div>
              <Button
                style={{ marginTop: 10 }}
                key="edit"
                type="primary"
                onClick={() => this.showModal('create')}
              >
                新增特殊日期
              </Button>
              <SourceTable
                loading={loading}
                searchable={false}
                removeable={true}
                saveDisabled={true}
                rowKey="uuid"
                dataSource={dates}
                tableColumnDefs={PAGE_TABLE_COL_DEFS}
                rowActions={this.getRowActions}
                tableProps={{
                  autoSizeColumnsToFit: true,
                }}
                onRemove={this.onRemove}
              />
            </div>
          </Col>
        </Row>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.confirmUpdate}
          footer={[
            <Button key="back" type="primary" onClick={this.hideModal}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={modalLoading} onClick={this.confirmUpdate}>
              确认
            </Button>,
          ]}
        >
          {modalVisible && <CommonForm data={formItems} ref={ele => (this.$formBuilder = ele)} />}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default VolatilityCalendar;
