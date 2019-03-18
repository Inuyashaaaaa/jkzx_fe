import React from 'react';
import StationalComponent from '../StationalComponent';
import './index.less';
import SourceBaseList from './SourceListBase';
import { SourceListProps, SourceListState } from './types';

class SourceList extends StationalComponent<SourceListProps, SourceListState> {
  public state = {
    selectedRowKeys: [],
  };

  public getFreeStateKeys = () => {
    return {
      searchedDataSource: true,
    };
  };

  public onSelectRow = params => {
    if (!this.props.onSelectRow) {
      return this.$setState({
        selectedRowKeys: params.selectedRowKeys,
      });
    }

    return this.props.onSelectRow(params);
  };

  public render() {
    return (
      <SourceBaseList
        renderItem={this.defaultRenderItem}
        {...this.props}
        {...this.getUsedState()}
        onSelectRow={this.onSelectRow}
      />
    );
  }

  private defaultRenderItem = data => {
    return data[this.props.rowKey];
  };
}

export default SourceList;
