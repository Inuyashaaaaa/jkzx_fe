import React, { PureComponent, memo, useEffect, useState } from 'react';
import { Select, Row, Col } from 'antd';
import { connect } from 'dva';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import ThemeSelect from '@/containers/ThemeSelect';
import { mktInstrumentSearch } from '@/services/market-data-service';
import FormItemWrapper from '@/containers/FormItemWrapper';

const Header = props => {
  const { instrumentId, dispatch, activeKey, instrumentIds } = props;
  const [instrumentIdArr, setInstrumentIdArr] = useState([]);

  const fetchArray = async () => {
    const { data, error } = await mktInstrumentSearch({
      instrumentIdPart: '',
      excludeOption: true,
    });
    if (error) return;
    setInstrumentIdArr(data.sort());
  };

  useEffect(() => {
    fetchArray();
  }, []);

  useEffect(() => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        instrumentId: _.get(instrumentIdArr, '[0]'),
      },
    });
  }, [instrumentIdArr]);

  return (
    <Row>
      <Col>
        <FormItemWrapper>
          <FormItem label="标的物">
            {activeKey === '3' ? (
              <ThemeSelect
                onChange={val =>
                  dispatch({
                    type: 'centerUnderlying/setState',
                    payload: {
                      instrumentIds: val,
                    },
                  })
                }
                style={{ minWidth: 200 }}
                value={instrumentIds}
                placeholder="标的物"
                fetchOptionsOnSearch
                showSearch
                mode="multiple"
                options={async (value: string) => {
                  const { data, error } = await mktInstrumentSearch({
                    instrumentIdPart: value,
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
                  // const { data, error } = await mktInstrumentSearch({
                  //   instrumentIdPart: value,
                  // });
                  const { data, error } = await mktInstrumentSearch({
                    instrumentIdPart: value,
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
