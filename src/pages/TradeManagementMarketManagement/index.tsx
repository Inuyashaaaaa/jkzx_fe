import React, { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Button, Divider, Icon, Modal, Row, Tabs, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

import { CLOSE_FORM_CONTROLS, columns, INTRADAY_FORM_CONTROLS } from './constants';
import { PAGE_SIZE } from '@/constants/component';
import { Form2, Select, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import {
  mktInstrumentSearch,
  mktQuoteSave,
  mktQuotesListPaged,
} from '@/services/market-data-service';
import { getMoment } from '@/tools';

const { TabPane } = Tabs;

class TradeManagementMarketManagement extends PureComponent {
  public $intradayForm: Form2 = null;

  public $closeForm: Form2 = null;

  public clean = null;

  public state = {
    lastUpdateTime: '',
    searchFormData: {},
    tableDataSource: [],
    pagination: {
      current: 1,
      pageSize: PAGE_SIZE,
    },
    total: 0,
    loading: false,
    visible: false,
    activeKey: 'intraday',
    intradayFormData: { valuationDate: Form2.createField(moment()) },
    closeFormData: { valuationDate: Form2.createField(moment()) },
    confirmLoading: false,
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
        this.fetchTable(true);
      },
    );
  };

  public componentDidMount = () => {
    this.clean = setInterval(() => {
      this.setState({
        lastUpdateTime: moment().format('HH:mm:ss'),
      });
      this.fetchTable(false);
    }, 1000 * 30);

    this.fetchTable(true);
  };

  public componentWillUnmount = () => {
    if (this.clean) {
      clearInterval(this.clean);
    }
  };

  public fetchTable = loading => {
    const { pagination } = this.state;
    this.setState({
      lastUpdateTime: moment().format('HH:mm:ss'),
      loading,
    });
    return mktQuotesListPaged({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      ...Form2.getFieldsValue(this.state.searchFormData),
    }).then(result => {
      this.setState({
        loading: false,
      });
      if (result.error) return;
      this.setState({
        tableDataSource: result.data.page,
        total: result.data.totalCount,
      });
    });
  };

  public handleMarketBtnClick = () => {
    this.setState({
      visible: true,
    });
  };

  public onSearchFormChange = event => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: PAGE_SIZE,
        },
      },
      () => {
        this.fetchTable(true);
      },
    );
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
        pagination: {
          current: 1,
          pageSize: PAGE_SIZE,
        },
      },
      () => {
        this.fetchTable(true);
      },
    );
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public showModal = () => {
    this.setState({ visible: false });
  };

  public handleParams = instance => {
    const formData =
      instance === 'intraday' ? this.state.intradayFormData : this.state.closeFormData;
    const quoteData = _.omit(formData, ['instrumentId', 'valuationDate']);
    const normalData = _.pick(formData, ['instrumentId', 'valuationDate']);
    return {
      instance,
      ..._.mapValues(Form2.getFieldsValue(normalData), (value, key) => {
        if (key === 'valuationDate') {
          return getMoment(value).format('YYYY-MM-DD');
        }
        return value;
      }),
      quote: {
        ...Form2.getFieldsValue(quoteData),
      },
    };
  };

  public handleSaveMarket = async () => {
    const instance = this.state.activeKey;
    const form = instance === 'intraday' ? this.$intradayForm : this.$closeForm;
    const validateRsp = await form.validate();
    if (validateRsp.error) return;
    const params = this.handleParams(instance);
    this.setState({ confirmLoading: true });
    const { error, data } = await mktQuoteSave(params);
    this.setState({ confirmLoading: false });
    if (error) return;
    this.setState({
      visible: false,
      intradayFormData: { valuationDate: Form2.createField(moment()) },
      closeFormData: { valuationDate: Form2.createField(moment()) },
    });
    this.fetchTable(true);
  };

  public handleTabChange = activeKey => {
    this.setState({
      activeKey,
    });
  };

  public handleIntradayChange = (props, fields, allFields) => {
    this.setState({ intradayFormData: allFields });
  };

  public handleCloseChange = (props, fields, allFields) => {
    this.setState({ closeFormData: allFields });
  };

  public render() {
    return (
      <Page>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="查询"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.onSearchFormChange}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onFieldsChange}
          columns={[
            {
              title: '标的物列表',
              dataIndex: 'instrumentIds',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      fetchOptionsOnSearch
                      editing={editing}
                      style={{ minWidth: 180, maxWidth: 400 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      mode="multiple"
                      options={async (values: string = '') => {
                        const { data, error } = await mktInstrumentSearch({
                          instrumentIdPart: values,
                        });
                        if (error) return [];
                        return data.slice(0, 50).map(item => ({
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
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between" align="bottom">
          <Button type="primary" onClick={this.handleMarketBtnClick}>
            录入行情
          </Button>
          <span>
            {`最近刷新时间 ${this.state.lastUpdateTime}`}
            <Tooltip title="每隔30秒自动刷新行情" placement="topRight" arrowPointAtCenter>
              <Icon style={{ marginLeft: 4 }} type="info-circle" theme="twoTone" />
            </Tooltip>
          </span>
        </Row>
        <SmartTable
          dataSource={this.state.tableDataSource}
          columns={columns}
          pagination={{
            ...this.state.pagination,
            total: this.state.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: this.paginationChange,
          }}
          loading={this.state.loading}
          rowKey="instrumentId"
          scroll={this.state.tableDataSource ? { x: '1800px' } : { x: false }}
        />
        <Modal
          title="录入标的物行情"
          visible={this.state.visible}
          onOk={this.handleSaveMarket}
          onCancel={this.showModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Tabs onChange={this.handleTabChange} activeKey={this.state.activeKey}>
            <TabPane tab="日内" key="intraday">
              <Form2
                ref={node => {
                  this.$intradayForm = node;
                }}
                dataSource={this.state.intradayFormData}
                columns={INTRADAY_FORM_CONTROLS}
                footer={false}
                onFieldsChange={this.handleIntradayChange}
              />
            </TabPane>
            <TabPane tab="收盘" key="close">
              <Form2
                ref={node => {
                  this.$closeForm = node;
                }}
                dataSource={this.state.closeFormData}
                columns={CLOSE_FORM_CONTROLS}
                footer={false}
                onFieldsChange={this.handleCloseChange}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </Page>
    );
  }
}

export default TradeManagementMarketManagement;
