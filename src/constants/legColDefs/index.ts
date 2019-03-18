import { IColDef } from '@/design/components/Table/types';
import moment from 'moment';
import { LEG_ANNUALIZED_FIELD, LEG_FIELD } from '../common';
import { AnnualizedVerticalSpreadOptionDTOEuropeanAnnual } from './AnnualizedVerticalSpreadOptionDTOEuropeanAnnual';
import { AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual } from './AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual';
import { AnnulizedVanillaOptionDTOAmericanAnnual } from './AnnulizedVanillaOptionDTOAmericanAnnual';
import { AnnulizedVanillaOptionDTOAmericanUnAnnual } from './AnnulizedVanillaOptionDTOAmericanUnAnnual';
import { AnnulizedVanillaOptionDTOEuropeanAnnual } from './AnnulizedVanillaOptionDTOEuropeanAnnual';
import { AnnulizedVanillaOptionDTOEuropeanUnAnnual } from './AnnulizedVanillaOptionDTOEuropeanUnAnnual';
import { BarrierAnnual } from './BarrierAnnual';
import { BarrierUnAnnual } from './BarrierUnAnnual';
import {
  Barrier,
  Direction,
  ExpirationDate,
  HighBarrier,
  HighParticipationRate,
  HighRebate,
  HighStrike,
  InitialSpot,
  KnockDirection,
  LowBarrier,
  LowParticipationRate,
  LowRebate,
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
  Rebate,
  Strike,
  Strike1,
  Strike2,
  Strike3,
  Strike4,
  StrikeType,
  Term,
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
];

const PricingInitialSpot = InitialSpot;

const PricingUnderlyerInstrumentId = UnderlyerInstrumentId;

const PricingTerm = {
  ...Term,
  editable: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return true;
    }
    return false;
  },
  getValue: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return {
        depends: [],
        value(record) {
          return record[Term.field];
        },
      };
    }
    return {
      depends: [LEG_FIELD.EXPIRATION_DATE],
      value(record) {
        return moment(record[LEG_FIELD.EXPIRATION_DATE]).diff(moment(), 'days') + 1;
      },
    };
  },
};

const PricingExpirationDate = {
  ...ExpirationDate,
  editable: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return false;
    }
    return true;
  },
  getValue: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return {
        depends: [LEG_FIELD.TERM],
        value(record) {
          return moment().add(record[LEG_FIELD[LEG_FIELD.TERM]], 'days');
        },
      };
    }
    return {
      depends: [],
      value(record) {
        return record[LEG_FIELD.EXPIRATION_DATE];
      },
    };
  },
};

export const allTryPricingLegTypes: ILegType[] = [
  [
    AnnulizedVanillaOptionDTOAmericanAnnual,
    [
      Direction,
      NotionalAmountType,
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
    DoubleSharkFinAnnual,
    [
      Direction,
      NotionalAmountType,
      PricingInitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
      OptionType,
      LowStrike,
      LowBarrier,
      LowRebate,
      LowParticipationRate,
      HighStrike,
      HighBarrier,
      HighRebate,
      HighParticipationRate,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    DoubleSharkFinUnAnnual,
    [
      Direction,
      NotionalAmountType,
      PricingInitialSpot,
      StrikeType,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
      OptionType,
      LowStrike,
      LowBarrier,
      LowRebate,
      LowParticipationRate,
      HighStrike,
      HighBarrier,
      HighRebate,
      HighParticipationRate,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  [
    EagleAnnual,
    [
      Direction,
      NotionalAmountType,
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      StrikeType,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
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
      PricingInitialSpot,
      UnderlyerMultiplier,
      PricingUnderlyerInstrumentId,
      LowBarrier,
      HighBarrier,
      Payment,
      PaymentType,
      PricingTerm,
      PricingExpirationDate,
      NotionalAmount,
    ],
  ],
  // [
  //   ConcavaAnnual,
  //   [
  //     Direction,
  //     NotionalAmountType,
  //     PricingInitialSpot,
  //     UnderlyerMultiplier,
  //     PricingUnderlyerInstrumentId,
  //     LowBarrier,
  //     HighBarrier,
  //     PayOff,
  //     PricingTerm,
  //     PricingExpirationDate,
  //     NotionalAmount,
  //   ],
  // ],
  // [
  //   ConcavaUnAnnual,
  //   [
  //     Direction,
  //     NotionalAmountType,
  //     PricingInitialSpot,
  //     UnderlyerMultiplier,
  //     PricingUnderlyerInstrumentId,
  //     LowBarrier,
  //     HighBarrier,
  //     PayOff,
  //     PricingTerm,
  //     PricingExpirationDate,
  //     NotionalAmount,
  //   ],
  // ],
].map(([leg, colDefs]) => pickColumns(leg, colDefs));

function pickColumns(leg, colDefs) {
  return {
    ...leg,
    columnDefs: colDefs || [],
  };
}
