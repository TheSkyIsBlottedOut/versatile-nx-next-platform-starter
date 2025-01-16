class MultiframeResponse {
  res: Response;
  headers: Record<string, string>;
  constructor(res: Response) {
    this.res = res;
    this.headers = {} as Record<string, string>;
  }

  setCookie(name: string, value: string, options: Record<string, string>) {
    document.cookie = `${name}=${value}; ${Object.entries(options).map(([k, v]) => `${k}=${v}`).join('; ')}`
  }

  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  redirect(path: string) {
    window.location.href = path;
  }

  json() {
    return this.res.json();
  }
}

export default MultiframeResponse;