import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  KNOCK_DIRECTION_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OB_DAY_FIELD,
} from '@/constants/common';
import { Form2 } from '@/containers';
import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import PopconfirmButton from '@/containers/PopconfirmButton';
import SourceTable from '@/containers/SourceTable';
import { IColumnDef } from '@/containers/Table/types';
import { InputBase } from '@/components/type';
import { qlDateScheduleCreate } from '@/services/quant-service';
import { getLegEnvs, getMoment, getRequiredRule, isAsian, isRangeAccruals, remove } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Button, Col, message, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

class ObserveModalInput extends InputBase<{
  direction?: string;
  record: any;
}> {
  public $sourceTable: SourceTable = null;

  public state = {
    visible: false,
    popconfirmVisible: false,
    dealDataSource: [],
    generateLoading: false,
  };

  public legType: string;

  public record: any;

  constructor(props) {
    super(props);
    this.legType = props.record[LEG_TYPE_FIELD];
    this.state.dealDataSource = this.computeDataSource(
      (props.value || []).map((item, index) => {
        return {
          ...item,
          [OB_DAY_FIELD]: moment(item[OB_DAY_FIELD]),
        };
      })
    );
  }

  public computeDataSource = (dataSource = []) => {
    dataSource = dataSource.sort((a, b) => a[OB_DAY_FIELD].valueOf() - b[OB_DAY_FIELD].valueOf());

    if (isAsian(this.props.record)) {
      dataSource = dataSource.map((item, index) => {
        return {
          ...item,
          weight: new BigNumber(1)
            .div(dataSource.length)
            .decimalPlaces(4)
            .toNumber(),
        };
      });
    }

    return dataSource;
  };

  public onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  public onOk = async () => {
    const validateTableRsp: any = await this.$sourceTable.validateTable();

    if (validateTableRsp.error) return;

    this.setState(
      {
        visible: !this.state.visible,
      },
      () => {
        const val = this.state.dealDataSource.map(item => {
          return {
            ...item,
            [OB_DAY_FIELD]: item[OB_DAY_FIELD].format('YYYY-MM-DD'),
          };
        });
        if (this.props.onChange) {
          this.props.onChange(val);
        }
        if (this.props.onValueChange) {
          this.props.onValueChange(val);
        }
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
    if (
      !!this.state.dealDataSource.find(item =>
        getMoment(item[OB_DAY_FIELD]).isSame(dataSource.day, 'd')
      )
    ) {
      return message.warn('不可以出现相同日期');
    }
    this.setState({
      dealDataSource: this.computeDataSource([
        ...this.state.dealDataSource,
        {
          [OB_DAY_FIELD]: dataSource.day,
        },
      ]),
    });
  };

  public bindRemove = params => () => {
    this.setState({
      dealDataSource: this.computeDataSource(
        remove(this.state.dealDataSource, (item, index) => index === params.node.rowIndex)
      ),
    });
  };

  public onPopcomfirmButtonConfirm = () => {
    this.setState(
      {
        popconfirmVisible: false,
      },
      () => {
        this.onGenerate();
      }
    );
  };

  public getAutoGenerateParams = () => {
    const { record } = this.props;
    if (isAsian(record)) {
      const start = getMoment(Form2.getFieldValue(record[LEG_FIELD.OBSERVE_START_DAY])).format(
        'YYYY-MM-DD'
      );
      const end = getMoment(Form2.getFieldValue(record[LEG_FIELD.OBSERVE_END_DAY])).format(
        'YYYY-MM-DD'
      );
      const freq = Form2.getFieldValue(record[LEG_FIELD.OBSERVATION_STEP]);
      return { start, end, freq };
    }

    const start = getMoment(Form2.getFieldValue(record[LEG_FIELD.EFFECTIVE_DATE])).format(
      'YYYY-MM-DD'
    );
    const end = getMoment(Form2.getFieldValue(record[LEG_FIELD.EXPIRATION_DATE])).format(
      'YYYY-MM-DD'
    );
    const freq = Form2.getFieldValue(record[LEG_FIELD.OBSERVATION_STEP]);
    return { start, end, freq };
  };

  public onGenerate = async () => {
    const { start, end, freq } = this.getAutoGenerateParams();
    this.setState({ generateLoading: true });
    const { error, data } = await qlDateScheduleCreate({
      start,
      end,
      freq,
      roll: 'backward',
      adj: 'modified_following',
      holidays: ['DEFAULT_CALENDAR'],
    });
    this.setState({ generateLoading: false });

    if (error) return;
    this.setState({
      dealDataSource: this.computeDataSource(
        data.map(item => {
          return {
            [OB_DAY_FIELD]: moment(item),
          };
        })
      ),
    });
  };

  public onPopconfirmClick = () => {
    if (_.isEmpty(this.state.dealDataSource) === false) {
      return this.setState({
        popconfirmVisible: true,
      });
    }
    this.onGenerate();
  };

  public onHidePopconfirm = () => {
    this.setState({
      popconfirmVisible: false,
    });
  };

  public isAccruals = () => {
    return this.legType === LEG_TYPE_MAP.RANGE_ACCRUALS;
  };

  public isAutoCallSnow = () => {
    return this.legType === LEG_TYPE_MAP.AUTOCALL;
  };

  public isAutoCallPhoenix = () => {
    return this.legType === LEG_TYPE_MAP.AUTOCALL_PHOENIX;
  };

  public isIn = () => {
    return this.props.direction === KNOCK_DIRECTION_MAP.DOWN;
  };

  public isUp = () => {
    return this.props.direction === KNOCK_DIRECTION_MAP.UP;
  };

  public getColumnDefs = (): IColumnDef[] => {
    if (this.isAutoCallSnow() || this.isAutoCallPhoenix()) {
      return [
        {
          headerName: '观察日',
          field: OB_DAY_FIELD,
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
        this.isAutoCallSnow()
          ? {
              headerName: '障碍价格',
              field: 'price',
              input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
            }
          : {
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
      ];
    }

    return [
      {
        headerName: '观察日',
        field: OB_DAY_FIELD,
        input: {
          type: 'date',
          ranger: 'day',
        },
      },
      ...(this.isAccruals()
        ? []
        : [
            {
              headerName: '权重',
              field: 'weight',
              input: INPUT_NUMBER_DIGITAL_CONFIG,
            },
          ]),
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
    ];
  };

  public getAutoGenerateButton = () => {
    return (
      <PopconfirmButton
        type="primary"
        loading={this.state.generateLoading}
        onClick={this.onPopconfirmClick}
        popconfirmProps={{
          title: '生成将覆盖当前表格内容',
          visible: this.state.popconfirmVisible,
          onCancel: this.onHidePopconfirm,
          onConfirm: this.onPopcomfirmButtonConfirm,
        }}
      >
        批量生成观察日
      </PopconfirmButton>
    );
  };

  public renderEditing() {
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
            title: '观察日编辑',
            onOk: this.onOk,
            onCancel: this.onCancel,
            destroyOnClose: true,
            width: 700,
            visible: this.state.visible,
          }}
          onClick={this.onOpen}
          style={{ width: '100%', display: 'block' }}
          content={
            <SourceTable
              dataSource={this.state.dealDataSource}
              pagination={false}
              rowKey={OB_DAY_FIELD}
              ref={node => {
                this.$sourceTable = node;
              }}
              header={
                <Row style={{ marginBottom: 10 }} type="flex" justify="space-between">
                  <Col>
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
                      resetable={false}
                    />
                  </Col>
                  <Col>{this.getAutoGenerateButton()}</Col>
                </Row>
              }
              columnDefs={this.getColumnDefs()}
            />
          }
        >
          观察日管理
        </ModalButton>
      </Row>
    );
  }

  public renderRendering() {
    const { value } = this.props;
    if (this.isAutoCallPhoenix() && this.isAutoCallSnow()) {
      return value && value.length ? [value[0], value[value.length - 1]].join(' ~ ') : '';
    }

    return value && value.length
      ? [value[0][OB_DAY_FIELD], value[value.length - 1][OB_DAY_FIELD]].join(' ~ ')
      : '';
  }
}

export const ObservationDates: ILegColDef = {
  title: '观察日',
  dataIndex: LEG_FIELD.OBSERVATION_DATES,
  editable: record => {
    const { isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<ObserveModalInput editing={editing} record={record} />)}
      </FormItem>
    );
  },
};
