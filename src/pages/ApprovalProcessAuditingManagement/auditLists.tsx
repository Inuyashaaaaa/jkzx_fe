import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { Button, message, Row, Drawer, Col, Icon, Popconfirm, Input } from 'antd';
import React, { PureComponent } from 'react';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import Operation from './Operation';
import styles from './auditing.less';

class AuditLists extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    auditingList: [],
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchList();
  };

  public fetchList = async () => {
    this.setState({
      loading: true,
    });

    const auditingList = [
      {
        name: '风控审批组',
        id: 1,
        editable: false,
      },
      {
        name: '客户审批组',
        id: 2,
        editable: false,
      },
      {
        name: '交易审批组',
        id: 3,
        editable: false,
      },
    ];

    this.setState({
      auditingList,
    });
  };

  confirm = param => () => {
    let newList = [];
    const auditingList = this.state.auditingList.forEach(item => {
      if (item.id !== param.id) {
        newList.push(item);
      }
    });
    this.setState({
      auditingList: newList,
    });
  };

  onEdit = param => () => {
    const auditingList = this.state.auditingList.map(item => {
      if (item.id === param.id) {
        item.editable = !param.editable;
      }
      return item;
    });
    this.setState({
      auditingList,
    });
  };

  onAdd = () => {
    const newItem = [
      {
        name: '',
        id: Math.random(),
        editable: true,
      },
    ];
    let { auditingList } = this.state;
    auditingList = auditingList.concat(newItem);
    console.log(auditingList);
    this.setState({
      auditingList,
    });
  };

  onBlur = (e, param) => {
    const auditingList = this.state.auditingList.map(item => {
      if (item.id === param.id) {
        item.name = e.target.value;
        item.editable = !param.editable;
      }
      return item;
    });
    this.setState({
      auditingList,
    });
  };

  public render() {
    return (
      <ul>
        {this.state.auditingList.map((item, index) => {
          return (
            <li key={index} className={styles.listItem}>
              <span className={styles.value}>
                {!item.editable ? (
                  item.name
                ) : (
                  <Input
                    placeholder="审批组名称"
                    defaultValue={item.name}
                    onBlur={e => this.onBlur(e, item)}
                  />
                )}
              </span>
              <span className={styles.icon}>
                <Icon type="edit" onClick={this.onEdit(item)} />
                <Popconfirm
                  title="确认删除此审批组"
                  onConfirm={this.confirm(item)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Icon type="minus-circle" />
                </Popconfirm>
                <Icon type="plus-circle" onClick={this.onAdd} />
              </span>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default AuditLists;
