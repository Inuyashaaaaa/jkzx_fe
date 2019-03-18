/* eslint-disable react/no-multi-comp */
import { Component, PureComponent } from 'react';
import { checkPropTypes } from 'prop-types';

function checkState(nextState) {
  if (process.env.NODE_ENV !== 'production' && this.constructor.stateTypes) {
    checkPropTypes(this.constructor.stateTypes, nextState, 'state', this.constructor.name);
  }
}

class PureStateComponent extends PureComponent {
  setState(...args) {
    const nextState = args[0];
    checkState.call(this, nextState);
    return super.setState(...args);
  }
}

class StateComponent extends Component {
  setState(...args) {
    const nextState = args[0];
    checkState.call(this, nextState);
    return super.setState(...args);
  }
}

export { PureStateComponent, StateComponent };
