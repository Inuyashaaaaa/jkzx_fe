import React, { memo, useRef, useState } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import BoxFigure from './BoxFigure';
import VolTable from './VolTable';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import moment from 'moment';

const Box = props => {
  const [DateData, setDateData] = useState(moment('2019-08-08'));
  const { loading, reportDate, dispatch } = props;

  const setLoading = data => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        loading: data,
      },
    });
  };

  const setReportDate = data => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        reportDate: data,
      },
    });
  };

  return (
    <div style={{ border: '1px solid #00E8E8', padding: '15px 50px' }}>
      <Row type="flex" justify="start" align="middle" gutter={12}>
        <Col>
          <ThemeDatePicker
            onChange={pDate => setDateData(pDate)}
            value={DateData}
            allowClear={false}
          ></ThemeDatePicker>
        </Col>
        <Col>
          <ThemeButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              setReportDate(DateData);
            }}
            type="primary"
          >
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
    reportDate: state.centerUnderlying.reportDate,
  }))(Box),
);
