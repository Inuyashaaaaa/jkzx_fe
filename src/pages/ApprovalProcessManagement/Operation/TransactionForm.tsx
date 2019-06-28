import moment from 'moment';
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
  Alert,
} from 'antd';
import React, { PureComponent } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
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
import { Form2, Upload, SmartTable } from '@/containers';
import { refBankAccountSearch, refSimilarLegalNameList } from '@/services/reference-data-service';
import { generateColumns } from '../tools';
import { getToken } from '@/tools/authority';
import ApprovalProcessManagementBookEdit from '@/pages/ApprovalProcessManagementBookEdit';
import styles from '../index.less';

const { TextArea } = Input;
const { Title } = Typography;
class ApprovalForm extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      modifying: false,
      modifyBtn: '',
      rejectReason: '',
      passComment: '',
      modifyComment: '',
      detailData: [],
      fileList: [],
      attachmentId: null,
      bookEditVisible: false,
      editable: false,
      isCompleted: null,
      tableData: {},
    };
  }

  public componentDidMount = async () => {
    const { formData, status } = this.props;
    this.fetchData(formData, status);
  };

  public componentWillReceiveProps(nextProps) {
    const { formData, status } = nextProps;
    const pre = this.props.formData;
    if (pre.processInstanceId !== formData.processInstanceId) {
      this.setState(
        {
          data: {},
          loading: true,
          modifying: false,
          modifyBtn: '',
          rejectReason: '',
          passComment: '',
          modifyComment: '',
        },
        () => {
          this.fetchData(formData, status);
        },
      );
    }
  }

  public fetchData = async (params, status) => {
    const processInstanceId = params.processInstanceId || params.processInstance.processInstanceId;

    this.setState({
      loading: true,
    });
    const isCompleted = params.processInstanceStatusEnum
      ? !_.toLower(params.processInstanceStatusEnum).includes('unfinished') &&
        this.props.status !== 'pending'
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
    const newDetailData = {
      tradeId: _.get(data, 'process._business_payload.trade.tradeId'),
      bookName: _.get(data, 'process._business_payload.trade.bookName'),
      tradeDate: _.get(data, 'process._business_payload.trade.tradeDate'),
      salesName: _.get(data, 'process._business_payload.trade.salesName'),
      counterPartyName: _.get(
        data,
        'process._business_payload.trade.positions[0].counterPartyName',
      ),
      trader: _.get(data, 'process._business_payload.trade.trader'),
    };
    this.setState({
      detailData: newDetailData,
      currentNodeDTO: _.get(data, 'currentNodeDTO.taskType'),
      isCompleted,
      tableData: _.get(data, 'process._business_payload'),
    });
    this.setState({
      data,
      loading: false,
      res: res.data,
    });
  };

  public confirmAbandon = async () => {
    const { data, error } = await wkProcessInstanceFormGet({
      processInstanceId: this.props.formData.processInstanceId,
    });
    if (error) return;
    const { formData } = this.props;
    const { modifyComment } = this.state;
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        abandon: true,
      },
      businessProcessData: _.get(data, 'process._business_payload'),
    };
    this.executeModify(params, 'abandon');
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
      businessProcessData: this.state.tableData,
    };
    this.executeModify(params, 'pass');
  };

  public confirmModify = async () => {
    const { passComment } = this.state;
    const { formData } = this.props;
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: passComment,
        abandon: false,
      },
      businessProcessData: this.state.tableData,
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
      businessProcessData: this.state.tableData,
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

  public transactionHandleOk = async attachmentName => {
    if (this.state.attachmentId) {
      const { error, data } = await wkAttachmentProcessInstanceModify({
        attachmentId: this.state.attachmentId,
        processInstanceId: this.props.formData.processInstanceId,
      });
      if (error) return;
      message.success(`${attachmentName}上传成功`);
    }
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
    const { data: approvalData, error: _error } = await wkAttachmentList({
      processInstanceId: data.processInstance.processInstanceId,
    });
    if (_error) return;
    if (!approvalData || approvalData.length <= 0) {
      message.success('未上传审批附件');
      return;
    }
    window.open(`${downloadTradeAttachment}${approvalData[0].attachmentId}`);
  };

  public handleConfirmModify = data => {
    const detailData = {
      tradeId: _.get(data, 'tradeId'),
      bookName: _.get(data, 'bookName'),
      tradeDate: _.get(data, 'tradeDate'),
      salesName: _.get(data, 'salesName'),
      counterPartyName: _.get(data, 'positions[0].counterPartyName'),
      trader: _.get(data, 'trader'),
    };
    this.setState({
      tableData: { trade: data, validTime: '2018-01-01T10:10:10' },
      detailData,
    });
  };

  public render() {
    const { status, formData } = this.props;
    const {
      data,
      loading,
      modifying,
      modifyBtn,
      rejectReason,
      passComment,
      modifyComment,
      currentNodeDTO,
    } = this.state;
    const isCheckBtn = currentNodeDTO !== 'modifyData' && status === 'pending';
    const processColumns = generateColumns('process');
    let histories = data.taskHistory ? data.taskHistory : [];
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const approvalData = data.processInstance ? data.processInstance : {};
    histories = histories.sort(
      (item1, item2) => moment(item1.operateTime).valueOf() - moment(item2.operateTime).valueOf(),
    );
    if (histories.length > 0) {
      if (histories[histories.length - 1].operation === '退回') {
        approvalData.status = '待修改';
      } else if (formData.processInstanceStatusEnum === 'processUnfinished') {
        approvalData.status = '待审批';
      } else {
        approvalData.status = '审批完成';
      }
    }
    return (
      <div className={styles.fromContainer}>
        {!loading && (
          <div>
            <Form2
              layout="horizontal"
              dataSource={approvalData}
              resetable={false}
              submitable={false}
              columnNumberOneRow={2}
              style={{ paddingLeft: '30px' }}
              footer={false}
              columns={[
                {
                  title: '审批单号',
                  dataIndex: 'processSequenceNum',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '审批类型',
                  dataIndex: 'processName',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },

                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '发起人',
                  dataIndex: `${approvalData.initiatorName ? 'initiatorName' : 'operatorName'}`,
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '标题',
                  dataIndex: 'subject',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
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
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '交易簿',
                  dataIndex: 'bookName',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '交易日',
                  dataIndex: 'tradeDate',
                  render: (value, record, index, { form, editing }) => (
                    <FormItem>
                      {value && value.indexOf('T') >= 0 ? value.split('T')[0] : value}
                    </FormItem>
                  ),
                },
                {
                  title: '交易对手',
                  dataIndex: 'counterPartyName',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '关联销售',
                  dataIndex: 'salesName',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '交易创建人',
                  dataIndex: 'trader',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
              ]}
            />
            <div style={{ marginLeft: 62, marginTop: 10 }}>
              {approvalData.status === '待审批' ||
              approvalData.status === '审核完成' ||
              status !== 'pending' ? (
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
                        this.setState(
                          {
                            attachmentId: _.get(fileList, '[0].response.result.attachmentId'),
                          },
                          () => {
                            this.transactionHandleOk(
                              _.get(fileList, '[0].response.result.attachmentName'),
                            );
                          },
                        );
                      }
                    }}
                    value={this.state.fileList}
                    showUploadList={false}
                  >
                    <Button>重新上传附件</Button>
                  </Upload>
                </Row>
              )}
            </div>

            <Title level={4} style={{ marginTop: 50 }}>
              流程记录
            </Title>
            <div style={{ marginTop: 20 }}>
              <SmartTable
                columns={processColumns}
                dataSource={histories}
                size="small"
                pagination={false}
                bordered={false}
                rowKey="operateTime"
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
                            placeholder="请输入审核意见（可选）"
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
                        onConfirm={e => this.confirmModify()}
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
          title={
            approvalData.status === '待审批' ||
            approvalData.status === '审核完成' ||
            status !== 'pending'
              ? '查看合约详情'
              : '修改合约详情'
          }
          visible={this.state.bookEditVisible}
          onOk={this.bookEditHandleOk}
          onCancel={this.tbookEditCancel}
          width={1100}
          footer={false}
        >
          <ApprovalProcessManagementBookEdit
            id={data.processInstance ? data.processInstance.processInstanceId : null}
            editable={this.state.editable}
            tbookEditCancel={this.tbookEditCancel}
            taskId={this.props.formData.taskId}
            res={this.state.res}
            confirmModify={this.handleConfirmModify}
            isCompleted={this.state.isCompleted}
          />
        </Modal>
      </div>
    );
  }
}

export default ApprovalForm;
