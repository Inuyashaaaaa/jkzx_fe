import { Divider, message, Modal } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import SmartTable from '@/containers/SmartTable';
import {
  trdPortfolioListBySimilarPortfolioName,
  trdTradePortfolioCreateBatch,
} from '@/services/trade-service';
import ActionCol from './ActionCol';
import { Form2, Select } from '@/containers';

class PortfolioModalTable extends PureComponent<
  { rowData: any; portfolioModalVisible: boolean; handlePortfolioVisible: any },
  any
> {
  public state = {
    dataSource: [],
    options: [],
    portfolioNames: [],
    formData: {},
  };

  private form: Form2 = null;

  public componentDidMount = () => {
    if (!this.props.rowData.portfolioNames) {
      return;
    }
    const { portfolioNames } = this.props.rowData;
    this.setOptions();
    this.setState({
      dataSource: portfolioNames.map(item => ({
        uuid: uuidv4(),
        portfolio: item,
      })),
    });
  };

  public handleCancel = () => {
    this.props.handlePortfolioVisible();
  };

  public onRemove = params => {
    const { dataSource } = this.state;
    const clone = [...dataSource];
    const index = dataSource.findIndex(item => item.portfolio === params.portfolio);
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
      // portfolioNames: this.state.portfolioNames,
      portfolioNames: Form2.getFieldsValue(this.state.formData).portfolioNames,
    });
    if (error) return;
    const datas = this.state.portfolioNames.map(item => ({
      uuid: uuidv4(),
      portfolio: item,
    }));
    message.success('添加成功');
    const { dataSource } = this.state;
    this.setState(
      {
        dataSource: [...dataSource, ...datas],
        formData: {},
      },
      () => {
        this.setOptions();
      },
    );
  };

  public onSearchFormChange = (props, fields, allFields) => {
    const { formData } = this.state;
    this.setState({
      portfolioNames: allFields.portfolioNames.value,
      formData: { ...formData, ...fields },
    });
  };

  public setOptions = async value => {
    let options = await this.getOptions(value);
    options = options.filter(
      item => !_.includes(this.state.dataSource.map(i => i.portfolio), item.value),
    );
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
          closable
          onCancel={this.handleCancel}
          visible={this.props.portfolioModalVisible}
        >
          <>
            <Form2
              ref={node => {
                this.form = node;
              }}
              layout="inline"
              resetable={false}
              submitText="加入"
              onSubmit={this.handleCreate}
              dataSource={this.state.formData}
              onFieldsChange={this.onSearchFormChange}
              columns={[
                {
                  title: '请选择投资组合',
                  dataIndex: 'portfolioNames',
                  render: (value, record, index, { form, editing }) => (
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
                          showSearch
                          allowClear
                          onSearch={this.setOptions}
                          options={this.state.options}
                        />,
                      )}
                    </FormItem>
                  ),
                },
              ]}
            />
            <Divider />
            <SmartTable
              title={() => '已加入的投资组合'}
              rowKey="uuid"
              bordered
              dataSource={this.state.dataSource}
              size="small"
              columns={[
                {
                  title: '投资组合',
                  dataIndex: 'portfolio',
                },
                {
                  title: '操作',
                  render: (value, record, index) => (
                    <ActionCol
                      params={record}
                      rowData={this.props.rowData}
                      onRemove={this.onRemove}
                    />
                  ),
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
