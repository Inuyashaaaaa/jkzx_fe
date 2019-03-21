import Section from '@/components/Section';
import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import { IColumnDef } from '@/lib/components/_Table2';
import { refPartyGetByLegalName } from '@/services/reference-data-service';
import { emlSendValuationReport, rptValuationReportList } from '@/services/report-service';
import { message, Row } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import ValuationCellRenderer from './ValuationCellRenderer';

const VALUATION_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'legalName',
    // checkboxSelection: true,
  },
  {
    headerName: 'SAC协议编号',
    field: 'masterAgreementId',
  },
  {
    headerName: '估值日',
    field: 'valuationDate',
    input: {
      type: 'date',
    },
  },
  {
    headerName: '估值',
    field: 'price',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '交易邮箱',
    field: 'tradeEmail',
    input: {
      type: 'email',
    },
  },
  // {
  //   headerName: '操作',
  //   field: 'actions',
  //   cellRenderer: 'ValuationCellRenderer',
  // },
  {
    headerName: '操作',
    render: params => {
      return <ValuationCellRenderer params={params} />;
    },
  },
];

export interface ValuationProps {
  selectedRows: any[];
}

class Valuation extends PureComponent<ValuationProps> {
  public $sourceTable: SourceTable = null;

  public state = {
    loading: false,
    dataSource: [],
    visible: false,
  };

  public componentDidMount = () => {
    this.setState({
      loading: true,
    });
    this.fetchTable();
  };

  public fetchTable = async () => {
    const legalNamesList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName']).legalName;
    });
    const dataSource = (await Promise.all(
      legalNamesList.map(item => {
        return refPartyGetByLegalName({
          legalName: item,
        });
      })
    )).map(item => {
      return item.data;
    });

    const { error, data } = await rptValuationReportList({
      legalNames: legalNamesList,
    });
    if (error) return;
    const clientData = data.map((item, key) => {
      const index = _.findIndex(dataSource, { legalName: item.legalName });
      return {
        ..._.omit(dataSource[index], 'uuid'),
        ...item,
      };
    });
    this.setState({
      loading: false,
      dataSource: clientData,
    });
  };

  public onSearchFormChange = event => {};

  public onResetButtonClick = () => {
    this.fetchTable();
  };

  public onConfirm = async () => {
    this.setState({
      visible: false,
      loading: true,
    });
    const reportData = this.state.dataSource.map(item => {
      return _.mapKeys(_.pick(item, ['uuid', 'tradeEmail']), (value, key) => {
        if (key === 'tradeEmail') {
          return 'tos';
        }
        if (key === 'uuid') {
          return 'valuationReportId';
        }
      });
    });
    const { error, data } = await emlSendValuationReport({
      params: reportData,
    });
    this.setState({
      loading: false,
    });
    if (error) {
      message.error('批量发送失败');
      return;
    }
    message.success('批量发送成功');
    return;
  };

  public onClickBatch = async () => {
    this.setState({
      visible: true,
    });
  };

  public onCancelBatch = () => {
    this.setState({
      visible: false,
    });
  };

  public render() {
    return (
      <>
        <Section>持仓估值管理</Section>
        <SourceTable
          ref={node => (this.$sourceTable = node)}
          rowKey="uuid"
          loading={this.state.loading}
          columnDefs={VALUATION_COL_DEFS}
          dataSource={this.state.dataSource}
          // frameworkComponents={{
          //   ValuationCellRenderer,
          // }}
          header={
            <Row style={{ marginBottom: VERTICAL_GUTTER }}>
              <ModalButton
                key="sends"
                type="primary"
                visible={this.state.visible}
                onClick={this.onClickBatch}
                content={<div>是否确认向所有已选中的客户邮箱发送估值报告?</div>}
                onConfirm={this.onConfirm}
                onCancel={this.onCancelBatch}
              >
                批量发送报告
              </ModalButton>
            </Row>
          }
        />
      </>
    );
  }
}

export default Valuation;
