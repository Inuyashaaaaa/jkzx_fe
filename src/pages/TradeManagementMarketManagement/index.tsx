import SourceTable from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { mktQuotesListPaged } from '@/services/market-data-service';
import { Button } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { searchFormControls, TABLE_COLUMN_DEFS } from './constants';

class TradeManagementMarketManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public clean = null;

  public state = {
    columnDefs: [],
    dataSource: [],
    lastUpdateTime: '',
    searchFormData: {},
  };

  public componentDidMount = () => {
    this.clean = setInterval(() => {
      this.setState({
        lastUpdateTime: moment().format('HH:mm:ss'),
      });
      this.$sourceTable.searchSilent();
    }, 1000 * 30);
  };

  public componentWillUnmount = () => {
    if (this.clean) {
      clearInterval(this.clean);
    }
  };

  public fetchTable = event => {
    this.setState({
      lastUpdateTime: moment().format('HH:mm:ss'),
    });
    return mktQuotesListPaged({
      page: event.pagination.current - 1,
      pageSize: event.pagination.pageSize,
      ...event.searchFormData,
    }).then(result => {
      if (result.error) return undefined;

      return {
        tableDataSource: result.data.page,
        pagination: {
          ...event.pagination,
          total: result.data.totalCount,
        },
      };
    });
  };

  public handleSubjectBtnClick = () => {
    router.push('/trade-management/subject-store');
  };

  public onSearchFormChange = event => {
    this.setState(
      {
        searchFormData: event.formData,
      },
      () => {
        this.$sourceTable.search();
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          ref={node => (this.$sourceTable = node)}
          rowKey="instrumentId"
          searchable={true}
          searchButtonProps={{
            icon: 'reload',
          }}
          searchText={`刷新 ${this.state.lastUpdateTime}`}
          searchFormControls={searchFormControls}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          tableColumnDefs={TABLE_COLUMN_DEFS}
          paginationProps={{
            backend: true,
          }}
          createButton={
            <Button type="primary" onClick={this.handleSubjectBtnClick}>
              标的物管理
            </Button>
          }
          onSearch={this.fetchTable}
          tableProps={{
            unionId: 'TradeManagementMarketManagement',
            defaultColDef: {
              cellRenderer: 'HeatmapCellRenderer',
              enableCellChangeFlash: false,
              width: 130,
            },
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementMarketManagement;
