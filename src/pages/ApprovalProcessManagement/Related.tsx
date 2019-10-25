import { Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { PROCESS_STATUS_TYPE_MAP, PROCESS_STATUS_TYPE_OPTIONS } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Table2, SmartTable } from '@/containers';
import Form from '@/containers/Form';
import { IFormControl } from '@/containers/Form/types';
import { wkProcessInstanceComplexList } from '@/services/approval';
import { RELATED_COL_DEFS } from './tools';

class Related extends PureComponent {
  public state = {
    dataSource: [],
    loading: false,
    formData: {},
    type: 'STARTED_BY_ME',
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await wkProcessInstanceComplexList({
      processInstanceUserPerspective: this.state.type,
      processInstanceStatus:
        this.state.formData.status && this.state.formData.status.length
          ? this.state.formData.status
          : _.values(PROCESS_STATUS_TYPE_MAP),
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    const result = data.map(item => {
      const obj = { ...item };
      if (obj.processInstance) {
        Object.assign(obj, obj.processInstance);
      }
      obj.initiatorName = (obj.initiator && obj.initiator.userName) || '';
      obj.operatorName = (obj.operator && obj.operator.userName) || '';
      // obj.startTime = moment(obj.startTime).format('YYYY-MM-DD HH:mm:ss');
      return obj;
    });

    this.setState({
      dataSource: result.sort(
        (item1, item2) => moment(item1.startTime).valueOf() - moment(item2.startTime).valueOf(),
      ),
    });
  };

  public onChange = changed => {
    const type = changed ? 'STARTED_BY_ME' : 'EXECUTED_BY_ME';
    this.setState(
      {
        type,
      },
      () => {
        this.fetchTable();
      },
    );
  };

  public onValueChange = params => {
    this.setState(
      {
        formData: params.values,
      },
      () => {
        this.fetchTable();
      },
    );
  };

  public render() {
    return (
      <>
        <div style={{ marginBottom: VERTICAL_GUTTER }}>
          <div>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={this.onChange}
              defaultChecked
              style={{ marginRight: '10px' }}
            />
            <span>仅包含我发起的流程</span>
          </div>
        </div>
        <div style={{ marginBottom: VERTICAL_GUTTER, width: '400px' }}>
          <Form
            dataSource={this.state.formData}
            controls={
              [
                {
                  control: {
                    label: '流程状态',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                  },
                  field: 'status',
                  input: {
                    type: 'select',
                    options: PROCESS_STATUS_TYPE_OPTIONS,
                    mode: 'multiple',
                  },
                },
              ] as IFormControl[]
            }
            onValueChange={this.onValueChange}
            footer={false}
          />
        </div>
        <SmartTable
          rowKey="processInstanceId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          columns={RELATED_COL_DEFS(this.fetchTable)}
          scroll={{ x: 1600 }}
        />
      </>
    );
  }
}

export default Related;
