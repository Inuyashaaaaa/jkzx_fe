import ModalButton from '@/design/components/ModalButton';
import { queryProcessDiagram } from '@/services/approval';
import { Col, Row, Button, Model } from 'antd';
import React, { PureComponent } from 'react';
import ApprovalForm from './ApprovalForm';
import TransactionForm from './TransactionForm';
class Operation extends PureComponent {
  public state = {
    visible: false,
    diagramVisible: false,
    flowDiagram: '',
    transactionModel: false,
  };
  public switchModal = () => {
    if (this.props.formData.processName === '交易录入经办复合流程') {
      this.setState({
        transactionModel: true,
      });
    }
    this.setState({
      visible: true,
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

  public render() {
    console.log(this.props);
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
              content={
                this.state.transactionModel ? (
                  <TransactionForm {...this.props} handleFormChange={this.handleFormChange} />
                ) : (
                  <ApprovalForm {...this.props} handleFormChange={this.handleFormChange} />
                )
              }
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
