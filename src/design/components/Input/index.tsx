import Input from './Input';
import InputNumber from './InputNumber';
import InputManager from './register';

const defaultInputManager = new InputManager();
defaultInputManager.registe('input', Input);
defaultInputManager.registe('inputNumber', InputNumber);

export { Input, InputNumber, InputManager, defaultInputManager };
