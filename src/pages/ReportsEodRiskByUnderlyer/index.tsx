import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import SourceTable from '@/design/components/SourceTable';
import DownloadExcelButton from '@/lib/components/_DownloadExcelButton';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptReportNameList, rptRiskReportPagedByNameAndDate } from '@/services/report-service';
import { message } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

class ReportsEodRiskByUnderlyer extends PureComponent {
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
    searchFormData: {
      valuationDate: moment().subtract(1, 'days'),
    },
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = async () => {
    const { error, data } = await rptReportNameList({
      reportType: 'RISK',
    });
    if (error) return;
    this.setState({
      markets: data.map(item => ({
        label: item,
        value: item,
      })),
    });
  };

  public fetchTable = async () => {
    const { searchFormData, pagination } = this.state;
    if (!searchFormData.reportName || !searchFormData.valuationDate) {
      return;
    }
    this.setState({
      loading: true,
    });
    const { error, data } = await rptRiskReportPagedByNameAndDate({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      reportName: searchFormData.reportName,
      valuationDate: searchFormData.valuationDate.format('YYYY-MM-DD'),
    });
    if (error) return false;
    this.setState({
      loading: false,
    });
    const page = data.page.sort((a, b) => {
      return a.underlyerInstrumentId.localeCompare(b.underlyerInstrumentId);
    });

    if (!data.page.length) {
      this.setState({
        info: false,
        dataSource: page,
        pagination: {
          current: 1,
          pageSize: 20,
          total: 0,
        },
      });
      return;
    }
    message.success('查询成功');
    this.setState({
      dataSource: page,
      pagination: {
        ...this.state.pagination,
        total: data.totalCount,
      },
    });
    return;
  };

  // public onCellValueChanged = async event => {
  //   const { error, data } = await rptRiskReportUpdate({ riskReport: event.data });
  //   if (error) return message.error('更新错误');
  //   message.success('更新成功');
  //   return true;
  // };

  public onPaginationChange = ({ pagination }) => {
    this.setState(
      {
        pagination,
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public handleData = (dataSource, cols, headers) => {
    const data = [];
    data.push(headers);
    const length = data.length;
    dataSource.forEach((ds, index) => {
      const _data = [];
      Object.keys(ds).forEach(key => {
        const dsIndex = _.findIndex(cols, k => k === key);
        if (dsIndex >= 0) {
          _data[dsIndex] = ds[key];
        }
      });
      data.push(_data);
    });
    return data;
  };

  public render() {
    const _data = this.handleData(
      this.state.dataSource,
      TABLE_COL_DEFS.map(item => item.field),
      TABLE_COL_DEFS.map(item => item.headerName)
    );
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
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
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
          // onCellValueChanged={this.onCellValueChanged}
          defaultColDef={{ width: 130 }}
          header={
            <DownloadExcelButton
              style={{ margin: '10px 0' }}
              key="export"
              type="primary"
              data={{
                dataSource: _data,
                cols: TABLE_COL_DEFS.map(item => item.headerName),
                name: '汇总风险',
              }}
            >
              导出Excel
            </DownloadExcelButton>
          }
        />
      </PageHeaderWrapper>
    );
  }
}
export default ReportsEodRiskByUnderlyer;
