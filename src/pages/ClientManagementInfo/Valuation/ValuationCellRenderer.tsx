import ModalButton from '@/design/components/ModalButton';
import { rptValuationReportSend } from '@/services/report-service';
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

  public componentDidMount = () => {};

  public onClick = () => {
    this.rowData = this.props.node.data;
    this.setState({
      visible: true,
    });
  };

  public onConfirm = async () => {
    this.setState({
      visible: false,
    });
    const reportData = _.pick(this.rowData, ['legalName', 'valuationDate', 'tradeEmail']);
    const { error, data } = await rptValuationReportSend({
      valuationReports: [reportData],
    });
    if (error) {
      message.error('发送失败');
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
      <Row style={{ height: this.props.context.rowHeight }} type="flex" align="middle">
        <Col>
          <Button size="small">
            <a
              href={`/document-service/bct/download/valuationReport?valuationReportId=${
                this.props.node.data.uuid
              }`}
              download="template.t"
            >
              查看
            </a>
          </Button>
        </Col>
        {/* <ModalButton
          size="small"
          type="primary"
          content={
            <div>
              是否确认向&nbsp;&nbsp;{this.props.node.data.legalName}&nbsp;&nbsp;邮箱发送估值报告?
            </div>
          }
          visible={this.state.visible}
          onClick={this.onClick}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        >
          发送报告
        </ModalButton> */}
      </Row>
    );
  }
}
export default ValuationCellRenderer;
