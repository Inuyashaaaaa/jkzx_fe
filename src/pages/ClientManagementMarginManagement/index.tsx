import { Button, Divider, Icon, message, Modal, Row, notification } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid';
import _ from 'lodash';
import { Form2, Select, SmartTable, Table2 } from '@/containers';
import Page from '@/containers/Page';
import ImportExcelButton from '@/containers/_ImportExcelButton';
import { downloadUrl } from '@/services/onBoardTransaction';
import {
  mgnMarginSearch,
  mgnMarginsUpdate,
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { PAGE_TABLE_COL_DEFS } from './constants';
import { TABLE_COLUMNS } from './tools';

class ClientManagementMarginManagement extends PureComponent {
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
      },
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
    if (error) {
      this.setState({
        searchFormData: {},
      });
      return notification.error({
        message: `${error.message ? error.message : ''}请重新查询`,
      });
    }
    this.setState({
      dataSource: data,
    });
    return null;
  };

  public handleConfirmExcel = () => {
    this.setState(
      {
        excelVisible: false,
      },
      () => {
        this.handleExcelFile(this.state.excelData.map(item => Form2.getFieldsValue(item)));
      },
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
    this.setState({
      modalVisible: false,
    });
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
      modalLoading: false,
    });
  };

  public downloadFormModal = async () => {
    window.open(`${downloadUrl}margin.xlsx`);
  };

  public handleCellValueChanged = params => {
    const { excelData } = this.state;
    this.setState({
      excelData: excelData.map(item => {
        if (item.uuid === params.record.uuid) {
          return params.record;
        }
        return item;
      }),
    });
  };

  public render() {
    return (
      <Page>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="查询"
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
              render: (val, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
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
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '主协议编号',
              dataIndex: 'masterAgreementId',
              render: (val, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
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
                    />,
                  )}
                </FormItem>
              ),
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
        <SmartTable
          dataSource={this.state.dataSource}
          columns={TABLE_COLUMNS(this.fetchTable)}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="uuid"
          scroll={
            this.state.dataSource && this.state.dataSource.length > 0
              ? { x: '1200px' }
              : { x: false }
          }
        />
        <Modal
          title="导入预览"
          visible={this.state.excelVisible}
          onOk={this.handleConfirmExcel}
          onCancel={this.handleCancelExcel}
        >
          <SmartTable
            rowKey="uuid"
            columns={PAGE_TABLE_COL_DEFS}
            dataSource={this.state.excelData}
            onCellFieldsChange={this.handleCellValueChanged}
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
                const importData = data.data[0][Object.keys(data.data[0])[0]];
                this.setState({
                  excelVisible: true,
                  excelData: importData.map(item => ({
                    ...Form2.createFields({
                      legalName: item[0],
                      maintenanceMargin: _.isNumber(item[1]) ? item[1] : 0,
                    }),
                    uuid: uuidv4(),
                  })),
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
      </Page>
    );
  }
}

export default ClientManagementMarginManagement;
