import SourceTable from '@/containers/SourceTable';
import { wrapType } from '@/utils';
import { Col } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import cache from 'memoize-one';
import { array, arrayOf, bool, func, shape, string } from 'prop-types';
import React, { PureComponent } from 'react';

class CascaderSourceTable extends PureComponent {
  static propTypes = {
    queryNodes: func,
    nodes: array,
    tables: arrayOf(
      shape({
        rowKey: string.isRequired,
        multiSelect: bool,
      })
    ),
    onUpdateTables: func,
  };

  static defaultProps = {
    tables: [],
  };

  static getSelectedRowsByKeys = table => {
    return table.selectedKeys.map(selectedKey =>
      table.tableDataSource.find(item => item[table.rowKey] === selectedKey)
    );
  };

  static nodeIsEuqal = (paths, matchNode, node) => {
    const left = paths.map(path => {
      return matchNode[path];
    });
    const right = paths.map(path => node[path]);
    const ifEqual = _.isEqual(left, right);
    return ifEqual;
  };

  constructor(props) {
    super(props);
    if (props.tables.length && _.unionBy(props.tables, 'rowKey').length !== props.tables.length) {
      throw new Error('CascaderSourceTable: tables.rowKey is union!');
    }
  }

  componentDidMount = () => {
    const { onUpdateTables, tables, queryNodes } = this.props;

    queryNodes &&
      this.fetchAsyncData(() =>
        onUpdateTables(
          produce(tables, draft => {
            draft[0].tableDataSource = _.unionBy(this.getNodes(), item => item[draft[0].rowKey]);
          }),
          'fetchSuccess'
        )
      );
  };

  onRemove = cache(rowKey => (...args) => {
    const { onRemove } = this.props;
    onRemove?.(rowKey, ...args);
  });

  onCancel = cache(rowKey => (...args) => {
    const { onCancel } = this.props;
    onCancel?.(rowKey, ...args);
  });

  onCreate = cache(rowKey => (...args) => {
    const { onCreate } = this.props;
    onCreate?.(rowKey, ...args);
  });

  onCreateButtonClick = cache(rowKey => (...args) => {
    const { onCreateButtonClick } = this.props;
    onCreateButtonClick?.(rowKey, ...args);
  });

  onFormChange = cache(rowKey => (...args) => {
    const { onFormChange } = this.props;
    onFormChange?.(rowKey, ...args);
  });

  getNodes = () => {
    const { nodes } = this.props;
    return nodes || this.nodes;
  };

  fetchAsyncData = async callback => {
    const { onUpdateTables, tables } = this.props;
    onUpdateTables(
      produce(tables, draft => {
        draft[0].fetchTableLoading = true;
      }),
      'changeLoading'
    );

    const { queryNodes } = this.props;
    const { error, data } = await queryNodes();

    onUpdateTables(
      produce(tables, draft => {
        draft[0].fetchTableLoading = false;
      }),
      'changeLoading'
    );

    if (error) return;

    this.nodes = data;

    callback?.();
  };

  getTableSourceFromNodes = (nodes, paths, matchNodes, restTable) => {
    return _.unionBy(
      (matchNodes.length
        ? nodes.filter(node => {
            return matchNodes.some(matchNode => {
              return CascaderSourceTable.nodeIsEuqal(paths, matchNode, node);
            });
          })
        : nodes
      ).filter(record => {
        return !!record[restTable.columnDataIndex || restTable.rowKey];
      }),
      item => item[restTable.rowKey]
    );
  };

  onSelectRow = rowKey => (record, selected, selectedRows) => {
    const { tables, onUpdateTables, onSelectRow } = this.props;

    const mutltiSelects = tables.filter(item => item.multiSelect).map(item => item.rowKey);

    onUpdateTables?.(
      produce(tables, draftTables => {
        const tableIndex = draftTables.findIndex(item => item.rowKey === rowKey);
        const table = draftTables[tableIndex];

        if (mutltiSelects.includes(rowKey)) {
          table.selectedKeys = selectedRows.map(item => item[table.rowKey]);
        } else {
          table.selectedKeys = selected ? [record[table.rowKey]] : [];
        }

        const restTables = draftTables.slice(tableIndex + 1);
        restTables.forEach((restTable, index) => {
          const paths = draftTables.slice(0, tableIndex + index + 1).map(item => item.rowKey);
          const preTable = draftTables[tableIndex + index];
          const preTableSelectedRows = CascaderSourceTable.getSelectedRowsByKeys(preTable);
          const matchNodes = mutltiSelects.includes(restTable.rowKey)
            ? preTableSelectedRows
            : [record];

          restTable.tableDataSource = preTableSelectedRows.length
            ? this.getTableSourceFromNodes(this.getNodes(), paths, matchNodes, restTable)
            : [];

          restTable.selectedKeys = restTable.tableDataSource.map(item => {
            return item[restTable.rowKey];
          });
        });
      }),
      'select'
    );

    setTimeout(() => {
      const { tables: propsTables } = this.props;
      const selectedTableIndex = propsTables.findIndex(table => table.rowKey === rowKey);

      propsTables.slice(selectedTableIndex).forEach(restTable => {
        const restTableSelectedRows = CascaderSourceTable.getSelectedRowsByKeys(restTable);

        const selectedRow = restTableSelectedRows[restTableSelectedRows.length - 1];

        onSelectRow?.(restTable.rowKey, selectedRow, true, restTableSelectedRows);
      });
    });
  };

  render() {
    const { tables } = this.props;

    return tables.map(table => {
      const { rowKey, formItems, hideCreateButton } = table;
      return (
        <Col key={rowKey} xs={Math.round(24 / tables.length)}>
          <SourceTable
            {...table}
            formItems={() => wrapType(formItems, Function, () => formItems).call(this, tables)}
            hideCreateButton={wrapType(hideCreateButton, Function, () => hideCreateButton).call(
              this,
              tables
            )}
            rowKey={rowKey}
            onRemove={this.onRemove(rowKey)}
            onSelectRow={this.onSelectRow(rowKey)}
            onCancel={this.onCancel(rowKey)}
            onCreate={this.onCreate(rowKey)}
            onCreateButtonClick={this.onCreateButtonClick(rowKey)}
            onFormChange={this.onFormChange(rowKey)}
          />
        </Col>
      );
    });
  }
}

export default CascaderSourceTable;
