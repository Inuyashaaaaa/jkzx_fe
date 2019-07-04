import {
  Alert,
  Button,
  Divider,
  Icon,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Upload,
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { BIG_NUMBER_CONFIG } from '@/constants/common';
import { Select, SmartTable } from '@/containers';
import Form from '@/containers/Form';
import Page from '@/containers/Page';
import TabHeader from '@/containers/TabHeader';
import {
  mktInstrumentInfo,
  mktQuotesListPaged,
  excListAllInstrumentsInTradeRecords,
} from '@/services/market-data-service';
import {
  downloadUrl,
  exeTradeRecordSave,
  queryDetail,
  queryPortfolio,
  querySummary,
  queryTradeRecord,
  uploadUrl,
} from '@/services/onBoardTransaction';
import {
  trdPortfolioListBySimilarPortfolioName,
  trdPortfolioRefresh,
} from '@/services/trade-service';
import { getToken } from '@/tools/authority';
import { CREATE_FORM_CONTROLS, generateColumns, resultTableFailureColumns } from './constants';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const TradeManagementOnBoardTansaction = props => {
  const [loading, setLoading] = useState(false);
  const [flowData, setFlowData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [positionMode, setPositionMode] = useState('detail');
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createModalDataSource, setCreateModalDataSource] = useState({
    dealTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const [searchFormDataFlow, setSearchFormDataFlow] = useState<any>({
    date: [moment().subtract(1, 'days'), moment()],
  });
  const [searchFormDataPosition, setSearchFormDataPosition] = useState({
    searchDate: moment(),
  });
  const [activeKey, setActiveKey] = useState('flow');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [uploadResultTable, setUploadResultTable] = useState([]);
  const [updatePortfolioModalVisible, setUpdatePortfolioModalVisible] = useState(false);
  const [portfolioSelected, setPortfolioSelected] = useState([]);
  const [tradeIdToUpdate, setTradeIdToUpdate] = useState([]);

  const sortBy = (data, field) => {
    data.sort((a, b) => {
      const aStr = a[field] + a.instrumentId;
      const bStr = b[field] + a.instrumentId;
      return aStr.localeCompare(bStr);
    });
    return data;
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

  const queryAndInjectMarketData = async (queryMethod, params) => {
    const list = await queryMethod({ ...params });
    if (list.error) {
      setLoading(false);
    }
    const data = (list && list.data) || [];
    return injectMarketValue(data);
  };

  const attachData = {
    url: uploadUrl,
    mimeTypes: ['CSV'],
    mimeInfos: ['text/csv', 'application/vnd.ms-excel'],
    uploadData: {
      method: 'exeTradeRecordUpload',
      params: '{}',
    },
  };

  const queryPositionData = async (mode?: string) => {
    const actualMode = mode || positionMode;
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

  const hideModal = () => {
    setModalVisible(false);
    setModalLoading(false);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const changePosition = e => {
    const { value } = e.target;
    setPositionMode(value);
    queryPositionData(value);
  };

  const checkFileType = (file, data) => {
    const infos = (data && data.mimeInfos) || [];
    const types = (data && data.mimeTypes) || [];
    if (infos.length === 0 || types.length === 0) {
      return true;
    }
    const type = (file && file.type) || '';
    if (infos.includes(type)) {
      setModalLoading(true);
      return true;
    }
    notification.error({
      message: `文件上传只支持${types.join(',')}类型`,
    });
    return false;
  };

  const onUploadStatusChanged = info => {
    if (info.file.status === 'done') {
      const resp = info.file.response;
      if (resp) {
        const failure = resp.diagnostics.map(v => {
          const fail = v.split('`');
          return {
            tradeId: fail[0],
            cause: fail[1],
          };
        });
        setUploadResultTable(failure);
      }
      setModalLoading(false);
      hideModal();
      if (_.get(resp, 'diagnostics.length') === 0) {
        notification.success({
          message: '成功录入所有交易',
        });
      } else {
        setResultModalVisible(true);
      }
    } else if (info.file.status === 'error') {
      notification.error({
        message: (info.file && info.file.error && info.file.error.message) || '模板上传失败',
      });
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
      multiplier: mktInstrumentInfoRef.data.instrumentInfo.multiplier || 1,
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

  const onResetPosition = () => {
    setSearchFormDataPosition({ searchDate: moment().subtract(1, 'days') });
    queryPositionData();
  };

  const handlePositionChange = value => {
    setSearchFormDataPosition(value.values);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const selected = selectedRows ? selectedRows.map(v => v.tradeId) : [];
      setTradeIdToUpdate(selected);
    },
  };

  const hideUpdatePortfolioModal = () => {
    setPortfolioSelected([]);
    setUpdatePortfolioModalVisible(false);
  };

  const onUpdatePortfolioButtonPressed = () => {
    if (tradeIdToUpdate.length === 0) {
      notification.info({ message: '请先勾选要修改的场内流水' });
      return;
    }
    setUpdatePortfolioModalVisible(true);
  };

  const flowColumns = generateColumns('flow');
  const detailColumns = generateColumns('detail');
  const summaryColumns = generateColumns('summary');
  const portfolioColumns = generateColumns('portfolio');

  const queryFlowData = useCallback(async () => {
    const params = {
      instrumentIds: searchFormDataFlow.instrumentId,
      startTime: `${searchFormDataFlow.date[0].format('YYYY-MM-DD')}T00:00:00`,
      endTime: `${searchFormDataFlow.date[1].format('YYYY-MM-DD')}T23:59:59`,
    };

    setLoading(true);
    const data = await queryAndInjectMarketData(queryTradeRecord, params);

    const finalData = data.map(d => {
      const obj = { ...d };

      const openCloseMap = {
        open: '开',
        close: '平',
      };

      const directionMap = {
        buyer: '买',
        seller: '卖',
      };

      obj.openClose = openCloseMap[_.toLower(obj.openClose)] || obj.openClose;
      obj.direction = directionMap[_.toLower(obj.direction)] || obj.direction;
      obj.dealTime = obj.dealTime
        ? moment(obj.dealTime).format('YYYY-MM-DD HH:mm:ss')
        : obj.dealTime;
      return obj;
    });

    finalData.sort((a, b) => {
      const dealTime = moment(a.dealTime).valueOf() - moment(b.dealTime).valueOf();
      if (dealTime > 0) {
        return -1;
      }
      if (dealTime < 0) {
        return 1;
      }
      return 0;
    });
    setFlowData(finalData);
    setLoading(false);
  });

  const onReset = () => {
    setSearchFormDataFlow({ date: [moment().subtract(1, 'days'), moment()] });
    queryFlowData();
  };

  const handleUpdatePortfolio = async () => {
    await trdPortfolioRefresh({
      portfolioNames: portfolioSelected,
      tradeIds: tradeIdToUpdate,
    });
    hideUpdatePortfolioModal();
    queryFlowData();
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

  useEffect(() => {
    queryFlowData();
  }, []);

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
              新建场内流水
            </Button>
            <Button onClick={onUpdatePortfolioButtonPressed} type="default">
              修改投资组合
            </Button>
          </div>
          <SmartTable
            rowSelection={rowSelection}
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
              <RadioButton value="detail">分交易簿统计</RadioButton>
              <RadioButton value="portfolio">分投资组合统计</RadioButton>
              <RadioButton value="summary">按合约代码汇总</RadioButton>
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
        title="导入场内流水"
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
          <div style={{ borderWidth: 0, borderColor: '#e8e8e8', borderStyle: 'solid' }}>
            <div style={{ textAlign: 'center', margin: '30px' }}>
              <div>
                <Upload
                  name="file"
                  showUploadList={modalLoading}
                  action={attachData.url}
                  headers={{
                    Authorization: `Bearer ${getToken()}`,
                  }}
                  data={attachData.uploadData}
                  beforeUpload={file => checkFileType(file, attachData)}
                  onChange={info => onUploadStatusChanged(info)}
                >
                  <Button disabled={false}>
                    <Icon type="upload" />
                    上传文件
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
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
      <Modal
        title="批量导入结果"
        width={800}
        visible={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false);
        }}
        footer={[
          <Button key="back" onClick={() => setResultModalVisible(false)}>
            好的
          </Button>,
        ]}
      >
        <SmartTable
          dataSource={uploadResultTable}
          columns={resultTableFailureColumns}
          loading={loading}
          rowKey="uuid"
        />
      </Modal>
      <Modal
        title="修改投资组合"
        visible={updatePortfolioModalVisible}
        onCancel={hideUpdatePortfolioModal}
        onOk={handleUpdatePortfolio}
      >
        <FormItem label="请选择投资组合" labelCol={{ span: 6 }} wrapperCol={{ span: 3 }}>
          <Select
            value={portfolioSelected}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            style={{ width: 320 }}
            fetchOptionsOnSearch
            mode="multiple"
            onChange={v => setPortfolioSelected(v)}
            options={async (value: string = '') => {
              const { data, error } = await trdPortfolioListBySimilarPortfolioName({
                similarPortfolioName: value,
              });
              if (error) return [];
              return data.map(item => ({
                label: item,
                value: item,
              }));
            }}
          />
        </FormItem>
        <Alert
          message="注意"
          description={
            <>
              <p>1.修改投资组合会覆盖选中流水原来的投资组合;</p>
              <p>2.修改投资组合只会影响之后生成的统计和报告，不会影响已经计算完成的报告。</p>
            </>
          }
          type="info"
          showIcon
        />
      </Modal>
    </Page>
  );
};

export default memo(TradeManagementOnBoardTansaction);
