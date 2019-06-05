import {
  trdPortfolioListBySimilarPortfolioName,
  trdTradePortfolioCreateBatch,
} from '@/services/trade-service';
import { Divider, message, Modal } from 'antd';
import SmartTable from '@/containers/SmartTable';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import ActionCol from './ActionCol';
import { Form2, Select } from '@/containers';

class PortfolioModalTable extends PureComponent<
  { rowData: any; portfolioModalVisible: boolean; handlePortfolioVisible: any },
  any
> {
  public state = {
    modalVisible: false,
    value: [],
    dataSource: [],
    options: [],
    portfolioNames: [],
  };

  private form: Form2 = null;

  public componentDidMount = () => {
    if (!this.props.rowData.portfolioNames) {
      return;
    }
    const portfolioNames = this.props.rowData.portfolioNames;
    this.setOptions();
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
    this.props.handlePortfolioVisible();
  };

  public onRemove = params => {
    const clone = [...this.state.dataSource];
    const index = this.state.dataSource.findIndex(item => item.portfolio === params.portfolio);
    clone.splice(index, 1);
    this.setState({
      dataSource: clone,
    });
  };

  public handleCreate = async () => {
    const rsp = await this.form.validate();
    if (rsp.error) return;
    const { error, data } = await trdTradePortfolioCreateBatch({
      tradeId: this.props.rowData.tradeId,
      portfolioNames: this.state.portfolioNames,
    });
    if (error) return;
    const datas = this.state.portfolioNames.map(item => {
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

  public onSearchFormChange = (props, fields, allFields) => {
    this.setState({ portfolioNames: allFields.portfolioNames.value });
  };

  public setOptions = async (value?) => {
    const options = await this.getOptions(value);
    this.setState({ options });
  };

  public getOptions = async (value: string = '') => {
    const { data, error } = await trdPortfolioListBySimilarPortfolioName({
      similarPortfolioName: value,
    });
    if (error) {
      return [];
    }
    return data.map(item => ({
      label: item,
      value: item,
    }));
  };

  public render() {
    return (
      <>
        <Modal
          width={800}
          title="关联投资组合"
          footer={false}
          closable={true}
          onCancel={this.handleCancel}
          visible={this.props.portfolioModalVisible}
        >
          <>
            <Form2
              ref={node => (this.form = node)}
              layout="inline"
              resetable={false}
              submitText="加入"
              onSubmit={this.handleCreate}
              onFieldsChange={this.onSearchFormChange}
              columns={[
                {
                  title: '请选择投资组合',
                  dataIndex: 'portfolioNames',
                  render: (value, record, index, { form, editing }) => {
                    return (
                      <FormItem>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: true,
                              message: '投资组合为必填项',
                            },
                          ],
                        })(
                          <Select
                            style={{ minWidth: 180 }}
                            mode="multiple"
                            placeholder="请输入内容搜索"
                            showSearch={true}
                            allowClear={true}
                            onSearch={this.setOptions}
                            options={this.state.options}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
            <Divider />
            <SmartTable
              title={() => '已加入的投资组合'}
              rowKey="uuid"
              bordered={true}
              dataSource={this.state.dataSource}
              size="small"
              columns={[
                {
                  title: '投资组合',
                  dataIndex: 'portfolio',
                },
                {
                  title: '操作',
                  render: (value, record, index) => {
                    return (
                      <ActionCol
                        params={record}
                        rowData={this.props.rowData}
                        onRemove={this.onRemove}
                      />
                    );
                  },
                },
              ]}
            />
          </>
        </Modal>
      </>
    );
  }
}

export default PortfolioModalTable;
