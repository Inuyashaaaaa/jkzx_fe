import {
  BIG_NUMBER_CONFIG,
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_ZHCH_MAP,
} from '@/constants/common';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import { TOTAL_LEGS } from '@/constants/legs';
import { Form2, Loading, Table2 } from '@/design/components';
import { ITableProps } from '@/design/components/type';
import { remove } from '@/design/utils';
import { getLegByRecord } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Tag } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';

const TOTAL_FIELD = 'TOTAL_FIELD';

const MultiLegTable = memo<
  {
    tableEl?: any;
    env: string;
    chainColumns?: (columns: ILegColDef[]) => ILegColDef[];
    totalable?: boolean;
    totalColumnIds?: string[];
  } & ITableProps
>(props => {
  const {
    tableEl = useRef<Table2>(null),
    dataSource,
    env,
    chainColumns,
    totalable = false,
    totalColumnIds = [],
    ...tableProps
  } = props;

  const [columns, setColumns] = useState([]);
  const [loadingsByRow, setLoadingsByRow] = useState({});

  useEffect(
    () => {
      setColumns(pre => {
        const multiLegColumns = dataSource.reduce((container, record) => {
          const leg = getLegByRecord(record);
          return container.concat(leg.getColumns(env));
        }, []);

        const nextUnion = getUnionLegColumns(multiLegColumns);
        const nextColumns = chainLegColumns(nextUnion);
        return nextColumns;
      });
    },
    [dataSource, loadingsByRow]
  );

  const setLoadings = (rowId: string, colId: string, loading: boolean) => {
    setLoadingsByRow(pre => {
      return {
        ..._.set(pre, [rowId], {
          ..._.get(pre, [rowId], {}),
          [colId]: loading,
        }),
      };
    });
  };

  const getUnionLegColumns = (legColDefs: ILegColDef[]) => {
    return _.unionBy(legColDefs, item => item.dataIndex);
  };

  const getOrderLegColumns = (legColDefs: ILegColDef[]) => {
    if (!legColDefs) return [];
    const notOrders = _.difference(legColDefs.map(item => item.dataIndex), LEG_FIELD_ORDERS);
    if (notOrders && notOrders.length) {
      console.error(`leg self colDef.dataIndex:[${notOrders}] not join orders yet.`);
    }
    return LEG_FIELD_ORDERS.reduce((pre, next) => {
      const colDef = legColDefs.find(item => item.dataIndex === next);
      if (colDef) {
        return pre.concat(colDef);
      }
      return pre;
    }, []).concat(notOrders.map(next => legColDefs.find(item => item.dataIndex === next)));
  };

  const getLegByType = (type: string) => {
    return TOTAL_LEGS.find(item => item.type === type);
  };

  const cellIsTotal = record => {
    return record[TOTAL_FIELD];
  };

  const cellIsEmpty = (record, colDef) => {
    const leg = getLegByType(record[LEG_TYPE_FIELD]);

    if (colDef.dataIndex === LEG_FIELD.LEG_META) {
      return false;
    }

    if (!(leg && leg.getColumns(env).find(item => item.dataIndex === colDef.dataIndex))) {
      return true;
    }

    if (colDef.exsitable && !colDef.exsitable(record)) {
      return true;
    }

    return false;
  };

  const getEmptyRenderLegColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        editable(record, index, { colDef }) {
          if (cellIsTotal(record)) {
            return false;
          }
          if (cellIsEmpty(record, colDef)) {
            return false;
          }
          if (typeof item.editable === 'function') {
            return item.editable.apply(this, arguments);
          }
          return !!item.editable;
        },
        onCell(record, index, { colDef }) {
          if (cellIsTotal(record)) {
            return {};
          }
          if (cellIsEmpty(record, colDef)) {
            return {
              style: { backgroundColor: '#fafafa' },
              ...(item.onCell ? item.onCell.apply(this, arguments) : null),
            };
          }
        },
        render(val, record, index, { colDef }) {
          if (cellIsTotal(record)) {
            return val;
          }
          if (cellIsEmpty(record, colDef)) {
            return null;
          }
          return item.render.apply(this, arguments);
        },
      };
    });
  };

  const getWidthColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        onCell() {
          return {
            width: '150px',
            ...(item.onCell ? item.onCell.apply(this, arguments) : null),
          };
        },
      };
    });
  };

  const getLoadingsColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        render(val, record, index, { colDef }) {
          const loading = _.get(loadingsByRow, [record[LEG_ID_FIELD], colDef.dataIndex], false);
          return <Loading loading={loading}>{item.render.apply(this, arguments)}</Loading>;
        },
      };
    });
  };

  const getTitleColumns = (legColDefs: ILegColDef[]) => {
    if (_.isEmpty(dataSource)) return legColDefs;
    return [
      {
        title: '结构类型',
        dataIndex: LEG_FIELD.LEG_META,
        render: (val, record) => {
          return <Tag color="blue">{LEG_TYPE_ZHCH_MAP[record[LEG_TYPE_FIELD]]}</Tag>;
        },
      },
      // meta field 会被 loading 包装
      ...remove(legColDefs, item => item.dataIndex === LEG_FIELD.LEG_META),
    ];
  };

  const getChainColumns = next => {
    return chainColumns ? chainColumns(next) : next;
  };

  const chainLegColumns = nextUnion => {
    const next = getWidthColumns(
      getLoadingsColumns(getEmptyRenderLegColumns(getTitleColumns(getOrderLegColumns(nextUnion))))
    );
    return getChainColumns(next);
  };

  const injectTotalRecord = () => {
    if (totalable && !_.isEmpty(dataSource)) {
      const totalRecord = _.reduce(
        dataSource,
        (totalItem, record) => {
          return {
            ...totalItem,
            ..._.mapValues(record, (val, key) => {
              const origin = Form2.getFieldValue(totalItem[key]);
              if (!_.isNumber(Form2.getFieldValue(val)) || totalColumnIds.indexOf(key) === -1)
                return origin;
              return new BigNumber(origin || 0)
                .plus(Form2.getFieldValue(val) || 0)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber();
            }),
          };
        },
        {
          [TOTAL_FIELD]: true,
        }
      );
      return dataSource.concat(totalRecord);
    }
    return dataSource;
  };

  return (
    <Table2
      size="small"
      rowKey={LEG_ID_FIELD}
      pagination={false}
      vertical={true}
      {...tableProps}
      dataSource={injectTotalRecord()}
      columns={columns}
      ref={node =>
        (tableEl.current = {
          table: node,
          setLoadings,
          setLoadingsByRow,
        })
      }
    />
  );
});

export default MultiLegTable;
