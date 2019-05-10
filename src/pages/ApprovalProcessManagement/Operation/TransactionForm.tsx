import SourceTable from '@/lib/components/_SourceTable';
import {
  completeTaskProcess,
  queryProcessForm,
  queryProcessHistoryForm,
  wkProcessInstanceFormGet,
  UPLOAD_URL,
  wkAttachmentProcessInstanceModify,
  wkAttachmentList,
  downloadTradeAttachment,
} from '@/services/approval';
import moment from 'moment';
import { Form2, Upload } from '@/design/components';
import { refBankAccountSearch, refSimilarLegalNameList } from '@/services/reference-data-service';
import {
  Button,
  Icon,
  Popconfirm,
  Spin,
  Table,
  Row,
  Modal,
  message,
  Input,
  Typography,
  Divider,
} from 'antd';
import React, { PureComponent } from 'react';
import { generateColumns } from '../constants';
import FormItem from 'antd/lib/form/FormItem';
import { getToken } from '@/lib/utils/authority';
import ApprovalProcessManagementBookEdit from '@/pages/ApprovalProcessManagementBookEdit';
import _ from 'lodash';
const { TextArea } = Input;
const { Title } = Typography;
class ApprovalForm extends PureComponent<any, any> {
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
      bookEditVisible: false,
      editable: false,
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
    const isCompleted = params.status
      ? !params.status.includes('unfinished') || this.props.status === 'pending'
      : false;
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
    const _detailData = {
      tradeId: _.get(data, 'process._business_payload.trade.tradeId'),
      bookName: _.get(data, 'process._business_payload.trade.bookName'),
      tradeDate: _.get(data, 'process._business_payload.trade.tradeDate'),
      salesName: _.get(data, 'process._business_payload.trade.salesName'),
      counterPartyName: _.get(
        data,
        'process._business_payload.trade.positions[0].counterPartyName'
      ),
    };
    this.setState({
      detailData: _detailData,
    });

    if (!isCheckBtn) {
      const formItems = this.formatFormItems(data, true);
      this.setState({
        data,
        status,
        formItems,
        loading: false,
        res: res.data,
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
    // this.$formBuilder.validateForm(values => {
    //   const obj = { ...values };
    //   obj.paymentDirection = obj.paymentDirection === '入金' ? 'IN' : 'OUT';
    //   obj.accountDirection = obj.accountDirection === '客户资金' ? 'PARTY' : 'COUNTER_PARTY';
    //   obj.paymentDate = moment(obj.paymentDate).format('YYYY-MM-DD');
    const { formData } = this.props;
    const { modifyComment } = this.state;
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        abandon: true,
      },
      businessProcessData: {},
    };
    this.executeModify(params, 'abandon');
    // });
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

  public confirmModify = async (e, param) => {
    const { passComment } = this.state;
    if (param) {
      param.ctlProcessData = {
        comment: passComment,
        abandon: false,
      };
      return this.executeModify(_.cloneDeep(param), 'pass');
    }
    const { data, error } = await wkProcessInstanceFormGet({
      processInstanceId: this.props.formData.processInstanceId,
    });
    if (error) return;
    const { formData } = this.props;
    const { modifyComment } = this.state;
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: modifyComment,
        abandon: false,
      },
      businessProcessData: data.process._business_payload,
    };
    this.executeModify(params, 'modify');
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

  public bookEditHandleOk = async () => {
    this.setState({
      bookEditVisible: false,
    });
  };

  public tbookEditCancel = () => {
    this.setState({
      bookEditVisible: false,
    });
  };

  public download = async () => {
    const { data } = this.state;
    const { data: _data, error: _error } = await wkAttachmentList({
      processInstanceId: data.processInstance.processInstanceId,
    });
    if (_error) return;
    if (!_data || _data.length <= 0) {
      return message.success('未上传审批附件');
    }
    window.open(`${downloadTradeAttachment}${_data[0].attachmentId}`);
  };

  public handleConfirmModify = (e, data) => {
    return this.confirmModify(e, data);
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
    let histories = data.taskHistory ? data.taskHistory : [];
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin={true} />;
    const _data = data.processInstance ? data.processInstance : {};
    histories = histories.sort((item1, item2) => {
      return moment(item1.operateTime).valueOf() - moment(item2.operateTime).valueOf();
    });
    if (histories.length > 0) {
      _data.status =
        histories[histories.length - 1].operation === '退回'
          ? '待修改'
          : histories[histories.length - 1].operation === '复核通过'
          ? '审核完成'
          : '待审批';
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
              columnNumberOneRow={2}
              style={{ paddingLeft: '30px' }}
              footer={false}
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
                  dataIndex: 'operatorName',
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
            <Divider type="horizontal" />
            <Title level={4}>审批内容</Title>
            <Form2
              layout="horizontal"
              dataSource={this.state.detailData}
              resetable={false}
              submitable={false}
              style={{ paddingLeft: '30px' }}
              columnNumberOneRow={2}
              footer={false}
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
            <Divider type="horizontal" />
            {_data.status === '待审批' || _data.status === '审核完成' ? (
              <Row style={{ marginBottom: '20px', paddingLeft: '30px' }}>
                <Button
                  style={{ marginRight: '20px' }}
                  onClick={() => {
                    this.setState({ bookEditVisible: true, editable: false });
                  }}
                >
                  查看合约详情
                </Button>
                <Button onClick={this.download}>下载审批附件</Button>
              </Row>
            ) : (
              <Row style={{ marginBottom: '20px', paddingLeft: '30px' }}>
                <Button
                  style={{ marginRight: '20px' }}
                  onClick={() => {
                    this.setState({ bookEditVisible: true, editable: true });
                  }}
                >
                  修改合约详情
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ transactionModalVisible: true });
                  }}
                >
                  重新上传附件
                </Button>
              </Row>
            )}
            <Divider type="horizontal" />
            <Title level={4}>流程记录</Title>
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
                        onConfirm={e => this.confirmModify(e, null)}
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
        <Modal
          title="发起审批"
          visible={this.state.bookEditVisible}
          onOk={this.bookEditHandleOk}
          onCancel={this.tbookEditCancel}
          width={1100}
          footer={false}
        >
          {/* <ApprovalProcessManagementBookEdit id={data.process ? data.process._business_payload.trade.tradeId : null}/> */}
          <ApprovalProcessManagementBookEdit
            id={data.processInstance ? data.processInstance.processInstanceId : null}
            editable={this.state.editable}
            tbookEditCancel={this.tbookEditCancel}
            taskId={this.props.formData.taskId}
            res={this.state.res}
            confirmModify={this.handleConfirmModify}
          />
        </Modal>
      </div>
    );
  }
}

export default ApprovalForm;
