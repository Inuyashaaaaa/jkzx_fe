import { Delta } from '@/containers/legFields/computed/Delta';
import { DeltaCash } from '@/containers/legFields/computed/DeltaCash';
import { Gamma } from '@/containers/legFields/computed/Gamma';
import { GammaCash } from '@/containers/legFields/computed/GammaCash';
import { Price } from '@/containers/legFields/computed/Price';
import { PricePer } from '@/containers/legFields/computed/PricePer';
import { RhoR } from '@/containers/legFields/computed/RhoR';
import { StdDelta } from '@/containers/legFields/computed/StdDelta';
import { Theta } from '@/containers/legFields/computed/Theta';
import { Vega } from '@/containers/legFields/computed/Vega';
import { AlUnwindNotionalAmount } from '@/containers/legFields/infos/AlUnwindNotionalAmount';
import { InitialNotionalAmount } from '@/containers/legFields/infos/InitialNotionalAmount';
import { LcmEventType } from '@/containers/legFields/infos/LcmEventType';
import { PositionId } from '@/containers/legFields/infos/PositionId';
import { Q } from '@/containers/legFields/trades/Q';
import { R } from '@/containers/legFields/trades/R';
import { UnderlyerPrice } from '@/containers/legFields/trades/UnderlyerPrice';
import { Vol } from '@/containers/legFields/trades/Vol';
import { Asia } from '@/domains/legs/Asia';
import { AutoCallPhoenix } from '@/domains/legs/AutoCallPhoenix';
import { AutoCallSnow } from '@/domains/legs/AutoCallSnow';
import { BarrierLeg } from '@/domains/legs/Barrier';
import { Concava } from '@/domains/legs/Concava';
import { Convex } from '@/domains/legs/Convex';
import { DigitalLegAmerican } from '@/domains/legs/DigitalLegAmerican';
import { DigitalLegEuropean } from '@/domains/legs/DigitalLegEuropean';
import { DoubleDigital } from '@/domains/legs/DoubleDigital';
import { DoubleNoTouch } from '@/domains/legs/DoubleNoTouch';
import { DoubleSharkFin } from '@/domains/legs/DoubleSharkFin';
import { DoubleTouch } from '@/domains/legs/DoubleTouch';
import { Eagle } from '@/domains/legs/Eagle';
import { ModelXy } from '@/domains/legs/ModelXy';
import { RangeAccruals } from '@/domains/legs/RangeAccruals';
import { TripleDigital } from '@/domains/legs/TripleDigital';
import { Straddle } from '@/domains/legs/Straddle';
import { VanillaAmerican } from '@/domains/legs/VanillaAmerican';
import { VanillaEuropean } from '@/domains/legs/VanillaEuropean';
import { VerticalSpread } from '@/domains/legs/VerticalSpread';
import { Forward } from '@/domains/legs/Forward';
import { SpreadEuropean } from '@/domains/legs/SpreadEuropean';
import { RatioSpreadEuropean } from '@/domains/legs/RatioSpreadEuropean';
import { Cega } from '@/containers/legFields/computed/Cega';

export const TOTAL_LEGS = [
  VanillaAmerican,
  VanillaEuropean,
  DigitalLegAmerican,
  DigitalLegEuropean,
  VerticalSpread,
  BarrierLeg,
  DoubleSharkFin,
  DoubleDigital,
  DoubleTouch,
  DoubleNoTouch,
  Concava,
  Convex,
  Eagle,
  RangeAccruals,
  TripleDigital,
  ModelXy,
  AutoCallSnow,
  AutoCallPhoenix,
  Asia,
  Straddle,
  Forward,
  SpreadEuropean,
  RatioSpreadEuropean,
];

export const TOTAL_TRADESCOL_FIELDS = [UnderlyerPrice, Vol, R, Q];

export const GENERAL_COMPUTED_FIELDS = [
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

export const TOTAL_COMPUTED_FIELDS = [...GENERAL_COMPUTED_FIELDS, Cega];

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
