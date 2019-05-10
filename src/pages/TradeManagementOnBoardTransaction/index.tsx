import { BIG_NUMBER_CONFIG } from '@/constants/common';
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  mktInstrumentInfo,
  mktInstrumentSearch,
  mktInstrumentWhitelistSearch,
  mktQuotesListPaged,
} from '@/services/market-data-service';
import {
  downloadUrl,
  exeTradeRecordSave,
  queryDetail,
  querySummary,
  queryTradeRecord,
  uploadUrl,
} from '@/services/onBoardTransaction';
import { Button, message, Modal, Radio, Tabs, Table, Divider } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { CREATE_FORM_CONTROLS, generateColumns } from './constants.tsx';

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const reg = /^[+-]?\d+\.?\d*$/;

class TradeManagementOnBoardTansaction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      flowData: [],
      positionData: [],
      formItems: [],
      instrumentIds: [],
      positionMode: 'detail',
      createFormVisible: false,
      createModalDataSource: {
        dealTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      },
      searchFormDataFlow: { date: [moment().subtract(1, 'days'), moment()] },
      searchFormDataPosition: { searchDate: moment().subtract(1, 'days') },
    };
  }

  public componentDidMount() {
    this.queryInstrumentId();
    this.queryRecords();
  }

  public queryInstrumentId = async () => {
    const ids = await mktInstrumentSearch({
      instrumentIdPart: '',
    });
    if (ids.error) {
      return;
    }
    const data = (ids && ids.data) || [];
    this.setState({
      instrumentIds: data,
    });
  };

  public queryRecords = async () => {
    const data = { ...this.state.searchFormDataFlow };
    const params = {
      instrumentIds: data.instrumentId,
      startTime: `${data.date[0].format('YYYY-MM-DD')}T00:00:00`,
      endTime: `${data.date[1].format('YYYY-MM-DD')}T23:59:59`,
    };
    this.fetchData(params, 'flow');
  };

  public queryDetail = async () => {
    const data = { ...this.state.searchFormDataPosition };
    const params = {
      searchDate: data.searchDate.format('YYYY-MM-DD'),
    };
    this.fetchData(params, 'position', 'detail');
  };

  public querySummary = async () => {
    const data = { ...this.state.searchFormDataPosition };
    const params = {
      searchDate: data.searchDate.format('YYYY-MM-DD'),
    };
    this.fetchData(params, 'position', 'summary');
  };

  public fetchData = async (params, type, positionMode) => {
    const isFlow = type === 'flow';

    this.setState({
      loading: true,
    });
    const executeMethod = isFlow
      ? queryTradeRecord
      : positionMode === 'detail'
      ? queryDetail
      : querySummary;
    const list = await executeMethod({
      ...params,
    });
    if (list.error) {
      this.setState({
        loading: false,
      });
    }
    let data = (list && list.data) || [];

    data = await this.injectMarketValue(data);

    const finalData = data.map(d => {
      const obj = { ...d };
      if (isFlow) {
        obj.openClose = obj.openClose
          ? obj.openClose.toLowerCase() === 'open'
            ? '开'
            : '平'
          : '-';
        obj.direction = obj.direction
          ? obj.direction.toLowerCase() === 'buyer'
            ? '买'
            : '卖'
          : '-';
        obj.dealTime = obj.dealTime ? moment(obj.dealTime).format('YYYY-MM-DD HH:mm:ss') : '-';
      }
      return obj;
    });

    if (isFlow) {
      finalData.sort((a, b) => {
        const dealTime = moment(a.dealTime).valueOf() - moment(b.dealTime).valueOf();
        if (dealTime > 0) {
          return -1;
        } else if (dealTime < 0) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (!isFlow && positionMode === 'summary') {
      finalData.sort((a, b) => {
        const aStr = a.instrumentId;
        const bStr = b.instrumentId;
        return aStr.localeCompare(bStr);
      });
    } else {
      finalData.sort((a, b) => {
        const aStr = a.bookId + a.instrumentId;
        const bStr = b.bookId + b.instrumentId;
        return aStr.localeCompare(bStr);
      });
    }

    const nextState = isFlow ? { flowData: finalData } : { positionData: finalData };
    if (isFlow) {
      this.originFlowData = data;
    } else {
      this.originPositionData = data;
    }
    this.setState({
      loading: false,
      ...nextState,
    });
  };

  public injectMarketValue = async finalData => {
    const { data = {}, error } = await mktQuotesListPaged({
      instrumentIds: finalData.map(item => item.instrumentId),
    });

    if (error) return finalData;

    const { page = [] } = data;

    return finalData.map(item => {
      const findItem = page.find(iitem => iitem.instrumentId === item.instrumentId);
      if (findItem) {
        const {
          longPosition = 0,
          shortPosition = 0,
          historySellAmount = 0,
          historyBuyAmount = 0,
        } = item;
        const { last = 0, multiplier = 1 } = findItem;
        const marketValue = new BigNumber(new BigNumber(longPosition).minus(shortPosition))
          .multipliedBy(last)
          .multipliedBy(multiplier)
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber();
        const totalPnl = new BigNumber(marketValue)
          .plus(historySellAmount)
          .minus(historyBuyAmount)
          .toNumber();
        return {
          ...item,
          marketValue,
          totalPnl,
        };
      }
      return item;
    });
  };

  public generateSummary = data => {
    const obj = {};
    const plusItems = [
      'netPosition',
      'historyBuyAmount',
      'historySellAmount',
      'shortPosition',
      'totalPnl',
    ];
    data.forEach(d => {
      const id = d.instrumentId;
      const target = obj[id];
      if (target) {
        plusItems.forEach(item => {
          let tValue = target[item];
          let dValue = d[item];
          tValue = reg.test(tValue) ? parseFloat(tValue) : 0;
          dValue = reg.test(dValue) ? parseFloat(dValue) : 0;
          target[item] = tValue + dValue;
        });
      } else {
        obj[id] = { ...d };
      }
    });

    const keys = Object.keys(obj);
    const finalData = keys.map(key => {
      const value = obj[key];
      return value;
    });
    return finalData;
  };

  public formatFormItems = () => {
    const uploadAttachData = {
      url: uploadUrl,
      mimeTypes: ['CSV'],
      mimeInfos: ['text/csv', 'application/vnd.ms-excel'],
      uploadData: {
        method: 'exeTradeRecordUpload',
        params: '{}',
      },
    };
    const documentUp = {
      type: 'upload',
      label: '文件上传',
      property: 'document',
      required: true,
      marginTop: 30,
      attachData: uploadAttachData,
    };
    return [documentUp];
  };

  public hideModal = () => {
    this.editDate = {};
    this.setState({
      modalVisible: false,
      formItems: [],
      modalLoading: false,
    });
  };

  public showModal = () => {
    this.setState({
      modalVisible: true,
      modalTitle: '导入场内流水',
      formItems: this.formatFormItems(),
    });
  };

  public changeTab = tab => {
    const type = tab === '1' ? 'flow' : 'position';
    const { positionMode } = this.state;
    if (type === 'position') {
      if (positionMode === 'detail') {
        this.queryDetail();
      } else {
        this.querySummary();
      }
    } else {
      this.queryRecords();
    }
  };

  public changePosition = e => {
    const { value } = e.target;
    this.setState({
      positionMode: value === 'a' ? 'detail' : 'summary',
    });
    value === 'a' ? this.queryDetail() : this.querySummary();
  };

  public handleFormData = action => {
    if (action === 'uploading') {
      this.setState({
        modalLoading: true,
      });
    }
    if (action === 'failed') {
      this.setState({
        modalLoading: false,
      });
    }
    if (action === 'success') {
      this.hideModal();
    }
  };

  public createFormModal = () => {
    this.setState({
      createFormVisible: true,
    });
  };

  public hideCreateForm = () => {
    this.setState({
      createFormVisible: false,
    });
  };

  public handleCreateForm = async () => {
    this.setState({
      createFormVisible: false,
    });
    const { createModalDataSource } = this.state;
    const formatValues = _.mapValues(createModalDataSource, val => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DDTHH:mm:ss');
      }
      return val;
    });
    const mktInstrumentInfoRef = await mktInstrumentInfo({
      instrumentId: formatValues.instrumentId,
    });
    if (mktInstrumentInfoRef.error) return;
    const { error, data } = await exeTradeRecordSave({
      ...formatValues,
      multiplier: mktInstrumentInfoRef.data.instrumentInfo.multiplier,
    });
    if (error) {
      message.error('新建失败');
      return;
    }
    message.success('新建成功');
    const { flowData } = this.state;

    const dataSwitch = _.mapValues(data, (item, key) => {
      if (key === 'direction') {
        if (item === 'BUYER') {
          return '买';
        }
        return '卖';
      }
      if (key === 'openClose') {
        if (item === 'OPEN') {
          return '开';
        }
        return '平';
      }
      return item;
    });
    this.setState({
      flowData: [...flowData, dataSwitch],
      createModalDataSource: {
        dealTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      },
    });
  };

  public onValueChange = params => {
    this.setState({
      createModalDataSource: params.values,
    });
  };

  public downloadFormModal = async () => {
    window.open(`${downloadUrl}position.csv`);
  };

  public handleFlowChange = value => {
    this.setState({
      searchFormDataFlow: value.values,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormDataFlow: { date: [moment().subtract(1, 'days'), moment()] },
      },
      () => {
        this.queryRecords();
      }
    );
  };

  public onResetPosition = () => {
    this.setState(
      {
        searchFormDataPosition: { searchDate: moment().subtract(1, 'days') },
      },
      () => {
        this.state.positionMode === 'detail' ? this.queryDetail() : this.querySummary();
      }
    );
  };

  public handlePositionChange = value => {
    this.setState({
      searchFormDataPosition: value.values,
    });
  };

  public render() {
    const {
      modalTitle,
      modalVisible,
      formItems,
      modalLoading,
      loading,
      instrumentIds,
      positionMode,
      createFormVisible,
      createModalDataSource,
      searchFormDataFlow,
      searchFormDataPosition,
      flowData,
      positionData,
    } = this.state;
    const flowColumns = generateColumns('flow');
    const detailColumns = generateColumns('detail');
    const summaryColumns = generateColumns('summary');
    return (
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane tab="场内流水" key="1">
            {/* <RowForm mode="flow" codeOptions={instrumentIds} handleQuery={this.queryRecords} /> */}
            <Form
              submitText="查询"
              dataSource={searchFormDataFlow}
              onSubmitButtonClick={this.queryRecords}
              onResetButtonClick={this.onReset}
              controls={[
                {
                  field: 'date',
                  control: {
                    label: '选择日期',
                  },
                  input: {
                    type: 'date',
                    range: 'range',
                  },
                },
                {
                  field: 'instrumentId',
                  control: {
                    label: '合约代码',
                  },
                  input: {
                    type: 'select',
                    mode: 'multiple',
                    allowClear: true,
                    placeholder: '请输入内容搜索',
                    options: async value => {
                      const { data, error } = await mktInstrumentWhitelistSearch({
                        instrumentIdPart: value,
                      });
                      if (error) return [];
                      return data.map(item => ({
                        label: item,
                        value: item,
                      }));
                    },
                  },
                },
              ]}
              onValueChange={this.handleFlowChange}
              layout="inline"
            />
            <div style={{ marginBottom: '20px' }}>
              <Button onClick={this.showModal} type="primary" style={{ marginTop: 10 }}>
                导入场内流水
              </Button>

              <Button onClick={this.createFormModal} type="default" style={{ marginTop: 10 }}>
                新建
              </Button>
            </div>
            <Divider type="horizontal" />
            <Table
              dataSource={flowData}
              columns={flowColumns}
              loading={loading}
              rowKey="uuid"
              scroll={flowData.length > 0 ? { x: '2000px' } : { x: false }}
            />
          </TabPane>
          <TabPane tab="场内持仓统计" key="2">
            <Form
              submitText="查询"
              dataSource={searchFormDataPosition}
              onSubmitButtonClick={positionMode === 'detail' ? this.queryDetail : this.querySummary}
              onResetButtonClick={this.onResetPosition}
              controls={[
                {
                  field: 'searchDate',
                  control: {
                    label: '选择日期',
                  },
                  input: {
                    type: 'date',
                    range: 'day',
                  },
                },
              ]}
              onValueChange={this.handlePositionChange}
              layout="inline"
            />
            <RadioGroup
              onChange={this.changePosition}
              defaultValue="a"
              style={{ marginBottom: '20px', marginTop: '20px' }}
            >
              <RadioButton value="a">按明细统计</RadioButton>
              <RadioButton value="b">按合约代码统计</RadioButton>
            </RadioGroup>
            {positionMode === 'detail' && (
              <Table
                dataSource={positionData}
                columns={detailColumns}
                loading={loading}
                rowKey="uuid"
                scroll={positionData.length > 0 ? { x: '2000px' } : { x: false }}
              />
            )}
            {positionMode === 'summary' && (
              <Table
                dataSource={positionData}
                columns={summaryColumns}
                loading={loading}
                scroll={positionData.length > 0 ? { x: '2000px' } : { x: false }}
                rowKey="uuid"
              />
            )}
          </TabPane>
        </Tabs>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          footer={[
            <Button key="back" type="primary" onClick={this.hideModal} loading={modalLoading}>
              {modalLoading ? '上传中' : '取消'}
            </Button>,
          ]}
        >
          {modalVisible && (
            <CommonForm
              data={formItems}
              handleStatusChange={this.handleFormData}
              uploadDisabled={modalLoading}
            />
          )}
          <p style={{ marginTop: '20px' }}>操作说明:</p>
          <p style={{ marginLeft: '20px' }}>1.仅支持导入.csv格式的文件</p>
          <p style={{ marginLeft: '20px' }}>
            2.导入模板下载:
            <a onClick={this.downloadFormModal}>导入场内流水模板.csv</a>
          </p>
        </Modal>
        <Modal
          visible={createFormVisible}
          onCancel={this.hideCreateForm}
          onOk={this.handleCreateForm}
          title="新建场内流水"
        >
          <Form
            controlNumberOneRow={1}
            footer={false}
            dataSource={createModalDataSource}
            onValueChange={this.onValueChange}
            controls={CREATE_FORM_CONTROLS}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementOnBoardTansaction;
