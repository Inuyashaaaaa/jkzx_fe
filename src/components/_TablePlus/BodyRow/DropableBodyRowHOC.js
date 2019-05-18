import React from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import styles from './DropableBodyRowHOC.less';

const DropableBodyRowHOC = BaseRow => props => {
  const { copyable, removeable, onCopyRow, onRemoveRow, dropMenu, ...rest } = props;
  const menu = (
    <Menu>
      {copyable && (
        <Menu.Item onClick={onCopyRow}>
          <Icon type="copy" theme="outlined" /> 复制该行
        </Menu.Item>
      )}
      {removeable && (
        <Menu.Item onClick={onRemoveRow}>
          <Icon className={styles.danger} type="delete" theme="outlined" /> 删除该行
        </Menu.Item>
      )}
      {dropMenu}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <BaseRow {...rest} />
    </Dropdown>
  );
};

export default DropableBodyRowHOC;
