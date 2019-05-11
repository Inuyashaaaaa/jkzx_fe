import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2 } from '@/design/components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { mktInstrumentCreate, mktInstrumentsListPaged } from '@/services/market-data-service';
import { Button, Divider, message, Modal, Table } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { createFormControls, searchFormControls } from './services';
class TradeManagementMarketManagement extends PureComponent {
  public $form: Form2 = null;

  public state = {
    createFormData: {},
    searchFormData: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    total: 0,
    loading: false,
    tableDataSource: [],
    createVisible: false,
    createFormControls: {},
  };

  public componentDidMount = () => {
    this.fetchTable();
    this.setState({
      createFormControls: createFormControls({}, 'create'),
    });
  };

  public onReset = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
        },
        searchFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public fetchTable = async (paramsPagination?) => {
    const pagination = paramsPagination || this.state.pagination;
    this.setState({
      loading: true,
    });
    const searchFormData = _.mapValues(
      Form2.getFieldsValue(this.state.searchFormData),
      (value, key) => {
        if (key === 'instrumentIds' && (!value || !value.length)) {
          return undefined;
        }
        return value;
      }
    );

    const { error, data } = await mktInstrumentsListPaged({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      ...searchFormData,
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      tableDataSource: data.page,
      total: data.totalCount,
    });
  };

  public filterFormData = (allFields, fields) => {
    if (Object.keys(fields)[0] === 'assetClass') {
      return {
        ..._.pick(allFields, ['instrumentId']),
        ...fields,
      };
    }
    if (fields.instrumentType === 'STOCK') {
      return {
        ...allFields,
        multiplier: Form2.createField(1),
      };
    }
    return allFields;
  };

  public onCreateFormChange = (props, fields, allFields) => {
    const nextAllFields = {
      ...this.state.createFormData,
      ...fields,
    };
    const columns = createFormControls(Form2.getFieldsValue(nextAllFields), 'create');
    this.setState({
      createFormControls: columns,
      createFormData: this.filterFormData(nextAllFields, fields),
    });
  };

  public composeInstrumentInfo = modalFormData => {
    const instrumentInfoFields = ['multiplier', 'name', 'exchange', 'maturity'];
    let instrumentInfoSomeFields = ['multiplier', 'name', 'exchange', 'maturity'];
    if (modalFormData.instrumentType === 'INDEX') {
      instrumentInfoSomeFields = ['name', 'exchange'];
    }
    const params = {
      ..._.omit(modalFormData, instrumentInfoFields),
      instrumentInfo: this.omitNull(_.pick(modalFormData, instrumentInfoSomeFields)),
    };
    return this.omitNull(params);
  };

  public omitNull = obj => _.omitBy(obj, val => val === null);

  public onCreate = async () => {
    const rsp = await this.$form.validate();
    if (rsp.error) return;
    const createFormData = Form2.getFieldsValue(this.state.createFormData);
    const { error } = await mktInstrumentCreate(this.composeInstrumentInfo(createFormData));
    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');
    this.setState({
      createVisible: false,
      createFormData: {},
      createFormControls: createFormControls({}, 'create'),
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
    this.fetchTable({ current: 1, pageSize: 10 });
  };

  public onSearchFormChange = (props, fields, allFields) => {
    const changed = Form2.getFieldsValue(fields);
    const formData = Form2.getFieldsValue(allFields);
    const searchFormData =
      Object.keys(changed)[0] === 'assetClass'
        ? {
            ..._.pick(formData, ['instrumentIds']),
            ...changed,
          }
        : formData;
    this.setState({
      searchFormData: Form2.createFields(searchFormData),
    });
  };

  public onPaginationChange = (current, pageSize) => {
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public switchModal = () => {
    this.setState({
      createVisible: !this.state.createVisible,
      createFormData: {},
      createFormControls: createFormControls({}, 'create'),
    });
  };

  public onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper back={true}>
        <Form2
          columns={searchFormControls()}
          dataSource={this.state.searchFormData}
          layout={'inline'}
          onSubmitButtonClick={this.onSearch}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onSearchFormChange}
          submitText={'查询'}
        />
        <Divider />
        <Button style={{ marginBottom: VERTICAL_GUTTER }} type="primary" onClick={this.switchModal}>
          新建标的物
        </Button>
        <Table
          rowKey="instrumentId"
          columns={TABLE_COL_DEFS(this.fetchTable)}
          loading={this.state.loading}
          dataSource={this.state.tableDataSource}
          pagination={{
            ...this.state.pagination,
            total: this.state.total,
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: this.onPaginationChange,
          }}
        />
        <Modal
          visible={this.state.createVisible}
          onOk={this.onCreate}
          onCancel={this.switchModal}
          title={'新建标的物'}
        >
          <Form2
            ref={node => (this.$form = node)}
            columns={this.state.createFormControls}
            dataSource={this.state.createFormData}
            onFieldsChange={this.onCreateFormChange}
            footer={false}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementMarketManagement;
