import { VERTICAL_GUTTER } from '@/constants/global';
import SourceTable from '@/containers/SourceTable';
import { sortByCreateAt } from '@/services/sort';
import React, { PureComponent } from 'react';
import CapitalInputModal from './CapitalInputModal';
import { HISTORY_COL_DEFS, PROCESSED_FORM_CONTROLS, HISTORY_CLOUNMS } from './constants';
import { Form2, Select } from '@/containers';
import { IOGLOD_EVENT_TYPE_OPTIONS } from '@/constants/common';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
  cliTradeTaskSearch,
  clientAccountOpRecordSearch,
} from '@/services/reference-data-service';
import FormItem from 'antd/lib/form/FormItem';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import { Button, Divider, Row, Table } from 'antd';

class History extends PureComponent {
  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await clientAccountOpRecordSearch({
      ...Form2.getFieldsValue(this.state.searchFormData),
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: sortByCreateAt(data),
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

  public onSearchFormChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public render() {
    return (
      <>
        <Form2
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
            {
              title: '交易ID',
              dataIndex: 'tradeId',
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
                          const { data, error } = await trdTradeListBySimilarTradeId({
                            similarTradeId: value,
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
              title: '事件类型',
              dataIndex: 'event',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        options={IOGLOD_EVENT_TYPE_OPTIONS}
                      />
                    )}
                  </FormItem>
                );
              },
            },
          ]}
        />
        <Divider type="horizontal" />
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between">
          <CapitalInputModal fetchTable={this.fetchTable} />
        </Row>
        <Table
          dataSource={this.state.dataSource}
          columns={HISTORY_CLOUNMS(this.fetchTable)}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          size="middle"
          rowKey="uuid"
          scroll={this.state.dataSource ? { x: '3600px' } : { x: false }}
        />
        {/* <SourceTable
        rowKey="uuid"
        dataSource={this.state.dataSource}
        loading={this.state.loading}
        searchable={true}
        resetable={true}
        onResetButtonClick={this.onReset}
        columnDefs={HISTORY_COL_DEFS}
        searchFormControls={PROCESSED_FORM_CONTROLS('history')}
        searchFormData={this.state.searchFormData}
        onSearchButtonClick={this.fetchTable}
        onSearchFormChange={this.onSearchFormChange}
        autoSizeColumnsToFit={false}
        header={<CapitalInputModal fetchTable={this.fetchTable} />}
      /> */}
      </>
    );
  }
}

export default History;
