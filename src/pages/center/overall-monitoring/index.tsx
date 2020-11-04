import React from 'react';
import Demo from './components/text';

const WelcomePage = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: '42px',
        fontWeight: 500,
        lineHeight: '60px',
        marginBottom: '20px',
        textAlign: 'center',
        letterSpacing: '10px',
        width: '100%',
      }}
    >
      <Demo />
    </div>
  </div>
);

export default WelcomePage;
