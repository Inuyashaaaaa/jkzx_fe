import React, { memo, forwardRef } from 'react';
import { Table2 } from '..';
import { Table } from 'antd';
import { ITableProps } from '@/components/type';
import _ from 'lodash';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/component';
import { showTotal } from '@/tools/component';
import Loading from '../Loading';

const SmartTable = memo<ITableProps & { ref?: any; antd?: boolean }>(
  forwardRef((props, ref) => {
    const { antd, ...restProps } = props;
    const defaultProps: ITableProps = {
      bordered: true,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal,
        pageSize: PAGE_SIZE,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
      },
      size: 'small',
    };

    return React.createElement(antd ? Table : Table2, {
      ...defaultProps,
      ...restProps,
      pagination:
        restProps.pagination !== false
          ? {
              ...defaultProps.pagination,
              ...restProps.pagination,
            }
          : restProps.pagination,
      loading: {
        spinning: !!restProps.loading,
        indicator: <Loading />,
      },
      ref,
    });
  })
);

export default SmartTable;
