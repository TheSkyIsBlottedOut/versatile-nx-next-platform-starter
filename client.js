'use client'
import * as PublicConfigs from './lib/configs/public'
import * as EnvConfigs from './lib/configs/env'
import * as GlobalConfigs from './lib/configs/globals'
import { NextJSCoreConfig } from './lib/nextjsconfig'

class NextJSConfig extends NextJSCoreConfig {
  constructor(featurename){
    super(featurename)
    this.setConfigs('public', PublicConfigs)
    this.setConfigs('env', EnvConfigs)
    this.setConfigs('globals', GlobalConfigs)
  }
}

export { NextJSConfig, GlobalConfigs, PublicConfigs }
