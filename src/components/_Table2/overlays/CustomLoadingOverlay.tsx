import React, { PureComponent } from 'react';
import Loading from '../../_Loading2';

class CustomLoadingOverlay extends PureComponent {
  public render() {
    return <Loading {...this.props} />;
  }
}

export default CustomLoadingOverlay;
