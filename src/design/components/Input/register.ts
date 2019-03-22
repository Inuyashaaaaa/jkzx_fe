import { InputBase } from '../type';

class InputManager {
  public inputs: {
    [type: string]: typeof InputBase;
  } = {};

  public registe(type: string, input: typeof InputBase) {
    this.inputs[type] = input;
  }

  public getInput(type: string): typeof InputBase {
    return this.inputs[type];
  }
}

export default InputManager;
