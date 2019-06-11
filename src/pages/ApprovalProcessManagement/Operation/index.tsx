import ModalButton from '@/containers/ModalButton';
import { queryProcessDiagram } from '@/services/approval';
import { Col, Row, Button, Modal, Divider } from 'antd';
import React, { PureComponent } from 'react';
import ApprovalForm from './ApprovalForm';
import TransactionForm from './TransactionForm';
import CreditForm from './CreditForm';
import _ from 'lodash';
import AccountOpeningApproval from './AccountOpeningApproval';

class Operation extends PureComponent {
  public state = {
    visible: false,
    diagramVisible: false,
    flowDiagram: '',
    type: null,
  };
  public switchModal = () => {
    this.setState({
      visible: true,
      type: _.get(this.props, 'formData.processName'),
    });
  };

  public handleFormChange = () => {
    this.setState({
      visible: false,
    });
    this.props.fetchTable();
  };

  public switchDiagramModal = async () => {
    const image = await queryProcessDiagram(this.props.formData);

    this.setState({
      flowDiagram: image,
      diagramVisible: true,
    });
  };

  public hideDiagramModal = () => {
    this.setState({
      diagramVisible: false,
    });
  };

  public handleContent = () => {
    if (_.includes(this.state.type, '交易录入')) {
      return <TransactionForm {...this.props} handleFormChange={this.handleFormChange} />;
    }
    if (_.includes(this.state.type, '授信额度变更')) {
      return <CreditForm {...this.props} handleFormChange={this.handleFormChange} />;
    }
    if (_.includes(this.state.type, '财务出入金')) {
      return <ApprovalForm {...this.props} handleFormChange={this.handleFormChange} />;
    }
    if (_.includes(this.state.type, '开户')) {
      return <AccountOpeningApproval {...this.props} handleFormChange={this.handleFormChange} />;
    }
    return null;
  };

  public render() {
    return (
      <>
        <Row>
          <a onClick={this.switchDiagramModal}>查看流程图</a>
          <Divider type="vertical" />
          <a onClick={this.switchModal}>查看审批单</a>
          <Modal
            title="流程图"
            visible={this.state.diagramVisible}
            width={700}
            onCancel={this.hideDiagramModal}
            footer={false}
          >
            <img src={this.state.flowDiagram} style={{ width: 650 }} alt="图片加载出错，请重试" />
          </Modal>
          <Modal
            title="审批单"
            visible={this.state.visible}
            width={900}
            onCancel={this.handleFormChange}
            footer={false}
          >
            {this.handleContent()}
          </Modal>
        </Row>
      </>
    );
  }
}

export default Operation;
