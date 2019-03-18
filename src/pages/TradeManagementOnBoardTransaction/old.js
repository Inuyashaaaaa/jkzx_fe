import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { Button, Modal, Table, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { generateColumns } from './constants';
// import moment from 'moment';
import RowForm from './components/RowForm';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { queryTradeRecord, queryPositions } from '@/services/onBoardTransaction';

const { TabPane } = Tabs;

class TradeManagementOnBoardTansaction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      type: 'flow',
      flowData: [],
      positionData: [],
      flowPageSize: 10,
      positionPageSize: 10,
      formItems: [],
      instrumentIds: [],
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
    this.fetchData(params);
  };

  queryPositions = async data => {
    const params = {
      dealDate: data.date.format('YYYY-MM-DD'),
    };
    this.fetchData(params);
  };

  fetchData = async params => {
    // const da = generateColumns('flow');

    // const obj = {};

    // da.forEach(d => {
    //   obj[d.dataIndex] = 'iamplaceholder';
    // });

    // const data = new Array(80).fill(Object.assign({}, obj));

    // this.setState({
    //   flowData: data,
    // });

    const { type } = this.state;
    const isFlow = type === 'flow';

    this.setState({
      loading: true,
    });
    const executeMethod = isFlow ? queryTradeRecord : queryPositions;
    const list = await executeMethod({
      ...params,
    });
    if (list.error) {
      this.setState({
        loading: false,
      });
    }
    const data = (list && list.data) || [];
    const finalData = data.map(d => {
      const obj = Object.assign({}, d);
      // obj.transactName = tradeMap[obj.transactType];
      // obj.docName = docMap[obj.docType];
      // obj.updatedAt = obj.updatedAt ? moment(obj.updatedAt).format('YYYY-MM-DD hh:mm:ss') : '';
      return obj;
    });
    finalData.sort((a, b) => a.bookId.localeCompare(b.bookId));
    const nextState = isFlow ? { flowData: finalData } : { positionData: finalData };
    this.setState({
      loading: false,
      ...nextState,
    });
  };

  formatFormItems = doc => {
    const tradeType = {
      type: 'plain',
      label: '交易类型',
      property: 'transactName',
      value: doc.transactName,
      marginTop: 30,
    };
    const documentType = {
      type: 'plain',
      label: '文档类型',
      property: 'docName',
      value: doc.docName,
      marginTop: 30,
    };

    const documentUp = {
      type: 'upload',
      label: '模板上传',
      property: 'document',
      required: true,
      placeholder: '支持XML文件类型',
      marginTop: 30,
      // attachData: Object.assign({ url: uploadUrl }, this.documentInfo),
    };
    const { type } = this.state;
    if (type === 'trade') {
      return [tradeType, documentType, documentUp];
    }
    if (type === 'customer') {
      return [documentType, documentUp];
    }
  };

  hideModal = () => {
    this.editDate = {};
    this.setState({
      modalVisible: false,
      formItems: [],
      modalLoading: false,
    });
  };

  showModal = record => {
    this.documentInfo = record;
    this.setState({
      modalVisible: true,
      modalTitle: '上传模板',
      formItems: this.formatFormItems(record),
    });
  };

  changeTab = tab => {
    const type = tab === '1' ? 'flow' : 'position';
    this.setState({
      type,
    });
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
      this.fetchData();
      this.hideModal();
    }
  };

  render() {
    const {
      modalTitle,
      modalVisible,
      formItems,
      modalLoading,
      flowData,
      positionData,
      flowPageSize,
      positionPageSize,
      loading,
      instrumentIds,
    } = this.state;
    const flowColumns = generateColumns('flow');
    const positionColumns = generateColumns('position');
    return (
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane tab="场内流水" key="1">
            <RowForm mode="flow" codeOptions={instrumentIds} handleQuery={this.queryRecords} />
            <div>
              <Button onClick={this.showModal} type="primary" style={{ marginTop: 10 }}>
                导入场内流水
              </Button>
            </div>
            <Table
              loading={loading}
              columns={flowColumns}
              dataSource={flowData}
              size="small"
              pagination={{
                pageSizeOptions: ['10', '20', '30'],
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (page, size) => {
                  this.setState({ flowPageSize: size });
                },
                showTotal: (total, range) => {
                  const curPage = Math.ceil(range[1] / flowPageSize);
                  const totalPage = Math.ceil(total / flowPageSize);
                  return `共有 ${total} 条记录   第 ${curPage}/${totalPage}页`;
                },
              }}
            />
          </TabPane>
          <TabPane tab="场内持仓统计" key="2">
            <RowForm mode="position" handleQuery={this.queryPositions} />
            <Table
              loading={loading}
              columns={positionColumns}
              dataSource={positionData}
              pagination={{
                pageSizeOptions: ['10', '20', '30'],
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (page, size) => {
                  this.setState({ positionPageSize: size });
                },
                showTotal: (total, range) => {
                  const curPage = Math.ceil(range[1] / positionPageSize);
                  const totalPage = Math.ceil(total / positionPageSize);
                  return `共有 ${total} 条记录   第 ${curPage}/${totalPage}页`;
                },
              }}
            />
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
      </PageHeaderWrapper>
    );
  }
}

export default TradeManagementOnBoardTansaction;
