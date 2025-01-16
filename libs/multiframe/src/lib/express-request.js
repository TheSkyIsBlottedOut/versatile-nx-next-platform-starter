import * as Express from 'express'
const cookieParser = await import('cookie-parser').then((mod) => mod.default).catch(() => null)

class RequestWrapper {
  constructor(req) {
    this.request = req
  }
  get isNext() { return false }
  get isExpress() { return true }
  get type() { return Express.Request }

  get headers() {
    return this.request.headers
  }

  setHeader(name, value) {
    this.request.set(name, value)
  }

  setRequestCookie(name, value, options) {
    this.request.cookie(name, value, options)
  }

  get cookies() {
    return cookieParser?.JSONCookies(this.request.cookies) ?? this.request.cookies
  }

  get body() {
    return this.request.body
  }

  get method() {
    return this.request.method
  }

  get framework(){ return 'express' }
  get params() {
    return this.request.params
  }

  get path() {
    return this.request.path
  }

  get query() {
    return this.request.query
  }

  get route() {
    return this.request.route.path
  }

  get uri() {
    return this.request.originalUrl
  }

  get protocol() {
    return this.request.protocol
  }

  get host() {
    return this.request.hostname
  }

  get ip() {
    return this.request.ip
  }

  get ips() {
    return this.request.ips
  }

  get secure() {
    return this.request.secure
  }

  get xhr() {
    return this.request.xhr
  }

  get fresh() {
    return this.request.fresh
  }

  get stale() {
    return this.request.stale
  }

  get subdomains() {
    return this.request.subdomains
  }

  get accepted() {
    return this.request.accepts()
  }

  get acceptedLanguages() {
    return this.request.acceptsLanguages()
  }

  get acceptedCharsets() {
    return this.request.acceptsCharsets()
  }

  get acceptedEncodings() {
    return this.request.acceptsEncodings()
  }

  get baseUrl() {
    return this.request.baseUrl
  }

  get originalUrl() {
    return this.request.originalUrl
  }

  get url() {
    return this.request.url
  }
}

export default RequestWrapper