import { AutoComplete } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { Email2Props } from './types';

class Email2 extends InputPolym<Email2Props> {
  public static defaultProps = {
    options: ['gmail.com', '163.com', 'qq.com', 'foxmail.com'],
  };

  public state = {
    result: [],
  };

  public handleSearch = _.debounce(value => {
    const result =
      !value || value.indexOf('@') >= 0
        ? []
        : this.props.options.map(domain => `${value}@${domain}`);
    this.setState({ result });
  }, 200);

  public formatValue = value => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public parseValue = value => {
    return value;
  };

  public renderEditing(props, onChange) {
    return (
      <AutoComplete
        {...props}
        onSearch={this.handleSearch}
        onChange={onChange}
        className={classnames(props.className, 'tongyu-emails')}
      >
        {this.state.result.map(email => (
          <AutoComplete.Option key={email}>{email}</AutoComplete.Option>
        ))}
      </AutoComplete>
    );
  }
}

export default Email2;
