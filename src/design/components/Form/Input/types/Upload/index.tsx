import { Button, Upload } from 'antd';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import { Upload2Props } from './types';

class Upload2 extends InputPolym<Upload2Props> {
  public static defaultProps = {
    label: '点击上传',
    maxLen: 1,
  };

  public formatValue = value => {
    return value.map(item => item.name).join(';');
  };

  public formatChangeEvent = event => {
    let { fileList } = event;

    const maxLen = this.getMaxLen();

    if (maxLen) {
      fileList = fileList.slice(-maxLen);
    }

    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    return {
      origin: fileList,
      normal: fileList,
    };
  };

  public getMaxLen = () => {
    if ('maxLen' in this.props) {
      return this.props.maxLen;
    }
    return undefined;
  };

  public parseValue = value => {
    return value || [];
  };

  public getLabel = () => {
    if ('label' in this.props) {
      return this.props.label;
    }
    return '';
  };

  public renderEditing(props, onChange) {
    return (
      <Upload {...props} fileList={props.value} onChange={onChange}>
        <Button icon="upload">{this.getLabel()}</Button>
      </Upload>
    );
  }
}

export default Upload2;
