import React, { memo, useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Col, Row, notification, Icon } from 'antd';
import moment from 'moment';
import FormItem from 'antd/lib/form/FormItem';
import BoxFigure from './BoxFigure';
import VolTable from './VolTable';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import FormItemWrapper from '@/containers/FormItemWrapper';
import { getImpliedVolReport } from '@/services/terminal';
import styles from '../ImpliedVolatility/index.less';

const Box = props => {
  const [dateData, setDateData] = useState(moment().subtract(1, 'd'));
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
    const { error, data = [] } = rsp;
    if (rsp.error) return;
    if (!data.length) {
      notification.info({
        message: (
          <div style={{ fontSize: '14px', color: '#fff' }}>
            没有可用数据
            {/* <Divider type="vertical" style={{ background: '#00E8E8' }} />
            <a style={{ color: '#00E8E8' }} href="/system-settings/operation-log?activeKey=error">
              查看详情
            </a> */}
          </div>
        ),
        // description,
        className: styles.notificationWarp,
        icon: <Icon type="exclamation-circle" style={{ color: '#00E8E8' }} />,
      });
    }
    setVolReport(data);
  };

  useEffect(() => {
    if (props.instrumentId) {
      fetch();
    }
  }, [props.instrumentId]);

  return (
    <div style={{ border: '1px solid #05507b', padding: '15px 15px' }}>
      <Row type="flex" justify="start" align="middle" gutter={12}>
        <Col>
          <FormItemWrapper>
            <FormItem label="日期" style={{ fontSize: 16 }}>
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
