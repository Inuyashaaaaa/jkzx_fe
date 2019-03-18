import CascaderSourceList from '@/lib/components/_CascaderSourceList';
import { PureStateComponent } from '@/lib/components/_Components';
import Form from '@/lib/components/_Form2';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions, delay, isAllSame, mockData } from '@/lib/utils';
import {
  mktInstrumentsListPaged,
  prcBaseContractsList,
  updateBaseContract,
} from '@/services/pricing';
import { Col, Row } from 'antd';
import produce from 'immer';
import memo from 'memoize-one';
import React from 'react';
import {
  EXPIRY_KEY,
  FORM_CONTROLS,
  INSTRUMENT_KEY,
  POSITION_KEY,
  POSITION_SHOW_KEY,
} from './constants';

class PricingSettingsBaseContractManagement extends PureStateComponent {
  public state = {
    nodes: [],
    loading: false,
    formData: {},
    prices: [],
    listValue: [],
    baseContractIdForceEditing: false,
    hedgingContractIdForceEditing: false,
  };

  public getOptions = memo(nodes => {
    return arr2treeOptions(
      nodes,
      [INSTRUMENT_KEY, EXPIRY_KEY, POSITION_KEY],
      [INSTRUMENT_KEY, EXPIRY_KEY, POSITION_SHOW_KEY]
    );
  });

  public getSelectedNodes = memo((nodes, selectedPositions) => {
    return nodes.filter(item => {
      return selectedPositions ? selectedPositions.includes(item[POSITION_KEY]) : false;
    });
  });

  public componentDidMount = () => {
    this.fetchNodes();
    this.fetchOptions();
  };

  public fetchNodes = (callback?) => {
    this.setState({ loading: true }, async () => {
      const { error, data } = await prcBaseContractsList();

      this.setState({
        loading: false,
      });
      if (error) return;

      this.setState(
        {
          nodes: data,
        },
        callback
      );
    });
  };

  public onChange = values => {
    this.setState({ formData: values });
  };

  public onListChange = listValue => {
    const selectedNodes = this.getSelectedNodes(this.state.nodes, listValue[2]);
    this.setState(
      produce((state: any) => {
        state.listValue = listValue;
        if (listValue[2]) {
          state.formData.baseContractId = isAllSame(
            selectedNodes.map(item => {
              return item.baseContractId;
            })
          )
            ? selectedNodes.length
              ? selectedNodes[0].baseContractId
              : undefined
            : undefined;

          state.formData.hedgingContractId = isAllSame(
            selectedNodes.map(item => item.hedgingContractId)
          )
            ? selectedNodes.length
              ? selectedNodes[0].hedgingContractId
              : undefined
            : undefined;
        }

        state.baseContractIdForceEditing = false;
        state.hedgingContractIdForceEditing = false;
      })
    );
  };

  public onSubmit = async values => {
    return updateBaseContract({
      baseContracts: this.getSelectedNodes(this.state.nodes, this.state.listValue[2]).map(item => {
        return {
          ...item,
          ...values,
        };
      }),
    }).then(rsp => {
      if (!rsp.error) {
        this.fetchNodes(() =>
          this.setState({
            baseContractIdForceEditing: false,
            hedgingContractIdForceEditing: false,
          })
        );
      }

      return !rsp.error;
    });
  };

  public fetchOptions = async () => {
    const { error, data } = await mktInstrumentsListPaged();

    if (error) return;

    this.setState({
      prices: data.page,
    });
  };

  public onIconClick = dataIndex => {
    if (dataIndex === 'baseContractId') {
      this.setState({
        baseContractIdForceEditing: true,
      });
    }
    if (dataIndex === 'hedgingContractId') {
      this.setState({
        hedgingContractIdForceEditing: true,
      });
    }
  };

  public onSearch = (value, index) => {
    this.setState(
      produce((state: any) => {
        state.listValue[index] = [];
      })
    );
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <Row gutter={16}>
          <Col xs={24} sm={18}>
            <CascaderSourceList
              value={this.state.listValue}
              onSearch={this.onSearch}
              onChange={this.onListChange}
              createable={false}
              removeable={false}
              loading={this.state.loading}
              options={this.getOptions(this.state.nodes)}
              list={[
                {
                  title: '标的物',
                  rowSelection: 'single',
                  pagination: {
                    simple: true,
                  },
                },
                {
                  title: '到期日',
                  rowSelection: 'multiple',
                  pagination: {
                    simple: true,
                  },
                },
                {
                  title: 'Position',
                  rowSelection: 'multiple',
                  pagination: {
                    simple: true,
                  },
                },
              ]}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Form
              controlNumberOneRow={1}
              dataSource={this.state.formData}
              onChangeValue={this.onChange}
              controls={FORM_CONTROLS(
                this.state.prices,
                this.getSelectedNodes(this.state.nodes, this.state.listValue[2]),
                this.onIconClick,
                this.state.baseContractIdForceEditing,
                this.state.hedgingContractIdForceEditing
              )}
              onSubmit={this.onSubmit}
            />
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default PricingSettingsBaseContractManagement;
