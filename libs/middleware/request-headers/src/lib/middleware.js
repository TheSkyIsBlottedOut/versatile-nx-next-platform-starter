import { requestInspector } from '@vpcs/app-logging'
import { server } from '@vpcs/app-logging'
//import { geolocateRequest } from './geolocate'
export default async function setHeadersAndCookies(req, res, next = null) {
  const inspector = await requestInspector(req)
  const { logger } = server
  const { identifiers, client, request } = inspector
  const log = () => logger.withRequest(request)
  /*
  try {
    const location = await geolocateRequest(req)
    log().data({location}).info('middleware.request.headers.geolocate')
  } catch (error) {
    log().data({error}).error('middleware.request.headers.geolocate')
  }*/
  log().info('middleware.request.headers')
  const response = new client.responder(res)
  response.setHeader('X-Request-Id', identifiers.request)
  try {
    response.setCookie('session', identifiers.session)
    response.setCookie('browser', identifiers.browser)
    response.setCookie('user', identifiers.user ?? null)
  } catch (error) {
    log().data({error}).error('middleware.request.headers.response.cookies')
  }
  try {
    request.setHeader('X-Request-Id', identifiers.request)
    request.setHeader('X-User-Id', identifiers.user)
    request.setHeader('X-Session-Id', identifiers.session)
    request.setHeader('X-Browser-Id', identifiers.browser)
    request.setHeader('X-Bot-Detected', request.isBot())
    request.setHeader('X-Client-IP', request.ip)
  } catch (error) {
    log().data({error}).error('middleware.request.headers.request.cookies')
  }
  if (next) return next?.()
  return response
}

