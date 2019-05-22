import { IFormControl } from '@/components/Form/types';
import { IColumnDef } from '@/components/Table/types';
import React from 'react';
import Operation from './Operation';
import { mapTree, remove } from '@/utils';
import { formatMessage } from 'umi/locale';
import { getLocaleId } from '@/tools';

const routerExports = require('../../../config/router.config.js');
const routeData = routerExports.default || routerExports || [];

console.log(routeData);

export const TABLE_COL_DEF: (fetchTable, showResource) => IColumnDef[] = (
  fetchTable,
  showResource
) => [
  {
    field: 'roleName',
    headerName: '角色',
    editable: true,
  },
  {
    field: 'alias',
    headerName: '别名',
    editable: true,
  },
  {
    field: 'remark',
    headerName: '备注',
    editable: true,
  },
  {
    headerName: '操作',
    render: params => {
      return <Operation data={params.data} fetchTable={fetchTable} showResource={showResource} />;
    },
  },
];

export const FORM_CONTROL: IFormControl[] = [
  {
    control: {
      label: '角色名',
    },
    field: 'roleName',
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '角色名必填',
        },
      ],
    },
  },
  {
    control: {
      label: '别名',
    },
    field: 'alias',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '备注信息',
    },
    field: 'remark',
    input: {
      type: 'textarea',
      autosize: { minRows: 4, maxRows: 4 },
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
