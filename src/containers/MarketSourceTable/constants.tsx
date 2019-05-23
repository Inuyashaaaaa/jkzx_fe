import { IFormControl } from '@/containers/_Form2';
import { mktInstrumentSearch } from '@/services/market-data-service';

export const NAME_FIELD_KEY = 'title';

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    dataIndex: NAME_FIELD_KEY,
    control: {
      label: '标的物名',
    },
    options: {
      rules: [
        {
          required: true,
          message: '标的物名必须填写',
        },
        {
          validator: (rule, value = '', callback) => {
            if (value.match(/\s/)) {
              return callback(true);
            }

            callback();
          },
          message: '空格不能作为有效字符',
        },
      ],
    },
    input: {
      type: 'select',
      showSearch: true,
      options: async (value: string) => {
        const { data, error } = await mktInstrumentSearch({
          instrumentIdPart: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
];
