import { Button, Divider, message, Modal, Popconfirm, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { Form2, Input, InputNumber, Select, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import TabHeader from '@/containers/TabHeader';
import ImportExcelButton from '@/containers/_ImportExcelButton';
import {
  mktAllInstrumentWhitelistSave,
  mktInstrumentWhitelistDelete,
  mktInstrumentWhitelistListPaged,
  mktInstrumentWhitelistSave,
  mktInstrumentWhitelistSearch,
} from '@/services/market-data-service';
import { tradeReferenceGet } from '@/services/trade-service';
import { formatMoney } from '@/tools';
import { PAGE_TABLE_COL_DEFS } from './constants';
import { PAGE_SIZE } from '@/constants/component';

class SystemSettingsRiskSettings extends PureComponent {
  public $createFrom: Form2 = null;

  public initialFetchTableData = null;

  public state = {
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
      pageSize: PAGE_SIZE,
    },
    createVisible: false,
    createFormData: {},
    tableDataSource: [],
    activeKey: '1',
    searchForm: {
      ...Form2.createFields({
        instrumentIds: [],
      }),
    },
  };

  public componentDidMount() {
    this.fetchTable();
  }

  public fetchTable = async (
    currentSearchForm,
    currentPagination,
    setFetchFromUserAction = false,
  ) => {
    const { error: _error, data: newData } = await tradeReferenceGet();
    if (newData) {
      this.setState({
        venueCodes: newData.businessCenters.map(item => ({
          label: item.description,
          value: item.name,
        })),
      });
    }
    this.setState({
      loading: true,
    });
    const { pagination, searchFormData, searchForm } = this.state;
    const { error, data } = await mktInstrumentWhitelistListPaged({
      page:
        currentPagination && currentPagination.current
          ? currentPagination.current - 1
          : pagination.current - 1,
      pageSize:
        currentPagination && currentPagination.pageSize
          ? currentPagination.pageSize
          : pagination.pageSize,
      ...Form2.getFieldsValue(currentSearchForm || searchForm),
      // ...(event.searchFormData.instrumentIds ? event.searchFormData : { instrumentIds: [] }),
    });
    this.setState({
      loading: false,
    });
    if (error) return false;
    if (setFetchFromUserAction) {
      this.setState({
        searchForm: searchFormData,
      });
    }
    return this.setState({
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

  public excelTable = event => ({
    tableDataSource: this.state.excelData,
  });

  public onRemove = (data = {}) =>
    mktInstrumentWhitelistDelete({
      instrumentIds: [data.instrumentId],
    }).then(rsp => {
      if (rsp.error) return message.error('删除失败');
      message.success('删除成功');
      return this.fetchTable();
    });

  public onCreate = async () => {
    const { error: _error } = await this.$createFrom.validate();
    if (_error) return;

    const { createFormData } = this.state;

    const { error } = await mktInstrumentWhitelistSave(Form2.getFieldsValue(createFormData));

    if (error) {
      message.error('白名单上传失败');
      this.setState({
        createVisible: false,
      });
      return;
    }

    message.success('白名单上传成功');
    this.fetchTable();
    this.setState({
      createVisible: false,
    });
  };

  public handleExcelFile = data =>
    mktAllInstrumentWhitelistSave({
      content: data.map(item => _.values(item).join()),
    }).then(result => {
      if (result.error) return message.error('导入失败');
      message.success('导入成功');
      return result;
    });

  public onCellValueChanged = event =>
    mktInstrumentWhitelistSave(event.data).then(result => {
      if (result.error) return message.error('更新错误');
      message.success('更新成功');
      return event.data;
    });

  public handleConfirm = event => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.handleExcelFile(this.state.excelData.map(item => Form2.getFieldsValue(item)));
      },
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
        this.fetchTable();
      },
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
        this.fetchTable(this.state.searchFormData, null, true);
      },
    );
  };

  public changeTab = tab => {
    this.setState({
      activeKey: tab,
    });
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
      <Page
        footer={
          <TabHeader
            activeKey={this.state.activeKey}
            onChange={this.changeTab}
            tabList={[{ key: '1', tab: '白名单' }]}
          />
        }
      >
        {this.state.activeKey === '1' && (
          <>
            <Form2
              layout="inline"
              dataSource={this.state.searchFormData}
              submitText="搜索"
              submitButtonProps={{
                icon: 'search',
              }}
              onSubmitButtonClick={() =>
                this.fetchTable(this.state.searchFormData, { current: 1 }, true)
              }
              onResetButtonClick={this.onReset}
              onFieldsChange={this.onSearchFormChange}
              columns={[
                {
                  title: '标的物列表',
                  dataIndex: 'instrumentIds',
                  render: (val, record, index, { form, editing }) => (
                    <FormItem>
                      {form.getFieldDecorator({})(
                        <Select
                          style={{ minWidth: 180 }}
                          placeholder="请输入内容搜索"
                          allowClear
                          showSearch
                          fetchOptionsOnSearch
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
                  const newData = data.data[0][Object.keys(data.data[0])[0]];
                  this.setState({
                    visible: true,
                    excelData: newData.slice(1).map(item => ({
                      ...Form2.createFields({
                        venueCode: item[0],
                        instrumentId: item[1],
                        notionalLimit: item[2] ? item[2] : 100000000,
                      }),
                      uuid: uuidv4(),
                    })),
                  });
                }}
              >
                导入Excel
              </ImportExcelButton>
            </Row>
            <SmartTable
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
                  align: 'right',
                  title: '存续期名义金额上限（￥）',
                  dataIndex: 'notionalLimit',
                  render: (text, record, index) => (text ? formatMoney(text, {}) : text),
                },
                {
                  title: '操作',
                  render: (text, record, index) => (
                    <Popconfirm title="确定要删除吗？" onConfirm={() => this.onRemove(record)}>
                      <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                  ),
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
              scroll={
                this.state.tableDataSource && this.state.tableDataSource.length > 0
                  ? { x: '1000px' }
                  : { x: false }
              }
            />
          </>
        )}
        <Modal
          title="导入预览"
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          width={800}
        >
          <SmartTable
            rowKey="uuid"
            columns={PAGE_TABLE_COL_DEFS}
            dataSource={this.state.excelData}
            onCellFieldsChange={this.handleCellValueChanged}
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
            ref={node => {
              this.$createFrom = node;
            }}
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
                render: (value, record, index, { form, editing }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true, message: '交易所为必填项' }],
                    })(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear
                        showSearch
                        options={this.state.venueCodes || []}
                      />,
                    )}
                  </FormItem>
                ),
              },
              {
                title: '标的',
                dataIndex: 'instrumentId',
                render: (value, record, index, { form, editing }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true, message: '标的为必填项' }],
                    })(<Input />)}
                  </FormItem>
                ),
              },
              {
                title: '存续期名义金额',
                dataIndex: 'notionalLimit',
                render: (value, record, index, { form, editing }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true, message: '存续期名义金额交易所为必填项' }],
                    })(<InputNumber />)}
                  </FormItem>
                ),
              },
            ]}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsRiskSettings;
