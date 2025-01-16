import * as Winston from 'winston';
import { WinstonLogLevel } from './constants';
import { CoreLogger, AppLoggingConfig } from './core-logger';
import { v4 as uuidv4 } from 'uuid';
import * as Express from 'express';
import { NextRequest } from 'next/server';
import { NextJSConfig } from '@vpcs/serverconfig';
type Log = { level: WinstonLogLevel, message: string, meta?: Record<string, unknown> }
type Metadata = Record<string, unknown|Record<string, unknown>>
const defaultConfig = { level: 'info', endpoint: 'metrics', browserLevel: 'info' }
type BodyParserFunction = (request_body: ReadableStream|string) => Log[]
type AppLoggerServerSideProps = { logger: () => ServerLogger, bodyParser: BodyParserFunction }
const loggerhome = process.env['APP_ROOT'] || process.cwd()
class ServerLogger extends CoreLogger {
  override meta: {
    uuid: string
    context: Metadata
    [key: string]: unknown|Metadata
  }

  constructor(){
    super()
    this.feature ||= new NextJSConfig('app-logging')
    this.config ??= { ...defaultConfig, ...this.feature.config } as AppLoggingConfig

    this.logger = this._initializeLogger()
    this.meta = { context: {}, uuid: uuidv4() }
  }

  context(context: Metadata){
    const current = this.meta?.context ?? {}
    this.meta.context = { ...current, ...context }
    return this
  }
  data(data: Metadata){ return this.context(data) }

  override sanitize(origObj: Record<string, unknown>|unknown): Record<string, unknown> {
    if (typeof origObj  !== 'object') throw new Error('sanitize() expects an object')
    const obj: Record<string, unknown> = { ...origObj }
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const isObject = typeof value === 'object'
      const isArray = Array.isArray(value)
      const doesntLogWell = ['[object Object]', undefined].includes(value?.toString())
      if (isObject && !isArray && !doesntLogWell) {
        obj[key] = {
          _type: value?.constructor.name,
          properties: [...Object.getOwnPropertyNames(value)]
        }
      } else if (isArray) {
        obj[key] = (obj[key] as unknown[]).map((item) => {
          return (typeof item !== 'object') ? item : this.sanitize(item as Record<string, unknown>)
        }, this)
      } else if (typeof value === 'string') {
        if (['password', 'token', '_csrf', 'authorization', 'auth', 'csrf'].includes(key)) obj[key] = '********'
        if (['firstName', 'lastName', 'email'].includes(key)) {
          obj[key] = value.replace(/\b(.)[^\s@]+/g, '$1***')
        }
      }
    })
    return obj
  }

  override _transports(){
    return [
      new Winston.transports.Console({
        level: this.feature.globals.environment === 'development' ? 'debug' : 'error',
        format: Winston.format.combine(
          Winston.format.timestamp(),
          Winston.format.json(),
          Winston.format.prettyPrint(),
        )
      }),
      new Winston.transports.File({
        filename: `${loggerhome}/logs/${this.feature.projectName}.log`,
        level: this.config?.level || 'info',
        format: Winston.format.combine(
          Winston.format.timestamp(),
          Winston.format.json(),
          Winston.format.uncolorize(),
          Winston.format.simple()
        ),
        maxsize: 1024 * 1024 * 10,
        maxFiles: 30
      })
    ]
  }

  receive(...args: Log[]){
    args.forEach((arg) => {
      this.log('info', arg.message, arg.meta)
    })
    return this
  }

  withRequest(req: Request|NextRequest|Express.Request){
    if (Object.keys(req).includes('mode')) return this.withFetchRequest(req as Request)
    if (Object.getOwnPropertyNames(req).includes('nextUrl')) return this.withNextRequest(req as NextRequest)
    return this.withExpressRequest(req as Express.Request)
  }

  withFetchRequest(req: Request) {
    const context = {
      cookies: req.headers.get('cookie'),
      headers: req.headers,
      method: req.method,
      url: req.url,
      hasBody: req.bodyUsed,
      mode: req.mode,
      referrer: req.referrer,
      destination: req.destination
    }
    this.context({ request: context })
    return this
  }

  withExpressRequest(req: Express.Request) {
    const context = {
      cookies: req.cookies,
      headers: req.headers,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      hasBody: !!req.body
    }
    this.context({ request: context })
    return this
  }

  withNextRequest(req: NextRequest) {
    const context = {
      cookies: req.cookies.getAll(),
      hasBody: req.bodyUsed,
      destination: req.destination,
      headers: req.headers,
      method: req.method,
      mode: req.mode,
      referrer: req.referrer,
      url: req.url
    }
    this.context({ request: context })
    return this
  }
}

const logger = () => new ServerLogger()
const parseBody = (request_body: string|ReadableStream) => {
  if (typeof request_body === 'string') return JSON.parse(request_body)
  return (request_body).getReader().read().then((r) => r.value).then((v) => JSON.parse(v))
}
const server = { logger, parseBody }

export type { AppLoggerServerSideProps, ServerLogger };
export { server };

