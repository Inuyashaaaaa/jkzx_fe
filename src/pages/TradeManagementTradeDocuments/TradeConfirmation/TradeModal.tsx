/*eslint-disable */
import { Alert, Button, Col, message, Row, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  DOWN_LOAD_TRADE_URL,
  DOWN_LOAD_TRADE_URL_URL,
  emlSendSupplementaryAgreementReport,
} from '@/services/document';
import Form from '@/containers/Form';
import DownloadButton from '@/containers/DownloadButton';

class TradeModal extends PureComponent {
  public $form: Form = null;

  public state = {
    modalData: {
      marketDisruption:
        '到期日因标的资产、构成标的资产的任一股票或股票指数停牌而展期的，乙方应按年化利率6%于到期日向甲方支付资金成本，计算公式如下：资金成本=名义本金额x[0.00%]x(T/365)，其中T为自原定到期日(不含)起至实际到期日(含)期间的日历日天数。',
      tradeOption:
        '自期初观察日(含)至期末观察日(含)期间，交易所对标的资产、构成标的资产的任一股票或股票指数有价格涨跌幅限制的，若其连续[3]个交易日收盘价格达到交易所规定的当日涨跌幅限制时，甲方有权提前终止期权交易。',
    },
    visible: false,
    loading: false,
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
    this.setState({ loading: true });
    const { error } = await emlSendSupplementaryAgreementReport({
      tos: this.props.data.tradeEmail,
      tradeId: this.props.data.tradeId,
      marketInterruptionMessage: this.state.modalData.marketDisruption,
      earlyTerminationMessage: this.state.modalData.tradeOption,
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
        <a onClick={this.onClick}>生成交易确认书</a>
        <Modal
          title="生成交易确认书"
          visible={this.state.visible}
          footer={false}
          width={800}
          onCancel={this.onCancel}
        >
          <>
            <Alert
              style={{ marginBottom: 40 }}
              message="交易确认书基于最新的模板即时生成，系统不会留存每次生成的结果。"
              description="请在下载或发送前，确认以下自定义内容。"
              type="info"
              showIcon
            />
            <Form
              wrappedComponentRef={element => {
                if (element) {
                  this.$form = element.props.form;
                }
              }}
              controls={[
                {
                  field: 'marketDisruption',
                  control: {
                    label: '市场中断事件的处理',
                  },
                  input: {
                    type: 'textarea',
                    autosize: { minRows: 6, maxRows: 6 },
                    maxLength: 500,
                    showMaxLength: true,
                    showResetButton: true,
                  },
                },
                {
                  field: 'tradeOption',
                  control: {
                    label: '提前终止期权交易的情形',
                  },
                  input: {
                    type: 'textarea',
                    autosize: { minRows: 6, maxRows: 6 },
                    maxLength: 500,
                    showMaxLength: true,
                    showResetButton: true,
                  },
                },
              ]}
              dataSource={this.state.modalData}
              onValueChange={this.handleChange}
              controlNumberOneRow={1}
              layout="vertical"
              footer={false}
            />
            <Row type="flex" justify="end" align="middle" gutter={8}>
              <Col>
                <DownloadButton
                  content="下载"
                  name={`${this.props.data.tradeId}交易确认书.doc`}
                  url={DOWN_LOAD_TRADE_URL}
                  options={`tradeId=${this.props.data.tradeId}&partyName=${this.props.data.partyName}&description7=${this.state.modalData.marketDisruption}&description8=${this.state.modalData.tradeOption}`}
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
                  ? `${username} 未处理过交易确认书`
                  : data.docProcessStatus === 'DOWNLOADED'
                  ? `${username} 于 ${moment(data.updateAt).format(
                      'YYYY-MM-DD HH:mm',
                    )}下载过交易确认书`
                  : `${username} 于 ${moment(data.updateAt).format(
                      'YYYY-MM-DD HH:mm',
                    )}发送过交易确认书`}
              </p>
            </Row>
          </>
        </Modal>
      </>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(TradeModal);
