import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { Input } from '@/containers';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Typography } from 'antd';

export const PositionId: ILegColDef = {
  editable: record => {
    return false;
  },
  title: '持仓ID',
  dataIndex: LEG_FIELD.POSITION_ID,
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <Typography.Paragraph ellipsis={true} style={{ width: 150, margin: 0 }}>
        {value}
      </Typography.Paragraph>
    );
  },
};
