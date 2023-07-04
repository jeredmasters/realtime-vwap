export interface ApiResult<T = any> {
  path: string;
  statusCode: number;
  payload: T;
}
