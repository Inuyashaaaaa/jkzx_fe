import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';

const Anchor = memo(props => {
  const { dataList, placement } = props;
  const [visibleTip, setVisibleTip] = useState('');
  const scrollToAnchor = (id: string) => {
    const anchorElement = document.getElementById(id);
    if (anchorElement) {
      anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };
  const list = dataList.map((item, index) => (
    <li>
      <Tooltip visible={visibleTip === item.title} placement={placement} title={item.title}>
        <p
          onMouseEnter={() => {
            setVisibleTip(item.title);
          }}
          onMouseLeave={() => {
            setVisibleTip('');
          }}
          onClick={() => {
            setVisibleTip('');
            scrollToAnchor(item.id);
          }}
        >
          {index + 1}
        </p>
      </Tooltip>
    </li>
  ));
  return (
    <div className="anchorLink">
      <ul>{list}</ul>
    </div>
  );
});

export default Anchor;
