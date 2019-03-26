import SourceTable from '@/design/components/SourceTable';
import { delay, mockData } from '@/lib/utils';
import { positionDocSearch } from '@/services/trade-service';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { SEARCH_FORM_CONTROLS_SETTLE, SETTLE_COLUMN_DEFS } from './constants';

class SettlementAdvice extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    loading: false,
    dataSource: [],
    searchFormData: {
      expirationDate: [moment().subtract(1, 'day'), moment()],
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
      startDate: this.state.searchFormData.expirationDate[0].format('YYYY-MM-DD'),
      endDate: this.state.searchFormData.expirationDate[1].format('YYYY-MM-DD'),
      ..._.omit(this.state.searchFormData, 'expirationDate'),
    };
    const pagination = this.state.pagination;
    this.setState({
      loading: true,
    });
    const { error, data } = await positionDocSearch({
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
          expirationDate: [moment().subtract(1, 'day'), moment()],
        },
      },
      () => {
        this.onFetch({ current: 1, pageSize: 10 });
      }
    );
  };

  public onSearchFormChange = params => {
    console.log(params.changedValues);
    this.setState({
      searchFormData: params.values,
    });
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

  public onSearch = () => {
    this.onFetch({ current: 1, pageSize: 10 });
  };

  public render() {
    return (
      <>
        <SourceTable
          rowKey="uuid"
          ref={node => (this.$sourceTable = node)}
          columnDefs={SETTLE_COLUMN_DEFS}
          searchFormControls={SEARCH_FORM_CONTROLS_SETTLE}
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

export default SettlementAdvice;
