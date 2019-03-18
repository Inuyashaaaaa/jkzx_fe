import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { PureStateComponent } from '@/lib/components/_Components';
import React from 'react';
import FormPlus from '@/lib/components/_FormPlus';

class CustomInfo extends PureStateComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }

  render() {
    const { formData } = this.state;

    const formItems = [
      {
        label: '开户名称',
        dataIndex: '开户名称',
        type: 'input',
        required: true,
      },
      {
        label: '开户法人',
        dataIndex: '开户法人',
        type: 'input',
        required: true,
      },
      {
        label: '注册地址',
        dataIndex: '注册地址',
        type: 'input',
        required: true,
      },
      {
        label: '交易对手联系人',
        dataIndex: '交易对手联系人',
        type: 'input',
        required: true,
      },
      {
        label: '担保人',
        dataIndex: '担保人',
        type: 'input',
        required: true,
      },
      {
        label: '担保人地址',
        dataIndex: '担保人地址',
        type: 'input',
        required: true,
      },
      {
        label: '主协议编号',
        dataIndex: '主协议编号',
        type: 'input',
        required: true,
      },
      {
        label: '交易电话',
        dataIndex: '交易电话',
        type: 'input',
        required: true,
      },
      {
        label: '交易指定邮箱',
        dataIndex: '交易指定邮箱',
        type: 'input',
        required: true,
      },
      {
        label: '主协议',
        dataIndex: '主协议',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '补充协议',
        dataIndex: '补充协议',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '风险问卷调查',
        dataIndex: '风险问卷调查',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '交易授权书',
        dataIndex: '交易授权书',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '对手尽职调查',
        dataIndex: '对手尽职调查',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '风险承受能力调查问卷',
        dataIndex: '风险承受能力调查问卷',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '合规性承诺书',
        dataIndex: '合规性承诺书',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '风险揭示书',
        dataIndex: '风险揭示书',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '适当性警告书',
        dataIndex: '适当性警告书',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '授信协议',
        dataIndex: '授信协议',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '履约保障协议',
        dataIndex: '履约保障协议',
        type: 'file',
        required: true,
        action: '//localhost:8000/file',
      },
      {
        label: '分公司',
        dataIndex: '分公司',
        type: 'input',
        required: true,
      },
      {
        label: '营业部',
        dataIndex: '营业部',
        type: 'input',
        required: true,
      },
      {
        label: '销售',
        dataIndex: '销售',
        type: 'input',
        required: true,
      },
      {
        label: '开户行',
        dataIndex: '开户行',
        type: 'input',
        required: true,
      },
      {
        label: '银行账号',
        dataIndex: '银行账号',
        type: 'input',
        required: true,
      },
      {
        label: '账户名',
        dataIndex: '账户名',
        type: 'input',
        required: true,
      },
      {
        label: '支付系统账号',
        dataIndex: '支付系统账号',
        type: 'input',
        required: true,
      },
      {
        label: '对方授信额度',
        dataIndex: '对方授信额度',
        type: 'input',
        required: true,
      },
      {
        label: '我方授信额度',
        dataIndex: '我方授信额度',
        type: 'input',
        required: true,
      },
      {
        label: '保证金折扣',
        dataIndex: '保证金折扣',
        type: 'input',
        required: true,
      },
    ];

    const formProps = {
      getNode: node => {
        this.form = node;
      },
      cellNumberOneRow: 2,
      dataSource: formData,
      items: formItems,
      labelCol: 6,
      wrapperCol: 10,
      onChange: ({ values }) => {
        this.setState({
          formData: values,
        });
      },
    };

    return (
      <PageHeaderWrapper>
        <FormPlus {...formProps} />
      </PageHeaderWrapper>
    );
  }
}

export default CustomInfo;
