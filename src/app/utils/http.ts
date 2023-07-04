import axios, { AxiosRequestConfig } from "axios";
import { ApiResult } from "../domain";
import { dependency } from "@foal/core";

export class Http {
  call<S = any>(opts: AxiosRequestConfig): Promise<ApiResult<S>> {
    return axios(opts).then((r) => ({
      path: opts.url as string,
      statusCode: r.status,
      payload: r.data,
    }));
  }
}
