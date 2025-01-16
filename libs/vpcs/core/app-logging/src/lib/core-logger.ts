import { NextJSConfig } from '@vpcs/serverconfig'
import * as Winston from 'winston'
import { winstonLevels, winstonTransportLevels } from './constants'
import type { WinstonLogLevel } from './constants'
const feature = new NextJSConfig('app-logging')

interface AppLoggingConfig {
  level: WinstonLogLevel
  endpoint: string
  browserLevel: WinstonLogLevel
}
type ISOTimestamp = Exclude<string,''>
class LoggerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LoggerError'
  }
}

type VoidMethod = () => void
const voidMethod: VoidMethod = (() => { return })

abstract class CoreLogger {
  feature: NextJSConfig
  logger: Winston.Logger
  config: AppLoggingConfig
  meta: Record<string, unknown> = {}
  constructor(){
    this.feature = feature
    this.logger = this._initializeLogger()
    this.config = this.feature.config as unknown as AppLoggingConfig
    this.meta = { service: this.feature.projectName }
  }

  _initializeLogger(): Winston.Logger {
    return Winston.createLogger({
      level: this.config?.level || 'info',
      levels: this.logPriority,
      format: Winston.format.json(),
      defaultMeta: { service: this.feature.projectName },
      transports: this._transports(),
    })
  }

  _transports(): Winston.transport|Winston.transport[]|[] {
    return []
  }

  log(level: WinstonLogLevel, message: string, meta?: Record<string, unknown>) {
    if (typeof meta !== 'object') meta = { meta }
    meta = this.sanitize(Object.assign({}, this.meta, meta))
    /*if (!winstonLevels.includes(level)) {
      this.logger.error('error', 'Invalid log level', { level })
      return this
    }*/
    if (!message) {
      this.logger.error('error', 'Blank log messagee')
      return this
    }
    /*
    if (winstonLevels.indexOf(level) > winstonLevels.indexOf(this.config.level)) {
      return this
    }*/
    try {
      this.write(level, message, meta)
    } catch (e) {
      const error = e as Error
      this.logger.error('error', error.message, { stack: error.stack, type: error.name })
    }
    return this
  }

  sanitize(origObj: Record<string, unknown>) {
    return origObj;
    // overwrite me
  }

  get logPriority() { return winstonTransportLevels }

  write(level: WinstonLogLevel, message: string, meta?: Record<string, unknown>) {
    this.logger.log(level, message, meta)
  }
  writeLogs(level: WinstonLogLevel, message: string, meta?: Record<string, unknown>): void { return this.write(level, message, meta) }

  info(message: string, meta?: Record<string, unknown>) {
    return this.log('info', message, meta)
  }
  error(message: string|Error, meta?: Record<string, unknown>) {
    if (message instanceof Error) {
      const error = message as Error
      this.log('error', error.message, { ...meta, stack: error.stack })
    } else {
      this.log('error', message, meta)
    }
    return this
  }

  warn(message: string, meta?: Record<string, unknown>) {
    return this.log('warning', message, meta)
  }
  warning(message: string, meta?: Record<string, unknown>) {
    return this.log('warning', message, meta)
  }
  debug(message: string, meta?: Record<string, unknown>) {
    return this.log('debug', message, meta)
  }
  emerg(message: string, meta?: Record<string, unknown>) {
    return this.log('emerg', message, meta)
  }
  alert(message: string, meta?: Record<string, unknown>) {
    return this.log('alert', message, meta)
  }
  crit(message: string, meta?: Record<string, unknown>) {
    return this.log('crit', message, meta)
  }
  notice(message: string, meta?: Record<string, unknown>) {
    return this.log('notice', message, meta)
  }
}

export type { AppLoggingConfig, ISOTimestamp, LoggerError, WinstonLogLevel }
export { CoreLogger }

export { voidMethod as noop, voidMethod, winstonLevels }
