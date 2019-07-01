import { Button, Col, message, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { InputBase, ITableColDef } from '@/components/type';
import {
  KNOCK_DIRECTION_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OB_DAY_FIELD,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import { Form2, SmartTable } from '@/containers';
import Form from '@/containers/Form';
import ModalButton from '@/containers/ModalButton';
import PopconfirmButton from '@/containers/PopconfirmButton';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { qlDateScheduleCreate } from '@/services/quant-service';
import { getLegEnvs, getMoment, getRequiredRule, remove } from '@/tools';
import { ILegColDef } from '@/types/leg';

class ObserveModalInput extends InputBase<{
  direction?: string;
  record: any;
}> {
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
      (props.value || []).map((item, index) => ({
        ...item,
        [OB_DAY_FIELD]: moment(item[OB_DAY_FIELD]),
        price: Form2.createField(item.price),
      })),
    );
  }

  public computeDataSource = (dataSource = []) => {
    let nextDataSource = dataSource.sort(
      (a, b) => a[OB_DAY_FIELD].valueOf() - b[OB_DAY_FIELD].valueOf(),
    );

    const { record } = this.props;
    const upBarrier = Form2.getFieldValue(record[LEG_FIELD.UP_BARRIER]);
    const upBarrierType = Form2.getFieldValue(record[LEG_FIELD.UP_BARRIER_TYPE]);
    const step = Form2.getFieldValue(record[LEG_FIELD.STEP]);
    const initialSpot = Form2.getFieldValue(record[LEG_FIELD.INITIAL_SPOT]);
    const barrierVal =
      upBarrierType === UP_BARRIER_TYPE_MAP.PERCENT
        ? new BigNumber(initialSpot).multipliedBy(new BigNumber(upBarrier).div(100)).toNumber()
        : upBarrier;
    nextDataSource = nextDataSource.map((item, index) => ({
      ...item,
      payDay: item[OB_DAY_FIELD],
      ...(this.isAutoCallSnow()
        ? {
            price: Form2.createField(
              _.isNaN(barrierVal)
                ? 0
                : new BigNumber(barrierVal)
                    .plus(new BigNumber(index).multipliedBy(new BigNumber(step).div(100)))
                    .decimalPlaces(4)
                    .toNumber(),
            ),
          }
        : null),
    }));

    return nextDataSource;
  };

  public onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  public onOk = async () => {
    this.setState(
      state => ({
        visible: !state.visible,
      }),
      () => {
        const val = this.state.dealDataSource.map(item =>
          Form2.getFieldsValue({
            ...item,
            [OB_DAY_FIELD]: item[OB_DAY_FIELD].format('YYYY-MM-DD'),
          }),
        );
        if (this.props.onChange) {
          this.props.onChange(val);
        }
        if (this.props.onValueChange) {
          this.props.onValueChange(val);
        }
      },
    );
  };

  public onCancel = () => {
    this.setState(state => ({
      visible: !state.visible,
    }));
  };

  public onSubmitButtonClick = params => {
    const { dataSource } = params;
    if (
      this.state.dealDataSource.find(item =>
        getMoment(item[OB_DAY_FIELD]).isSame(dataSource.day, 'd'),
      )
    ) {
      message.warn('不可以出现相同日期');
      return;
    }
    this.setState(state => ({
      dealDataSource: this.computeDataSource([
        ...state.dealDataSource,
        {
          [OB_DAY_FIELD]: dataSource.day,
        },
      ]),
    }));
  };

  public bindRemove = rowIndex => () => {
    this.setState(state => ({
      dealDataSource: this.computeDataSource(
        remove(state.dealDataSource, (item, index) => index === rowIndex),
      ),
    }));
  };

  public onPopcomfirmButtonConfirm = () => {
    this.setState(
      {
        popconfirmVisible: false,
      },
      () => {
        this.onGenerate();
      },
    );
  };

  public getAutoGenerateParams = () => {
    const { record } = this.props;

    const start = getMoment(Form2.getFieldValue(record[LEG_FIELD.EFFECTIVE_DATE]))
      .clone()
      .add(1, 'days')
      .format('YYYY-MM-DD');
    const end = getMoment(Form2.getFieldValue(record[LEG_FIELD.EXPIRATION_DATE])).format(
      'YYYY-MM-DD',
    );
    const freq = Form2.getFieldValue(record[LEG_FIELD.UP_OBSERVATION_STEP]);
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
        data.map(item => ({
          [OB_DAY_FIELD]: moment(item),
        })),
      ),
    });
  };

  public onPopconfirmClick = () => {
    if (_.isEmpty(this.state.dealDataSource) === false) {
      this.setState({
        popconfirmVisible: true,
      });
      return;
    }
    this.onGenerate();
  };

  public onHidePopconfirm = () => {
    this.setState({
      popconfirmVisible: false,
    });
  };

  public isAccruals = () => this.legType === LEG_TYPE_MAP.RANGE_ACCRUALS;

  public isAutoCallSnow = () => this.legType === LEG_TYPE_MAP.AUTOCALL;

  public isAutoCallPhoenix = () => this.legType === LEG_TYPE_MAP.AUTOCALL_PHOENIX;

  public isIn = () => this.props.direction === KNOCK_DIRECTION_MAP.DOWN;

  public isUp = () => this.props.direction === KNOCK_DIRECTION_MAP.UP;

  public getColumnDefs = (): ITableColDef[] => {
    const { editing: editable } = this.props;
    return [
      {
        title: '观察日',
        dataIndex: OB_DAY_FIELD,
        render: (text, record, index) => record[OB_DAY_FIELD].format('YYYY-MM-DD'),
      },
      {
        title: '支付日',
        dataIndex: 'payDay',
        render: (text, record, index) => record.payDay.format('YYYY-MM-DD'),
      },
      this.isAutoCallSnow()
        ? {
            title: '障碍价格',
            dataIndex: 'price',
            defaultEditing: false,
            editable: record => false,
            render: (val, record, index, { form, editing }) => (
              <FormItem>
                {form.getFieldDecorator({})(<UnitInputNumber editing={false} unit="¥" />)}
              </FormItem>
            ),
          }
        : {
            title: '已观察到价格',
            dataIndex: 'price',
            defaultEditing: false,
            editable,
            render: (val, record, index, { form, editing }) => (
              <FormItem>
                {form.getFieldDecorator({})(
                  <UnitInputNumber autoSelect editing={editing} unit="¥" />,
                )}
              </FormItem>
            ),
          },
      ...(editable
        ? [
            {
              title: '操作',
              dataIndex: 'operation',
              render: (text, record, index) => (
                <Row
                  type="flex"
                  align="middle"
                  // style={{
                  //   height: params.context.rowHeight,
                  // }}
                >
                  <Button size="small" type="danger" onClick={this.bindRemove(index)}>
                    删除
                  </Button>
                </Row>
              ),
            },
          ]
        : []),
    ];
  };

  public getAutoGenerateButton = () => (
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

  public handleCellValueChanged = params => {
    this.setState(state => ({
      dealDataSource: this.computeDataSource(
        state.dealDataSource.map((item, index) => {
          if (index === params.rowIndex) {
            return params.record;
          }
          return item;
        }),
      ),
    }));
  };

  public renderResult = () => {
    const { editing: editable } = this.props;
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
          size="small"
          modalProps={{
            closable: false,
            footer: editable
              ? [
                  <Button key="cancel" onClick={this.onCancel}>
                    取消
                  </Button>,
                  <Button key="submit" type="primary" onClick={this.onOk}>
                    确认
                  </Button>,
                ]
              : [
                  <Button key="cancel" onClick={this.onCancel}>
                    取消
                  </Button>,
                ],
            title: `观察日${editable ? '编辑' : '查看'}`,
            destroyOnClose: true,
            width: 700,
            visible: this.state.visible,
          }}
          onClick={this.onOpen}
          style={{ width: '100%', display: 'block' }}
          content={
            <>
              {editable && (
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
                      submitText="添加"
                      resetable={false}
                    />
                  </Col>
                  <Col>{this.getAutoGenerateButton()}</Col>
                </Row>
              )}
              <SmartTable
                dataSource={this.state.dealDataSource}
                pagination={false}
                rowKey={record => record[OB_DAY_FIELD].format('YYYY-MM-DD')}
                onCellFieldsChange={this.handleCellValueChanged}
                columns={this.getColumnDefs()}
              />
            </>
          }
        >
          观察日{editable ? '管理' : '查看'}
        </ModalButton>
      </Row>
    );
  };

  public renderEditing() {
    return this.renderResult();
  }

  public renderRendering() {
    return this.renderResult();
  }
}

export const ExpireNoBarrierObserveDay: ILegColDef = {
  title: '敲出/coupon观察日',
  dataIndex: LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY,
  editable: record => false,
  defaultEditing: record => {
    const { isEditing, isBooking, isPricing } = getLegEnvs(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(
        <ObserveModalInput editing={editing} record={record} direction={KNOCK_DIRECTION_MAP.UP} />,
      )}
    </FormItem>
  ),
};
