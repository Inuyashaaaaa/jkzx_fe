import React from 'react';
import { Tooltip, Row, Icon } from 'antd';
import multi from 'classnames';
import styles from '../index.less';

const HeaderCellContent = ({ children, dataSourceItem, lightRowId, isHoverCurRow, ...rest }) => {
  return (
    <Tooltip trigger={['hover']} title={dataSourceItem.$title} {...rest}>
      <div
        className={multi(styles.headerCell, {
          [styles.light]: lightRowId === dataSourceItem.id,
          [styles.lightTop]: isHoverCurRow,
        })}
      >
        <Row style={{ width: '100%' }} type="flex" align="middle" justify="space-between">
          {children}
        </Row>
      </div>
    </Tooltip>
  );
};

const HeaderCell = headerCellProps => {
  const { dataSourceItem, rowMenu } = headerCellProps;
  const hideRowMenu = rowMenu === false;
  return dataSourceItem.$title.length > 7 ? (
    <HeaderCellContent {...headerCellProps}>
      <div>
        {dataSourceItem.$title.slice(0, 7)}
        {'...'}
      </div>
      {!hideRowMenu && <Icon type="bars" />}
    </HeaderCellContent>
  ) : (
    <HeaderCellContent {...headerCellProps}>
      {dataSourceItem.$title}
      {!hideRowMenu && <Icon type="bars" />}
    </HeaderCellContent>
  );
};

export default HeaderCell;
