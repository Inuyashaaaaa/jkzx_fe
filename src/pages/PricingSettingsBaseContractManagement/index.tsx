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
import { Col, Row, Modal, notification } from 'antd';
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
    visible: false,
    count: 0,
    formValues: {},
  };

  public getOptions = memo(nodes => {
    const data = JSON.parse(JSON.stringify(nodes)).map(item => {
      item.positionShow = (
        <div>
          PositionId: {item.positionId}
          <br />
          到期日: {item.expiry}
          <br />
          基础合约: {item.baseContractId ? item.baseContractId : '-'}
          <br />
          对冲合约: {item.hedgingContractId ? item.hedgingContractId : '-'}
        </div>
      );
      return item;
    });
    return arr2treeOptions(
      data,
      [INSTRUMENT_KEY, EXPIRY_KEY, POSITION_KEY],
      [INSTRUMENT_KEY, EXPIRY_KEY, POSITION_SHOW_KEY]
    );
  });

  public getSelectedNodes = memo((nodes, selectedPositions, bol) => {
    if (!bol) {
      return nodes.filter(item => {
        return selectedPositions ? selectedPositions.includes(item[POSITION_KEY]) : false;
      });
    }
    let data = JSON.parse(JSON.stringify(nodes));
    selectedPositions.forEach((param, index) => {
      let key = INSTRUMENT_KEY;
      if (index === 1) {
        key = EXPIRY_KEY;
      }
      if (index === 2) {
        key = POSITION_KEY;
      }
      data = data.filter(item => {
        return param.length > 0 ? param.includes(item[key]) : true;
      });
    });
    this.setState({ count: data.length });
    return data;
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

  public onSubmit = async () => {
    const { formValues } = this.state;
    return updateBaseContract({
      baseContracts: this.getSelectedNodes(this.state.nodes, this.state.listValue, true).map(
        item => {
          return {
            ...item,
            ...formValues,
          };
        }
      ),
    }).then(rsp => {
      this.setState({
        visible: false,
      });
      if (!rsp.error) {
        this.fetchNodes(() =>
          this.setState({
            baseContractIdForceEditing: false,
            hedgingContractIdForceEditing: false,
          })
        );
      }
      notification.success({
        message: `保存成功`,
      });

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

  public showModal = formValues => {
    if (this.state.listValue.length === 0) {
      return notification.error({
        message: `请选择一个标的物`,
      });
    }
    this.getSelectedNodes(this.state.nodes, this.state.listValue, true);
    this.setState({
      visible: true,
      formValues,
    });
  };

  public handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  public handleCancel = e => {
    this.setState({
      visible: false,
    });
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
              sort={true}
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
              onSubmit={this.showModal}
            />
          </Col>
        </Row>
        <Modal
          title="修改基础合约"
          visible={this.state.visible}
          onOk={this.onSubmit}
          onCancel={this.handleCancel}
        >
          <p>确定要对选中的{this.state.count}个持仓执行操作吗？</p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default PricingSettingsBaseContractManagement;
