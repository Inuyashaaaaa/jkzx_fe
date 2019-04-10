import { Button, Upload as AntdUpload } from 'antd';
import { UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { omit } from 'lodash';
import React from 'react';
import { InputBase } from '../type';

export interface IUploadProps extends UploadProps {
  maxLen?: number;
}

class Input extends InputBase<IUploadProps> {
  public static defaultProps = {
    maxLen: 1,
  };

  //   public getRef = node => {
  //     if (this.props.autoSelect && node) {
  //       node.select();
  //     }
  //   };

  public handleFileList = fileList => {
    const maxLen = this.props.maxLen;

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

    return fileList;
  };

  public onChange = (info: UploadChangeParam) => {
    info = {
      ...info,
      fileList: this.handleFileList(info.fileList),
    };

    if (this.props.onChange) {
      this.props.onChange(info.fileList, info);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(info.fileList, info);
    }
  };

  public renderEditing() {
    return (
      <AntdUpload
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        fileList={this.props.value}
        onChange={this.onChange}
      >
        {this.props.children || <Button icon="upload">上传</Button>}
      </AntdUpload>
    );
  }

  public renderRendering() {
    const { value: fileList = [] } = this.props;
    return fileList.map((item, index) => (
      <span key={index} style={{ display: 'inline-block', width: '100%' }}>
        {item.name || item.fileName}
      </span>
    ));
  }
}

export default Input;
