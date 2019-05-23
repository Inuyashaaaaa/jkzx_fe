import ModalButton from '@/containers/ModalButton';
import { DOWN_LOAD_SETTLEMENT_URL, emlSendSettleReport } from '@/services/document';
import { Alert, Button, Col, message, Row } from 'antd';
import moment from 'moment';
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
    this.props.onFetch();
  };

  public onConfirm = async () => {
    const { error } = await emlSendSettleReport({
      tos: this.props.data.tradeEmail,
      tradeId: this.props.data.tradeId,
      positionId: this.props.data.positionId,
      partyName: this.props.data.partyName,
    });
    if (error) {
      message.error('发送失败');
      return;
    }
    message.success('发送成功');
    return;
  };

  public render() {
    const { data } = this.props;
    return (
      <>
        <ModalButton
          modalProps={{
            title: '生成结算通知书',
            width: 700,
            footer: null,
            closable: true,
            visible: this.state.visible,
            onCancel: this.onCancel,
          }}
          onClick={this.onClick}
          size="small"
          type="primary"
          content={
            <>
              <Alert
                style={{ marginBottom: 40 }}
                message="结算通知书基于最新的模板即时生成，系统不会留存每次生成的结果。"
                type="info"
                showIcon={true}
              />
              <Row type="flex" justify="end" align="middle" gutter={8}>
                <Col>
                  <Button type="default">
                    <a
                      href={encodeURI(
                        `${DOWN_LOAD_SETTLEMENT_URL}tradeId=${this.props.data.tradeId}&positionId=${
                          this.props.data.positionId
                        }&partyName=${this.props.data.partyName}`
                      )}
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
              <Row type="flex" justify="end" align="middle" gutter={8}>
                <p style={{ lineHeight: '40px' }}>
                  {data.docProcessStatus === 'UN_PROCESSED'
                    ? `${data.partyName}未处理过结算通知书`
                    : data.docProcessStatus === 'DOWNLOADED'
                    ? `${data.partyName} 于 ${moment(data.updateAt).format(
                        'YYYY-MM-DD HH:mm'
                      )}下载过结算通知书`
                    : `${data.partyName} 于 ${moment(data.updateAt).format(
                        'YYYY-MM-DD HH:mm'
                      )}发送过结算通知书`}
                </p>
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
