import _ from 'lodash';
import { PureComponent } from 'react';

abstract class StationalComponent<P, S> extends PureComponent<P, S> {
  public getUsedState(): any {
    return Object.keys(this.state).reduce((obj, key) => {
      if (this.getFreeStateKeys()[key]) return obj;
      return {
        ...obj,
        [key]: this.getUsedStateField(key as keyof S),
      };
    }, {});
  }

  public getUsedStateField(key: keyof S): any {
    if (this.props[key as string] === undefined) {
      return this.state[key];
    }

    return this.props[key as string];
  }

  // @todo remove
  protected getFreeStateKeys(): {
    [key: string]: boolean;
  } {
    return {};
  }

  protected isControl = (key: keyof S) => {
    if (this.getFreeStateKeys()[key as string]) return false;

    if (typeof this.state[key] === 'boolean') {
      return key in this.props;
    }

    return !!this.props[key as string];
  };

  protected $setState = (state: S, callback?) => {
    if (!state) return;

    const keys = Object.keys(state);
    const controlKeys = keys.filter(key => this.isControl(key as keyof S));
    const updateKeys = _.difference(keys, controlKeys);

    if (controlKeys.length > 0) {
      this.state = {
        ...this.state,
        ...(_.pick(state, controlKeys) as any),
      };
    }

    if (updateKeys.length > 0) {
      return this.setState(_.pick(state, updateKeys) as any, callback);
    } else {
      return callback && callback();
    }
  };
}

export default StationalComponent;
