import moment from 'moment';
import {
  Button,
  Icon,
  Popconfirm,
  Spin,
  Row,
  message,
  Input as AntdInput,
  Typography,
  Divider,
} from 'antd';
import React, { PureComponent } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import {
  completeTaskProcess,
  queryProcessForm,
  queryProcessHistoryForm,
  wkProcessInstanceFormGet,
  wkAttachmentList,
  downloadTradeAttachment,
} from '@/services/approval';
import { queryCompleteCompanys } from '@/services/sales';
import { Form2, Input as Input2, InputNumber, SmartTable } from '@/containers';
import { generateColumns } from '../tools';
import styles from '../index.less';
import { arr2treeOptions } from '@/tools';
import EditModalButton from '../../ClientManagementInfo/EditModelButton';

const { TextArea } = AntdInput;
const { Title } = Typography;
class AccountOpeningApproval extends PureComponent<any, any> {
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
      detailData: {},
      creditForm: {},
      isCompleted: null,
      salesCascaderList: [],
    };
  }

  public componentDidMount = async () => {
    const { formData, status } = this.props;
    this.fetchData(formData, status);
    this.handleGetInitForm();
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

  public fetchBranchSalesList = async () => {
    const { error, data } = await queryCompleteCompanys();
    if (error) return;
    const newData = arr2treeOptions(
      data,
      ['subsidiaryId', 'branchId', 'salesId'],
      ['subsidiaryName', 'branchName', 'salesName'],
    );

    const branchSalesList = newData.map(subsidiary => ({
      value: subsidiary.label,
      label: subsidiary.label,
      children: subsidiary.children.map(branch => ({
        value: branch.label,
        label: branch.label,
        children: branch.children.map(salesName => ({
          value: salesName.label,
          label: salesName.label,
        })),
      })),
    }));
    this.setState({
      salesCascaderList: branchSalesList,
    });
  };

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
    const approvalData = {
      legalName: _.get(data, 'process._business_payload.legalName'),
      salesName: _.get(data, 'process._business_payload.salesName'),
      clientType: _.get(data, 'process._business_payload.clientType'),
    };

    const creditForm = {
      credit: _.get(data, 'process._business_payload.credit'),
      counterPartyCredit: _.get(data, 'process._business_payload.counterPartyCredit'),
    };
    this.setState({
      detailData: Form2.createFields(approvalData),
      creditForm: Form2.createFields(creditForm),
      currentNodeDTO: _.get(data, 'currentNodeDTO.taskType'),
      isCompleted,
    });

    this.setState({
      data,
      loading: false,
    });

    const AttachmentListRes = await wkAttachmentList({
      processInstanceId: this.props.formData.processInstanceId,
    });
    if (AttachmentListRes.error) return;
    this.fetchBranchSalesList();
  };

  public handleConfirmModify = async e => {
    this.setState({
      loading: true,
    });
    const processInstanceId =
      this.props.formData.processInstanceId ||
      this.props.formData.processInstance.processInstanceId;
    const isCheckBtn =
      this.props.formData &&
      this.props.formData.taskName &&
      this.props.status === 'pending' &&
      this.props.formData.taskName.includes('修改资金流水');

    this.setState({
      loading: true,
    });
    const { isCompleted } = this.state;
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
    const { modifyComment } = this.state;
    const param = {
      taskId: this.props.formData.taskId,
      ctlProcessData: {
        comment: modifyComment,
        abandon: false,
      },
      businessProcessData: this.state.accountData,
    };
    this.executeModify(param, 'modify');
  };

  public handleGetInitForm = async () => {
    const { processInstanceId } = this.props.formData;
    const isCompleted = this.props.formData.processInstanceStatusEnum
      ? !_.toLower(this.props.formData.processInstanceStatusEnum).includes('unfinished') &&
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
    const data = _.get(res, 'data.process._business_payload');
    this.handleGetData(data);
  };

  public handleGetData = param => {
    this.setState({
      accountData: param,
    });
  };

  public confirmAbandon = async () => {
    const { data, error } = await wkProcessInstanceFormGet({
      processInstanceId: this.props.formData.processInstanceId,
    });
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
    const { isCompleted } = this.state;
    const executeMethod = isCompleted ? queryProcessHistoryForm : queryProcessForm;
    const res = await executeMethod({
      processInstanceId: formData.processInstanceId,
    });
    if (!res || res.error) {
      this.setState({
        loading: false,
      });
      return;
    }
    const data = (res && res.data) || {};
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        confirmed: true,
        comment: passComment,
      },
      businessProcessData: {
        ..._.get(data, 'process._business_payload'),
        ...Form2.getFieldsValue(this.state.creditForm),
      },
    };
    this.executeModify(params, 'pass');
  };

  public confirmModify = async (e, param) => {
    const { passComment } = this.state;
    /* eslint-disable no-param-reassign */
    if (param) {
      param.ctlProcessData = {
        comment: passComment,
        abandon: false,
      };
      this.executeModify(_.cloneDeep(param), 'pass');
      return;
    }
    /* eslint-enable no-param-reassign */
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
      businessProcessData: _.get(data, 'process._business_payload'),
    };
    this.executeModify(params, 'modify');
  };

  public rejectForm = async () => {
    const { formData } = this.props;
    const { rejectReason } = this.state;
    const { data, error } = await wkProcessInstanceFormGet({
      processInstanceId: this.props.formData.processInstanceId,
    });
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: rejectReason,
        confirmed: false,
      },
      businessProcessData: _.get(data, 'process._business_payload'),
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

  public download = async () => {
    const { data } = this.state;
    const { data: downloadData, error: _error } = await wkAttachmentList({
      processInstanceId: data.processInstance.processInstanceId,
    });
    if (_error) return;
    if (!downloadData || downloadData.length <= 0) {
      message.success('未上传审批附件');
      return;
    }
    window.open(`${downloadTradeAttachment}${downloadData[0].attachmentId}`);
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      creditForm: allFields,
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
                  title: '交易对手',
                  dataIndex: 'legalName',
                  render: (value, record, index, { form, editing }) => (
                    <FormItem>{form.getFieldDecorator({})(<Input2 editing={false} />)}</FormItem>
                  ),
                },
                {
                  title: '关联销售',
                  dataIndex: 'salesName',
                  render: (value, record, index, { form, editing }) => <FormItem>{value}</FormItem>,
                },
                {
                  title: '类型',
                  dataIndex: 'clientType',
                  render: (value, record, index, { form, editing }) => (
                    <FormItem>{value === 'PRODUCT' ? '产品户' : '机构户'}</FormItem>
                  ),
                },
              ]}
            />
            <div style={{ marginLeft: 62, marginTop: 10 }}>
              {approvalData.status === '待审批' ||
              approvalData.status === '审核完成' ||
              status !== 'pending' ? (
                <Row style={{ marginBottom: '20px', paddingLeft: '30px' }}>
                  <EditModalButton
                    salesCascaderList={this.state.salesCascaderList}
                    name="查看"
                    modelEditable={false}
                    content={<Button>查看完整信息</Button>}
                    processInstanceId={this.props.formData.processInstanceId}
                    style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                    status={this.props.status}
                    formData={this.props.formData}
                  />
                </Row>
              ) : (
                <Row style={{ marginBottom: '20px', paddingLeft: '30px' }}>
                  <EditModalButton
                    salesCascaderList={this.state.salesCascaderList}
                    name="编辑"
                    modelEditable
                    content={<Button>修改客户信息</Button>}
                    style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                    handleApprovalData={this.handleGetData}
                    processInstanceId={this.props.formData.processInstanceId}
                    status={this.props.status}
                    formData={this.props.formData}
                  />
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
                        onConfirm={this.handleConfirmModify}
                      >
                        <Button
                          type="primary"
                          disabled={modifying && modifyBtn === 'modify'}
                          loading={modifying && modifyBtn !== 'modify'}
                        >
                          再次提交审批
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

export default AccountOpeningApproval;
