// For setting values for next middleware
import { NextResponse } from 'next/server'
export class MultiframeResponse {
  res: NextResponse
  constructor(res?: NextResponse) {
    this.res = res ?? NextResponse.next()
  }

  isNext() { return true }
  isExpress() { return false }

  setCookie(name: string, value: string, options: Record<string, string>) {
    this.res.headers.set('Set-Cookie', `${name}=${value}; ${Object.entries(options).map(([k, v]) => `${k}=${v}`).join('; ')}`)
    return this
  }

  setHeader(name: string, value: string) {
    this.res.headers.set(name, value)
    return this
  }

  redirect(path: string) {
    return NextResponse.redirect(path)
  }

  json() {
    return this.res.json()
  }

  get raw() { return this.res }
}