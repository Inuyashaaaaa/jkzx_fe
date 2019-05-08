import Section from '@/components/Section';
import { VERTICAL_GUTTER_LG } from '@/constants/global';
import Form from '@/design/components/Form';
import Loading from '@/lib/components/_Loading2';
import { arr2treeOptions } from '@/lib/utils';
import { DOWN_LOAD_FIEL_URL, getPartyDoc } from '@/services/document';
import { createRefParty, refPartyGetByLegalName } from '@/services/reference-data-service';
import { queryCompleteCompanys } from '@/services/sales';
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { DOC_FIELDS, INSTITUTION, PRODUCT, PRODUCTIONS } from './constants';
import { ADDRESS_CASCADER, INSITUTIONS } from './constants/INSITUTIONS';

class InfoManager extends PureComponent<any, any> {
  public uuid: string;

  public clientType: string;

  public $form: WrappedFormUtils = null;

  public state = {
    loading: false,
    dataSource: {},
  };

  public componentDidMount = async () => {
    this.setState({ loading: true });
    this.fetchBranchSalesList();

    const { error, data } = await refPartyGetByLegalName({
      legalName: this.props.data.legalName,
    });

    if (error) return false;

    this.uuid = data.uuid;
    this.clientType = data.clientType;

    const filterData = _.omitBy(data, _.isNull);
    const fileData = _.pick(filterData, DOC_FIELDS);

    const rsps = await Promise.all(
      _.toPairs(fileData).map(([key, val]) => {
        return getPartyDoc({
          uuid: val,
        }).then(result => {
          return {
            ...result,
            key,
          };
        });
      })
    );

    const fileUUIDMap = rsps.reduce((container, next) => {
      const { data, error, key, raw } = next;
      if (error) return container;
      container[key] = [
        {
          uid: data.uuid,
          status: 'done',
          name: _.get(data, 'templates.[0].fileName', '未知文件'),
          url: `${DOWN_LOAD_FIEL_URL}${raw.result.uuid}&partyDoc=true`,
          response: raw,
        },
      ];
      return container;
    }, {});

    this.setState({
      loading: false,
      dataSource: {
        ..._.omit(filterData, ['subsidiaryName', 'branchName', 'salesName', 'authorizers']),
        ADDRESS_CASCADER: _.values(
          _.pick(filterData, ['subsidiaryName', 'branchName', 'salesName'])
        ),
        tradeAuthorizer: filterData.authorizers,
        ...fileUUIDMap,
      },
    });
  };

  public fetchBranchSalesList = async () => {
    const { error, data } = await queryCompleteCompanys();
    if (error) return false;
    const newData = arr2treeOptions(
      data,
      ['subsidiary', 'branch', 'salesName'],
      ['subsidiary', 'branch', 'salesName']
    );
    const branchSalesList = newData.map(subsidiaryName => {
      return {
        value: subsidiaryName.value,
        label: subsidiaryName.label,
        children: subsidiaryName.children.map(branchName => {
          return {
            value: branchName.value,
            label: branchName.label,
            children: branchName.children.map(salesName => {
              return {
                value: salesName.value,
                label: salesName.label,
              };
            }),
          };
        }),
      };
    });
    this.setState({ branchSalesList });
    return true;
  };

  public createProduct = () => {
    this.$form.validateFieldsAndScroll(async (error, values) => {
      if (error) return;

      const formatValues = _.mapValues(values, (val, key) => {
        if (isMoment(val)) {
          return val.format('YYYY-MM-DD');
        }
        return val;
      });

      const { [ADDRESS_CASCADER]: cascader, ...rest } = formatValues;

      const [subsidiaryName, branchName, salesName] = cascader;

      const fileuuidsValues = _.mapValues(rest, (val, key) => {
        if (DOC_FIELDS.indexOf(key) !== -1) {
          return _.get(val, '[0].response.result.uuid', undefined);
        }
        return val;
      });

      if (!salesName) {
        return message.warn('销售不存在');
      }

      const distValues = {
        ...fileuuidsValues,
        uuid: this.uuid,
        subsidiaryName,
        branchName,
        salesName,
        clientType: PRODUCT,
      };

      const rsp = await createRefParty(distValues);

      if (rsp.error) return;

      message.success('保存成功');
    });
  };

  public createInstitution = () => {
    this.$form.validateFieldsAndScroll(async (error, values) => {
      if (error) return;
      const formatValues = _.mapValues(values, (val, key) => {
        if (isMoment(val)) {
          return val.format('YYYY-MM-DD');
        }
        return val;
      });

      const { [ADDRESS_CASCADER]: cascader, ...rest } = formatValues;
      const [subsidiaryName, branchName, salesName] = cascader;

      const fileuuidsValues = _.mapValues(rest, (val, key) => {
        if (DOC_FIELDS.indexOf(key) !== -1) {
          return _.get(val, '[0].response.result.uuid', undefined);
        }
        return val;
      });

      if (!salesName) {
        return message.warn('销售不存在');
      }

      const distValues = {
        ...fileuuidsValues,
        uuid: this.uuid,
        subsidiaryName,
        branchName,
        salesName,
        clientType: INSTITUTION,
      };

      const rsp = await createRefParty(distValues);

      if (rsp.error) return;

      message.success('保存成功');
    });
  };

  public onSubmit = values => {
    if (this.clientType === INSTITUTION) {
      return this.createInstitution();
    } else {
      return this.createProduct();
    }
  };

  public handleChangeValue = params => {
    const nextValues = { ...params.values };

    Object.keys(params.changedValues).map(key => {
      if (DOC_FIELDS.indexOf(key) !== -1) {
        nextValues[key] = nextValues[key].map(file => {
          if (file.response && file.status === 'done') {
            return {
              ...file,
              url: `${DOWN_LOAD_FIEL_URL}${file.response.result.uuid}&partyDoc=true`,
            };
          }
          return file;
        });
      }
    });

    this.setState({
      dataSource: nextValues,
    });
  };

  public render() {
    return (
      <>
        <Section>交易对手信息管理 - {this.clientType === 'PRODUCT' ? '产品户' : '机构户'}</Section>

        <Loading loading={this.state.loading}>
          <Form
            resetable={false}
            style={{ marginTop: VERTICAL_GUTTER_LG }}
            wrappedComponentRef={element => {
              if (element) {
                this.$form = element.props.form;
              }
              return;
            }}
            dataSource={this.state.dataSource}
            onValueChange={this.handleChangeValue}
            controls={
              this.clientType === 'PRODUCT'
                ? PRODUCTIONS(this.state.branchSalesList, 'edit')
                : INSITUTIONS(this.state.branchSalesList, 'edit')
            }
            controlNumberOneRow={2}
            onSubmitButtonClick={this.onSubmit}
          />
        </Loading>
      </>
    );
  }
}

export default InfoManager;
