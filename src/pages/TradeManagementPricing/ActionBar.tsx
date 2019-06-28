/* eslint-disable */
import {
  COMPUTED_LEG_FIELDS,
  TRADESCOLDEFS_LEG_FIELD_MAP,
  TRADESCOL_FIELDS,
} from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { BOOKING_FROM_PRICING } from '@/constants/trade';
import { Form2, Select } from '@/containers';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import { convertPricingHistoryTradePositions, createLegDataSourceItem } from '@/services/pages';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { quotePrcCreate } from '@/services/trade-service';
import { ILeg } from '@/types/leg';
import { Affix, Alert, Button, Col, Drawer, Input, Modal, notification, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { memo, useState } from 'react';
import router from 'umi/router';
import HistoryPanel from './HistoryPanel';
import './index.less';

const ActionBar = memo<any>(props => {
  const {
    setTableData,
    curPricingEnv,
    setCurPricingEnv,
    tableData,
    pricingEnvironmentsList,
    fetchDefaultPricingEnvData,
    testPricing,
    pricingLoading,
    tableEl,
  } = props;

  const onPricingEnvSelectChange = val => {
    setCurPricingEnv(val);
    tableData.forEach(item => fetchDefaultPricingEnvData(item, true));
  };

  const [affix, setAffix] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [counterPartyCode, setCounterPartyCode] = useState(undefined);
  const [visible, setVisible] = useState(false);

  return (
    <Affix offsetTop={0} onChange={affixs => setAffix(affixs)}>
      <Row
        type="flex"
        justify="space-between"
        style={{
          background: '#fff',
          borderBottom: affix ? '1px solid #ddd' : 'none',
          padding: affix ? '20px 0' : 0,
        }}
      >
        <Row type="flex" align="middle">
          <Col>
            <MultilLegCreateButton
              isPricing
              env={LEG_ENV.PRICING}
              key="create"
              handleAddLeg={(leg: ILeg) => {
                if (!leg) return;

                setTableData(pre =>
                  pre.concat({
                    ...createLegDataSourceItem(leg, LEG_ENV.PRICING),
                    ...leg.getDefaultData(LEG_ENV.PRICING),
                  }),
                );
              }}
            />
          </Col>
          <Col style={{ marginLeft: 15 }}>定价环境:</Col>
          <Col style={{ marginLeft: 10, width: 400 }}>
            <Input.Group compact>
              <Select
                loading={curPricingEnv === null}
                onChange={onPricingEnvSelectChange}
                value={curPricingEnv}
                style={{ width: 200 }}
              >
                {pricingEnvironmentsList.map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
              <Button loading={pricingLoading} key="试定价" type="primary" onClick={testPricing}>
                试定价
              </Button>
            </Input.Group>
          </Col>
        </Row>
        <Button.Group>
          <Button
            disabled={_.isEmpty(tableData)}
            key="转换簿记"
            type="primary"
            onClick={() => {
              router.push({
                pathname: '/trade-management/booking',
                query: {
                  from: BOOKING_FROM_PRICING,
                },
              });
            }}
          >
            转换簿记
          </Button>
          <Button
            disabled={_.isEmpty(tableData)}
            key="保存试定价"
            type="primary"
            onClick={() => {
              setSaveModalVisible(true);
            }}
          >
            保存试定价
          </Button>
          <Button
            key="历史试定价"
            onClick={() => {
              setVisible(true);
            }}
          >
            历史试定价
          </Button>
        </Button.Group>
      </Row>
      <Modal
        title="保存试定价"
        confirmLoading={saveLoading}
        visible={saveModalVisible}
        onCancel={() => {
          setSaveModalVisible(false);
        }}
        onOk={async () => {
          if (!curPricingEnv) {
            notification.error({
              message: '定价环境不能为空',
            });
            return;
          }

          const positions = convertPricingHistoryTradePositions(
            tableData.map(item =>
              Form2.getFieldsValue(_.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS])),
            ),
            LEG_ENV.PRICING,
          );

          const computedFieldsMapFieldType = values => {
            const allMuliLegColums = _.get(tableEl.current, 'columns', []);
            return _.mapValues(values, (val, fieldName) => {
              const findCol = allMuliLegColums.find(col => col.dataIndex === fieldName);
              return {
                value: val,
                unit: findCol.getUnit ? findCol.getUnit() : undefined,
              };
            });
          };

          setSaveLoading(true);
          const { error, data } = await quotePrcCreate({
            quotePrc: {
              pricingEnvironmentId: curPricingEnv,
              comment,
              counterPartyCode,
              quotePositions: positions.map((position, index) => ({
                ...position,
                ..._.mapValues(
                  Form2.getFieldsValue(_.pick(tableData[index], TRADESCOL_FIELDS)),
                  (val, key) => {
                    if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                      return val;
                    }
                    return val ? new BigNumber(val).multipliedBy(0.01).toNumber() : val;
                  },
                ),
                prcResult: computedFieldsMapFieldType(
                  Form2.getFieldsValue(_.pick(tableData[index], COMPUTED_LEG_FIELDS)),
                ),
              })),
            },
          });
          setSaveLoading(false);

          if (error) return;

          setSaveModalVisible(false);
          setComment(undefined);
          setCounterPartyCode(undefined);

          notification.success({
            message: '保存记录成功',
          });
        }}
      >
        <Alert showIcon message="保存当前的试定价要素以便快速复用" style={{ marginBottom: 20 }} />
        <FormItem label="交易对手" wrapperCol={{ span: 16 }} labelCol={{ span: 8 }}>
          <Select
            onChange={val => {
              setCounterPartyCode(val);
            }}
            value={counterPartyCode}
            style={{ minWidth: 180 }}
            fetchOptionsOnSearch
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            options={async (value: string = '') => {
              const { data, error } = await refSimilarLegalNameList({
                similarLegalName: value,
              });
              if (error) return [];
              return data.map(item => ({
                label: item,
                value: item,
              }));
            }}
          />
        </FormItem>
        <div>
          <FormItem label="备注信息" wrapperCol={{ span: 16 }} labelCol={{ span: 8 }}>
            <Input.TextArea
              value={comment}
              onChange={event => setComment(event.target.value)}
              placeholder="请输入备注信息"
            />
          </FormItem>
        </div>
      </Modal>

      <Drawer
        width={1200}
        title="历史定价管理"
        placement="right"
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
      >
        <HistoryPanel
          visible={visible}
          setTableData={setTableData}
          setVisible={setVisible}
          setCurPricingEnv={setCurPricingEnv}
        />
      </Drawer>
    </Affix>
  );
});

export default ActionBar;
