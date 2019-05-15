import SourceTable from '@/design/components/SourceTable';
import ImportExcelButton from '@/lib/components/_ImportExcelButton';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { delay, mockData } from '@/lib/utils';
import { message, Modal, Button, Icon, Divider, Table, Row } from 'antd';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid';
import {
  PAGE_TABLE_COL_DEFS,
  SEARCH_FORM_CONTROLS,
  TABLE_COL_DEFS,
  TABLE_COLUMNS,
} from './constants';
import { docBctTemplateList, downloadUrl } from '@/services/onBoardTransaction';
import { Form2, Select } from '@/design/components';
import FormItem from 'antd/lib/form/FormItem';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
  mgnMarginSearch,
  mgnMarginsUpdate,
} from '@/services/reference-data-service';
class ClientManagementMarginManagement extends PureComponent {
  public $marginSourceTable: SourceTable = null;
  public $sourceTable: Form2 = null;
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

  public onSearchFormChange = async (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await mgnMarginSearch({
      ...Form2.getFieldsValue(this.state.searchFormData),
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
    // this.$marginSourceTable.$baseSourceTable.$table.$baseTable.gridApi.refreshView();
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
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText={'查询'}
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.fetchTable}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onSearchFormChange}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await refSimilarLegalNameList({
                            similarLegalName: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
                            label: item,
                            value: item,
                          }));
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '主协议编号',
              dataIndex: 'masterAgreementId',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await refMasterAgreementSearch({
                            masterAgreementId: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
                            label: item,
                            value: item,
                          }));
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
          ]}
        />
        <Divider type="horizontal" />
        <Row>
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
        </Row>
        <Table
          dataSource={this.state.dataSource}
          columns={TABLE_COLUMNS(this.fetchTable)}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="uuid"
          size="middle"
          scroll={
            this.state.dataSource && this.state.dataSource.length > 0
              ? { x: '1000px' }
              : { x: false }
          }
        />
        {/* <SourceTable
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
        /> */}
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
          title="导入场内流水"
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
          <p style={{ marginLeft: '20px' }}>1.仅支持导入.csv格式的文件</p>
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
