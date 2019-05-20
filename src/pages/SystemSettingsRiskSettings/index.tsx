import ImportExcelButton from '@/components/_ImportExcelButton';
import SourceTable, { SourceTableState } from '@/components/_SourceTable';
import Table from '@/components/_Table2';
import Page from '@/containers/Page';
import {
  mktAllInstrumentWhitelistSave,
  mktInstrumentWhitelistDelete,
  mktInstrumentWhitelistListPaged,
  mktInstrumentWhitelistSave,
} from '@/services/market-data-service';
import { tradeReferenceGet } from '@/services/trade-service';
import { message, Modal, Tabs } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS, PAGE_TABLE_COL_DEFS, SEARCH_FORM_CONTROLS } from './constants';

const { TabPane } = Tabs;
class SystemSettingsRiskSettings extends PureComponent {
  public $table: Table = null;

  public initialFetchTableData = null;

  public $soureTable: SourceTable = null;

  public state = {
    formData: {},
    rowData: [],
    canSave: false,
    saveLoading: false,
    loading: false,
    searchFormData: {},
    visible: false,
    excelData: [],
    venueCodes: [],
  };

  public fetchTable = async event => {
    const { error: _error, data: _data } = await tradeReferenceGet();
    if (_data) {
      this.setState({
        venueCodes: _data.businessCenters.map(item => ({
          label: item.description,
          value: item.name,
        })),
      });
    }

    const { error, data } = await mktInstrumentWhitelistListPaged({
      page: event.pagination.current - 1,
      pageSize: event.pagination.pageSize,
      ...(event.searchFormData.instrumentIds ? event.searchFormData : { instrumentIds: [] }),
    });
    if (error) return false;
    return {
      tableDataSource: data.page,
      pagination: {
        ...event.pagination,
        total: data.totalCount,
      },
    };
    // return mktInstrumentWhitelistListPaged({
    //   page: event.pagination.current - 1,
    //   pageSize: event.pagination.pageSize,
    //   ...(event.searchFormData.instrumentIds ? event.searchFormData : { instrumentIds: [] }),
    // }).then(result => {
    //   if (result.error) return undefined;
    //   return {
    //     tableDataSource: result.data.page,
    //     pagination: {
    //       ...event.pagination,
    //       total: result.data.totalCount,
    //     },
    //   };
    // });
  };

  public excelTable = event => {
    return {
      tableDataSource: this.state.excelData,
    };
  };

  public onRemove = event => {
    return mktInstrumentWhitelistDelete({
      instrumentIds: [event.rowId],
    }).then(rsp => {
      if (rsp.error) return message.error('删除失败');
      message.success('删除成功');
      return !rsp.error;
    });
  };

  public onCreate = async (event: SourceTableState) => {
    const { createFormData, tableDataSource } = event;

    const { error } = await mktInstrumentWhitelistSave(createFormData);

    if (error) {
      message.error('白名单上传失败');
      return false;
    }

    message.success('白名单上传成功');

    return true;
  };

  public handleExcelFile = data => {
    return mktAllInstrumentWhitelistSave({
      content: data.map(item => {
        return _.values(item).join();
      }),
    }).then(result => {
      if (result.error) return message.error('导入失败');
      message.success('导入成功');
      return result;
    });
  };

  public onCellValueChanged = event => {
    return mktInstrumentWhitelistSave(event.data).then(result => {
      if (result.error) return message.error('更新错误');
      message.success('更新成功');
      return event.data;
    });
  };

  public handleConfirm = event => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.handleExcelFile(this.state.excelData);
      }
    );
  };

  public handleCancel = event => {
    this.setState({
      visible: false,
    });
  };

  public render() {
    return (
      <Page>
        <Tabs defaultActiveKey="1">
          <TabPane tab="白名单" key="1">
            <SourceTable
              rowKey="instrumentId"
              createText="新建白名单"
              ref={node => (this.$soureTable = node)}
              onSearch={this.fetchTable}
              onRemove={this.onRemove}
              removeable={true}
              editable={false}
              tableColumnDefs={PAGE_TABLE_COL_DEFS}
              onCreate={this.onCreate}
              createFormControls={CREATE_FORM_CONTROLS(this.state.venueCodes)}
              paginationProps={{
                backend: true,
              }}
              searchFormControls={SEARCH_FORM_CONTROLS}
              extraActions={[
                <ImportExcelButton
                  key="import"
                  type="primary"
                  onImport={data => {
                    console.log('data', data);
                    const _data = data.data[0][Object.keys(data.data[0])[0]];
                    this.setState({
                      visible: true,
                      excelData: _data.slice(1).map(item => {
                        return {
                          venueCode: item[0],
                          instrumentId: item[1],
                          notionalLimit: item[2] ? item[2] : 100000000,
                        };
                      }),
                    });
                  }}
                >
                  导入Excel
                </ImportExcelButton>,
              ]}
              tableProps={{
                onCellValueChanged: this.onCellValueChanged,
              }}
            />
          </TabPane>
        </Tabs>
        <Modal
          title="导入预览"
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          width={800}
        >
          <SourceTable
            rowKey="instrumentId"
            tableColumnDefs={PAGE_TABLE_COL_DEFS}
            dataSource={this.state.excelData}
            editable={false}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsRiskSettings;
