import React, { PureComponent, memo } from 'react';
import { Button } from 'antd';

const DefaultFooter = memo<any>(props => {
  const {
    submitable,
    submitLoading,
    submitText,
    resetable,
    resetLoading,
    resetText,
    onSubmitButtonClick,
    onResetButtonClick,
    submitButtonProps,
    resetButtonProps,
  } = props;
  return (
    <Button.Group>
      {!!submitable && (
        <Button
          // htmlType="submit"
          type="primary"
          {...submitButtonProps}
          loading={submitLoading}
          onClick={onSubmitButtonClick}
        >
          {submitText}
        </Button>
      )}
      {!!resetable && (
        <Button {...resetButtonProps} onClick={onResetButtonClick} loading={resetLoading}>
          {resetText}
        </Button>
      )}
    </Button.Group>
  );
});

export default DefaultFooter;
