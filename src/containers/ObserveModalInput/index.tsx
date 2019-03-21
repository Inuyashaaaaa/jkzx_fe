import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  LEG_FIELD,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import Form from '@/design/components/Form';
import { InputPolym } from '@/design/components/Form/Input/InputPolym';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import { remove } from '@/design/utils';
import { Button, message, Row } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import React from 'react';

class ObserveModalInput extends InputPolym<any> {
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
          payDay: moment(item),
        };
      })
    );
  }

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
          price: new BigNumber(barrierVal)
            .plus(
              new BigNumber(index + 1)
                .multipliedBy(new BigNumber(step).div(100))
                .multipliedBy(initialSpot)
            )
            .decimalPlaces(4)
            .toNumber(),
          id: index,
        };
      });
  };

  public formatValue = (value): string => {
    return value ? [value[0], value[value.length - 1]].join(' ~ ') : '';
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
        this._onChange(this.state.dealDataSource.map(item => item.obDay.format('YYYY-MM-DD')));
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
          payDay: dataSource.day,
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
          }}
          onClick={this.onOpen}
          visible={this.state.visible}
          style={{ width: '100%', display: 'block' }}
          content={
            <SourceTable
              dataSource={this.state.dealDataSource}
              pagination={false}
              rowKey="id"
              header={
                <Row style={{ marginBottom: 10 }}>
                  <Form
                    onSubmitButtonClick={this.onSubmitButtonClick}
                    layout="inline"
                    resetable={false}
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
                  headerName: '支付日',
                  field: 'payDay',
                  input: {
                    type: 'date',
                    ranger: 'day',
                  },
                },
                {
                  headerName: '障碍价格',
                  field: 'price',
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

export default ObserveModalInput;
