import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message, Modal, Input } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { Form2 } from '@/containers';
import { updateOwnPassword } from '@/services/user';
import GlobalHeader from '@/containers/GlobalHeader';
import TopNavHeader from '@/containers/TopNavHeader';
import styles from './Header.less';

import JSSM4 from 'jssm4';
import { sm4Key } from '@/constants/global';
const sm4 = new JSSM4(sm4Key);

const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
    updateVisible: false,
    confirmLoading: false,
    updateFormData: {},
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`,
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  showModal = () => {
    const { updateVisible } = this.state;
    this.setState({ updateVisible: !updateVisible });
  };

  updatePassword = async () => {
    const { updateFormData } = this.state;
    const { currentUser } = this.props;
    const validateRsp = await this.form.validate();
    if (validateRsp.error) return;
    this.setState({ confirmLoading: true });
    const user = currentUser.username;
    const params = _.omit(Form2.getFieldsValue(updateFormData), 'confirmpassword');
    const rsp = await updateOwnPassword({
      username: sm4.encryptData_ECB(user),
      newPassword: sm4.encryptData_ECB(params.newPassword),
      oldPassword: sm4.encryptData_ECB(params.oldPassword),
    });
    const { data = {} } = rsp;
    this.setState({ confirmLoading: false });
    if (data.error) {
      message.error('修改失败');
      return;
    }
    this.setState({ updateVisible: false, updateFormData: {} });
    message.success('修改成功');
  };

  onFieldsChange = (props, fields, allFields) => {
    this.setState({
      updateFormData: allFields,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch, user } = this.props;
    if (key === 'userinfo') {
      router.push('/user-info');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
        payload: {
          loginUrl: '/user/login',
          userId: _.get(user, 'currentUser.username'),
        },
      });
    }
    if (key === 'updatePassword') {
      this.showModal();
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible, updateVisible, confirmLoading, updateFormData } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header
        style={{ padding: 0, width, zIndex: 2 }}
        className={fixedHeader ? styles.fixedHeader : ''}
      >
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    return (
      <>
        <Animate component="" transitionName="fade">
          {HeaderDom}
        </Animate>
        <Modal
          visible={updateVisible}
          onCancel={this.showModal}
          onOk={this.updatePassword}
          confirmLoading={confirmLoading}
          maskClosable={false}
          title="修改密码"
        >
          <Form2
            ref={node => {
              this.form = node;
            }}
            columns={[
              {
                dataIndex: 'oldPassword',
                title: '旧密码',
                render: (val, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '必填',
                        },
                        // {
                        //   pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/,
                        //   message: '密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位',
                        // },
                      ],
                    })(<Input.Password placeholder="请输入旧密码" />)}
                  </FormItem>
                ),
              },
              {
                dataIndex: 'newPassword',
                title: '新密码',
                render: (val, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '必填',
                        },
                        {
                          pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/,
                          message: '密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位',
                        },
                      ],
                    })(
                      <Input.Password placeholder="至少一位数字、字母以及其他特殊字符，且不少于8位" />,
                    )}
                  </FormItem>
                ),
              },
              {
                dataIndex: 'confirmpassword',
                title: '确认新密码',
                render: (val, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '必填',
                        },
                        {
                          validator(rule, value, cb) {
                            if (record.newPassword.value !== value) {
                              cb('2次密码输入不一致');
                            }
                            cb();
                          },
                        },
                      ],
                    })(<Input.Password placeholder="请与新密码保持一致" />)}
                  </FormItem>
                ),
              },
            ]}
            dataSource={updateFormData}
            footer={false}
            onFieldsChange={this.onFieldsChange}
          />
        </Modal>
      </>
    );
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
  user,
}))(HeaderView);
