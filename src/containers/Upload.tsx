import { Upload } from '@/components';
import _ from 'lodash';
import React from 'react';
class SaveUpload extends Upload {
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

export default SaveUpload;
