import React, { memo } from 'react'
import { Input } from 'antd'
import { InputProps } from 'antd/lib/input'
import classnames from 'classnames'
import styles from './index.less'


interface ThemeInputBaseProps {
  inputLabel?: string
}

export type ThemeInputProps = ThemeInputBaseProps & InputProps

const ThemeInput = memo<ThemeInputProps>(props => {
  const { inputLabel, className, ...restProps } = props
  return (
    <div className={classnames(className, styles.scope)}>
      <div className="input-container">
        <span className="input-label">{inputLabel}</span>
        <Input {...restProps}/>
      </div>
    </div>
  )
})

export default ThemeInput
