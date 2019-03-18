import { PureStateComponent } from '@/lib/components/_Components';
import SourceTable from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { delay, mockData } from '@/lib/utils';
import {
  rptPnlReportNameList,
  rptPnlReportPagedByNameAndDate,
  rptPnlReportUpdate,
} from '@/services/report-service';
import { Divider, message } from 'antd';
import React from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
class ReportsPnlAttribution extends PureStateComponent {
  constructor(props) {
    super(props);
    this.state = {
      markets: [],
    };
  }

  public componentDidMount = async () => {
    const { error, data } = await rptPnlReportNameList();
    if (error) return;
    this.setState({
      markets: data.map(item => ({
        label: item,
        value: item,
      })),
    });
  };

  public fetchTable = async event => {
    const { error, data } = await rptPnlReportPagedByNameAndDate({
      page: event.pagination.current - 1,
      pageSize: event.pagination.pageSize,
      reportName: event.searchFormData.reportName,
      valuationDate: event.searchFormData.valuationDate.format('YYYY-MM-DD'),
    });

    if (error) return false;
    return {
      tableDataSource: data.page,
      pagination: {
        total: data.totalCount,
      },
    };
  };

  public onCellValueChanged = async event => {
    const { error, data } = await rptPnlReportUpdate({ pnlReport: event.data });
    if (error) {
      message.error('更新错误');
      return false;
    }
    message.success('更新成功');
    return true;
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          rowKey="uuid"
          searchFormControls={searchFormControls(this.state.markets).map(item => ({
            ...item,
            options: {
              rules: [
                {
                  required: true,
                },
              ],
            },
          }))}
          tableProps={{
            title: <p>每日盈亏归因</p>,
            autoSizeColumnsToFit: false,
            onCellValueChanged: this.onCellValueChanged,
            defaultColDef: {
              width: 130,
            },
          }}
          autoFetch={false}
          editable={false}
          tableColumnDefs={TABLE_COL_DEFS}
          searchable={true}
          resetable={false}
          onSearch={this.fetchTable}
          paginationProps={{
            backend: true,
          }}
        />

        <Divider />
        <SourceTable
          rowKey="id"
          onFetch={() =>
            delay(
              1000,
              mockData({
                标的物: ['M1809', 'M18010', 'SR809'],
                总盈亏: '@integer(100, 1000)',
                期权盈亏: '@integer(100, 1000)',
                标的物盈亏: '@integer(100, 1000)',
              })
            )
          }
          tableProps={{
            title: <p>历史盈亏</p>,
          }}
          tableColumnDefs={[
            {
              headerName: '标的物',
              field: '标的物',
            },
            {
              headerName: '当日盈亏',
              field: '当日盈亏',
            },
            {
              headerName: '当月盈亏',
              field: '当月盈亏',
            },
            {
              headerName: '当年盈亏',
              field: '当年盈亏',
            },
          ]}
        />

        <Divider />

        <SourceTable
          rowKey="id"
          onFetch={() =>
            delay(
              1000,
              mockData({
                标的物: ['M1809', 'M18010', 'SR809'],
                总盈亏: '@integer(100, 1000)',
                期权盈亏: '@integer(100, 1000)',
                标的物盈亏: '@integer(100, 1000)',
              })
            )
          }
          tableProps={{
            title: <p>奇异期权盈亏</p>,
          }}
          tableColumnDefs={[
            {
              headerName: '标的物',
              field: '标的物',
            },
            {
              headerName: '总盈亏',
              field: '总盈亏',
            },
            {
              headerName: '期权盈亏',
              field: '期权盈亏',
            },
            {
              headerName: '标的物盈亏',
              field: '标的物盈亏',
            },
          ]}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ReportsPnlAttribution;
