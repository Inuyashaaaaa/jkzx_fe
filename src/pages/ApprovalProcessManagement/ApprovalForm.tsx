import {
  completeTaskProcess,
  queryProcessForm,
  queryProcessHistoryForm,
  terminateProcess,
} from '@/services/approval';
import moment from 'moment';

import { refBankAccountSearch, refSimilarLegalNameList } from '@/services/reference-data-service';
import { Button, Icon, Input, Popconfirm, Spin, Table } from 'antd';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { generateColumns } from './constants';

const { TextArea } = Input;

class ApprovalForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      status: '',
      loading: true,
      formItems: [],
      counters: [],
      accounts: [],
      modifying: false,
      modifyBtn: '',
      rejectReason: '',
      passComment: '',
      modifyComment: '',
    };
  }
  public componentDidMount() {
    const { formData, status } = this.props;
    this.fetchData(formData, status);
  }

  public componentWillReceiveProps(nextProps) {
    const { formData, status } = nextProps;
    const pre = this.props.formData;
    if (pre.processInstanceId !== formData.processInstanceId) {
      this.setState(
        {
          data: {},
          status: '',
          loading: true,
          formItems: [],
          counters: [],
          accounts: [],
          modifying: false,
          modifyBtn: '',
          rejectReason: '',
          passComment: '',
          modifyComment: '',
        },
        () => {
          this.fetchData(formData, status);
        }
      );
    }
  }

  public fetchData = async (params, status) => {
    const processInstanceId = params.processInstanceId || params.processInstance.processInstanceId;
    const isCheckBtn =
      params && params.taskName && status === 'pending' && params.taskName.includes('修改资金流水');

    this.setState({
      loading: true,
    });

    const isCompleted = params.status ? !params.status.includes('unfinished') : false;
    const executeMethod = isCompleted ? queryProcessHistoryForm : queryProcessForm;
    const res = await executeMethod({
      processInstanceId,
    });
    if (!res || res.error) {
      this.setState({
        loading: false,
      });
      return;
    }
    const data = (res && res.data) || {};
    if (data.processInstance) {
      const instance = data.processInstance;
      instance.initiatorName = (instance.initiator && instance.initiator.userName) || '';
      instance.operatorName = (instance.operator && instance.operator.userName) || '';
    }
    if (!isCheckBtn) {
      const formItems = this.formatFormItems(data, true);
      this.setState({
        data,
        status,
        formItems,
        loading: false,
      });
    } else {
      this.queryBankAccount(data, status);
    }
  };

  public queryBankAccount = async (data, status) => {
    const payload = (data && data.process && data.process._business_payload) || {};
    const [counters, banks] = await Promise.all([
      refSimilarLegalNameList({ similarLegalName: '' }),
      refBankAccountSearch({ legalName: payload.clientId }),
    ]);
    this.setState(
      {
        counters: (counters && counters.data) || [],
        accounts: (banks && banks.data && banks.data.map(d => d.bankAccount)) || [],
      },
      () => {
        this.setFinalData(data, status);
      }
    );
  };

  public setFinalData = (data, status) => {
    const formItems = this.formatFormItems(data, false);
    this.setState({
      data,
      status,
      formItems,
      loading: false,
    });
  };

  public handleCounterChange = () => {
    const { formData } = this.props;
    const { data } = this.state;
    const isCheckBtn =
      formData && formData.taskName && formData.taskName.includes('复核') && status === 'queued';
    const formItems = this.formatFormItems(data, isCheckBtn);
    this.setState({
      formItems,
    });
  };

  public formatFormItems = (data, isDisable) => {
    const payload = (data && data.process && data.process._business_payload) || {};
    // isDisable = false;
    payload.paymentDirection = payload.paymentDirection === 'IN' ? '入金' : '出金';
    payload.accountDirection = payload.accountDirection === 'PARTY' ? '客户资金' : '我方资金';
    const { counters, accounts } = this.state;
    const partner = {
      type: 'select',
      label: '交易对手',
      property: 'clientId',
      required: true,
      options: counters,
      disabled: isDisable,
      listener: async value => {
        // this.setState({ accounts: [3435, 88989, 999] }, () => {
        //   this.handleCounterChange(value);
        // });
        const accounts = await refBankAccountSearch({ legalName: value });
        const data = accounts.data || [];
        this.setState({ accounts: data.map(d => d.bankAccount) }, () => {
          this.handleCounterChange();
        });
        // this.handleCounterChange(value);
      },
    };
    const bankAccount = {
      type: 'select',
      label: '银行帐号',
      property: 'bankAccount',
      options: accounts,
      disabled: isDisable,
      required: true,
    };
    const money = {
      type: 'number',
      label: '出入金金额',
      property: 'paymentAmount',
      required: true,
      disabled: isDisable,
    };
    const date = {
      type: 'date',
      label: '出入金日期',
      property: 'paymentDate',
      required: true,
      disabled: isDisable,
    };
    const direction = {
      type: 'select',
      label: '出入金方向',
      property: 'paymentDirection',
      required: true,
      options: ['入金', '出金'],
      disabled: isDisable,
    };
    const accountType = {
      type: 'select',
      label: '账户类型',
      property: 'accountDirection',
      required: true,
      options: ['我方资金', '客户资金'],
      disabled: isDisable,
    };
    return [partner, bankAccount, money, date, direction, accountType].map(item => {
      const obj = { value: payload[item.property] || '', ...item };
      return obj;
    });
  };

  public confirmAbandon = async () => {
    this.$formBuilder.validateForm(values => {
      const obj = { ...values };
      obj.paymentDirection = obj.paymentDirection === '入金' ? 'IN' : 'OUT';
      obj.accountDirection = obj.accountDirection === '客户资金' ? 'PARTY' : 'COUNTER_PARTY';
      obj.paymentDate = moment(obj.paymentDate).format('YYYY-MM-DD');
      const { formData } = this.props;
      const { modifyComment } = this.state;
      const params = {
        taskId: formData.taskId,
        ctlProcessData: {
          abandon: true,
        },
        businessProcessData: obj,
      };
      this.executeModify(params, 'abandon');
    });
  };

  public confirmPass = async () => {
    const { formData } = this.props;
    const { passComment } = this.state;
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        confirmed: true,
        comment: passComment,
      },
      businessProcessData: {},
    };
    this.executeModify(params, 'pass');
  };
  public confirmModify = async () => {
    this.$formBuilder.validateForm(values => {
      const obj = { ...values };
      obj.paymentDirection = obj.paymentDirection === '入金' ? 'IN' : 'OUT';
      obj.accountDirection = obj.accountDirection === '客户资金' ? 'PARTY' : 'COUNTER_PARTY';
      obj.paymentDate = moment(obj.paymentDate).format('YYYY-MM-DD');
      const { formData } = this.props;
      const { modifyComment } = this.state;
      const params = {
        taskId: formData.taskId,
        ctlProcessData: {
          comment: modifyComment,
          abandon: false,
        },
        businessProcessData: obj,
      };
      this.executeModify(params, 'modify');
    });
  };
  public rejectForm = async () => {
    const { formData } = this.props;
    const { rejectReason } = this.state;
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: rejectReason,
        confirmed: false,
      },
      businessProcessData: {},
    };
    this.executeModify(params, 'reject');
  };

  public setRejectReson = e => {
    this.setState({
      rejectReason: e.target.value,
    });
  };

  public setPassComment = e => {
    this.setState({
      passComment: e.target.value,
    });
  };

  public setModifyComment = e => {
    this.setState({
      modifyComment: e.target.value,
    });
  };

  public executeModify = async (params, modifyType) => {
    this.setState({
      modifying: true,
      modifyBtn: modifyType,
    });
    const executeMethod = completeTaskProcess;
    const res = await executeMethod(params);
    this.setState({
      modifying: false,
      modifyBtn: '',
    });
    if (res.error) {
      return;
    }
    const { handleFormChange } = this.props;
    handleFormChange();
  };

  public render() {
    const { status, formData } = this.props;
    const {
      data,
      loading,
      formItems,
      modifying,
      modifyBtn,
      rejectReason,
      passComment,
      modifyComment,
    } = this.state;
    const isCheckBtn =
      formData && formData.taskName && formData.taskName.includes('复核') && status === 'pending';
    const approvalColumns = generateColumns(
      'approval',
      data.processInstance && data.processInstance.operator ? 'operator' : 'initiator'
    );
    const processColumns = generateColumns('process');
    const processData = data.processInstance ? [data.processInstance] : [];
    const histories = data.taskHistory ? data.taskHistory : [];
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin={true} />;
    return (
      <div>
        {!loading && (
          <div>
            <Table
              columns={approvalColumns}
              dataSource={processData}
              size="small"
              pagination={false}
              bordered={false}
            />
            <div
              style={{
                marginTop: 20,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#e8e8e8',
                paddingTop: 20,
                paddingBottom: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CommonForm data={formItems} ref={ele => (this.$formBuilder = ele)} />
            </div>
            <div style={{ marginTop: 20 }}>
              <Table
                columns={processColumns}
                dataSource={histories}
                size="small"
                pagination={false}
                bordered={false}
              />
            </div>
            {status === 'pending' && (
              <div
                style={{
                  borderTopStyle: 'solid',
                  borderTopColor: '#e8e8e8',
                  borderTopWidth: 1,
                  marginTop: 20,
                  paddingTop: 10,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                {isCheckBtn && (
                  <div style={{ marginLeft: 10 }}>
                    <Popconfirm
                      title={
                        <div>
                          <p>确认通过该审批单的复核？</p>
                          <TextArea
                            onChange={this.setPassComment}
                            value={passComment}
                            placeholder={'请输入审核意见（可选）'}
                          />
                        </div>
                      }
                      onConfirm={this.confirmPass}
                    >
                      <Button
                        type="primary"
                        disabled={modifying && modifyBtn !== 'pass'}
                        loading={modifying && modifyBtn === 'pass'}
                      >
                        复核通过
                      </Button>
                    </Popconfirm>
                  </div>
                )}
                {isCheckBtn && (
                  <div style={{ marginLeft: 10 }}>
                    <Popconfirm
                      title={
                        <div>
                          <p>请输入不通过审批的原因：</p>
                          <TextArea onChange={this.setRejectReson} value={rejectReason} />
                        </div>
                      }
                      onConfirm={this.rejectForm}
                    >
                      <Button
                        disabled={modifying && modifyBtn !== 'reject'}
                        loading={modifying && modifyBtn === 'reject'}
                      >
                        退回
                      </Button>
                    </Popconfirm>
                  </div>
                )}
                {!isCheckBtn && (
                  <>
                    <div style={{ marginLeft: 10 }}>
                      <Popconfirm
                        title={
                          <div>
                            <p>确认将此次修改提交复核吗？</p>
                            <TextArea onChange={this.setModifyComment} value={modifyComment} />
                          </div>
                        }
                        onConfirm={this.confirmModify}
                      >
                        <Button
                          type="primary"
                          disabled={modifying && modifyBtn === 'modify'}
                          loading={modifying && modifyBtn !== 'modify'}
                        >
                          确认修改
                        </Button>
                      </Popconfirm>
                    </div>
                    <div style={{ marginLeft: 10 }}>
                      <Popconfirm title="确认废弃该审批单？" onConfirm={this.confirmAbandon}>
                        <Button
                          type="danger"
                          loading={modifying && modifyBtn === 'abandon'}
                          disabled={modifying && modifyBtn !== 'abandon'}
                        >
                          废弃
                        </Button>
                      </Popconfirm>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {loading && (
          <div
            style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Spin indicator={antIcon} />
          </div>
        )}
      </div>
    );
  }
}

export default ApprovalForm;
