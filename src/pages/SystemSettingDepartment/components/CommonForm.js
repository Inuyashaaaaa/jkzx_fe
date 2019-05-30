import React, { Component } from 'react';
import {
  Input,
  DatePicker,
  Select,
  TreeSelect,
  Upload,
  Button,
  Icon,
  notification,
  InputNumber,
  // Popconfirm,
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getToken } from '@/tools/authority';

const { TreeNode } = TreeSelect;
const { Option } = Select;
const { TextArea } = Input;

const LABEL_FONT_SIZE = 14;

function sortResource(data, sortPropoerty) {
  if (!data) {
    return;
  }
  if (!(typeof data === 'object')) {
    return;
  }
  const { children } = data;
  if (children && children.length > 0) {
    children.sort((a, b) => {
      return a[sortPropoerty].localeCompare(b[sortPropoerty]);
    });
    children.forEach(c => sortResource(c, sortPropoerty));
  }
}

export default class CommonForm extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    const { data } = this.props;
    const initState = {};
    this.valueContainer = {};
    data.forEach(d => {
      initState[d.property] = '';
      this.valueContainer[d.property] = d.value || '';
    });
    this.state = initState;
  }

  disabledDate = current => {
    const { type, mainDate } = this.props;
    if (type === 'main') {
      return false;
    }
    //
    return current && current < moment(mainDate).endOf('day');
  };

  setId = value => {
    this.id = value;
  };

  setDate = value => {
    this.date = value;
  };

  generateTree = (data, key, display) => {
    if (!data) {
      return '';
    }
    const { children } = data;
    key = key === undefined ? 0 : key;
    const title = data[display];

    if (children && children.length > 0) {
      return (
        <TreeNode key={key} title={title} value={data.id}>
          {children.map((c, index) => this.generateTree(c, `${key}-${index}`, display))}
        </TreeNode>
      );
    }
    return <TreeNode key={key} title={title} value={data.id} />;
  };

  chooseDepartment = () => {};

  handleChange = (value, property) => {
    if (typeof value === 'string') {
      value = (value && value.trim()) || '';
    }
    this.valueContainer[property] = value;
    const nextState = Object.assign({}, this.state);
    if (nextState[property] && value) {
      nextState[property] = '';
      this.setState({
        ...nextState,
      });
    }
  };

  validateForm = callback => {
    const { data } = this.props;
    const values = this.valueContainer;
    const keys = Object.keys(values);
    const nextState = {};
    let passed = true;
    keys.forEach(key => {
      const target = data.find(d => d.property === key);
      const value = values[key];
      if (target.rule) {
        const message = target.rule.call(values, value);
        if (message) {
          nextState[key] = message;
          passed = false;
        }
      }
      if (target.required) {
        if (value === '') {
          nextState[key] = `${target.label}不能为空`;
          passed = false;
        }
      }
    });
    if (passed) {
      callback(values);
    } else {
      this.setState({
        ...nextState,
      });
    }
  };

  checkFileType = (file, data) => {
    const infos = (data && data.mimeInfos) || [];
    const types = (data && data.mimeTypes) || [];
    if (infos.length === 0 || types.length === 0) {
      return true;
    }
    const { handleStatusChange } = this.props;
    const type = (file && file.type) || '';
    if (infos.includes(type)) {
      handleStatusChange('uploading');
      return true;
    }
    notification.error({
      message: `文件上传只支持${types.join(',')}类型`,
    });
    return false;
  };

  onUploadStatusChanged = info => {
    const { handleStatusChange } = this.props;
    if (info.file.status === 'done') {
      handleStatusChange('success');
      notification.success({
        message: '模板上传成功',
      });
    }
    if (info.file.status === 'error') {
      handleStatusChange('failed');
      notification.error({
        message: (info.file && info.file.error && info.file.error.message) || '模板上传失败',
      });
    }
  };

  setLabelWidth = () => {
    const { data } = this.props;
    let defaultWidth = 20;
    const englishNumberPattern = /^[A-Za-z0-9\s]+$/;
    data.forEach(d => {
      const { label } = d;
      const length = (label && label.length) || 0;
      let labelWidth = length * LABEL_FONT_SIZE;
      if (englishNumberPattern.test(label)) {
        labelWidth = length * LABEL_FONT_SIZE * 0.5;
      }
      defaultWidth = defaultWidth > labelWidth ? defaultWidth : labelWidth;
    });
    return defaultWidth + LABEL_FONT_SIZE * 2;
  };

  generateInput = (item, index) => {
    const {
      type,
      label,
      property,
      required,
      placeholder,
      value,
      display,
      disabled,
      formatter,
      marginTop,
      attachData,
      listener,
    } = item;
    const st = this.state;
    const { uploadDisabled } = this.props;
    const commonStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    };
    const labelStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      width: this.setLabelWidth(),
      fontSize: LABEL_FONT_SIZE,
    };
    if (index !== 0) {
      commonStyle.marginTop = marginTop || 10;
    }
    if (type === 'text') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <Input
              disabled={!!disabled}
              defaultValue={value}
              placeholder={placeholder || ''}
              onChange={newValue => this.handleChange(newValue.target.value, property)}
              style={{ width: 300, marginLeft: 10 }}
            />
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'number') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <InputNumber
              disabled={!!disabled}
              defaultValue={value}
              placeholder={placeholder || ''}
              onChange={newValue => this.handleChange(newValue, property)}
              style={{ width: 300, marginLeft: 10 }}
            />
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'plain') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <div>{value}</div>
            <div style={{ width: 150, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'textArea') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <TextArea
            disabled={!!disabled}
            defaultValue={value}
            placeholder={placeholder || ''}
            onChange={newValue => this.handleChange(newValue.target.value, property)}
            style={{ width: 300, marginLeft: 10 }}
          />
        </div>
      );
    }
    if (type === 'password') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <Input
              type="password"
              disabled={!!disabled}
              placeholder={placeholder || ''}
              onChange={newValue => this.handleChange(newValue.target.value, property)}
              style={{ width: 300, marginLeft: 10 }}
            />
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'select') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <Select
              style={{ width: 300, marginLeft: 10 }}
              placeholder={placeholder || '请选择'}
              defaultValue={value}
              disabled={!!disabled}
              onChange={newValue => {
                this.handleChange(newValue, property);
                listener && listener(newValue);
              }}
            >
              {item.options.map(op => (
                <Option key={op}>{op}</Option>
              ))}
            </Select>
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'multiSelect') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <Select
              mode="multiple"
              style={{ width: 300, marginLeft: 10 }}
              placeholder={placeholder || '请选择'}
              disabled={!!disabled}
              onChange={newValue => this.handleChange(newValue, property)}
            >
              {item.options.map(op => (
                <Option key={op}>{op}</Option>
              ))}
            </Select>
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'treeSelect') {
      sortResource(item.data, display);
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <TreeSelect
              defaultValue={value}
              style={{ width: 300, marginLeft: 10 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={placeholder || '请选择'}
              allowClear
              treeDefaultExpandAll
              disabled={!!disabled}
              onChange={newValue => this.handleChange(newValue, property)}
            >
              {this.generateTree(item.data, 0, display)}
            </TreeSelect>
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'date') {
      return (
        <div style={commonStyle}>
          <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div>
            <DatePicker
              defaultValue={value ? moment(value) : null}
              style={{ width: 300, marginLeft: 10 }}
              format="YYYY-MM-DD"
              disabled={!!disabled}
              onChange={newValue => this.handleChange(newValue.format(formatter), property)}
            />
            <div style={{ width: 300, marginLeft: 10, color: '#f5222d' }}>{st[property] || ''}</div>
          </div>
        </div>
      );
    }
    if (type === 'upload') {
      return (
        <div style={{ textAlign: 'center', margin: '30px' }}>
          {/* <div style={labelStyle}>
            {!!required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div> */}
          <div>
            <Upload
              name="file"
              showUploadList={false}
              action={attachData.url}
              headers={{
                Authorization: `Bearer ${getToken()}`,
                // Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3YW5nbmFuIiwicm9sZXMiOlsidHJhZGVyIiwiYWRtaW4iXSwiaXNzIjoidG9uZ3l1LnRlY2giLCJleHAiOjE1NTk3MTI5MTc0MTIsImlhdCI6MTU1MTkzNjkxNzQxMiwidXNlcm5hbWUiOiJ3YW5nbmFuIn0.9b1zb6JG_XcaJSVukH2Num0djh5P9cEi3pvhHPYBJeU`,
              }}
              data={attachData.uploadData}
              beforeUpload={file => this.checkFileType(file, attachData)}
              onChange={info => this.onUploadStatusChanged(info)}
            >
              <Button disabled={uploadDisabled}>
                <Icon type="upload" />
                上传文件
              </Button>
            </Upload>
            {/* {attachData.mimeTypes && attachData.mimeTypes.length > 0 && (
              <div style={{ width: 150, marginTop: 2, color: '#999999' }}>
                {`支持${attachData.mimeTypes.join(',')}文件类型`}
              </div>
            )} */}
          </div>
        </div>
      );
    }
  };

  render() {
    const { data } = this.props;
    return (
      <div style={{ borderWidth: 0, borderColor: '#e8e8e8', borderStyle: 'solid' }}>
        {data.map((item, index) => this.generateInput(item, index))}
      </div>
    );
  }
}
