import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import { clientTradeCashFlow, mgnMarginUpdate } from '@/services/reference-data-service';
import { message, Modal, Divider } from 'antd';
import React, { PureComponent } from 'react';
import { IOGLOD_FORM_CONTROLS, UPDATE_FORM_CONTROLS } from './constants';

class Operations extends PureComponent<{ record: any; fetchTable: any }> {
  public state = {
    ioglodVisible: false,
    ioGlodConfirmLoading: false,
    ioGlodDataSource: {},
    updateVisible: false,
    updateConfirmLoading: false,
    updateDataSource: {},
  };

  public handleIoGlodConfirm = () => {
    this.setState({
      ioGlodConfirmLoading: true,
      ioglodVisible: false,
    });
    this.onCreateIoGlod();
  };

  public onCreateIoGlod = async () => {
    const values = { ...this.state.ioGlodDataSource };
    if (values.cashType === '保证金释放') {
      values.cashFlow = '-' + values.cashFlow;
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
      ioGlodDataSource: {
        legalName: this.props.record.legalName,
        cashFlow: 0,
      },
    });
  };

  public IOGlodFormValueChange = params => {
    const values = params.values;
    this.setState({
      ioGlodDataSource: values,
    });
  };

  public updateFormValueChange = params => {
    const values = params.values;
    this.setState({
      updateDataSource: values,
    });
  };

  public handleUpdateCancel = () => {
    this.setState({
      updateVisible: false,
    });
  };

  public handleUpdateConfirm = async () => {
    const values = this.state.updateDataSource;
    this.setState({
      updateVisible: false,
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
      return false;
    }
    this.props.fetchTable();
    message.success('更新成功');
    return true;
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
      updateDataSource: dataSource,
    });
  };

  public render() {
    return (
      <>
        <a href="javascript:;" key="ioglod" onClick={this.switchIoGlodModal}>
          台账调整
        </a>
        <Divider type="vertical" />
        <a href="javascript:;" key="update" onClick={this.switchUpdateMargin}>
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
          <Form
            controlNumberOneRow={1}
            controls={IOGLOD_FORM_CONTROLS}
            dataSource={this.state.ioGlodDataSource}
            onValueChange={this.IOGlodFormValueChange}
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
          <Form
            controlNumberOneRow={1}
            controls={UPDATE_FORM_CONTROLS}
            dataSource={this.state.updateDataSource}
            onValueChange={this.updateFormValueChange}
            footer={false}
          />
        </Modal>
      </>
    );
  }
}

export default Operations;
