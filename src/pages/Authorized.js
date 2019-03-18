import React from 'react';
import RenderAuthorized from '@/lib/components/Authorized';
import { getAuthority } from '@/lib/utils/authority';
import Exception403 from '@/pages/Exception/403';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => {
  return (
    <Authorized authority={children.props.route.authority} noMatch={<Exception403 />}>
      {children}
    </Authorized>
  );
};
