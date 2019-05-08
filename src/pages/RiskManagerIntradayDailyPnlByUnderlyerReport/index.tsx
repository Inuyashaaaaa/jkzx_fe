import { VERTICAL_GUTTER } from '@/constants/global';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import ReloadGreekButton from '@/containers/ReloadGreekButton';
import SourceTable from '@/design/components/SourceTable';
import { unionId } from '@/design/utils/unionId';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptIntradayPnlReportPaged } from '@/services/report-service';
import { socketHOC } from '@/tools/socketHOC';
import { ISourceTable } from '@/types';
import { Row } from 'antd';
import React, { PureComponent } from 'react';
import { PAGE_TABLE_COL_DEFS } from './constants';

class RiskManagerIntradayDailyPnlByUnderlyerReport extends PureComponent implements ISourceTable {
  public $sourceTable: SourceTable = null;

  public state = {
    formData: {},
    tableDataSource: [],
    loading: false,
    canSave: false,
    saveLoading: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  public fetch = async (paramsPagination?) => {
    this.setState({
      loading: true,
    });
    const { error, data } = await rptIntradayPnlReportPaged({
      page: (paramsPagination || this.state.pagination).current - 1,
      pageSize: (paramsPagination || this.state.pagination).pageSize,
    });
    this.setState({
      loading: false,
    });

    if (error) return;

    this.setState({
      tableDataSource: data.page.map(item => {
        return {
          ...item,
          rowId: unionId(),
        };
      }),
      pagination: {
        ...this.state.pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
    });
  };

  public componentDidMount = () => {
    this.fetch();
  };

  public onPaginationChange = ({ pagination }) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          ...pagination,
        },
      },
      () => {
        this.fetch();
      }
    );
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
      this.state.tableDataSource,
      PAGE_TABLE_COL_DEFS.map(item => item.field),
      PAGE_TABLE_COL_DEFS.map(item => item.headerName)
    );
    return (
      <PageHeaderWrapper title="标的盈亏">
        <Row type="flex" justify="end" style={{ marginBottom: VERTICAL_GUTTER }}>
          <ReloadGreekButton fetchTable={this.fetch} id="real_time_pnl_dag" />
        </Row>
        <SourceTable
          loading={this.state.loading}
          ref={node => (this.$sourceTable = node)}
          paginationProps={{
            backend: true,
          }}
          searchable={false}
          dataSource={this.state.tableDataSource}
          pagination={this.state.pagination}
          onPaginationChange={this.onPaginationChange}
          onPaginationShowSizeChange={this.onPaginationChange}
          rowKey={'rowId'}
          columnDefs={PAGE_TABLE_COL_DEFS}
          unionId={'RiskManagerIntradayDailyPnlByUnderlyerReport'}
          defaultColDef={{
            cellRenderer: 'HeatmapCellRenderer',
            enableCellChangeFlash: false,
            width: 130,
          }}
          // getRowClass={params => {
          //   if (params.data.message !== 'success') {
          //     return styles.makeError;
          //   }
          // }}
          header={
            <DownloadExcelButton
              style={{ margin: '10px 0' }}
              key="export"
              type="primary"
              data={{
                dataSource: _data,
                cols: PAGE_TABLE_COL_DEFS.map(item => item.headerName),
                name: '标的盈亏',
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

export default socketHOC(RiskManagerIntradayDailyPnlByUnderlyerReport);
