export type FormEnhanceParams = {
  pending?: (body: FormData, form: HTMLFormElement) => void;
  error?: (res: Response, exception: any, form: HTMLFormElement) => void;
  result?: (res: Response, form: HTMLFormElement) => void;
}
