import {
  wkApproveGroupCreate,
  wkApproveGroupDelete,
  wkApproveGroupModify,
} from '@/services/auditing';
import { Button, Icon, Input, Modal, notification, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import styles from './AuditGourpLists.less';

class AuditLists extends PureComponent {
  public state = {
    approveGroupList: [],
    visible: false,
    approveGroupName: '',
    description: '',
    approveGroupId: '',
  };

  constructor(props) {
    super(props);
  }

  public componentWillReceiveProps = nextProps => {
    const { approveGroupList } = nextProps;
    this.setState({
      approveGroupList,
    });
  };

  public confirm = param => async () => {
    const { error } = await wkApproveGroupDelete({
      approveGroupId: param.approveGroupId,
      approveGroupName: param.approveGroupName,
    });
    const { message } = error;
    if (error) {
      return;
    } else {
      const newList = [];
      const approveGroupList = this.state.approveGroupList.filter(
        item => item.approveGroupId !== param.approveGroupId
      );

      this.state.approveGroupList.forEach(item => {
        if (item.approveGroupId !== param.approveGroupId) {
          newList.push(item);
        }
      });
      this.setState({
        approveGroupList,
      });
      this.changeGroupList();

      notification.success({
        message: `删除成功`,
        description: message,
      });
    }
  };

  public onEdit = param => () => {
    const approveGroupList = this.state.approveGroupList.map(item => {
      if (item.approveGroupId === param.approveGroupId) {
        item.editable = !param.editable;
      }
      return item;
    });
    this.setState(
      {
        approveGroupList,
      },
      () => {
        this.changeGroupList();
      }
    );
  };

  public onAdd = () => {
    let blockGroupName = false;
    let { approveGroupList } = this.state;
    approveGroupList.forEach(item => {
      if (!item.approveGroupId) {
        blockGroupName = true;
      }
    });
    if (blockGroupName) return;

    const newItem = [
      {
        approveGroupName: '',
        approveGroupId: '',
        editable: true,
        usernameList: [],
      },
    ];
    approveGroupList = approveGroupList.concat(newItem);
    this.setState(
      {
        approveGroupList,
      },
      () => {
        this.changeGroupList();
      }
    );
  };

  public showModal = param => {
    if (param) {
      this.setState({
        approveGroupId: param.approveGroupId,
        approveGroupName: param.approveGroupName,
        description: param.description,
      });
    }
    this.setState({
      visible: true,
    });
  };

  public handleOk = async e => {
    if (this.state.approveGroupId) {
      const { data, error } = await wkApproveGroupModify({
        approveGroupId: this.state.approveGroupId,
        approveGroupName: this.state.approveGroupName,
        description: this.state.description,
      });
      const { message } = error;
      if (error) {
        return;
      } else {
        notification.success({
          message: `编辑成功`,
          description: message,
        });
      }

      const approveGroupList = this.state.approveGroupList.map(item => {
        if (item.approveGroupId === this.state.approveGroupId) {
          item.approveGroupName = data.approveGroupName;
          item.approveGroupId = data.approveGroupId;
          item.description = data.description;
        }
        return item;
      });
      this.setState(
        {
          approveGroupList,
          visible: false,
          approveGroupId: '',
          approveGroupName: '',
          description: '',
        },
        () => {
          this.changeGroupList();
        }
      );
      return;
    }
    const { data, error, raw } = await wkApproveGroupCreate({
      approveGroupName: this.state.approveGroupName,
      description: this.state.description,
    });
    const { message } = error;
    if (error) {
      return;
    } else {
      notification.success({
        message: `创建成功`,
        description: message,
      });
      let { approveGroupList } = this.state;
      approveGroupList = data;
      this.setState(
        {
          visible: false,
          approveGroupList,
        },
        () => {
          this.changeGroupList();
        }
      );
    }
  };

  public handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public changeGroupList = () => {
    this.props.handleGroupList(this.state.approveGroupList);
  };

  public handleInput = e => {
    if (e.target.name === 'approveGroupName') {
      this.setState({
        approveGroupName: e.target.value,
      });
    } else {
      this.setState({
        description: e.target.value,
      });
    }
  };

  public handleMenber = param => {
    if (!param) return;
    this.setState({
      indexGroupId: param.approveGroupId,
    });
    this.props.handleMenber(param);
  };

  public render() {
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        {this.state.approveGroupList && this.state.approveGroupList.length ? (
          <ul style={{ padding: '0 15px 15px 15px' }}>
            {this.state.approveGroupList.map((item, index) => {
              return (
                <li key={index} className={styles.listItem}>
                  <a
                    className={
                      item.approveGroupId === this.state.indexGroupId
                        ? styles.background
                        : styles.value
                    }
                    onClick={() => this.handleMenber(item)}
                  >
                    {item.approveGroupName}
                  </a>
                  <span className={styles.icon}>
                    <Icon type="edit" onClick={() => this.showModal(item)} />
                    <Popconfirm
                      title="确认删除此审批组"
                      onConfirm={this.confirm(item)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Icon type="minus-circle" />
                    </Popconfirm>
                  </span>
                </li>
              );
            })}
            <li className={styles.listItem}>
              <Button
                type="dashed"
                style={{ width: '100%', border: '1px dashed #ccc', borderRadius: '8px' }}
                onClick={this.showModal}
              >
                新建审批组
              </Button>
            </li>
          </ul>
        ) : (
          <Button className={styles.center} type="primary" onClick={this.showModal}>
            新建审批组
          </Button>
        )}
        <Modal
          title="创建/编辑审批组"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p className={styles.modelInput}>
            <span>名称:</span>
            <Input
              onChange={this.handleInput}
              value={this.state.approveGroupName}
              name="approveGroupName"
            />
          </p>
          <p className={styles.modelInput}>
            <span>描述:</span>
            <Input onChange={this.handleInput} value={this.state.description} name="description" />
          </p>
        </Modal>
      </div>
    );
  }
}

export default AuditLists;
