import { IFormControl } from '@/lib/components/_Form2';

export const USER_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '用户名',
    },
    dataIndex: 'usernmae',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '密码',
    },
    dataIndex: '密码',
    input: {
      type: 'input',
      inputType: 'password',
    },
  },
  {
    control: {
      label: '昵称',
    },
    dataIndex: '昵称',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '外部账号类型',
    },
    dataIndex: '外部账号类型',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '关联外部账号',
    },
    dataIndex: '关联外部账号',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '角色',
    },
    dataIndex: '角色',
    input: {
      type: 'select',
      mode: 'multiple',
    },
  },
];
