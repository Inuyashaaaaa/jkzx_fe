import Form from '@/design/components/Form';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import SourceTable from '@/lib/components/_SourceTable';
import { mktInstrumentSearch, mktQuotesListPaged } from '@/services/market-data-service';
import {
  exeTradeRecordSave,
  queryDetail,
  queryTradeRecord,
  uploadUrl,
  querySummary,
} from '@/services/onBoardTransaction';
import { Button, message, Modal, Radio, Tabs } from 'antd';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import RowForm from './components/RowForm';
import { CREATE_FORM_CONTROLS, generateColumns } from './constants.tsx';
import BigNumber from 'bignumber.js';
import { BIG_NUMBER_CONFIG } from '@/constants/common';

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const reg = /^[+-]?\d+\.?\d*$/;

function handleObjNumber(obj) {
  const keys = Object.keys(obj);
  keys.forEach(key => {
    const value = obj[key];
    if (reg.test(value)) {
      obj[key] = value.toLocaleString();
    }
  });
}

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
    };
  }

  componentDidMount() {
    this.queryInstrumentId();
  }

  queryInstrumentId = async () => {
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

  queryRecords = async data => {
    const params = {
      instrumentIds: data.code,
      startTime: `${data.startDate.format('YYYY-MM-DD')}T00:00:00`,
      endTime: `${data.endDate.format('YYYY-MM-DD')}T23:59:59`,
    };
    this.fetchData(params, 'flow');
  };

  queryDetail = async () => {
    // const params = {
    //   dealDate: data.date.format('YYYY-MM-DD'),
    // };
    const params = {};
    this.fetchData(params, 'position', 'detail');
  };

  querySummary = async () => {
    // const params = {
    //   dealDate: data.date.format('YYYY-MM-DD'),
    // };
    const params = {};
    this.fetchData(params, 'position', 'summary');
  };

  fetchData = async (params, type, positionMode) => {
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
      const obj = Object.assign({}, d);
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
      handleObjNumber(obj);
      return obj;
    });

    finalData.sort((a, b) => {
      const aStr = a.bookId + a.instrumentId;
      const bStr = b.bookId + b.instrumentId;
      return aStr.localeCompare(bStr);
    });

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

  injectMarketValue = async finalData => {
    const { data = {}, error } = await mktQuotesListPaged({
      instrumentIds: finalData.map(item => item.instrumentId),
    });

    if (error) return finalData;

    const { page = [] } = data;

    return finalData.map(item => {
      const findItem = page.find(iitem => iitem.instrumentId === item.instrumentId);
      if (findItem) {
        const { longPosition = 0, shortPosition = 0 } = item;
        const { last = 0, multiplier = 1 } = findItem;
        return {
          ...item,
          marketValue: new BigNumber(new BigNumber(longPosition).minus(shortPosition))
            .multipliedBy(last)
            .multipliedBy(multiplier)
            .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
            .toNumber(),
        };
      }
      return item;
    });
  };

  generateSummary = data => {
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
        obj[id] = Object.assign({}, d);
      }
    });

    // return Object.values(obj).map(value => {
    //   handleObjNumber(value);
    //   return value;
    // });
    const keys = Object.keys(obj);
    const finalData = keys.map(key => {
      const value = obj[key];
      handleObjNumber(value);
      return value;
    });
    return finalData;
  };

  formatFormItems = () => {
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

  hideModal = () => {
    this.editDate = {};
    this.setState({
      modalVisible: false,
      formItems: [],
      modalLoading: false,
    });
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
      modalTitle: '导入场内流水',
      formItems: this.formatFormItems(),
    });
  };

  changeTab = tab => {
    const type = tab === '1' ? 'flow' : 'position';
    const { positionMode } = this.state;
    if (type === 'position') {
      if (positionMode === 'detail') {
        this.queryDetail();
      } else {
        this.querySummary();
      }
    }
  };

  changePosition = e => {
    const { value } = e.target;
    this.setState({
      positionMode: value === 'a' ? 'detail' : 'summary',
    });
    value === 'a' ? this.queryDetail() : this.querySummary();
  };

  handleFormData = action => {
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

  createFormModal = () => {
    this.setState({
      createFormVisible: true,
    });
  };

  hideCreateForm = () => {
    this.setState({
      createFormVisible: false,
    });
  };

  handleCreateForm = async () => {
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
    const { error, data } = await exeTradeRecordSave({
      ...formatValues,
      multiplier: 1,
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

  onValueChange = params => {
    this.setState({
      createModalDataSource: params.values,
    });
  };

  render() {
    const {
      modalTitle,
      modalVisible,
      formItems,
      modalLoading,
      flowData,
      positionData,
      loading,
      instrumentIds,
      positionMode,
      createFormVisible,
      createModalDataSource,
    } = this.state;
    const flowColumns = generateColumns('flow');
    const detailColumns = generateColumns('detail');
    const summaryColumns = generateColumns('summary');
    return (
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane tab="场内流水" key="1">
            <RowForm mode="flow" codeOptions={instrumentIds} handleQuery={this.queryRecords} />
            <div>
              <Button onClick={this.showModal} type="primary" style={{ marginTop: 10 }}>
                导入场内流水
              </Button>
              <Button onClick={this.createFormModal} type="default" style={{ marginTop: 10 }}>
                新建
              </Button>
            </div>
            <SourceTable
              loading={loading}
              searchable={false}
              removeable={false}
              saveDisabled
              rowKey="uuid"
              dataSource={flowData}
              tableColumnDefs={flowColumns}
              tableProps={{
                autoSizeColumnsToFit: true,
              }}
            />
          </TabPane>
          <TabPane tab="场内持仓统计" key="2">
            {/* <RowForm mode="position" handleQuery={this.queryPositions} /> */}
            <RadioGroup onChange={this.changePosition} defaultValue="a">
              <RadioButton value="a">按明细统计</RadioButton>
              <RadioButton value="b">按合约代码统计</RadioButton>
            </RadioGroup>
            {positionMode === 'detail' && (
              <SourceTable
                loading={loading}
                searchable={false}
                removeable={false}
                saveDisabled
                rowKey="uuid"
                dataSource={positionData}
                tableColumnDefs={detailColumns}
                tableProps={{
                  autoSizeColumnsToFit: true,
                }}
              />
            )}
            {positionMode === 'summary' && (
              <SourceTable
                loading={loading}
                searchable={false}
                removeable={false}
                saveDisabled
                rowKey="uuid"
                dataSource={positionData}
                tableColumnDefs={summaryColumns}
                tableProps={{
                  autoSizeColumnsToFit: true,
                }}
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
