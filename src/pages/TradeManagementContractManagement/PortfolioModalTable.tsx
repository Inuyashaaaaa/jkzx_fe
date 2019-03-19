import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import {
  trdPortfolioListBySimilarPortfolioName,
  trdTradePortfolioCreateBatch,
  trdTradePortfolioDelete,
} from '@/services/trade-service';
import { Button, Popconfirm, Typography } from 'antd';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';

const { Title } = Typography;

class PortfolioModalTable extends PureComponent<{ rowData: any }, any> {
  public state = {
    modalVisible: false,
    value: [],
    dataSource: [],
  };
  public componentDidMount = () => {
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
    this.setState({
      modalVisible: false,
    });
  };

  public handleOk = () => {
    this.setState({
      modalVisible: false,
    });
  };

  public onRemove = async params => {
    console.log(params);
    const { error, data } = await trdTradePortfolioDelete({
      tradeId: this.props.rowData.tradeId,
      portfolioName: params.data,
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
    };

    return (
      <>
        <ModalButton
          size="small"
          key="portfolio"
          type="primary"
          visible={modalVisible}
          onClick={this.showModal}
          modalProps={modalProps}
          onCancel={this.handleCancel}
          onConfirm={this.handleOk}
          content={
            <>
              <SourceTable
                rowKey="uuid"
                dataSource={this.state.dataSource}
                columnDefs={[{ headerName: '投资组合', field: 'portfolio' }]}
                rowActions={[
                  <Popconfirm title="确认删除?" onConfirm={this.onRemove} key="pop">
                    <Button type="danger" key="del">
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
                searchable={true}
                onSearchButtonClick={this.handleCreate}
                searchButtonProps={{ icon: null }}
                searchText={'新增'}
                searchFormControls={[
                  {
                    field: 'create',
                    control: {
                      label: '新增关联投资组合',
                    },
                    input: {
                      type: 'select',
                      mode: 'multiple',
                      placeholder: '请输入内容搜索',
                      showSearch: true,
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
