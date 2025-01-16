type WinstonLogLevel = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'
const winstonLevels = ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug']
const winstonTransportLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}


export { winstonLevels, winstonTransportLevels }
export type { WinstonLogLevel }
