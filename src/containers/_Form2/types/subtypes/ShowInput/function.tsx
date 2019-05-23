import { Omit } from '@/containers/common/types';
import React, { PureComponent } from 'react';
import ShowInput, { ShowInputProps } from './ShowInput';

export interface FunctionShowInputProps
  extends Omit<ShowInputProps, 'onIconMouseEnter' | 'onIconMouseLeave'> {
  hoverIcon?: string;
}

class FunctionShowInput extends PureComponent<FunctionShowInputProps, any> {
  public static defaultProps = {
    icon: 'lock',
    iconVisible: true,
    hoverIcon: 'unlock',
  };

  constructor(props) {
    super(props);
    this.state = {
      usedIcon: props.icon,
    };
  }

  public onIconMouseEnter = () => {
    if (this.props.hoverIcon) {
      this.setState({
        usedIcon: this.props.hoverIcon,
      });
    }
  };

  public onIconMouseLeave = () => {
    if (this.props.hoverIcon) {
      this.setState({
        usedIcon: this.props.icon,
      });
    }
  };

  public render() {
    const { hoverIcon, ...rest } = this.props;
    return (
      <ShowInput
        {...rest}
        icon={this.state.usedIcon}
        onIconMouseEnter={this.onIconMouseEnter}
        onIconMouseLeave={this.onIconMouseLeave}
      />
    );
  }
}

export default FunctionShowInput;
