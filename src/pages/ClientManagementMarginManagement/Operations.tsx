import { message, Modal, Divider } from 'antd';
import React, { PureComponent } from 'react';
import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import { clientTradeCashFlow, mgnMarginUpdate } from '@/services/reference-data-service';
import { IOGLOD_FORM_CONTROLS, UPDATE_FORM_CONTROLS } from './constants';
import { Form2 } from '@/containers';

class Operations extends PureComponent<{ record: any; fetchTable: any }> {
  public $form: Form2 = null;

  public $updateForm: Form2 = null;

  public state = {
    ioglodVisible: false,
    ioGlodConfirmLoading: false,
    ioGlodDataSource: {},
    updateVisible: false,
    updateConfirmLoading: false,
    updateDataSource: {},
  };

  public handleIoGlodConfirm = async () => {
    const validateRsp = await this.$form.validate();
    if (validateRsp.error) return;
    this.setState({
      ioGlodConfirmLoading: true,
    });
    this.onCreateIoGlod();
  };

  public onCreateIoGlod = async () => {
    const values = Form2.getFieldsValue(this.state.ioGlodDataSource);
    if (values.cashType === '保证金释放') {
      values.cashFlow = `-${values.cashFlow}`;
    }
    const { error, data } = await clientTradeCashFlow({
      accountId: this.props.record.accountId,
      cashFlow: String(0),
      marginFlow: String(values.cashFlow),
    });
    this.setState({
      ioGlodConfirmLoading: false,
    });
    if (error) {
      return false;
    }
    if (!data.status) {
      message.error(data.information);
      return false;
    }
    this.setState({ ioglodVisible: false });
    this.props.fetchTable();
    message.success('录入成功');
    return true;
  };

  public handleIoGlodCancel = () => {
    this.setState({
      ioglodVisible: false,
    });
  };

  public switchIoGlodModal = () => {
    this.setState({
      ioglodVisible: true,
      ioGlodDataSource: Form2.createFields({
        legalName: this.props.record.legalName,
        cashFlow: 0,
      }),
    });
  };

  public IOGlodFormValueChange = (props, changeFields, allFields) => {
    this.setState(state => ({
      ioGlodDataSource: {
        ...state.ioGlodDataSource,
        ...changeFields,
      },
    }));
  };

  public updateFormValueChange = (props, changeFields, allFields) => {
    this.setState(state => ({
      updateDataSource: {
        ...state.updateDataSource,
        ...changeFields,
      },
    }));
  };

  public handleUpdateCancel = () => {
    this.setState({
      updateVisible: false,
    });
  };

  public handleUpdateConfirm = async () => {
    const validateRsp = await this.$updateForm.validate();
    if (validateRsp.error) return;
    const values = Form2.getFieldsValue(this.state.updateDataSource);
    this.setState({
      updateConfirmLoading: true,
    });
    const { error, data } = await mgnMarginUpdate({
      uuid: this.props.record.uuid,
      maintenanceMargin: values.maintenanceMargin,
    });
    this.setState({
      updateConfirmLoading: false,
    });
    if (error) {
      message.error('更新失败');
      return;
    }
    this.setState({
      updateVisible: false,
    });
    this.props.fetchTable();
    message.success('更新成功');
  };

  public switchUpdateMargin = () => {
    const dataSource = {
      legalName: this.props.record.legalName,
      masterAgreementId: this.props.record.masterAgreementId,
      originMaintenanceMargin: this.props.record.maintenanceMargin,
      maintenanceMargin: 0,
    };
    this.setState({
      updateVisible: true,
      updateDataSource: Form2.createFields(dataSource),
    });
  };

  public render() {
    return (
      <>
        <a key="ioglod" onClick={this.switchIoGlodModal}>
          台账调整
        </a>
        <Divider type="vertical" />
        <a key="update" onClick={this.switchUpdateMargin}>
          更新维持保证金
        </a>
        <Modal
          {...{
            title: '台账调整',
            visible: this.state.ioglodVisible,
            onCancel: this.handleIoGlodCancel,
            onOk: this.handleIoGlodConfirm,
            confirmLoading: this.state.ioGlodConfirmLoading,
            closable: false,
          }}
        >
          <Form2
            ref={node => {
              this.$form = node;
            }}
            columns={IOGLOD_FORM_CONTROLS}
            dataSource={this.state.ioGlodDataSource}
            onFieldsChange={this.IOGlodFormValueChange}
            footer={false}
          />
        </Modal>
        <Modal
          {...{
            title: '更新维持保证金',
            visible: this.state.updateVisible,
            onCancel: this.handleUpdateCancel,
            onOk: this.handleUpdateConfirm,
            confirmLoading: this.state.updateConfirmLoading,
            closable: false,
          }}
        >
          <Form2
            ref={node => {
              this.$updateForm = node;
            }}
            columns={UPDATE_FORM_CONTROLS}
            dataSource={this.state.updateDataSource}
            onFieldsChange={this.updateFormValueChange}
            footer={false}
          />
        </Modal>
      </>
    );
  }
}

export default Operations;
