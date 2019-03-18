const legForm = [
  {
    label: '交易簿',
    dataIndex: 'book_id',
    rules: [
      {
        required: true,
        message: '请输入交易簿ID',
      },
    ],
    placeholder: '请输入交易簿ID',
    type: 'select',
    showSearch: true,
    options: [
      {
        name: '交易簿123',
        value: '123',
      },
      {
        name: '交易簿234',
        value: '234',
      },
    ],
  },
  {
    label: '交易ID',
    dataIndex: 'trade_id',
    rules: [
      {
        required: true,
        message: '请输入交易ID',
      },
    ],
    placeholder: '请输入交易ID',
  },
  {
    dataIndex: 'counterparty',
    label: '交易对手',
    rules: [
      {
        required: true,
        message: '请输入交易对手',
      },
    ],
    placeholder: '请输入交易对手',
    type: 'select',
    showSearch: true,
    options: [
      {
        name: '交易对手123',
        value: '123',
      },
      {
        name: '交易对手234',
        value: '234',
      },
    ],
  },
  {
    dataIndex: 'trade_date',
    format: 'YYYY-MM-DD',
    label: '交易日',
    rules: [
      {
        required: true,
        message: '请选择交易日',
      },
    ],
    type: 'date',
    style: {
      width: '100%',
    },
  },
  {
    dataIndex: 'sales',
    label: '销售',
    rules: [
      {
        required: true,
        message: '请输入销售',
      },
    ],
    placeholder: '请输入销售',
    type: 'select',
    options: [
      {
        name: '销售123',
        value: '123',
      },
      {
        name: '销售234',
        value: '234',
      },
    ],
  },
  {
    dataIndex: 'notes',
    label: '备注',
    rules: [
      {
        required: true,
        message: '请输入备注',
      },
    ],
    placeholder: '请输入备注',
  },
];

export default legForm;
