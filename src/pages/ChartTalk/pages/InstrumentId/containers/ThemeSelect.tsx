import styled from 'styled-components';
import React, { memo } from 'react';
import { Select } from 'antd';
import classnames from 'classnames';
import styles from './ThemeSelect.less';

// eslint-disable-next-line
const imgPath = require('../assets/4.png');

const ThemeSelectWrap = styled.div`
  .ant-select-selection {
    width: 200px;
    border: 1px solid #05507b;
    border-radius: 3px;
    background: transparent;
    &:hover {
      border-color: #01c7d1;
    }
    &:focus {
      box-shadow: none;
    }
  }
  .ant-select-selection__placeholder {
    font-weight: 400;
    color: #f5faff;
  }
  .ant-select-selection-selected-value {
    color: #00e8e8;
  }
`;

const ThemeSelect = memo(props => {
  const { dropdownClassName } = props;
  return (
    <ThemeSelectWrap>
      <Select
        {...props}
        dropdownClassName={classnames(dropdownClassName, styles.scope)}
        suffixIcon={
          <img
            style={{ width: 14, height: 14, position: 'relative', top: -1 }}
            src={imgPath}
            alt=""
          />
        }
      ></Select>
    </ThemeSelectWrap>
  );
});

export default ThemeSelect;
