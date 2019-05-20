import { IColumnDef } from '@/components/_Table2';

export const DEFAULT_CALENDAR = 'DEFAULT_CALENDAR';

export const HOLIDAY_FORMAT = 'YYYY-MM-DD';

export const TABLE_COLUMN_DEFS: IColumnDef[] = [
  {
    headerName: '非交易日',
    field: 'holiday',
    width: 200,
    input: {
      type: 'date',
      range: 'day',
    },
  },
  {
    headerName: '备注',
    field: 'note',
    width: 200,
    input: {
      type: 'input',
    },
  },
];
