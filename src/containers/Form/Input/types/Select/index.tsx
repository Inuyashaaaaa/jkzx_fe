import { Select } from 'antd';
import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import Loading from '@/containers/Loading';
import { uuid } from '@/tools';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { Select2Props, SelectOptionItem } from './types';

const Option = Select.Option;

class Select2 extends InputPolym<Select2Props, any> {
  public static getDerivedStateFromProps(props, state) {
    if (typeof props.options === 'function') {
      return {
        isRemote: true,
      };
    }
    return {
      isRemote: false,
    };
  }

  public state = {
    remoteOptions: [],
    fetchLoading: false,
    isRemote: false,
  };

  private lastRequest: any = null;

  private hasDefaultOpend: boolean = false;

  private getRemoteOptions = _.debounce(async (value: any, hash: any) => {
    if (!_.isFunction(this.props.options)) {
      return;
    }

    const getOptions = this.props.options;

    const data =
      typeof getOptions === 'function'
        ? await getOptions(value).catch(error => {
            console.error(error);
          })
        : getOptions;

    // 如果不是最后一次请求，直接返回
    if (hash !== this.lastRequest) {
      return;
    }

    this.setState({
      fetchLoading: false,
      remoteOptions: data,
    });
  }, 350);

  public componentDidMount = () => {
    if (this.state.isRemote) {
      this.getRemoteOptions('', this.lastRequest);
    }
  };

  public formatValue = value => {
    if (Array.isArray(value)) {
      return value.map(this.format).join(', ');
    }
    return this.format(value);
  };

  public format = value => {
    if (typeof value === 'object' && value !== null) {
      return value.label;
    }
    const findItem = (this.getOptions() || []).find(item => item.value === value);

    if (findItem && React.isValidElement(findItem.label)) {
      throw new Error('Select2: format label type cannot be Element.');
    }

    return findItem ? findItem.label : '';
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

  public getOptions = () => {
    if ('options' in this.props) {
      if (this.state.isRemote) {
        return this.state.remoteOptions;
      }
      return this.props.options as SelectOptionItem[];
    }
    return [];
  };

  public onSearch = (value: string) => {
    if (this.props.onSearch) {
      this.props.onSearch(value);
    }

    if (this.state.isRemote) {
      this.setState(
        {
          remoteOptions: [],
          fetchLoading: true,
        },
        () => {
          this.lastRequest = uuid();
          this.getRemoteOptions(value, this.lastRequest);
        }
      );
    }
  };

  public renderEditing(props, onChange) {
    const { defaultOpen, inputType, style, ...rest } = props;

    // filterOption use 'in' judge controled
    if (this.state.isRemote) {
      rest.filterOption = false;
    }

    return (
      <Select
        style={{
          minWidth: 180,
          ...style,
        }}
        ref={$inputNode => {
          if (defaultOpen && !this.hasDefaultOpend) {
            setTimeout(() => {
              if ($inputNode) {
                try {
                  ($inputNode as any).rcSelect.setOpenState(true);
                  this.hasDefaultOpend = true;
                } catch (error) {
                  console.warn(error);
                }
              }
            }, 0);
          }
        }}
        onSearch={this.onSearch}
        notFoundContent={this.getNotFoundContent()}
        {...rest}
        className={cn(props.className, `tongyu-select`)}
        onChange={onChange}
      >
        {this.getOptions().map(option => {
          const { value, label } = option;
          return (
            <Option key={value} value={value}>
              {label}
            </Option>
          );
        })}
      </Select>
    );
  }

  private getNotFoundContent = () => {
    return this.state.fetchLoading ? (
      <Loading size="small" />
    ) : this.state.isRemote ? (
      ''
    ) : (
      undefined
    );
  };
}

export default Select2;
