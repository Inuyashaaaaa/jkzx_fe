import { Q } from '@/domains/legFields/trades/Q';
import { R } from '@/domains/legFields/trades/R';
import { UnderlyerPrice } from '@/domains/legFields/trades/UnderlyerPrice';
import { Vol } from '@/domains/legFields/trades/Vol';
import { VanillaAmerican } from '@/domains/legs/vanillaAmerican';

export const TOTAL_LEGS = [VanillaAmerican];

export const TOTAL_TRADESCOL_FIELDS = [UnderlyerPrice, Vol, R, Q];

export const LEG_ENV = {
  PRICING: 'PRICING',
  BOOKING: 'BOOKING',
  EDITING: 'EDITING',
};
