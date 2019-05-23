import React, { PureComponent } from 'react';
import StandardTableBase from '@/containers/_StandardTable/base';
import { isType, notType, delay, assert } from '@/tools';
import { message } from 'antd';
import { StandardTable as types } from '@/containers/_StandardTable/types';

class StandardTable extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    autoFetch: true,
  };

  state = {
    loading: false,
    dataSource: [],
    selectedRowKeys: [],
    selectedColumnKeys: [],
  };

  componentDidMount = () => {
    const { getTableNode, autoFetch } = this.props;
    getTableNode?.(this);
    autoFetch && this.fetch();
  };

  fetch = params => {
    const { dataSource: propDataSource } = this.props;
    if (notType(propDataSource, 'Function')) return;

    this.setState({
      loading: true,
    });

    let result = propDataSource({
      ...params,
      ...this.getProxyState(),
    });

    if (notType(result, 'Promise')) {
      result = delay(200, result);
    }

    result
      .then(dataSource => {
        assert(
          isType(dataSource, 'Array'),
          `StandardTable: type of dataSource return, expected Array but accept ${dataSource}.`
        );
        this.setState({
          dataSource,
          loading: false,
        });
      })
      .catch(errorInfo => {
        message.error(errorInfo);
        this.setState({
          loading: false,
        });
      });
  };

  getProxyState = () => {
    const { state, props } = this;

    const selectedRowKeysMap = new Map([[undefined, state.selectedRowKeys], [false, undefined]]);
    const selectedColumnKeysMap = new Map([
      [undefined, state.selectedColumnKeys],
      [false, undefined],
    ]);

    return {
      selectedRowKeys: props.selectedRowKeys || selectedRowKeysMap.get(props.selectedRowKeys),
      selectedColumnKeys:
        props.selectedColumnKeys || selectedColumnKeysMap.get(props.selectedColumnKeys),
      dataSource: isType(props.dataSource, 'Function') ? state.dataSource : props.dataSource,
      loading: props.loading === undefined ? state.loading : props.loading,
    };
  };

  handleSelect = params => {
    const { props } = this;
    const { onSelect } = props;

    const nextState = {};
    if (props.selectedColumnKeys === undefined) {
      nextState.selectedColumnKeys = params.selectedColumnKeys;
    }
    if (props.selectedRowKeys === undefined) {
      nextState.selectedRowKeys = params.selectedRowKeys;
    }
    if (Object.keys(nextState).length) {
      this.setState(nextState);
    }

    onSelect?.(params);
  };

  handleEdit = event => {
    const { dataSource: nextDataSource } = event;
    const { dataSource, onEdit } = this.props;
    if (isType(dataSource, 'Function')) {
      this.setState({ dataSource: nextDataSource });
    }
    onEdit?.(event);
  };

  handleBtnClick = event => {
    const { onBtnClick, dataSource } = this.props;

    if (isType(dataSource, 'Function')) {
      const { dataSource: stateDataSource } = this.state;
      return onBtnClick?.({
        ...event,
        dataSource: stateDataSource,
      });
    }

    return onBtnClick?.(event);
  };

  render() {
    const { selectedRowKeys, selectedColumnKeys, dataSource, loading } = this.getProxyState();
    const { edit } = this.props;

    return (
      <StandardTableBase
        {...this.props}
        loading={loading}
        dataSource={dataSource}
        selectedRowKeys={selectedRowKeys}
        selectedColumnKeys={selectedColumnKeys}
        onSelect={this.handleSelect}
        onEdit={edit && this.handleEdit}
        onBtnClick={this.handleBtnClick}
      />
    );
  }
}

export default StandardTable;
