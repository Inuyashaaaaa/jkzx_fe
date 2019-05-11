import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import _ from 'lodash';
import React, { memo, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';

const useDataTableState = (initial: { service?: any } = {}) => {
  const { service } = initial;
  const [loading, setLoading] = useState(false);
  useLifecycles(() => {
    setLoading(true);
    service();
    setLoading(false);
  });

  return {
    loading,
  };
};

const DataTable = memo<
  TableProps<any> & {
    service?: any;
  }
>(props => {
  const { dataSource, scroll } = props;
  const { loading } = useDataTableState();
  return (
    <Table
      size={'small'}
      {...props}
      scroll={_.isEmpty(dataSource) ? undefined : scroll}
      loading={loading}
    />
  );
});

export default DataTable;
