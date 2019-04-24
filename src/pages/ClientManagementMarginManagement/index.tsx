import SourceTable from '@/design/components/SourceTable';
import ImportExcelButton from '@/lib/components/_ImportExcelButton';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { delay, mockData } from '@/lib/utils';
import { mgnMarginSearch, mgnMarginsUpdate } from '@/services/reference-data-service';
import { message, Modal } from 'antd';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid';
import { PAGE_TABLE_COL_DEFS, SEARCH_FORM_CONTROLS, TABLE_COL_DEFS } from './constants';

class ClientManagementMarginManagement extends PureComponent {
  public $marginSourceTable: SourceTable = null;

  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
    excelVisible: false,
    excelData: [],
  };

  public componentDidMount = () => {
    this.fetchTable();
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

  public onSearchFormChange = async params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await mgnMarginSearch({
      ...this.state.searchFormData,
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
    this.$marginSourceTable.$baseSourceTable.$table.$baseTable.gridApi.refreshView();
  };

  public handleConfirmExcel = () => {
    this.setState(
      {
        excelVisible: false,
      },
      () => {
        this.handleExcelFile(this.state.excelData);
      }
    );
  };

  public handleExcelFile = async excelData => {
    const { error, data } = await mgnMarginsUpdate({
      margins: excelData,
    });
    if (error) {
      message.error('批量更新失败');
      return false;
    }
    message.success('批量更新成功');
    this.fetchTable();
    return true;
  };

  public handleCancelExcel = () => {
    this.setState({
      excelVisible: false,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          rowKey="uuid"
          ref={node => (this.$marginSourceTable = node)}
          loading={this.state.loading}
          columnDefs={TABLE_COL_DEFS(this.fetchTable)}
          dataSource={this.state.dataSource}
          searchable={true}
          resetable={true}
          onResetButtonClick={this.onReset}
          onSearchButtonClick={this.fetchTable}
          searchFormControls={SEARCH_FORM_CONTROLS}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          header={
            <ImportExcelButton
              key="import"
              style={{
                marginBottom: '20px',
              }}
              type="primary"
              onImport={data => {
                this.setState({
                  excelVisible: true,
                  excelData: data.data.slice(1).map(item => {
                    return {
                      uuid: uuidv4(),
                      legalName: item[0],
                      maintenanceMargin: item[1],
                    };
                  }),
                });
              }}
            >
              批量更新
            </ImportExcelButton>
          }
        />
        <Modal
          title="导入预览"
          visible={this.state.excelVisible}
          onOk={this.handleConfirmExcel}
          onCancel={this.handleCancelExcel}
        >
          <SourceTable
            rowKey="uuid"
            columnDefs={PAGE_TABLE_COL_DEFS}
            dataSource={this.state.excelData}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementMarginManagement;
