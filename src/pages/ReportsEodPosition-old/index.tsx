import CustomNoDataOverlay from '@/containers/CustomNoDataOverlay';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptPositionReportPagedByNameAndDate, rptReportNameList } from '@/services/report-service';
import { message } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

class ReportsEodPosition extends PureComponent {
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
    searchFormData: {},
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = async () => {
    const { error, data } = await rptReportNameList({
      reportType: 'LIVE_POSITION_INFO',
    });
    if (error) return;
    this.setState(
      {
        markets: data.map(item => ({
          label: item,
          value: item,
        })),
      },
      () => {
        this.setState(
          {
            searchFormData: {
              ...(this.state.markets.length ? { reportName: this.state.markets[0].value } : null),
              valuationDate: moment().subtract(1, 'days'),
            },
          },
          () => {
            this.fetchTable();
          }
        );
      }
    );
  };

  public fetchTable = async () => {
    const { searchFormData, pagination } = this.state;
    if (!searchFormData.reportName || !searchFormData.valuationDate) {
      return;
    }
    this.setState({
      loading: true,
    });
    const { error, data } = await rptPositionReportPagedByNameAndDate({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      reportName: searchFormData.reportName,
      valuationDate: searchFormData.valuationDate.format('YYYY-MM-DD'),
    });
    if (error) return false;
    this.setState({
      loading: false,
    });
    if (!data.page.length) {
      this.setState({
        info: false,
        dataSource: data.page,
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
      dataSource: data.page,
      pagination: {
        ...this.state.pagination,
        total: data.totalCount,
      },
    });
    return;
  };

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
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
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
                name: '持仓明细',
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
export default ReportsEodPosition;
