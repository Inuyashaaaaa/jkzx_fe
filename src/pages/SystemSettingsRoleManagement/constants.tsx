/* eslint-disable @typescript-eslint/no-var-requires */
import { Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { formatMessage } from 'umi/locale';
import { getLocaleId, mapTree, remove } from '@/tools';
import { IFormColDef } from '@/components/type';

const { TextArea } = Input;

const routerExports = require('../../../config/router.config.js');

const routeData = routerExports.default || routerExports || [];

export const FORM_CONTROL: IFormColDef[] = [
  {
    title: '角色名',
    dataIndex: 'roleName',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({ rules: [{ required: true, message: '角色名必填' }] })(<Input />)}
      </FormItem>
    ),
  },
  {
    title: '别名',
    dataIndex: 'alias',
    render: (value, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>
    ),
  },
  {
    title: '备注信息',
    dataIndex: 'remark',
    render: (value, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<TextArea rows={4} />)}</FormItem>
    ),
  },
];

const appRoute = routeData.find(item => item.appRoute);
const centerRoute = routeData.find(item => item.centerRoute);

const filterCenterRoute = {
  ...centerRoute,
  routes: remove(centerRoute.routes, item => item.name === 'welcomeCenterPage'),
};

const filterAppRoute = {
  ...appRoute,
  routes: remove(appRoute.routes, item => item.name === 'welcomePage'),
};

const bctTreeRoute = mapTree(
  filterAppRoute,
  (node, parent) => {
    if (node.appRoute === true) {
      return {
        title: 'BCT页面权限',
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
  'routes',
);

const centerTreeRoute = mapTree(
  filterCenterRoute,
  (node, parent) => {
    if (node.centerRoute === true) {
      return {
        title: '监控中心页面权限',
        key: 'center',
        children: node.routes,
      };
    }
    return {
      title: formatMessage({ id: getLocaleId(parent, node), defaultMessage: node.name }),
      key: node.name,
      children: node.routes,
    };
  },
  'routes',
);

const treeRoute = {
  title: '页面权限',
  key: 'all',
  children: [bctTreeRoute, centerTreeRoute],
};

export const treeData = [treeRoute];
