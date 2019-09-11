import React, { useEffect } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import Exception from '@/containers/Exception';

const Jumping = props => {
  useEffect(() => {
    const { dispatch } = props;
    const { token, pathname } = props.location.query || {};
    if (token) {
      dispatch({
        type: 'login/login',
        payload: {
          defaultRedirect: pathname,
          loginUrl: '/user/login',
          token,
        },
      });
    }
  }, []);

  return <div style={{ textAlign: 'center', marginTop: '50px' }}>自动登陆中，请稍后</div>;
};

export default connect(() => {})(Jumping);
