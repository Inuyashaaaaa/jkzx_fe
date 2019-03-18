import Login from '@/lib/components/Login';
import { Alert, Modal, Button } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from './Login.less';
import UpdatePassword from './UpdatePassword';

// const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
const { UserName, Password, Submit, Captcha } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
  pwdUpdating: loading.effects['login/updatePassword'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {
    this.queryCaptcha();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      console.log(nextProps);
    }
  }

  onTabChange = type => {
    this.setState({ type });
  };

  queryCaptcha = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/queryCaptcha',
      payload: {},
    });
    // return;
    // const res = await queryCaptcha();
    // // console.log(res);
    // this.setState({
    //   img: res,
    //   showImage: true,
    // });
  };

  // onGetCaptcha = () =>
  //   new Promise((resolve, reject) => {
  //     this.loginForm.validateFields(['mobile'], {}, (err, values) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         const { dispatch } = this.props;
  //         dispatch({
  //           type: 'login/getCaptcha',
  //           payload: values.mobile,
  //         })
  //           .then(resolve)
  //           .catch(reject);
  //       }
  //     });
  //   });

  handleSubmit = async (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/hideUpdatePassword',
      payload: {},
    });
  };

  handleModalOK = () => {
    this.$updatePassword.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { username, oldPassword, password } = values;
        const params = {
          username,
          newPassword: password,
          oldPassword,
        };
        const { dispatch } = this.props;
        dispatch({
          type: 'login/updatePassword',
          payload: params,
        });
      }
    });
  };

  render() {
    const { login, submitting, pwdUpdating } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName
            name="username"
            placeholder="请输入用户名"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Captcha
            name="captcha"
            countDown={120}
            img={login.img}
            placeholder="请输入验证码"
            showImage={login.showImage}
            onGetCaptcha={this.onGetCaptcha}
            queryCaptcha={this.queryCaptcha}
            getCaptchaButtonText={formatMessage({ id: 'form.captcha' })}
            getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          {/* <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName name="userName" placeholder="username: admin or user" />
            <Password
              name="password"
              placeholder="password: ant.design"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab> */}
          {/* <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <Mobile name="mobile" />
            <Captcha
              name="captcha"
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'form.captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
            />
          </Tab> */}
          {/* <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <Tooltip title="请联系管理员修改">
              <span style={{ float: 'right' }}>忘记密码?</span>
            </Tooltip>
            <Link style={{ float: 'right' }} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div> */}
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {/* <div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div> */}
        </Login>
        <Modal
          title="更新密码"
          visible={login.showPasswordUpdate}
          onCancel={this.hideModal}
          onOk={this.handleModalOK}
          footer={
            <div>
              <Button type="primary" onClick={this.hideModal}>
                取消
              </Button>
              <Button type="primary" onClick={this.handleModalOK} loading={pwdUpdating}>
                确认
              </Button>
            </div>
          }
        >
          <UpdatePassword ref={node => (this.$updatePassword = node)} />
        </Modal>
      </div>
    );
  }
}

export default LoginPage;
