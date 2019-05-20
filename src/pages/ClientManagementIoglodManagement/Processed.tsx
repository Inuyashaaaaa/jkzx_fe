import { VERTICAL_GUTTER } from '@/constants/global';
import SourceTable from '@/components/SourceTable';
import { cliTradeTaskSearch } from '@/services/reference-data-service';
import { sortByCreateAt } from '@/services/sort';
import React, { PureComponent } from 'react';
import CapitalInputModal from './CapitalInputModal';
import { PROCESSED_COL_DEFS, PROCESSED_FORM_CONTROLS } from './constants';

class Processed extends PureComponent {
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
    const { error, data } = await cliTradeTaskSearch({ ...this.state.searchFormData });
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
        columnDefs={PROCESSED_COL_DEFS(this.fetchTable)}
        searchFormControls={PROCESSED_FORM_CONTROLS('processed')}
        searchFormData={this.state.searchFormData}
        onSearchButtonClick={this.fetchTable}
        onSearchFormChange={this.onSearchFormChange}
        header={<CapitalInputModal fetchTable={this.fetchTable} />}
      />
    );
  }
}

export default Processed;
