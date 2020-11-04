/* eslint-disable react/no-array-index-key */
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import TweenOne from 'rc-tween-one';
import React from 'react';
import styles from './index.less';

class Demo extends React.Component {
  public state = {
    show: true,
  };

  public geInterval = e => e.index * 150;

  public getEnter = e => {
    const t = {
      opacity: 0,
      scale: 0.8,
      y: '-100%',
    };
    // if (e.index >= 2 && e.index <= 6) {
    //   return { ...t, y: '-30%', duration: 150 };
    // }
    return t;
  };

  public getSplit = e => {
    const t = e.split(' ');
    const c = [];
    t.forEach((str, i) => {
      c.push(<span key={`${str}-${i}`}>{str}</span>);
      if (i < t.length - 1) {
        // tslint:disable-next-line:jsx-self-close
        c.push(<span key={` -${i}`}> </span>);
      }
    });
    return c;
  };

  public onClick = () => {
    this.setState(
      {
        show: false,
      },
      () => {
        this.setState({
          show: true,
        });
      },
    );
  };

  public render() {
    return (
      <div className={styles.scope}>
        <div className="combined-wrapper">
          {this.state.show && (
            <div className="combined">
              <Texty
                className="title"
                type="mask-top"
                enter={this.getEnter}
                interval={this.geInterval}
                component={TweenOne}
              >
                欢迎使用
              </Texty>
              <TweenOne
                className="combined-bar"
                animation={{ delay: 1000, width: 0, x: 158, type: 'from', ease: 'easeInOutExpo' }}
                style={{ width: 340 }}
              />
              <Texty
                className="content"
                type="bottom"
                split={this.getSplit}
                delay={1200}
                interval={30}
              >
                场外报告库估值与风险监测系统
              </Texty>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Demo;
