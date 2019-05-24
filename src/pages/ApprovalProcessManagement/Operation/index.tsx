import ModalButton from '@/containers/ModalButton';
import { queryProcessDiagram } from '@/services/approval';
import { Col, Row, Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import ApprovalForm from './ApprovalForm';
import TransactionForm from './TransactionForm';
import CreditForm from './CreditForm';
import _ from 'lodash';
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
    if (this.state.type === '交易录入') {
      return <TransactionForm {...this.props} handleFormChange={this.handleFormChange} />;
    }
    if (this.state.type === '授信额度变更') {
      return <CreditForm {...this.props} handleFormChange={this.handleFormChange} />;
    }
    return <ApprovalForm {...this.props} handleFormChange={this.handleFormChange} />;
  };

  public render() {
    return (
      <>
        <Row type="flex" justify="start">
          <Col>
            <a onClick={this.switchDiagramModal} style={{ marginRight: 10 }}>
              查看流程图
            </a>
            <Modal
              title="编辑银行账户"
              visible={this.state.diagramVisible}
              width={700}
              onCancel={this.hideDiagramModal}
              footer={false}
            >
              <img src={this.state.flowDiagram} style={{ width: 650 }} alt="图片加载出错，请重试" />
            </Modal>
          </Col>
          <Col>
            <a onClick={this.switchModal} style={{ marginRight: 10 }}>
              查看审批单
            </a>
            <Modal
              title="编辑银行账户"
              visible={this.state.visible}
              width={900}
              onCancel={this.handleFormChange}
              footer={false}
            >
              {this.handleContent()}
            </Modal>
          </Col>
        </Row>
      </>
    );
  }
}

export default Operation;
