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
import { refSimilarLegalNameListWithoutBook } from '@/services/reference-data-service';
import { queryNonGroupResource } from '@/services/tradeBooks';
import { rptSpotScenariosReportListSearch } from '@/services/report-service';
import moment from 'moment';
import useLifecycles from 'react-use/lib/useLifecycles';
import ClassicSceneTable from './ ClassicSceneTable';

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
    font-size: 16px;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const Title = styled.div`
  color: rgba(246, 250, 255, 1);
  font-weight: 400;
  font-size: 22px;
  line-height: 32px;
`;

const SamllTitle = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
  margin-bottom: 10px;
`;

const ThemeTableWrapper = styled.div`
  margin-top: 24px;
`;
const CenterScenario = memo(props => {
  const [reportFormData, setReportFormData] = useState(
    Form2.createFields({
      valuationDate: moment(),
      reportType: 'MARKET',
      underlyer: '600030.SH',
    }),
  );
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [tableColDefs, setTableColDefs] = useState([]);
  const [subNameOrBook, setSubNameOrBook] = useState([]);
  const [classicSceneTable, setClassicSceneTable] = useState(true);
  const [reportTime, setReportTime] = useState('');
  const width = 170;

  const searchForm = useRef<Form2>(null);
  const reportForm = useRef<Form2>(null);

  const colDefsMirrior = {
    delta: 'Delta',
    deltaCash: 'Delta Cash',
    gamma: 'Gamma',
    gammaCash: 'Gamma Cash',
    vega: 'Vega',
    theta: 'Theta',
    rhoR: 'Rho_R',
    pnlChange: 'Pnl',
  };

  const col = [
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
    '100',
    '101',
    '102',
    '103',
    '104',
    '105',
    '106',
    '107',
    '108',
    '109',
    '110',
  ];

  const onReportFormChange = (props, changedFields, allFields) => {
    if (changedFields.reportType && Form2.getFieldsValue(changedFields).reportType === 'MARKET') {
      return setReportFormData({
        ...reportFormData,
        ...changedFields,
        legalName: Form2.createField(undefined),
        subName: Form2.createField(undefined),
      });
    }
    setReportFormData({
      ...reportFormData,
      ...changedFields,
    });
  };

  const onSearch = async () => {
    setClassicSceneTable(!classicSceneTable);
    const [reportRsp] = await Promise.all([reportForm.current.validate()]);
    if (reportRsp.error) return;
    const reportData = _.mapValues(
      _.mapKeys(Form2.getFieldsValue(reportFormData), (val, key) => {
        if (key === 'legalName' || key === 'subName') {
          return 'subOrPartyName';
        }
        return key;
      }),
      (vals, keys) => {
        if (keys === 'valuationDate') {
          return moment(vals).format('YYYY-MM-DD');
        }
        // console.log(vals,keys,'vals')
        return vals;
      },
    );
    const formData = Form2.getFieldsValue(reportFormData);
    _.mapKeys(formData, (val, key) => {
      if (key === 'reportType' && val === 'PARTY') {
        reportData.subOrPartyName = formData.legalName;
      }
      if (key === 'reportType' && val === 'SUBSIDIARY') {
        reportData.subOrPartyName = formData.subName;
      }
    });
    setLoading(true);
    setTableLoading(true);

    const { error, data } = await rptSpotScenariosReportListSearch(reportData);
    setLoading(false);
    setTableLoading(false);

    const createdAt = _.get(data, '[0].createdAt');
    const reportDate = createdAt ? moment(createdAt).format('YYYY-MM-DD hh:mm:ss') : '';
    setReportTime(reportDate);

    if (error) return;
    if (!data.length) {
      setTableColDefs([
        {
          title: '标的物情景分析',
          dataIndex: 'greekLatter',
          width,
          onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
        },
        ...col.map(item => {
          return {
            title: `scenario_${item}%`,
            dataIndex: `scenario_${item}%`,
            width,
            onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
          };
        }),
      ]);
      setDataSource([]);
      return;
    }
    const scenarioId = data[0].scenarios
      .map(item => item.scenarioId)
      .sort((item1, item2) => {
        // console.log(item1.match(/scenario_(\d+)%/));
        const num1 = Number(item1.match(/scenario_(\d+)%/)[1]);
        const num2 = Number(item2.match(/scenario_(\d+)%/)[1]);
        return num1 - num2;
      });
    const colDef = scenarioId.map(item => ({
      title: item,
      dataIndex: item,
      align: 'right',
      render: val => val && formatNumber(val, 4),
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
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
        width,
        onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
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
            <ThemeDatePicker placeholder="" allowClear={false}></ThemeDatePicker>,
          )}
        </FormItem>
      ),
    },
    {
      title: '标的物',
      dataIndex: 'underlyer',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '标的物必填' }] })(
            <ThemeSelect
              fetchOptionsOnSearch
              showSearch
              style={{ minWidth: 200 }}
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
      title: '数据范围',
      dataIndex: 'reportType',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '数据范围必填' }] })(
            <ThemeSelect
              style={{ minWidth: 200 }}
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
              style={{ minWidth: 200 }}
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
  ];

  useLifecycles(() => {
    setTableColDefs([
      {
        title: '标的物情景分析',
        width,
        dataIndex: 'greekLatter',
      },
      ...col.map(item => {
        return { title: `scenario_${item}%`, dataIndex: `scenario_${item}%`, width };
      }),
    ]);
    onSearch();
  });

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
                  {form.getFieldDecorator({
                    rules: [{ required: true, message: '各子公司必填' }],
                  })(
                    <ThemeSelect
                      filterOption
                      showSearch
                      style={{ minWidth: 200 }}
                      key="subName"
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
                  {form.getFieldDecorator({
                    rules: [{ required: true, message: '交易对手必填' }],
                  })(
                    <ThemeSelect
                      fetchOptionsOnSearch
                      showSearch
                      style={{ minWidth: 200 }}
                      key="legalName"
                      options={async (value: string) => {
                        const { data, error } = await refSimilarLegalNameListWithoutBook({
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

  const titleTxt = reportTime ? `报告计算时间：${reportTime} ` : '';

  return (
    <>
      <Title>情景分析</Title>
      <Row type="flex" gutter={18}>
        <Col>
          <FormItemWrapper>
            <Form2
              hideRequiredMark
              ref={node => (reportForm.current = node)}
              dataSource={reportFormData}
              onFieldsChange={onReportFormChange}
              columns={reportFormControls}
              layout="inline"
              footer={false}
            ></Form2>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton onClick={onSearch} type="primary">
            确定
          </ThemeButton>
        </Col>
      </Row>
      <ThemeTableWrapper>
        <SamllTitle>{titleTxt}</SamllTitle>
        <ThemeTable
          loading={tableLoading}
          dataSource={dataSource}
          columns={tableColDefs}
          scroll={{ x: tableColDefs.length && tableColDefs.length * width }}
          pagination={false}
          rowkey="greekLatter"
        ></ThemeTable>
      </ThemeTableWrapper>
      <ClassicSceneTable
        classicSceneTable={classicSceneTable}
        valuationDate={Form2.getFieldsValue(reportFormData.valuationDate)}
        instrumentId={Form2.getFieldsValue(reportFormData.underlyer)}
        reportFormData={Form2.getFieldsValue(reportFormData)}
      />
    </>
  );
});

export default CenterScenario;
