import styled from 'styled-components';
import React, { memo, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';
// import styles from './ThemeTable.less';
import uuidv4 from 'uuid/v4';

const ThemeTableWrap = styled.div`
  width: 100%;
  .ant-table-thead > tr > th {
    background: #043269;
    color: rgba(246, 250, 255, 1);
    border: 1px solid rgba(0, 232, 232, 0.5);
    &.ant-table-column-sort {
      background: rgba(0, 232, 232, 0.1);
    }
  }
  .ant-table-tbody {
    color: #00e8e8;
  }
  tr.ant-table-row:nth-child(even) {
    background: rgba(0, 232, 232, 0.06);
  }
  .ant-table-tbody > tr > td {
    border: 1px solid rgba(0, 232, 232, 0.5);
  }
  .anticon {
    color: rgba(0, 232, 232, 0.6);
  }
  .ant-pagination-simple .ant-pagination-simple-pager input:hover {
    border-color: rgba(0, 232, 232, 1);
  }
  .ant-pagination-simple .ant-pagination-simple-pager input {
    background-color: transparent;
    border: 1px solid rgba(0, 232, 232, 0.6);
  }
  .ant-pagination-simple-pager {
    color: rgba(246, 250, 255, 1);
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: #1b77a3;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 12px;
  }
  .ant-table-tbody > tr > td {
    font-size: 20px;
  }
  .ant-table-thead > tr > th {
    font-size: 20px;
  }

  .ant-table-tbody > tr:hover > td > span {
    display: inline-block;
    transform: scale(1.1);
  }

  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    background: transparent;
  }
  .ant-table-bordered.ant-table-empty .ant-table-placeholder {
    border-color: rgba(0, 232, 232, 0.5);
  }
  .ant-table-placeholder {
    background: transparent;
    color: rgba(246, 250, 255, 1);
    border: 1px solid rgba(0, 232, 232, 0.5);
    font-size: 16px;
  }

  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters:hover {
    background: rgba(0, 232, 232, 0.1);
  }
  .ant-table-column-sorter-up,
  .ant-table-column-sorter-down {
    &.on {
      color: #05507b;
    }
    &.off {
      color: #cad9e2;
    }
  }
  .ant-table-fixed .ant-table-thead > tr > th,
  .ant-table-fixed .ant-table-tbody > tr > td {
    background: rgb(4, 50, 105);
  }
  .ant-table-thead > tr > th.ant-table-column-has-actions {
    position: static;
  }
`;

const ThemeTable = memo(props => {
  const [uuid, setUuid] = useState(uuidv4());
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const dom = document.getElementById(uuid);
    setWidth(dom.offsetWidth);
  }, []);

  const propsObj = {
    ...props,
    scroll: {
      ...props.scroll,
      x: width < _.get(props, 'scroll.x') ? _.get(props, 'scroll.x') : undefined,
    },
  };

  return (
    <ThemeTableWrap style={props.wrapStyle}>
      <Table {...propsObj} id={uuid}></Table>
    </ThemeTableWrap>
  );
});

export default ThemeTable;
