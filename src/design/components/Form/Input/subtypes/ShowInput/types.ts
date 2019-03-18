import { MouseEventHandler } from 'react';
import { Omit } from '../../../../../components/common/types';
import { IInputSize } from '../../interface';

export interface ShowInputBaseProps {
  size?: IInputSize;
  bordered?: boolean;
  value?: string;
  placeholder?: string;
  className?: string;
  icon?: string;
  iconVisible?: boolean;
  onIconClick?: () => void;
  onIconMouseEnter?: MouseEventHandler;
  onIconMouseLeave?: MouseEventHandler;
}

export interface ShowInputProps
  extends Omit<ShowInputBaseProps, 'onIconMouseEnter' | 'onIconMouseLeave'> {
  hoverIcon?: string;
}
