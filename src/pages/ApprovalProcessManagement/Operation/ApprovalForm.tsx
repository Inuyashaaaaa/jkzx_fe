import moment from 'moment';
import { Button, Icon, Input, Popconfirm, Spin, Table } from 'antd';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { format } from 'util';
import {
  completeTaskProcess,
  queryProcessForm,
  queryProcessHistoryForm,
  terminateProcess,
} from '@/services/approval';
import { refBankAccountSearch, refSimilarLegalNameList } from '@/services/reference-data-service';
import CommonForm from '@/pages/SystemSettingDepartment/components/CommonForm';
import { generateColumns, CREATE_FORM_CONTROLS } from '../tools';
import { SmartTable, Form2 } from '@/containers';
import { formatNum } from '@/tools';
import styles from '../index.less';

const { TextArea } = Input;
const NORMAL = 'NORMAL';

class ApprovalForm extends PureComponent {
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
      currentNodeDTO: null,
      financialFormData: {},
      bankAccountList: [],
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
          financialFormData: {},
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
    this.setState({
      currentNodeDTO: _.get(data, 'currentNodeDTO.taskType'),
    });
    const financialFormData = _.get(data, 'process._business_payload');
    this.setState(
      {
        data,
        loading: false,
        financialFormData: Form2.createFields({
          ...financialFormData,
          paymentDate: moment(financialFormData.paymentDate),
        }),
      },
      () => {
        this.fetchBankAccountList(this.state.financialFormData);
      },
    );
  };

  public fetchBankAccountList = async form => {
    if (form.clientId) {
      const { error, data } = await refBankAccountSearch({
        legalName: Form2.getFieldValue(form.clientId),
        bankAccountStatus: NORMAL,
      });
      if (error) return;
      const bankAccountList = _.map(data, (val, key) => ({
        label: _.pick(val, ['bankAccount']).bankAccount,
        value: _.pick(val, ['bankAccount']).bankAccount,
        bankName: _.pick(val, ['bankName']).bankName,
        bankAccountName: _.pick(val, ['bankAccountName']).bankAccountName,
      }));
      this.setState({
        bankAccountList,
      });
    }
  };

  public confirmAbandon = async () => {
    const res = await this.$formBuilder.validate();
    if (res.error) {
      return;
    }

    const { formData } = this.props;
    // const { modifyComment } = this.state;
    const financialFormData = Form2.getFieldsValue(this.state.financialFormData);
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        abandon: true,
      },
      businessProcessData: {
        ...financialFormData,
        paymentDate: moment(financialFormData.paymentDate).format('YYYY-MM-DD'),
      },
    };
    this.executeModify(params, 'abandon');
  };

  public confirmPass = async () => {
    const res = await this.$formBuilder.validate();
    if (res.error) {
      return;
    }

    const { formData } = this.props;
    const { passComment } = this.state;
    const financialFormData = Form2.getFieldsValue(this.state.financialFormData);
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: passComment,
        confirmed: true,
      },
      businessProcessData: {
        ...financialFormData,
        paymentDate: moment(financialFormData.paymentDate).format('YYYY-MM-DD'),
      },
    };
    this.executeModify(params, 'pass');
  };

  public confirmModify = async () => {
    const res = await this.$formBuilder.validate();
    if (res.error) {
      return;
    }

    const { formData } = this.props;
    const { modifyComment } = this.state;
    const financialFormData = Form2.getFieldsValue(this.state.financialFormData);
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: modifyComment,
        abandon: false,
      },
      businessProcessData: {
        ...financialFormData,
        paymentDate: moment(financialFormData.paymentDate).format('YYYY-MM-DD'),
      },
    };
    this.executeModify(params, 'modify');
  };

  public rejectForm = async () => {
    const res = await this.$formBuilder.validate();
    if (res.error) {
      return;
    }

    const { formData } = this.props;
    const { rejectReason } = this.state;
    const financialFormData = Form2.getFieldsValue(this.state.financialFormData);
    const params = {
      taskId: formData.taskId,
      ctlProcessData: {
        comment: rejectReason,
        confirmed: false,
      },
      businessProcessData: {
        ...financialFormData,
        paymentDate: moment(financialFormData.paymentDate).format('YYYY-MM-DD'),
      },
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

  public financialFormChange = async (props, changedValues, allValues) => {
    const { financialFormData } = this.state;
    if (changedValues.clientId) {
      const { error, data } = await refBankAccountSearch({
        legalName: Form2.getFieldValue(allValues.clientId),
        bankAccountStatus: NORMAL,
      });
      if (error) return;
      const bankAccountList = _.map(data, (val, key) => ({
        label: _.pick(val, ['bankAccount']).bankAccount,
        value: _.pick(val, ['bankAccount']).bankAccount,
        bankName: _.pick(val, ['bankName']).bankName,
        bankAccountName: _.pick(val, ['bankAccountName']).bankAccountName,
      }));
      this.setState({
        bankAccountList,
        financialFormData: {
          ...financialFormData,
          ...changedValues,
          ...Form2.createFields(
            Form2.getFieldValue(changedValues.clientId) !==
              Form2.getFieldValue(financialFormData.clientId)
              ? { bankAccount: null }
              : null,
          ),
        },
      });
      return;
    }
    this.setState({
      financialFormData: {
        ...financialFormData,
        ...changedValues,
      },
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

    const approvalColumns = generateColumns(
      'approval',
      data.processInstance && data.processInstance.operator ? 'operator' : 'initiator',
    );
    const processColumns = generateColumns('process');
    const processData = data.processInstance ? [data.processInstance] : [];
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    let histories = data.taskHistory ? data.taskHistory : [];
    histories = histories.sort(
      (item1, item2) => moment(item1.operateTime).valueOf() - moment(item2.operateTime).valueOf(),
    );
    let approvalDataDtatus = null;
    if (histories.length > 0) {
      if (histories[histories.length - 1].operation === '退回') {
        approvalDataDtatus = '待修改';
      } else if (formData.processInstanceStatusEnum === 'processUnfinished') {
        approvalDataDtatus = '待审批';
      } else {
        approvalDataDtatus = '审批完成';
      }
    }
    const formStatus =
      approvalDataDtatus === '待审批' || approvalDataDtatus === '审核完成' || status !== 'pending';
    return (
      <div>
        {!loading && (
          <div>
            <SmartTable
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
              <Form2
                ref={node => {
                  this.$formBuilder = node;
                }}
                dataSource={this.state.financialFormData}
                columns={CREATE_FORM_CONTROLS(this.state.bankAccountList, formStatus)}
                footer={false}
                onFieldsChange={this.financialFormChange}
                style={{ width: '60%' }}
                className={styles.createForm}
              />
            </div>
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
