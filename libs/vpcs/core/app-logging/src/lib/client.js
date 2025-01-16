'use client'
import { NextJSConfig } from '@vpcs/clientconfig'
import { KtM } from './browser-events'


class BrowserLogger {
  constructor(){
    this.feature = new NextJSConfig('app-logging')
    this.level = this.feature.config.level
    this.browserLevel = this.feature.config.browser
    this.uri = `${this.feature.globals.apiHost}/${this.feature.config.endpoint}`
    this.initializeSweepLogger(5000)
  }

  log(level = 'info', message = '', meta = {}){
    meta.captured_at = new Date().toISOString()
    try {
      KtM.fn.log(`client.events.${level}`, { message, meta })
    } catch (e){
      // do nothing
    console.debug('Could not log to browser storage', e)
    }
  }

  initializeSweepLogger(interval) {
    setInterval(async () => {
      const logs = localStorage.getItem('logs')
      localStorage.setItem('logs', '[0]')
      if (logs.length > 3){
        await fetch(this.uri, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: `{"logs": ${logs.replace(/^\[\,/, '[').replace(/\,\]$/, ']')}}`,
        }).catch(e => console.error('Could not log to server', e))
      }
    }, interval)
  }

  error(message, meta){
    if (message instanceof Error){
      meta = { ...meta, ...message }
      message = message.message
      this.log('error', message, meta)
    } else {
      this.log('error', message, meta)
    }
  }
  info(message, meta){ this.log('info', message, meta) }
  warn(message, meta){ this.log('warning', message, meta) }
  warning(message, meta){ this.warn(message, meta) }
  debug(message, meta){ this.log('debug', message, meta) }
  crit(message, meta){ this.log('crit', message, meta) }
  emerg(message, meta){ this.log('emerg', message, meta) }
  alert(message, meta){ this.log('alert', message, meta) }
  notice(message, meta){ this.log('notice', message, meta) }

  static initLoadLogger(){
    if (!window || window?.Palm?.[Symbol.for('metrics')]) return
    window.Palm ??= {}
    const browserLogger = new BrowserLogger()
    window.Palm[Symbol.for('metrics')] = browserLogger
  }
}
const logger = () => new BrowserLogger()
const metrics = () => {
  try {
    if (localStorage) {
      KtM.fn.expose()
      BrowserLogger.initLoadLogger()
      KtM.fn.begin()
    }
  } catch (e) {
    console.error('Cannot start KtM.', e)
  }
}
export { logger, metrics }