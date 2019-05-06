import ImportExcelButton from '@/lib/components/_ImportExcelButton';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdTradeSearchIndexPaged } from '@/services/general-service';
import { mdlModelDataGet, mdlModelXYCreate } from '@/services/model';
import { Button, Input, message, Modal, notification, Row, Select, Spin, Table, Tabs } from 'antd';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import XLSX from 'xlsx';
import styles from './customModel.less';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const tabPaneData = [
  {
    tab: '价格',
    key: 'prices',
  },
  {
    tab: 'DELTA',
    key: 'deltas',
  },
  {
    tab: 'GAMMA',
    key: 'gammas',
  },
  {
    tab: 'VEGA',
    key: 'vegas',
  },
  {
    tab: 'THETA',
    key: 'thetas',
  },
];

const columnsData = [
  {
    title: '标的物价格',
    dataIndex: 's',
  },
  {
    title: '2019-04-19 09:00',
    dataIndex: 't1',
  },
  {
    title: '2019-04-19 12:00',
    dataIndex: 't2',
  },
  {
    title: '2019-04-19 15:00',
    dataIndex: 't3',
  },
  {
    title: '2019-04-19 18:00',
    dataIndex: 't4',
  },
];

const PRODUCTTYPE = 'MODEL_XY';
// const PRODUCTTYPE = 'VANILLA_EUROPEAN'

const useList = () => {
  const [loading, setLoading] = useState(false);
  const [tradeList, setTradeList] = useState([]);
  const fetchList = async () => {
    setLoading(true);
    const { data, error } = await trdTradeSearchIndexPaged({
      page: 0,
      pageSize: 20,
      productType: PRODUCTTYPE,
    });
    setLoading(false);
    let positions = [];
    if (error) {
      return setTradeList(positions);
    }
    const page = JSON.parse(JSON.stringify(data.page || []));
    page.forEach(item => {
      item.positions.forEach(param => {
        const obj = { ...item };
        obj.positions = param;
        positions = positions.concat(obj);
      });
    });
    if (error) return;
    setTradeList(positions);
  };

  useLifecycles(() => {
    fetchList();
  });

  return {
    loading,
    setLoading,
    tradeList,
    setTradeList,
    fetchList,
  };
};

const CustomModel = memo(() => {
  const [listLoading, setListLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [modelList, setmodelList] = useState([]);
  const [searchList, setSearchList] = useState([1, 2, 3]);
  const [tableData, setTableData] = useState([]);
  const [visible, setVisible] = useState(false);
  const { tradeList, setTradeList, loading, setLoading, fetchList } = useList();
  const [instance, setInstance] = useState('INTRADAY');
  const [instrumentId, setInstrumentId] = useState('');
  const [currentTrade, setCurrentTrade] = useState(null);
  const [file, setFile] = useState('');
  const [uploadData, setUploadData] = useState(null);
  const [columns, setColumns] = useState(columnsData);
  const [tabPane, setTabPane] = useState(tabPaneData);

  const [importBlock, setImportBlock] = useState(true);

  const showModal = () => {
    setVisible(true);
  };

  const merge = list => {
    const result = [];
    const cache = {};
    list.forEach(item => {
      if (!item) return;
      const key = item.timestamp;
      const index = cache[key];
      if (index !== undefined) {
        result[index][Object.keys(item)[1]] = item[Object.keys(item)[1]];
      } else {
        result.push({ ...item });
        cache[key] = result.length - 1;
      }
    });
    return result;
  };

  const handleOk = async e => {
    setVisible(false);
    // 创建自定义模型
    let dataJSON = [];
    // debugger
    dataJSON = uploadData.data.map((col, index) => {
      return _.keys(col).map(param => {
        let zipData = _.zip(...col[param]);
        zipData = zipData.map(z => {
          z = z.slice(1);
          return z;
        });
        const zip2Data = _.zipObject(col[param][0], zipData);
        let spots = [];
        const _data = _.keys(zip2Data).map(k => {
          if (k.indexOf('价格') > 0) {
            spots = zip2Data[k];
            return null;
          }
          return {
            timestamp: k,
            [uploadData.cols[index]]: zip2Data[k],
            spots,
          };
        });
        return _data;
      });
    });
    dataJSON = _.flatten(_.flatten(dataJSON));
    dataJSON = merge(dataJSON);
    setTableLoading(true);
    const { data, error } = await mdlModelXYCreate({
      tradeId: currentTrade.tradeId,
      instance,
      underlyer: currentTrade.positions.asset.underlyerInstrumentId,
      data: dataJSON,
      save: true,
    });
    setTableLoading(false);
    if (error) return;
    setTableData(_.flatten(uploadData.data));
    let _columns = [];
    const _tabPane = tabPane.map(item => {
      const index = _.findIndex(uploadData.data, item.key);
      if (index < 0) return item;
      const key = [];
      item.columns = uploadData.data[index][item.key][0].map((column, i) => {
        key.push(String(i));
        return { title: column, dataIndex: String(i) };
      });
      item.dataSource = uploadData.data[index][item.key].slice(1).map((ds, i) => {
        return { ..._.zipObject(key, ds), key: String(i) };
      });
      _columns = item.columns;
      return item;
    });
    setColumns(_columns);
    setTabPane(_tabPane);
    setImportBlock(false);
    notification.success({
      message: '导入模型数据成功',
    });
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const handleChange = async e => {
    setInstance(e);
    setTableLoading(true);
    const { data, error } = await mdlModelDataGet({
      modelType: PRODUCTTYPE,
      modelName: `${PRODUCTTYPE}_${currentTrade.tradeId}`,
      instance: e,
    });
    setTableLoading(false);
    if (error) {
      const _data = tabPaneData.map(tab => {
        const columns = _.cloneDeep(columnsData);
        tab.columns = columns;
        tab.dataSource = [];
        return tab;
      });
      setTabPane(_data);
      return message.error('未获取到模型数据');
    }
    // 整合查询返回数据setTabPane
    setImportBlock(false);
    setInstance(data.modelInfo.instance);
    const _data = tabPaneData.map(tab => {
      const columns = [{ title: '标的物价格', dataIndex: '0' }];
      const dataSource = [];
      let _spots = [];
      data.modelInfo.slices.forEach((item, i) => {
        const { deltas, gammas, prices, spots, thetas, timestamp, vegas } = item;
        _spots = spots;
        columns.push({ title: timestamp, dataIndex: String(i + 1) });
        const _index = Object.keys(item).indexOf(tab.key);
        const d = item[Object.keys(item)[_index]];
        if (_index >= 0) {
          dataSource.push(
            d.map((ditem, dindex) => {
              return { key: dindex, [String(i + 1)]: ditem };
            })
          );
        }
      });
      dataSource.unshift(_spots.map((s, i) => ({ '0': s, key: i })));
      tab.columns = columns;
      tab.dataSource = mergeDataSource(_.flatten(dataSource));
      return tab;
    });
    setTabPane(_data);
  };

  const handleSearch = async e => {
    setInstrumentId(e);
    setLoading(true);
    const { data, error } = await trdTradeSearchIndexPaged({
      tradeId: e,
      page: 0,
      pageSize: 20,
      productType: PRODUCTTYPE,
    });
    setLoading(false);
    let positions = [];
    if (error) {
      return setTradeList(positions);
    }
    const page = JSON.parse(JSON.stringify(data.page || []));
    page.forEach(item => {
      item.positions.forEach(param => {
        const obj = { ...item };
        obj.positions = param;
        positions = positions.concat(obj);
      });
    });
    setTradeList(positions);
  };

  const handleSelect = async param => {
    setCurrentTrade(param);
    setTableLoading(true);
    const { data, error } = await mdlModelDataGet({
      modelType: PRODUCTTYPE,
      modelName: `${PRODUCTTYPE}_${param.tradeId}`,
      instance,
    });
    setTableLoading(false);
    if (error) {
      const _data = tabPaneData.map(tab => {
        const columns = _.cloneDeep(columnsData);
        tab.columns = columns;
        tab.dataSource = [];
        return tab;
      });
      setTabPane(_data);
      return message.error('未获取到模型数据');
    }
    // 整合查询返回数据setTabPane
    setImportBlock(false);
    setInstance(data.modelInfo.instance);
    const _data = tabPaneData.map(tab => {
      const columns = [{ title: '标的物价格', dataIndex: '0' }];
      const dataSource = [];
      let _spots = [];
      data.modelInfo.slices.forEach((item, i) => {
        const { deltas, gammas, prices, spots, thetas, timestamp, vegas } = item;
        _spots = spots;
        columns.push({ title: timestamp, dataIndex: String(i + 1) });
        const _index = Object.keys(item).indexOf(tab.key);
        const d = item[Object.keys(item)[_index]];
        if (_index >= 0) {
          dataSource.push(
            d.map((ditem, dindex) => {
              return { key: dindex, [String(i + 1)]: ditem };
            })
          );
        }
      });
      dataSource.unshift(_spots.map((s, i) => ({ '0': s, key: i })));
      tab.columns = columns;
      tab.dataSource = mergeDataSource(_.flatten(dataSource));
      return tab;
    });
    setTabPane(_data);
  };

  const mergeDataSource = list => {
    const result = [];
    const cache = {};
    list.forEach(item => {
      if (!item) return;
      const key = Object.keys(item)[0];
      const index = cache[item.key];
      if (index !== undefined) {
        result[index][key] = item[Object.keys(item)[0]];
      } else {
        result.push({ ...item });
        cache[item.key] = result.length - 1;
      }
    });
    return result;
  };

  const download = () => {
    const cols = ['prices', 'deltas', 'gammas', 'thetas', 'vegas'];
    if (importBlock) {
      // 导入失败或者没模板数据下载空表
      const _data = cols.map(tab => {
        const tabData = [
          [
            '标的物价格',
            '2019-04-19T09:00:00',
            '2019-04-19T12:00:00',
            '2019-04-19T15:00:00',
            '2019-04-19T18:00:00',
          ],
        ];
        return tabData;
      });
      const wb = XLSX.utils.book_new();
      console.log(_data);
      cols.forEach((item, index) => {
        const ws = XLSX.utils.aoa_to_sheet(_data[index]);
        XLSX.utils.book_append_sheet(wb, ws, item);
      });
      XLSX.writeFile(wb, `${PRODUCTTYPE}_${currentTrade.tradeId}.xlsx`);
      return;
    }
    const _data = cols.map(tab => {
      const tindex = _.findIndex(tabPane, t => {
        return t.key === tab;
      });
      const _tab = tabPane[tindex];
      let tabData = [];
      tabData.push(_tab.columns.map(column => column.title));
      const dataSource = _tab.dataSource.map(ds => _.values(ds).slice(0, -1));
      tabData = tabData.concat(dataSource);
      return tabData;
    });
    const wb = XLSX.utils.book_new();
    cols.forEach((item, index) => {
      const ws = XLSX.utils.aoa_to_sheet(_data[index]);
      XLSX.utils.book_append_sheet(wb, ws, item);
    });
    XLSX.writeFile(wb, `${PRODUCTTYPE}_${currentTrade.tradeId}.xlsx`);
  };

  return (
    <div className={styles.customModel}>
      <PageHeaderWrapper title="自定义模型（MODEL_XY）">
        <div style={{ width: '400px', background: '#FFF', padding: '30px' }}>
          <p>
            <Search
              placeholder="输入交易编号查询"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </p>
          <Spin spinning={loading}>
            <ul style={{ marginTop: '20px' }} className={styles.searchList}>
              {tradeList.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      currentTrade &&
                      currentTrade.positions &&
                      currentTrade.positions.positionId === item.positions.positionId
                        ? styles.checked
                        : styles.liItme
                    }
                    onClick={() => handleSelect(item)}
                  >
                    <span className={styles.itemName}>
                      {item.tradeId}
                      <br />
                      标的物 {item.positions.asset.underlyerInstrumentId}
                      <br />
                      到期日 {item.positions.asset.expirationDate}
                      <br />
                    </span>
                  </li>
                );
              })}
            </ul>
          </Spin>
        </div>
        <div
          style={{
            marginLeft: '20px',
            background: '#FFF',
            padding: '30px',
            width: '100%',
            position: 'relative',
          }}
        >
          {currentTrade ? (
            <div>
              <Row style={{ marginBottom: '10px', maxHeight: '28px' }}>
                instance:{' '}
                <Select
                  defaultValue={instance}
                  style={{ width: 120, marginRight: '10px' }}
                  onChange={handleChange}
                >
                  <Option value="INTRADAY">日内</Option>
                  <Option value="CLOSE">收盘</Option>
                </Select>
                <Button style={{ marginRight: '15px' }} onClick={download}>
                  下载
                </Button>
                <a id="downlink" />
                <Button size="default" type="primary" loading={importLoading} onClick={showModal}>
                  导入
                </Button>
              </Row>
              <Tabs type="card" style={{ marginTop: '25px' }}>
                {tabPaneData.map((item, index) => {
                  const tabledataSource = item.dataSource || [];
                  const tablecolumns = item.columns || columns;
                  return (
                    <TabPane tab={item.tab} key={index}>
                      <Table
                        size="middle"
                        pagination={false}
                        rowKey={'key'}
                        dataSource={tabledataSource}
                        loading={tableLoading}
                        columns={tablecolumns}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          ) : (
            <span className={styles.center}>请先选中一个标的物</span>
          )}
        </div>
      </PageHeaderWrapper>
      <Modal title="导入模型数据" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <p>
          <ImportExcelButton
            key="import"
            type="primary"
            onImport={data => {
              console.log('data', data);
              setFile(data.fileName);
              setUploadData(data);
            }}
          >
            选择文件
          </ImportExcelButton>
          <span style={{ marginLeft: '20px' }}>{file}</span>
        </p>
        <p style={{ color: 'red' }}>1.导入会覆盖原有数据，请谨慎操作。</p>
        <p>2.时间格式请按照 2019-04-19T10:00:00 书写</p>
        <p>3.仅支持导入 .xlsx 格式文件</p>
      </Modal>
    </div>
  );
});

export default CustomModel;
