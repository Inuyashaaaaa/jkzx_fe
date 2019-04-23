import { LEG_FIELD, LEG_ID_FIELD, LEG_TYPE_FIELD, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import {
  LEG_ENV,
  TOTAL_LEGS,
  TOTAL_COMPUTED_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import { Form2, Loading, ModalButton, Table2 } from '@/design/components';
import { VERTICAL_GUTTER } from '@/design/components/SourceTable';
import { IFormField, ITableData, ITableProps } from '@/design/components/type';
import { insert, remove, uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { convertTradePageData2ApiData, createLegDataSourceItem } from '@/services/pages';
import { cliTasksGenerateByTradeId } from '@/services/reference-data-service';
import { trdTradeCreate } from '@/services/trade-service';
import { getLegByRecord } from '@/tools';
import { ILeg, ILegColDef } from '@/types/leg';
import { Affix, Button, Divider, Menu, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import { PRICING_FROM_TAG } from '@/constants/trade';
import { LEG_MAP } from '@/constants/legType';

const MultiLegTable = memo<
  {
    tableEl: any;
    env: string;
  } & ITableProps
>(props => {
  const { tableEl = useRef<Table2>(null), dataSource, env, ...tableProps } = props;

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

  const cellIsEmpty = (record, colDef) => {
    const legBelongByRecord = getLegByType(record[LEG_TYPE_FIELD]);

    if (
      (colDef.exsitable && !colDef.exsitable(record)) ||
      !(
        legBelongByRecord &&
        legBelongByRecord.getColumns(env).find(item => item.dataIndex === colDef.dataIndex)
      )
    ) {
      return true;
    }
    return false;
  };

  const getEmptyRenderLegColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        editable(record, index, { colDef }) {
          if (cellIsEmpty(record, colDef)) {
            return false;
          }
          if (typeof item.editable === 'function') {
            return item.editable.apply(this, arguments);
          }
          return !!item.editable;
        },
        onCell(record, index, { colDef }) {
          if (cellIsEmpty(record, colDef)) {
            return {
              style: { backgroundColor: '#e8e8e8' },
              ...(item.onCell ? item.onCell.apply(this, arguments) : null),
            };
          }
        },
        render(val, record, index, { colDef }) {
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
            width: '250px',
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
          return LEG_TYPE_ZHCH_MAP[record[LEG_TYPE_FIELD]];
        },
      },
      // meta field 会被 loading 包装
      ...remove(legColDefs, item => item.dataIndex === LEG_FIELD.LEG_META),
    ];
  };

  const chainLegColumns = nextUnion => {
    return getTitleColumns(
      getLoadingsColumns(getWidthColumns(getEmptyRenderLegColumns(getOrderLegColumns(nextUnion))))
    );
  };

  return (
    <Table2
      size="middle"
      rowKey={LEG_ID_FIELD}
      pagination={false}
      vertical={true}
      {...tableProps}
      dataSource={dataSource}
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
