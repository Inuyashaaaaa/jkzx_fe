/*eslint-disable */
import React, { memo, useState, useRef, useEffect } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import Mock from 'mockjs';
import _ from 'lodash';
import { Form2 } from '@/containers';
import ThemeSelect from '@/containers/ThemeSelect';
import { IFormColDef } from '@/components/type';
import ThemeInputNumber from '@/containers/ThemeInputNumber';
import ThemeInputNumberRange from '@/containers/ThemeInputNumberRange';
import ThemeButton from '@/containers/ThemeButton';
import ThemeTable from '@/containers/ThemeTable';
import { delay, formatNumber } from '@/tools';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { queryNonGroupResource } from '@/services/tradeBooks';
import { rptSpotScenariosReportListSearch } from '@/services/report-service';
import moment from 'moment';

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const CenterScenario = memo(props => {
  const [searchFormData, setSearchFormData] = useState({});
  const [reportFormData, setReportFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [tableColDefs, setTableColDefs] = useState([]);
  const [subNameOrBook, setSubNameOrBook] = useState([]);

  const searchForm = useRef<Form2>(null);
  const reportForm = useRef<Form2>(null);

  const colDefsMirrior = {
    underlyerPrice: '标的物价格',
    price: '持仓价格',
    pnlChange: 'PNL变动',
    delta: 'Delta',
    deltaCash: 'Delta Cash',
    gamma: 'Gamma',
    gammaCash: 'Gamma Cash',
    vega: 'Vega',
    theta: 'Theta',
    rhoR: 'Rho_R',
  };

  useEffect(() => {
    const reportData = Form2.getFieldsValue(reportFormData);
    const subFields =
      !reportData.reportType || reportData.reportType === 'MARKET'
        ? []
        : reportData.reportType === 'SUBSIDIARY'
        ? [
            {
              title: '各子公司',
              dataIndex: 'subName',
              render: (val, record, index, { form }) => (
                <FormItem>
                  {form.getFieldDecorator({ rules: [{ required: true, message: '各子公司必填' }] })(
                    <ThemeSelect
                      filterOption
                      showSearch
                      options={async (value: string) => {
                        const { data, error } = await queryNonGroupResource();
                        if (error) return [];
                        return data.map(item => ({
                          label: item.resourceName,
                          value: item.resourceName,
                        }));
                      }}
                    ></ThemeSelect>,
                  )}
                </FormItem>
              ),
            },
          ]
        : [
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (val, record, index, { form }) => (
                <FormItem>
                  {form.getFieldDecorator({ rules: [{ required: true, message: '交易对手必填' }] })(
                    <ThemeSelect
                      fetchOptionsOnSearch
                      showSearch
                      options={async (value: string) => {
                        const { data, error } = await refSimilarLegalNameList({
                          similarLegalName: value,
                        });
                        if (error) return [];
                        return data.slice(0, 50).map(item => ({
                          label: item,
                          value: item,
                        }));
                      }}
                    ></ThemeSelect>,
                  )}
                </FormItem>
              ),
            },
          ];
    setSubNameOrBook(subFields);
  }, [reportFormData]);

  const onSearchFormChange = (props, changedFields, allFields) => {
    setSearchFormData({
      ...searchFormData,
      ...changedFields,
    });
  };

  const onReportFormChange = (props, changedFields, allFields) => {
    setReportFormData({
      ...reportFormData,
      ...changedFields,
    });
  };

  const onSearch = async () => {
    const [searchRsp, reportRsp] = await Promise.all([
      searchForm.current.validate(),
      reportForm.current.validate(),
    ]);
    if (searchRsp.error || reportRsp.error) return;
    const searchData = Form2.getFieldsValue(searchFormData);
    const reportData = _.mapValues(
      _.mapKeys(Form2.getFieldsValue(reportFormData), (val, key) => {
        if (key === 'legalName' || key === 'subName') {
          return 'bookOrSubName';
        }
        return key;
      }),
      (vals, keys) => {
        if (keys === 'valuationDate') {
          return moment(vals).format('YYYY-MM-DD');
        }
        return vals;
      },
    );
    setLoading(true);
    setTableLoading(true);

    const { error, data } = await rptSpotScenariosReportListSearch({
      ...searchData,
      ...reportData,
    });
    setLoading(false);
    setTableLoading(false);
    if (error || !data.length) return;
    const scenarioId = data[0].scenarios.map(item => item.scenarioId);
    const colDef = scenarioId.map(item => ({
      title: item,
      dataIndex: item,
      align: 'right',
      render: val => val && formatNumber(val, 4),
    }));
    const tableData = Object.keys(colDefsMirrior).map(item =>
      data[0].scenarios.reduce(
        (prev, next) => ({
          ...prev,
          [next.scenarioId]: next[item],
        }),
        { greekLatter: _.get(colDefsMirrior, item) },
      ),
    );
    setTableColDefs([
      {
        title: '标的物情景分析',
        dataIndex: 'greekLatter',
      },
      ...colDef,
    ]);
    setDataSource(tableData);
  };

  const reportFormControls: IFormColDef[] = [
    {
      title: '观察日',
      dataIndex: 'valuationDate',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '观察日必填' }] })(
            <ThemeDatePicker placeholder=""></ThemeDatePicker>,
          )}
        </FormItem>
      ),
    },
    {
      title: '数据范围',
      dataIndex: 'reportType',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '数据范围必填' }] })(
            <ThemeSelect
              options={[
                {
                  label: '全市场',
                  value: 'MARKET',
                },
                {
                  label: '各子公司',
                  value: 'SUBSIDIARY',
                },
                {
                  label: '交易对手',
                  value: 'PARTY',
                },
              ]}
            ></ThemeSelect>,
          )}
        </FormItem>
      ),
    },
    ...subNameOrBook,
  ];

  const searchFormControls: IFormColDef[] = [
    {
      title: '标的物',
      dataIndex: 'underlyer',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '标的物必填' }] })(
            <ThemeSelect
              fetchOptionsOnSearch
              showSearch
              options={async (value: string) => {
                const { data, error } = await mktInstrumentWhitelistSearch({
                  instrumentIdPart: value,
                });
                if (error) return [];
                return data.slice(0, 50).map(item => ({
                  label: item,
                  value: item,
                }));
              }}
            ></ThemeSelect>,
          )}
        </FormItem>
      ),
    },
    {
      title: '价格范围(%)',
      dataIndex: 'priceRange',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({})(<ThemeInputNumberRange></ThemeInputNumberRange>)}
        </FormItem>
      ),
    },
    {
      title: '情景个数',
      dataIndex: 'seniorNumber',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({})(
            <ThemeInputNumber style={{ minWidth: 200 }}></ThemeInputNumber>,
          )}
        </FormItem>
      ),
    },
  ];

  return (
    <>
      <Row type="flex" gutter={18}>
        <Col>
          <Title>情景分析</Title>
        </Col>
        <Col>
          <FormItemWrapper>
            <Form2
              ref={node => (reportForm.current = node)}
              dataSource={reportFormData}
              onFieldsChange={onReportFormChange}
              columns={reportFormControls}
              layout="inline"
              footer={false}
            ></Form2>
          </FormItemWrapper>
        </Col>
      </Row>
      <Row
        type="flex"
        justify="start"
        align="middle"
        gutter={12}
        style={{ marginBottom: 21, marginTop: 21 }}
      >
        <Col>
          <FormItemWrapper>
            <Form2
              ref={node => (searchForm.current = node)}
              dataSource={searchFormData}
              onFieldsChange={onSearchFormChange}
              columns={searchFormControls}
              layout="inline"
              footer={false}
            ></Form2>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton loading={searchFormData && loading} onClick={onSearch} type="primary">
            确定
          </ThemeButton>
        </Col>
      </Row>
      <ThemeTable
        loading={tableLoading}
        wrapStyle={{ width: 1685 }}
        dataSource={dataSource}
        columns={tableColDefs}
        scroll={{ x: tableColDefs.length && tableColDefs.length * 150 }}
        pagination={false}
        rowkey="greekLatter"
      ></ThemeTable>
    </>
  );
});

export default CenterScenario;
