import {
  LCM_EVENT_TYPE_MAP,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { Form2 } from '@/design/components';
import { filterObDays } from '@/pages/TradeManagementBookEdit/utils';
import { convertObservetions } from '@/services/common';
import { message } from 'antd';
import React, { memo, useRef } from 'react';
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

export interface ILcmEventModalEventParams {
  eventType: string;
  record: any;
  createFormData: any;
  currentUser: any;
  loadData: () => void;
}

export interface ILcmEventModalEl {
  show: (event: ILcmEventModalEventParams) => void;
}

const LcmEventModal = memo<{
  current: (node: ILcmEventModalEl) => void;
}>(props => {
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

  const { current } = props;

  const meta: ILcmEventModalEl = {
    show: (event: ILcmEventModalEventParams) => {
      const { eventType, record, createFormData, currentUser, loadData } = event;
      const legType = record[LEG_TYPE_FIELD];
      const data = Form2.getFieldsValue(record);

      const tableFormData = Form2.getFieldsValue(createFormData);
      if (eventType === LCM_EVENT_TYPE_MAP.EXPIRATION) {
        return $expirationModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_IN) {
        return $barrierIn.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.OBSERVE) {
        return $fixingModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.EXERCISE) {
        if (legType === LEG_TYPE_MAP.ASIAN || legType === LEG_TYPE_MAP.RANGE_ACCRUALS) {
          const convertedData = filterObDays(convertObservetions(data));
          if (convertedData.some(item => !item.price)) {
            return message.warn('请先完善观察日价格');
          }
          return $asianExerciseModal.current.show(data, tableFormData, currentUser, loadData);
        }
        return $exerciseModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.UNWIND) {
        if (record[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.UNWIND) {
          return message.warn(
            `${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}状态下无法继续${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}`
          );
        }
        return $unwindModal.current.show(data, tableFormData, currentUser, loadData);
      }

      if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_OUT) {
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
        return $settleModal.current.show(data, tableFormData, currentUser, loadData);
      }
    },
  };

  current(meta);

  return (
    <>
      <UnwindModal ref={node => ($unwindModal.current = node)} />
      <ExerciseModal
        ref={node => {
          $exerciseModal.current = node;
        }}
      />
      <ExpirationModal ref={node => ($expirationModal.current = node)} />
      <KnockOutModal ref={node => ($knockOutModal.current = node)} />
      <FixingModal
        ref={node => {
          $fixingModal.current = node;
        }}
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
    </>
  );
});

export default LcmEventModal;
