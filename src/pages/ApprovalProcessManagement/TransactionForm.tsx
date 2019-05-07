import SourceTable from '@/lib/components/_SourceTable';
import {
  completeTaskProcess,
  queryProcessForm,
  queryProcessHistoryForm,
  terminateProcess,
  wkProcessInstanceFormGet,
  UPLOAD_URL,
  wkAttachmentProcessInstanceModify,
} from '@/services/approval';
import moment from 'moment';
import { Form2, Select, Input, Upload } from '@/design/components';
import { refBankAccountSearch, refSimilarLegalNameList } from '@/services/reference-data-service';
import { Button, Icon, Popconfirm, Spin, Table, Row, Modal, message } from 'antd';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { generateColumns } from './constants';
import FormItem from 'antd/lib/form/FormItem';
import { getToken } from '@/lib/utils/authority';

// const { TextArea } = Input;

class ApprovalForm extends PureComponent {
  public $sourceTable: SourceTable = null;

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
      detailData: [],
      fileList: [],
      transactionModalVisible: false,
      attachmentId: null,
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
    const { error: _error, data: _data } = await wkProcessInstanceFormGet({ processInstanceId });
    if (_error) return;
    // 审批内容
    const _detailData = {
      tradeId: _data.process._business_payload.tradeId,
      bookName: _data.process._business_payload.bookName,
      tradeDate: _data.process._business_payload.tradeDate,
      trader: _data.process._business_payload.trader,
      salesName: _data.process._business_payload.salesName,
      counterPartyName: _data.process._business_payload.positions[0].counterPartyName,
    };
    this.setState({
      detailData: _detailData,
    });
    console.log(_data);

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
    console.log(data);
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

  public transactionHandleOk = async () => {
    // 关联附件
    if (this.state.attachmentId) {
      const { error, data } = await wkAttachmentProcessInstanceModify({
        attachmentId: this.state.attachmentId,
        processInstanceId: this.props.formData.processInstanceId,
      });
      if (error) return;
      message.success('重新上传附件成功');
    }

    this.setState({
      transactionModalVisible: false,
    });
  };

  public transactionHandleCancel = () => {
    this.setState({
      transactionModalVisible: false,
    });
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
    const _data = data.processInstance ? data.processInstance : {};
    if (histories.length > 0) {
      _data.status = histories[histories.length - 1].operation === '退回' ? '待审批' : '待修改';
    }
    return (
      <div>
        {!loading && (
          <div>
            <Form2
              ref={node => (this.$sourceTable = node)}
              layout="horizontal"
              dataSource={_data}
              resetable={false}
              submitable={false}
              columnNumberOneRow={3}
              style={{ paddingLeft: '30px' }}
              columns={[
                {
                  title: '审批单号',
                  dataIndex: 'processSequenceNum',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '审批类型',
                  dataIndex: 'processName',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },

                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '发起人',
                  dataIndex: 'initiatorName',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '标题',
                  dataIndex: 'subject',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
              ]}
            />
            <Row>
              <b>审批内容</b>
            </Row>
            <Form2
              layout="horizontal"
              dataSource={this.state.detailData}
              resetable={false}
              submitable={false}
              style={{ paddingLeft: '30px' }}
              columnNumberOneRow={3}
              columns={[
                {
                  title: '交易编号',
                  dataIndex: 'tradeId',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '交易簿',
                  dataIndex: 'bookName',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '交易日',
                  dataIndex: 'tradeDate',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '交易对手',
                  dataIndex: 'counterPartyName',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '关联销售',
                  dataIndex: 'salesName',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
                {
                  title: '交易创建人',
                  dataIndex: 'trader',
                  render: (value, record, index, { form, editing }) => {
                    return <FormItem>{value}</FormItem>;
                  },
                },
              ]}
            />
            {_data.status === '待审批' ? (
              <Row style={{ marginBottom: '20px', paddingLeft: '30px' }}>
                <Button style={{ marginRight: '20px' }}>查看合约详情</Button>
                <Button>下载审批附件</Button>
              </Row>
            ) : (
              <Row style={{ marginBottom: '20px', paddingLeft: '30px' }}>
                <Button style={{ marginRight: '20px' }}>修改合约详情</Button>
                <Button
                  onClick={() => {
                    this.setState({ transactionModalVisible: true });
                  }}
                >
                  重新上传附件
                </Button>
              </Row>
            )}
            <Row>
              <b>流程记录</b>
            </Row>
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
                          {/* <TextArea
                                                        onChange={this.setPassComment}
                                                        value={passComment}
                                                        placeholder={'请输入审核意见（可选）'}
                                                    /> */}
                          <Input
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
                          <Input onChange={this.setRejectReson} value={rejectReason} />
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
                            <Input onChange={this.setModifyComment} value={modifyComment} />
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
        <Modal
          title="发起审批"
          visible={this.state.transactionModalVisible}
          onOk={this.transactionHandleOk}
          onCancel={this.transactionHandleCancel}
        >
          <div style={{ margin: '20px' }}>
            <p>您提交的交易需要通过审批才能完成簿记。请上传交易确认书等证明文件后发起审批。</p>
            <p style={{ margin: '20px', textAlign: 'center' }}>
              <Upload
                maxLen={1}
                action={UPLOAD_URL}
                data={{
                  method: 'wkAttachmentUpload',
                  params: JSON.stringify({}),
                }}
                headers={{ Authorization: `Bearer ${getToken()}` }}
                onChange={fileList => {
                  console.log(fileList);
                  this.setState({
                    fileList,
                  });
                  if (fileList[0].status === 'done') {
                    this.setState({
                      attachmentId: fileList[0].response.result.attachmentId,
                    });
                  }
                }}
                value={this.state.fileList}
              />
            </p>
            <p>审批中的交易请在审批管理页面查看。</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ApprovalForm;
