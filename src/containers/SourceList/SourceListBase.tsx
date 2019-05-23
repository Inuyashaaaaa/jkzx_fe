import { Button, Col, Divider, List, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { PureComponent } from 'react';
import { toggleItem } from '@/tools';
import Form from '../Form';
import Loading from '../Loading';
import ListHeader from './ListHeader';
import RenderItem from './RenderItem';
import { SourceListBaseProps } from './types';

const ButtonGroup = Button.Group;

class SourceBaseList extends PureComponent<SourceListBaseProps> {
  public static defaultProps = {
    rowSelection: 'single',
    selectable: false,
    selectedRowKeys: [],
    loading: false,
    dataSource: [],
    searchFormProps: {},
    resetable: false,
    searchable: false,
    resetText: '重置',
    searchText: '搜索',
  };

  public $searchForm: WrappedFormUtils = null;

  public state = {
    searchText: '',
  };

  public $listHeader: ListHeader = null;

  constructor(props) {
    super(props);
    if (!props.rowKey) {
      throw new Error('SoureList rowKey must be exist!');
    }
  }

  public onSelectRow = (rowIds, index?) => {
    if (!this.props.onSelectRow) return;

    rowIds = Array.isArray(rowIds) ? rowIds : [rowIds];

    const { selectable, rowSelection } = this.props;
    const selectedRowKeys = this.props.selectedRowKeys;
    let next = [];

    if (!selectable) return;

    if (rowSelection === 'single') {
      next = selectedRowKeys[0] === rowIds[0] ? [] : rowIds;
    } else {
      next = rowIds.reduce(
        (selectedRowKeys, item) => toggleItem(selectedRowKeys, item),
        selectedRowKeys
      );
    }

    this.setSelectedRowKey(next);
  };

  public setSelectedRowKey = selectedRowKeys => {
    return this.props.onSelectRow({
      selectedRowKeys,
      selectedRows: this.getSelectedRecord(selectedRowKeys),
    });
  };

  public getSelectedRecord = selectedRowKeys => {
    return this.props.dataSource.filter(item => selectedRowKeys.includes(item[this.props.rowKey]));
  };

  public getSelectedPanel = (selectedKey, dataSource) => {
    if (!dataSource.length) return undefined;

    return (
      <div style={{ position: this.props.pagination ? 'absolute' : 'initial', bottom: 17 }}>
        {!!selectedKey.length ? (
          <div>
            {selectedKey.length} / {dataSource.length} 项
          </div>
        ) : (
          <div>{dataSource.length} 项</div>
        )}
      </div>
    );
  };

  public searchFormRef = node => {
    // hot reload
    if (!node) return;
    this.$searchForm = node.props.form;
    if (this.props.searchFormProps.wrappedComponentRef) {
      this.props.searchFormProps.wrappedComponentRef(node);
    }
  };

  public onSearchButtonClick = domEvent => {
    if (this.props.onSearchButtonClick) {
      return this.props.onSearchButtonClick({
        domEvent,
        searchFormData: this.getSearchFormData(),
      });
    }
  };

  public onResetButtonClick = domEvent => {
    if (this.props.onResetButtonClick) {
      return this.props.onResetButtonClick({
        domEvent,
        searchFormData: this.getSearchFormData(),
      });
    }
  };

  public getSearchFormData = () => {
    return this.props.searchFormData || this.$searchForm.getFieldsValue();
  };

  public getResetable = () => {
    if ('resetable' in this.props) {
      return this.props.resetable;
    }

    return !!this.props.searchFormControls.length;
  };

  public render() {
    const {
      title,
      renderItem = this.defaultRenderItem,
      rowKey,
      loading,
      dataSource,
      rowSelection,
      selectable,
      onRemove,
      onSelectRow,
      selectedRowKeys,
      removeable,
      removeLoadings,
      searchFormProps,
      searchFormControls,
      searchFormData,
      onSearchFormChange,
      action,
      searchButtonProps,
      searchText,
      resetable,
      resetButtonProps,
      resetLoading,
      resetText,
      style,
      searchable,
      onSearchButtonClick,
      ...rest
    } = this.props;

    const isResetable = this.getResetable();

    return (
      <div style={style}>
        <>
          {searchable && (
            <Form
              footer={false}
              controlNumberOneRow={1}
              {...searchFormProps}
              wrappedComponentRef={this.searchFormRef}
              controls={searchFormControls}
              dataSource={searchFormData}
              onValueChange={onSearchFormChange}
            />
          )}
          <Row style={{ marginBottom: 10, marginTop: 10 }} type="flex" justify="space-between">
            {action || <Col />}
            {searchable ? (
              <ButtonGroup>
                <Button
                  size="small"
                  icon="search"
                  type="primary"
                  {...searchButtonProps}
                  onClick={this.onSearchButtonClick}
                >
                  {searchText}
                </Button>
                {isResetable && (
                  <Button
                    size="small"
                    {...resetButtonProps}
                    onClick={this.onResetButtonClick}
                    loading={resetLoading}
                  >
                    {resetText}
                  </Button>
                )}
              </ButtonGroup>
            ) : (
              <Col />
            )}
          </Row>
        </>

        <List
          bordered={true}
          dataSource={dataSource}
          loading={{
            spinning: !!loading,
            indicator: <Loading />,
          }}
          header={<ListHeader title={title} />}
          {...rest}
          renderItem={(data, index) => (
            <RenderItem
              selectable={selectable}
              onClick={this.bindSelectRowHandle(data, index)}
              selected={selectedRowKeys.indexOf(data[rowKey]) !== -1}
            >
              {renderItem({
                rowId: data[rowKey],
                rowData: data,
                rowIndex: index,
              })}
            </RenderItem>
          )}
          footer={this.getSelectedPanel(selectedRowKeys, dataSource)}
        />
      </div>
    );
  }

  private bindSelectRowHandle = (data, index) => () => {
    return this.onSelectRow(data[this.props.rowKey], index);
  };

  private defaultRenderItem = data => data[this.props.rowKey];
}

export default SourceBaseList;
