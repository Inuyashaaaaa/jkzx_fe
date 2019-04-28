import { Delta } from '@/domains/legFields/computed/Delta';
import { DeltaCash } from '@/domains/legFields/computed/DeltaCash';
import { Gamma } from '@/domains/legFields/computed/Gamma';
import { GammaCash } from '@/domains/legFields/computed/GammaCash';
import { Price } from '@/domains/legFields/computed/Price';
import { PricePer } from '@/domains/legFields/computed/PricePer';
import { RhoR } from '@/domains/legFields/computed/RhoR';
import { StdDelta } from '@/domains/legFields/computed/StdDelta';
import { Theta } from '@/domains/legFields/computed/Theta';
import { Vega } from '@/domains/legFields/computed/Vega';
import { Q } from '@/domains/legFields/trades/Q';
import { R } from '@/domains/legFields/trades/R';
import { UnderlyerPrice } from '@/domains/legFields/trades/UnderlyerPrice';
import { Vol } from '@/domains/legFields/trades/Vol';
import { VanillaAmerican } from '@/domains/legs/VanillaAmerican';
import { VanillaEuropean } from '@/domains/legs/VanillaEuropean';
import { DigitalLegAmerican } from '@/domains/legs/DigitalLegAmerican';
import { DigitalLegEuropean } from '@/domains/legs/DigitalLegEuropean';
import { VerticalSpread } from '@/domains/legs/VerticalSpread';
import { PositionId } from '@/domains/legFields/infos/PositionId';
import { LcmEventType } from '@/domains/legFields/infos/LcmEventType';
import { InitialNotionalAmount } from '@/domains/legFields/infos/InitialNotionalAmount';
import { AlUnwindNotionalAmount } from '@/domains/legFields/infos/AlUnwindNotionalAmount';
import { BarrierLeg } from '@/domains/legs/Barrier';
import { DoubleSharkFin } from '@/domains/legs/DoubleSharkFin';
import { DoubleTouch } from '@/domains/legs/DoubleTouch';
import { DoubleNoTouch } from '@/domains/legs/DoubleNoTouch';

export const TOTAL_LEGS = [
  VanillaAmerican,
  VanillaEuropean,
  DigitalLegAmerican,
  DigitalLegEuropean,
  VerticalSpread,
  BarrierLeg,
  DoubleSharkFin,
  DoubleTouch,
  DoubleNoTouch,
];

export const TOTAL_TRADESCOL_FIELDS = [UnderlyerPrice, Vol, R, Q];

export const TOTAL_COMPUTED_FIELDS = [
  Delta,
  DeltaCash,
  Gamma,
  GammaCash,
  Price,
  PricePer,
  RhoR,
  StdDelta,
  Theta,
  Vega,
];

export const TOTAL_EDITING_FIELDS = [
  PositionId,
  LcmEventType,
  InitialNotionalAmount,
  AlUnwindNotionalAmount,
];

export const LEG_ENV = {
  PRICING: 'PRICING',
  BOOKING: 'BOOKING',
  EDITING: 'EDITING',
};

export const TRADE_HEADER_CELL_STYLE = {
  background: '#0b66a7',
  color: 'white',
};

export const COMPUTED_HEADER_CELL_STYLE = {
  background: '#08436e',
  color: 'white',
};
