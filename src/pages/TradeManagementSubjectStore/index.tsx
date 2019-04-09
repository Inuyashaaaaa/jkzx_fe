import ModalButton from '@/lib/components/_ModalButton2';
import SourceTable, { SourceTableState } from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  mktInstrumentCreate,
  mktInstrumentDelete,
  mktInstrumentsListPaged,
} from '@/services/market-data-service';
import { message } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { createFormControls, editFormControls, searchFormControls } from './services';
class TradeManagementMarketManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    createFormData: {},
    searchFormData: {},
  };

  public fetchTable = event => {
    return mktInstrumentsListPaged({
      page: event.pagination.current - 1,
      pageSize: event.pagination.pageSize,
      ...event.searchFormData,
    }).then(result => {
      if (result.error) return undefined;

      return {
        tableDataSource: result.data.page,
        pagination: {
          ...event.pagination,
          total: result.data.totalCount,
        },
      };
    });
  };

  public onRowEdit = event => {
    return {
      formControls: editFormControls,
      formData: event.rowData,
    };
  };

  public onRemove = async event => {
    const { error } = await mktInstrumentDelete({
      instrumentId: event.rowId,
    });
    return !error;
  };

  public filterFormData = (formData, changed) => {
    if (Object.keys(changed)[0] === 'assetClass') {
      return {
        ..._.pick(formData, ['instrumentId']),
        ...changed,
      };
    }
    if (changed.instrumentType === 'STOCK') {
      return {
        ...formData,
        multiplier: 1,
      };
    }
    return formData;
  };

  public onCreateFormChange = (
    values: object,
    tableData: any[],
    tableFormData: object,
    changed: {}
  ) => {
    this.setState({
      createFormData: this.filterFormData(values, changed),
    });
  };

  public onEditFormDataChange = (values, changed) => {
    return this.filterFormData(values, changed);
  };

  public composeInstrumentInfo = modalFormData => {
    const instrumentInfoFields = ['multiplier', 'name', 'exchange', 'maturity'];

    const params = {
      ..._.omit(modalFormData, instrumentInfoFields),
      instrumentInfo: this.omitNull(_.pick(modalFormData, instrumentInfoFields)),
    };

    return this.omitNull(params);
  };

  public omitNull = obj => _.omitBy(obj, val => val === null);

  public onCreate = async (event: SourceTableState) => {
    const { createFormData } = event;
    const { error } = await mktInstrumentCreate(this.composeInstrumentInfo(createFormData));
    if (error) {
      return;
    }
    this.setState({
      createFormData: {},
    });
    return !error;
  };

  public onConfirmRowEdit = ({ formData }) => {
    return mktInstrumentCreate(this.composeInstrumentInfo(formData)).then(rsp => {
      if (rsp.error) return false;

      this.$sourceTable.onSearch(this.$sourceTable.getStationlData());

      message.success('修改成功');

      return true;
    });
  };

  public onSearchFormChange = params => {
    // console.log(params);
    // debugger;
    if (Object.keys(params.changed)[0] === 'assetClass') {
      return this.setState({
        searchFormData: {
          ...params.formData,
          instrumentType: undefined,
        },
      });
    }
    return this.setState({
      searchFormData: params.formData,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper back={true}>
        <SourceTable
          ref={node => (this.$sourceTable = node)}
          rowKey="instrumentId"
          createText="新建标的物"
          onRemove={this.onRemove}
          onSearch={this.fetchTable}
          tableColumnDefs={TABLE_COL_DEFS}
          removeable={true}
          onCreateFormChange={this.onCreateFormChange}
          createFormControls={createFormControls}
          createFormData={this.state.createFormData}
          searchFormControls={searchFormControls}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          onCreate={this.onCreate}
          paginationProps={{
            backend: true,
          }}
          createModalProps={{
            visible: this.state.visible,
          }}
          rowActions={[
            <ModalButton
              key="edit"
              onClick={this.onRowEdit}
              onConfirm={this.onConfirmRowEdit}
              onFormChange={this.onEditFormDataChange}
            >
              编辑
            </ModalButton>,
            // <Button key="order">订阅</Button>,
          ]}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementMarketManagement;
