import { Button, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import React from 'react';
import { InputCommonClass } from '../Input';

export interface Upload2Props extends UploadProps {
  label?: string;
  maxLen?: number;
  value?: UploadFile[];
}

class Upload2 extends InputCommonClass<Upload2Props> {
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

  public renderChild(props, onChange) {
    return (
      <Upload
        {...props}
        action={'//jsonplaceholder.typicode.com/posts/'}
        fileList={props.value}
        onChange={onChange}
      >
        <Button icon="upload">{this.getLabel()}</Button>
      </Upload>
    );
  }
}

export default Upload2;
