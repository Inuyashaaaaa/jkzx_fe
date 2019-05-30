import React, { PureComponent } from 'react';
import Loading from '../../Loading';

class CustomLoadingOverlay extends PureComponent {
  public render() {
    return <Loading {...this.props} />;
  }
}

export default CustomLoadingOverlay;
