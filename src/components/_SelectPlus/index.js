import StaticInput from '@/components/_InputPlus/StaticInput';
import Loading from '@/components/_Loading';
import { delay, wrapType, assert, isType } from '@/utils';
import { Select } from 'antd';
import classNames from 'classnames';
import { arrayOf, bool, func, number, oneOfType, shape, string } from 'prop-types';
import React, { PureComponent } from 'react';
import './index.less';

const { Option } = Select;

const OptionItem = shape({
  name: string,
  value: oneOfType([string, number]),
});

const Options = arrayOf(OptionItem);

class SelectPlus extends PureComponent {
  static propTypes = {
    options: oneOfType([Options, func]),
    interactive: bool,
    size: string,
    bordered: bool,
    hideEditIcon: bool,
    onEditIconClick: func,
    placeholder: string,
  };

  static defaultProps = {
    interactive: true,
    options: [],
    size: 'default',
    bordered: true,
    hideEditIcon: false,
  };

  state = {
    options: null,
    loading: false,
  };

  static getDerivedStateFromProps = (props, state) => {
    if (!state.proxy && (isType(props.options, Function) || isType(props.options, Promise))) {
      return {
        proxy: props.options,
        options: [],
        loading: true,
      };
    }
    return null;
  };

  componentDidMount = () => {
    const { proxy } = this.state;
    const { options } = this.props;
    proxy && this.fetchOptions(options);
  };

  fetchOptions = options => {
    const data = wrapType(options, Function, () => options).call(undefined);
    const result = wrapType(data, Promise, delay(200, data));

    result
      .then(fetchOptions => {
        assert(
          isType(fetchOptions, Array),
          `${this.name}: options fetch back value type must be Array.`
        );

        this.setState({
          loading: false,
          options: fetchOptions,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      options,
      getFormControlRef,
      interactive,
      bordered,
      className,
      hideEditIcon,
      onEditIconClick,
      iconType,
      hoverAppealIcon,
      hoverIconType,
      ...rest
    } = this.props;

    const { value, size, placeholder } = rest;
    const { options: proxyOptions, loading, proxy } = this.state;

    const useOptions = proxyOptions || options;
    const notFoundContent = useOptions.length === 0;

    return interactive ? (
      <Select
        notFoundContent={loading ? <Loading /> : proxy ? <div>获取数据失败</div> : undefined}
        {...rest}
        ref={getFormControlRef}
        className={classNames(`tongyu-select-plus`, className, {
          'no-border': !bordered,
        })}
      >
        {useOptions.map(item => {
          return (
            <Option key={item.value} value={item.value}>
              {item.name}
            </Option>
          );
        })}
      </Select>
    ) : notFoundContent ? (
      <div className={classNames(`tongyu-select-plus`, className)} {...rest}>
        {loading ? <Loading /> : proxy ? <div>获取数据失败</div> : <div>暂无数据</div>}
      </div>
    ) : (
      <StaticInput
        hoverIconType={hoverIconType}
        iconType={iconType}
        hoverAppealIcon={hoverAppealIcon}
        bordered={bordered}
        size={size}
        className={className}
        value={useOptions.find(item => item.value === value)?.name}
        placeholder={placeholder}
        onEditIconClick={onEditIconClick}
        hideEditIcon={hideEditIcon}
      />
    );
  }
}

export default SelectPlus;
