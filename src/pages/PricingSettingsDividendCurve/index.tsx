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
import { Button, Col, Divider, message, Modal, notification, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { INSERT_FORM_CONTROLS, SEARCH_FORM_CONTROLS, TABLE_COL_DEFS } from './constants';

const GROUP_KEY = 'modelName';

const MARKET_KEY = 'underlyer';

class PricingSettingsDividendCurve extends PureComponent {
  public $form: Form2 = null;

  public $insertForm: Form2 = null;

  public state = {
    saveLoading: false,
    tableDataSource: [],
    searchFormData: {},
    groups: [],
    tableLoading: false,
    visible: false,
    insertFormData: {},
  };

  public sortDataSource = dataSource => {
    return dataSource
      .map(record => {
        return {
          days: (TRNORS_OPTS.find(item => item.name === record.tenor.value) || {}).days,
          record,
        };
      })
      .sort((a, b) => a.days - b.days)
      .map(item => item.record);
  };

  public handleTableData = item => {
    return Form2.createFields(item, ['id']);
  };

  public fetchTableData = async searchFormValues => {
    this.setState({
      tableLoading: true,
    });

    const rsp = await queryModelDividendCurve(searchFormValues, true);

    const { error } = rsp;
    let { data } = rsp;

    this.setState({
      tableLoading: false,
    });

    if (error) {
      const { message } = error;
      if (message.includes('failed to find model data for ')) {
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
          message: `请求失败`,
          description: message,
        });
        return;
      }
    }

    const { dataSource } = data;

    const tableDataSource = dataSource.map(item => this.handleTableData(item));
    this.setState({ tableDataSource: this.sortDataSource(tableDataSource) });
  };

  public saveTableData = async () => {
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
    // const rsp = await queryModelName({
    //   modelType: 'dividend_curve',
    //   underlyer,
    // });

    // const { error } = rsp;
    // let { data } = rsp;

    // if (error) return;

    // if (!data || data.length === 0) {
    //   const alls = await queryAllModelName();
    //   if (alls.error) return;
    //   data = alls.data.map(item => {
    //     return {
    //       modelName: item,
    //     };
    //   });
    // }

    const { error, data } = await queryAllModelName();
    if (error) return;
    const dataGroup = data.map(item => {
      return {
        modelName: item,
      };
    });

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
      })
    );
  };

  public onSearchFormFieldsChange = (props, fields, allFields) => {
    this.setState({
      searchFormData: {
        ...this.state.searchFormData,
        ...fields,
      },
    });
  };

  public onSearchFormChange = (props, values, allValues) => {
    if (values[GROUP_KEY]) {
      this.fetchTableData(allValues);
    }
  };

  public onRemove = event => {
    const clone = _.reject(this.state.tableDataSource, value => {
      return value.tenor.value === event.tenor.value;
    });

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
    this.setState({ visible: false });
  };

  public onInsertFormChange = (props, fields, allFields) => {
    this.setState({
      insertFormData: allFields,
    });
  };

  public handleCellValueChanged = params => {
    this.setState({
      tableDataSource: this.state.tableDataSource.map(item => {
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
              marketType={'dividendInstruments'}
              {...{
                onSelect: market => {
                  this.setState(
                    produce((state: any) => {
                      state.searchFormData[MARKET_KEY] = Form2.createField(market);
                      state.tableDataSource = [];
                      state.searchFormData[GROUP_KEY] = undefined;
                    }),
                    () => market && this.fetchGroup(market)
                  );
                },
              }}
            />
          </Col>
          <Col xs={24} sm={20}>
            <Form2
              ref={node => (this.$form = node)}
              layout="inline"
              footer={false}
              dataSource={this.state.searchFormData}
              columns={SEARCH_FORM_CONTROLS(this.state.groups)}
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
            ref={node => (this.$insertForm = node)}
            dataSource={this.state.insertFormData}
            columns={INSERT_FORM_CONTROLS(this.state.tableDataSource)}
            footer={false}
            onValuesChange={this.onInsertFormChange}
          />
        </Modal>
      </Page>
    );
  }
}

export default PricingSettingsDividendCurve;
