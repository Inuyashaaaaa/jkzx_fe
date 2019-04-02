import { BOOK_NAME_FIELD } from '@/constants/common';
import SourceTable from '@/design/components/SourceTable';
import { trdBookList, trdTradeListByBook, trdTradeSearchPaged } from '@/services/general-service';
import { refSalesGetByLegalName } from '@/services/reference-data-service';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { BOOKING_TABLE_COLUMN_DEFS, bookingSearchFormControls } from '../constants';

const ROW_KEY = 'tradeId';

class CommonModel extends PureComponent {
  public $sourceTable: SourceTable = null;

  public status: any;

  public state = {
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    tableDataSource: [],
    searchFormData: {},
    bookList: [],
    bookIdList: [],
  };

  public componentDidMount = () => {
    this.status = this.props.status;
    trdBookList().then(rsp => {
      if (rsp.error) return;
      this.setState({
        bookList: rsp.data,
      });
    });
    this.onTradeTableSearch();
  };

  public onSearch = () => {
    this.onTradeTableSearch({ current: 1, pageSize: 10 });
  };

  public onTradeTableSearch = async (paramsPagination?) => {
    const { searchFormData, pagination } = this.state;

    const formatValues = _.mapValues(searchFormData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });

    this.setState({ loading: true });
    const { error, data } = await trdTradeSearchPaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ...formatValues,
      ...(this.status ? { status: this.status } : null),
    });
    this.setState({ loading: false });

    if (error) return;
    if (_.isEmpty(data)) return;

    const tableDataSource = data.page.map(item => {
      return {
        ...item,
        commonCounterPartyName: item.positions[0].counterPartyName,
      };
    });

    this.setState({
      tableDataSource,
      pagination: {
        ...pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
    });
  };

  public onTablePaginationChange = ({ pagination }) => {
    console.log(pagination);
    this.setState(
      {
        pagination,
      },
      () => {
        this.onTradeTableSearch();
      }
    );
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.onTradeTableSearch({ current: 1, pageSize: 10 });
      }
    );
  };

  public onTradeTableSearchFormChange = async params => {
    if (
      Object.keys(params.changedValues)[0] === BOOK_NAME_FIELD &&
      params.changedValues[BOOK_NAME_FIELD]
    ) {
      const { error, data } = await trdTradeListByBook({
        bookName: params.changedValues[BOOK_NAME_FIELD],
      });
      if (error) return;
      this.setState({
        bookIdList: data,
        searchFormData: params.values,
      });
      return;
    }

    let refSalesGetByLegalNameRsp;
    if (params.changedValues.counterPartyCode) {
      refSalesGetByLegalNameRsp = await refSalesGetByLegalName({
        legalName: params.changedValues.counterPartyCode,
      });
      if (refSalesGetByLegalNameRsp.error) return;
      return this.setState({
        searchFormData: {
          ...params.values,
          salesName: refSalesGetByLegalNameRsp.data.salesName,
        },
      });
    }
    this.setState({
      bookIdList: [],
      searchFormData: params.values,
    });
  };

  public bindCheckContract = rowData => () => {
    this.onCheckContract({
      rowId: rowData[ROW_KEY],
    });
  };

  public onCheckContract = async event => {
    router.push({
      pathname: '/trade-management/book-edit',
      query: {
        // from: 'control',
        id: event.rowId,
      },
    });
  };

  public render() {
    return (
      <SourceTable
        searchable={true}
        resetable={true}
        context={this.onSearch}
        loading={this.state.loading}
        pagination={this.state.pagination}
        onPaginationChange={this.onTablePaginationChange}
        onPaginationShowSizeChange={this.onTablePaginationChange}
        rowKey={ROW_KEY}
        onSearchButtonClick={this.onSearch}
        dataSource={this.state.tableDataSource}
        ref={node => (this.$sourceTable = node)}
        onResetButtonClick={this.onReset}
        onSearchFormChange={this.onTradeTableSearchFormChange}
        searchFormData={this.state.searchFormData}
        autoSizeColumnsToFit={true}
        searchFormControls={bookingSearchFormControls(this.state.bookList, this.state.bookIdList)}
        columnDefs={BOOKING_TABLE_COLUMN_DEFS(this.bindCheckContract, this.onSearch)}
        paginationProps={{
          backend: true,
        }}
      />
    );
  }
}

export default CommonModel;
