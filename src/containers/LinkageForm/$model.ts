import _ from 'lodash';
import { action, computed, extendObservable, observable } from 'mobx';
import { LinkageControl, LinkageFormProps } from '.';

class LinkageFormData {
  @observable
  public computedDataSource = {};

  public controls: LinkageControl[] = [];

  constructor(props: LinkageFormProps) {
    this.computedDataSource = props.dataSource;
    this.controls = props.controls;
  }

  @action
  public change(values) {
    const changeFields = Object.keys(values);
    this.controls.forEach(control => {
      const { depends, getValue, dataIndex } = control;
      if (depends && depends.length > 0 && _.intersection(changeFields, depends).length) {
        const dependsValue = this.getDependsValue(values, depends);
        const computedValue = getValue(...dependsValue);
        this.computedDataSource[dataIndex] = computedValue;
      }
    });
  }

  public getDependsValue(values, depends: string[]): any[] {
    return depends.map(depend => {
      return values[depend];
    });
  }
}

export default LinkageFormData;
