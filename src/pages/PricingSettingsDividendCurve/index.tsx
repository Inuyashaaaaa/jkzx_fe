/* eslint-disable no-param-reassign */
import { Button, Col, Divider, message, Modal, notification, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { VERTICAL_GUTTER } from '@/constants/global';
import { TRNORS_OPTS } from '@/constants/model';
import { Form2, Table2, SmartTable } from '@/containers';
import MarketSourceTable from '@/containers/MarketSourceTable';
import Page from '@/containers/Page';
import {
  queryAllModelName,
  queryModelDividendCurve,
  saveModelDividendCurve,
} from '@/services/model';
import { INSERT_FORM_CONTROLS, SEARCH_FORM_CONTROLS, TABLE_COL_DEFS, SEARCH_FORM } from './tools';
import { GROUP_KEY, INSTANCE_KEY, MARKET_KEY, OPERATION, TENOR_KEY } from './constants';

class PricingSettingsDividendCurve extends PureComponent {
  public $form: Form2 = null;

  public $insertForm: Form2 = null;

  public $table: Table2 = null;

  public state = {
    saveLoading: false,
    tableDataSource: [],
    searchFormData: {
      ...Form2.createFields({ [INSTANCE_KEY]: 'INTRADAY' }),
    },
    groups: [],
    tableLoading: false,
    visible: false,
    insertFormData: {},
  };

  public sortDataSource = dataSource =>
    dataSource
      .map(record => ({
        days: (TRNORS_OPTS.find(item => item.name === record.tenor.value) || {}).days,
        record,
      }))
      .sort((a, b) => a.days - b.days)
      .map(item => item.record);

  public handleTableData = item => Form2.createFields(item, ['id']);

  public fetchTableData = async () => {
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    this.setState({
      tableLoading: true,
    });

    const rsp = await queryModelDividendCurve(searchFormData, true);

    const { error } = rsp;
    let { data } = rsp;

    this.setState({
      tableLoading: false,
    });

    if (error) {
      if (error.message.includes('failed to find model data for ')) {
        data = {
          dataSource: [
            {
              expiry: null,
              quote: 0,
              tenor: '1D',
              use: true,
              id: uuidv4(),
            },
          ],
        };
      } else {
        notification.error({
          message: '请求失败',
          description: error.message,
        });
        return;
      }
    }

    const { dataSource } = data;

    const tableDataSource = dataSource.map(item => this.handleTableData(item));
    this.setState({ tableDataSource: this.sortDataSource(tableDataSource) });
  };

  public saveTableData = async () => {
    const res = await this.$table.validate();
    if (_.isArray(res) && res.some(value => value.errors)) {
      return;
    }
    const { tableDataSource, searchFormData } = this.state;
    this.setState({
      saveLoading: true,
    });
    const { error } = await saveModelDividendCurve({
      dataSource: tableDataSource.map(item => Form2.getFieldsValue(item)),
      ...Form2.getFieldsValue(searchFormData),
    });
    this.setState({
      saveLoading: false,
    });
    if (error) return;
    notification.success({
      message: '保存成功',
    });
  };

  public fetchGroup = async underlyer => {
    const { error, data } = await queryAllModelName();
    if (error) return;
    const dataGroup = data.map(item => ({
      modelName: item,
    }));

    this.setState(
      produce((state: any) => {
        state.searchFormData[GROUP_KEY] = undefined;
        state.groups = _.unionBy<any>(dataGroup, item => item.modelName).map(item => {
          const { modelName } = item;
          return {
            label: modelName,
            value: modelName,
          };
        });
      }),
    );
  };

  public onSearchFormFieldsChange = (props, fields, allFields) => {
    const { searchFormData } = this.state;
    this.setState({
      searchFormData: {
        ...searchFormData,
        ...fields,
      },
    });
  };

  public onSearchFormChange = (props, values, allFields) => {
    this.setState(
      {
        searchFormData: allFields,
      },
      () => {
        this.fetchTableData();
      },
    );
  };

  public onRemove = event => {
    const clone = _.reject(
      this.state.tableDataSource,
      value => value.tenor.value === event.tenor.value,
    );

    this.setState({
      tableDataSource: this.sortDataSource(clone),
    });

    message.success('删除成功');
  };

  public onConfirm = async () => {
    const validateRsp = await this.$insertForm.validate();
    if (validateRsp.error) return;
    const data = {
      ...this.state.insertFormData,
      id: uuidv4(),
      expiry: Form2.createField(null),
      use: Form2.createField(true),
    };
    const clone = _.concat(this.state.tableDataSource, data);
    this.setState({
      visible: false,
      tableDataSource: this.sortDataSource(clone),
      insertFormData: {},
    });

    message.success('插入成功');
  };

  public showModal = () => {
    this.setState({ visible: true, insertFormData: { quote: Form2.createField(0) } });
  };

  public onCancel = () => {
    this.setState({
      visible: false,
      insertFormData: {},
    });
  };

  public onInsertFormChange = (props, fields, allFields) => {
    const { insertFormData } = this.state;

    this.setState({
      insertFormData: {
        ...insertFormData,
        ...fields,
      },
    });
  };

  public handleCellValueChanged = params => {
    const { tableDataSource } = this.state;
    this.setState({
      tableDataSource: tableDataSource.map(item => {
        if (item.id === params.record.id) {
          return params.record;
        }
        return item;
      }),
    });
  };

  public render() {
    return (
      <Page>
        <Row gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <MarketSourceTable
              marketType="dividendInstruments"
              {...{
                onSelect: market => {
                  // this.setState(
                  //   produce((state: any) => {
                  //     state.searchFormData[MARKET_KEY] = Form2.createField(market);
                  //     state.tableDataSource = [];
                  //     state.searchFormData[GROUP_KEY] = undefined;
                  //   }),
                  //   () => market && this.fetchGroup(market)
                  // );
                  const { searchFormData } = this.state;
                  this.setState(
                    {
                      tableDataSource: [],
                      searchFormData: {
                        ...searchFormData,
                        ...Form2.createFields({
                          [MARKET_KEY]: market,
                          [GROUP_KEY]: undefined,
                        }),
                      },
                    },
                    () => {
                      if (market) {
                        this.fetchGroup(market);
                      }
                    },
                  );
                },
              }}
            />
          </Col>
          <Col xs={24} sm={20}>
            <Form2
              ref={node => {
                this.$form = node;
              }}
              layout="inline"
              submitText="搜索"
              submitButtonProps={{
                icon: 'search',
              }}
              onSubmitButtonClick={this.fetchTableData}
              resetable={false}
              // footer={false}
              dataSource={this.state.searchFormData}
              columns={SEARCH_FORM(this.state.groups, this.state.searchFormData)}
              // columns={SEARCH_FORM_CONTROLS(this.state.groups)}
              onValuesChange={this.onSearchFormChange}
              onFieldsChange={this.onSearchFormFieldsChange}
            />
            <Divider />
            <Button
              loading={this.state.saveLoading}
              type="primary"
              style={{ marginBottom: VERTICAL_GUTTER }}
              onClick={this.saveTableData}
            >
              保存
            </Button>
            <SmartTable
              ref={node => {
                this.$table = node;
              }}
              rowKey="id"
              pagination={false}
              loading={this.state.tableLoading}
              dataSource={this.state.tableDataSource}
              columns={TABLE_COL_DEFS(this.state.tableDataSource, this.onRemove, this.showModal)}
              onCellFieldsChange={this.handleCellValueChanged}
            />
          </Col>
        </Row>
        <Modal
          closable={false}
          onCancel={this.onCancel}
          onOk={this.onConfirm}
          maskClosable={false}
          visible={this.state.visible}
        >
          <Form2
            ref={node => {
              this.$insertForm = node;
            }}
            dataSource={this.state.insertFormData}
            columns={INSERT_FORM_CONTROLS(this.state.tableDataSource)}
            footer={false}
            onFieldsChange={this.onInsertFormChange}
          />
        </Modal>
      </Page>
    );
  }
}

export default PricingSettingsDividendCurve;
