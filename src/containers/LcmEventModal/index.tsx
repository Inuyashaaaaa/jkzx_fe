import { message } from 'antd';
import React, { memo, useRef, useState } from 'react';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import {
  LCM_EVENT_TYPE_MAP,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  BIG_NUMBER_CONFIG,
  UNIT_ENUM_MAP2,
  KNOCK_DIRECTION_MAP,
} from '@/constants/common';
import { Form2 } from '@/containers';
import { filterObDays } from '@/pages/TradeManagementBookEdit/utils';
import { convertObservetions } from '@/services/common';
import AmendModal, { IAmendModalEl } from './AmendModal';
import AsianExerciseModal from './AsianExerciseModal';
import BarrierIn from './BarrierIn';
import ExerciseModal from './ExerciseModal';
import ExpirationModal from './ExpirationModal';
import FixingModal from './FixingModal';
import KnockOutModal from './KnockOutModal';
import RollModal from './RollModal';
import SettleModal from './SettleModal';
import UnwindModal from './UnwindModal';
import PaymentModal from './PaymentModal';
import BarrierKnockOutModal from './BarrierKnockOutModal';
import { OB_PRICE_FIELD } from './constants';
import { getObservertionFieldData } from './tools';
import { getMoment } from '@/tools';
import BarrierExerciseModal from './BarrierExerciseModal';

export interface LcmEventModalEventParams {
  eventType: string;
  record: any;
  createFormData: any;
  currentUser: any;
  loadData: () => void;
}

export interface LcmEventModalEl {
  show: (event: LcmEventModalEventParams) => void;
}

interface LcmEventModalType {
  current: (node: LcmEventModalEl) => void;
}

const LcmEventModal = memo<LcmEventModalType>(props => {
  const $paymentModal = useRef<PaymentModal>(null);
  const $unwindModal = useRef<UnwindModal>(null);
  const $asianExerciseModal = useRef<AsianExerciseModal>(null);
  const $barrierIn = useRef<BarrierIn>(null);
  const $exerciseModal = useRef<ExerciseModal>(null);
  const $expirationModal = useRef<ExpirationModal>(null);
  const $fixingModal = useRef<FixingModal>(null);
  const $knockOutModal = useRef<KnockOutModal>(null);
  const $rollModal = useRef<RollModal>(null);
  const $amend = useRef<IAmendModalEl>(null);
  const $settleModal = useRef<SettleModal>(null);
  const $barrierKnockOutModal = useRef<BarrierKnockOutModal>(null);
  const $barrierExerciseModal = useRef<BarrierExerciseModal>(null);

  const { current } = props;

  const notBarrierHappen = data => {
    const direction = data[LEG_FIELD.KNOCK_DIRECTION];
    const fixObservations = data[LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY];
    const last = fixObservations.every(item => _.isNumber(item[OB_PRICE_FIELD]));
    const tableData = getObservertionFieldData(data);
    const expirationDate = getMoment(data[LEG_FIELD.EXPIRATION_DATE]);
    const now = moment();
    const expiration = expirationDate.isBefore(now, 'day') || expirationDate.isSame(now, 'day');
    return (
      last &&
      expiration &&
      tableData.every(record => {
        const upBarrier = record[LEG_FIELD.UP_BARRIER];
        const alObPrice = record[OB_PRICE_FIELD];
        const actUpBarrier =
          data[LEG_FIELD.UP_BARRIER_TYPE] === UNIT_ENUM_MAP2.PERCENT
            ? new BigNumber(upBarrier)
                .multipliedBy(0.01)
                .multipliedBy(data[LEG_FIELD.INITIAL_SPOT])
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber()
            : upBarrier;
        if (direction === KNOCK_DIRECTION_MAP.UP) {
          return alObPrice <= actUpBarrier;
        }
        if (direction === KNOCK_DIRECTION_MAP.DOWN) {
          return alObPrice >= actUpBarrier;
        }
        return false;
      })
    );
  };

  const notKnockIn = data => {
    if (data[LEG_FIELD.ALREADY_BARRIER]) {
      return true;
    }
    return false;
  };

  const meta: LcmEventModalEl = {
    show: (event: LcmEventModalEventParams) => {
      const { eventType, record, createFormData, currentUser, loadData } = event;
      const legType = record[LEG_TYPE_FIELD];
      const data = Form2.getFieldsValue(record);
      const tableFormData = Form2.getFieldsValue(createFormData);
      if (eventType === LCM_EVENT_TYPE_MAP.PAYMENT) {
        return $paymentModal.current.show(data, tableFormData, currentUser, loadData);
      }
      if (eventType === LCM_EVENT_TYPE_MAP.EXPIRATION) {
        return $expirationModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_IN) {
        if (legType === LEG_TYPE_MAP.AUTOCALL_PHOENIX) {
          if (notKnockIn(data)) {
            return message.warn('不能进行敲入操作');
          }
        }
        return $barrierIn.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.OBSERVE) {
        return $fixingModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.EXERCISE) {
        if (legType === LEG_TYPE_MAP.ASIAN || legType === LEG_TYPE_MAP.RANGE_ACCRUALS) {
          const convertedData = filterObDays(convertObservetions(data));
          if (!convertedData.every(item => _.isNumber(item[OB_PRICE_FIELD]))) {
            return message.warn('请先完善观察日价格');
          }
          return $asianExerciseModal.current.show(data, tableFormData, currentUser, loadData);
        }
        if (legType === LEG_TYPE_MAP.BARRIER) {
          return $barrierExerciseModal.current.show(data, tableFormData, currentUser, loadData);
        }
        return $exerciseModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.UNWIND) {
        if (record[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.UNWIND) {
          return message.warn(
            `${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}状态下无法继续${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}`,
          );
        }
        return $unwindModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_OUT) {
        if (legType === LEG_TYPE_MAP.BARRIER) {
          return $barrierKnockOutModal.current.show(data, tableFormData, currentUser, loadData);
        }
        return $knockOutModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.SNOW_BALL_EXERCISE) {
        return $expirationModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.ROLL) {
        return $rollModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.AMEND) {
        return $amend.current.show(record, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.SETTLE) {
        if (legType === LEG_TYPE_MAP.ASIAN || legType === LEG_TYPE_MAP.RANGE_ACCRUALS) {
          const convertedData = filterObDays(convertObservetions(data));
          if (!convertedData.every(item => _.isNumber(item[OB_PRICE_FIELD]))) {
            return message.warn('请先完善观察日价格');
          }
        }
        if (legType === LEG_TYPE_MAP.AUTOCALL || legType === LEG_TYPE_MAP.AUTOCALL_PHOENIX) {
          if (legType === LEG_TYPE_MAP.AUTOCALL_PHOENIX) {
            if (!notBarrierHappen(data)) {
              return message.warn('不能进行到期结算操作');
            }
          }
          return $expirationModal.current.show(data, tableFormData, currentUser, loadData);
        }
        return $settleModal.current.show(data, tableFormData, currentUser, loadData);
      }
      return message.error('不支持该生命周期操作');
    },
  };

  current(meta);
  const [fixingEdited, setFixingEdited] = useState(false);

  const handleFixingEdited = () => {
    setFixingEdited(true);
  };

  return (
    <>
      <PaymentModal
        ref={node => {
          $paymentModal.current = node;
        }}
      />
      <UnwindModal
        ref={node => {
          $unwindModal.current = node;
        }}
      />
      <ExerciseModal
        ref={node => {
          $exerciseModal.current = node;
        }}
      />
      <ExpirationModal
        ref={node => {
          $expirationModal.current = node;
        }}
        fixingEdited={fixingEdited}
      />
      <KnockOutModal
        ref={node => {
          $knockOutModal.current = node;
        }}
        fixingEdited={fixingEdited}
      />
      <FixingModal
        ref={node => {
          $fixingModal.current = node;
        }}
        handleFixingEdited={handleFixingEdited}
      />
      <SettleModal
        ref={node => {
          $settleModal.current = node;
        }}
      />
      <AsianExerciseModal
        ref={node => {
          $asianExerciseModal.current = node;
        }}
      />
      <BarrierIn
        ref={node => {
          $barrierIn.current = node;
        }}
      />
      <RollModal
        ref={node => {
          $rollModal.current = node;
        }}
      />
      <AmendModal
        current={node => {
          $amend.current = node;
        }}
      />
      <BarrierKnockOutModal
        ref={node => {
          $barrierKnockOutModal.current = node;
        }}
      />
      <BarrierExerciseModal
        ref={node => {
          $barrierExerciseModal.current = node;
        }}
      />
    </>
  );
});

export default LcmEventModal;
