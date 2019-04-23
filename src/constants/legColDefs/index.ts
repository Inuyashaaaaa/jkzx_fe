import { IColDef } from '@/design/components/Table/types';
import { AnnualizedVerticalSpreadOptionDTOEuropeanAnnual } from './AnnualizedVerticalSpreadOptionDTOEuropeanAnnual';
import { AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual } from './AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual';
import { AnnulizedVanillaOptionDTOAmericanAnnual } from './AnnulizedVanillaOptionDTOAmericanAnnual';
import { AnnulizedVanillaOptionDTOAmericanUnAnnual } from './AnnulizedVanillaOptionDTOAmericanUnAnnual';
import { AnnulizedVanillaOptionDTOEuropeanAnnual } from './AnnulizedVanillaOptionDTOEuropeanAnnual';
import { AnnulizedVanillaOptionDTOEuropeanUnAnnual } from './AnnulizedVanillaOptionDTOEuropeanUnAnnual';
import { AsiaAnnual } from './AsiaAnnual';
import { AsiaUnAnnual } from './AsiaUnAnnual';
import { AutoCallPhoenixAnnual } from './AutoCallPhoenixAnnual';
import { AutoCallSnowAnnual } from './AutoCallSnowAnnual';
import { BarrierAnnual } from './BarrierAnnual';
import { BarrierUnAnnual } from './BarrierUnAnnual';
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
import { ModelXYAnnual } from './ModelXYAnnual';
import { ModelXYUnAnnual } from './ModelXYUnAnnual';
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
  getColumnDefs: (env?: string) => IColDef[];
  getPricingColumnDefs?: () => any[];
  isAnnualized: boolean;
  getDefault?: any;
  getPosition?: any;
  getPageData?: any;
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
  AutoCallPhoenixAnnual,
  ModelXYAnnual,
  ModelXYUnAnnual,
];

export const allTryPricingLegTypes: ILegType[] = allLegTypes;
