import SourceTable from '@/design/components/SourceTable';
import { trdTradeListByBook } from '@/services/general-service';
import { tradeDocSearch } from '@/services/trade-service';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { SEARCH_FORM_CONTROLS_TRADE, TRADE_COLUMN_DEFS } from './constants';
import { delay, mockData } from '@/lib/utils';

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
    bookIdList: [],
  };

  public componentDidMount = () => {
    this.onFetch();
    // delay(
    //   1000,
    //   mockData({
    //     tradeId: '555555',
    //     tradeEmail: 'zhangjiaan@tongyu.tech',
    //   })
    // ).then(result => {
    //   this.setState({
    //     dataSource: result,
    //   });
    // });
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
    const dataSource = data.page.map(item => {
      return {
        ...item,
        status:
          item.docProcessStatus === 'UN_PROCESSED'
            ? '未处理'
            : item.docProcessStatus === 'DOWNLOADED'
            ? `下载 于 ${moment(item.updateAt).format('YYYY-MM-DD HH:mm')}`
            : `发送 于 ${moment(item.updateAt).format('YYYY-MM-DD HH:mm')}`,
      };
    });
    this.setState({
      dataSource,
      pagination: {
        ...pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
    });
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

  public onSearchFormChange = async params => {
    if (Object.keys(params.changedValues)[0] === 'bookName' && params.changedValues.bookName) {
      const { error, data } = await trdTradeListByBook({
        bookName: params.changedValues.bookName,
      });
      if (error) return;
      this.setState({
        bookIdList: data,
        searchFormData: params.values,
      });
      return;
    }
    this.setState({
      bookIdList: [],
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
          rowKey="uuid"
          ref={node => (this.$sourceTable = node)}
          columnDefs={TRADE_COLUMN_DEFS(this.onFetch)}
          searchFormControls={SEARCH_FORM_CONTROLS_TRADE(this.state.bookIdList)}
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
