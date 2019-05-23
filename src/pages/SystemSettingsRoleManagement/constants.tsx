import { IFormColDef, ITableColDef } from '@/containers/type';
import { getLocaleId, mapTree, remove } from '@/tools';
import { Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { formatMessage } from 'umi/locale';
import Operation from './Operation';

const { TextArea } = Input;

const routerExports = require('../../../config/router.config.js');
const routeData = routerExports.default || routerExports || [];

export const TABLE_COL_DEF: (fetchTable, showResource) => ITableColDef[] = (
  fetchTable,
  showResource
) => [
  {
    dataIndex: 'roleName',
    title: '角色',
  },
  {
    dataIndex: 'alias',
    title: '别名',
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
  {
    dataIndex: 'operation',
    title: '操作',
    render: (val, record, index) => {
      return <Operation data={record} fetchTable={fetchTable} showResource={showResource} />;
    },
  },
];

export const FORM_CONTROL: IFormColDef[] = [
  {
    title: '角色名',
    dataIndex: 'roleName',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '角色名必填' }] })(
            <Input />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '别名',
    dataIndex: 'alias',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
  {
    title: '备注信息',
    dataIndex: 'remark',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<TextArea rows={4} />)}</FormItem>;
    },
  },
];

const appRoute = routeData.find(item => item.appRoute);

const filterAppRoute = {
  ...appRoute,
  routes: remove(appRoute.routes, item => item.name === 'welcomePage'),
};

const treeRoute = mapTree(
  filterAppRoute,
  (node, parent) => {
    if (node.appRoute === true) {
      return {
        title: '页面权限',
        key: 'default',
        children: node.routes,
      };
    }
    return {
      title: formatMessage({ id: getLocaleId(parent, node), defaultMessage: node.name }),
      key: node.name,
      children: node.routes,
    };
  },
  'routes'
);

export const treeData = [treeRoute];
