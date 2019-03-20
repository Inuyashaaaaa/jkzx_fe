import ModalButton from '@/design/components/ModalButton';
import { DOWN_LOAD_VALUATION_URL } from '@/services/document';
import { emlSendValuationReport } from '@/services/report-service';
import { Button, Col, message, Row } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
class ValuationCellRenderer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public onClick = () => {
    this.rowData = this.props.params.data;
    this.setState({
      visible: true,
    });
  };

  public onConfirm = async () => {
    this.setState({
      visible: false,
    });
    message.loading('正在发送');
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
    if (error) {
      message.error('发送失败');
      return;
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
    return (
      <Row style={{ height: this.props.params.context.rowHeight }} type="flex" align="middle">
        <Col>
          <Button size="default">
            <a
              href={`${DOWN_LOAD_VALUATION_URL}${this.props.params.data.uuid}`}
              download="template.t"
            >
              查看
            </a>
          </Button>
        </Col>
        <ModalButton
          size="default"
          type="primary"
          content={
            <div>
              是否确认向&nbsp;&nbsp;{this.props.params.data.legalName}&nbsp;&nbsp;邮箱发送估值报告?
            </div>
          }
          visible={this.state.visible}
          onClick={this.onClick}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        >
          发送报告
        </ModalButton>
      </Row>
    );
  }
}
export default ValuationCellRenderer;
