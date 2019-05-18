import {
  DatePickerProps,
  MonthPickerProps,
  RangePickerProps,
  RangePickerValue,
  WeekPickerProps,
} from 'antd/lib/date-picker/interface';
import moment from 'moment';

// omit [undefined, undefined]
export type RangePickerValueSafe =
  | [moment.Moment]
  | [undefined, moment.Moment]
  | [moment.Moment, moment.Moment];

export type AllDatePicker2Props =
  | DatePicker2Props
  | RangePickerProps
  | WeekPickerProps
  | MonthPickerProps;

export type IRangeOnChange = (dates: RangePickerValue, dateStrings: [string, string]) => void;

export type ISingleOnChange = (date: moment.Moment, dateString: string) => void;

export interface DatePicker2Props extends DatePickerProps {
  range?: 'week' | 'range' | 'month' | 'day';
  format?: string;
  className?: string;
}
