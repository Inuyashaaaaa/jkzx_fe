import React from 'react';
import { Dropdown, Menu, Form, Affix } from 'antd';
import multi from 'classnames';
import moment, { isMoment } from 'moment';
import lodash from 'lodash';
import styles from '../index.less';
import { DATE_FIELDS } from '@/lib/components/_InputControl/constants';
import { EMPTY_HEADER_CELL_TAG } from '@/lib/components/_EditVerticalTable/constants';
import { findColumn, EventBus } from '@/lib/components/_EditVerticalTable/utils';
import Field from '@/lib/components/_EditVerticalTable/DataSourceItem/Field';
import HeaderCell from '@/lib/components/_EditVerticalTable/DataSourceItem/HeaderCell';
import { isType } from '@/lib/utils';

// const getAllColumnsByDataSourceItemTypes = (types, dataIndex, legs) => {
//   const columns = lodash.flatten(
//     legs.filter(it => types.includes(it.type)).map(leg => leg.columns)
//   );
//   return findColumn(columns, dataIndex);
// };

@Form.create({
  mapPropsToFields(props) {
    const { dataSourceItem, columns } = props;
    const { data } = dataSourceItem;
    const result = {};
    Object.keys(data).forEach(dataIndex => {
      let value = data[dataIndex];
      // 双向绑定表单的时间数据入口转换
      const column = findColumn(columns, dataIndex);

      if (!column) return;

      if (
        value /* fix 清除 时间表单组件的时，得到的是 null */ &&
        DATE_FIELDS.includes(column.type)
      ) {
        value = moment(value, column.format);
      }

      // eslint-disable-next-line no-param-reassign
      result[dataIndex] = Form.createFormField({ value });
    });
    return result;
  },
  onFieldsChange(props, changedFields) {
    const { dataSourceItem, onEdit, columns } = props;
    const field = changedFields[Object.keys(changedFields)[0]];
    const { name: dataIndex } = field;
    let { value } = field;

    if (isMoment(value)) {
      const column = findColumn(columns, dataIndex);
      value = value.format(column.format);
    }

    const nextDataSourceItem = {
      ...dataSourceItem,
      data: {
        ...dataSourceItem.data,
        [dataIndex]: value,
      },
    };

    onEdit({ dataSourceItem: nextDataSourceItem, action: 'change' });
  },
})
class DataSourceItem extends React.Component {
  componentDidMount = () => {
    this.unlisten = EventBus.listen(
      'scroll',
      lodash.debounce(() => {
        this.$affix.updatePosition({});
      }, 100)
    );
  };

  componentWillUnmount = () => {
    this.unlisten && this.unlisten();
  };

  shouldComponentUpdate = nextProps => {
    const { props } = this;
    let should = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const k in nextProps) {
      if (k === 'form') {
        // eslint-disable-next-line no-continue
        continue;
      } else {
        should = nextProps[k] !== props[k];
      }
      if (should) return true;
    }
    return should;
  };

  handleCellBlur = (fieldName, id) => {
    const { onCellBlur } = this.props;
    onCellBlur(fieldName, id);
  };

  handleCellFocus = (fieldName, id) => {
    const { onCellFocus } = this.props;
    onCellFocus(fieldName, id);
  };

  move = direction => {
    const { onEdit, dataSourceItem, index } = this.props;
    onEdit({
      dataSourceItem: { ...dataSourceItem },
      action: 'move',
      options: { direction, index },
    });
  };

  handleMoveLeft = () => {
    this.move('left');
  };

  handleMoveRight = () => {
    this.move('right');
  };

  handleCopyRow = () => {
    const { onEdit, index, dataSourceItem } = this.props;
    const nextDataSourceItem = {
      ...dataSourceItem,
      id: String(new Date().getTime()),
    };
    onEdit({
      dataSourceItem: nextDataSourceItem,
      action: 'copy',
      options: { index },
    });
  };

  handleRemoveRow = () => {
    const { onEdit, dataSourceItem, index } = this.props;
    onEdit({
      dataSourceItem: { ...dataSourceItem },
      action: 'remove',
      options: { index },
    });
  };

  handleRowMouseEnter = () => {
    const { onRowMouseEnter, dataSourceItem } = this.props;
    onRowMouseEnter(dataSourceItem.id);
  };

  handleRowMouseLeave = () => {
    const { onRowMouseLeave, dataSourceItem } = this.props;
    onRowMouseLeave(dataSourceItem.id);
  };

  getRowMenu = () => {
    const {
      dataSourceItem,
      isLastRow,
      isFirstRow,
      rowMenu,
      extraRowMenuItems,
      index: dataSourceItemIndex,
    } = this.props;

    return rowMenu ? (
      isType(rowMenu, 'Function') ? (
        rowMenu({
          isFirstRow,
          isLastRow,
          dataSourceItem,
          index: dataSourceItemIndex,
        })
      ) : (
        rowMenu
      )
    ) : (
      <Menu>
        <Menu.Item onClick={this.handleCopyRow}>复制</Menu.Item>
        <Menu.Item onClick={this.handleRemoveRow}>删除</Menu.Item>
        {!isFirstRow && <Menu.Item onClick={this.handleMoveLeft}>左移</Menu.Item>}
        {!isLastRow && <Menu.Item onClick={this.handleMoveRight}>右移</Menu.Item>}
        {isType(extraRowMenuItems, 'Function')
          ? extraRowMenuItems({ dataSourceItem, index: dataSourceItemIndex })
          : extraRowMenuItems}
      </Menu>
    );
  };

  getHeader = isHoverCurRow => {
    const { rowMenu, extraRowMenuItems, dataSourceItem, lightRowId } = this.props;

    const headerCellProps = {
      dataSourceItem,
      lightRowId,
      isHoverCurRow,
      rowMenu,
    };

    return rowMenu !== false && (rowMenu || extraRowMenuItems) ? (
      <Dropdown trigger={['click']} overlay={this.getRowMenu()}>
        <HeaderCell {...headerCellProps} />
      </Dropdown>
    ) : (
      <HeaderCell {...headerCellProps} />
    );
  };

  render() {
    const {
      form,
      dataSourceItem,
      fieldColumns,
      hoverRowId,
      hoverRowIsOnMyRight,
      noAffix,
    } = this.props;

    const isHoverCurRow = dataSourceItem.id === hoverRowId;
    const fillFieldColumns = [EMPTY_HEADER_CELL_TAG, ...fieldColumns];

    return (
      <div
        className={multi(styles.commonRow, {
          [styles.lightRight]: isHoverCurRow || hoverRowIsOnMyRight,
          // [styles.lightLeft]: isHoverCurRow && isFirstRow,
        })}
        onMouseEnter={this.handleRowMouseEnter}
        onMouseLeave={this.handleRowMouseLeave}
      >
        {fillFieldColumns.map((cell, index) => {
          if (cell === EMPTY_HEADER_CELL_TAG) {
            return noAffix ? (
              this.getHeader(isHoverCurRow)
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <Affix
                key={dataSourceItem.id}
                offsetTop={0}
                ref={node => {
                  this.$affix = node;
                }}
              >
                {this.getHeader(isHoverCurRow)}
              </Affix>
            );
          }

          const { $option, $countValue, $close, ...restField } = cell;
          const countField = {
            ...restField,
            options: $option[dataSourceItem.$type],
            countValue: $countValue[dataSourceItem.$type],
          };

          return (
            <Field
              key={dataSourceItem.id + cell.dataIndex}
              form={form}
              field={countField}
              isHoverCurRow={isHoverCurRow}
              isLastCell={index === fillFieldColumns.length - 1}
              dataSourceItem={dataSourceItem}
              onCellBlur={this.handleCellBlur}
              onCellFocus={this.handleCellFocus}
            />
          );
        })}
      </div>
    );
  }
}

export default DataSourceItem;
