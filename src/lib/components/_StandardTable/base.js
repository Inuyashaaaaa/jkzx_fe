import ButtonGroup from '@/lib/components/_ButtonGroup';
import EditTable from '@/lib/components/_EditTable';
import { StandardTableBase as types } from '@/lib/components/_StandardTable/types';
import { isType, toggleItem } from '@/lib/utils';
import { Alert, Checkbox, Col, Icon, Row, Table } from 'antd';
import multi from 'classnames';
import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTableBase extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    edit: false,
    loading: false,
    rowKey: 'id',
    bordered: true,
    dataSource: [],
    columns: [],
    showTotal: false,
  };

  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      // @todo move to HOC
      needTotalList,
    };
  }

  // static getDerivedStateFromProps(nextProps) {
  //   // clean state
  //   if (nextProps.selectedRows?.length === 0) {
  //     const needTotalList = initTotalList(nextProps.columns);
  //     return {
  //       selectedRowKeys: [],
  //       needTotalList,
  //     };
  //   }
  //   return null;
  // }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { selectedColumnKeys, onSelect } = this.props;
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    onSelect?.({
      selectedRows,
      selectedRowKeys,
      selectedColumnKeys,
    });
    this.setState({ needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange?.(pagination, filters, sorter); // eslint-disable-line react/destructuring-assignment
  };

  handleTableEdit = event => {
    this.props.onEdit?.(event); // eslint-disable-line react/destructuring-assignment
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  handleBtnClick = event => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onBtnClick?.(event);
  };

  handleColumnSelect = item => {
    const { dataIndex } = item;
    const { selectedColumnKeys, selectedRowKeys, onSelect, dataSource, rowKey } = this.props;
    const nextSelectedColumnKeys = toggleItem(selectedColumnKeys, dataIndex);
    onSelect?.({
      selectedColumnKeys: nextSelectedColumnKeys,
      selectedRowKeys,
      selectedRows: dataSource.filter(it => selectedColumnKeys.includes(it[rowKey])),
    });
  };

  getRowClassName = record => {
    const { selectedRowKeys, selectedColumnKeys, rowKey } = this.props;

    return !selectedColumnKeys?.length && selectedRowKeys?.includes(record[rowKey])
      ? 'antd-pro-components-_-standard-table-index-rowSelected'
      : '';
  };

  getButtonGroupInner = ({ items, ...rest }) => {
    const { selectedRowKeys, selectedColumnKeys } = this.props;

    return (
      <ButtonGroup
        {...rest}
        items={items.map(item => {
          if (item.batch) {
            const isSignle = item.batch === 'signle';
            return {
              ...item,
              disabled: isSignle
                ? selectedRowKeys?.length !== 1 && selectedColumnKeys?.length !== 1
                : selectedRowKeys?.length <= 0 && selectedColumnKeys?.length <= 0,
              batch: undefined,
            };
          }
          return item;
        })}
        onClick={this.handleBtnClick}
      />
    );
  };

  getButtonGroup = area => {
    if (!area) return;
    area = isType(area, 'Array') ? { items: area } : area;
    return React.isValidElement(area) ? area : this.getButtonGroupInner(area);
  };

  render() {
    const { needTotalList } = this.state;
    const {
      dataSource,
      pagination,
      loading,
      rowKey,
      selectedRowKeys,
      selectedColumnKeys,
      extra,
      section,
      toes,
      edit,
      columns,
      lineNumber,
      showTotal,
      ...tableProps
    } = this.props;

    const usedPagination =
      pagination === false
        ? false
        : {
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
          };

    const rowSelection = !!columns.length &&
      selectedRowKeys && {
        distSelectedRowKeys: selectedRowKeys,
        onChange: this.handleRowSelectChange,
        getCheckboxProps: record => ({
          disabled: record.disabled,
        }),
      };

    let afterDataSource = dataSource;
    let afterColumns = selectedColumnKeys
      ? columns.map(item => {
          if (item.selectable) {
            return {
              ...item,
              selectable: undefined,
              onCell: record => {
                return {
                  className: multi(item.className, {
                    [styles.columnSelected]:
                      selectedRowKeys?.length > 0 && selectedColumnKeys
                        ? selectedColumnKeys.includes(item.dataIndex) &&
                          selectedRowKeys.includes(record[rowKey])
                        : selectedColumnKeys.includes(item.dataIndex),
                  }),
                };
              },
              title: (
                <span>
                  {item.title}
                  <Checkbox
                    style={{ marginLeft: 8 }}
                    onChange={() => this.handleColumnSelect(item)}
                  />
                </span>
              ),
            };
          }
          return item;
        })
      : columns;

    // handle lineNumber
    if (lineNumber) {
      afterColumns = [
        {
          title: isType(lineNumber, 'String') ? lineNumber : '行号',
          dataIndex: 'lineNumber',
          render: val => val,
        },
        ...afterColumns,
      ];

      afterDataSource = dataSource.map((item, index) => {
        return {
          ...item,
          lineNumber: index,
        };
      });
    }

    // handle showTotal
    if (showTotal) {
      const totalItem = columns
        .map(item => item.dataIndex)
        .map(dataIndex => {
          return {
            [dataIndex]: afterDataSource.reduce((total, nextDataSourceItem) => {
              total += Number(nextDataSourceItem[dataIndex]) || 0;
              return total;
            }, 0),
          };
        })
        .reduce((pre, next) => ({ ...pre, ...next }));

      if (isType(showTotal, 'String')) {
        totalItem[showTotal] = '总计';
      }

      totalItem.id = Math.random() + new Date().getTime();

      afterDataSource = [...afterDataSource, totalItem];
    }

    const commonTableProps = {
      ...tableProps,
      loading: { indicator: <Icon type="loading" spin />, spinning: loading },
      rowKey,
      rowSelection,
      dataSource: afterDataSource,
      columns: afterColumns,
      rowClassName: this.getRowClassName,
      pagination: usedPagination,
      onChange: this.handleTableChange,
      onEdit: this.handleTableEdit,
    };

    return (
      <div className={styles.standardTable}>
        {(extra || section) && (
          <Row
            className={styles.tableListOperator}
            type="flex"
            justify="space-between"
            align="middle"
          >
            <Col md={16} xs={24}>
              {this.getButtonGroup(section)}
            </Col>
            <Col md={8} xs={24}>
              <Row type="flex" justify="end">
                {this.getButtonGroup(extra)}
              </Row>
            </Col>
          </Row>
        )}
        {rowSelection && (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a
                    onClick={this.cleanSelectedKeys}
                    style={{ marginLeft: needTotalList.length ? 24 : 0 }}
                  >
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        {edit ? (
          // EditTable has actions default value
          <EditTable {...commonTableProps} actions={isType(edit, 'Array') ? edit : undefined} />
        ) : (
          <Table {...commonTableProps} />
        )}
        <div
          className={multi(styles.toes, {
            [styles.moveUp]: !loading,
          })}
        >
          {this.getButtonGroup(toes)}
        </div>
      </div>
    );
  }
}

export default StandardTableBase;
