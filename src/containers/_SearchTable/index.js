import React from 'react';
import { PureStateComponent } from '@/containers/Components';
import { isType, notType, delay } from '@/tools';
import SearchTableBase from '@/containers/_SearchTable/base';
import { SearchTable as types } from '@/containers/_SearchTable/type';

const getValue = obj => Object.keys(obj).map(key => obj[key]);

class SearchTable extends PureStateComponent {
  static propTypes = types;

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }

  cache = {};

  componentDidMount() {
    this.fetch();
  }

  handleGetTableNode = node => {
    this.$table = node;
  };

  getParams = () => {
    const { formData } = this.getProxyState();
    const { filter, sorter } = this.cache;
    const { pagination } = this.props;
    return {
      formData,
      filter,
      sorter,
      pagination,
    };
  };

  fetch = () => {
    const { dataSource } = this.props;
    if (isType(dataSource, 'Function')) {
      this?.$table.fetch(this.getParams());
    }
  };

  handleStandardTableEdit = event => {
    const { props } = this;
    const { onEdit } = props;
    const { dataSource } = event;

    if (isType(props.dataSource, 'Function')) {
      this.setState({
        dataSource,
      });
    }
    onEdit?.(event);
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { props, cache } = this;
    const { onChange } = props;
    const filter = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    onChange?.(pagination, filterArg, sorter);

    this.cache = {
      ...cache,
      filter,
      sorter: sorter.field && { [sorter.field]: sorter.order },
    };

    this.fetch();
  };

  handleFormReset = () => {
    const { onFormReset } = this.props;
    onFormReset?.(this.getParams());
    this.fetch();
  };

  handleSearch = () => {
    const { onSearch } = this.props;
    onSearch?.();
    this.fetch();
  };

  handleCreate = event => {
    const { onCreate } = this.props;
    const params = {
      ...event,
      ...this.getParams(),
    };

    let result = onCreate?.onClick(params);

    if (notType(result, 'Promise')) {
      result = delay(200, result);
    }

    result.then(success => {
      success && this.fetch();
    });
  };

  handleBatchRemove = event => {
    const { onRemove } = this.props;
    const params = {
      ...event,
      ...this.getParams(),
    };

    let result = onRemove?.onClick(params);

    if (notType(result, 'Promise')) {
      result = delay(200, result);
    }

    result.then(success => {
      success && this.fetch();
    });
  };

  handleFormChange = field => {
    const { name, value } = field;
    const { formData, onFormChange } = this.props;

    if (formData === undefined) {
      this.setState({
        formData: {
          ...formData,
          [name]: value,
        },
      });
    }

    onFormChange?.(field);
  };

  handleExtraBtnClick = event => {
    const { createBtn, removeBtn, onBtnClick } = this.props;

    if (createBtn && event.name === createBtn.name) {
      return this.handleCreate(event);
    }

    if (removeBtn && event.name === removeBtn.name) {
      return this.handleBatchRemove(event);
    }

    onBtnClick?.({
      ...event,
      ...this.getParams(),
    });
  };

  getProxyState = () => {
    const { props, state } = this;

    return {
      formData: props.formData === undefined ? state.formData : props.formData,
    };
  };

  render() {
    const { formData } = this.getProxyState();

    return (
      <SearchTableBase
        {...this.props}
        autoFetch={false}
        formData={formData}
        onEdit={this.handleStandardTableEdit}
        onChange={this.handleStandardTableChange}
        onFormReset={this.handleFormReset}
        onSearch={this.handleSearch}
        onCreate={this.handleCreate}
        onRemove={this.handleBatchRemove}
        onFormChange={this.handleFormChange}
        getTableNode={this.handleGetTableNode}
      />
    );
  }
}

export default SearchTable;
