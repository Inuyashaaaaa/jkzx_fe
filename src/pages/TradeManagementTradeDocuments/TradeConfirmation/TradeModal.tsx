import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import { DOWN_LOAD_TRADE_URL, emlSendSupplementaryAgreementReport } from '@/services/document';
import { Alert, Button, Col, message, Row, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';

class TradeModal extends PureComponent {
  public $form: Form = null;

  public state = {
    visible: false,
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
    const { error } = await emlSendSupplementaryAgreementReport({
      tos: this.props.data.tradeEmail,
      tradeId: this.props.data.tradeId,
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
        <a onClick={this.onClick}>生成交易确认书</a>
        <Modal
          title="生成交易确认书"
          visible={this.state.visible}
          footer={false}
          width={700}
          onCancel={this.onCancel}
        >
          <>
            <Alert
              style={{ marginBottom: 40 }}
              message="交易确认书基于最新的模板即时生成，系统不会留存每次生成的结果。"
              type="info"
              showIcon={true}
            />
            <Row type="flex" justify="end" align="middle" gutter={8}>
              <Col>
                <Button type="default">
                  <a
                    href={encodeURI(
                      `${DOWN_LOAD_TRADE_URL}tradeId=${this.props.data.tradeId}&partyName=${
                        this.props.data.partyName
                      }`
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
                  ? `${data.partyName}未处理过交易确认书`
                  : data.docProcessStatus === 'DOWNLOADED'
                  ? `${data.partyName} 于 ${moment(data.updateAt).format(
                      'YYYY-MM-DD HH:mm'
                    )}下载过交易确认书`
                  : `${data.partyName} 于 ${moment(data.updateAt).format(
                      'YYYY-MM-DD HH:mm'
                    )}发送过交易确认书`}
              </p>
            </Row>
          </>
        </Modal>
      </>
    );
  }
}

export default TradeModal;
