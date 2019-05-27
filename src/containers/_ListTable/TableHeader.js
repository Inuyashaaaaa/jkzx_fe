import ButtonGroup from '@/containers/ButtonGroup';
import { PureStateComponent } from '@/containers/Components';
import { TableHeader as types } from '@/containers/_ListTable/types';
import StandardForm from '@/containers/_StandardForm';
import { Row } from 'antd';
import React from 'react';

const CREATE_NAME = '创建';

const CREATE_LABEL = '新建';

const SELECT_ALL_LABEL = '全选';

const NOT_SELECT_ALL_LABEL = '全取消';

class TableHeader extends PureStateComponent {
  static propTypes = types;

  state = {
    formData: {},
    visible: false,
    loading: false,
  };

  handleChange = nextField => {
    const { onChange } = this.props;
    onChange?.(nextField);
  };

  handleCreate = () => {
    const { onCreate } = this.props;
    onCreate?.();
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel?.();
  };

  handleBtnClick = event => {
    const { onSelect, onPopover, visible } = this.props;
    if (event.name === CREATE_LABEL) {
      onPopover?.(visible);
    } else {
      onSelect?.();
    }
  };

  render() {
    const {
      formItems,
      loading,
      formData,
      disableCreate,
      disableSelectAll,
      getFormNode,
      title,
      onCreate,
    } = this.props;

    return (
      <Row type="flex" justify="space-between" align="middle">
        <span>{title}</span>
        <ButtonGroup
          items={[
            ...(onCreate
              ? [
                  {
                    type: 'primary',
                    disabled: disableCreate,
                    name: CREATE_LABEL,
                    size: 'small',
                    popover: {
                      type: 'popover'.visible,
                      title: `新建${title}`,
                      content: (
                        <StandardForm
                          labelCol={8}
                          wrapperCol={16}
                          chunkSize={1}
                          items={formItems}
                          dataSource={formData}
                          onChange={this.handleChange}
                          getNode={getFormNode}
                          saveText={CREATE_NAME}
                          confirmLoading={loading}
                          onSave={this.handleCreate}
                          onCancel={this.handleCancel}
                        />
                      ),
                      trigger: 'click',
                    },
                  },
                ]
              : []),
            {
              name: disableSelectAll ? NOT_SELECT_ALL_LABEL : SELECT_ALL_LABEL,
              size: 'small',
            },
          ]}
          onClick={this.handleBtnClick}
        />
      </Row>
    );
  }
}

export default TableHeader;
