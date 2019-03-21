import { LEG_FIELD } from '@/constants/common';
import { IColDef } from '@/design/components/Table/types';
import _ from 'lodash';
import { ILegType } from '..';

export const LEG_FIELD_ORDERS = [
  LEG_FIELD.DIRECTION,
  LEG_FIELD.OPTION_TYPE,
  LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
  LEG_FIELD.UNDERLYER_MULTIPLIER,
  LEG_FIELD.INITIAL_SPOT,
  LEG_FIELD.PARTICIPATION_RATE,
  LEG_FIELD.PARTICIPATION_RATE1,
  LEG_FIELD.PARTICIPATION_RATE2,
  LEG_FIELD.LOW_PARTICIPATION_RATE,
  LEG_FIELD.HIGH_PARTICIPATION_RATE,
  LEG_FIELD.STRIKE_TYPE,
  LEG_FIELD.STRIKE,
  LEG_FIELD.STRIKE1,
  LEG_FIELD.STRIKE2,
  LEG_FIELD.STRIKE3,
  LEG_FIELD.STRIKE4,
  LEG_FIELD.LOW_STRIKE,
  LEG_FIELD.HIGH_STRIKE,
  LEG_FIELD.SPECIFIED_PRICE,
  LEG_FIELD.TERM,
  LEG_FIELD.EFFECTIVE_DATE,
  LEG_FIELD.EXPIRATION_DATE,
  LEG_FIELD.SETTLEMENT_DATE,
  LEG_FIELD.DAYS_IN_YEAR,
  LEG_FIELD.PREMIUM_TYPE,
  LEG_FIELD.PREMIUM,
  LEG_FIELD.MINIMUM_PREMIUM,
  LEG_FIELD.FRONT_PREMIUM,
  LEG_FIELD.PAYMENT_TYPE,
  LEG_FIELD.PAYMENT,
  LEG_FIELD.PAYMENT1,
  LEG_FIELD.PAYMENT2,
  LEG_FIELD.PAYMENT3,
  LEG_FIELD.LOW_PAYMENT,
  LEG_FIELD.HIGH_PAYMENT,
  LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  LEG_FIELD.NOTIONAL_AMOUNT,
  LEG_FIELD.REBATE_UNIT,
  LEG_FIELD.REBATE_TYPE,
  LEG_FIELD.REBATE,
  LEG_FIELD.LOW_REBATE,
  LEG_FIELD.HIGH_REBATE,
  LEG_FIELD.KNOCK_DIRECTION,
  LEG_FIELD.BARRIER_TYPE,
  LEG_FIELD.BARRIER,
  LEG_FIELD.LOW_BARRIER,
  LEG_FIELD.HIGH_BARRIER,
  LEG_FIELD.OBSERVATION_TYPE,
  LEG_FIELD.PAY_OFF_TYPE,
  LEG_FIELD.PAY_OFF,
  LEG_FIELD.UP_BARRIER_TYPE,
  LEG_FIELD.UP_BARRIER,
  LEG_FIELD.COUPON_PAYMENT,
  LEG_FIELD.STEP,
  LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE,
  LEG_FIELD.AUTO_CALL_STRIKE_UNIT,
  LEG_FIELD.AUTO_CALL_STRIKE,
  LEG_FIELD.EXPIRE_NOBARRIERPREMIUM,
  LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY,
  LEG_FIELD.OBSERVATION_STEP,
  LEG_FIELD.OBSERVE_START_DAY,
  LEG_FIELD.OBSERVE_END_DAY,
  LEG_FIELD.OBSERVATION_DATES,
];

export function orderLegColDefs(legColDefs: IColDef[]) {
  if (!legColDefs || !legColDefs) return [];
  const notOrders = _.difference(legColDefs.map(item => item.field), LEG_FIELD_ORDERS);
  if (notOrders && notOrders.length) {
    console.error(`leg self colDef.fields:[${notOrders}] not join orders yet.`);
  }
  return LEG_FIELD_ORDERS.reduce((pre, next) => {
    const colDef = legColDefs.find(item => item.field === next);
    if (colDef) {
      return pre.concat(colDef);
    }
    return pre;
  }, []).concat(notOrders.map(next => legColDefs.find(item => item.field === next)));
}

export function orderLeg(leg: ILegType) {
  return {
    ...leg,
    columnDefs: orderLegColDefs(leg.columnDefs),
  };
}
