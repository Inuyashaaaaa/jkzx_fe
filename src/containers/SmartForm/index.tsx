import React, { PureComponent, memo, useState } from 'react';
import { Form2 } from '..';
import { IFormProps } from '../type';
import { Button } from 'antd';
import { FormCreateOption } from 'antd/lib/form';

export interface ISmartFormProps extends IFormProps {
  spread?: number;
  collapse?: boolean;
  defaultCollapse?: boolean;
  onCollapseChange?: (collapse?: boolean) => void;
}

const SmartForm = memo<ISmartFormProps & FormCreateOption<IFormProps>>(props => {
  const {
    columns,
    spread,
    collapse: pCollapse,
    defaultCollapse = true,
    submitButtonProps,
    resetButtonProps,
    onSubmitButtonClick,
    onResetButtonClick,
    submitLoading,
    resetLoading,
    submitText = '提 交',
    resetText = '重 置',
    submitable = true,
    resetable = true,
    dataSource = {},
    onCollapseChange,
    ...rest
  } = props;

  const [collapse, setCollapse] = useState(defaultCollapse);
  const useCollapse = pCollapse == null ? collapse : pCollapse;

  const hasSpread = spread != null && spread > 0;
  const [useColumns, setUseColumns] = useState(useCollapse ? columns.slice(0, spread) : columns);

  return (
    <Form2
      {...rest}
      dataSource={dataSource}
      columns={hasSpread ? useColumns : columns}
      footer={
        <Button.Group>
          {!!submitable && (
            <Button
              // htmlType="submit"
              type="primary"
              {...submitButtonProps}
              loading={submitLoading}
              onClick={event => {
                return (
                  onSubmitButtonClick &&
                  onSubmitButtonClick({
                    dataSource,
                    domEvent: event,
                  })
                );
              }}
            >
              {submitText}
            </Button>
          )}
          {!!resetable && (
            <Button
              {...resetButtonProps}
              onClick={event => {
                return (
                  onResetButtonClick &&
                  onResetButtonClick({
                    dataSource,
                    domEvent: event,
                  })
                );
              }}
              loading={resetLoading}
            >
              {resetText}
            </Button>
          )}
          {hasSpread && (
            <Button
              type="link"
              onClick={() => {
                const next = !useCollapse;

                if (onCollapseChange) {
                  onCollapseChange(next);
                }

                setCollapse(next);
                setUseColumns(next ? columns.slice(0, spread) : columns);
              }}
            >
              {useCollapse ? '展开' : '收起'}
            </Button>
          )}
        </Button.Group>
      }
    />
  );
});

export default SmartForm;
