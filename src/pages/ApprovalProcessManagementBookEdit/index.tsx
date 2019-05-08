import {
  LEG_FIELD,
  LEG_ID_FIELD,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_TYPE_FIELD,
} from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import { Form2, Loading } from '@/design/components';
import { ITableData } from '@/design/components/type';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdTradeGet } from '@/services/general-service';
import { wkProcessInstanceFormGet, wkTaskComplete } from '@/services/approval';
import {
  backConvertPercent,
  createLegDataSourceItem,
  getTradeCreateModalData,
  convertTradePageData2ApiData,
} from '@/services/pages';
import { trdPositionLCMEventTypes, trdTradeLCMUnwindAmountGet } from '@/services/trade-service';
import { getLegByProductType, getLegByRecord, createLegRecordByPosition } from '@/tools';
import { ILeg } from '@/types/leg';
import { Divider, message, Typography, Menu, Skeleton, Row, Button } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import ActionBar from './ActionBar';
import './index.less';
import LcmEventModal, { ILcmEventModalEl } from '@/containers/LcmEventModal';

const UN_EDITDIR = [
  LEG_FIELD.UNDERLYER_MULTIPLIER,
  LEG_FIELD.TERM,
  LEG_FIELD.EFFECTIVE_DATE,
  LEG_FIELD.EXPIRATION_DATE,
  LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  LEG_FIELD.NOTIONAL_AMOUNT,
];

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

    // const { error, data } = await trdTradeGet({
    //   tradeId: props.id,
    // });
    const { error, data } = await wkProcessInstanceFormGet({
      processInstanceId: props.id,
    });
    console.log(props.taskId);
    if (error) return;
    const _detailData = {
      tradeId: data.process._business_payload.trade.tradeId,
      bookName: data.process._business_payload.trade.bookName,
      tradeDate: data.process._business_payload.trade.tradeDate,
      salesCode: data.process._business_payload.trade.salesCode,
      counterPartyCode: data.process._business_payload.trade.positions[0].counterPartyCode,
    };
    // setCreateFormData(_detailData)

    // const tableFormData = getTradeCreateModalData(_detailData);

    const { positions } = data.process._business_payload.trade;

    setTableLoading(false);
    setCreateFormData(Form2.createFields(_detailData));
    mockAddLegItem(positions, _detailData);
    // fetchEventType(positions);
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
