import { uuid } from '@/design/utils';
import { Select as AntdSelect } from 'antd';
import { OptionProps, SelectProps } from 'antd/lib/select';
import _, { debounce, omit } from 'lodash';
import React from 'react';
import Loading from '../Loading';
import { InputBase } from '../type';

export type IOptionProps = OptionProps & { label?: string | React.ReactNode };

export interface ISelectProps extends SelectProps {
  options?: (IOptionProps[]) | ((value: any) => Promise<IOptionProps[]>);
  fetchOptionsOnSearch?: boolean;
}

class Select extends InputBase<
  ISelectProps,
  {
    loading: boolean;
    options?: IOptionProps[];
  }
> {
  public static Option = AntdSelect.Option;

  public static defaultProps = {
    editing: true,
  };

  public state = {
    loading: true,
    options: [],
  };

  public fetchOptions = debounce((value: any, hash: any) => {
    if (typeof this.props.options !== 'function') {
      return;
    }

    this.setState({ loading: true });
    try {
      this.props
        .options(value)
        .then(options => {
          // 如果不是最后一次请求，直接返回
          if (hash !== this.lastRequestId) {
            return;
          }

          this.setState({ options });
        })
        .finally(() => this.setState({ loading: false }));
    } catch (error) {
      console.error('Select:fetchOptions has error', error);
    }
  }, 350);

  private hasDefaultOpend: boolean = false;

  private lastRequestId: any = null;

  public getRef = node => {
    if (this.props.defaultOpen && !this.hasDefaultOpend) {
      setTimeout(() => {
        if (node) {
          try {
            (node as any).rcSelect.setOpenState(true);
            this.hasDefaultOpend = true;
          } catch (error) {
            console.warn(error);
          }
        }
      });
    }
  };

  public componentDidMount = () => {
    if (this.props.editing) {
      this.fetchOptions('', this.lastRequestId);
    }
  };

  public onChange = (value, option: React.ReactElement<any>) => {
    if (this.props.onChange) {
      this.props.onChange(value, option);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(value, option);
    }
  };

  public isRemoteOptions = () => typeof this.props.options === 'function';

  public onSearch = (value: string) => {
    if (!this.props.fetchOptionsOnSearch) return;

    if (this.isRemoteOptions()) {
      this.setState(
        {
          options: [],
          loading: true,
        },
        () => {
          this.lastRequestId = uuid();
          this.fetchOptions(value, this.lastRequestId);
        }
      );
    }
  };

  public renderEditing() {
    return (
      <AntdSelect
        filterOption={this.isRemoteOptions() ? false : undefined}
        onSearch={this.onSearch}
        notFoundContent={this.state.loading ? <Loading /> : undefined}
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing', 'defaultOpen'])}
        style={{ width: '100%', ...this.props.style }}
        onChange={this.onChange}
        ref={this.getRef}
      >
        {this.props.children ||
          (Array.isArray(this.props.options) ? this.props.options : this.state.options).map(
            (item, index) => (
              <AntdSelect.Option key={index} {...omit(item, ['label'])}>
                {item.label}
              </AntdSelect.Option>
            )
          )}
      </AntdSelect>
    );
  }

  public getOptions = () => {
    const options =
      typeof this.props.options === 'function' ? this.state.options : this.props.options;
    return options;
  };

  public renderRendering() {
    const { value } = this.props;
    return (
      <span style={{ display: 'inline-block', width: '100%', lineHeight: '40px' }}>
        {value &&
          (Array.isArray(value) ? value : [value])
            .map(val => {
              const findItem =
                typeof this.props.options === 'function'
                  ? this.props.value
                  : this.props.options.find(item => item.value === val);
              return _.get(findItem, 'label', this.props.value);
            })
            .join(',')}
      </span>
    );
  }
}

export default Select;
