/*eslint-disable */
import styled from 'styled-components';
import React, { memo } from 'react';
import classnames from 'classnames';
import styles from './ThemeSelect.less';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

// eslint-disable-next-line
const imgPath = require('@/assets/4.png');

const removeImg = require('@/assets/6.png');

const ThemeSelectWrap = styled.div`
  .ant-select-selection {
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
    color: #7890a8;
    font-size: 16px;
  }
  .ant-select-selection-selected-value {
    color: #00e8e8;
    font-size: 16px;
  }
  .ant-select-search__field {
    color: #ffffff;
  }
  .ant-select-selection--multiple .ant-select-selection__choice {
    color: rgba(0, 232, 232, 1);
    border-color: transparent;
    border-radius: 10px;
    background-color: rgba(23, 62, 121, 1);
  }
  .ant-select-selection__clear {
    background: rgba(0, 0, 0, 0);
  }
`;

const ThemeSelect = memo<SelectProps<any>>((props) => {
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
        removeIcon={
          <img
            style={{ width: 14, height: 14, position: 'relative', top: -1 }}
            src={removeImg}
            alt=""
          />
        }
        clearIcon={
          <img
            style={{ width: 12, height: 12, position: 'relative', top: -1 }}
            src={removeImg}
            alt=""
          />
        }
      ></Select>
    </ThemeSelectWrap>
  );
});

export default ThemeSelect;
