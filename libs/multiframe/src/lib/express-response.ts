import { Response } from 'express';
// this is for setting forward values in middleware
class MultiframeResponse {
  res: Response;
  constructor(res: Response) {
    this.res = res;
  }

  setCookie(name: string, value: string, options: Record<string, string>) {
    this.res.cookie(name, value, options)
  }

  setHeader(name: string, value: string) {
    this.res.setHeader(name, value)
  }

  redirect(path: string) {
    this.res.redirect(path)
  }
}

export default MultiframeResponse;