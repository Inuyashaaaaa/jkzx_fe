import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styled from 'styled-components';
import CenterException from '@/containers/CenterException';

export default connect(state => ({
  currentUser: state.user.currentUser,
}))(props => {
  const { children, route = {}, currentUser = {} } = props;
  const { permissions } = currentUser;
  if (permissions && !permissions[route.name]) {
    return (
      <CenterException
        type="403"
        desc={formatMessage({ id: 'app.exception.description.403' })}
        linkElement={Link}
        backText={formatMessage({ id: 'app.exception.back' })}
      />
    );
  }

  return children;
});
