import Exception from '@/components/Exception';
import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';

const Exception500 = () => (
  <Exception
    type="500"
    desc={formatMessage({ id: 'app.exception.description.500' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception500;
