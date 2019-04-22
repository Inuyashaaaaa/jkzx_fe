import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions } from '@/lib/utils';
import {
  clientAccountSearch,
  refSalesGetByLegalName,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { queryCompleteCompanys } from '@/services/sales';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { ADDRESS_CASCADER, SEARCH_FORM_CONTROLS, TABLE_COL_DEF } from './constants';

class ClientManagementFundStatistics extends PureComponent {
  public state = {
    searchFormData: {
      normalStatus: 'all',
    },
    loading: false,
    branchSalesList: [],
    tableDataSource: [],
  };

  public componentDidMount = async () => {
    this.fetchBranchSalesList();
    this.fetchSimilarLegalName();
    this.fetchTable();
  };

  public fetchSimilarLegalName = async () => {
    const { error, data } = await refSimilarLegalNameList({
      similarLegalName: '',
    });
    if (error) return;
    const markets = data.map(item => ({
      label: item,
      value: item,
    }));
    this.setState({ markets });
  };

  public fetchBranchSalesList = async () => {
    const { error, data } = await queryCompleteCompanys();
    if (error) return false;
    const newData = arr2treeOptions(
      data,
      ['subsidiary', 'branch', 'salesName'],
      ['subsidiary', 'branch', 'salesName']
    );
    const branchSalesList = newData.map(subsidiaryName => {
      return {
        value: subsidiaryName.value,
        label: subsidiaryName.label,
        children: subsidiaryName.children.map(branchName => {
          return {
            value: branchName.value,
            label: branchName.label,
            children: branchName.children.map(salesName => {
              return {
                value: salesName.value,
                label: salesName.label,
              };
            }),
          };
        }),
      };
    });
    this.setState({ branchSalesList });
    return true;
  };

  public fetchTable = async () => {
    const { searchFormData } = this.state;

    let datalist = {};
    if (searchFormData[ADDRESS_CASCADER]) {
      const [subsidiaryName, branchName, salesName] = searchFormData[ADDRESS_CASCADER];
      datalist = { subsidiaryName, branchName, salesName };
    }

    this.setState({ loading: true });
    const { error, data } = await clientAccountSearch({
      ..._.omit(this.state.searchFormData, ['normalStatus']),
      ...(this.state.searchFormData.normalStatus && this.state.searchFormData.normalStatus === 'all'
        ? null
        : { normalStatus: this.state.searchFormData.normalStatus }),
    });
    this.setState({ loading: false });

    if (error) return;

    this.setState({
      tableDataSource: data,
    });
  };

  public onSearchFormChange = async params => {
    let refSalesGetByLegalNameRsp;
    if (params.changedValues.legalName) {
      refSalesGetByLegalNameRsp = await refSalesGetByLegalName({
        legalName: params.changedValues.legalName,
      });
      if (refSalesGetByLegalNameRsp.error) return;
      this.setState({
        searchFormData: {
          ...params.values,
          [ADDRESS_CASCADER]: _.values(
            _.pick(refSalesGetByLegalNameRsp.data, ['subsidiary', 'branch', 'salesName'])
          ),
        },
      });
      return;
    }
    this.setState({
      searchFormData: params.values,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          rowKey="accountId"
          loading={this.state.loading}
          columnDefs={TABLE_COL_DEF}
          dataSource={this.state.tableDataSource}
          autoSizeColumnsToFit={false}
          searchable={true}
          resetable={true}
          onResetButtonClick={this.onReset}
          searchFormControls={SEARCH_FORM_CONTROLS(this.state.branchSalesList)}
          searchFormData={this.state.searchFormData}
          onSearchButtonClick={this.fetchTable}
          onSearchFormChange={this.onSearchFormChange}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementFundStatistics;
