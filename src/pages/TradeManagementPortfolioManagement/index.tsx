import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import { IFormControl } from '@/design/components/Form/types';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdPortfolioCreate, trdPortfolioSearch } from '@/services/trade-service';
import { Row } from 'antd';
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
      //   page: (paramsPagination || this.state.pagination).current - 1,
      //   pageSize: (paramsPagination || this.state.pagination).pageSize,
      portfolioName: this.state.searchFormData.portfolioName,
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
                content={
                  <Form
                    footer={false}
                    controls={RESOURCE_FORM_CONTROLS}
                    dataSource={this.state.createFormData}
                    onValueChange={this.onCreateFormDataChange}
                  />
                }
                onConfirm={this.onCreate}
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
