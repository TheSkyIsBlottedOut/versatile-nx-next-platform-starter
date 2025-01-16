import { URLSearchParams } from 'url'
export class GenericRequest {
  req: Request
  constructor(req?: Request) {
    this.req = req ?? new Request('')
  }
  get type() { return Request }
  get isNext() { return false }
  get isExpress() { return false }
  get framework() { return 'mdn' }
  get headers() {
    const retval: Record<string, string> = {}
    this.req.headers.forEach((v, k) => {
      retval[k] = v
    })
    return retval
  }

  get method() { return this.req.method }
  get url() { return this.req.url }
  setHeader(name: string, value: string) { this.req.headers.set(name, value) }
  setCookie(name: string, value: string, options: Record<string, string>) {
    this.req.headers.set('Set-Cookie', `${name}=${value}; ${Object.entries(options).map(([k, v]) => `${k}=${v}`).join('; ')}`)
  }
  get params() { return new URLSearchParams(this.req.url).toString() }
  get path() { return this.req.url.replace(/^\w*:?\/{2}[^/]/, '') }
  pathParams(path: string) {
    // replaces :tokens with values from path
    const pathTokens = path.split('/')
    const urlTokens = this.path.split('/')
    const retval: Record<string, string|number> = {}
    pathTokens.forEach((token: string, i: number) => {
      if (token.startsWith(':')) {
        retval[token] = urlTokens[i]
      }
    })
    return retval
  }
  get query() { return Array.from(new URLSearchParams(this.req.url)).reduce((acc: Record<string, string>, [k, v]) => { acc[k] = v; return acc }, {}) }

}