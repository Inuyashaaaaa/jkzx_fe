import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker, Icon, Button, message } from 'antd';
import { Select, Input } from '@/containers';
import { authUserList } from '@/services/user';
import styles from './index.less';
import uuidv4 from 'uuid/v4';

const { RangePicker } = DatePicker;

const operation = [
  {
    label: '用户登录',
    value: '用户登录',
  },
  {
    label: '用户登出',
    value: '用户注销',
  },
  {
    label: '查看历史波动率',
    value: '查看历史波动率',
  },
  {
    label: '查看历史波动率锥',
    value: '查看历史波动率锥',
  },
  {
    label: '查看公允波动率',
    value: '查看公允波动率',
  },
  {
    label: '查看子公司波动率对比',
    value: '查看子公司波动率对比',
  },
  {
    label: '查看公允/历史波动率对比',
    value: '查看公允/历史波动率对比',
  },
  {
    label: '查看全市场整体风险报告',
    value: '查看全市场整体风险报告',
  },
  {
    label: '查看全市场分品种风险报告',
    value: '查看全市场分品种风险报告',
  },
  {
    label: '查看各子公司风险报告',
    value: '查看各子公司风险报告',
  },
  {
    label: '查看各子公司分品种风险报告',
    value: '查看各子公司分品种风险报告',
  },
  {
    label: '查看交易对手风险报告',
    value: '查看交易对手风险报告',
  },
  {
    label: '查看交易对手分品种风险报告',
    value: '查看交易对手分品种风险报告',
  },
  {
    label: '查看情景分析报告',
    value: '查看情景分析报告',
  },
  {
    label: '查看场外衍生品市场规模概况',
    value: '查看场外衍生品市场规模概况',
  },
  {
    label: '查看场外衍生品市场成交结构',
    value: '查看场外衍生品市场成交结构',
  },
  {
    label: '查看场外衍生品市场持仓结构',
    value: '查看场外衍生品市场持仓结构',
  },
  {
    label: '查看场外衍生品市场资产和工具结构',
    value: '查看场外衍生品市场资产和工具结构',
  },
  {
    label: '查看场外衍生品市场客户类型结构',
    value: '查看场外衍生品市场客户类型结构',
  },
  {
    label: '查看场外衍生品市场集中度',
    value: '查看场外衍生品市场集中度',
  },
  {
    label: '查看场内外品种联动统计',
    value: '查看场内外品种联动统计',
  },
  {
    label: '查看交易对手方联动统计',
    value: '查看交易对手方联动统计',
  },
  {
    label: '查看子公司联动统计',
    value: '查看子公司联动统计',
  },
  {
    label: '查看场外衍生品市场操纵风险监测',
    value: '查看场外衍生品市场操纵风险监测',
  },
  {
    label: '查看场外衍生品市场子公司传染风险监测',
    value: '查看场外衍生品市场子公司传染风险监测',
  },
  {
    label: '查看对手方场内外合并持仓占比',
    value: '查看对手方场内外合并持仓占比',
  },
];

export const searchFormControls = [
  {
    title: '用户',
    dataIndex: 'username',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请选择"
            allowClear
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const { data, error } = await authUserList({});
              if (error) return [];
              return _.sortBy(data, 'username').map(item => ({
                label: item.username,
                value: item.username,
              }));
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '操作事件',
    dataIndex: 'operation',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={operation}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '操作日期',
    dataIndex: 'operationDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '操作日期为必填项',
            },
          ],
        })(<RangePicker allowClear={false} />)}
      </FormItem>
    ),
  },
];

export const tableColDefs = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '操作事件',
    dataIndex: 'operation',
  },
  {
    title: '服务名',
    dataIndex: 'service',
  },
  {
    title: '方法名',
    dataIndex: 'method',
  },
  {
    title: '操作时间',
    dataIndex: 'createdAt',
    render: (value, record, index) => {
      if (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
      return value;
    },
  },
];

export const errorSearchFormControls = [
  {
    title: '操作用户',
    dataIndex: 'username',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请选择"
            allowClear
            // showSearch
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const { data, error } = await authUserList({});
              if (error) return [];
              return _.sortBy(data, 'username').map(item => ({
                label: item.username,
                value: item.username,
              }));
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '操作时间',
    dataIndex: 'operationDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({})(<RangePicker allowClear={false} />)}</FormItem>
    ),
  },
];

const EllipsisWrap = props => {
  const copy = () => {
    const input = document.createElement('input');
    input.value = props.value;
    const Id = uuidv4();
    input.id = Id;
    input.setAttribute('style', 'opacity: 0;zInde: -10;');
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.getElementById(Id).remove();
    message.success('复制成功');
  };

  return (
    <div className={styles.wrap}>
      <a className={styles.ellipsisWrap} title={props.value} id={props.id}>
        {props.value}
      </a>
      {props.value ? (
        <Button shape="circle" icon="copy" onClick={copy} className={styles.copy} />
      ) : null}
    </div>
  );
};

export const errorTableColDefs = [
  {
    title: '操作用户',
    dataIndex: 'username',
    width: 200,
    render: val => (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {val}
      </span>
    ),
  },
  {
    title: '操作时间',
    dataIndex: 'createdAt',
    width: 200,
    render: (value, record, index) => {
      if (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
      return value;
    },
  },
  {
    title: '方法名',
    dataIndex: 'requestMethod',
    width: 200,
  },
  {
    title: '请求参数',
    dataIndex: 'requestParams',
    width: 250,
    render: (value, record) => <EllipsisWrap value={value} id={record.id} />,
  },
  {
    title: '错误信息',
    dataIndex: 'errorMessage',
    width: 250,
    render: (value, record) => <EllipsisWrap value={value} id={record.id} />,
  },
  {
    title: '报错位置',
    dataIndex: 'errorStackTrace',
    width: 250,
    render: (value, record) => <EllipsisWrap value={value} id={record.id} />,
  },
];
