import SourceTable from '@/design/components/SourceTable';
import { delay, mockData } from '@/lib/utils';
import { tradeDocSearch } from '@/services/trade-service';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { SEARCH_FORM_CONTROLS_TRADE, TRADE_COLUMN_DEFS } from './constants';

class TradeConfirmation extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    loading: false,
    dataSource: [],
    searchFormData: {
      tradeDate: [moment().subtract(1, 'day'), moment()],
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  public componentDidMount = () => {
    // this.onFetch();
    delay(
      1000,
      mockData({
        tradeId: 'OPT20190326',
      })
    ).then(result => {
      this.setState({
        dataSource: result,
      });
    });
  };

  public onFetch = async (paramsPagination?) => {
    const formValues = {
      startDate: this.state.searchFormData.tradeDate[0].format('YYYY-MM-DD'),
      endDate: this.state.searchFormData.tradeDate[1].format('YYYY-MM-DD'),
      ..._.omit(this.state.searchFormData, 'tradeDate'),
    };
    const pagination = this.state.pagination;
    this.setState({
      loading: true,
    });
    const { error, data } = await tradeDocSearch({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ...formValues,
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data.page,
      pagination: {
        ...pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
    });
    console.log(formValues);
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {
          tradeDate: [moment().subtract(1, 'day'), moment()],
        },
      },
      () => {
        this.onFetch({ current: 1, pageSize: 10 });
      }
    );
  };

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public onSearch = () => {
    this.onFetch({ current: 1, pageSize: 10 });
  };

  public onTablePaginationChange = ({ pagination }) => {
    this.setState(
      {
        pagination,
      },
      () => {
        this.onFetch();
      }
    );
  };

  public render() {
    return (
      <>
        <SourceTable
          rowKey="id"
          ref={node => (this.$sourceTable = node)}
          columnDefs={TRADE_COLUMN_DEFS}
          searchFormControls={SEARCH_FORM_CONTROLS_TRADE}
          searchable={true}
          resetable={true}
          loading={this.state.loading}
          onSearchButtonClick={this.onSearch}
          onResetButtonClick={this.onReset}
          dataSource={this.state.dataSource}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          paginationProps={{
            backend: true,
          }}
          pagination={this.state.pagination}
          onPaginationChange={this.onTablePaginationChange}
          onPaginationShowSizeChange={this.onTablePaginationChange}
        />
      </>
    );
  }
}

export default TradeConfirmation;
