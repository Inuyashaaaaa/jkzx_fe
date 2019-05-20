import { Tabs } from 'antd';
import React, { memo } from 'react';

const TabHeader = memo<any>(props => {
  const { activeKey, onChange, tabList = [] } = props;
  return (
    <Tabs activeKey={activeKey} onChange={onChange}>
      {tabList.map(item => {
        return <Tabs.TabPane tab={item.tab} key={item.key} />;
      })}
    </Tabs>
  );
});

export default TabHeader;
