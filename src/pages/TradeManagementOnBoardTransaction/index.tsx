import Form from '@/containers/Form';
import Page from '@/containers/Page';
import { BIG_NUMBER_CONFIG } from '@/constants/common';
import {
  mktInstrumentInfo,
  mktInstrumentSearch,
  excListAllInstrumentsInTradeRecords,
  mktQuotesListPaged,
} from '@/services/market-data-service';
import {
  downloadUrl,
  exeTradeRecordSave,
  queryDetail,
  querySummary,
  queryPortfolio,
  queryTradeRecord,
  uploadUrl,
} from '@/services/onBoardTransaction';
import { Button, Divider, message, Modal, Radio, Row, Table, Tabs } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { useState, useEffect, memo } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { CREATE_FORM_CONTROLS, generateColumns } from './constants';
import TabHeader from '@/containers/TabHeader';
import { SmartTable } from '@/containers';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const TradeManagementOnBoardTansaction = props => {
  const [loading, setLoading] = useState(false);
  const [flowData, setFlowData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [formItems, setFormItems] = useState([]);
  const [positionMode, setPositionMode] = useState('detail');
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createModalDataSource, setCreateModalDataSource] = useState({
    dealTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const [searchFormDataFlow, setSearchFormDataFlow] = useState<any>({
    date: [moment().subtract(1, 'days'), moment()],
  });
  const [searchFormDataPosition, setSearchFormDataPosition] = useState({
    searchDate: moment().subtract(1, 'days'),
  });
  const [activeKey, setActiveKey] = useState('flow');
  const [modalTitle, setModalTitle] = useState();
  const [modalLoading, setModalLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    queryFlowData();
  }, []);

  const queryAndInjectMarketData = async (queryMethod, params) => {
    const list = await queryMethod({ ...params });
    if (list.error) {
      setLoading(false);
    }
    const data = (list && list.data) || [];
    return injectMarketValue(data);
  };

  const queryFlowData = async () => {
    const params = {
      instrumentIds: searchFormDataFlow.instrumentId,
      startTime: `${searchFormDataFlow.date[0].format('YYYY-MM-DD')}T00:00:00`,
      endTime: `${searchFormDataFlow.date[1].format('YYYY-MM-DD')}T23:59:59`,
    };

    setLoading(true);
    const data = await queryAndInjectMarketData(queryTradeRecord, params);

    const finalData = data.map(d => {
      const obj = { ...d };
      obj.openClose = obj.openClose ? (obj.openClose.toLowerCase() === 'open' ? '开' : '平') : '-';
      obj.direction = obj.direction ? (obj.direction.toLowerCase() === 'buyer' ? '买' : '卖') : '-';
      obj.dealTime = obj.dealTime ? moment(obj.dealTime).format('YYYY-MM-DD HH:mm:ss') : '-';
      return obj;
    });

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
    setFlowData(finalData);
    setLoading(false);
  };

  const sortBy = (data, field) => {
    data.sort((a, b) => {
      const aStr = a[field] + a.instrumentId;
      const bStr = b[field] + a.instrumentId;
      return aStr.localeCompare(bStr);
    });
    return data;
  };

  const queryPositionData = async (mode?) => {
    const actualMode = mode ? mode : positionMode;
    const params = {
      searchDate: searchFormDataPosition.searchDate.format('YYYY-MM-DD'),
    };
    setLoading(true);

    let data;
    if (actualMode === 'summary') {
      data = await queryAndInjectMarketData(querySummary, params);
      data = sortBy(data, 'instrumentId');
    } else if (actualMode === 'detail') {
      data = await queryAndInjectMarketData(queryDetail, params);
      data = sortBy(data, 'bookId');
    } else if (actualMode === 'portfolio') {
      data = await queryAndInjectMarketData(queryPortfolio, params);
      data = sortBy(data, 'portfolioName');
      data = data.filter(v => v.portfolioName);
    }
    setPositionData(data);
    setLoading(false);
  };

  const injectMarketValue = async finalData => {
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

  const formatFormItems = () => {
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

  const hideModal = () => {
    setModalVisible(false);
    setFormItems([]);
    setModalLoading(false);
  };

  const showModal = () => {
    setModalVisible(true);
    setModalTitle('导入场内流水');
    setFormItems(formatFormItems());
  };

  const changeTab = tab => {
    setActiveKey(tab);
    if (tab === 'position') {
      setPositionMode('detail');
      queryPositionData('detail');
    } else {
      queryFlowData();
    }
  };

  const changePosition = e => {
    const { value } = e.target;
    setPositionMode(value);
    queryPositionData(value);
  };

  const handleFormData = action => {
    if (action === 'uploading') {
      setModalLoading(true);
    }
    if (action === 'failed') {
      setModalLoading(false);
    }
    if (action === 'success') {
      hideModal();
    }
  };

  const createFormModal = () => {
    setCreateFormVisible(true);
  };

  const hideCreateForm = () => {
    setCreateFormVisible(false);
  };

  const handleCreateForm = async () => {
    setCreateFormVisible(false);
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
    setFlowData([...flowData, dataSwitch]);
    setCreateModalDataSource({
      dealTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
    });
  };

  const onValueChange = params => {
    setCreateModalDataSource(params.values);
  };

  const downloadFormModal = async () => {
    window.open(`${downloadUrl}position.csv`);
  };

  const handleFlowChange = value => {
    setSearchFormDataFlow(value.values);
  };

  const onReset = () => {
    setSearchFormDataFlow({ date: [moment().subtract(1, 'days'), moment()] });
    queryFlowData();
  };

  const onResetPosition = () => {
    setSearchFormDataPosition({ searchDate: moment().subtract(1, 'days') });
    queryPositionData();
  };

  const handlePositionChange = value => {
    setSearchFormDataPosition(value.values);
  };

  const flowColumns = generateColumns('flow');
  const detailColumns = generateColumns('detail');
  const summaryColumns = generateColumns('summary');
  const portfolioColumns = generateColumns('portfolio');
  return (
    <Page
      footer={
        <TabHeader
          activeKey={activeKey}
          onChange={changeTab}
          tabList={[{ key: 'flow', tab: '场内流水' }, { key: 'position', tab: '场内持仓统计' }]}
        />
      }
    >
      {activeKey === 'flow' && (
        <>
          <Form
            submitText="查询"
            dataSource={searchFormDataFlow}
            onSubmitButtonClick={queryFlowData}
            onResetButtonClick={onReset}
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
                    const { data, error } = await excListAllInstrumentsInTradeRecords({
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
            onValueChange={handleFlowChange}
            layout="inline"
          />
          <Divider type="horizontal" />
          <div style={{ marginBottom: '20px' }}>
            <Button onClick={showModal} type="primary">
              导入场内流水
            </Button>

            <Button onClick={createFormModal} type="default">
              新建
            </Button>
          </div>
          <SmartTable
            dataSource={flowData}
            columns={flowColumns}
            loading={loading}
            rowKey="uuid"
            scroll={flowData.length > 0 ? { x: '2000px' } : { x: false }}
          />
        </>
      )}
      {activeKey === 'position' && (
        <>
          <Form
            submitText="查询"
            dataSource={searchFormDataPosition}
            onSubmitButtonClick={() => queryPositionData()}
            onResetButtonClick={onResetPosition}
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
            onValueChange={handlePositionChange}
            layout="inline"
          />
          <Divider type="horizontal" />
          <Row type="flex" justify="end">
            <RadioGroup
              onChange={changePosition}
              defaultValue="detail"
              style={{ marginBottom: '20px' }}
            >
              <RadioButton value="detail">按明细统计</RadioButton>
              <RadioButton value="summary">按合约代码统计</RadioButton>
              <RadioButton value="portfolio">按投资组合统计</RadioButton>
            </RadioGroup>
          </Row>
          {positionMode === 'detail' && (
            <SmartTable
              dataSource={positionData}
              columns={detailColumns}
              loading={loading}
              rowKey="uuid"
              scroll={positionData.length > 0 ? { x: '2000px' } : { x: false }}
            />
          )}
          {positionMode === 'summary' && (
            <SmartTable
              dataSource={positionData}
              columns={summaryColumns}
              loading={loading}
              scroll={positionData.length > 0 ? { x: '2000px' } : { x: false }}
              rowKey="uuid"
            />
          )}
          {positionMode === 'portfolio' && (
            <SmartTable
              dataSource={positionData}
              columns={portfolioColumns}
              loading={loading}
              scroll={positionData.length > 0 ? { x: '2000px' } : { x: false }}
              rowKey="uuid"
            />
          )}
        </>
      )}
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onCancel={hideModal}
        onOk={hideModal}
        footer={[
          <Button key="back" type="primary" onClick={hideModal} loading={modalLoading}>
            {modalLoading ? '上传中' : '取消'}
          </Button>,
        ]}
      >
        {modalVisible && (
          <CommonForm
            data={formItems}
            handleStatusChange={handleFormData}
            uploadDisabled={modalLoading}
          />
        )}
        <p style={{ marginTop: '20px' }}>操作说明:</p>
        <p style={{ marginLeft: '20px' }}>1.仅支持导入.csv格式的文件</p>
        <p style={{ marginLeft: '20px' }}>
          2.导入模板下载:
          <a onClick={downloadFormModal}>导入场内流水模板.csv</a>
        </p>
      </Modal>
      <Modal
        visible={createFormVisible}
        onCancel={hideCreateForm}
        onOk={handleCreateForm}
        title="新建场内流水"
      >
        <Form
          controlNumberOneRow={1}
          footer={false}
          dataSource={createModalDataSource}
          onValueChange={onValueChange}
          controls={CREATE_FORM_CONTROLS}
        />
      </Modal>
    </Page>
  );
};

export default memo(TradeManagementOnBoardTansaction);
