import { NextRequest, NextResponse } from 'next/server'
class RequestWrapper {
  req: NextRequest
  body: Record<string, unknown>

  constructor(req: NextRequest) {
    this.req = req
    this.body = {}
    setTimeout(this.initializeBody, 0)
  }
  get type() { return NextRequest }
  get framework() { return 'next' }
  get isNext() { return true }
  get isExpress() { return false }

  async initializeBody() { this.body = await this.req.json().then(r => r).catch(() => new Object()) }
  get headers() {
    const retval: Record<string, string> = {}
    this.req.headers.forEach((v, k) => {
      retval[k] = v
    })
    return retval
  }

  get method() {
    return this.req.method
  }

  get url() {
    return this.req.url
  }
  setHeader(name: string, value: string){
    this.req.headers.set(name, value)
  }

  setCookie(name: string, value: string, options: Record<string, string>) {
    NextResponse.next().cookies.set(name, value, options)
  }

  get params() {
    return this.req.nextUrl
  }

  get path() {
    return this.req.url.replace(/^\w*:?\/{2}[^/]/, '')
  }

  get query() {
    // don't handle array accessors yet
    const retval: Record<string, string> = {}
    const values = this.req.url.split('?', 2)[1]
    values.split('&').forEach((clause: string) => {
      const kv = clause.split('=', 2)
      retval[kv[0].toString()] = kv[1]
    })
    return retval
  }
}
export default RequestWrapper