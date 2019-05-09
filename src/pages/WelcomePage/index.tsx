import React, { PureComponent } from 'react';

class WelcomePage extends PureComponent {
  public render() {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            color: '#434e95',
            fontSize: '42px',
            fontWeight: 500,
            lineHeight: '60px',
            marginBottom: '20px',
            textAlign: 'center',
            letterSpacing: '10px',
            width: '100%',
          }}
        >
          <p style={{ marginBottom: '0' }}>欢迎使用</p>
          <p style={{ fontWeight: 300, fontSize: '24px' }}>场外衍生品交易管理系统</p>
        </div>
      </div>
    );
  }
}

export default WelcomePage;
