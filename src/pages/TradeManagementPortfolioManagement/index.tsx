import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Input } from '@/design/components';
import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import { IFormColDef } from '@/design/components/type';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdPortfolioCreate, trdPortfolioSearch } from '@/services/trade-service';
import { Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import ActionCol from './Action';

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
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searchFormData: {},
    createFormData: {},
  };

  public $createForm: Form = null;

  public $sourceTable: SourceTable = null;

  public componentDidMount = () => {
    this.search();
  };

  public search = async (paramsPagination?) => {
    this.setState({
      loading: true,
    });
    const { error, data } = await trdPortfolioSearch({
      portfolioName: this.state.searchFormData.portfolioName
        ? this.state.searchFormData.portfolioName
        : '',
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
    const result = await this.$createForm.validate();
    if (result.error) return;

    const { error } = await trdPortfolioCreate(Form2.getFieldsValue(this.state.createFormData));
    if (error) return;

    this.switchModal(() => {
      this.setState({
        createFormData: {},
      });
      this.search();
    });
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

  public render() {
    return (
      <PageHeaderWrapper title="投资组合管理">
        <SourceTable
          onSearchButtonClick={this.onSearchButtonClick}
          searchable={true}
          searchFormControls={[
            {
              control: {
                label: '投资组合名称',
              },
              field: 'portfolioName',
            },
          ]}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          ref={node => (this.$sourceTable = node)}
          rowKey="uuid"
          loading={this.state.loading}
          columnDefs={[
            {
              headerName: '投资组合名称',
              field: 'portfolioName',
            },
            {
              pinned: 'right',
              width: 200,
              headerName: '操作',
              render: params => {
                return <ActionCol params={params} reload={this.search} />;
              },
            },
          ]}
          dataSource={this.state.dataSource}
          header={
            <Row style={{ marginBottom: VERTICAL_GUTTER }} type="flex" justify="start">
              <ModalButton
                type="primary"
                onClick={this.onModalClick}
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
                  onOk: this.onCreate,
                  onCancel: this.switchModal,
                  title: '新建投资组合',
                  visible: this.state.visible,
                }}
              >
                新建
              </ModalButton>
            </Row>
          }
        />
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementPortfolioManagement;
