import React, { memo } from 'react'
import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import classnames from 'classnames'
import styles from './index.less'

interface ThemeButtonGroupBaseProps {
  onConfirm: ((event: React.FormEvent<any>) => void) | undefined
  onReset: ((event: React.FormEvent<any>) => void) | undefined
  confirmText: string
  resetText: string
}

export type ThemeButtonGroupProps = ThemeButtonGroupBaseProps & ButtonProps

const ThemeButtonGroup = memo<ThemeButtonGroupProps>(props => {
  const { className, onConfirm, onReset, confirmText, resetText, ...restProps } = props
  return (
    <div className={classnames(className, styles.scope)}>
      <Button {...restProps}
        className="confirm-btn"
        onClick={onConfirm}
      >{confirmText}</Button>
      <Button {...restProps}
        className="reset-btn"
        onClick={onReset}
      >{resetText}</Button>
    </div>
  )
})

export default ThemeButtonGroup
