import { adaptRequest, responseInitializerFor } from 'multiframe'
import { v4 } from 'uuid'



export const identity = (req) => {
  const ids = {}
  ids.request = req.headers['X-Request-Id'] || v4()
  ids.user = req.cookies['user'] ?? null
  ids.session = req.cookies['session'] ?? v4()
  ids.browser = req.cookies['browser'] ?? v4()
}


export const requestInspector = async (r) => {
  const req = adaptRequest(r)
  const ResponseClass = await responseInitializerFor(req)
  const result = {
    identifiers: identity(req),
    client: {
      ip: req.ip,
      responder: ResponseClass,
      framework: req.type
    }
  }
  return result
}




