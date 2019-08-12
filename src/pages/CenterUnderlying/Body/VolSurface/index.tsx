import React, { memo, useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import BoxFigure from './BoxFigure';
import VolTable from './VolTable';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import moment from 'moment';
import FormItemWrapper from '@/containers/FormItemWrapper';
import FormItem from 'antd/lib/form/FormItem';
import { getImpliedVolReport } from '@/services/terminal';

const Box = props => {
  const [dateData, setDateData] = useState(moment('2019-08-08'));
  const { loading, volReport, dispatch, instrumentId } = props;

  const setLoading = data => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        loading: data,
      },
    });
  };

  const setVolReport = data => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        volReport: data,
      },
    });
  };

  const fetch = async () => {
    setLoading(true);
    const rsp = await getImpliedVolReport({
      instrumentId,
      reportDate: dateData.format('YYYY-MM-DD'),
    });
    setLoading(false);
    const { error, data = {} } = rsp;
    if (rsp.error) return;
    setVolReport(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div style={{ border: '1px solid #05507b', padding: '15px 15px' }}>
      <Row type="flex" justify="start" align="middle" gutter={12}>
        <Col>
          <FormItemWrapper>
            <FormItem label="日期">
              <ThemeDatePicker
                onChange={pDate => setDateData(pDate)}
                value={dateData}
                allowClear={false}
              ></ThemeDatePicker>
            </FormItem>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton loading={loading} onClick={() => fetch()} type="primary">
            绘制
          </ThemeButton>
        </Col>
      </Row>
      <BoxFigure></BoxFigure>
      <VolTable></VolTable>
    </div>
  );
};

export default memo(
  connect(state => ({
    loading: state.centerUnderlying.loading,
    instrumentId: state.centerUnderlying.instrumentId,
    volReport: state.centerUnderlying.volReport,
  }))(Box),
);
