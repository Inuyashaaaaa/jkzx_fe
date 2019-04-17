import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import { PureStateComponent } from '@/lib/components/_Components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions } from '@/lib/utils';
import { DOWN_LOAD_FIEL_URL } from '@/services/document';
import {
  clientAccountDel,
  clientAccountSearch,
  createRefParty,
  refSalesGetByLegalName,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { queryCompleteCompanys } from '@/services/sales';
import { Button, Col, message, notification, Row, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import produce from 'immer';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React from 'react';
import router from 'umi/router';
import {
  DOC_FIELDS,
  INSTITUTION,
  PRODUCT,
  PRODUCTIONS,
  SEARCH_FORM_CONTROLS,
  TABLE_COLUMN_DEFS,
} from './constants';
import { ADDRESS_CASCADER, INSITUTIONS } from './constants/INSITUTIONS';
import Discrepancy from './Discrepancy';
import InfoManager from './InfoManager';
import IOGlod from './IOGlod';
import Margin from './Margin';
import Valuation from './Valuation/index';

const TabPane = Tabs.TabPane;

class ClientManagement extends PureStateComponent {
  public $insForm: WrappedFormUtils = null;

  public $proForm: WrappedFormUtils = null;

  public $sourceTable: SourceTable = null;

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      contentType: null,
      activeKey: INSTITUTION,
      dataSourceInst: {},
      dataSourceProd: {},
      markets: [],
      searchFormData: {},
      loading: false,
      tableDataSource: [],
      modalVisible: false,
      confirmLoading: false,
    };
  }

  public componentDidMount = async () => {
    this.fetchBranchSalesList();
    this.fetchSimilarLegalName();
    this.fetchTable();
  };

  public fetchSimilarLegalName = async () => {
    const { error, data } = await refSimilarLegalNameList({
      similarLegalName: '',
    });
    if (error) return;
    const markets = data.map(item => ({
      label: item,
      value: item,
    }));
    this.setState({ markets });
  };

  public fetchBranchSalesList = async () => {
    const { error, data } = await queryCompleteCompanys();
    if (error) return false;
    const newData = arr2treeOptions(
      data,
      ['subsidiary', 'branch', 'salesName'],
      ['subsidiary', 'branch', 'salesName']
    );
    const branchSalesList = newData.map(subsidiaryName => {
      return {
        value: subsidiaryName.value,
        label: subsidiaryName.label,
        children: subsidiaryName.children.map(branchName => {
          return {
            value: branchName.value,
            label: branchName.label,
            children: branchName.children.map(salesName => {
              return {
                value: salesName.value,
                label: salesName.label,
              };
            }),
          };
        }),
      };
    });
    this.setState({ branchSalesList });
    return true;
  };

  public fetchTable = async () => {
    const { searchFormData } = this.state;

    let datalist = {};
    if (searchFormData[ADDRESS_CASCADER]) {
      const [subsidiaryName, branchName, salesName] = searchFormData[ADDRESS_CASCADER];
      datalist = { subsidiaryName, branchName, salesName };
    }

    this.setState({ loading: true });
    const { error, data } = await clientAccountSearch({
      // page: (paramsPagination || pagination).current - 1,
      // pageSize: (paramsPagination || pagination).pageSize,
      ...datalist,
      ...(searchFormData.legalName ? { legalName: searchFormData.legalName } : {}),
      ...(searchFormData.masterAgreementId
        ? { masterAgreementId: searchFormData.masterAgreementId }
        : {}),
    });
    this.setState({ loading: false });

    if (error) return;

    const newData = data.map(item => {
      item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss');
      item.createdAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });

    this.setState({
      tableDataSource: newData,
    });
  };

  public createProduct = () => {
    if (!this.$proForm) return;

    this.$proForm.validateFieldsAndScroll(async (error, values) => {
      if (error) return;

      const formatValues = _.mapValues(values, (val, key) => {
        if (isMoment(val)) {
          return val.format('YYYY-MM-DD');
        }
        return val;
      });
      const { [ADDRESS_CASCADER]: cascader, ...rest } = formatValues;

      const [subsidiaryName, branchName, salesName] = cascader;

      const dataSourceProd = _.mapValues(rest, (val, key) => {
        if (DOC_FIELDS.indexOf(key) !== -1) {
          return _.get(val, '[0].response.result.uuid', undefined);
        }
        return val;
      });

      if (!salesName) {
        return message.warn('销售不存在');
      }

      const distValues = {
        ...dataSourceProd,
        subsidiaryName,
        branchName,
        salesName,
        clientType: PRODUCT,
      };

      this.switchConfirmLoading();
      const { error: _error } = await createRefParty(distValues);
      this.switchConfirmLoading();
      if (_error) return;

      this.setState(
        {
          dataSourceInst: {},
          dataSourceProd: {},
          modalVisible: false,
        },
        () => {
          message.success('创建成功');
          this.fetchTable();
        }
      );
    });
  };

  public createInstitution = () => {
    this.$insForm.validateFieldsAndScroll(async (error, values) => {
      if (error) return;
      const formatValues = _.mapValues(values, (val, key) => {
        if (isMoment(val)) {
          return val.format('YYYY-MM-DD');
        }
        return val;
      });
      const { [ADDRESS_CASCADER]: cascader, ...rest } = formatValues;
      const [subsidiaryName, branchName, salesName] = cascader;
      const dataSourceInst = _.mapValues(rest, (val, key) => {
        if (DOC_FIELDS.indexOf(key) !== -1) {
          return _.get(val, '[0].response.result.uuid', undefined);
        }
        return val;
      });

      if (!salesName) {
        return message.warn('销售不存在');
      }
      const distValues = {
        ...dataSourceInst,
        subsidiaryName,
        branchName,
        salesName,
        clientType: INSTITUTION,
      };

      this.switchConfirmLoading();
      const { error: _error } = await createRefParty(distValues);
      this.switchConfirmLoading();
      if (_error) return;

      this.setState(
        {
          dataSourceInst: {},
          dataSourceProd: {},
          modalVisible: false,
        },
        () => {
          message.success('创建成功');
          this.fetchTable();
        }
      );
    });
  };

  public onCreate = async () => {
    if (this.state.activeKey === INSTITUTION) {
      return this.createInstitution();
    } else {
      return this.createProduct();
    }
  };

  public onRemove = async event => {
    const { error, data } = await clientAccountDel({ accountId: event.rowId });
    if (error) return;
    return () => {
      this.setState(
        produce((state: any) => {
          state.tableDataSource.splice(event.rowIndex, 1);
        }),
        () => {
          notification.success({
            message: '删除成功',
          });
        }
      );
    };
  };

  public onSelectionChanged = () => {
    const selectedRows = this.$sourceTable.$baseSourceTable.$table.$baseTable.gridApi.getSelectedRows();
    this.setState({ selectedRows, contentType: null });
  };

  public getContent = () => {
    const { selectedRows, contentType } = this.state;
    if (!selectedRows.length) return null;

    if (selectedRows.length === 1 && contentType === 'infoManager') {
      return <InfoManager data={selectedRows[0]} />;
    }

    if (contentType === 'valuation') {
      return <Valuation selectedRows={selectedRows} />;
    }

    if (contentType === 'margin') {
      return <Margin selectedRows={selectedRows} />;
    }

    if (contentType === 'iogold') {
      return <IOGlod selectedRows={selectedRows} />;
    }

    if (contentType === 'discrepancy') {
      return <Discrepancy selectedRows={selectedRows} />;
    }

    return null;
  };

  public bindClick = contentType => () => {
    this.setState({ contentType });
  };

  public onSalesBtnClick = () => {
    router.push('/customer-sales-manage');
  };

  public onBankBtnClick = () => {
    router.push('/bank-account');
  };

  public onChangeTabs = activeKey => {
    this.setState({
      activeKey,
    });
  };

  public isForden = fileType => {
    if (fileType === 'application/msword' || fileType === 'image/png') {
      message.error('不支持该文件类型');
      return false;
    }
    return true;
  };

  public handleChangeInstValue = params => {
    const nextValues = { ...params.values };

    Object.keys(params.changedValues).map(key => {
      if (DOC_FIELDS.indexOf(key) !== -1) {
        nextValues[key] = nextValues[key].map(file => {
          if (file.response && file.status === 'done') {
            return {
              ...file,
              url: `${DOWN_LOAD_FIEL_URL}${file.response.result.uuid}&partyDoc=true`,
            };
          }
          return file;
        });
      }
    });

    this.setState({
      dataSourceInst: nextValues,
    });
  };

  public handleChangeProdValue = params => {
    const nextValues = { ...params.values };

    Object.keys(params.changedValues).map(key => {
      if (DOC_FIELDS.indexOf(key) !== -1) {
        nextValues[key] = nextValues[key].map(file => {
          if (file.response && file.status === 'done') {
            return {
              ...file,
              url: `${DOWN_LOAD_FIEL_URL}${file.response.result.uuid}&partyDoc=true`,
            };
          }
          return file;
        });
      }
    });

    this.setState({
      dataSourceProd: nextValues,
    });
  };

  public onSearchFormChange = async params => {
    let refSalesGetByLegalNameRsp;
    if (params.changedValues.legalName) {
      refSalesGetByLegalNameRsp = await refSalesGetByLegalName({
        legalName: params.changedValues.legalName,
      });
      if (refSalesGetByLegalNameRsp.error) return;
      this.setState({
        searchFormData: {
          ...params.values,
          [ADDRESS_CASCADER]: _.values(
            _.pick(refSalesGetByLegalNameRsp.data, ['subsidiary', 'branch', 'salesName'])
          ),
        },
      });
      return;
    }
    this.setState({
      searchFormData: params.values,
    });
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public switchModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  public switchConfirmLoading = () => {
    this.setState({
      confirmLoading: !this.state.confirmLoading,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          searchable={true}
          resetable={true}
          onSearchButtonClick={this.fetchTable}
          ref={node => (this.$sourceTable = node)}
          rowKey="accountId"
          dataSource={this.state.tableDataSource}
          onResetButtonClick={this.onReset}
          header={
            <Row type="flex" justify="start" style={{ marginBottom: VERTICAL_GUTTER }}>
              <Col>
                <Button.Group>
                  <ModalButton
                    type="primary"
                    onClick={this.switchModal}
                    modalProps={{
                      width: 1500,
                      visible: this.state.modalVisible,
                      onCancel: this.switchModal,
                      onOk: this.onCreate,
                      confirmLoading: this.state.confirmLoading,
                    }}
                    content={
                      <Tabs activeKey={this.state.activeKey} onChange={this.onChangeTabs}>
                        <TabPane tab="机构户" key={INSTITUTION}>
                          <Form
                            wrappedComponentRef={element => {
                              if (element) {
                                this.$insForm = element.props.form;
                              }
                              return;
                            }}
                            controls={INSITUTIONS(this.state.branchSalesList)}
                            dataSource={this.state.dataSourceInst}
                            onValueChange={this.handleChangeInstValue}
                            controlNumberOneRow={2}
                            footer={false}
                          />
                        </TabPane>
                        <TabPane tab="产品户" key={PRODUCT}>
                          <Form
                            wrappedComponentRef={element => {
                              if (element) {
                                this.$proForm = element.props.form;
                              }
                              return;
                            }}
                            controls={PRODUCTIONS(this.state.branchSalesList)}
                            dataSource={this.state.dataSourceProd}
                            onValueChange={this.handleChangeProdValue}
                            controlNumberOneRow={2}
                            footer={false}
                          />
                        </TabPane>
                      </Tabs>
                    }
                  >
                    新建交易对手
                  </ModalButton>
                  <Button key="销售管理" onClick={this.onSalesBtnClick}>
                    销售管理
                  </Button>
                  <Button key="客户银行账户管理" onClick={this.onBankBtnClick}>
                    客户银行账户管理
                  </Button>
                </Button.Group>
              </Col>
            </Row>
          }
          loading={this.state.loading}
          searchFormControls={SEARCH_FORM_CONTROLS(this.state.branchSalesList)}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          columnDefs={TABLE_COLUMN_DEFS}
          autoSizeColumnsToFit={false}
          rowSelection={'multiple'}
          onSelectionChanged={this.onSelectionChanged}
          actionColDef={{
            width: 100,
            pinned: 'right',
          }}
          rowActions={[
            <Button key="remove" type="danger" onClick={this.onRemove}>
              删除
            </Button>,
          ]}
        />
        <Row style={{ marginTop: VERTICAL_GUTTER }}>
          <Button.Group>
            <Button
              onClick={this.bindClick('infoManager')}
              type="primary"
              disabled={!this.state.selectedRows.length || this.state.selectedRows.length > 1}
            >
              交易对手信息管理
            </Button>
            <Button
              onClick={this.bindClick('valuation')}
              type="primary"
              disabled={!this.state.selectedRows.length}
            >
              持仓估值管理
            </Button>
            <Button
              onClick={this.bindClick('margin')}
              type="primary"
              disabled={!this.state.selectedRows.length}
            >
              保证金管理
            </Button>
            <Button
              onClick={this.bindClick('iogold')}
              type="primary"
              disabled={!this.state.selectedRows.length}
            >
              台账管理
            </Button>
            <Button
              onClick={this.bindClick('discrepancy')}
              type="primary"
              disabled={!this.state.selectedRows.length}
            >
              财务出入金管理
            </Button>
          </Button.Group>
        </Row>
        <Row style={{ marginTop: VERTICAL_GUTTER }}>{this.getContent()}</Row>
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagement;
