import CascaderSourceList from '@/lib/components/_CascaderSourceList';
import { PureStateComponent } from '@/lib/components/_Components';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions } from '@/lib/utils';
import {
  createCompany,
  createSaler,
  queryCompleteCompanys,
  removeCompany,
  removeSalers,
} from '@/services/sales';
import { Col, message, Row } from 'antd';
import produce from 'immer';
import memo from 'memoize-one';
import React from 'react';
import { BRANCH_KEY, COMPANY_KEY, SALES_KEY, SALES_SHOW_KEY } from './constants';

class CustomSalesManage extends PureStateComponent {
  public state = {
    loading: false,
    nodes: [],
    value: [],
    options: [],
  };

  public getOptions = memo(nodes => {
    return arr2treeOptions(
      nodes,
      ['subsidiary', 'branch', 'salesName'],
      ['subsidiary', 'branch', 'salesName']
    );
  });

  public componentDidMount = () => {
    this.fetchNodes();
  };

  public fetchNodes = () => {
    this.setState({ loading: true }, async () => {
      const { error, data } = await queryCompleteCompanys();
      this.setState({
        loading: false,
      });
      if (error) return;
      this.setState({
        nodes: data,
      });
    });
  };

  public onCreateCompany = value => {
    const params = {
      ...value,
      branchName: value.branchName || value.subsidiaryName,
    };

    return createCompany(params).then(result => {
      if (result.error) {
        message.error('创建失败');
        return false;
      }
      message.success('创建成功');
      this.pushNode(result.data);

      return true;
    });
  };

  public onRemoveCompany = (rowData, index) => {
    const { data } = rowData;
    return removeCompany({
      subsidiaryName: data[COMPANY_KEY],
      branchName: data[BRANCH_KEY],
    }).then(result => {
      if (result.error) {
        message.error('删除失败');
        return false;
      }

      message.success('删除成功');
      this.removeNode(data, 'companyUuid');

      if (this.state.value[0] && this.state.value[0].includes(data[COMPANY_KEY])) {
        this.setState({
          value: [],
        });
      }

      return true;
    });
  };

  public onCreateBranch = (formData, values) => {
    const params = {
      ...formData,
      subsidiaryName: values[0][0],
    };

    return createCompany(params).then(rp => {
      if (rp.error) {
        message.error('创建失败');
        return false;
      }

      message.success('创建成功');
      this.pushNode(rp.data);

      return true;
    });
  };

  public onRemoveBranch = (rowData, index) => {
    const { data } = rowData;
    return removeCompany({
      subsidiaryName: data[COMPANY_KEY],
      branchName: data[BRANCH_KEY],
    }).then(result => {
      if (result.error) {
        message.error('删除失败');
        return false;
      }

      message.success('删除成功');
      this.removeNode(data, 'companyUuid');

      if (this.state.value[1] && this.state.value[1].includes(data[BRANCH_KEY])) {
        this.setState(
          produce((state: any) => {
            state.value[1].splice(index, 1);
          })
        );
      }

      return true;
    });
  };

  public onCreateSaler = (formData, value) => {
    const params = {
      ...formData,
      subsidiaryName: value[0][0],
      branchName: value[1][0],
    };

    return createSaler(params).then(rp => {
      if (rp.error) {
        message.error('创建失败');
        return false;
      }
      message.success('创建成功');
      this.pushNode(rp.data);

      return true;
    });
  };

  public onRemoveSaler = (rowData, index) => {
    const { data } = rowData;

    return removeSalers({
      subsidiaryName: data[COMPANY_KEY],
      branchName: data[BRANCH_KEY],
      salesNames: [data[SALES_SHOW_KEY]],
    }).then(rp => {
      if (rp.error) {
        message.error('删除失败');
        return false;
      }

      message.success('删除成功');
      this.removeNode(data, SALES_KEY);

      if (this.state.value[2] && this.state.value[2].includes(data[SALES_KEY])) {
        this.setState(
          produce((state: any) => {
            state.value[2].splice(index, 1);
          })
        );
      }

      return true;
    });
  };

  public pushNode = node => {
    this.setState(
      produce((state: any) => {
        state.nodes.push(node);
      })
    );
  };

  public removeNode = (node, key) => {
    this.setState(
      produce((state: any) => {
        state.nodes.splice(state.nodes.findIndex(item => item[key] === node[key]), 1);
      })
    );
  };

  public onChange = value => {
    this.setState({ value });
  };

  public render() {
    return (
      <PageHeaderWrapper back={true}>
        <Row gutter={16}>
          <Col span={24}>
            <CascaderSourceList
              value={this.state.value}
              loading={this.state.loading}
              options={this.getOptions(this.state.nodes)}
              onChange={this.onChange}
              list={[
                {
                  onCreate: this.onCreateCompany,
                  onRemove: this.onRemoveCompany,
                  title: '分公司',
                  rowSelection: 'single',
                  createFormControls: values => [
                    {
                      control: {
                        label: '分公司名',
                      },
                      input: {
                        type: 'input',
                      },
                      dataIndex: 'subsidiaryName',
                      options: {
                        rules: [
                          {
                            required: true,
                            message: '分公司名必须填写',
                          },
                        ],
                      },
                    },
                    {
                      control: {
                        label: '营业部名',
                        extra: '如果不填，将默认创建一个和分公司名相同的营业部',
                      },
                      input: {
                        type: 'input',
                      },
                      dataIndex: 'branchName',
                    },
                  ],
                },
                {
                  onCreate: this.onCreateBranch,
                  onRemove: this.onRemoveBranch,
                  title: '营业部',
                  rowSelection: 'multiple',
                  createFormControls: value => [
                    {
                      control: {
                        label: '分公司名',
                        required: true,
                      },
                      input: {
                        type: 'input',
                        placeholder: value[0] ? value[0][0] : '',
                        disabled: true,
                      },
                      dataIndex: 'subsidiaryName',
                    },
                    {
                      control: {
                        label: '营业部名',
                      },
                      input: {
                        type: 'input',
                      },
                      dataIndex: 'branchName',
                      options: {
                        rules: [
                          {
                            required: true,
                            message: '营业部名必须填写',
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  title: '销售',
                  rowSelection: 'multiple',
                  onCreate: this.onCreateSaler,
                  onRemove: this.onRemoveSaler,
                  createFormControls: value => [
                    {
                      control: {
                        label: '分公司名',
                        required: true,
                      },
                      input: {
                        type: 'input',
                        placeholder: value[0] ? value[0][0] : '',
                        disabled: true,
                      },
                      dataIndex: 'subsidiaryName',
                    },
                    {
                      control: {
                        label: '营业部名',
                        required: true,
                      },
                      input: {
                        type: 'input',
                        placeholder: value[1] ? value[1][0] : '',
                        disabled: true,
                      },
                      dataIndex: 'branchName',
                    },
                    {
                      control: {
                        label: '销售名',
                      },
                      input: {
                        type: 'input',
                      },
                      dataIndex: 'salesName',
                      options: {
                        rules: [
                          {
                            required: true,
                            message: '销售名必须填写',
                          },
                        ],
                      },
                    },
                  ],
                },
              ]}
            />
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default CustomSalesManage;
