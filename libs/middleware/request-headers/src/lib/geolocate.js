import { geolocate } from 'fast-geoip'
import { Base64 } from 'js-base64'
const pack = (data) => Base64.encode64(JSON.stringify(data))


async function geolocateRequest(req) {
  const ip = req.ip
  const location = await geolocate(ip)
  req.setHeader('X-Geo-Packed', pack(location))
  return location
}
export { geolocateRequest }
export default geolocateRequest