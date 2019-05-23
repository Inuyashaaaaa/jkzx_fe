import { IColumnDef } from '@/containers/Table/types';
import { IFormControl } from '@/containers/_Form2';

export const createPageTableColDefs: (roleOptions) => IColumnDef[] = roleOptions => [
  {
    headerName: '用户名',
    field: 'username',
  },
  {
    headerName: '昵称',
    field: 'nickName',
  },
  {
    headerName: '拥有角色（可编辑）',
    field: 'roles',
    editable: true,
    input: {
      defaultOpen: true,
      mode: 'multiple',
      type: 'select',
      options: roleOptions,
    },
  },
  {
    headerName: '部门',
    field: 'departmentName',
    editable: false,
  },
  {
    headerName: '类型',
    field: 'userTypeName',
    editable: false,
  },
  {
    headerName: '邮箱',
    field: 'contactEmail',
    editable: false,
  },
];

export const createFormControls = roles => ({ createFormData }): IFormControl[] => [
  {
    dataIndex: 'userName',
    control: {
      label: '用户名',
    },
    input: { type: 'input' },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    dataIndex: 'password',
    control: { label: '密码' },
    input: { type: 'input', inputType: 'password' },
    options: {
      rules: [
        {
          required: true,
        },
        {
          pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/,
          message: '密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位',
        },
      ],
    },
  },
  {
    dataIndex: 'confirmpassword',
    control: { label: '确认密码' },
    input: { type: 'input', inputType: 'password' },
    options: {
      rules: [
        {
          required: true,
        },
        {
          validator(rule, value, cb) {
            if (createFormData.password !== value) {
              cb('2次密码输入不一致');
            }
            cb();
          },
        },
      ],
    },
  },
  {
    dataIndex: 'roleIds',
    control: {
      label: '角色',
    },
    input: {
      type: 'select',
      mode: 'multiple',
      options: roles.map(item => {
        return {
          label: item.roleName,
          value: item.uuid,
        };
      }),
    },
  },
];
