import React, { PureComponent } from 'react';
import { Tree, Button, Modal, notification } from 'antd';
import AuthTable from './AuthTable';
import { getUser } from '@/tools/authority';

import CommonTree from '../SystemSettingDepartment/components/CommonTree';
import CommonForm from '../SystemSettingDepartment/components/CommonForm';
import { RESOURCE_ENUM } from './constants';
import {
  modifyResource,
  createResource,
  revokeResource,
  queryResourceAuthes,
  queryRoleResourceAuthes,
  queryUserResourceAuthes,
  modifyUserResourceAuthes,
  modifyRoleResourceAuthes,
} from '@/services/resources';

import { authUserGetByName } from '@/services/user';

const { TreeNode } = Tree;

function sortResource(data) {
  if (!data) {
    return;
  }
  if (!(typeof data === 'object')) {
    return;
  }
  const { children } = data;
  if (children && children.length > 0) {
    children.sort((a, b) => {
      return a.resourceName.localeCompare(b.resourceName);
    });
    children.forEach(c => sortResource(c));
  }
}

function handleChoosed(resources, choosedId) {
  let hint = '';
  resources = Object.assign({}, resources);
  function inner(data, id) {
    if (!data || !id) {
      return;
    }
    if (!(typeof data === 'object')) {
      return;
    }
    if (data.id === id) {
      hint = data;
      data.choosedThisResource = true;
    } else {
      data.choosedThisResource = false;
    }
    const { children } = data;
    if (children && children.length > 0) {
      children.forEach(c => inner(c, id));
    }
  }
  inner(resources, choosedId);
  if (!hint && resources) {
    resources.choosedThisResource = true;
  }
  return [resources, hint];
}

function findFather(a, s) {
  let hint = {};
  function inner(all, son) {
    if (!son.parentId) {
      return;
    }
    const { children } = all;
    if (children && children.length > 0) {
      const index = children.findIndex(c => c.id === son.id);
      if (index > -1) {
        hint = all;
      } else {
        children.forEach(c => inner(c, son));
      }
    }
  }
  inner(a, s);
  return hint;
}

const styles = {
  rowLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 400,
  },
  title: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: -25,
  },
  checkWrap: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginLeft: 50,
    flexWrap: 'wrap',
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  between: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
};

export default class ResourceManagement extends PureComponent {
  constructor(props) {
    super(props);
    const { info } = props;
    this.state = {
      modalTitle: '',
      modalVisible: false,
      formItems: [],
      fromAuthManagent: info === undefined,
      resources: {},
      choosedResource: {},
    };
  }

  componentDidMount() {
    this.getResources();
    // this.resourceStore.info = this.props.info || {};
  }

  componentWillReceiveProps() {
    // this.resourceStore.info = nextProps.info || {};
    this.getResources();
  }

  getResources = async () => {
    // this.resourceAuthes = data.result;
    let { info } = this.props;
    info = info || {};
    const { type, detail } = info;
    let hintMethod = queryResourceAuthes;
    let params = {};
    switch (type) {
      case 'role':
        hintMethod = queryRoleResourceAuthes;
        params = {
          roleId: detail.id,
        };
        break;
      case 'user':
        hintMethod = queryUserResourceAuthes;
        params = {
          userId: detail.id,
        };
        break;
      default:
        break;
    }
    const res = await hintMethod(params);
    if (res && res.data) {
      sortResource(res.data);
      const { choosedResource } = this.state;
      const hint = handleChoosed(res.data, choosedResource.id);
      this.setState({
        resources: hint[0],
        choosedResource: hint[1] ? hint[1] : hint[0],
      });
    }
  };

  modifyResourceAuth = async (data, resourceId) => {
    let { info } = this.props;
    info = info || {};
    let { type, detail } = info;
    if (!type) {
      type = 'user';
      const upUserInfo = getUser() || {};
      const { username } = upUserInfo;
      const { currentUser } = this;
      if (currentUser && currentUser.username === username) {
        detail = currentUser;
      } else {
        const userInfo = await authUserGetByName({ username });
        if (userInfo.error) {
          return;
        }
        this.currentUser = (userInfo && userInfo.data) || {};
        detail = this.currentUser;
      }
    }
    let hintMethod = queryResourceAuthes;
    let params = {};
    switch (type) {
      case 'role':
        hintMethod = modifyRoleResourceAuthes;
        params = {
          roleId: detail.id,
          permissions: [
            {
              resourceId,
              resourcePermission: data,
            },
          ],
        };
        break;
      case 'user':
        hintMethod = modifyUserResourceAuthes;
        params = {
          userId: detail.id,
          permissions: [
            {
              resourceId,
              resourcePermission: data,
            },
          ],
        };
        break;
      default:
        break;
    }
    const res = await hintMethod(params);
    if (res && res.data) {
      this.getResources();
      this.$authTable.cancelLoading();
      notification.success({
        message: `更改权限成功`,
      });
    } else {
      this.$authTable.cancelLoading();
    }
  };

  showAuthManage = data => {
    const { resources } = this.state;
    const hint = handleChoosed(Object.assign({}, resources), data.id);
    this.setState({
      resources: hint[0],
      choosedResource: hint[1] ? hint[1] : hint[0],
    });
  };

  generateBody = (store, key) => {
    const { children, resourceName } = store;
    const title = (
      <span>
        <a onClick={() => this.showAuthManage(store)}>{resourceName}</a>
      </span>
    );
    if (children && children.length > 0) {
      return (
        <TreeNode key={key} title={title}>
          {children.map((c, index) => this.generateBody(c, `${key}-${index}`))}
        </TreeNode>
      );
    }
    return <TreeNode key={key} title={title} />;
  };

  formatResourceItems = tag => {
    const { resources, choosedResource } = this.state;
    const resourceName = {
      type: 'text',
      label: '资源名称',
      property: 'resourceName',
      required: true,
    };
    const resourceType = {
      type: 'select',
      label: '资源类型',
      property: 'resourceType',
      required: true,
      options: RESOURCE_ENUM,
    };
    const parent = {
      type: 'treeSelect',
      label: '父级资源',
      property: 'parentId',
      display: 'resourceName',
      required: true,
      data: resources,
    };
    if (tag === 'create') {
      return [resourceName, resourceType, parent];
    }
    if (tag === 'modify') {
      choosedResource.value = choosedResource.resourceName;
      const father = findFather(resources, choosedResource);
      this.currentFather = father;
      parent.value = father.resourceName || '';
      return [resourceName, parent];
    }
  };

  createResource = () => {
    this.showModal('create');
  };

  modifyResource = () => {
    this.showModal('modify');
  };

  removeResource = () => {
    this.executeUpate({ resourceId: this.resourceStore.choosedResource.id }, 'remove');
  };

  hideModal = () => {
    this.submitData = {};
    this.setState({
      modalVisible: false,
      formItems: [],
    });
  };

  showModal = (action, record) => {
    this.submitDepart = record;
    this.setState({
      modalTitle: action === 'create' ? '创建资源' : '更改资源',
      modalVisible: true,
      modalType: action,
      formItems: this.formatResourceItems(action),
    });
  };

  setFormData = (value, property) => {
    const submitData = this.submitData || {};
    this.submitData = submitData;
    submitData[property] = value;
  };

  confirm = () => {
    const submitData = this.submitData || {};
    const { modalType } = this.state;
    const items = this.formatResourceItems(modalType);
    const tips = [];
    if (modalType === 'create') {
      items.forEach(item => {
        if (!submitData[item.property]) {
          tips.push(item.label);
        }
      });
      submitData.sort = 0;
    } else if (modalType === 'modify') {
      if (submitData.resourceName === undefined) {
        submitData.resourceName = this.resourceStore.choosedResource.resourceName;
      }
      submitData.resourceId = this.resourceStore.choosedResource.id;
      if (submitData.parentId === undefined) {
        submitData.parentId = this.currentFather.id || '';
      }
      if (!submitData.resourceName) {
        tips.push('资源名');
      }
    }
    if (tips.length > 0) {
      notification.error({
        message: `${tips.join(',')}  不能为空`,
      });
      return;
    }
    this.executeUpate(submitData, modalType);
  };

  executeUpate = async (data, action) => {
    let hintMethod = function() {};
    let message = '';
    switch (action) {
      case 'create':
        hintMethod = createResource;
        message = '创建资源';
        break;
      case 'modify':
        hintMethod = modifyResource;
        message = '更改资源';
        break;
      case 'remove':
        hintMethod = revokeResource;
        message = '删除资源';
        break;
      default:
        break;
    }
    const res = await hintMethod(data);
    if (res.code === 0) {
      notification.success({
        message: `${message}成功`,
      });
      this.hideModal();
      this.getResources();
    }
  };

  traslateResourceType = data => {
    const types = ['NAMESPACE', 'ROOT', 'PORTFOLIO', 'BOOK'];
    const typeNames = ['资源组', '资源组', '投资组合', '交易簿'];
    let typeDescription = '';
    const index = types.indexOf(data.resourceType.toUpperCase());
    if (index > -1) {
      typeDescription = typeNames[index];
    }
    return typeDescription;
  };

  render() {
    const { resources, choosedResource } = this.state;
    const showTree = resources && resources.resourceName;
    const showAuth = choosedResource && choosedResource.resourceName;
    const { modalTitle, modalVisible, formItems, fromAuthManagent } = this.state;
    return (
      <div style={styles.between}>
        <div className="resourceAuthTree">
          {showTree && (
            <div>
              {false && fromAuthManagent && (
                <Button style={{ Width: 200 }} onClick={this.createResource} type="primary">
                  创建新资源
                </Button>
              )}
              <CommonTree
                data={resources}
                displayProperty="resourceName"
                handleSelect={this.showAuthManage}
                titleAddtionalFunc={this.traslateResourceType}
              />
            </div>
          )}
        </div>
        <div style={{ width: 400 }}>
          {showAuth && (
            <AuthTable
              ref={authTable => (this.$authTable = authTable)}
              data={choosedResource}
              modifyResourceAuth={this.modifyResourceAuth}
              modifyResource={this.modifyResource}
              removeResource={this.removeResource}
            />
          )}
        </div>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.confirm}
        >
          <CommonForm
            data={formItems}
            handleChange={this.setFormData}
            ref={ele => (this.$formBuilder = ele)}
          />
        </Modal>
      </div>
    );
  }
}
