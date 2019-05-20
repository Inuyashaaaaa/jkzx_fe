export interface NetworkResponse {
  error: boolean;
  data: any;
  raw: any;
}

export type request = (url: string, options: any) => Promise<any>;
