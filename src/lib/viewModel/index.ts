import { configure } from 'mobx';
import { inject, IReactComponent, observer, Provider } from 'mobx-react';
import React, { ComponentClass, PureComponent } from 'react';

configure({
  enforceActions: 'observed',
  //   reactionScheduler: f => {
  //     setTimeout(f, 100);
  //   }
});

export interface InjectorClassComponent<T> extends ComponentClass<T> {
  isMobxInjector: boolean;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

function viewModel<T, U extends keyof T>(modelClass: new (props) => {}, name: string) {
  return (classComponent: ComponentClass<T>) => {
    const displayName =
      'viewModel-' +
      (classComponent.displayName ||
        classComponent.name ||
        (classComponent.constructor && classComponent.constructor.name) ||
        'Unknown');

    classComponent = (classComponent as InjectorClassComponent<T>).isMobxInjector
      ? classComponent
      : observer(classComponent);

    return class Wrapper extends PureComponent<Omit<T, U>, any> {
      public static displayName = displayName;

      public static getDerivedStateFromProps(props, state) {
        if (state.viewModel === null) {
          return {
            viewModel: new modelClass(props),
          };
        }

        return null;
      }

      constructor(props) {
        super(props);
        this.state = {
          viewModel: null,
        };
      }

      public render() {
        return React.createElement(Provider, {
          [name]: this.state.viewModel,
          children: React.Children.only(
            React.createElement(inject(name)(classComponent) as IReactComponent, this.props)
          ),
        });
      }
    };
  };
}

const through = (...args) => (classComponent: ComponentClass) => {
  return inject(...args)(observer(classComponent));
};

export { through, viewModel };
