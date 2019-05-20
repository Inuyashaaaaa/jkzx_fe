import React, { PureComponent } from 'react';
import ShowInputBase from './ShowInputBase';
import { ShowInputProps } from './types';

class ShowInput extends PureComponent<ShowInputProps, any> {
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
      <ShowInputBase
        {...rest}
        icon={this.state.usedIcon}
        onIconMouseEnter={this.onIconMouseEnter}
        onIconMouseLeave={this.onIconMouseLeave}
      />
    );
  }
}

export default ShowInput;
