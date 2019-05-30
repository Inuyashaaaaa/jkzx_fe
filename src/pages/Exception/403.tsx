import Exception from '@/containers/Exception';
import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';

const Exception403 = () => (
  <Exception
    type="403"
    desc={formatMessage({ id: 'app.exception.description.403' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception403;
