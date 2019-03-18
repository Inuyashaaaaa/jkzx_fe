import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  rptRiskReportNameList,
  rptRiskReportPagedByNameAndDate,
  rptRiskReportUpdate,
} from '@/services/report-service';
import { message } from 'antd';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEFS } from './constants';
import CustomNoDataOverlay from './CustomNoDataOverlay';
import { searchFormControls } from './services';

class ReportsRisk extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    markets: [],
    dataSource: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    loading: false,
    info: true,
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = async () => {
    const { error, data } = await rptRiskReportNameList();
    if (error) return;
    this.setState({
      markets: data.map(item => ({
        label: item,
        value: item,
      })),
    });
  };

  public fetchTable = async event => {
    this.setState({
      loading: true,
    });
    const { error, data } = await rptRiskReportPagedByNameAndDate({
      page: this.state.pagination.current - 1,
      pageSize: this.state.pagination.pageSize,
      reportName: event.searchFormData.reportName,
      valuationDate: event.searchFormData.valuationDate.format('YYYY-MM-DD'),
    });
    if (error) return false;
    this.setState({
      loading: false,
    });
    if (!data.page.length) {
      this.setState({
        info: false,
        dataSource: data.page,
      });
      return;
    }
    message.success('查询成功');
    this.setState({
      dataSource: data.page,
      pagination: {
        ...this.state.pagination,
        total: data.totalCount,
      },
    });
    return;
  };

  public onCellValueChanged = async event => {
    const { error, data } = await rptRiskReportUpdate({ riskReport: event.data });
    if (error) return message.error('更新错误');
    message.success('更新成功');
    return true;
  };

  public onPaginationChange = ({ pagination }) => {
    this.setState({
      pagination,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          context={{
            description: this.state.info ? '暂无数据' : '查询日期内无报告',
          }}
          frameworkComponents={{
            CustomNoDataOverlay,
          }}
          rowKey="uuid"
          ref={node => (this.$sourceTable = node)}
          loading={this.state.loading}
          searchFormControls={searchFormControls(this.state.markets).map(item => ({
            ...item,
            decorator: {
              rules: [
                {
                  required: true,
                },
              ],
            },
          }))}
          searchable={true}
          onSearchButtonClick={this.fetchTable}
          editable={false}
          resetable={false}
          paginationProps={{
            backend: true,
          }}
          dataSource={this.state.dataSource}
          pagination={this.state.pagination}
          onPaginationChange={this.onPaginationChange}
          onPaginationShowSizeChange={this.onPaginationChange}
          columnDefs={TABLE_COL_DEFS}
          autoSizeColumnsToFit={false}
          onCellValueChanged={this.onCellValueChanged}
          defaultColDef={{ width: 130 }}
        />
      </PageHeaderWrapper>
    );
  }
}
export default ReportsRisk;
