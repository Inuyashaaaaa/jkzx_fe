import React, { PureComponent, memo, useEffect, useState } from 'react';
import { Select, Row, Col, notification, Icon } from 'antd';
import { connect } from 'dva';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import ThemeSelect from '@/containers/ThemeSelect';
import { mktInstrumentSearch } from '@/services/market-data-service';
import FormItemWrapper from '@/containers/FormItemWrapper';
import styles from './Body/ImpliedVolatility/index.less';

const Header = props => {
  const { instrumentId, dispatch, activeKey, instrumentIds } = props;

  return (
    <Row>
      <Col>
        <FormItemWrapper>
          <FormItem label="标的物" style={{ fontSize: 16 }}>
            {activeKey === '3' ? (
              <ThemeSelect
                onChange={val => {
                  if (val.length > 10) {
                    notification.error({
                      message: (
                        <div style={{ fontSize: '14px', color: '#fff' }}>标的物选择上限为10个</div>
                      ),
                      className: styles.notificationWarp,
                      icon: <Icon type="exclamation-circle" style={{ color: '#00E8E8' }} />,
                    });
                    return;
                  }
                  dispatch({
                    type: 'centerUnderlying/setState',
                    payload: {
                      instrumentIds: val,
                    },
                  });
                }}
                style={{ minWidth: 200 }}
                value={instrumentIds}
                placeholder="标的物"
                fetchOptionsOnSearch
                showSearch
                mode="multiple"
                allowClear
                options={async (value: string) => {
                  const { data, error } = await mktInstrumentSearch({
                    instrumentIdPart: _.toUpper(value),
                    excludeOption: true,
                  });
                  if (error) return [];
                  return data
                    .sort()
                    .slice(0, 50)
                    .map(item => ({
                      label: item,
                      value: item,
                    }));
                }}
              ></ThemeSelect>
            ) : (
              <ThemeSelect
                onChange={val =>
                  dispatch({
                    type: 'centerUnderlying/setState',
                    payload: {
                      instrumentId: val,
                    },
                  })
                }
                value={instrumentId}
                placeholder="标的物"
                style={{ minWidth: 200 }}
                fetchOptionsOnSearch
                showSearch
                options={async (value: string) => {
                  const { data, error } = await mktInstrumentSearch({
                    instrumentIdPart: _.toUpper(value),
                    excludeOption: true,
                  });
                  if (error) return [];
                  return data
                    .sort()
                    .slice(0, 50)
                    .map(item => ({
                      label: item,
                      value: item,
                    }));
                }}
              ></ThemeSelect>
            )}
          </FormItem>
        </FormItemWrapper>
      </Col>
    </Row>
  );
};

export default memo(
  connect(state => ({
    instrumentId: state.centerUnderlying.instrumentId,
    activeKey: state.centerUnderlying.activeKey,
    instrumentIds: state.centerUnderlying.instrumentIds,
  }))(Header),
);
