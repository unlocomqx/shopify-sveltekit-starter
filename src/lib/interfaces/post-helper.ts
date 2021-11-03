import type { IResponse } from "@interfaces/response";

export interface IPostHelper {
  post(url: string, data: { [key: string]: any }, options?): Promise<IResponse>;

  delete(url: string, data: { [key: string]: any }, options?): Promise<IResponse>;
}
