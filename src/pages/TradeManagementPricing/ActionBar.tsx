import { LEG_ENV } from '@/constants/legs';
import { BOOKING_FROM_PRICING } from '@/constants/trade';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import {
  createLegDataSourceItem,
  convertTradePositions,
  convertPricingHistoryTradePositions,
} from '@/services/pages';
import { ILeg } from '@/types/leg';
import { Affix, Button, Col, Input, Modal, Row, Select, notification } from 'antd';
import _ from 'lodash';
import React, { memo, useState } from 'react';
import router from 'umi/router';
import './index.less';
import { quotePrcCreate } from '@/services/trade-service';
import {
  TRADESCOL_FIELDS,
  COMPUTED_LEG_FIELDS,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import { Form2 } from '@/components';
import BigNumber from 'bignumber.js';

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
  } = props;

  const onPricingEnvSelectChange = val => {
    setCurPricingEnv(val);
    tableData.forEach(item => fetchDefaultPricingEnvData(item, true));
  };

  const [affix, setAffix] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [comment, setComment] = useState('');

  return (
    <Affix offsetTop={0} onChange={affix => setAffix(affix)}>
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
              isPricing={true}
              key="create"
              handleAddLeg={(leg: ILeg) => {
                if (!leg) return;

                setTableData(pre =>
                  pre.concat({
                    ...createLegDataSourceItem(leg, LEG_ENV.PRICING),
                    ...leg.getDefaultData(LEG_ENV.PRICING),
                  })
                );
              }}
            />
          </Col>
          <Col style={{ marginLeft: 15 }}>定价环境:</Col>
          <Col style={{ marginLeft: 10, width: 400 }}>
            <Input.Group compact={true}>
              <Select
                loading={curPricingEnv === null}
                onChange={onPricingEnvSelectChange}
                value={curPricingEnv}
                style={{ width: 200 }}
              >
                {pricingEnvironmentsList.map(item => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
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
            disabled={_.isEmpty(tableData)}
            key="历史试定价"
            type="primary"
            onClick={() => {
              router.push({
                pathname: '/trade-management/pricing-management',
              });
            }}
          >
            历史试定价
          </Button>
        </Button.Group>
      </Row>
      <Modal
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
              Form2.getFieldsValue(_.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]))
            ),
            LEG_ENV.PRICING
          );

          const { error, data } = await quotePrcCreate({
            quotePrc: {
              pricingEnvironmentId: curPricingEnv,
              comment,
              quotePositions: positions.map((position, index) => {
                return {
                  ...position,
                  ..._.mapValues(
                    Form2.getFieldsValue(_.pick(tableData[index], TRADESCOL_FIELDS)),
                    (val, key) => {
                      if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                        return val;
                      }
                      return val ? new BigNumber(val).multipliedBy(0.01).toNumber() : val;
                    }
                  ),
                };
              }),
            },
          });

          if (error) return;

          setSaveModalVisible(false);

          notification.success({
            message: '保存记录成功',
          });
        }}
      >
        <p>保存当前的试定价要素以便快速复用</p>
        <Input.TextArea
          value={comment}
          onChange={event => setComment(event.target.value)}
          placeholder="请输入备注信息（可选）"
        />
      </Modal>
    </Affix>
  );
});

export default ActionBar;
