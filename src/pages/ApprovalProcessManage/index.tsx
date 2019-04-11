import SourceTable from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  queryProcessDiagram,
  queryProcessHistoryList,
  queryProcessList,
  queryProcessToDoList,
} from '@/services/approval';
import { Button, Input, Modal, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import ApprovalForm from './ApprovalForm';
// import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { generateColumns } from './constants';

const { TabPane } = Tabs;
const { Search } = Input;

const PROCESS_ITEMS = ['待我处理', '待他人审批', '我已审批', '已完成'];

const PROCESS_STATE = ['queued', 'started', 'checked', 'completed'];

function parseTime(time) {
  const temp = time.replace(/[\D]/g, '');
  return parseInt(temp, 10);
}

class ApprovalProcessManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      startedData: [],
      checkedData: [],
      completedData: [],
      queuedData: [],
      showDiagram: false,
      showForm: false,
      formData: [],
      status: 'queued',
      modalVisible: false,
      flowDiagram: '',
    };
  }

  public componentDidMount() {
    this.fetchData(PROCESS_STATE[0]);
  }

  public fetchData = async status => {
    this.setState({
      loading: true,
    });
    let res = '';
    switch (status) {
      case 'queued':
        res = await queryProcessToDoList();
        break;
      case 'started':
        res = await queryProcessList({
          processInstanceUserPerspective: 'STARTED_BY_ME',
          keyword: '',
        });
        break;
      case 'checked':
        res = await queryProcessList({
          processInstanceUserPerspective: 'EXECUTED_BY_ME',
          keyword: '',
        });
        break;
      case 'completed':
        res = await queryProcessHistoryList();
        break;
      default:
        break;
    }

    if (!res || res.error) {
      this.setState({
        loading: false,
      });
      return;
    }
    const data = (res && res.data) || [];
    const result = data.map(item => {
      const obj = { ...item };
      if (obj.processInstance) {
        Object.assign(obj, obj.processInstance);
      }
      obj.initiatorName = (obj.initiator && obj.initiator.userName) || '';
      obj.operatorName = (obj.operator && obj.operator.userName) || '';
      // obj.startTime = moment(obj.startTime).format('YYYY-MM-DD hh:mm:ss');
      return obj;
    });
    result.sort((a, b) => {
      return parseTime(b.startTime) - parseTime(a.startTime);
    });
    const nextState = Object.create(null);
    nextState[`${status}Data`] = result;
    this[`${status}Data`] = [...result];
    this.setState({
      loading: false,
      status,
      ...nextState,
    });
  };

  public hideModal = () => {
    this.editDate = {};
    this.setState({
      modalVisible: false,
    });
  };

  public showModal = (type, data, image) => {
    const isForm = type === 'form';
    this.setState({
      modalVisible: true,
      showDiagram: !isForm,
      showForm: isForm,
      modalTitle: isForm ? '审计详情' : '流程图',
      formData: data,
      flowDiagram: image ? image : '',
    });
  };

  public queryDiagram = async (type, data) => {
    const image = await queryProcessDiagram(data);
    this.showModal(type, data, image);
  };

  public changeTab = tab => {
    const index = parseInt(tab, 10) - 1;
    this.index = index;
    const { startedData, checkedData, completedData, queuedData } = this.state;
    const stateContainer = [queuedData, startedData, checkedData, completedData];
    const targetData = stateContainer[index];
    this.fetchData(PROCESS_STATE[index]);
  };

  public checkApprovalForm = () => {
    // console.log(data);
  };

  public handleSearch = (e, index) => {
    if (!e) {
      return;
    }
    const property = `${PROCESS_STATE[index]}Data`;
    const originData = this[property] || [];
    const result = originData.filter(
      data => data.processNum.includes(e) || data.subject.includes(e)
    );
    const nextState = Object.create(null);
    nextState[property] = result;
    this.setState({
      ...nextState,
    });
  };

  public handleSearchChange = (e, index) => {
    const { value } = e.target;
    console.log(value);
    if (!value) {
      const property = `${PROCESS_STATE[index]}Data`;
      const originData = this[property] || [];
      const nextState = Object.create(null);
      nextState[property] = [...originData];
      this.setState({
        ...nextState,
      });
    }
  };

  public handleFormChange = () => {
    this.setState({
      modalVisible: false,
    });
    this.fetchData(PROCESS_STATE[this.index || 0]);
  };

  public getRowActions = event => {
    const { rowData } = event;
    return [
      <Button key="approval" type="primary" onClick={() => this.showModal('form', rowData)}>
        查看审批单
      </Button>,
      <Button key="diagram" type="primary" onClick={() => this.queryDiagram('diagram', rowData)}>
        流程图
      </Button>,
    ];
  };

  public render() {
    const {
      modalTitle,
      modalVisible,
      startedData,
      checkedData,
      completedData,
      queuedData,
      loading,
      showDiagram,
      showForm,
      formData,
      status,
      flowDiagram,
    } = this.state;
    const stateContainer = [queuedData, startedData, checkedData, completedData];
    const processColumns = generateColumns('start');
    const processCompleteColumns = generateColumns('complete');
    return (
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          {PROCESS_ITEMS.map((item, index) => {
            // const data = this.state[`${PROCESS_STATE[index]}Data`];
            const data = stateContainer[index];
            return (
              <TabPane tab={item} key={index + 1}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Search
                    style={{ width: 250 }}
                    placeholder="输入审批单号或者标题搜索"
                    onSearch={value => this.handleSearch(value, index)}
                    onChange={value => this.handleSearchChange(value, index)}
                  />
                </div>
                <SourceTable
                  loading={loading}
                  searchable={false}
                  removeable={false}
                  saveDisabled={true}
                  rowKey="processInstanceId"
                  dataSource={data}
                  tableColumnDefs={index === 3 ? processCompleteColumns : processColumns}
                  rowActions={this.getRowActions}
                  tableProps={{
                    autoSizeColumnsToFit: true,
                  }}
                  actionColDef={{
                    width: 250,
                  }}
                />
              </TabPane>
            );
          })}
        </Tabs>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          footer={null}
          width={720}
        >
          {showDiagram && (
            <img src={flowDiagram} style={{ width: 650 }} alt="图片加载出错，请重试" />
          )}
          {showForm && (
            <ApprovalForm
              formData={formData}
              status={status}
              handleFormChange={this.handleFormChange}
            />
          )}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ApprovalProcessManagement;
