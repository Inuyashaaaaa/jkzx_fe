import SourceTable from '@/design/components/SourceTable';
import ImportExcelButton from '@/lib/components/_ImportExcelButton';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { delay, mockData } from '@/lib/utils';
import { mgnMarginSearch, mgnMarginsUpdate } from '@/services/reference-data-service';
import { message, Modal, Button, Icon } from 'antd';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid';
import { PAGE_TABLE_COL_DEFS, SEARCH_FORM_CONTROLS, TABLE_COL_DEFS } from './constants';
import { docBctTemplateList, downloadUrl } from '@/services/onBoardTransaction';
class ClientManagementMarginManagement extends PureComponent {
  public $marginSourceTable: SourceTable = null;

  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
    excelVisible: false,
    excelData: [],
    modalVisible: false,
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

  public hideModal = () => {
    this.editDate = {};
    this.setState({
      modalVisible: false,
      formItems: [],
      modalLoading: false,
    });
  };

  public downloadFormModal = async () => {
    window.open(`${downloadUrl}margin.xlsx`);
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
            <Button
              style={{
                marginBottom: '20px',
              }}
              type="primary"
              onClick={() => {
                this.setState({ modalVisible: true });
              }}
            >
              批量更新
            </Button>
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
        <Modal
          title="批量更新维持保证金"
          visible={this.state.modalVisible}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          footer={[
            <Button key="back" type="primary" onClick={this.hideModal}>
              {this.state.modalLoading ? '上传中' : '取消'}
            </Button>,
          ]}
        >
          <p style={{ textAlign: 'center', margin: '30px' }}>
            <ImportExcelButton
              key="import"
              style={{
                marginBottom: '20px',
              }}
              onImport={data => {
                const _data = data.data[0][Object.keys(data.data[0])[0]];
                this.setState({
                  excelVisible: true,
                  excelData: _data.map(item => {
                    return {
                      uuid: uuidv4(),
                      legalName: item[0],
                      maintenanceMargin: item[1],
                    };
                  }),
                });
              }}
            >
              <Icon type="upload" />
              选择文件
            </ImportExcelButton>
          </p>
          <p style={{ marginTop: '20px' }}>操作说明:</p>
          <p style={{ marginLeft: '20px' }}>1.仅支持导入.xlsx格式的文件</p>
          <p style={{ marginLeft: '20px' }}>
            2.导入模板下载:
            <a onClick={this.downloadFormModal}>批量更新维持保证金.xlsx</a>
          </p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementMarginManagement;
