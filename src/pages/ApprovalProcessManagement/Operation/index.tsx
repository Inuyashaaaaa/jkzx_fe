import ModalButton from '@/design/components/ModalButton';
import { queryProcessDiagram } from '@/services/approval';
import { Col, Row, Button, Model } from 'antd';
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
            <ModalButton
              type="primary"
              size="small"
              onClick={this.switchDiagramModal}
              modalProps={{
                title: '流程图',
                visible: this.state.diagramVisible,
                footer: null,
                width: 720,
                onCancel: this.hideDiagramModal,
              }}
              content={
                <img
                  src={this.state.flowDiagram}
                  style={{ width: 650 }}
                  alt="图片加载出错，请重试"
                />
              }
            >
              查看流程图
            </ModalButton>
          </Col>
          <Col>
            <ModalButton
              type="primary"
              size="small"
              onClick={this.switchModal}
              modalProps={{
                title: '审批单',
                visible: this.state.visible,
                footer: null,
                width: 900,
                onCancel: this.handleFormChange,
              }}
              content={this.handleContent()}
            >
              查看审批单
            </ModalButton>
          </Col>
        </Row>
      </>
    );
  }
}

export default Operation;
