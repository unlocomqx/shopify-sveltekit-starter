export type IResponseData<T> = Partial<IResponse> & Partial<T>

export interface IResponse {
  success?: boolean,
  error?: boolean,
  message?: string,
  redirect?: string,
}
