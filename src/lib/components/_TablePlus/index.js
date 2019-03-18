import { getBodyCell, getBodyRow } from '@/lib/components/_TablePlus/BodyRow';
import ResizeableHeaderCell from '@/lib/components/_TablePlus/ResizeableHeaderCell';
import SectionTemplate from '@/lib/components/_TablePlus/SectionTemplate';
import { TablePlus as types } from '@/lib/components/_TablePlus/types';
import VerticalTable from '@/lib/components/_TablePlus/VerticalTable';
import { isType, toggleItem } from '@/lib/utils';
import { Button, Checkbox, Icon, Row, Table, Tag } from 'antd';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import memoizeOne from 'memoize-one';
import lodash from 'lodash';
import './index.less';

class TablePlus extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    rowKey: 'id',
    hideSelection: false,
    dataSource: [],
    columns: [],
    loading: false,
    size: 'middle',
    hideTableHead: false,
  };

  state = {
    depends: [],
  };

  $editableRows = [];

  componentDidMount = () => {
    const { getTableRef } = this.props;
    getTableRef?.(this);
  };

  getEditableColumns = memoizeOne((columns, rowKey, depends) => {
    return columns.map(col => {
      if (col.editable) {
        return {
          ...col,
          onCell: record => {
            const bodyCellProps = col.onCell?.(record);
            const id = record[rowKey];
            return {
              formItem: col.formItem,
              ...bodyCellProps,
              depend: !!depends[id]?.includes(col.dataIndex),
              dataIndex: col.dataIndex,
              record,
              editable: isType(col.editable, Function) ? col.editable(record) : col.editable,
              editing: isType(col.editing, Function) ? col.editing(record) : col.editing,
              onStartEdit: this.handleStartEditCell,
              onHightlightDepends: this.handleHightlightDepends,
            };
          },
        };
      }
      return col;
    });
  });

  getResizeableColumns = memoizeOne(columns => {
    return columns.map(col => {
      if (col.resizeable && col.width) {
        return {
          ...col,
          onHeaderCell: column => {
            const headerCellProps = col.onHeaderCell?.(column);

            return {
              ...headerCellProps,
              width: column.width,
              onResize: this.handleResize(column),
            };
          },
        };
      }
      return col;
    });
  });

  getSelectionColumns = memoizeOne((columns, columnSelection, dataSource) => {
    return columns.map(col => {
      if (!columnSelection || col.hideSelector) return col;

      const { selectedColumnKeys = [], onChange } = columnSelection;

      const value = selectedColumnKeys.includes(col.dataIndex);

      return {
        ...col,
        onCell: record => {
          const cellProps = col.onCell?.(record);
          return {
            ...cellProps,
            className: classNames(cellProps?.className, {
              'tongyu-table-plus-col-selected': selectedColumnKeys.includes(col.dataIndex),
            }),
          };
        },
        title: (
          <div>
            <Checkbox
              checked={value}
              disabled={!dataSource.length}
              onClick={event => {
                event.stopPropagation();
              }}
              onChange={() => {
                onChange?.(toggleItem(selectedColumnKeys, col.dataIndex));
              }}
            />{' '}
            {col.title}
          </div>
        ),
      };
    });
  });

  getTableSizeColumns = memoizeOne((columns, tableSize, editable) => {
    return columns.map(col => {
      if (!editable) return col;
      const { onCell } = col;
      return {
        ...col,
        onCell: record => {
          const cellProps = onCell?.(record);
          return {
            ...cellProps,
            tableSize,
          };
        },
      };
    });
  });

  getEditable = memoizeOne(columns => {
    return columns.some(item => !!item.editable);
  });

  getResizeable = memoizeOne(columns => {
    return columns.some(item => !!item.resizeable);
  });

  moveRow = (dragIndex, hoverIndex) => {
    const { onMove, dataSource } = this.props;
    const dragRow = dataSource[dragIndex];
    onMove?.({ dragIndex, hoverIndex, dragRow });
  };

  handleResize = column => (e, { size }) => {
    const { onResize } = this.props;
    onResize?.({ column, size });
  };

  handleEditCell = (row, field) => {
    const { onEdit } = this.props;
    onEdit?.({ row, field });
  };

  handleStartEditCell = (row, dataIndex) => {
    const { onStartEdit } = this.props;
    onStartEdit?.({ row, dataIndex });
  };

  handleCopyRow = (row, index) => () => {
    const { onCopy } = this.props;
    onCopy?.({ row, index });
  };

  handleRemoveRow = (row, index) => () => {
    const { onRemove } = this.props;
    onRemove?.({ row, index });
  };

  handleHightlightDepends = (record, dependsByKey) => {
    const { rowKey } = this.props;
    this.setState({
      depends: {
        // ...depends, moveLeave some time not trigger, in fact, need one dependsByKey same time.
        [record[rowKey]]: dependsByKey,
      },
    });
  };

  getTotalList = () => {
    const { columns, dataSource, rowSelection = {}, rowKey } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    const selectedRows = dataSource.filter(item => selectedRowKeys.includes(item[rowKey]));
    const totalList = columns
      .filter(col => col.renderTotal)
      .map(item => ({
        ...item,
        $total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
      }));
    return totalList;
  };

  onRow = editable => (record, index) => {
    const { rowKey, dragable, copyable, removeable, dropMenu } = this.props;

    // React does not recognize the `xxxXxx` prop on a DOM element
    let rowProps = {
      index,
      record,
    };

    if (dragable) {
      rowProps = {
        ...rowProps,
        dragable,
        moveRow: this.moveRow,
      };
    }

    if (editable) {
      rowProps = {
        ...rowProps,
        $editableRows: this.$editableRows,
        className: 'editable-row',
        editable,
        onEditCell: this.handleEditCell,
        rowId: record[rowKey],
      };
    }

    if (copyable) {
      rowProps = {
        ...rowProps,
        copyable,
        onCopyRow: this.handleCopyRow(record, index),
      };
    }

    if (removeable) {
      rowProps = {
        ...rowProps,
        removeable,
        onRemoveRow: this.handleRemoveRow(record, index),
      };
    }

    if (dropMenu) {
      rowProps = {
        ...rowProps,
        dropMenu,
      };
    }

    return rowProps;
  };

  validateTable = async cb => {
    const results = await Promise.all(
      this.$editableRows?.map(editableRow => {
        return new Promise(resolve => {
          editableRow.validateRow(validation => {
            resolve(validation);
          });
        });
      })
    );
    const errors = results.filter(validation => validation[1]);
    const error = errors.length === 0 ? null : lodash.fromPairs(errors);
    cb?.(error);
    return { error };
  };

  render() {
    const {
      dragable,
      editing,
      columnSelection,
      copyable,
      removeable,
      dropMenu,
      createable,
      hideSelection,
      onCreate,
      loading,
      sections,
      pagination,
      createLoading,
      vertical,
      style,
      hideTableHead,
      ...rest
    } = this.props;

    const { depends } = this.state;

    let { columns } = rest;

    const { rowKey, rowSelection, dataSource, size, className } = rest;

    const editable = this.getEditable(columns);

    const resizeable = this.getResizeable(columns);

    const dropable = dropMenu || copyable || removeable;

    const showCreator = createable && dataSource.length === 0;

    const components = {
      header: {
        cell: resizeable ? ResizeableHeaderCell : undefined,
      },
      body: {
        row: getBodyRow(editable, dragable, dropable),
        cell: getBodyCell(editable, dragable, dropable),
      },
    };

    columns = this.getTableSizeColumns(
      this.getResizeableColumns(
        this.getSelectionColumns(
          this.getEditableColumns(columns, rowKey, depends),
          columnSelection,
          dataSource
        )
      ),
      size,
      editable
    );

    const tableProps = {
      ...rest,
      components,
      bordered: true,
      columns,
      className: classNames('tongyu-table-plus', className, {
        createable: showCreator,
        'hide-table-header': hideTableHead,
      }),
      onRow: this.onRow(editable, resizeable),
      loading: showCreator ? false : { indicator: <Icon type="loading" spin />, spinning: loading },
      pagination:
        pagination === false
          ? false
          : {
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]} - ${range[1]} 共 ${total} 项`,
              size: 'small',
              ...pagination,
            },
    };

    return (
      <div style={style}>
        <SectionTemplate
          columns={columns}
          sections={sections}
          selectedColumnKeys={columnSelection?.selectedColumnKeys}
          selectedRowKeys={rowSelection?.selectedRowKeys}
          pagination={pagination}
        >
          {!hideSelection && (rowSelection || columnSelection) && (
            <Row
              type="flex"
              justify="flex-start"
              align="middle"
              className="tongyu-table-plus-alert"
            >
              <Icon className="tongyu-table-plus-alert-icon" type="info-circle" theme="filled" />
              <span>已选择&nbsp;</span>
              {rowSelection && (
                <span>
                  <a style={{ fontWeight: 600 }}>{rowSelection.selectedRowKeys?.length || 0}</a>
                  &nbsp;行&nbsp;
                </span>
              )}
              {columnSelection && (
                <span>
                  <a style={{ fontWeight: 600 }}>
                    {columnSelection.selectedColumnKeys?.length || 0}
                  </a>
                  &nbsp;列&nbsp;
                </span>
              )}
              {!!rowSelection?.selectedRowKeys?.length &&
                this.getTotalList().map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    <Tag color="blue">
                      {item.title} 总计{' '}
                      <span style={{ fontWeight: 600 }}>
                        {item.renderTotal ? item.renderTotal(item.$total) : item.$total}
                      </span>
                    </Tag>
                  </span>
                ))}
            </Row>
          )}

          {vertical ? <VerticalTable {...tableProps} /> : <Table {...tableProps} />}

          {showCreator && (
            <Button
              loading={createLoading}
              size="large"
              style={{ marginTop: 8 }}
              block
              type="dashed"
              onClick={onCreate}
            >
              新建一行
            </Button>
          )}
        </SectionTemplate>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(TablePlus);
