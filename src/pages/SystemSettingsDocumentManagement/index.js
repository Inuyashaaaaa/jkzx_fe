import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Modal, Table, Tabs, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import moment from 'moment';
import {
  queryTemplateList,
  // updateTemplate,
  // dowmloadTemplate,
  deleteTemplate,
  HREF_UPLOAD_URL,
  UPLOAD_URL,
} from '@/services/document';

const { TabPane } = Tabs;

const TRADE_MAP = {
  EUROPEAN: '欧式',
  AMERICAN: '美式',
};

const DOC_MAP = {
  SETTLE_NOTIFICATION: '结算通知书',
  CLOSE_CONFIRMATION: '平仓确认书',
  SUPPLEMENTARY_AGREEMENT: '交易确认书',
  VALUATION_REPORT: '估值报告',
  MARGIN_CALL: '追保函',
};

class ClientManagementDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      type: 'trade',
      tradeData: [],
      customerData: [],
      tradePageSize: 10,
      customerPageSize: 10,
      formItems: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { type } = this.state;
    const isTrade = type === 'trade';

    this.setState({
      loading: true,
    });
    const list = await queryTemplateList({
      category: isTrade ? 'TRADE_TEMPLATE' : 'CLIENT_TEMPLATE',
    });
    if (list.error) {
      this.setState({
        loading: false,
      });
    }
    const data = (list && list.data) || [];
    const finalData = data.map(d => {
      const obj = Object.assign({}, d);
      obj.transactName = TRADE_MAP[obj.transactType];
      obj.docName = DOC_MAP[obj.docType];
      obj.updatedAt = obj.updatedAt ? moment(obj.updatedAt).format('YYYY-MM-DD hh:mm:ss') : '';
      return obj;
    });
    finalData.sort((a, b) => a.uuid.localeCompare(b.uuid));
    const nextState = isTrade ? { tradeData: finalData } : { customerData: finalData };
    this.setState({
      loading: false,
      ...nextState,
    });
  };

  formatFormItems = doc => {
    const uploadAttachData = {
      url: UPLOAD_URL,
      mimeTypes: ['XML'],
      mimeInfos: ['text/xml'],
      uploadData: {
        method: 'docBctTemplateCreateOrUpdate',
        params: JSON.stringify({
          uuid: this.documentInfo.uuid,
        }),
      },
    };
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
      attachData: uploadAttachData,
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

  removeTemplate = async template => {
    this.setState({
      loading: true,
    });
    const res = await deleteTemplate({
      uuid: template.uuid,
    });
    if (res.error) {
      return;
    }
    this.fetchData();
  };

  generateTableColumns = type => {
    const trade = {
      dataIndex: 'transactName',
      title: '交易类型',
      key: 'transactName',
    };
    const documentType = {
      dataIndex: 'docName',
      title: '文档类型',
      key: 'docName',
    };
    const template = {
      dataIndex: 'fileName',
      title: '模板',
      key: 'fileName',
    };
    const updateTime = {
      dataIndex: 'updatedAt',
      title: '模板更新时间',
      key: 'updatedAt',
    };
    const operation = {
      title: '操作',
      key: 'operate',
      render: (text, record) => {
        const isValid = !!record.fileName;
        // const doc = this.documentInfo || {};

        return isValid ? (
          <div>
            <Button size="small" type="primary">
              <a href={`${HREF_UPLOAD_URL}${record.uuid}`} download={`${record.fileName}`}>
                查看
              </a>
            </Button>
            <Popconfirm title="新文件将会替换旧文件" onConfirm={() => this.showModal(record)}>
              <Button style={{ marginLeft: 10 }} size="small" type="primary">
                更新
              </Button>
            </Popconfirm>
            <Popconfirm title="确定要删除吗？" onConfirm={() => this.removeTemplate(record)}>
              <Button type="danger" style={{ marginLeft: 10 }} size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <div>
            <Button onClick={() => this.showModal(record)} size="small" type="primary">
              上传
            </Button>
          </div>
        );
      },
    };
    let columns = [];
    if (type === 'trade') {
      columns = [trade, documentType, template, updateTime, operation];
    }

    if (type === 'customer') {
      columns = [documentType, template, updateTime, operation];
    }
    return columns;
  };

  changeTab = tab => {
    const { tradeData, customerData } = this.state;
    const type = tab === '1' ? 'trade' : 'customer';
    const target = tab === '1' ? tradeData : customerData;
    this.setState(
      {
        type,
      },
      () => {
        if (!target.length) {
          this.fetchData();
        }
      }
    );
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
      tradeData,
      customerData,
      tradePageSize,
      customerPageSize,
      loading,
    } = this.state;
    const tradeColumns = this.generateTableColumns('trade');
    const customerColumns = this.generateTableColumns('customer');
    return (
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane tab="交易模板" key="1">
            <Table
              loading={loading}
              columns={tradeColumns}
              dataSource={tradeData}
              rowKey="uuid"
              pagination={{
                pageSizeOptions: ['10', '20', '30'],
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (page, size) => {
                  this.setState({ tradePageSize: size });
                },
                showTotal: (total, range) => {
                  const curPage = Math.ceil(range[1] / tradePageSize);
                  const totalPage = Math.ceil(total / tradePageSize);
                  return `共有 ${total} 条记录   第 ${curPage}/${totalPage}页`;
                },
              }}
            />
          </TabPane>
          <TabPane tab="客户模板" key="2">
            <Table
              loading={loading}
              columns={customerColumns}
              rowKey="uuid"
              dataSource={customerData}
              pagination={{
                pageSizeOptions: ['10', '20', '30'],
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (page, size) => {
                  this.setState({ customerPageSize: size });
                },
                showTotal: (total, range) => {
                  const curPage = Math.ceil(range[1] / customerPageSize);
                  const totalPage = Math.ceil(total / customerPageSize);
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

export default ClientManagementDocument;
