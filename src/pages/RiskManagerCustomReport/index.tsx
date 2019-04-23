import SourceTable from '@/design/components/SourceTable';
import { unionId } from '@/design/utils/unionId';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { rptIntradayReportNamesList, rptIntradayReportPaged } from '@/services/report-service';
import { socketHOC } from '@/tools/socketHOC';
import { ISourceTable } from '@/types';
import _ from 'lodash';
import React, { PureComponent } from 'react';

class RiskManagerCustomReport extends PureComponent implements ISourceTable {
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
    tableColumnDefs: [],
    searchFormData: {},
  };

  public reportName: string;

  public fetch = async (paramsPagination?) => {
    this.setState({
      loading: true,
    });

    const { error, data } = await rptIntradayReportPaged({
      reportName: this.state.searchFormData.reportName,
      page: (paramsPagination || this.state.pagination).current - 1,
      pageSize: (paramsPagination || this.state.pagination).pageSize,
    });

    this.setState({
      loading: false,
    });

    if (error) return;

    const tableDataSource = data.page.map(item => {
      return {
        ..._.get(item, 'reportData', {}),
        rowId: unionId(),
      };
    });

    const tableColumnDefs = Object.keys(_.get(tableDataSource, '[0]', {})).map(item => ({
      headerName: item,
      field: item,
      width: 200,
    }));

    this.setState({
      tableColumnDefs,
      tableDataSource,
      pagination: {
        ...this.state.pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
    });
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

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public onSearchButtonClick = () => {
    this.fetch();
  };

  public render() {
    return (
      <PageHeaderWrapper title="定制化报告">
        <SourceTable
          autoSizeColumnsToFit={false}
          searchable={true}
          searchFormControls={[
            {
              field: 'reportName',
              control: {
                label: '选择报告名称',
              },
              input: {
                type: 'select',
                placeholder: '请输入内容搜索',
                showSearch: true,
                options: async (value: string) => {
                  const { data, error } = await rptIntradayReportNamesList();
                  if (error) return [];
                  return data.map(item => ({
                    label: item,
                    value: item,
                  }));
                },
              },
              decorator: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]}
          onSearchButtonClick={this.onSearchButtonClick}
          resetable={false}
          onSearchFormChange={this.onSearchFormChange}
          searchFormData={this.state.searchFormData}
          loading={this.state.loading}
          ref={node => (this.$sourceTable = node)}
          paginationProps={{
            backend: true,
          }}
          dataSource={this.state.tableDataSource}
          pagination={this.state.pagination}
          onPaginationChange={this.onPaginationChange}
          onPaginationShowSizeChange={this.onPaginationChange}
          rowKey={'rowId'}
          columnDefs={this.state.tableColumnDefs}
          unionId={'RiskManagerCustomReport'}
          defaultColDef={{
            cellRenderer: 'HeatmapCellRenderer',
            enableCellChangeFlash: false,
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default socketHOC(RiskManagerCustomReport);
