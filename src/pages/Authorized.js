import Exception403 from '@/pages/Exception/403';
import { connect } from 'dva';
import React from 'react';

export default connect(state => {
  return {
    currentUser: state.user.currentUser,
  };
})(props => {
  const { children, route = {}, currentUser = {} } = props;
  const { permissions } = currentUser;
  if (permissions && !permissions[route.name]) {
    return <Exception403 />;
  }

  return children;
});
