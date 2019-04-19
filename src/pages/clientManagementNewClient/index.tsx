import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions } from '@/lib/utils';
import {
  clientAccountDel,
  clientAccountSearch,
  createRefParty,
  refSalesGetByLegalName,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { queryCompleteCompanys } from '@/services/sales';
import { notification } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { ADDRESS_CASCADER, SEARCH_FORM_CONTROLS, TABLE_COLUMN_DEFS } from './constants';

class ClientManagementNewClient extends PureComponent {
  public state = {
    dataSource: [],
    searchFormData: {},
    loading: false,
    branchSalesList: [],
    modalVisible: false,
    confirmLoading: false,
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
      ...datalist,
      ...(searchFormData.legalName ? { legalName: searchFormData.legalName } : {}),
      ...(searchFormData.masterAgreementId
        ? { masterAgreementId: searchFormData.masterAgreementId }
        : {}),
    });
    this.setState({ loading: false });

    if (error) return;

    this.setState({
      dataSource: data,
    });
  };

  public handleRemove = index => {
    this.setState(
      produce((state: any) => {
        state.dataSource.splice(index, 1);
      }),
      () => {
        notification.success({
          message: '删除成功',
        });
      }
    );
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
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

  public switchModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  public switchConfirmLoading = () => {
    this.setState({
      confirmLoading: !this.state.confirmLoading,
    });
  };

  public onCreate = () => {
    // if (!this.$proForm) return;

    // this.$proForm.validateFieldsAndScroll(async (error, values) => {
    //   if (error) return;

    //   const formatValues = _.mapValues(values, (val, key) => {
    //     if (isMoment(val)) {
    //       return val.format('YYYY-MM-DD');
    //     }
    //     return val;
    //   });
    //   const { [ADDRESS_CASCADER]: cascader, ...rest } = formatValues;

    //   const [subsidiaryName, branchName, salesName] = cascader;

    //   const dataSourceProd = _.mapValues(rest, (val, key) => {
    //     if (DOC_FIELDS.indexOf(key) !== -1) {
    //       return _.get(val, '[0].response.result.uuid', undefined);
    //     }
    //     return val;
    //   });

    //   if (!salesName) {
    //     return message.warn('销售不存在');
    //   }

    //   const distValues = {
    //     ...dataSourceProd,
    //     subsidiaryName,
    //     branchName,
    //     salesName,
    //     clientType: PRODUCT,
    //   };

    //   this.switchConfirmLoading();
    //   const { error: _error } = await createRefParty(distValues);
    //   this.switchConfirmLoading();
    //   if (_error) return;

    //   this.setState(
    //     {
    //       dataSourceInst: {},
    //       dataSourceProd: {},
    //       modalVisible: false,
    //     },
    //     () => {
    //       message.success('创建成功');
    //       this.fetchTable();
    //     }
    //   );
    // });
    console.log('123123');
  };

  public render() {
    return (
      <>
        <PageHeaderWrapper>
          <SourceTable
            columnDefs={TABLE_COLUMN_DEFS(this.handleRemove)}
            dataSource={this.state.dataSource}
            loading={this.state.loading}
            rowKey="accountId"
            autoSizeColumnsToFit={false}
            searchFormControls={SEARCH_FORM_CONTROLS(this.state.branchSalesList)}
            searchable={true}
            resetable={true}
            onResetButtonClick={this.onReset}
            searchFormData={this.state.searchFormData}
            onSearchFormChange={this.onSearchFormChange}
            onSearchButtonClick={this.fetchTable}
            header={
              <ModalButton
                key="create"
                type="primary"
                onClick={this.switchModal}
                modalProps={{
                  width: 1200,
                  visible: this.state.modalVisible,
                  onCancel: this.switchModal,
                  onOk: this.onCreate,
                  confirmLoading: this.state.confirmLoading,
                }}
                content={'F'}
                style={{ marginBottom: '20px' }}
              >
                新建交易对手
              </ModalButton>
            }
          />
        </PageHeaderWrapper>
      </>
    );
  }
}

export default ClientManagementNewClient;
