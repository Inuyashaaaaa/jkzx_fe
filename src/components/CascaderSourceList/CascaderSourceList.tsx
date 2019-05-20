import produce from 'immer';
import _ from 'lodash';
import React from 'react';
import { insert } from '../../utils';
import StationalComponent from '../StationalComponent';
import CascaderSourceListBase from './CascaderSourceListBase';
import { CascaderSourceListProps, CascaderSourceListState } from './types';

class CascaderSourceList extends StationalComponent<
  CascaderSourceListProps,
  CascaderSourceListState
> {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      filterList: [],
    };
  }

  public getFreeStateKeys = () => {
    return {
      filterList: true,
    };
  };

  public getValue = () => {
    return undefined;
  };

  public bindSelectRow = (index, onSelectRow) => selectedRowKeys => {
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, index);
    }

    this.onChange(this.getNextSelectedRowKeys(this.getValue(), index, selectedRowKeys));

    this.setState(
      produce((state: any) => {
        _.range(index + 1, this.props.list.length).forEach(index => {
          if (!_.isEmpty(state.filterList[index])) {
            state.filterList[index] = undefined;
          }
        });
      })
    );
  };

  public onChange = nextValue => {
    if ('onChange' in this.props) {
      this.props.onChange(nextValue);
    }

    this.setState({
      value: nextValue,
    });
  };

  public getNextSelectedRowKeys = (value, index, selectedRowKeys) => {
    value = value.slice(0, index + 1);
    value[index] = selectedRowKeys;
    return value;
  };

  public getCreateFormControls = createFormControls => {
    return typeof createFormControls === 'function'
      ? createFormControls(this.getValue())
      : createFormControls;
  };

  public defaultRenderItem = data => {
    return data.label;
  };

  public onFilter = params => {
    if (!this.props.onFilter) {
      const { value, index } = params;
      const list = this.getUsedStateField('list');
      const dataSourceItem = list[index];
      const reg = new RegExp(value);
      const dataSource = dataSourceItem.filter(item => reg.test(item.label));
      this.$setState(
        {
          filterList: insert(this.state.filterList, index, 1, dataSource),
        },
        () => {
          this.onChange(this.getNextSelectedRowKeys(this.getControlStateField('value'), index, []));
        }
      );
    }

    if (this.props.onFilter) {
      const dataSource = this.props.onFilter(value, index);
      if (Array.isArray(dataSource)) {
        return this.setState(
          produce(
            (state: any) => {
              state.filterList[index] = dataSource;
            },
            () => {
              this.onChange(this.getNextSelectedRowKeys(this.getValue(), index, []));
            }
          )
        );
      }
    }
  };

  public render() {
    return (
      <CascaderSourceListBase
        {...this.props}
        {...this.getControlState()}
        onFilter={this.onFilter}
      />
    );
  }
}

export default CascaderSourceList;
