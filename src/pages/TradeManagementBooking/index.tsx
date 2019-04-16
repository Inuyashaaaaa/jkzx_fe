import { LEG_ID_FIELD, LEG_NAME_FIELD, LEG_TYPE_FIELD } from '@/constants/common';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import { LEG_ENV, TOTAL_LEGS } from '@/constants/legs';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import { Loading, Table2 } from '@/design/components';
import { VERTICAL_GUTTER } from '@/design/components/SourceTable';
import { uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { ILeg, ILegColDef } from '@/types/leg';
import { Button, Row } from 'antd';
import _ from 'lodash';
import React, { memo, useState } from 'react';

const TradeManagementBooking = memo(() => {
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

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

  const getEmptyRenderLegColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        render(val, record, index, { colDef }) {
          const legBelongByRecord = getLegByType(record[LEG_TYPE_FIELD]);

          if (
            legBelongByRecord &&
            legBelongByRecord
              .getColumns(LEG_ENV.PRICING)
              .find(item => item.dataIndex === colDef.dataIndex)
          ) {
            return item.render.apply(this, arguments);
          }

          return 'empty';
        },
      };
    });
  };

  const createLegDataSourceItem = (leg: ILeg) => {
    return {
      [LEG_ID_FIELD]: uuid(),
      [LEG_TYPE_FIELD]: leg.type,
      [LEG_NAME_FIELD]: leg.name,
    };
  };

  const getWidthColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        onCell: () => ({ width: '250px' }),
      };
    });
  };

  const [loadings, setLoadings] = useState({});

  const saveSetLoadings = (colId, rowId, loading) => {
    setLoadings(pre => {
      if (pre[colId]) {
        pre[colId][rowId] = loading;
      } else {
        pre[colId] = {
          [rowId]: loading,
        };
      }
      return pre;
    });
  };

  const getLoadingsColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        render(val, record, index, { colDef }) {
          const loading = loadings[colDef.dataIndex]
            ? loadings[colDef.dataIndex][record.id]
            : false;
          return <Loading loading={loading}>{item.render.apply(this, arguments)}</Loading>;
        },
      };
    });
  };

  const [createTradeLoading, setCreateTradeLoading] = useState(false);

  return (
    <div>
      <PageHeaderWrapper>
        <Row style={{ marginBottom: VERTICAL_GUTTER }}>
          <Button.Group>
            <MultilLegCreateButton
              isPricing={false}
              key="create"
              handleAddLeg={(leg: ILeg) => {
                if (!leg) return;

                setColumns(pre =>
                  getLoadingsColumns(
                    getWidthColumns(
                      getEmptyRenderLegColumns(
                        getOrderLegColumns(
                          getUnionLegColumns(pre.concat(leg.getColumns(LEG_ENV.BOOKING)))
                        )
                      )
                    )
                  )
                );

                setTableData(pre => pre.concat(createLegDataSourceItem(leg)));
              }}
            />
            <Button
              key="完成簿记"
              type="primary"
              loading={createTradeLoading}
              onClick={() => {
                // setTableData(pre =>
                //   pre.map(item =>
                //     _.mapValues(item, val => {
                //       console.log(val)
                //       if (typeof val !== 'object') {
                //         return val;
                //       }
                //       return {
                //         ...val,
                //         value: '1',
                //       };
                //     })
                //   )
                // );
              }}
            >
              完成簿记
            </Button>
          </Button.Group>
        </Row>
        <Table2
          rowKey="id"
          onCellFieldsChange={params => {
            setTableData(pre =>
              pre.map(item => {
                if (item.id === params.rowId) {
                  return {
                    ...item,
                    ...params.changedFields,
                  };
                }
                return item;
              })
            );
          }}
          pagination={false}
          vertical={true}
          columns={columns}
          dataSource={tableData}
        />
      </PageHeaderWrapper>
    </div>
  );
});

export default TradeManagementBooking;
