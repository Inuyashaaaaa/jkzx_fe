import { Divider, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import { Form2, Select, SmartTable } from '@/containers';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import {
  cliTradeTaskSearch,
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { sortByCreateAt } from '@/services/sort';
import CapitalInputModal from './CapitalInputModal';
import { PROCESSED_COLUMN } from './tools';

class Processed extends PureComponent {
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
    const { error, data } = await cliTradeTaskSearch({
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
            {
              title: '交易ID',
              dataIndex: 'tradeId',
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
          ]}
        />
        <Divider type="horizontal" />
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between">
          <CapitalInputModal fetchTable={this.fetchTable} />
        </Row>
        <SmartTable
          dataSource={this.state.dataSource}
          columns={PROCESSED_COLUMN(this.fetchTable)}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="uuid"
          scroll={this.state.dataSource ? { x: '1200px' } : { x: false }}
        />
      </>
    );
  }
}

export default Processed;
