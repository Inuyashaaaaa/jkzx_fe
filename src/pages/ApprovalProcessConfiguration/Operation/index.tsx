import Page from '@/containers/Page';
import React, { PureComponent } from 'react';
import TabHeader from '@/containers/TabHeader';
import {
  wkProcessGet,
  wkProcessStatusModify,
  wkProcessConfigModify,
} from '@/services/approvalProcessConfiguration';
import _ from 'lodash';
import { GTE_PROCESS_CONFIGS, REVIEW_DATA, TASKTYPE } from '../constants';
import { List, Switch, notification, Row, Col, Checkbox } from 'antd';

class Operation extends PureComponent {
  public state = {
    process: {},
  };

  public componentDidMount = async () => {
    const { processName } = this.props;
    const { data, error } = await wkProcessGet(processName);
    if (error) return;
    this.setState({
      process: data,
    });
  };

  public handleStatus = async (e, processName) => {
    let { process } = this.state;
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

  public render() {
    const { process } = this.state;
    return (
      <>
        <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <List itemLayout="vertical">
              <List.Item extra={<a>修改</a>}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={process.status}
                  onClick={e => this.handleStatus(e, process.processName)}
                />
                <span style={{ marginLeft: '6px' }}>启用流程</span>
              </List.Item>
              <List.Item>
                <List.Item.Meta title="谁能发起" />
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
          <Col xs={24} sm={20} />
        </Row>
      </>
    );
  }
}

export default Operation;
