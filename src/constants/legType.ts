import { LEG_TYPE_MAP } from './common';
import { ILegType } from './legColDefs';
import { AnnualizedVerticalSpreadOptionDTOEuropeanAnnual } from './legColDefs/AnnualizedVerticalSpreadOptionDTOEuropeanAnnual';
import { AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual } from './legColDefs/AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual';
import { AnnulizedVanillaOptionDTOAmericanAnnual } from './legColDefs/AnnulizedVanillaOptionDTOAmericanAnnual';
import { AnnulizedVanillaOptionDTOAmericanUnAnnual } from './legColDefs/AnnulizedVanillaOptionDTOAmericanUnAnnual';
import { AnnulizedVanillaOptionDTOEuropeanAnnual } from './legColDefs/AnnulizedVanillaOptionDTOEuropeanAnnual';
import { AnnulizedVanillaOptionDTOEuropeanUnAnnual } from './legColDefs/AnnulizedVanillaOptionDTOEuropeanUnAnnual';
import { AsiaAnnual } from './legColDefs/AsiaAnnual';
import { AsiaUnAnnual } from './legColDefs/AsiaUnAnnual';
import { AutoCallPhoenixAnnual } from './legColDefs/AutoCallPhoenixAnnual';
import { AutoCallSnowAnnual } from './legColDefs/AutoCallSnowAnnual';
import { BarrierAnnual } from './legColDefs/BarrierAnnual';
import { BarrierUnAnnual } from './legColDefs/BarrierUnAnnual';
import { ConcavaAnnual } from './legColDefs/ConcavaAnnual';
import { ConcavaUnAnnual } from './legColDefs/ConcavaUnAnnual';
import { ConvexAnnual } from './legColDefs/ConvexAnnual';
import { ConvexUnAnnual } from './legColDefs/ConvexUnAnnual';
import { DigitalLegAmericanAnnual } from './legColDefs/DigitalLegAmericanAnnual';
import { DigitalLegAmericanUnAnnual } from './legColDefs/DigitalLegAmericanUnAnnual';
import { DigitalLegEuropeanAnnual } from './legColDefs/DigitalLegEuropeanAnnual';
import { DigitalLegEuropeanUnAnnual } from './legColDefs/DigitalLegEuropeanUnAnnual';
import { DoubleDigitalAnnual } from './legColDefs/DoubleDigitalAnnual';
import { DoubleDigitalUnAnnual } from './legColDefs/DoubleDigitalUnAnnual';
import { DoubleNoTouchAnnual } from './legColDefs/DoubleNoTouchAnnual';
import { DoubleNoTouchUnAnnual } from './legColDefs/DoubleNoTouchUnAnnual';
import { DoubleSharkFinAnnual } from './legColDefs/DoubleSharkFinAnnual';
import { DoubleSharkFinUnAnnual } from './legColDefs/DoubleSharkFinUnAnnual';
import { DoubleTouchAnnual } from './legColDefs/DoubleTouchAnnual';
import { DoubleTouchUnAnnual } from './legColDefs/DoubleTouchUnAnnual';
import { EagleAnnual } from './legColDefs/EagleAnnual';
import { EagleUnAnnual } from './legColDefs/EagleUnAnnual';
import { RangeAccrualsAnnual } from './legColDefs/RangeAccrualsAnnual';
import { RangeAccrualsUnAnnual } from './legColDefs/RangeAccrualsUnAnnual';
import { StraddleAnnual } from './legColDefs/StraddleAnnual';
import { StraddleUnAnnual } from './legColDefs/StraddleUnAnnual';
import { TripleDigitalAnnual } from './legColDefs/TripleDigitalAnnual';
import { TripleDigitalUnAnnual } from './legColDefs/TripleDigitalUnAnnual';

export const LEG_MAP: {
  [key: string]: ILegType;
} = {
  [LEG_TYPE_MAP.ASIAN_ANNUAL]: AsiaAnnual,
  [LEG_TYPE_MAP.ASIAN_UNANNUAL]: AsiaUnAnnual,

  [LEG_TYPE_MAP.AUTOCALL_ANNUAL]: AutoCallSnowAnnual,
  [LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL]: AutoCallPhoenixAnnual,

  // 现金
  // [LEG_TYPE_MAP.CASH]: 'CASH',
  // 其他单资产期权
  // [LEG_TYPE_MAP.GENERIC_SINGLE_ASSET_OPTION]: 'GENERIC_SINGLE_ASSET_OPTION',
  // 香草欧式
  // [LEG_TYPE_MAP.VANILLA_EUROPEAN]: 'VANILLA_EUROPEAN',
  // 欧式年化
  [LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL]: AnnulizedVanillaOptionDTOEuropeanAnnual,
  // 欧式非年华
  [LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL]: AnnulizedVanillaOptionDTOEuropeanUnAnnual,
  // 香草美式
  // [LEG_TYPE_MAP.VANILLA_AMERICAN]: 'VANILLA_AMERICAN',
  // 美式年化
  [LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL]: AnnulizedVanillaOptionDTOAmericanAnnual,
  // 美式非年化
  [LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL]: AnnulizedVanillaOptionDTOAmericanUnAnnual,
  // 价差
  // [LEG_TYPE_MAP.CALL_SPREAD]: 'CALL_SPREAD',
  // 价差-分解
  // [LEG_TYPE_MAP.CALL_SPREAD_COMBO]: 'CALL_SPREAD_COMBO',
  // AutoCall
  // [LEG_TYPE_MAP.AUTOCALL]: 'AUTOCALL',
  // 篮子
  // [LEG_TYPE_MAP.BASKET]: 'BASKET',
  // 现货
  // [LEG_TYPE_MAP.CASH_PRODUCT]: 'CASH_PRODUCT',
  // 期货
  // [LEG_TYPE_MAP.FUTURE]: 'FUTURE',
  // 指数
  // [LEG_TYPE_MAP.INDEX]: 'Index',
  // 其他
  // [LEG_TYPE_MAP.OTHER]: 'OTHER',
  // 二元
  // [LEG_TYPE_MAP.DIGITAL]: 'DIGITAL',
  // 美式二元年化
  [LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL]: DigitalLegAmericanAnnual,
  // 美式二元非年化
  [LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL]: DigitalLegAmericanUnAnnual,
  // 欧式二元年化
  [LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL]: DigitalLegEuropeanAnnual,
  // 欧式二元非年化
  [LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL]: DigitalLegEuropeanUnAnnual,
  // 价差
  // [LEG_TYPE_MAP.VERTICAL_SPREAD]: 'VERTICAL_SPREAD',
  // 价差欧式非年化
  [LEG_TYPE_MAP.VERTICAL_SPREAD_UNANNUAL]: AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual,
  // 价差欧式年化
  [LEG_TYPE_MAP.VERTICAL_SPREAD_ANNUAL]: AnnualizedVerticalSpreadOptionDTOEuropeanAnnual,
  // 单鲨
  // [LEG_TYPE_MAP.BARRIER]: 'BARRIER',
  // 单鲨年化
  [LEG_TYPE_MAP.BARRIER_ANNUAL]: BarrierAnnual,
  // 单鲨非年化
  [LEG_TYPE_MAP.BARRIER_UNANNUAL]: BarrierUnAnnual,
  // 双鲨
  // [LEG_TYPE_MAP.DOUBLE_SHARK_FIN]: 'DOUBLE_SHARK_FIN',
  // 双鲨年化
  [LEG_TYPE_MAP.DOUBLE_SHARK_FIN_ANNUAL]: DoubleSharkFinAnnual,
  // 双鲨非年化
  [LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL]: DoubleSharkFinUnAnnual,
  // 鹰式
  // EAGLE: 'EAGLE',
  // 鹰式年化
  [LEG_TYPE_MAP.EAGLE_ANNUAL]: EagleAnnual,
  // 鹰式非年化
  [LEG_TYPE_MAP.EAGLE_UNANNUAL]: EagleUnAnnual,
  // 美式双触碰
  // TOUCH: 'TOUCH',
  // 美式双触碰年化
  [LEG_TYPE_MAP.DOUBLE_TOUCH_ANNUAL]: DoubleTouchAnnual,
  // 美式双触碰非年化
  [LEG_TYPE_MAP.DOUBLE_TOUCH_UNANNUAL]: DoubleTouchUnAnnual,
  // 美式双不触碰
  // NO_TOUCH: 'NO_TOUCH',
  // 美式双不触碰年化
  [LEG_TYPE_MAP.DOUBLE_NO_TOUCH_ANNUAL]: DoubleNoTouchAnnual,
  // 美式双不触碰非年化
  [LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL]: DoubleNoTouchUnAnnual,
  // 二元凹式年化
  [LEG_TYPE_MAP.CONCAVA_ANNUAL]: ConcavaAnnual,
  // 二元凹式非年化
  [LEG_TYPE_MAP.CONCAVA_UNANNUAL]: ConcavaUnAnnual,
  // 二元凸式年化
  [LEG_TYPE_MAP.CONVEX_ANNUAL]: ConvexAnnual,
  // 二元凸式非年化
  [LEG_TYPE_MAP.CONVEX_UNANNUAL]: ConvexUnAnnual,
  // 三层积累年化
  [LEG_TYPE_MAP.DOUBLE_DIGITAL_ANNUAL]: DoubleDigitalAnnual,
  // 三层积累非年化
  [LEG_TYPE_MAP.DOUBLE_DIGITAL_UNANNUAL]: DoubleDigitalUnAnnual,
  // 四层积累年化
  [LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL]: TripleDigitalAnnual,
  // 四层积累非年化
  [LEG_TYPE_MAP.TRIPLE_DIGITAL_UNANNUAL]: TripleDigitalUnAnnual,
  // 区间累积年化
  [LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL]: RangeAccrualsAnnual,
  // 区间累积非年化
  [LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL]: RangeAccrualsUnAnnual,
  // 跨式年化
  [LEG_TYPE_MAP.STRADDLE_ANNUAL]: StraddleAnnual,
  // 跨式非年化
  [LEG_TYPE_MAP.STRADDLE_UNANNUAL]: StraddleUnAnnual,
};
