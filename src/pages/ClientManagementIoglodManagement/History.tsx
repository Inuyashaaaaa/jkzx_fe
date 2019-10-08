/* eslint-disable */
import { Divider, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { IOGLOD_EVENT_TYPE_OPTIONS } from '@/constants/common';
import { Form2, Select, SmartTable } from '@/containers';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import {
  clientAccountOpRecordSearch,
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { sortByCreateAt } from '@/services/sort';
import CapitalInputModal from './CapitalInputModal';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import { HISTORY_CLOUNMS } from './tools';
import { HISTORY_CLOUNMS_STATUS_MAP } from './constants';
import { formatMoney } from '@/tools';

class History extends PureComponent {
  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
    searchForm: {},
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async (fromData, useSearchFormData = false) => {
    this.setState({
      loading: true,
    });
    const { searchFormData, searchForm } = this.state;
    const { error, data } = await clientAccountOpRecordSearch({
      ...Form2.getFieldsValue(fromData || searchForm),
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    if (useSearchFormData) {
      this.setState({
        searchForm: searchFormData,
      });
    }
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
        this.fetchTable(this.state.searchFormData, true);
      },
    );
  };

  public onSearchFormChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public handleDataSource = data =>
    data.map(item => {
      item.status = HISTORY_CLOUNMS_STATUS_MAP[item.status];
      item.event = (
        IOGLOD_EVENT_TYPE_OPTIONS[
          _.findIndex(IOGLOD_EVENT_TYPE_OPTIONS, param => param.value === item.event)
        ] || {}
      ).label;
      return item;
    });

  public render() {
    return (
      <>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="查询"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={() => this.fetchTable(this.state.searchFormData, true)}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onSearchFormChange}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (value, record, index, { form, editing }) => (
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
              render: (value, record, index, { form, editing }) => (
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
            {
              title: '交易ID',
              dataIndex: 'tradeId',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
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
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '事件类型',
              dataIndex: 'event',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      options={IOGLOD_EVENT_TYPE_OPTIONS}
                    />,
                  )}
                </FormItem>
              ),
            },
          ]}
        />
        <Divider type="horizontal" />
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between">
          <CapitalInputModal fetchTable={this.fetchTable} />
          <DownloadExcelButton
            style={{ margin: '10px 0' }}
            key="export"
            type="primary"
            data={{
              searchMethod: clientAccountOpRecordSearch,
              argument: {
                searchFormData: this.state.searchFormData,
              },
              cols: HISTORY_CLOUNMS(this.fetchTable),
              name: '台账管理-历史台账',
              colSwitch: [],
              sortBy: 'CreateAt',
              handleDataSource: this.handleDataSource,
              getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                if (val === null || val === undefined) {
                  return null;
                }
                if (
                  [
                    'marginChange',
                    'cashChange',
                    'premiumChange',
                    'creditUsedChange',
                    'debtChange',
                    'debtChange',
                    'netDepositChange',
                    'realizedPnLChange',
                    'counterPartyCreditChange',
                    'counterPartyCreditBalanceChange',
                    'counterPartyFundChange',
                    'counterPartyMarginChange',
                    'creditChange',
                  ].includes(dataIndex) &&
                  rowIndex > 0
                ) {
                  return {
                    t: 'n',
                    z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
                  };
                }
              },
            }}
          >
            导出Excel
          </DownloadExcelButton>
        </Row>
        <SmartTable
          dataSource={this.state.dataSource}
          columns={HISTORY_CLOUNMS(this.fetchTable)}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="uuid"
          scroll={this.state.dataSource ? { x: '3600px' } : { x: false }}
        />
      </>
    );
  }
}

export default History;
