'use client'
import  { PublicConfig } from './lib/configs/public'
import { EnvConfig } from './lib/configs/env'
import { GlobalConfig } from './lib/configs/globals'
import { NextJSCoreConfig } from './lib/nextjsconfig'

class NextJSConfig extends NextJSCoreConfig {
  constructor(featurename: string){
    super(featurename)
    this.setConfigs('public', PublicConfig)
    this.setConfigs('env', EnvConfig)
    this.setConfigs('globals', GlobalConfig)
  }
}

export { NextJSConfig, GlobalConfig, PublicConfig }
