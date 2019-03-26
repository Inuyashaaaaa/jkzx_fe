import { BOOK_NAME_FIELD } from '@/constants/common';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  trdBookList,
  trdExpiringTradeList,
  trdTradeListByBook,
  trdTradeSearchPaged,
} from '@/services/general-service';
import { refSalesGetByLegalName } from '@/services/reference-data-service';
import produce from 'immer';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import CommonModel from './CommonModel';
import { ROW_KEY } from './constants';

class TradeManagementContractManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public curRowId: any;

  public state = {
    loading: false,
    modalVisiable: false,
    selectedRows: [],
    bookList: [],
    bookIdList: [],
    searchFormData: {},
    tableDataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    lifeLoading: false,
    lifeTableData: [],
    tradeTableData: [],
    tradeLoading: false,
    activeTabKey: 'contractManagement',
  };

  public componentDidMount = () => {
    trdBookList().then(rsp => {
      if (rsp.error) return;
      this.setState({
        bookList: rsp.data,
      });
    });
    this.onTradeTableSearch();
    this.onFetchTradeTableData();
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

  public onCheckContract = async event => {
    router.push({
      pathname: '/trade-management/book-edit',
      query: {
        // from: 'control',
        id: event.rowId,
      },
    });
  };

  public bindCheckContract = rowData => () => {
    this.onCheckContract({
      rowId: rowData[ROW_KEY],
    });
  };

  public onFetchTradeTableData = async () => {
    this.switchTradeLoading();
    const { error, data } = await trdExpiringTradeList();
    this.switchTradeLoading();

    if (error) return;

    if (_.isEmpty(data)) return;

    // @todo
    const commonCounterPartyName = data[0].positions[0].counterPartyName;

    this.setState(
      produce((state: any) => {
        state.tradeTableData = data.map(item => {
          return {
            ...item,
            commonCounterPartyName,
          };
        });
      })
    );
  };

  public switchTradeLoading = () => {
    this.setState(
      produce((state: any) => {
        state.tradeLoading = !state.tradeLoading;
      })
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
      });
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
      searchFormData: params.values,
    });
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
    });
    this.setState({ loading: false });

    if (error) return;
    if (_.isEmpty(data)) return;

    // @todo
    // const commonCounterPartyName = data.page[0] && data.page[0].positions[0].counterPartyName;

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
    this.setState(
      {
        pagination,
      },
      () => {
        this.onTradeTableSearch();
      }
    );
  };

  public onSearch = () => {
    this.onTradeTableSearch({ current: 1, pageSize: 10 });
  };

  public onTabChange = key => {
    this.setState({
      activeTabKey: key,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper
        title="合约管理"
        tabList={[
          { key: 'contractManagement', tab: '合约管理' },
          { key: 'open', tab: '当日开仓' },
          { key: 'unwind', tab: '当日平仓' },
          { key: 'expiration', tab: '当日到期' },
          { key: 'overlate', tab: '已过期' },
        ]}
        tabActionKey={this.state.activeTabKey}
        onTabChange={this.onTabChange}
      >
        {this.state.activeTabKey === 'contractManagement' && <CommonModel />}
        {this.state.activeTabKey === 'open' && <CommonModel status="OPEN" />}
        {this.state.activeTabKey === 'unwind' && <CommonModel status="UNWIND" />}
        {this.state.activeTabKey === 'expiration' && <CommonModel status="EXPIRATION_TODAY" />}
        {this.state.activeTabKey === 'overlate' && <CommonModel status="EXPIRATION" />}
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementContractManagement;
