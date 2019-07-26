import React, { PureComponent, memo } from 'react';
import { Select, Row, Col } from 'antd';
import { connect } from 'dva';
import ThemeSelect from './containers/ThemeSelect';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';

const Header = props => {
  const { instrumentId, dispatch } = props;
  return (
    <Row type="flex" justify="start">
      <Col>
        <ThemeSelect
          onChange={val =>
            dispatch({
              type: 'chartTalkModel/setState',
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
            // const { data, error } = await mktInstrumentSearch({
            //   instrumentIdPart: value,
            // });
            const { data, error } = await mktInstrumentWhitelistSearch({
              instrumentIdPart: value,
              excludeOption: true,
            });
            if (error) return [];
            return data.slice(0, 50).map(item => ({
              label: item,
              value: item,
            }));
          }}
        ></ThemeSelect>
      </Col>
    </Row>
  );
};

export default memo(
  connect(state => ({
    instrumentId: state.chartTalkModel.instrumentId,
  }))(Header),
);
