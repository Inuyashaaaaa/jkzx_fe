import {
  FREQUENCY_TYPE_NUM_MAP,
  LEG_FIELD,
  DIRECTION_MAP,
  KNOCK_DIRECTION_MAP,
} from '@/constants/common';
import { Form2 } from '@/containers';
import { qlIsHoliday } from '@/services/volatility';
import { message } from 'antd';
import { evaluate } from 'mathjs';

export const validateExpirationDate = async date => {
  if (!date) return;
  const rootState = window.g_app._store.getState() || {};
  const { expirationDate = {} } = rootState;
  const { volatilityCalendars } = expirationDate;
  if (!volatilityCalendars) return;
  const formatDate = date.format('YYYY-MM-DD');
  const { error, data } = await qlIsHoliday({
    calendars: volatilityCalendars,
    date: formatDate,
  });
  if (error) return;
  if (data) {
    message.warning(`${formatDate}属于非交易日`);
  }
};

export const computedShift = (record: any, vol = 0.2) => {
  const step = Form2.getFieldValue(record[LEG_FIELD.OBSERVATION_STEP]);
  const barrier = Form2.getFieldValue(record[LEG_FIELD.BARRIER]);
  const direction = Form2.getFieldValue(record[LEG_FIELD.KNOCK_DIRECTION]);

  if (barrier != null && step && direction) {
    const dt = evaluate(`${FREQUENCY_TYPE_NUM_MAP[step]} / 365`);
    const cn = direction === KNOCK_DIRECTION_MAP.UP ? 0.5826 : -0.5826;
    const expression = `${barrier} * exp(${cn} * ${vol} * sqrt(${dt}))`;
    const next = parseFloat(evaluate(expression).toPrecision(4));
    record[LEG_FIELD.BARRIER_SHIFT] = Form2.createField(next);
  }
};
