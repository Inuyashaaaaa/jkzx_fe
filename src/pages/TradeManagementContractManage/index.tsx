import Page from '@/containers/Page';
import { connect } from 'dva';
import produce from 'immer';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { ROW_KEY } from './constants';
import CommonModel from './containers/CommonModel';
import TabHeaderWrapper from './TabHeaderWrapper';

class TradeManagementContractManage extends PureComponent<any> {
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
    tradeLoading: false,
  };

  constructor(props) {
    super(props);
    const { preRouting, dispatch } = props;
    if (preRouting && preRouting.pathname !== '/trade-management/book-edit') {
      dispatch({
        type: 'tradeManagementContractManage/initKey',
        payload: 'contractManagement',
      });
    }
  }

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

  public switchTradeLoading = () => {
    this.setState(
      produce((state: any) => {
        state.tradeLoading = !state.tradeLoading;
      })
    );
  };

  public render() {
    const { activeTabKey } = this.props.tradeManagementContractManage;
    return (
      <Page title="合约管理" footer={<TabHeaderWrapper />}>
        {activeTabKey === 'contractManagement' && <CommonModel name="contractManagement" />}
        {activeTabKey === 'open' && <CommonModel status="OPEN_TODAY" name="open" />}
        {activeTabKey === 'unwind' && <CommonModel status="UNWIND_TODAY" name="unwind" />}
        {activeTabKey === 'expiration' && (
          <CommonModel status="EXPIRATION_TODAY" name="expiration" />
        )}
        {activeTabKey === 'overlate' && <CommonModel status="EXPIRATION" name="overlate" />}
      </Page>
    );
  }
}

export default connect(state => {
  return {
    tradeManagementContractManage: state.tradeManagementContractManage,
    preRouting: state.preRouting.location,
  };
})(TradeManagementContractManage);
