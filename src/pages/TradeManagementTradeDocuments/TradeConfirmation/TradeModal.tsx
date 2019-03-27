import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import {
  DOWN_LOAD_SETTLEMENT_URL,
  DOWN_LOAD_TRADE_URL,
  emlSendSupplementaryAgreementReport,
} from '@/services/document';
import { Button, Col, message, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';

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
    this.props.onFetch({ current: 1, pageSize: 10 });
  };

  public onConfirm = async () => {
    const { error } = await emlSendSupplementaryAgreementReport({
      tos: this.props.data.tradeEmail,
      tradeId: this.props.data.tradeId,
      description7: this.state.modalData.marketDisruption,
      description8: this.state.modalData.tradeOption,
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
          visible={this.state.visible}
          modalProps={{
            title: '生成交易确认书',
            width: 700,
            footer: null,
            closable: true,
          }}
          onClick={this.onClick}
          onCancel={this.onCancel}
          size="small"
          type="primary"
          content={
            <>
              <h3>交易确认书使用最新模板和下方输入的内容即时生成，系统不会留存每次生成的文档。</h3>
              <h3>请在下载或发送前，确认以下自定义内容。</h3>
              <Form
                wrappedComponentRef={element => {
                  if (element) {
                    this.$form = element.props.form;
                  }
                  return;
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
                    },
                  },
                ]}
                dataSource={this.state.modalData}
                onValueChange={this.handleChange}
                controlNumberOneRow={1}
                footer={false}
              />
              <Row type="flex" justify="end" align="middle" gutter={8}>
                <Col>
                  <Button type="default">
                    <a
                      href={encodeURI(
                        `${DOWN_LOAD_TRADE_URL}tradeId=${this.props.data.tradeId}&description7=${
                          this.state.modalData.marketDisruption
                        }&description8=${this.state.modalData.tradeOption}`
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
          }
        >
          生成交易确认书
        </ModalButton>
      </>
    );
  }
}

export default TradeModal;
