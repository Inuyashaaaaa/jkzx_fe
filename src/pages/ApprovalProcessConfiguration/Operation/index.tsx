import Page from '@/containers/Page';
import React, { PureComponent } from 'react';
import TabHeader from '@/containers/TabHeader';
import {
  wkProcessGet,
  wkProcessStatusModify,
  wkProcessConfigModify,
} from '@/services/approvalProcessConfiguration';
import { wkApproveGroupList } from '@/services/auditing';
import _ from 'lodash';
import { GTE_PROCESS_CONFIGS, REVIEW_DATA, TASKTYPE } from '../constants';
import { List, Switch, notification, Row, Col, Checkbox, Table, Tag, Model } from 'antd';
import { Table2, Select, Form2 } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';

class Operation extends PureComponent {
  public state = {
    process: {},
    loading: false,
  };

  public componentDidMount = async () => {
    this.fetchData();
  };

  public fetchData = async () => {
    this.setState({
      loading: true,
    });
    const { processName } = this.props;
    const { data, error } = await wkProcessGet({ processName });
    if (error) {
      return this.setState({
        loading: false,
      });
    }
    const process = { ...data };
    process.tasks.map(task => {
      task.approveGroupList = (_.get(task, 'approveGroups') || []).map(item => {
        return item.approveGroupId;
      });
      // if (task.taskType === 'modifyData') {
      //   task.index = 2;
      // } else if (task.taskType === REVIEW_DATA) {
      //   task.index = 1;
      // } else if (task.taskType === 'insertData') {
      //   task.index = 0;
      // } else {
      //   task.index = 4;
      // }
      return task;
    });
    this.setState({
      loading: false,
      process,
    });
  };

  public handleStatus = async (e, processName) => {
    const { process } = this.state;
    process.status = e;
    this.setState({
      process,
    });

    const { error, data } = await wkProcessStatusModify({
      processName,
      status: e,
    });
    if (error) return;
    notification.success({
      message: `${e ? '启用' : '关闭'}流程成功`,
    });
    this.setState({
      status: e,
    });
  };

  public configListChange = async (e, processId, param) => {
    const { process } = this.state;
    const processConfigs = process.processConfigs;

    const processConfigsData = processConfigs.map(item => {
      if (item.id === param.id) {
        item.status = e.target.checked;
      }
      return item;
    });
    const { error, data } = await wkProcessConfigModify({
      configList: processConfigsData.map(item => {
        return {
          configId: item.configId,
          status: item.status,
        };
      }),
    });
    if (error) return;
    notification.success({
      message: `修改全局配置成功`,
    });
  };

  public handleApproveGroupList = async (value, form, editing) => {
    let options = [];
    const { data, error } = await wkApproveGroupList();
    if (error) {
      options = [];
    } else {
      options = _.sortBy(
        data.map(item => ({
          value: item.approveGroupId,
          label: item.approveGroupName,
        }))
      );
    }
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [{ required: true }],
        })(
          <Select
            defaultOpen={true}
            autoSelect={true}
            //   style={{ minWidth: 180 }}
            options={[]}
            editing={editing}
          />
        )}
      </FormItem>
    );
  };

  public render() {
    const { process } = this.state;
    let reviewTask = (process.tasks || []).filter(item => item.taskType === 'reviewData');
    reviewTask = reviewTask.map(item => {
      return Form2.createFields({ ...item, taskId: item.taskId });
    });
    console.log(reviewTask);
    return (
      <>
        <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <List itemLayout="vertical">
              <List.Item>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={process.status}
                  onClick={e => this.handleStatus(e, process.processName)}
                />
                <span style={{ marginLeft: '6px' }}>启用流程</span>
              </List.Item>
              <List.Item extra={<a>修改</a>}>
                <List.Item.Meta title="谁能发起" />
                {process.tasks
                  ? (process.tasks || [])
                      .filter(item => {
                        return item.taskType === 'insertData';
                      })[0]
                      .approveGroups.map(item => {
                        return (
                          <Tag style={{ margin: 5 }} key={item.approveGroupId}>
                            {item.approveGroupName}
                          </Tag>
                        );
                      })
                  : null}
              </List.Item>
              <List.Item>
                <List.Item.Meta title="审批配置" />
                {(process.processConfigs || []).map(item => {
                  return (
                    <p key={item.id}>
                      <Checkbox
                        onChange={e => this.configListChange(e, process.processId, item)}
                        defaultChecked={!!item.status}
                      >
                        {GTE_PROCESS_CONFIGS(item.configName)}
                      </Checkbox>
                    </p>
                  );
                })}
              </List.Item>
            </List>
          </Col>
          <Col xs={24} sm={20}>
            <Table2
              dataSource={reviewTask}
              rowKey="taskId"
              columns={[
                {
                  title: '节点名称',
                  dataIndex: 'taskName',
                },
                {
                  title: '审批组',
                  dataIndex: 'approveGroupList',
                  render: (value, record, index, { form, editing }) => {
                    this.handleApproveGroupList(value, form, editing);
                  },
                },
              ]}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default Operation;
