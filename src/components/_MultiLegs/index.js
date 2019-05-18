import React, { PureComponent } from 'react';
import TablePlus from '@/components/_TablePlus';
import memoizeOne from 'memoize-one';
import { allLeg } from '@/components/_MultiLegs/constants';
import { MultiLegs as types } from '@/components/_MultiLegs/types';
import classNames from 'classnames';
import './index.less';

class MultiLegs extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    legs: allLeg,
    rowKey: 'id',
  };

  getColumns = memoizeOne((legs, dataSource) => {
    const curTypes = dataSource.map(item => item.type);
    return legs
      .filter(leg => {
        return curTypes.includes(leg.type);
      })
      .reduce((arr, leg) => {
        return arr.concat(
          leg.columns.map(col => {
            return {
              ...col,
              $type: leg.type,
            };
          })
        );
      }, [])
      .reduce((arr, col) => {
        const { title, dataIndex, $type, ...formItem } = col;

        const oldCol = arr.find(old => old.dataIndex === col.dataIndex);
        if (oldCol) {
          oldCol.formItems = {
            ...oldCol.formItems,
            [$type]: formItem,
          };
          return arr;
        }

        return arr.concat({
          title,
          dataIndex,
          formItems: {
            [$type]: formItem,
          },
        });
      }, [])
      .map(col => {
        return {
          ...col,
          onCell: record => {
            const { formItems } = col;
            const { type } = record;
            return {
              formItem: formItems[type],
            };
          },
        };
      });
  });

  getEditableColumns = memoizeOne((columns, editings) => {
    return columns.map(col => {
      const { dataIndex } = col;
      return {
        editable: true,
        editing: record => editings?.(dataIndex, record),
        ...col,
      };
    });
  });

  render() {
    const { legs, editings, className, ...rest } = this.props;
    const { dataSource } = rest;

    const columns = this.getEditableColumns(this.getColumns(legs, dataSource), editings);

    return (
      <TablePlus
        {...rest}
        vertical
        columns={columns}
        className={classNames(className, 'tongyu-multi-legs')}
      />
    );
  }
}

export default MultiLegs;
