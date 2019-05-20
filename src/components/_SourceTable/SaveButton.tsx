import { Button } from 'antd';
import React, { PureComponent } from 'react';

class SaveButton extends PureComponent<any> {
  public render() {
    const { countedEditable, valueChangedEvent, saveLoading, onBackAction, onSave } = this.props;

    return (
      countedEditable && [
        <Button
          key="save"
          type="primary"
          disabled={valueChangedEvent.length <= 0}
          onClick={onSave}
          loading={saveLoading}
        >
          保存
        </Button>,
        <Button
          key="back"
          type="primary"
          disabled={valueChangedEvent.length <= 0}
          onClick={onBackAction}
        >
          回 撤{!!valueChangedEvent.length && `(${valueChangedEvent.length})`}
        </Button>,
      ]
    );
  }
}

export default SaveButton;
