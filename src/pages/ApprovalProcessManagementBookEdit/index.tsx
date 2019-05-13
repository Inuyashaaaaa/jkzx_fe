import { LEG_ID_FIELD } from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV, TOTAL_EDITING_FIELDS, ILegColDef } from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import { Form2, Loading } from '@/design/components';
import { ITableData } from '@/design/components/type';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { wkProcessInstanceFormGet } from '@/services/approval';
import { convertTradePageData2ApiData } from '@/services/pages';
import { getLegByProductType, getLegByRecord, createLegRecordByPosition } from '@/tools';
import { ILeg } from '@/types/leg';
import { Divider, message, Typography, Skeleton, Row, Button } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import './index.less';
import { ILcmEventModalEl } from '@/containers/LcmEventModal';
import moment from 'moment';

const TradeManagementBooking = props => {
  const { currentUser } = props;
  const { tradeManagementBookEditPageData, dispatch } = props;
  const { tableData } = tradeManagementBookEditPageData;
  const setTableData = payload => {
    dispatch({
      type: 'tradeManagementBookEdit/setTableData',
      payload,
    });
  };
  const useEnv = props.editable ? LEG_ENV.BOOKING : LEG_ENV.EDITING;

  const [tableLoading, setTableLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<IMultiLegTableEl>(null);
  const [eventTypes, setEventTypes] = useState({});
  const addLeg = (leg: ILeg, position) => {
    if (!leg) return;

    setTableData(pre => {
      const next = {
        ...createLegRecordByPosition(leg, position, useEnv),
      };
      return pre.concat(next);
    });
  };

  const loadTableData = async () => {
    setTableData([]);
    setCreateFormData([]);

    if (!props.id) {
      return message.warn('查看 id 不存在');
    }

    setTableLoading(true);

    const { error, data } = await wkProcessInstanceFormGet({
      processInstanceId: props.id,
    });
    if (error) return;
    const _detailData = {
      tradeId: _.get(data, 'process._business_payload.trade.tradeId'),
      bookName: _.get(data, 'process._business_payload.trade.bookName'),
      tradeDate: moment(_.get(data, 'process._business_payload.trade.tradeDate')),
      salesCode: _.get(data, 'process._business_payload.trade.salesCode'),
      counterPartyCode: _.get(
        data,
        'process._business_payload.trade.positions[0].counterPartyCode'
      ),
      comment: _.get(data, 'process._business_payload.trade.comment'),
    };

    const { positions } = _.get(data, 'process._business_payload.trade');

    setTableLoading(false);
    setCreateFormData(Form2.createFields(_detailData));
    mockAddLegItem(positions, _detailData);
  };

  const mockAddLegItem = async (composePositions, tableFormData) => {
    composePositions.forEach(position => {
      const leg = getLegByProductType(position.productType, position.asset.exerciseType);
      addLeg(leg, position);
    });
  };

  const handelSave = async () => {
    const trade = convertTradePageData2ApiData(
      tableData.map(item => Form2.getFieldsValue(item)),
      Form2.getFieldsValue(createFormData),
      currentUser.userName,
      LEG_ENV.BOOKING
    );
    props.tbookEditCancel();
    props.confirmModify(null, {
      taskId: props.taskId,
      ctlProcessData: props.res,
      businessProcessData: { trade, validTime: '2018-01-01T10:10:10' },
    });
  };

  const handleEventAction = (eventType, params) => {
    lcmEventModalEl.current.show({
      eventType,
      record: params.record,
      createFormData,
      currentUser,
      loadData: loadTableData,
    });
  };

  useLifecycles(() => {
    loadTableData();
  });

  const lcmEventModalEl = useRef<ILcmEventModalEl>(null);
  return (
    <PageHeaderWrapper>
      {tableLoading ? (
        <Skeleton active={true} paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Typography.Title level={4}>基本信息</Typography.Title>
          <Divider />
          <Loading loading={tableLoading}>
            <BookingBaseInfoForm
              columnNumberOneRow={2}
              editableStatus={
                props.editable ? FORM_EDITABLE_STATUS.EDITING_NO_CONVERT : FORM_EDITABLE_STATUS.SHOW
              }
              createFormData={createFormData}
              setCreateFormData={setCreateFormData}
            />
          </Loading>
          <Typography.Title style={{ marginTop: 20 }} level={4}>
            交易结构信息
          </Typography.Title>
          <Divider />
          <MultiLegTable
            env={useEnv}
            loading={tableLoading}
            tableEl={tableEl}
            onCellFieldsChange={params => {
              const { record } = params;
              const leg = getLegByRecord(record);

              setTableData(pre => {
                const newData = pre.map(item => {
                  if (item[LEG_ID_FIELD] === params.rowId) {
                    return {
                      ...item,
                      ...params.changedFields,
                    };
                  }
                  return item;
                });
                if (leg.onDataChange) {
                  const _LEG_ENV = useEnv;
                  leg.onDataChange(
                    _LEG_ENV,
                    params,
                    newData[params.rowIndex],
                    newData,
                    (colId: string, loading: boolean) => {
                      tableEl.current.setLoadings(params.rowId, colId, loading);
                    },
                    tableEl.current.setLoadingsByRow,
                    (colId: string, newVal: ITableData) => {
                      setTableData(pre =>
                        pre.map(item => {
                          if (item[LEG_ID_FIELD] === params.rowId) {
                            return {
                              ...item,
                              [colId]: newVal,
                            };
                          }
                          return item;
                        })
                      );
                    },
                    setTableData
                  );
                }
                return newData;
              });
            }}
            dataSource={tableData}
            chainColumns={(columns: ILegColDef[]) => {
              const totalFields = TOTAL_EDITING_FIELDS.map(item => item.dataIndex);
              return columns.filter(item => {
                return !totalFields.includes(item.dataIndex);
              });
            }}
          />
        </>
      )}
      {props.editable ? (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '25px',
          }}
        >
          <Button type="primary" onClick={handelSave}>
            保存
          </Button>
          <Button style={{ marginLeft: '20px' }} onClick={() => props.tbookEditCancel()}>
            取消
          </Button>
        </Row>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    tradeManagementBookEditPageData: state.tradeManagementBookEdit,
  }))(TradeManagementBooking)
);
