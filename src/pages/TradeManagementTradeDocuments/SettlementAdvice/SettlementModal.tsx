/*eslint-disable */
import { Alert, Button, Col, message, Row, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DOWN_LOAD_SETTLEMENT_URL, emlSendSettleReport } from '@/services/document';
import ModalButton from '@/containers/ModalButton';
import DownloadButton from '@/containers/DownloadButton';

class TradeModal extends PureComponent {
  public state = {
    visible: false,
  };

  public onClick = () => {
    this.setState({
      visible: true,
      loading: false,
    });
  };

  public onCancel = async () => {
    this.setState({
      visible: false,
    });
    this.props.onFetch();
  };

  public onConfirm = async () => {
    this.setState({ loading: true });
    const { error } = await emlSendSettleReport({
      tos: this.props.data.tradeEmail,
      tradeId: this.props.data.tradeId,
      positionId: this.props.data.positionId,
      partyName: this.props.data.partyName,
    });
    this.setState({ loading: false });
    if (error) {
      message.error('发送失败');
      return;
    }
    message.success('发送成功');
  };

  public render() {
    const {
      data,
      currentUser: { username },
    } = this.props;

    return (
      <>
        <a onClick={this.onClick}>生成结算通知书</a>
        <Modal
          title="生成结算通知书"
          visible={this.state.visible}
          footer={false}
          onCancel={this.onCancel}
        >
          <Alert
            style={{ marginBottom: 40 }}
            message="结算通知书基于最新的模板即时生成，系统不会留存每次生成的结果。"
            type="info"
            showIcon
          />
          <Row type="flex" justify="end" align="middle" gutter={8}>
            <Col>
              <DownloadButton
                content="下载"
                url={DOWN_LOAD_SETTLEMENT_URL}
                name={`${this.props.data.tradeId}结算通知书.doc`}
                options={`tradeId=${this.props.data.tradeId}&positionId=${this.props.data.positionId}&partyName=${this.props.data.partyName}`}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={this.onConfirm} loading={this.state.loading}>
                发送至客户邮箱
              </Button>
            </Col>
          </Row>
          <Row type="flex" justify="end" align="middle" gutter={8}>
            <p style={{ lineHeight: '40px' }}>
              {data.docProcessStatus === 'UN_PROCESSED'
                ? `${username} 未处理过结算通知书`
                : data.docProcessStatus === 'DOWNLOADED'
                ? `${username} 于 ${moment(data.updateAt).format(
                    'YYYY-MM-DD HH:mm',
                  )}下载过结算通知书`
                : `${username} 于 ${moment(data.updateAt).format(
                    'YYYY-MM-DD HH:mm',
                  )}发送过结算通知书`}
            </p>
          </Row>
        </Modal>
      </>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(TradeModal);
