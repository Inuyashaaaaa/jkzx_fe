import ImportExcelButton from '@/containers/_ImportExcelButton';
import SourceTable, { SourceTableState } from '@/containers/_SourceTable';
// import Table from '@/components/_Table2';
import Page from '@/containers/Page';
import {
  mktAllInstrumentWhitelistSave,
  mktInstrumentWhitelistDelete,
  mktInstrumentWhitelistListPaged,
  mktInstrumentWhitelistSave,
  mktInstrumentWhitelistSearch,
} from '@/services/market-data-service';
import { tradeReferenceGet } from '@/services/trade-service';
import { message, Modal, Tabs, Table, Divider, Row, Button } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS, PAGE_TABLE_COL_DEFS, SEARCH_FORM_CONTROLS } from './constants';
import { Form2, Select, InputNumber, Input } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';

const { TabPane } = Tabs;

class SystemSettingsRiskSettings extends PureComponent {
  public $createFrom: Form2 = null;
  public initialFetchTableData = null;

  public $soureTable: SourceTable = null;

  public state = {
    formData: {},
    rowData: [],
    canSave: false,
    saveLoading: false,
    loading: false,
    searchFormData: {
      ...Form2.createFields({
        instrumentIds: [],
      }),
    },
    visible: false,
    excelData: [],
    venueCodes: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    createVisible: false,
    createFormData: {},
    tableDataSource: [],
  };

  public componentDidMount() {
    this.fetchTable(null);
  }

  public fetchTable = async currentPagination => {
    const { error: _error, data: _data } = await tradeReferenceGet();
    if (_data) {
      this.setState({
        venueCodes: _data.businessCenters.map(item => ({
          label: item.description,
          value: item.name,
        })),
      });
    }
    this.setState({
      loading: true,
    });
    const { pagination, searchFormData } = this.state;
    const { error, data } = await mktInstrumentWhitelistListPaged({
      page:
        currentPagination && currentPagination.current
          ? currentPagination.current - 1
          : pagination.current - 1,
      pageSize:
        currentPagination && currentPagination.pageSize
          ? currentPagination.pageSize
          : pagination.pageSize,
      ...Form2.getFieldsValue(searchFormData),
      // ...(event.searchFormData.instrumentIds ? event.searchFormData : { instrumentIds: [] }),
    });
    this.setState({
      loading: false,
    });
    if (error) return false;
    this.setState({
      tableDataSource: data.page,
      pagination: {
        ...pagination,
        total: data.totalCount,
      },
    });
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

  public onRemove = (e, data = {}) => {
    return mktInstrumentWhitelistDelete({
      instrumentIds: [data.instrumentId],
    }).then(rsp => {
      if (rsp.error) return message.error('删除失败');
      message.success('删除成功');
      this.fetchTable(null);
    });
  };

  public onCreate = async () => {
    const { error: _error } = await this.$createFrom.validate();
    if (_error) return;

    const { createFormData } = this.state;

    const { error } = await mktInstrumentWhitelistSave(Form2.getFieldsValue(createFormData));

    if (error) {
      message.error('白名单上传失败');
      return this.setState({
        createVisible: false,
      });
    }

    message.success('白名单上传成功');
    this.fetchTable(null);
    return this.setState({
      createVisible: false,
    });
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

  public handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public createCancel = () => {
    this.setState({
      createVisible: false,
    });
  };

  public onSearchFormChange = async (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public oncreateFormChange = async (props, changedFields, allFields) => {
    this.setState({
      createFormData: allFields,
    });
  };

  public paginationChange = (current, pageSize) => {
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.fetchTable(null);
      }
    );
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {
          ...Form2.createFields({
            instrumentIds: [],
          }),
        },
      },
      () => {
        this.fetchTable(null);
      }
    );
  };

  public render() {
    return (
      <Page>
        <Tabs defaultActiveKey="1">
          <TabPane tab="白名单" key="1">
            <Form2
              layout="inline"
              dataSource={this.state.searchFormData}
              submitText={'搜索'}
              submitButtonProps={{
                icon: 'search',
              }}
              onSubmitButtonClick={this.fetchTable}
              onResetButtonClick={this.onReset}
              onFieldsChange={this.onSearchFormChange}
              columns={[
                {
                  title: '标的物列表',
                  dataIndex: 'instrumentIds',
                  render: (value, record, index, { form, editing }) => {
                    return (
                      <FormItem>
                        {form.getFieldDecorator({})(
                          <Select
                            style={{ minWidth: 180 }}
                            placeholder="请输入内容搜索"
                            allowClear={true}
                            showSearch={true}
                            fetchOptionsOnSearch={true}
                            mode="multiple"
                            options={async (value: string = '') => {
                              const { data, error } = await mktInstrumentWhitelistSearch({
                                instrumentIdPart: value,
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
                  marginRight: 10,
                }}
                type="primary"
                onClick={() => {
                  this.setState({ createVisible: true });
                }}
              >
                新建白名单
              </Button>
              <ImportExcelButton
                key="import"
                type="primary"
                onImport={data => {
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
              </ImportExcelButton>
            </Row>
            <Table
              dataSource={this.state.tableDataSource}
              columns={[
                {
                  title: '交易所',
                  dataIndex: 'venueCode',
                },
                {
                  title: '标的',
                  dataIndex: 'instrumentId',
                },
                {
                  title: '存续期名义金额上限',
                  dataIndex: 'notionalLimit',
                },
                {
                  title: '操作',
                  render: (text, record, index) => {
                    return (
                      <Button type="danger" onClick={e => this.onRemove(e, record)}>
                        删除
                      </Button>
                    );
                  },
                },
              ]}
              pagination={{
                ...this.state.pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 项`,
                onChange: this.paginationChange,
              }}
              loading={this.state.loading}
              rowKey="uuid"
              size="middle"
              scroll={
                this.state.tableDataSource && this.state.tableDataSource.length > 0
                  ? { x: '1000px' }
                  : { x: false }
              }
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
        <Modal
          visible={this.state.createVisible}
          onOk={this.onCreate}
          onCancel={this.createCancel}
          width={520}
          closable={false}
        >
          <Form2
            ref={node => (this.$createFrom = node)}
            layout="horizontal"
            dataSource={this.state.createFormData}
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 6 }}
            footer={false}
            onFieldsChange={this.oncreateFormChange}
            columns={[
              {
                title: '交易所',
                dataIndex: 'venueCode',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [{ required: true, message: '交易所为必填项' }],
                      })(
                        <Select
                          style={{ minWidth: 180 }}
                          placeholder="请输入内容搜索"
                          allowClear={true}
                          showSearch={true}
                          options={this.state.venueCodes || []}
                        />
                      )}
                    </FormItem>
                  );
                },
              },
              {
                title: '标的',
                dataIndex: 'instrumentId',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [{ required: true, message: '标的为必填项' }],
                      })(<Input />)}
                    </FormItem>
                  );
                },
              },
              {
                title: '存续期名义金额',
                dataIndex: 'notionalLimit',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [{ required: true, message: '存续期名义金额交易所为必填项' }],
                      })(<InputNumber />)}
                    </FormItem>
                  );
                },
              },
            ]}
          />
        </Modal>
        {/* <SourceTable
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
            /> */}
      </Page>
    );
  }
}

export default SystemSettingsRiskSettings;
