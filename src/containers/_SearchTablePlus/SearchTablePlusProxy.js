import SearchTablePlus from '@/containers/_SearchTablePlus/SearchTablePlus';
import { SearchTablePlusProxy as types } from '@/containers/_SearchTablePlus/types';
import { delay, isType, wrapType } from '@/tools';
import produce from 'immer';
import React, { PureComponent } from 'react';

class SearchTablePlusProxy extends PureComponent {
  static propTypes = types;

  currentFetchCount = 0;

  state = {};

  static getDerivedStateFromProps = (props, state) => {
    const proxyState = {};

    // timing to derive proxy state
    if (isType(props.dataSource, Function)) {
      if (!state.dataSourceProxying) {
        proxyState.dataSource = [];
        proxyState.loading = false;
        proxyState.pagination = props.pagination;

        proxyState.dataSourceProxying = true;
      }
      // timing to clean derive proxy state
    } else if (props.dataSource && state.dataSourceProxying) {
      delete state.dataSource;
      delete state.loading;
      delete state.dataSourceProxying;
      delete state.pagination;
    }

    if (props.editings === undefined) {
      if (!state.editingsProxying) {
        proxyState.editings = {};

        proxyState.editingsProxying = true;
      }
      // timing to clean derive proxy state
    } else if (props.dataSource && state.editingsProxying) {
      delete state.editings;
      delete state.editingsProxying;
    }

    if (props.form?.dataSource === undefined) {
      if (!state.formDataSourceProxying) {
        proxyState.formDataSource = {};
        proxyState.formDataSourceProxying = true;
      }
    } else if (props.form?.formDataSource && state.form?.formDataSourceProxying) {
      delete state.formDataSource;
      delete state.formDataSourceProxying;
    }

    return proxyState;
  };

  componentDidMount = () => {
    const { dataSourceProxying } = this.state;
    if (dataSourceProxying) {
      this.fetchAsyncDataSource();
    }
  };

  proxySearch = (...args) => {
    const {
      form: { onSearch },
    } = this.props;
    const { dataSourceProxying } = this.state;

    if (dataSourceProxying) {
      return this.fetchAsyncDataSource();
    }

    return onSearch?.(...args);
  };

  proxyReset = (...args) => {
    const {
      form: { onReset, items },
    } = this.props;
    const { dataSourceProxying, formDataSourceProxying } = this.state;

    if (formDataSourceProxying) {
      items && this.$baseTable.$formPlus.resetForm();
      if (dataSourceProxying) {
        setTimeout(() => {
          this.fetchAsyncDataSource();
        }, 0);
      }
      return;
    }

    return onReset?.(...args);
  };

  proxyFormChange = fields => {
    const { form } = this.props;
    const { formDataSourceProxying } = this.state;

    if (formDataSourceProxying) {
      const { formDataSource } = this.state;
      const nextState = {
        formDataSource: {
          ...formDataSource,
          ...fields,
        },
      };
      this.setState(nextState);
      return;
    }

    return form?.onChange?.(fields);
  };

  proxyTableChange = (...args) => {
    const { onChange, pagination: controledPagination } = this.props;
    const { dataSourceProxying } = this.state;

    if (dataSourceProxying) {
      const [pagination] = args;
      this.setState(
        {
          pagination,
        },
        () => controledPagination && this.fetchAsyncDataSource()
      );
      return;
    }

    return onChange?.(...args);
  };

  proxyEdit = event => {
    const { onEdit, rowKey } = this.props;
    const { dataSourceProxying } = this.state;

    if (dataSourceProxying) {
      const { row, field } = event;
      return this.setState(
        produce(draft => {
          const findItem = draft.dataSource.find(item => item[rowKey] === row[rowKey]);
          Object.keys(field).forEach(key => {
            findItem[key] = field[key];
          });
        })
      );
    }

    return onEdit?.(event);
  };

  proxyStartEdit = event => {
    const { onStartEdit, rowKey } = this.props;
    const { editingsProxying } = this.state;

    if (editingsProxying) {
      const { row, dataIndex } = event;
      return this.setState(
        produce(draft => {
          if (!draft.editings[dataIndex]) {
            draft.editings[dataIndex] = {};
          }
          draft.editings[dataIndex][row[rowKey]] = true;
        })
      );
    }

    return onStartEdit?.(event);
  };

  getMergedProps = () => {
    const { form } = this.props;
    const { formDataSource, ...restProxyState } = this.state;

    if (form) {
      restProxyState.form = {
        ...form,
        onChange: this.proxyFormChange,
        dataSource: formDataSource,
        onSearch: this.proxySearch,
        onReset: this.proxyReset,
      };
    }

    return {
      ...this.props,
      ...restProxyState,
      onChange: this.proxyTableChange,
      onEdit: this.proxyEdit,
      onStartEdit: this.proxyStartEdit,
    };
  };

  fetchAsyncDataSource() {
    this.currentFetchCount += 1;
    const { currentFetchCount } = this;

    const { dataSource, onFetchError } = this.props;

    this.setState({
      loading: true,
    });

    const data = dataSource(this.getMergedProps());
    wrapType(data, Promise, delay(200, data))
      .then(result => {
        // use last fetch result
        if (currentFetchCount !== this.currentFetchCount) {
          return;
        }

        const { pagination } = this.state;

        this.setState({
          pagination:
            pagination !== false
              ? {
                  ...pagination,
                  ...result.pagination,
                }
              : false,
          dataSource: result.dataSource,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({ loading: false }, () => onFetchError?.(error));
      });
  }

  render() {
    return (
      <SearchTablePlus
        {...this.getMergedProps()}
        ref={node => {
          this.$baseTable = node;
        }}
      />
    );
  }
}

export default SearchTablePlusProxy;
