import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import {
  trdPortfolioListBySimilarPortfolioName,
  trdTradePortfolioCreateBatch,
  trdTradePortfolioDelete,
} from '@/services/trade-service';
import { message } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import ActionCol from './ActionCol';

class PortfolioModalTable extends PureComponent<{ rowData: any }, any> {
  public state = {
    modalVisible: false,
    value: [],
    dataSource: [],
  };
  public componentDidMount = () => {
    if (!this.props.rowData.portfolioNames) {
      return;
    }
    const portfolioNames = this.props.rowData.portfolioNames;

    this.setState({
      dataSource: portfolioNames.map(item => {
        return {
          uuid: uuidv4(),
          portfolio: item,
        };
      }),
    });
  };

  public showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  public handleCancel = () => {
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        this.props.search();
      }
    );
  };

  public handleOk = () => {
    this.setState({
      modalVisible: false,
    });
  };

  public onRemove = params => {
    const clone = [...this.state.dataSource];
    const index = this.state.dataSource.findIndex(item => item.portfolio === params.data.portfolio);
    clone.splice(index, 1);
    this.setState({
      dataSource: clone,
    });
  };

  public handleCreate = async params => {
    const { error, data } = await trdTradePortfolioCreateBatch({
      tradeId: this.props.rowData.tradeId,
      portfolioNames: params.searchFormData.create,
    });
    if (error) return;
    const datas = params.searchFormData.create.map(item => {
      return {
        uuid: uuidv4(),
        portfolio: item,
      };
    });
    message.success('添加成功');
    this.setState({
      dataSource: [...this.state.dataSource, ...datas],
    });
  };

  public render() {
    const { modalVisible } = this.state;

    const modalProps = {
      width: 800,
      title: '关联投资组合',
      footer: false,
      closable: true,
      onCancel: this.handleCancel,
      visible: modalVisible,
    };

    return (
      <>
        <ModalButton
          size="small"
          key="portfolio"
          type="primary"
          onClick={this.showModal}
          modalProps={modalProps}
          content={
            <>
              <SourceTable
                rowKey="uuid"
                title="已加入的投资组合"
                dataSource={this.state.dataSource}
                columnDefs={[
                  { headerName: '投资组合', field: 'portfolio' },
                  {
                    headerName: '操作',
                    render: params => {
                      return (
                        <ActionCol
                          params={params}
                          rowData={this.props.rowData}
                          onRemove={this.onRemove.bind(this)}
                        />
                      );
                    },
                  },
                ]}
                searchable={true}
                onSearchButtonClick={this.handleCreate}
                searchButtonProps={{ icon: null }}
                searchText={'加入'}
                searchFormControls={[
                  {
                    field: 'create',
                    control: {
                      label: '请选择投资组合',
                    },
                    input: {
                      type: 'select',
                      mode: 'multiple',
                      placeholder: '请输入内容搜索',
                      showSearch: true,
                      allowClear: true,
                      options: async (value: string = '') => {
                        const { data, error } = await trdPortfolioListBySimilarPortfolioName({
                          similarPortfolioName: value,
                        });
                        if (error) return [];
                        return data.map(item => ({
                          label: item,
                          value: item,
                        }));
                      },
                    },
                    decorator: {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    },
                  },
                ]}
              />
            </>
          }
        >
          关联投资组合
        </ModalButton>
      </>
    );
  }
}

export default PortfolioModalTable;
