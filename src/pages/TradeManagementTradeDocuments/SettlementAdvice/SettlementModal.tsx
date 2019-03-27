import ModalButton from '@/design/components/ModalButton';
import { DOWN_LOAD_SETTLEMENT_URL, DOWN_LOAD_TRADE_URL } from '@/services/document';
import { Button, Col, Row } from 'antd';
import React, { PureComponent } from 'react';

class TradeModal extends PureComponent {
  public state = {
    visible: false,
  };

  public handleChange = params => {
    this.setState({
      modalData: params.values,
    });
  };

  public onClick = () => {
    this.setState({
      visible: true,
    });
  };

  public onCancel = async () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    this.setState({
      visible: false,
    });
  };

  public render() {
    return (
      <>
        <ModalButton
          visible={this.state.visible}
          modalProps={{
            title: '生成结算通知书',
            width: 700,
            okText: '发送至客户邮箱',
            cancelText: '下载',
            footer: null,
          }}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          onClick={this.onClick}
          size="small"
          type="primary"
          content={
            <>
              <h3>结算通知书基于最新的模板即时生成，系统不会留存每次生成的结果。</h3>
              <Row type="flex" justify="end" align="middle" gutter={8}>
                <Col>
                  <Button type="default">
                    <a
                      href={`${DOWN_LOAD_SETTLEMENT_URL}tradeId=${
                        this.props.data.tradeId
                      }&positionId=${this.props.data.positionId}`}
                      download="template.t"
                    >
                      下载
                    </a>
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={this.onConfirm}>
                    发送至客户邮箱
                  </Button>
                </Col>
              </Row>
            </>
          }
        >
          生成结算通知书
        </ModalButton>
      </>
    );
  }
}

export default TradeModal;
