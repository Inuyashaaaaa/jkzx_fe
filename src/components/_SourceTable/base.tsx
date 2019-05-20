import { COL_GUTTER, VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/components/_Form2';
import ModalButton from '@/components/_ModalButton2';
import Table, { IColDef, IColumnDef, TableGetContextMenuItemsParams } from '@/components/_Table2';
import { judagePromise, someDeep } from '@/utils';
import { MenuItemDef } from 'ag-grid-community';
import { Button, Col, Divider, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';
import Loading from '../_Loading2';
import { DEFAULT_CONTEXT_MENU_ITEMS } from '../_Table2/constants';
import { TOTAL_DATA_ID, TOTAL_DATA_TAG } from './constants';
import {
  IExtraActionButtonOnClick,
  IInputTypeColDef,
  ITableDataSource,
  SourceTableBaseProps,
  SourceTableGetContextMenuItemsParams,
} from './interface';
import ActionCellRendererClass, { IRowActionProps } from './rendering/ActionCellRendererClass';

const ButtonGroup = Button.Group;

class SourceTableBase extends PureComponent<SourceTableBaseProps, any> {
  public static defaultProps = {
    tableColumnDefs: [],
    createFormControls: [],
    searchFormControls: [],
    extraActions: [],
    createText: '新 建',
    resetable: true,
    searchText: '搜 索',
    tableProps: {},
    saveText: '保 存',
    resetText: '重 置',
    tableFormProps: {},
    searchFormProps: {},
    createFormProps: {},
    resetLoading: false,
    saveLoading: false,
  };

  public state = {
    forceUpdateTotalFooter: 0,
  };

  public $table: Table = null;

  public $tableForm: WrappedFormUtils = null;

  public $createForm: WrappedFormUtils = null;

  public $searchForm: WrappedFormUtils = null;

  public totalDataTpl: object;

  public injectTotalFooter = memo(
    (tableData, totalFooter, tableColumnDefs, forceUpdateTotalFooter) => {
      if (tableData.length && totalFooter) {
        const totalData = this.calculateTotalData(
          tableData,
          tableColumnDefs,
          forceUpdateTotalFooter
        );
        return tableData.concat(totalData);
      }
      return tableData;
    }
  );

  public calculateTotalData = memo((tableData, tableColumnDefs, forceUpdateTotalFooter) => {
    const inputTypeColDefs: IInputTypeColDef[] = tableColumnDefs
      .map((colDef: IColDef) => {
        return this.transformColDef(colDef);
      })
      .filter((colDef: IInputTypeColDef) => this.judgeTotalColCanCalculate(colDef));

    return inputTypeColDefs.reduce((totalData, inputTypeColDef) => {
      return this.calculateTotalColData(inputTypeColDef, tableData, totalData);
    }, this.totalDataTpl);
  });

  public transformColDef = memo(
    (colDef: IColDef): IInputTypeColDef => {
      const inputType = colDef.input
        ? typeof colDef.input === 'function'
          ? colDef.input({}).type
          : colDef.input.type
        : 'input';
      return {
        ...colDef,
        inputType,
      };
    }
  );

  public getActionColumnDefs = memo(
    (
      columnDefs,
      removeable,
      insertable,
      hasCustomRowAction,
      tableDataGreaterZero,
      actionColDef
    ) => {
      if (tableDataGreaterZero && (removeable || insertable || hasCustomRowAction)) {
        return columnDefs.concat({
          headerName: '操作',
          field: '操作',
          ...actionColDef,
          cellRenderer: 'ActionCellRendererClass',
          editable: false,
          cellRendererParams: {
            insertable,
            removeable,
            onRemove: this.props.onRemove,
            onInsert: this.props.onInsert,
            getEventData: this.getEventData,
          },
        });
      }

      return columnDefs;
    }
  );

  public rowActions: Array<React.ReactElement<IRowActionProps>> = null;

  public getColumnEditable = memo(tableColumnDefs => {
    return someDeep(tableColumnDefs, item => item.editable);
  });

  constructor(props) {
    super(props);
    if (!props.rowKey) {
      throw new Error('rowKey is must be exist!');
    }

    // 字面量组件，需要缓存，不然 ag-grid 会报错
    this.rowActions = props.rowActions;

    this.totalDataTpl = {
      [props.rowKey]: TOTAL_DATA_ID,
      [TOTAL_DATA_TAG]: true,
    };
  }

  public onCellValueChanged = params => {
    if (this.props.totalFooter || this.props.tableColumnDefs.some(item => item.totalable)) {
      if (
        this.judgeTotalColCanCalculate({
          totalable: this.props.totalFooter,
          ...this.transformColDef(params.colDef),
        })
      ) {
        this.setState({
          forceUpdateTotalFooter: this.state.forceUpdateTotalFooter + 1,
        });
      }
    }

    if (this.props.tableProps.onCellValueChanged) {
      return this.props.tableProps.onCellValueChanged(params);
    }
  };

  public calculateTotalColData = (
    inputTypeColDef: IInputTypeColDef,
    tableData: ITableDataSource,
    totalColData?: object
  ) => {
    const { field, calculateTotalData } = inputTypeColDef;

    return tableData.reduce((totalData, rowRecord) => {
      if (calculateTotalData) {
        return {
          ...totalData,
          [field]: calculateTotalData(totalData[field], rowRecord),
        };
      }

      let val;
      if (totalData[field] !== undefined || rowRecord[field] !== undefined) {
        val = (totalData[field] || 0) + (rowRecord[field] || 0);
      }

      return {
        ...totalData,
        [field]: val,
      };
    }, totalColData || {});
  };

  public judgeTotalColCanCalculate = (inputTypeColDef: IInputTypeColDef) => {
    const { inputType, calculateTotalData, totalable } = inputTypeColDef;
    return (inputType === 'number' || calculateTotalData) && totalable !== false;
  };

  public getSearchFormData = () => {
    return (
      this.props.searchFormData ||
      (this.$searchForm ? this.$searchForm.getFieldsValue() : undefined)
    );
  };

  public getTableFormData = () => {
    return (
      this.props.tableFormData || (this.$tableForm ? this.$tableForm.getFieldsValue() : undefined)
    );
  };

  public getCreateFormData = () => {
    return (
      this.props.createFormData ||
      (this.$createForm ? this.$createForm.getFieldsValue() : undefined)
    );
  };

  public onSearch = () => {
    if (!this.props.onSearch) return;

    this.props.onSearch(this.getEventData());
  };

  public onReset = () => {
    if (!this.props.onReset) return;

    this.props.onReset(this.getEventData());
  };

  public getCreateable = () => {
    if ('createable' in this.props) {
      return this.props.createable;
    }
    return (
      !!this.props.createFormControls.length ||
      !!this.props.createModalContent ||
      this.props.createButton
    );
  };

  public getSearchable = () => {
    if ('searchable' in this.props) {
      return this.props.searchable;
    }
    return !!this.props.searchFormControls.length;
  };

  public getEditable = () => {
    if ('editable' in this.props) {
      return this.props.editable;
    }
    return this.getColumnEditable(this.props.tableColumnDefs);
  };

  public onCreateFormChange = (values, changed) => {
    if (!this.props.onCreateFormChange) return;

    this.props.onCreateFormChange(values, this.props.dataSource, this.getTableFormData(), changed);
  };

  public onSearchFormChange = (formData, changed, oldFormData) => {
    if (!this.props.onSearchFormChange) return;

    this.props.onSearchFormChange({
      formData,
      changed,
      oldFormData,
      searchFormData: formData,
      tableFormData: this.getTableFormData(),
      tableDataSource: this.props.dataSource,
    });
  };

  public onTableFormChange = (formData, changed, oldFormData) => {
    if (!this.props.onTableFormChange) return;

    this.props.onTableFormChange({
      formData,
      changed,
      oldFormData,
      searchFormData: formData,
      tableFormData: this.getTableFormData(),
      tableDataSource: this.props.dataSource,
    });
  };

  public onCreate = () => {
    if (!this.props.onCreate) return false;

    if (!this.$createForm) {
      return this.props.onCreate();
    }

    return new Promise((resolve, reject) => {
      this.$createForm.validateFields((error, values) => {
        if (error) return resolve(false);
        judagePromise(this.props.onCreate(values), result => resolve(result));
      });
    });
  };

  public onSave = () => {
    if (!this.props.onSave) return;

    this.props.onSave({
      searchFormData: this.getSearchFormData(),
      tableDataSource: this.props.dataSource,
      tableFormData: this.getTableFormData(),
    });
  };

  public createFormRef = node => {
    // hot reload
    if (!node) return;
    this.$createForm = node.props.form;
    if (this.props.createFormProps.ref) {
      this.props.createFormProps.ref(node.props.form);
    }
    if (this.props.createFormProps.wrappedComponentRef) {
      this.props.createFormProps.wrappedComponentRef(node);
    }
  };

  public searchFormRef = node => {
    // hot reload
    if (!node) return;
    this.$searchForm = node.props.form;
    if (this.props.searchFormProps.ref) {
      this.props.searchFormProps.ref(node.props.form);
    }
    if (this.props.searchFormProps.wrappedComponentRef) {
      this.props.searchFormProps.wrappedComponentRef(node);
    }
  };

  public tableFormRef = node => {
    // hot reload
    if (!node) return;
    this.$tableForm = node.props.form;
    if (this.props.tableFormProps.ref) {
      this.props.tableFormProps.ref(node.props.form);
    }
    if (this.props.tableFormProps.wrappedComponentRef) {
      this.props.tableFormProps.wrappedComponentRef(node);
    }
  };

  public bindExtraActionClick = (preClick: IExtraActionButtonOnClick) => event => {
    if (preClick) {
      preClick({
        ...event,
        tableDataSource: this.props.dataSource,
        tableFormData: this.getTableFormData(),
      });
    }
  };

  public getHorizontalrColumnDef: (rowData: any) => IColumnDef | void = rowData => {
    const { tableProps, totalFooter, totalColDef } = this.props;
    const { getHorizontalrColumnDef } = tableProps;

    if (totalFooter && rowData[TOTAL_DATA_TAG]) {
      return {
        headerName: '总计',
        suppressFilter: true,
        ...totalColDef,
      };
    }

    if (getHorizontalrColumnDef) {
      return getHorizontalrColumnDef(rowData);
    }
  };

  public getRowIndex = rowId => {
    return this.props.dataSource.findIndex(item => item[this.props.rowKey] === rowId);
  };

  public getEventData = () => {
    return {
      searchFormData: this.getSearchFormData(),
      tableDataSource: this.props.dataSource,
      tableFormData: this.getTableFormData(),
      pagination: this.props.pagination || {},
    };
  };

  public getTableRef = node => {
    this.$table = node;
  };

  public getContextMenuItems = (
    params: TableGetContextMenuItemsParams
  ): Array<MenuItemDef | string> => {
    const nextParams: SourceTableGetContextMenuItemsParams = {
      ...params,
      ...this.getEventData(),
    };
    if (this.props.tableProps.getContextMenuItems) {
      return this.props.tableProps.getContextMenuItems(nextParams);
    }
    return DEFAULT_CONTEXT_MENU_ITEMS;
  };

  public render() {
    const {
      rowKey,
      extraActions,
      tableProps,
      createFormProps,
      createText,
      createModalContent,
      createModalProps,
      onSwitchCreateModal,
      createButton,
      resetable,
      tableFormControls,
      tableFormProps,
      searchButtonProps,
      searchText,
      actionColDef,
      tableFormData,
      loading,
      style,
      createButtonProps,
      dobuleAction,
    } = this.props;

    const countedCreateable = this.getCreateable();

    const countedEditable = this.getEditable();

    const getActionPanel = (position = 'top') => {
      return (
        <Row
          style={
            position === 'top' ? { marginBottom: VERTICAL_GUTTER } : { marginTop: VERTICAL_GUTTER }
          }
          type="flex"
          justify="space-between"
        >
          <Row gutter={COL_GUTTER} type="flex">
            {(countedCreateable || countedEditable) && (
              <Col>
                <ButtonGroup>
                  {countedCreateable &&
                    (createButton || (
                      <ModalButton
                        type={'primary'}
                        modelContent={createModalContent}
                        onConfirm={this.onCreate}
                        onSwitchModal={onSwitchCreateModal}
                        modalProps={createModalProps}
                        formControls={this.props.createFormControls}
                        formData={this.props.createFormData}
                        onFormChange={this.onCreateFormChange}
                        formProps={{
                          footer: false,
                          controlNumberOneRow: 1,
                          wrappedComponentRef: this.createFormRef,
                          ...createFormProps,
                        }}
                        {...createButtonProps}
                      >
                        {createText}
                      </ModalButton>
                    ))}
                  {countedEditable && (
                    <Button
                      type="primary"
                      disabled={this.props.saveDisabled}
                      {...this.props.saveButtonProps}
                      onClick={this.onSave}
                      loading={this.props.saveLoading}
                    >
                      {this.props.saveText}
                    </Button>
                  )}
                </ButtonGroup>
              </Col>
            )}
            {extraActions.map((btn, index) => (
              <Col key={index}>
                {React.cloneElement(btn, {
                  ...btn.props,
                  onClick: this.bindExtraActionClick(btn.props.onClick),
                })}
              </Col>
            ))}
          </Row>

          {this.getSearchable() && (
            <ButtonGroup>
              <Button icon="search" type="primary" {...searchButtonProps} onClick={this.onSearch}>
                {searchText}
              </Button>
              {resetable && (
                <Button
                  {...this.props.resetButtonProps}
                  onClick={this.onReset}
                  loading={this.props.resetLoading}
                >
                  {this.props.resetText}
                </Button>
              )}
            </ButtonGroup>
          )}
        </Row>
      );
    };

    return (
      <div style={style}>
        {this.props.searchable !== false && !!this.props.searchFormControls.length && (
          <>
            <Form
              {...this.props.searchFormProps}
              wrappedComponentRef={this.searchFormRef}
              controls={this.props.searchFormControls}
              dataSource={this.props.searchFormData}
              footer={false}
              onChangeValue={this.onSearchFormChange}
            />
            <Divider />
          </>
        )}
        {getActionPanel()}
        {tableFormControls && <Divider />}
        <Loading loading={loading}>
          {tableFormControls && (
            <Form
              controlNumberOneRow={4}
              {...tableFormProps}
              wrappedComponentRef={this.tableFormRef}
              footer={false}
              controls={this.props.tableFormControls}
              onChangeValue={this.onTableFormChange}
              dataSource={tableFormData}
            />
          )}
          <Table
            {...tableProps}
            ref={this.getTableRef}
            loading={false}
            getContextMenuItems={this.getContextMenuItems}
            paginationProps={this.props.paginationProps}
            pagination={this.props.pagination}
            onPaginationChange={this.props.onPaginationChange}
            onPaginationShowSizeChange={this.props.onPaginationShowSizeChange}
            rowKey={rowKey}
            getHorizontalrColumnDef={this.getHorizontalrColumnDef}
            onCellValueChanged={this.onCellValueChanged}
            columnDefs={
              tableProps.vertical
                ? this.props.tableColumnDefs
                : this.getActionColumnDefs(
                    this.props.tableColumnDefs,
                    this.props.removeable,
                    this.props.insertable,
                    !!this.rowActions,
                    !!this.props.dataSource.length,
                    actionColDef
                  )
            }
            frameworkComponents={{
              ...tableProps.frameworkComponents,
              ActionCellRendererClass,
            }}
            defaultColDef={{
              ...tableProps.defaultColDef,
              editable: this.props.editable,
            }}
            rowData={this.injectTotalFooter(
              this.props.dataSource,
              this.props.totalFooter,
              this.props.tableColumnDefs,
              this.state.forceUpdateTotalFooter
            )}
            context={{
              ...tableProps.context,
              rowKey: this.props.rowKey,
              rowActions: this.rowActions,
              getRowIndex: this.getRowIndex,
            }}
          />
        </Loading>
        {this.props.dataSource &&
          !!this.props.dataSource.length &&
          dobuleAction &&
          getActionPanel('bottom')}
      </div>
    );
  }
}

export default SourceTableBase;
export * from './constants';
export * from './interface';
