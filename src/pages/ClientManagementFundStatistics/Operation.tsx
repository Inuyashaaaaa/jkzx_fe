import { Alert, Button, Icon, message, Modal } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Form2, InputNumber, Upload } from '@/containers';
import { UPLOAD_URL, wkProcessGet, wkProcessInstanceCreate } from '@/services/approval';
import {
  clientUpdateCredit,
  wkAttachmentProcessInstanceBind,
} from '@/services/reference-data-service';
import { getToken } from '@/tools/authority';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
  public $form: Form2 = null;

  public state = {
    visible: false,
    formData: {},
    modalVisible: false,
    fileList: [],
    attachmentId: null,
  };

  public switchModal = () => {
    this.setState({
      visible: true,
      formData: Form2.createFields({
        counterPartyCredit: this.props.record.counterPartyCredit,
        credit: this.props.record.credit,
      }),
    });
  };

  public hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    const { error: _error } = await this.$form.validate();
    if (_error) return;
    const { error: perror, data: pdata } = await wkProcessGet({
      processName: '授信额度变更',
    });
    if (perror) return;
    if (pdata.status) {
      this.setState({
        modalVisible: true,
      });
      return;
    }

    const params = _.mapValues(this.state.formData, item => _.get(item, 'value'));
    const { error, data } = await clientUpdateCredit({
      ...params,
      accountId: this.props.record.accountId,
      legalName: this.props.record.legalName,
    });
    this.setState({
      visible: false,
    });
    if (error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.props.fetchTable();
  };

  // eslint-disable-next-line  consistent-return
  public handleCreate = async () => {
    const params = _.mapValues(this.state.formData, item => _.get(item, 'value'));
    const { error, data } = await wkProcessInstanceCreate({
      processName: '授信额度变更',
      processData: {
        ...params,
        accountId: this.props.record.accountId,
        legalName: this.props.record.legalName,
        record: this.props.record,
      },
    });
    if (error) return true;
    if (data.processInstanceId) {
      message.success('已进入流程');
    }

    this.setState({
      visible: false,
    });
    if (this.state.attachmentId) {
      const { error: aerror, data: adata } = await wkAttachmentProcessInstanceBind({
        attachmentId: this.state.attachmentId,
        processInstanceId: data.processInstanceId,
      });
      if (aerror) return true;
    }
    return true;
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      formData: allFields,
    });
  };

  public handleOk = async () => {
    this.setState({
      modalVisible: false,
    });
    const error = await this.handleCreate();
    if (error) return;
    router.push('/approval-process/process-manangement');
  };

  public handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  public render() {
    return (
      <>
        <a onClick={this.switchModal}>调整授信额度</a>
        <Modal
          visible={this.state.visible}
          onOk={this.onConfirm}
          onCancel={this.hideModal}
          title="调整授信额度"
        >
          <Form2
            ref={node => {
              this.$form = node;
            }}
            dataSource={this.state.formData}
            onFieldsChange={this.onFieldsChange}
            submitable={false}
            resetable={false}
            footer={false}
            columns={[
              {
                title: '客户授信总额',
                dataIndex: 'credit',
                render: (value, record, index, { form, editing }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '客户授信额度是必填项',
                        },
                      ],
                    })(<InputNumber min={0} precision={4} />)}
                  </FormItem>
                ),
              },
              {
                title: '我方授信总额',
                dataIndex: 'counterPartyCredit',
                render: (value, record, index, { form, editing }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '我方授信额度是必填项',
                        },
                      ],
                    })(<InputNumber min={0} precision={4} />)}
                  </FormItem>
                ),
              },
            ]}
          />
        </Modal>
        <Modal
          title="发起审批"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="发起审批"
        >
          <div style={{ margin: '20px' }}>
            <Alert
              showIcon
              type="info"
              message="您提交的授信额度变更需要通过审批才能完成生效。请上传授信协议等证明文件后发起审批。"
            />
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
                onRemove={() => {
                  // this.setState({
                  //   fileList: [],
                  // })
                  message.info('请重新选择上传文件');
                  return false;
                }}
              >
                <Button>
                  <Icon type="upload" />
                  上传文件
                </Button>
              </Upload>
            </p>
            <Alert message="请在“流程管理”模块中查看审批进展。" />
          </div>
        </Modal>
      </>
    );
  }
}

export default Operation;
