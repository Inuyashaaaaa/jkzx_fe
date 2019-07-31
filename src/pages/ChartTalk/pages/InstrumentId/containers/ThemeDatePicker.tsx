import styled from 'styled-components';
import React, { memo } from 'react';
import { Select, DatePicker } from 'antd';
import classnames from 'classnames';
import styles from './ThemeDatePicker.less';

// eslint-disable-next-line
const imgPath = require('../assets/3.png');

const ThemeDatePickerWrap = styled.div`
  .ant-calendar-picker-input.ant-input {
    border: 1px solid #05507b;
    background: transparent;
    border-radius: 3px;
  }
  .ant-calendar-range-picker-separator {
    color: #00e8e8;
  }
  .ant-calendar-picker-input,
  .ant-calendar-input {
    color: #00e8e8;
    &::-webkit-input-placeholder {
      color: #f5faff;
    }
  }
  .ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: #01c7d1;
  }
  .ant-calendar-picker:focus .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: #01c7d1;
    box-shadow: none;
  }
`;

const ThemeDatePicker = memo(props => {
  const { dropdownClassName } = props;
  return (
    <ThemeDatePickerWrap>
      <DatePicker
        {...props}
        dropdownClassName={classnames(dropdownClassName, styles.scope)}
        suffixIcon={<img src={imgPath} alt="" />}
      ></DatePicker>
    </ThemeDatePickerWrap>
  );
});

export default ThemeDatePicker;
