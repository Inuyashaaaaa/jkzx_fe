import _ from 'lodash';
import React from 'react';
import { Upload } from '@/design/components';
class YangInput extends Upload {
  public renderRendering() {
    let { value } = this.props;
    if (_.isString(value)) {
      value = [
        {
          id: value,
          name: value,
          uid: value,
        },
      ];
    }
    return <Upload {...this.props} value={value} />;
  }
}

export default YangInput;
