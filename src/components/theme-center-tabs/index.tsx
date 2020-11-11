import React, { memo } from 'react'
import { Tabs } from 'antd'
import { TabsProps } from 'antd/lib/tabs'
import styles from './index.less'

interface ThemeCenterTabsBaseProps {
  children: React.ReactNode
}

export type ThemeCenterTableProps = ThemeCenterTabsBaseProps & TabsProps

const ThemeCenterTabs = memo<ThemeCenterTableProps>(props => {
  const { children, ...restProps } = props
  return (
    <div className={styles.scope}>
      <Tabs {...restProps}>
        {children}
      </Tabs>
    </div>
  )
})

export default ThemeCenterTabs;
