import { Divider, message, Row, Modal, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Input, Select, SmartTable } from '@/containers';
import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import { IFormColDef } from '@/components/type';
import Page from '@/containers/Page';
import {
  trdPortfolioCreate,
  trdPortfolioListBySimilarPortfolioName,
  trdPortfolioSearch,
} from '@/services/trade-service';
import Action from './Action';

export const RESOURCE_FORM_CONTROLS: IFormColDef[] = [
  {
    dataIndex: 'portfolioName',
    title: '输入投资组合名称',
    render: (val, record, index, { form }) => (
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
                return callback();
              },
              message: '前后不可以有空格',
            },
          ],
        })(<Input />)}
      </FormItem>
    ),
  },
];

class TradeManagementPortfolioManagement extends PureComponent<any, any> {
  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
    createFormData: {},
    createVisible: false,
  };

  public $createForm: Form = null;

  public componentDidMount = () => {
    this.search();
  };

  public getFormData = () => _.mapValues(this.state.searchFormData, item => _.get(item, 'value'));

  public search = async paramsPagination => {
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
      this.setState(
        {
          createVisible: false,
        },
        () => {
          this.setState({
            createFormData: {},
          });
          message.success('新建成功');
          this.search();
        },
      );

      // this.switchModal(() => {
      //   this.setState({
      //     createFormData: {},
      //   });
      //   message.success('新建成功');
      //   this.search();
      // });
    } catch (err) {
      console.log(err);
    }
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
    const { createFormData } = this.state;
    this.setState({
      createFormData: {
        ...createFormData,
        ...changedFields,
      },
    });
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public showModal = () => {
    this.setState({
      createVisible: true,
    });
  };

  public onCancel = () => {
    this.setState({
      createVisible: false,
    });
  };

  public render() {
    return (
      <Page title="投资组合管理">
        <Form2
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
              render: (val, record, index, { form, editing }) => (
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
                    />,
                  )}
                </FormItem>
              ),
            },
          ]}
        />
        <Divider type="horizontal" />
        <Row style={{ marginBottom: VERTICAL_GUTTER }} type="flex" justify="start">
          <Button type="primary" onClick={this.showModal}>
            新建
          </Button>
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
              render: (text, record, index) => (
                <Action params={{ data: record }} reload={this.search} />
              ),
            },
          ]}
          loading={this.state.loading}
        />
        <Modal
          title="新建投资组合"
          onOk={this.onCreate}
          visible={this.state.createVisible}
          onCancel={this.onCancel}
        >
          <Form2
            ref={node => {
              this.$createForm = node;
            }}
            footer={false}
            columns={RESOURCE_FORM_CONTROLS}
            dataSource={this.state.createFormData}
            onFieldsChange={this.onCreateFormDataChange}
          />
        </Modal>
      </Page>
    );
  }
}

export default TradeManagementPortfolioManagement;
