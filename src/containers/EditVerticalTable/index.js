import React, { PureComponent } from 'react';
import Type from 'prop-types';
import { selectNoGroup } from '@/containers/EditVerticalTable/selector';
import {
  EMPTY_HEADER_CELL_TAG,
  GROUP_CELL_TAG,
  EMPTY_CELL_TAG,
} from '@/containers/EditVerticalTable/constants';
import { Dropdown, Row, Icon } from 'antd';
import lodash from 'lodash';
import multi from 'classnames';
import styles from './index.less';
import { EventBus } from '@/containers/EditVerticalTable/utils';
import DataSourceItem from '@/containers/EditVerticalTable/DataSourceItem';
import { toggleItem, isType } from '@/tools';

class EditVerticalTable extends PureComponent {
  static propTypes = {
    // [ { children: [] } ]
    dataSource: Type.array,
    columns: Type.array,
    add: Type.bool,
    noAffix: Type.bool,
    createrMenu: Type.oneOfType([Type.func, Type.element]),
    rowMenu: Type.oneOfType([Type.func, Type.element, Type.bool]),
    extraRowMenuItems: Type.oneOfType([Type.func, Type.element]),
  };

  static defaultProps = {
    columns: [],
    dataSource: [],
    add: true,
    noAffix: false,
  };

  shouldUpdateGroupAndFieldColumns = true;

  constructor(props) {
    super(props);
    this.state = {
      // 高亮的横纵字段
      lightColumnName: null,
      activeMouseGroupName: null,
      // 指定对应 group 的展开关闭状态
      closeGroupNames: [],
      lightRowId: null,
      hoverRowId: null,
    };
  }

  componentWillUpdate = (nextProps, nextState) => {
    const { closeGroupNames } = this.state;
    const { columns } = this.props;

    const closeGroupNamesChanged = !lodash.isEqual(nextState.closeGroupNames, closeGroupNames);
    this.shouldUpdateGroupAndFieldColumns = closeGroupNamesChanged || columns !== nextProps.columns;
  };

  componentDidMount = () => {
    const { props } = this;
    props.node?.(this);

    this.$table.addEventListener('scroll', () => {
      EventBus.emit('scroll');
    });
  };

  selectGroupAndFieldColumns = countColumns => {
    const { closeGroupNames } = this.state;
    if (!this.shouldUpdateGroupAndFieldColumns) {
      return {
        groupColumns: this.groupColumns,
        fieldColumns: this.fieldColumns,
      };
    }

    this.groupColumns = [];
    this.fieldColumns = [];

    const markCountColumns = countColumns.map(item => {
      return {
        ...item,
        $close: item.children && closeGroupNames.includes(item.name),
      };
    });

    // eslint-disable-next-line consistent-return
    markCountColumns.forEach(item => {
      if (!item.children) {
        return this.groupColumns.push({
          $type: EMPTY_CELL_TAG,
        });
      }

      if (item.children && item.children.length) {
        const { children, ...rest } = item;
        this.groupColumns.push({
          ...rest,
          $type: GROUP_CELL_TAG,
        });
        if (!item.$close) {
          lodash.range(item.children.length - 1).forEach(() => {
            this.groupColumns.push({
              $type: EMPTY_CELL_TAG,
            });
          });
        }
      }
    });

    // eslint-disable-next-line consistent-return
    markCountColumns.forEach(item => {
      if (!item.children) {
        return this.fieldColumns.push(item);
      }
      if (item.children && item.children.length) {
        if (!item.$close) {
          item.children.forEach(it => {
            this.fieldColumns.push({
              ...it,
              $parent: item.name,
            });
          });
        } else {
          this.fieldColumns.push({
            ...item.children[0],
            $parent: item.name,
          });
        }
      }
    });

    return {
      groupColumns: this.groupColumns,
      fieldColumns: this.fieldColumns,
    };
  };

  getFillBar = (groupColumns, noGroup) => {
    const { dataSource } = this.props;
    if (!dataSource.length) {
      return {
        group: [],
        field: [],
      };
    }
    if (groupColumns.length === 0 || noGroup) {
      return {
        group: [],
        field: [EMPTY_HEADER_CELL_TAG],
      };
    }
    return {
      group: [EMPTY_HEADER_CELL_TAG],
      field: [EMPTY_HEADER_CELL_TAG],
    };
  };

  handleHoverGroupField = activeMouseGroupName => {
    this.setState({ activeMouseGroupName });
  };

  handleDataSourceItemChange = event => {
    this.props.onEdit?.(event); // eslint-disable-line react/destructuring-assignment
  };

  handleCellFocus = (columnName, rowId) => {
    this.setState({
      lightColumnName: columnName,
      lightRowId: rowId,
    });
  };

  handleCellBlur = () => {
    this.setState({
      lightColumnName: null,
      lightRowId: null,
    });
  };

  handleRowMouseEnter = rowId => {
    this.setState({
      hoverRowId: rowId,
    });
  };

  handleRowMouseLeave = () => {
    this.setState({
      hoverRowId: null,
    });
  };

  handleHeaderSpread = grupCloumn => {
    const { closeGroupNames } = this.state;
    this.setState({
      closeGroupNames: toggleItem(closeGroupNames, grupCloumn.name),
    });
  };

  render() {
    const {
      columns,
      dataSource,
      add,
      noAffix,
      createrMenu,
      rowMenu,
      extraRowMenuItems,
    } = this.props;
    const { lightColumnName, activeMouseGroupName, lightRowId, hoverRowId } = this.state;

    const { groupColumns, fieldColumns } = this.selectGroupAndFieldColumns(columns);
    const noGroup = selectNoGroup(groupColumns);
    const fillBar = this.getFillBar(groupColumns, noGroup);

    return (
      <div className={styles.table}>
        <div className={styles.header}>
          {/* group row */}
          {!noGroup && (
            <div className={multi(styles.commonRow, styles.borderLeft)}>
              {[...fillBar.group, ...groupColumns].map((item, index) => {
                if (item === EMPTY_HEADER_CELL_TAG) {
                  // eslint-disable-next-line react/no-array-index-key
                  return <div key={index} className={styles.headerCell} />;
                }
                return item.$type === GROUP_CELL_TAG ? (
                  <div
                    key={item.name || index}
                    onMouseEnter={() => {
                      this.handleHoverGroupField(item.name);
                    }}
                    onMouseLeave={() => {
                      this.handleHoverGroupField(null);
                    }}
                    onClick={() => this.handleHeaderSpread(item, index)}
                    className={multi(styles.groupColumnCell, styles.pointer)}
                  >
                    <Icon type={item.$close ? 'plus' : 'minus'} />
                    {item.name}
                  </div>
                ) : (
                  <div key={item.name || index} className={styles.groupColumnCell} />
                );
              })}
            </div>
          )}
          <div
            className={multi(styles.commonRow, {
              [styles.lightRight]: !!dataSource.length && hoverRowId === dataSource[0].id,
              [styles.borderLeft]: noGroup,
            })}
          >
            {[...fillBar.field, ...fieldColumns].map((item, index) => {
              if (item === EMPTY_HEADER_CELL_TAG) {
                // eslint-disable-next-line react/no-array-index-key
                return <div key={index} className={styles.headerCell} />;
              }
              return (
                <div
                  key={item.name}
                  className={multi(styles.columnCell, {
                    [styles.light]: lightColumnName === item.name,
                    [styles.lightBit]:
                      lightColumnName !== item.name && activeMouseGroupName === item.$parent,
                  })}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
        <div
          ref={node => {
            this.$table = node;
          }}
          className={styles.body}
        >
          {/* 渲染每列数据 */}
          {dataSource.map((dataSourceItem, index) => {
            return (
              <DataSourceItem
                noAffix={noAffix}
                columns={columns}
                key={dataSourceItem.id}
                index={index}
                createrMenu={createrMenu}
                rowMenu={rowMenu}
                borderLeft={index === 0}
                fieldColumns={fieldColumns}
                dataSourceItem={dataSourceItem}
                lightColumnName={lightColumnName}
                lightRowId={lightRowId}
                isLastRow={index === dataSource.length - 1}
                isFirstRow={index === 0}
                hoverRowId={hoverRowId}
                extraRowMenuItems={extraRowMenuItems}
                hoverRowIsOnMyRight={
                  index < dataSource.length - 1 ? hoverRowId === dataSource[index + 1].id : false
                }
                onRowMouseEnter={this.handleRowMouseEnter}
                onRowMouseLeave={this.handleRowMouseLeave}
                onCellBlur={this.handleCellBlur}
                onCellFocus={this.handleCellFocus}
                onEdit={this.handleDataSourceItemChange}
                onLegTypeReplace={this.handleLeg}
              />
            );
          })}
          {add && (
            <div className={styles.addRow}>
              {[...fillBar.field, ...fieldColumns].map((item, index) => {
                if (item === EMPTY_HEADER_CELL_TAG) {
                  return (
                    <Dropdown
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className={styles.headerCell}
                      trigger={['click']}
                      overlay={isType(createrMenu, 'Function') ? createrMenu() : createrMenu}
                    >
                      <Row type="flex" justify="center" align="middle">
                        <Icon style={{ fontSize: 16 }} type="plus" />
                      </Row>
                    </Dropdown>
                  );
                }
                return <div key={item.name} className={multi(styles.columnCell)} />;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EditVerticalTable;
