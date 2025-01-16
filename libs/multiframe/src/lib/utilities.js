
export const hasAllProperties = (obj, ...keys) => keys.reduce((acc, key) => acc && Object.getOwnPropertyNames(obj).includes(key), true)

export function identifyFrameworkByRequest(req) {
  if (req.hasOwn('nextUrl')) return 'next'
  if (hasAllProperties(req, 'params', 'query', 'route')) return 'express'
  if (hasAllProperties(req, 'mode', 'destination', 'cache', 'referrer', 'redirect', 'integrity', 'keepalive', 'credentials', 'method', 'headers', 'body', 'bodyUsed')) return 'fetch'
  if (hasAllProperties(req, 'headers', 'body', 'method', 'url')) return 'generic'
  return 'unknown'
}

export function adaptRequest(req) {
  switch (identifyFrameworkByRequest(req)) {
    case 'next': return import('./next-request').then((W) => new W(req))
    case 'express': return import('./express-request').then((W) => new W(req))
    default: return import('./express-request').then(W => new W(req))
  }
}

export async function responseInitializerFor(request) {
  const req = adaptRequest(request)
  if (req.isNext()) return import('./next-response')
  if (req.isExpress()) return import('./express-response')
  return import('./generic-response')
}