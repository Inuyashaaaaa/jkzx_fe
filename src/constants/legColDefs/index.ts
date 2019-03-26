import { IColDef } from '@/design/components/Table/types';
import { AnnualizedVerticalSpreadOptionDTOEuropeanAnnual } from './AnnualizedVerticalSpreadOptionDTOEuropeanAnnual';
import { AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual } from './AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual';
import { AnnulizedVanillaOptionDTOAmericanAnnual } from './AnnulizedVanillaOptionDTOAmericanAnnual';
import { AnnulizedVanillaOptionDTOAmericanUnAnnual } from './AnnulizedVanillaOptionDTOAmericanUnAnnual';
import { AnnulizedVanillaOptionDTOEuropeanAnnual } from './AnnulizedVanillaOptionDTOEuropeanAnnual';
import { AnnulizedVanillaOptionDTOEuropeanUnAnnual } from './AnnulizedVanillaOptionDTOEuropeanUnAnnual';
import { AsiaAnnual } from './AsiaAnnual';
import { AsiaUnAnnual } from './AsiaUnAnnual';
import { AutoCallSnowAnnual } from './AutoCallSnowAnnual';
import { BarrierAnnual } from './BarrierAnnual';
import { BarrierUnAnnual } from './BarrierUnAnnual';
import {
  Barrier,
  Direction,
  HighBarrier,
  HighStrike,
  InitialSpot,
  KnockDirection,
  LowBarrier,
  LowStrike,
  NotionalAmount,
  NotionalAmountType,
  ObservationType,
  OptionType,
  ParticipationRate,
  ParticipationRate1,
  ParticipationRate2,
  Payment,
  PaymentType,
  PricingExpirationDate,
  PricingTerm,
  Rebate,
  Strike,
  Strike1,
  Strike2,
  Strike3,
  Strike4,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { ConcavaAnnual } from './ConcavaAnnual';
import { ConcavaUnAnnual } from './ConcavaUnAnnual';
import { ConvexAnnual } from './ConvexAnnual';
import { ConvexUnAnnual } from './ConvexUnAnnual';
import { DigitalLegAmericanAnnual } from './DigitalLegAmericanAnnual';
import { DigitalLegAmericanUnAnnual } from './DigitalLegAmericanUnAnnual';
import { DigitalLegEuropeanAnnual } from './DigitalLegEuropeanAnnual';
import { DigitalLegEuropeanUnAnnual } from './DigitalLegEuropeanUnAnnual';
import { DoubleDigitalAnnual } from './DoubleDigitalAnnual';
import { DoubleDigitalUnAnnual } from './DoubleDigitalUnAnnual';
import { DoubleNoTouchAnnual } from './DoubleNoTouchAnnual';
import { DoubleNoTouchUnAnnual } from './DoubleNoTouchUnAnnual';
import { DoubleSharkFinAnnual } from './DoubleSharkFinAnnual';
import { DoubleSharkFinUnAnnual } from './DoubleSharkFinUnAnnual';
import { DoubleTouchAnnual } from './DoubleTouchAnnual';
import { DoubleTouchUnAnnual } from './DoubleTouchUnAnnual';
import { EagleAnnual } from './EagleAnnual';
import { EagleUnAnnual } from './EagleUnAnnual';
import { RangeAccrualsAnnual } from './RangeAccrualsAnnual';
import { RangeAccrualsUnAnnual } from './RangeAccrualsUnAnnual';
import { StraddleAnnual } from './StraddleAnnual';
import { StraddleUnAnnual } from './StraddleUnAnnual';
import { TripleDigitalAnnual } from './TripleDigitalAnnual';
import { TripleDigitalUnAnnual } from './TripleDigitalUnAnnual';

export const DEFAULT_TERM = 30;

export const DEFAULT_DAYS_IN_YEAR = 365;

export interface ILegType {
  type: string;
  name: string;
  assetClass: string;
  columnDefs: IColDef[];
  isAnnualized: boolean;
  getDefault?: any;
  getPosition?: any;
  getPageData?: any;
  pricingColumnDefs?: any[];
}

export const allLegTypes: ILegType[] = [
  AnnulizedVanillaOptionDTOAmericanAnnual,
  AnnulizedVanillaOptionDTOAmericanUnAnnual,
  AnnulizedVanillaOptionDTOEuropeanAnnual,
  AnnulizedVanillaOptionDTOEuropeanUnAnnual,
  DigitalLegAmericanAnnual,
  DigitalLegAmericanUnAnnual,
  DigitalLegEuropeanAnnual,
  DigitalLegEuropeanUnAnnual,
  AnnualizedVerticalSpreadOptionDTOEuropeanAnnual,
  AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual,
  BarrierAnnual,
  BarrierUnAnnual,
  DoubleSharkFinAnnual,
  DoubleSharkFinUnAnnual,
  EagleAnnual,
  EagleUnAnnual,
  DoubleTouchAnnual,
  DoubleTouchUnAnnual,
  DoubleNoTouchAnnual,
  DoubleNoTouchUnAnnual,
  ConcavaAnnual,
  ConcavaUnAnnual,
  ConvexAnnual,
  ConvexUnAnnual,
  DoubleDigitalAnnual,
  DoubleDigitalUnAnnual,
  TripleDigitalAnnual,
  TripleDigitalUnAnnual,
  RangeAccrualsAnnual,
  RangeAccrualsUnAnnual,
  StraddleAnnual,
  StraddleUnAnnual,
  AutoCallSnowAnnual,
  AsiaAnnual,
  AsiaUnAnnual,
];

export const allTryPricingLegTypes: ILegType[] = [
  [
    AnnulizedVanillaOptionDTOAmericanAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      StrikeType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
    ],
  ],
  [
    AnnulizedVanillaOptionDTOAmericanUnAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      StrikeType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
    ],
  ],
  [
    AnnulizedVanillaOptionDTOEuropeanAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      StrikeType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
    ],
  ],
  [
    AnnulizedVanillaOptionDTOEuropeanUnAnnual,
    [
      Direction,
      NotionalAmountType,
      StrikeType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
    ],
  ],
  [
    DigitalLegAmericanAnnual,
    [
      StrikeType,
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      Payment,
      ParticipationRate,
      NotionalAmount,
      ObservationType,
    ],
  ],
  [
    DigitalLegAmericanUnAnnual,
    [
      Direction,
      NotionalAmountType,
      StrikeType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      Payment,
      ParticipationRate,
      NotionalAmount,
      ObservationType,
    ],
  ],
  [
    DigitalLegEuropeanAnnual,
    [
      Direction,
      NotionalAmountType,
      StrikeType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      Payment,
      ParticipationRate,
      NotionalAmount,
      ObservationType,
    ],
  ],
  [
    DigitalLegEuropeanUnAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      PricingTerm,
      PricingExpirationDate,
      Payment,
      ParticipationRate,
      NotionalAmount,
      ObservationType,
    ],
  ],
  [
    AnnualizedVerticalSpreadOptionDTOEuropeanAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      LowStrike,
      StrikeType,
      HighStrike,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
    ],
  ],
  [
    AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual,
    [
      Direction,
      NotionalAmountType,
      StrikeType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      LowStrike,
      HighStrike,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
    ],
  ],
  [
    BarrierAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      Barrier,
      Rebate,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
      ObservationType,
      KnockDirection,
      OptionType,
    ],
  ],
  [
    BarrierUnAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      OptionType,
      Strike,
      Barrier,
      Rebate,
      PricingTerm,
      PricingExpirationDate,
      ParticipationRate,
      NotionalAmount,
      ObservationType,
      KnockDirection,
      OptionType,
    ],
  ],
  [DoubleSharkFinAnnual, DoubleSharkFinAnnual.pricingColumnDefs],
  [DoubleSharkFinUnAnnual, DoubleSharkFinUnAnnual.pricingColumnDefs],
  [
    EagleAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      Strike1,
      Strike2,
      StrikeType,
      Strike3,
      Strike4,
      ParticipationRate1,
      ParticipationRate2,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    EagleUnAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      StrikeType,
      UnderlyerInstrumentId,
      Strike1,
      Strike2,
      Strike3,
      Strike4,
      ParticipationRate1,
      ParticipationRate2,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    DoubleTouchAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      LowBarrier,
      HighBarrier,
      Payment,
      PaymentType,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    DoubleTouchUnAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      LowBarrier,
      HighBarrier,
      Payment,
      PaymentType,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    DoubleNoTouchAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      LowBarrier,
      HighBarrier,
      Payment,
      PaymentType,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    DoubleNoTouchUnAnnual,
    [
      Direction,
      NotionalAmountType,
      InitialSpot,
      UnderlyerMultiplier,
      UnderlyerInstrumentId,
      LowBarrier,
      HighBarrier,
      Payment,
      PaymentType,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [AutoCallSnowAnnual, AutoCallSnowAnnual.pricingColumnDefs],
  [AsiaAnnual, AsiaAnnual.pricingColumnDefs],
  [AsiaUnAnnual, AsiaUnAnnual.pricingColumnDefs],
  [ConcavaAnnual, ConcavaAnnual.pricingColumnDefs],
  [ConcavaUnAnnual, ConcavaUnAnnual.pricingColumnDefs],
  [ConvexAnnual, ConvexAnnual.pricingColumnDefs],
  [ConvexUnAnnual, ConvexUnAnnual.pricingColumnDefs],
  [DoubleDigitalAnnual, DoubleDigitalAnnual.pricingColumnDefs],
  [DoubleDigitalUnAnnual, DoubleDigitalUnAnnual.pricingColumnDefs],
  [TripleDigitalAnnual, TripleDigitalAnnual.pricingColumnDefs],
  [TripleDigitalUnAnnual, TripleDigitalUnAnnual.pricingColumnDefs],
  [RangeAccrualsAnnual, RangeAccrualsAnnual.pricingColumnDefs],
  [RangeAccrualsUnAnnual, RangeAccrualsUnAnnual.pricingColumnDefs],
].map(([leg, colDefs]) => pickColumns(leg, colDefs));

function pickColumns(leg, colDefs) {
  return {
    ...leg,
    columnDefs: colDefs || [],
  };
}
