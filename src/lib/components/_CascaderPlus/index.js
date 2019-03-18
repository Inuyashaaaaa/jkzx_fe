import React from 'react';
import { Cascader } from 'antd';
import { shape, string, func, oneOfType, arrayOf, bool } from 'prop-types';
import { isType, assert } from '@/lib/utils';
import { PureStateComponent } from '@/lib/components/_Components';

const OptionItem = shape({
  loading: bool,
  label: string,
  value: string,
});

const Options = arrayOf(OptionItem);

class CascaderPlus extends PureStateComponent {
  static propTypes = {
    options: oneOfType([Options, func]),
  };

  static stateTypes = {
    asyncOptions: Options,
  };

  static defaultProps = {};

  state = {};

  componentDidMount = () => {
    const { options, formData } = this.props;
    const selectedOptions = [];

    if (isType(options, 'Function')) {
      const result = options({ selectedOptions, formData });
      if (isType(result, 'Promise')) {
        this.setState({
          asyncOptions: [{ loading: true, value: 'loading' }],
        });
        result
          .then(children => {
            assert(
              isType(children, 'Array'),
              `${this.name}: value of promise resolved, its type must be Array.`
            );
            this.fetchOptionsSuccess(selectedOptions, children);
          })
          .catch(err => {
            console.error(err);
            this.fetchOptionsFail(selectedOptions);
          });
      } else {
        assert(
          isType(result, 'Array'),
          `${this.name}: value of options return back, its type must be Array.`
        );
        this.fetchOptionsSuccess(selectedOptions, result);
      }
    }
  };

  fetchOptionsSuccess = (selectedOptions, children) => {
    if (!selectedOptions.length) {
      return this.setState({
        asyncOptions: children,
      });
    }

    const { asyncOptions } = this.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = false;
    targetOption.children = children;

    this.setState({
      asyncOptions: [...asyncOptions],
    });
  };

  fetchOptionsFail = selectedOptions => {
    if (!selectedOptions.length) {
      return this.setState({
        asyncOptions: [],
      });
    }

    const { asyncOptions } = this.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = false;

    this.setState({
      asyncOptions: [...asyncOptions],
    });
  };

  loadData = selectedOptions => {
    const { options, formData } = this.props;

    // after call this func, auto setState
    selectedOptions[selectedOptions.length - 1].loading = true;

    options({ selectedOptions, formData })
      .then(children => {
        this.fetchOptionsSuccess(selectedOptions, children);
      })
      .catch(() => {
        this.fetchOptionsFail(selectedOptions);
      });
  };

  render() {
    const { options, showSearch, formData, ...rest } = this.props;
    const { asyncOptions } = this.state;

    const opIsFunc = isType(options, 'Function');

    if (opIsFunc && showSearch !== undefined) {
      console.assert(
        !!opIsFunc !== !!showSearch,
        'CascaderPlus: loadData cannot both appear with showSearch .'
      );
    }

    return (
      <Cascader
        {...rest}
        options={asyncOptions || (isType(options, 'Function') || !options ? [] : options)}
        loadData={opIsFunc ? this.loadData : undefined}
        showSearch={!opIsFunc && showSearch}
      />
    );
  }
}

export default CascaderPlus;
