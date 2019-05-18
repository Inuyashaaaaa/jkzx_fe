import { SelectProps } from 'antd/lib/select';
import React from 'react';

export type SelectPlaceholder = string | React.ReactNode;

export type SelectOptionItem = Array<{
  label: string | JSX.Element;
  value: string;
}>;

export interface Select2Props extends SelectProps {
  options?: SelectOptionItem[] | ((value: string) => Promise<SelectOptionItem[]>);
  defaultOpenDelay?: boolean | number;
  uionId?: string;
}
