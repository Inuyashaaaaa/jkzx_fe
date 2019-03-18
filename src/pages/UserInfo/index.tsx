import Form from '@/lib/components/_Form2';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import React, { PureComponent } from 'react';
import { USER_FORM_CONTROLS } from './constants';

class UserBaseInfo extends PureComponent {
  public state = {
    formData: {
      username: 'yb',
      密码: '123123',
      昵称: '123123',
      外部账号类型: '123123',
      关联外部账号: '123123',
      角色: '123123',
    },
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <Form
          style={{ paddingTop: 40 }}
          labelSpace={8}
          wrapperSpace={8}
          dataSource={this.state.formData}
          controlNumberOneRow={1}
          controls={USER_FORM_CONTROLS}
        />
      </PageHeaderWrapper>
    );
  }
}

export default UserBaseInfo;
