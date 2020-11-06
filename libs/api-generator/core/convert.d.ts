import { JSONSchema4 } from 'json-schema';
import { Interface } from '../types';
declare type Scope = 'request' | 'response';
export declare function interfaceToJSONSchema(itf: Interface.IRoot, scope: Scope): JSONSchema4;
export default function convert(itf: Interface.IRoot): Promise<string[]>;
export {};
