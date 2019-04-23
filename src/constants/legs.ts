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
import { VanillaAmerican } from '@/domains/legs/vanillaAmerican';

export const TOTAL_LEGS = [VanillaAmerican];

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
