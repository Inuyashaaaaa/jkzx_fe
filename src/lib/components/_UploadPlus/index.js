import React, { PureComponent } from 'react';
import { Upload, Button } from 'antd';
import { arrayOf, string, number, bool, shape, object, oneOf } from 'prop-types';

class UploadPlus extends PureComponent {
  static propTypes = {
    multiple: bool, // 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
    action: string.isRequired, // 必选参数, 上传的地址
    // see more https://ant.design/components/upload-cn/#API
    value: arrayOf(
      shape({
        uid: string,
        name: string,
        status: oneOf(['uploading', 'done', 'error', 'removed']),
        url: string,
        response: object,
        linkProps: object,
      })
    ),

    maxLen: number, // 最大上传文件数
    label: string,
  };

  static defaultProps = {
    value: [],
    multiple: true,
    maxLen: 10,
    label: '点击上传',
  };

  handleChange = ({ fileList }) => {
    const { onChange, maxLen } = this.props;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-maxLen);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. Filter successfully uploaded files according to response from server
    // fileList = fileList.filter(file => {
    //   if (file.response) {
    //     return file.response.status === 'success';
    //   }
    //   return true;
    // });

    onChange?.(fileList);
  };

  render() {
    const { value, onChange, label, ...rest } = this.props;
    return (
      <Upload {...rest} fileList={value} onChange={this.handleChange}>
        <Button icon="upload">{label}</Button>
      </Upload>
    );
  }
}

export default UploadPlus;
