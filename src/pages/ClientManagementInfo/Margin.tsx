import Section from '@/components/Section';
import { INPUT_NUMBER_CURRENCY_CNY_CONFIG, INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import Form from '@/design/components/Form';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import ImportExcelButton from '@/lib/components/_ImportExcelButton';
import SourceTable from '@/lib/components/_SourceTable';
import {
  clientTradeCashFlow,
  mgnMarginList,
  mgnMarginsUpdate,
  mgnMarginUpdate,
} from '@/services/reference-data-service';
import { Button, message, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { PureComponent } from 'react';

const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '客户名称',
    field: 'legalName',
  },
  {
    headerName: '交易编号',
    field: 'accountId',
  },
  {
    headerName: '可用资金',
    field: 'cash',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '剩余授信额度',
    field: 'credit',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '冻结保证金',
    field: 'margin',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '维持保证金',
    field: 'maintenanceMargin',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '状态',
    field: 'status',
    input: {
      formatValue: value => {
        switch (value) {
          case 'UNKNOWN':
            return '未知';
          case 'NORMAL':
            return '正常';
          case 'NOT_ENOUGH':
            return '保证金不足';
          case 'PENDING_MARGIN_CALL':
            return '待追保证金';
          default:
            break;
        }
      },
    },
  },
];

const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '客户名称',
    field: 'legalName',
  },
  {
    headerName: '维持保证金',
    field: 'maintenanceMargin',
    editable: true,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
];

const SEARCH_FORM_CONTROLS: IFormControl[] = [
  {
    field: '客户名称',
    control: {
      label: 'legalName',
    },
  },
  {
    field: '主协议编号',
    control: {
      label: 'masterAgreementId',
    },
  },
];

const UPDATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '客户名称',
    },
    field: 'legalName',
    input: {
      disabled: true,
    },
  },
  {
    control: {
      label: '主协议编号',
    },
    field: 'masterAgreementId',
    input: {
      disabled: true,
    },
  },
  {
    control: {
      label: '当前维持保证金',
    },
    field: 'originMaintenanceMargin',
    input: {
      disabled: true,
      ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '新维持保证金',
    },
    field: 'maintenanceMargin',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
];

const IOGLOD_FORM_CONTROLS: (salesNameList) => IFormControl[] = salesNameList => [
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '客户名称',
    },
    field: 'legalName',
    input: {
      type: 'select',
      options: salesNameList,
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '资金类型',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: [
        {
          label: '保证金冻结',
          value: '保证金冻结',
        },
        {
          label: '保证金释放',
          value: '保证金释放',
        },
      ],
    },
    field: 'cashType',
  },
  // {
  //   decorator: {
  //     rules: [
  //       {
  //         required: true,
  //       },
  //     ],
  //   },
  //   control: {
  //     label: '交易ID',
  //   },
  //   field: 'tradeId',
  // },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '金额',
    },
    field: 'cashFlow',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];

export interface MarginProps {
  selectedRows: any[];
}

class Margin extends PureComponent<MarginProps> {
  public $updateForm: WrappedFormUtils = null;

  public $IOGlodForm: WrappedFormUtils = null;

  public $marginSourceTable: SourceTable = null;

  public state = {
    mainTableDataLoading: false,
    detailTableDataLoading: false,
    mainTableData: [],
    updateDataSource: {},
    updateVisible: false,
    ioGlodVisible: false,
    legalNamesList: [],
    excelData: [],
  };

  public fetchTable = async () => {
    const legalNamesList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName']).legalName;
    });

    const accountIdList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['accountId']).accountId;
    });

    const markets = legalNamesList.map(item => ({
      label: item,
      value: item,
    }));
    this.setState({
      legalNamesList: markets,
    });
    const { error, data } = await mgnMarginList({
      accountIds: accountIdList,
    });
    if (error) return false;
    return data;
  };

  public updateFormValueChange = params => {
    const values = params.values;
    this.setState({
      updateDataSource: values,
    });
  };

  public handleCancel = () => {
    this.setState({
      updateVisible: false,
    });
  };

  public handleConfirm = () => {
    this.setState({
      updateVisible: false,
    });
    this.onCreate();
  };

  public handleCancelIOGlod = () => {
    this.setState({
      ioGlodVisible: false,
    });
  };

  public handleConfirmIOGlod = () => {
    this.setState({
      ioGlodVisible: false,
    });
    this.onCreateIoGlod();
  };

  public onCreate = () => {
    return new Promise(resolve => {
      this.$updateForm.validateFields(async (error, values) => {
        if (error) return resolve(false);
        const { error, data } = await mgnMarginUpdate({
          uuid: this.rowId,
          maintenanceMargin: values.maintenanceMargin,
        });
        if (error) {
          message.error('更新失败');
          return resolve(false);
        }
        this.$marginSourceTable.search();
        message.success('更新成功');
        return resolve(true);
      });
    });
  };

  public handleC = async (values, resolve) => {
    const clientTradeCashFlowRsp = await clientTradeCashFlow({
      accountId: this.modalFormData.accountId,
      tradeId: values.tradeId,
      cashFlow: String(0),
      marginFlow: String(values.cashFlow),
    });

    if (clientTradeCashFlowRsp.error) {
      return resolve(false);
    }
    if (!clientTradeCashFlowRsp.data.status) {
      message.error(clientTradeCashFlowRsp.data.information);
      return resolve(false);
    }

    resolve(true);
    this.$marginSourceTable.search();
    message.success('录入成功');
  };

  public onCreateIoGlod = () => {
    return new Promise(resolve => {
      this.$IOGlodForm.validateFields((error, values) => {
        if (error) return resolve(false);
        if (values.cashType === '保证金释放') {
          values.cashFlow = '-' + values.cashFlow;
        }
        return this.handleC(values, resolve);
      });
    });
  };

  public switchUpdateMargin = event => {
    const dataSource = {
      ...event.rowData,
      originMaintenanceMargin: event.rowData.maintenanceMargin,
      maintenanceMargin: 0,
      masterAgreementId: _.pick(
        _.filter(this.props.selectedRows, {
          legalName: event.rowData.legalName,
        })[0],
        ['masterAgreementId']
      ).masterAgreementId,
    };
    this.rowId = event.rowId;
    this.setState({
      updateVisible: true,
      updateDataSource: dataSource,
    });
  };

  public switchIOGlod = event => {
    this.modalFormData = event.rowData;
    const IOGlodDataSource = {
      cashFlow: 0,
    };
    this.setState({
      ioGlodVisible: true,
      IOGlodDataSource,
    });
  };

  public IOGlodFormValueChange = params => {
    const values = params.values;
    this.setState({
      IOGlodDataSource: values,
    });
  };

  public handleExcelFile = async excelData => {
    const { error, data } = await mgnMarginsUpdate({
      margins: excelData,
    });
    if (error) {
      message.error('批量更新失败');
      return false;
    }
    message.success('批量更新成功');
    this.$marginSourceTable.search();
    return true;
  };

  public handleCancelExcel = () => {
    this.setState({
      excelVisible: false,
    });
  };

  public handleConfirmExcel = () => {
    this.setState(
      {
        excelVisible: false,
      },
      () => {
        this.handleExcelFile(this.state.excelData);
      }
    );
  };

  public render() {
    return (
      <>
        <Section>保证金管理</Section>
        <SourceTable
          rowKey={'uuid'}
          ref={node => (this.$marginSourceTable = node)}
          // searchFormControls={SEARCH_FORM_CONTROLS}
          tableColumnDefs={TABLE_COL_DEFS}
          onSearch={this.fetchTable}
          searchable={false}
          resetable={false}
          extraActions={[
            <ImportExcelButton
              key="import"
              type="primary"
              onImport={data => {
                this.setState({
                  excelVisible: true,
                  excelData: data.data.slice(1).map(item => {
                    return {
                      legalName: item[0],
                      maintenanceMargin: item[1],
                    };
                  }),
                });
              }}
            >
              批量更新
            </ImportExcelButton>,
          ]}
          actionColDef={{
            width: 300,
          }}
          rowActions={[
            <Button key="台账调整" type="primary" onClick={this.switchIOGlod}>
              台账调整
            </Button>,
            <Button key="update" type="primary" onClick={this.switchUpdateMargin}>
              更新维持保证金
            </Button>,
          ]}
        />
        <Modal
          visible={this.state.updateVisible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          closable={false}
        >
          <Form
            wrappedComponentRef={element => {
              if (element) {
                this.$updateForm = element.props.form;
              }
              return;
            }}
            controls={UPDATE_FORM_CONTROLS}
            dataSource={this.state.updateDataSource}
            onValueChange={this.updateFormValueChange}
            controlNumberOneRow={1}
            footer={false}
          />
        </Modal>
        <Modal
          visible={this.state.ioGlodVisible}
          onOk={this.handleConfirmIOGlod}
          onCancel={this.handleCancelIOGlod}
          closable={false}
        >
          <Form
            wrappedComponentRef={element => {
              if (element) {
                this.$IOGlodForm = element.props.form;
              }
              return;
            }}
            controls={IOGLOD_FORM_CONTROLS(this.state.legalNamesList)}
            dataSource={this.state.IOGlodDataSource}
            onValueChange={this.IOGlodFormValueChange}
            controlNumberOneRow={1}
            footer={false}
          />
        </Modal>
        <Modal
          title="导入预览"
          visible={this.state.excelVisible}
          onOk={this.handleConfirmExcel}
          onCancel={this.handleCancelExcel}
        >
          <SourceTable
            rowKey="legalName"
            tableColumnDefs={PAGE_TABLE_COL_DEFS}
            dataSource={this.state.excelData}
            editable={false}
          />
        </Modal>
      </>
    );
  }
}

export default Margin;
