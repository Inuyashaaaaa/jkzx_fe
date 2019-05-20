import React, { PureComponent } from 'react';
import { Checkbox } from 'antd';
import { CheckboxPlus as types } from '@/components/CheckboxPlus/types';

const { Group: CheckboxGroup } = Checkbox;

class CheckboxPlus extends PureComponent {
  static propTypes = types;
  // @todo
  //   getPropxState = () => {
  //     return { options };
  //   };

  render() {
    return <CheckboxGroup {...this.props} />;
  }
}

export default CheckboxPlus;
