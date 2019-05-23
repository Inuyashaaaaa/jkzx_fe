import { VERTICAL_GUTTER } from '@/constants/global';
import SourceTable from '@/containers/SourceTable';
import { clientAccountOpRecordSearch } from '@/services/reference-data-service';
import { sortByCreateAt } from '@/services/sort';
import React, { PureComponent } from 'react';
import CapitalInputModal from './CapitalInputModal';
import { HISTORY_COL_DEFS, PROCESSED_FORM_CONTROLS } from './constants';

class History extends PureComponent {
  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await clientAccountOpRecordSearch({
      ...this.state.searchFormData,
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: sortByCreateAt(data),
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public render() {
    return (
      <SourceTable
        rowKey="uuid"
        dataSource={this.state.dataSource}
        loading={this.state.loading}
        searchable={true}
        resetable={true}
        onResetButtonClick={this.onReset}
        columnDefs={HISTORY_COL_DEFS}
        searchFormControls={PROCESSED_FORM_CONTROLS('history')}
        searchFormData={this.state.searchFormData}
        onSearchButtonClick={this.fetchTable}
        onSearchFormChange={this.onSearchFormChange}
        autoSizeColumnsToFit={false}
        header={<CapitalInputModal fetchTable={this.fetchTable} />}
      />
    );
  }
}

export default History;
