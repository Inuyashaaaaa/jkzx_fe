import ModalButton from '@/containers/ModalButton';
import { DOWN_LOAD_VALUATION_URL } from '@/services/document';
import { emlSendValuationReport } from '@/services/report-service';
import { Modal, Col, message, Row } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
class ValuationCellRenderer extends PureComponent<{
  params: any;
  uploading: any;
  unUploading: any;
}> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public onClick = () => {
    this.rowData = this.props.params;
    this.setState({
      visible: true,
    });
  };

  public onConfirm = async () => {
    this.setState({
      visible: false,
    });
    this.props.uploading();
    const reportData = _.mapKeys(_.pick(this.rowData, ['uuid', 'tradeEmail']), (value, key) => {
      if (key === 'tradeEmail') {
        return 'tos';
      }
      if (key === 'uuid') {
        return 'valuationReportId';
      }
    });
    const { error, data } = await emlSendValuationReport({
      params: [reportData],
    });
    this.props.unUploading();
    if (error) {
      message.error('发送失败');
      return;
    }
    if (data.ERROR) {
      if (data.ERROR[0].error.includes('请先配置发件人邮箱')) {
        message.error('发送失败,请确认邮箱是否正确');
        return;
      } else if (data.ERROR[0].error.includes('UUID string')) {
        message.error('发送失败,文档不可用');
        return;
      } else {
        message.error('发送失败');
        return;
      }
    }
    message.success('发送成功');
    return;
  };

  public onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public render() {
    const { visible } = this.state;
    return (
      <Row type="flex" justify="start" align="bottom">
        <Col>
          <a
            style={{ marginRight: 10 }}
            href={`${DOWN_LOAD_VALUATION_URL}${this.props.params.uuid}`}
            download="template.t"
          >
            查看
          </a>
        </Col>
        <Col>
          <a onClick={this.onClick}>发送报告</a>
          <Modal
            title="生成交易确认书"
            visible={visible}
            width={600}
            onCancel={this.onCancel}
            onOk={this.onConfirm}
          >
            <div>
              是否确认向&nbsp;&nbsp;{this.props.params.legalName}
              &nbsp;&nbsp;邮箱发送估值报告?
            </div>
          </Modal>
        </Col>
      </Row>
    );
  }
}
export default ValuationCellRenderer;
