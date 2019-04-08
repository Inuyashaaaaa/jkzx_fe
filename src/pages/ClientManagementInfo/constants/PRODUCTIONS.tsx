import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import PlusUserInfoInput from '@/containers/PlusUserInfoInput';
import { IFormControl } from '@/design/components/Form/types';
import { partyDocDelete, UPLOAD_URL } from '@/services/document';
import { message } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import { ADDRESS_CASCADER } from '.';

const PARTY_DOC_CREATE_OR_UPDATE = 'partyDocCreateOrUpdate';

const uploadData = {
  onChange: info => {
    if (info.length) {
      if (info[0].status === 'error') {
        message.error('上传失败');
        return;
      }
      if (info[0].status === 'done') {
        message.success('上传成功');
        return;
      }
    }
  },
  onRemove: async file => {
    if (!file.response) return;
    const { error } = await partyDocDelete({
      uuid: file.response.result.uuid,
    });
    if (error) {
      message.error('删除失败');
      return false;
    }
    message.success('删除成功');
    return true;
  },
};

export const PRODUCTIONS: (
  branchSalesList: CascaderOptionType[]
) => IFormControl[] = branchSalesList => [
  {
    control: {
      label: '开户名称',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'legalName',
  },
  {
    control: {
      label: '开户法人',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'legalRepresentative',
  },
  {
    control: {
      label: '注册地址',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'address',
  },
  {
    control: {
      label: '担保人',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'warrantor',
  },
  {
    control: {
      label: '担保人地址',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'warrantorAddress',
  },
  {
    control: {
      label: '交易电话',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'tradePhone',
  },
  {
    control: {
      label: '交易指定邮箱',
    },
    input: {
      type: 'email',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'tradeEmail',
  },
  {
    control: {
      label: '分公司/营业部/销售',
    },
    input: {
      type: 'cascader',
      options: branchSalesList,
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: ADDRESS_CASCADER,
  },
  {
    control: {
      label: '主协议编号',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'masterAgreementId',
  },
  {
    control: {
      label: '联系人',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: 'contact',
  },
  {
    control: {
      label: '托管邮箱',
    },
    input: {
      type: 'email',
    },
    field: 'trustorEmail',
  },
  {
    control: {
      label: '授权到期日',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    field: 'authorizeExpiryDate',
  },
  {
    control: {
      label: '协议签署授权人姓名',
    },
    input: {
      type: 'input',
    },
    field: 'signAuthorizerName',
  },
  {
    control: {
      label: '协议签署授权人身份证',
    },
    input: {
      type: 'input',
    },
    field: 'signAuthorizerIdNumber',
  },
  {
    control: {
      label: '协议签署授权人证件有效期',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    field: 'signAuthorizerIdExpiryDate',
  },
  {
    control: {
      label: '产品名称',
    },
    input: {
      type: 'input',
    },
    field: 'productName',
  },
  {
    control: {
      label: '产品代码',
    },
    input: {
      type: 'input',
    },
    field: 'productCode',
  },

  {
    control: {
      label: '产品类型',
    },
    input: {
      type: 'input',
    },
    field: 'productType',
  },
  {
    control: {
      label: '备案编号',
    },
    input: {
      type: 'input',
    },
    field: 'recordNumber',
  },
  {
    control: {
      label: '产品成立日',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    field: 'productFoundDate',
  },
  {
    control: {
      label: '产品到期日',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    field: 'productExpiringDate',
  },
  {
    control: {
      label: '基金经理',
    },
    input: {
      type: 'input',
    },
    field: 'fundManager',
  },

  {
    control: {
      label: '我方授信额度',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,

    field: 'ourCreditLimit',
  },
  {
    control: {
      label: '对方授信额度',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    field: 'cptyCreditLimit',
  },
  {
    control: {
      label: '保证金折扣',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,

    field: 'marginDiscountRate',
  },
  {
    control: {
      label: '机构类型分类',
    },
    input: {
      type: 'select',
      options: [
        {
          label: ' 一般机构普通投资者',
          value: 'NON_PROFESSINAL_INVESTOR',
        },
        {
          label: '一般机构专业投资者',
          value: 'PROFESSIONAL_INVESTOR',
        },
        {
          label: '金融机构专业投资者',
          value: 'FINANCIAL_INSTITUTIONAL_INVESTOR',
        },
        {
          label: '金融产品',
          value: 'FINANCIAL_PRODUCT',
        },
      ],
    },
    field: 'investorType',
  },
  {
    control: {
      label: '交易方向',
    },
    input: {
      type: 'select',
      options: [
        {
          label: '买',
          value: 'BUY',
        },
        {
          label: '卖',
          value: 'SELL',
        },
        {
          label: '买卖',
          value: 'BUY_SELL',
        },
      ],
    },
    field: 'tradingDirection',
  },
  {
    control: {
      label: '交易权限',
    },
    input: {
      type: 'select',
      options: [
        {
          label: '交易',
          value: 'FULL',
        },
        {
          label: '限制交易',
          value: 'LIMITED',
        },
        {
          label: '交易标的',
          value: 'BY_UNDERLYER',
        },
      ],
    },
    field: 'tradingPermission',
  },
  {
    control: {
      label: '交易权限备注',
    },
    input: {
      type: 'input',
    },
    field: 'tradingPermissionNote',
  },
  {
    control: {
      label: '交易标的',
    },
    input: {
      type: 'select',
      options: [
        {
          label: '个股商品',
          value: 'EQUITY_COMMODITY',
        },
        {
          label: '商品',
          value: 'COMMODITY',
        },
      ],
    },
    field: 'tradingUnderlyers',
  },
  {
    control: {
      label: '补充协议编号',
    },
    input: {
      type: 'input',
    },
    field: 'supplementalAgreementId',
  },
  {
    control: {
      label: '交易授权人',
    },
    input: {
      type: PlusUserInfoInput,
      placeholder: '请输入姓名，证件号，证件有效期，电话',
    },
    field: 'tradeAuthorizer',
  },
  {
    control: {
      label: '风险问卷调查',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '风险问卷调查',
        }),
      },
      ...uploadData,
    },
    field: 'riskSurveyDoc',
  },
  {
    control: {
      label: '对手尽职调查',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '对手尽职调查',
        }),
      },
      ...uploadData,
    },
    field: 'dueDiligenceDoc',
  },
  {
    control: {
      label: '风险承受能力调查问卷',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '风险承受能力调查问卷',
        }),
      },
      ...uploadData,
    },
    field: 'riskPreferenceDoc',
  },
  {
    control: {
      label: '主协议',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '主协议',
        }),
      },
      ...uploadData,
    },
    field: 'masterAgreementDoc',
  },
  {
    control: {
      label: '补充协议',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '补充协议',
        }),
      },
      ...uploadData,
    },
    field: 'supplementalAgreementDoc',
  },
  {
    control: {
      label: '交易授权书',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '交易授权书',
        }),
      },
      ...uploadData,
    },
    field: 'tradeAuthDoc',
  },
  {
    control: {
      label: '合规性承诺书',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '合规性承诺书',
        }),
      },
      ...uploadData,
    },
    field: 'complianceDoc',
  },
  {
    control: {
      label: '风险揭示书',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '风险揭示书',
        }),
      },
      ...uploadData,
    },
    field: 'riskRevelationDoc',
  },
  {
    control: {
      label: '适当性警示书',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '适当性警示书',
        }),
      },
      ...uploadData,
    },
    field: 'qualificationWarningDoc',
  },
  {
    control: {
      label: '授信协议',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '授信协议',
        }),
      },
      ...uploadData,
    },
    field: 'creditAgreement',
  },
  {
    control: {
      label: '履约保障协议',
    },
    input: {
      type: 'upload',
      action: UPLOAD_URL,
      data: {
        method: PARTY_DOC_CREATE_OR_UPDATE,
        params: JSON.stringify({
          name: '履约保障协议',
        }),
      },
      ...uploadData,
    },
    field: 'performanceGuaranteeDoc',
  },
];
