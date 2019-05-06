import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Select } from '@/design/components';
import Form from '@/design/components/Form';
import { IFormControl } from '@/design/components/Form/types';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdPortfolioCreate, trdPortfolioSearch } from '@/services/trade-service';
import { Button, Divider, Input, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import ActionCol from './ActionCol';

export const RESOURCE_FORM_CONTROLS: IFormControl[] = [
  {
    field: 'portfolioName',
    control: {
      label: '输入投资组合名称',
    },
    input: {
      type: 'input',
    },
  },
];

class TradeManagementPortfolioManagement extends PureComponent<any, any> {
  public state = {
    visible: false,
    dataSource: [],
    loading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
    },
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

  public switchModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public onModalClick = () => {
    this.switchModal();
  };

  public onCreate = async () => {
    const { error } = await trdPortfolioCreate(this.state.createFormData);
    if (error) return;
    return () => {
      this.setState({
        createFormData: {},
      });
      this.search();
    };
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

  public onCreateFormDataChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper title="投资组合管理">
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="搜索"
          submitButtonProps={{
            icon: 'reload',
          }}
          onSubmitButtonClick={this.onSearchButtonClick}
          onFieldsChange={this.onFieldsChange}
          resetable={false}
          columns={[
            {
              title: '投资组合名称',
              dataIndex: 'portfolioName',
              render: (value, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
              },
            },
          ]}
        />
        <Divider type="horizontal" />
        <Row style={{ marginBottom: VERTICAL_GUTTER }} type="flex" justify="start">
          <ModalButton
            type="primary"
            content={
              <Form
                footer={false}
                controls={RESOURCE_FORM_CONTROLS}
                dataSource={this.state.createFormData}
                onValueChange={this.onCreateFormDataChange}
              />
            }
            modalProps={{
              onOk: this.onCreate,
            }}
          >
            新建
          </ModalButton>
        </Row>
        <Table
          dataSource={this.state.dataSource}
          columns={[
            {
              title: '投资组合名称',
              dataIndex: 'portfolioName',
            },
            {
              title: '操作',
              dataIndex: '操作',
              render: (text, record, index) => {
                return <ActionCol params={{ data: record }} reload={this.search} />;
              },
            },
          ]}
          pagination={this.state.pagination}
          loading={this.state.loading}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementPortfolioManagement;
