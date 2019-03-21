import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  LEG_FIELD,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import Form from '@/design/components/Form';
import { InputPolym } from '@/design/components/Form/Input/InputPolym';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import { remove } from '@/design/utils';
import { qlDateScheduleCreate } from '@/services/quant-service';
import { Button, message, Row } from 'antd';
import BigNumber from 'bignumber.js';
import moment, { isMoment } from 'moment';
import React from 'react';

class AsiaObserveModalInput extends InputPolym<any> {
  public state = {
    visible: false,
    dealDataSource: [],
  };

  constructor(props) {
    super(props);
    this.state.dealDataSource = this.computeDataSource(
      (props.value || []).map((item, index) => {
        return {
          obDay: moment(item),
        };
      })
    );
  }

  public componentDidMount = () => {
    // if (!this.props.record[LEG_FIELD.OBSERVATION_DATES]) {
    //   this.inital();
    // }
  };

  public inital = async () => {
    const { record } = this.props;
    const start = isMoment(record[LEG_FIELD.OBSERVE_START_DAY])
      ? record[LEG_FIELD.OBSERVE_START_DAY].format('YYYY-MM-DD')
      : record[LEG_FIELD.OBSERVE_START_DAY];
    const end = isMoment(record[LEG_FIELD.OBSERVE_END_DAY])
      ? record[LEG_FIELD.OBSERVE_END_DAY].format('YYYY-MM-DD')
      : record[LEG_FIELD.OBSERVE_END_DAY];
    const freq = record[LEG_FIELD.OBSERVATION_STEP];

    const { error, data } = await qlDateScheduleCreate({
      start,
      end,
      freq,
      roll: 'backward',
      adj: 'modified_following',
      holidays: ['DEFAULT_CALENDAR'],
    });

    if (error) return;
  };

  public computeDataSource = dataSource => {
    const { record } = this.props;
    const upBarrier = record[LEG_FIELD.UP_BARRIER];
    const upBarrierType = record[LEG_FIELD.UP_BARRIER_TYPE];
    const step = record[LEG_FIELD.STEP];
    const initialSpot = record[LEG_FIELD.INITIAL_SPOT];

    const barrierVal =
      upBarrierType === UP_BARRIER_TYPE_MAP.PERCENT
        ? new BigNumber(initialSpot).multipliedBy(new BigNumber(upBarrier).div(100)).toNumber()
        : upBarrier;

    return dataSource
      .sort((a, b) => a.obDay.valueOf() - b.obDay.valueOf())
      .map((item, index) => {
        return {
          ...item,
          weight: new BigNumber(1)
            .div(index + 1)
            .decimalPlaces(4)
            .toNumber(),
          id: index,
        };
      });
  };

  public formatValue = (value): string => {
    return value && value.length ? [value[0].day, value[value.length - 1].day].join(' ~ ') : '';
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public parseValue = value => {
    return value;
  };

  public onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  public onOk = () => {
    this.setState(
      {
        visible: !this.state.visible,
      },
      () => {
        this._onChange(
          this.state.dealDataSource.map(item => {
            return {
              ...item,
              day: item.obDay.format('YYYY-MM-DD'),
            };
          })
        );
      }
    );
  };

  public onCancel = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public onSubmitButtonClick = params => {
    const { dataSource } = params;
    if (this.state.dealDataSource.find(item => item.obDay.isSame(dataSource.day))) {
      return message.warn('不可以出现相同日期');
    }
    this.setState({
      dealDataSource: this.computeDataSource([
        ...this.state.dealDataSource,
        {
          obDay: dataSource.day,
        },
      ]),
    });
  };

  public bindRemove = params => () => {
    this.setState({
      dealDataSource: remove(
        this.state.dealDataSource,
        (item, index) => index === params.node.rowIndex
      ),
    });
  };

  public onGenerate = () => {};

  public renderEditing(props) {
    return (
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style={{
          width: '100%',
        }}
      >
        <ModalButton
          type="primary"
          modalProps={{
            onOk: this.onOk,
            onCancel: this.onCancel,
            destroyOnClose: true,
            width: 700,
          }}
          onClick={this.onOpen}
          visible={this.state.visible}
          style={{ width: '100%', display: 'block' }}
          content={
            <SourceTable
              // footer={
              //   <Row type="flex" justify="start" align="middle" style={{ marginTop: 10 }}>
              //     <Icon type="reload" />
              //     <a href="javascript:;" style={{ paddingLeft: 5 }} onClick={this.onGenerate}>
              //       重新生成观察日
              //     </a>
              //   </Row>
              // }
              dataSource={this.state.dealDataSource}
              pagination={false}
              rowKey="id"
              header={
                <Row style={{ marginBottom: 10 }}>
                  <Form
                    onSubmitButtonClick={this.onSubmitButtonClick}
                    layout="inline"
                    controls={[
                      {
                        field: 'day',
                        control: {
                          label: '观察日',
                        },
                        input: {
                          type: 'date',
                          range: 'day',
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
                    submitText={'添加'}
                    resetText={'批量生成观察日'}
                    resetable={false}
                    onResetButtonClick={this.onGenerate}
                  />
                </Row>
              }
              columnDefs={[
                {
                  headerName: '观察日',
                  field: 'obDay',
                  input: {
                    type: 'date',
                    ranger: 'day',
                  },
                },
                {
                  headerName: '权重',
                  field: 'weight',
                  input: INPUT_NUMBER_DIGITAL_CONFIG,
                },
                {
                  headerName: '已观察到价格(可编辑)',
                  field: 'price',
                  editable: true,
                  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                },
                {
                  headerName: '操作',
                  render: params => {
                    return (
                      <Row
                        type="flex"
                        align="middle"
                        style={{
                          height: params.context.rowHeight,
                        }}
                      >
                        <Button size="small" type="danger" onClick={this.bindRemove(params)}>
                          删除
                        </Button>
                      </Row>
                    );
                  },
                },
              ]}
            />
          }
        >
          观察日管理
        </ModalButton>
      </Row>
    );
  }
}

export default AsiaObserveModalInput;
