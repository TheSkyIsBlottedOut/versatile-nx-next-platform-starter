/*
*  A feature is on or off depending on your state: it looks like this:
*  features: {
*   feature1: true,
*   feature2: ['ALL', { country: 'US'}, ['EXCEPT', { region: 'CA'}]]
&   feature3: ['NOT', { browser: 'IE', user: 'bot', device: 'mobile', missingSupport: [ 'fetch', 'websockets'] }]
*  }
*
*  An experiment looks like this:
*  experiments:
*    experiment1: {
*     type: ['browser', 'session']}
*     cohorts: [
*      { name: 'v1', percentage: 50, restrictions: ['ALL', { country: 'US'}, ['EXCEPT', { region: 'CA'}]]},
*      { name: 'v2', percentage: 32 }
*    ]
*    nonbucketed experiment variants are always 'control'.
*/

import { createHash } from 'crypto'
import FeatureConfig from '@vpcs/serverconfig'
const features = new FeatureConfig('features')
const experiments = new FeatureConfig('experiments')

const deviceFromUserAgent = (userAgent) => {
  const device = {
    mobile: /Mobi/.test(userAgent),
    tablet: /Tablet/.test(userAgent),
    desktop: !/Mobi|Tablet/.test(userAgent)
  }
  return device
}

const osFromUserAgent = (userAgent) => {
  const os = {
    windows: /Windows/.test(userAgent),
    mac: /Macintosh/.test(userAgent),
    linux: /Linux/.test(userAgent),
    ios: /iPhone|iPad/.test(userAgent),
    android: /Android/.test(userAgent),
    blackberry: /BlackBerry/.test(userAgent),
    windowsphone: /Windows Phone/.test(userAgent)
  }
  return os
}

const browserFromUserAgent = (userAgent) => {
  const browser = {
    chrome: /Chrome/.test(userAgent),
    firefox: /Firefox/.test(userAgent),
    safari: /Safari/.test(userAgent),
    ie: /MSIE|Trident/.test(userAgent),
    edge: /Edge/.test(userAgent),
    opera: /Opera/.test(userAgent),
    webkit: /AppleWebKit/.test(userAgent),
    gecko: /Gecko/.test(userAgent),
    presto: /Presto/.test(userAgent),
    trident: /Trident/.test(userAgent)
  }
  return browser
}


// handles: country, region, city, timezone, browser, device, missingSupport
const evaluateRequirementObject = (reqobject, userdata) => {
  let qualified = true
  const userAgent = userdata.request.headers['user-agent']
  const device = deviceFromUserAgent(userAgent)
  const os = osFromUserAgent(userAgent)
  const support = userdata.request?.support ?? []
  const conditions = Object.keys(reqobject)
  if (conditions.length === 0) return true
  for (let condition of conditions) {
    switch (condition) {
      case 'country':
        qualified  &&= [reqobject.country].flat().includes?.(userdata.location.country)
        break
      case 'region':
        qualified  &&= [reqobject.region].flat().includes?.(userdata.location.region)
        break;
      case 'city':
        qualified  &&= [reqobject.city].flat().includes?.(userdata.location.city)
        break
      case 'timezone':
        qualified  &&= [reqobject.timezone].flat().includes?.(userdata.location.timezone)
        break
      case 'browser':
        qualified  &&= [reqobject.browser].flat().includes?.(userdata.browser)
        break
      case 'device':

        qualified  &&= [reqobject.device].flat().includes?.(device)
        break
      case 'os':
        qualified  &&= [reqobject.os].flat().includes?.(os)
        break
      case 'missingSupport':
        qualified  &&= [reqobject.missingSupport].flat().every?.(feature => !support[feature])
        break
      default:
        qualified = false
        break
    }
    if (!qualified) break
  }
  return qualified
}

// Only pass me feature blocks and the data i need to evaluate them
export const featureParser = ( {conditions, dataReqs} ) => {
  // A feature definition is *always* [condition, ...{conditions} | [condition, ...{conditions}]]
  let qualified = true
  const arg = conditions.shift()
  const inverse = ['NOT', 'EXCEPT', 'NOR'].includes(arg)
  for (let condition of conditions) {
    if (Array.isArray(condition)) {
      qualified &&= featureParser({ conditions: condition, dataReqs })
    } else {
      qualified &&= evaluateRequirementObject(condition, dataReqs)
    }
  }
  return inverse ? !qualified : qualified
}


export const featureEvaluator = (feature, dataReqs) => {
  if (typeof feature === 'boolean') return feature
  if (Array.isArray(feature)) {
    return featureParser({ conditions: feature, dataReqs })
  }
  return false
}

const uuidToPercentage = (uuid) => {
  const hash = createHash('sha256').update(uuid).digest('hex')
  const percentage = parseInt(hash.slice(0, 2), 16)
  return percentage
}

export const experimentEvaluator = (experiment, dataReqs) => {
  const xp = experiments[experiment]
  if (!xp) return false
  const { cohorts } = xp
  let type = [xp.type].flat()
  let percent = 0
  while (percent == 0 && type.length > 0) {
    const t = type.shift()
    switch (t) {
      case 'browser':
        percent = uuidToPercentage(dataReqs.browser)
        break
      case 'session':
        percent = uuidToPercentage(dataReqs.session)
        break
      case 'user':
        percent = uuidToPercentage(dataReqs.user)
        break
      case 'device':
        percent = uuidToPercentage(dataReqs.device)
        break
      case 'os':
        percent = uuidToPercentage(dataReqs.os)
        break
      default:
        return false
    }
  }
  const bucket = percent % 100
  let variant = 'control'
  for (let cohort of cohorts) {
    const { name, restrictions } = cohort
    let percentage = cohort.percentage
    if (bucket < percentage) {
      if (featureParser({ conditions: restrictions, dataReqs })) {
        variant = name
        break
      } else {
        percentage -= bucket
      }
    }
  }
  return variant
}

const parseAllFeatures = (dataReqs) => {
  const result = {}
  for (let feature in features) {
    result[feature] = { enabled: featureEvaluator(features[feature], dataReqs) }
  }
  return result
}

const parseAllExperiments = (dataReqs) => {
  const result = {}
  for (let experiment in experiments) {
    result[experiment] = experimentEvaluator(experiment, dataReqs)
  }
  return result
}

export { parseAllFeatures, parseAllExperiments }