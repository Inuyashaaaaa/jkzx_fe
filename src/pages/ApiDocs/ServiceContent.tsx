import { Empty, Menu, Row, BackTop } from 'antd';
import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import _ from 'lodash';
import Loading from '@/containers/Loading';

const { SubMenu } = Menu;

const ServiceContent = memo(props => {
  const { data } = props;

  return data ? (
    <div
      id="content"
      className="markdown-body"
      style={{
        background: '#fff',
        padding: 24,
        margin: 0,
      }}
    >
      {data.map(item => {
        const {
          description,
          method,
          retName,
          retType,
          service,
          args,
          'return-info': returns,
        } = item;

        const generateArgsTbody = (inArgs, options, pres = []) => {
          const { fieldName, ignore = () => false } = options;
          return _.flattenDeep(
            inArgs.map(iitem => {
              if (_.startsWith(iitem.name, '$')) {
                return null;
              }

              const paths = pres
                .map(iiitem => {
                  if (_.startsWith(_.get(iiitem, 'type'), 'List')) {
                    return `${iiitem.name}[]`;
                  }
                  return iiitem.name;
                })
                .join('.');

              const name = `${paths}${pres.length ? '.' : ''}${iitem.name}`;
              return [
                <tr key={name}>
                  {['name', 'type', 'description', 'required']
                    .filter(field => !ignore(field))
                    .map(field => {
                      if (field === 'name') {
                        return <td key={field}>{name}</td>;
                      }
                      return <td key={iitem[field]}>{iitem[field]}</td>;
                    })}
                </tr>,
                iitem[fieldName] &&
                  generateArgsTbody(iitem[fieldName], options, pres.concat(iitem)),
              ];
            }),
          ).filter(iitem => !!iitem);
        };

        return (
          <div>
            <h1>{method}</h1>
            <ul>
              <li>服务名: {service}</li>
              <li>描述: {description}</li>
              <li>返回类型: {retType}</li>
              <li>返回名称: {retName}</li>
            </ul>
            <table>
              <thead>
                <tr>
                  <th>参数名</th>
                  <th>参数类型</th>
                  <th>参数描述</th>
                  <th>是否必传</th>
                </tr>
              </thead>
              <tbody>{generateArgsTbody(args, { fieldName: 'class-info' })}</tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>返回字段名</th>
                  <th>返回字段类型</th>
                  <th>返回字段描述</th>
                </tr>
              </thead>
              <tbody>
                {generateArgsTbody(returns, {
                  fieldName: 'subClassFieldList',
                  ignore: field => field === 'required',
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  ) : (
    <Row style={{ height: '100%' }} type="flex" align="middle" justify="center">
      <Loading></Loading>
    </Row>
  );
});

export default ServiceContent;
