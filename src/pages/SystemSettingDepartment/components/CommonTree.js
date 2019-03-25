import React, { PureComponent } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';

const { TreeNode } = Tree;

export default class CommmonTree extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    displayProperty: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired,
    titleAddtionalFunc: PropTypes.func,
  };

  // constructor(props) {
  //   super(props);
  // }

  generateBody = (data, key) => {
    const { children } = data;
    key = key === undefined ? 0 : key;
    const { displayProperty, titleAddtionalFunc, handleSelect } = this.props;
    let displayPropertyName = data[displayProperty];
    if (titleAddtionalFunc) {
      const additionalTitle = titleAddtionalFunc(data);
      if (additionalTitle) {
        if (additionalTitle === '资源组') {
          displayPropertyName = `${displayPropertyName}`;
        } else {
          displayPropertyName = `${displayPropertyName} (${additionalTitle})`;
        }
      }
    }
    // backgroundColor: '#C6E2FF'
    const title = (
      <span
        style={
          data.choosedThisResource
            ? { backgroundColor: '#C6E2FF', paddingTop: 2, paddingBottom: 2 }
            : { paddingTop: 2, paddingBottom: 2 }
        }
      >
        <a onClick={() => handleSelect(data)}>{displayPropertyName}</a>
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

  render() {
    const { data } = this.props;
    return (
      <div className="resourceAuthTree">
        <Tree showLine onExpand={this.onExpand} defaultExpandAll autoExpandParent>
          {this.generateBody(data)}
        </Tree>
      </div>
    );
  }
}
