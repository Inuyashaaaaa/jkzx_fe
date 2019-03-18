import { Affix, Anchor, Col, Divider, Menu, Row, Table } from 'antd';
import importAll from 'import-all.macro';
import _ from 'lodash';
import React, { PureComponent, StatelessComponent } from 'react';
import styles from './TestLayout.less';

export interface IMenuConfig {
  sort: number;
  title: string;
  subtitle?: string;
}

export interface IComponentConfig {
  title: string;
  component: React.ClassicComponentClass;
  desc: string | string[];
  sort: number;
}

export interface IExports {
  [key: string]: any;
}

export interface ComponentDemoProps {
  config: IComponentConfig;
  path: string;
}

const RIGHT_PADDING = 200;

const findParentFromPath = path => {
  return menuPathTitleMaps[
    Object.keys(menuPathTitleMaps).find(demoPath =>
      path.startsWith(demoPath.replace('config.tsx', ''))
    )
  ];
};

const typeComponentConfig = componentConfigExports => {
  const componentExportPathMap = _.toPairs(componentConfigExports);
  const comProperties = {};
  componentExportPathMap.forEach(([path, component]) => {
    const title = findParentFromPath(path);
    if (!comProperties[title]) {
      comProperties[title] = [];
    }
    comProperties[title].push([path, (component as IExports).default]);
  });
  return comProperties;
};

const menuConfigExports = importAll.sync(
  '../lib/components/?(_Table2|_Form2|_SourceTable|_SourceList|_CascaderSourceList|_SourceTable)/demo/config.tsx'
);

const menuPathTitleMaps = _.fromPairs(
  _.toPairs(menuConfigExports).map(([key, item]) => [key, (item as IExports).default.title])
);

const componentConfigExports = importAll.sync(
  '../lib/components/?(_Table2|_Form2|_SourceTable|_SourceList|_CascaderSourceList|_SourceTable)/demo/!(config).tsx'
);

const menuConfigs = _.toPairs(menuConfigExports).map(([key, item]) => (item as IExports).default);

const componentConfigTree = typeComponentConfig(componentConfigExports);

const getDesc = desc => (desc ? (typeof desc === 'string' ? [desc] : desc) : []);

const ComponentDemo: StatelessComponent<ComponentDemoProps> = ({ config, path }) => {
  const { component, title } = config;
  const desc = getDesc(config.desc);
  return (
    <div key={title} className={styles.demo}>
      <p className={styles.title}>
        <span id={title}>{title}</span>
        <span className={styles.extra}>{path}</span>
      </p>
      {!!desc.length && (
        <div style={{ padding: 20 }}>
          {desc.map((item, index) => {
            return (
              <p key={item} className={styles.desc}>
                {index + 1}. {item}
              </p>
            );
          })}
        </div>
      )}
      <Divider />
      {React.createElement(component)}
    </div>
  );
};

class TestLayout extends PureComponent {
  public state = {
    path: localStorage.getItem('test_path'),
  };

  public handleClick = event => {
    localStorage.setItem('test_path', event.key);
    this.setState({
      path: event.key,
    });
  };

  public onAnchorClick = (event, link) => {
    event.preventDefault();
    document.getElementById(link.title).scrollIntoView({
      behavior: 'smooth',
    });
  };

  public convertApi = api => {
    return api
      .trim()
      .split('&')
      .map(item => {
        const s = item.trim();
        const fi = s.indexOf('|');
        const si = s.indexOf('|', fi + 1);
        const ti = s.indexOf('|', si + 1);
        const ffi = s.indexOf('|', ti + 1);

        return {
          property: s.slice(0, fi).trim(),
          desc: s.slice(fi + 1, si).trim(),
          default: s.slice(si + 1, ti).trim(),
          required: s.slice(ti + 1, ffi).trim(),
          type: s.slice(ffi + 1).trim(),
        };
      });
  };

  public render() {
    const { path } = this.state;

    return (
      <div style={{ padding: 50, paddingRight: RIGHT_PADDING }}>
        <Row gutter={16 + 8 * 4} type="flex" justify="space-between">
          <Col span={4}>
            <Affix offsetTop={20}>
              <Menu onClick={this.handleClick} defaultSelectedKeys={[path]} mode="inline">
                {_.sortBy(menuConfigs, 'sort').map((config: IMenuConfig) => {
                  return (
                    <Menu.Item key={config.title}>
                      {config.title}{' '}
                      <span style={{ color: '#666', fontSize: 12 }}>{config.subtitle}</span>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Affix>
          </Col>
          <Col span={20}>
            {_.toPairs(componentConfigTree).map(
              (chunk: [string, Array<[string, IComponentConfig]>]) => {
                const [parentTitle, config] = chunk;

                if (path !== parentTitle) {
                  return null;
                }

                const menuConfig = menuConfigs.find(item => item.title === parentTitle);

                const sorted = _.sortBy(config, ([path, item]) => item.sort);

                const anchors =
                  menuConfig && menuConfig.api
                    ? sorted.concat([
                        ['', { title: 'API', component: null, desc: null, sort: null }],
                      ])
                    : sorted;

                return (
                  <div key={parentTitle}>
                    <div style={{ position: 'fixed', right: 0, top: 100 }}>
                      <Anchor onClick={this.onAnchorClick} style={{ width: RIGHT_PADDING - 40 }}>
                        {anchors.map(([path, item]) => {
                          return (
                            <Anchor.Link
                              href={`#${item.title}`}
                              title={item.title}
                              key={item.title}
                            />
                          );
                        })}
                      </Anchor>
                    </div>
                    {sorted.map(([path, item]) => {
                      return <ComponentDemo key={item.title} config={item} path={path} />;
                    })}
                    {menuConfig && menuConfig.api && (
                      <Table
                        style={{ marginBottom: 300 }}
                        title={() => (
                          <div id="API" style={{ fontSize: 22 }}>
                            API
                          </div>
                        )}
                        pagination={false}
                        dataSource={this.convertApi(menuConfig.api)}
                        columns={[
                          {
                            title: 'property',
                            dataIndex: 'property',
                          },
                          {
                            title: 'desc',
                            dataIndex: 'desc',
                          },
                          {
                            title: 'default',
                            dataIndex: 'default',
                          },
                          {
                            title: 'required',
                            dataIndex: 'required',
                          },
                          {
                            title: 'type',
                            width: 500,
                            dataIndex: 'type',
                            render: item => <pre>{item}</pre>,
                          },
                        ]}
                      />
                    )}
                  </div>
                );
              }
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default TestLayout;
