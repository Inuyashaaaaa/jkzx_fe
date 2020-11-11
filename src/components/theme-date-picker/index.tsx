import React, { memo } from 'react'
import { DatePicker } from 'antd'
import { DatePickerProps } from 'antd/lib/date-picker'
import classnames from 'classnames'
import dropDownStyles from './drop-down.less'
import styles from './index.less'

interface ThemeCenterDatePickerBaseProps {
  datePickLabel?: string
}

export type ThemeCenterDatePickerProps = ThemeCenterDatePickerBaseProps & DatePickerProps

const ThemeCenterDatePicker = memo<ThemeCenterDatePickerProps>(props => {
  const { datePickLabel, className, ...restProps } = props
  return (
    <div className={classnames(className, styles.scope)}>
      <span className="date-picker-label">{datePickLabel}</span>
      <DatePicker
        {...restProps}
        allowClear={false}
        dropdownClassName={dropDownStyles.scope}
      />
    </div>
  )
})

export default ThemeCenterDatePicker


