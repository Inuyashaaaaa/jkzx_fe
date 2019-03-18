import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import classnames from 'classnames';
import _ from 'lodash';
import React from 'react';
import { InputCommonClass } from '../Input';
import './index.less';

export interface Email2Props extends AutoCompleteProps {
  options?: string[];
}

class Email2 extends InputCommonClass<Email2Props> {
  public static defaultProps = {
    options: ['gmail.com', '163.com', 'qq.com', 'foxmail.com'],
  };

  public state = {
    result: [],
  };

  public handleSearch = _.debounce(value => {
    let result;
    // tslint:disable-next-line:prefer-conditional-expression
    if (!value || value.indexOf('@') >= 0) {
      result = [];
    } else {
      result = this.props.options.map(domain => `${value}@${domain}`);
    }
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

  public renderChild(props, onChange) {
    return (
      <AutoComplete
        {...props}
        onSearch={this.handleSearch}
        onChange={onChange}
        className={classnames(props.className, 'tongyu-email')}
      >
        {this.state.result.map(email => (
          <AutoComplete.Option key={email}>{email}</AutoComplete.Option>
        ))}
      </AutoComplete>
    );
  }
}

export default Email2;
