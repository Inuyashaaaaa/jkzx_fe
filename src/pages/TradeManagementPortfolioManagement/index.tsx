import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Input, Select, SmartTable } from '@/containers';
import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import SourceTable from '@/containers/SourceTable';
import { IFormColDef } from '@/components/type';
import Page from '@/containers/Page';
import {
  trdPortfolioCreate,
  trdPortfolioListBySimilarPortfolioName,
  trdPortfolioSearch,
} from '@/services/trade-service';
import { Divider, message, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import Action from './Action';

export const RESOURCE_FORM_CONTROLS: IFormColDef[] = [
  {
    dataIndex: 'portfolioName',
    title: '输入投资组合名称',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填内容',
              },
              {
                validator: (rule, value, callback) => {
                  if (value && (value.startsWith(' ') || value.endsWith(' '))) {
                    return callback(true);
                  }
                  callback();
                },
                message: '前后不可以有空格',
              },
            ],
          })(<Input />)}
        </FormItem>
      );
    },
  },
];

class TradeManagementPortfolioManagement extends PureComponent<any, any> {
  public state = {
    visible: false,
    dataSource: [],
    loading: false,
    searchFormData: {},
    createFormData: {},
  };

  public $createForm: Form = null;

  public $sourceTable: SourceTable = null;

  public componentDidMount = () => {
    this.search();
  };

  public getFormData = () => {
    return _.mapValues(this.state.searchFormData, item => {
      return _.get(item, 'value');
    });
  };

  public search = async (paramsPagination?) => {
    this.setState({
      loading: true,
    });
    const searchFormData = this.getFormData();
    const { error, data } = await trdPortfolioSearch({
      portfolioName: searchFormData.portfolioName ? searchFormData.portfolioName : '',
    });
    this.setState({
      loading: false,
    });

    if (error) return;

    this.setState({
      dataSource: data,
    });
  };

  public switchModal = (callback?) => {
    this.setState(
      {
        visible: !this.state.visible,
      },
      callback
    );
  };

  public onModalClick = () => {
    this.switchModal();
  };

  public onCreate = async () => {
    try {
      if (!this.$createForm) return;

      const result = await this.$createForm.validate();
      if (result.error) return;

      const { error } = await trdPortfolioCreate(Form2.getFieldsValue(this.state.createFormData));
      if (error) {
        message.error('新建失败');
        return;
      }

      this.switchModal(() => {
        this.setState({
          createFormData: {},
        });
        message.success('新建成功');
        this.search();
      });
    } catch (err) {}
  };

  public bindChange = params => async () => {};

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public onSearchButtonClick = () => {
    this.search();
  };

  public bindRemove = params => async () => {};

  public onCreateFormDataChange = (props, changedFields) => {
    this.setState({
      createFormData: {
        ...this.state.createFormData,
        ...changedFields,
      },
    });
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public render() {
    return (
      <Page title="投资组合管理">
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="搜索"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.onSearchButtonClick}
          onFieldsChange={this.onFieldsChange}
          resetable={false}
          columns={[
            {
              title: '投资组合名称',
              dataIndex: 'portfolioName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        {...{
                          editing,
                          style: {
                            width: 180,
                          },
                          placeholder: '请输入内容搜索',
                          showSearch: true,
                          allowClear: true,
                          fetchOptionsOnSearch: true,
                          options: async (value: string) => {
                            const { data, error } = await trdPortfolioListBySimilarPortfolioName({
                              similarPortfolioName: value,
                            });
                            if (error) return [];
                            return data.map(item => ({
                              label: item,
                              value: item,
                            }));
                          },
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
        <Row style={{ marginBottom: VERTICAL_GUTTER }} type="flex" justify="start">
          <ModalButton
            type="primary"
            content={
              <Form2
                ref={node => (this.$createForm = node)}
                footer={false}
                columns={RESOURCE_FORM_CONTROLS}
                dataSource={this.state.createFormData}
                onFieldsChange={this.onCreateFormDataChange}
              />
            }
            modalProps={{
              title: '新建投资组合名称',
              onOk: this.onCreate,
            }}
          >
            新建
          </ModalButton>
        </Row>
        <SmartTable
          rowKey="uuid"
          dataSource={this.state.dataSource}
          columns={[
            {
              title: '投资组合名称',
              dataIndex: 'portfolioName',
            },
            {
              title: '操作',
              dataIndex: '操作',
              width: 150,
              render: (text, record, index) => {
                return <Action params={{ data: record }} reload={this.search} />;
              },
            },
          ]}
          loading={this.state.loading}
        />
      </Page>
    );
  }
}

export default TradeManagementPortfolioManagement;
