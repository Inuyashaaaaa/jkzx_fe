import React, { StyleHTMLAttributes } from 'react';

export interface StaticInputProps {
  value?: string | React.ReactNode;
  style?: StyleHTMLAttributes<any>;
  className?: string;
}
