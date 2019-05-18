import { IFormControl } from '@/components/_Form2';
import { refSimilarLegalNameList } from '@/services/reference-data-service';

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易簿',
    },
    input: {
      type: 'select',
      mode: 'multiple',
      options: [
        {
          label: 'name1',
          value: 'value1',
        },
      ],
      placeholder: '请输入',
    },
    dataIndex: 'name',
  },
  {
    control: {
      label: '交易ID',
    },
    dataIndex: 'sta5tus',
    input: {
      placeholder: '请选择',
      type: 'select',
      mode: 'multiple',
      options: [
        {
          label: 'name1',
          value: 'value1',
        },
      ],
    },
  },
  {
    control: {
      label: '交易对手',
    },
    dataIndex: 'stat4us',
    input: {
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    control: {
      label: '销售',
    },
    dataIndex: 'stat3us',
    input: {
      placeholder: '请选择',
      type: 'select',
      mode: 'multiple',
      options: [
        {
          label: 'name1',
          value: 'value1',
        },
      ],
    },
  },
  {
    control: {
      label: '交易日',
    },
    dataIndex: 'statu2s',
    input: {
      placeholder: '请选择',
      type: 'date',
      range: 'day',
    },
  },
];
