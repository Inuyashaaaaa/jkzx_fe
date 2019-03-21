import { VERTICAL_GUTTER } from '@/constants/global';
import ReloadGreekButton from '@/containers/ReloadGreekButton';
import SourceTable from '@/design/components/SourceTable';
import { unionId } from '@/design/utils/unionId';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  rptIntradayPnlReportPaged,
  rptIntradayRiskReportPaged,
  rptIntradayTradeExpiringReportPaged,
} from '@/services/report-service';
import { Row } from 'antd';
import React, { PureComponent } from 'react';
import { PAGE_TABLE_COL_DEFS } from './constants';

class RiskManagerIntradayDailyPnlByUnderlyerReport extends PureComponent {
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

  public fetchTable = async (paramsPagination?) => {
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
    this.fetchTable();
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
        this.fetchTable();
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper title="标的盈亏">
        <Row type="flex" justify="end" style={{ marginBottom: VERTICAL_GUTTER }}>
          <ReloadGreekButton fetchTable={this.fetchTable} id="real_time_dag" />
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
        />
      </PageHeaderWrapper>
    );
  }
}

export default RiskManagerIntradayDailyPnlByUnderlyerReport;
