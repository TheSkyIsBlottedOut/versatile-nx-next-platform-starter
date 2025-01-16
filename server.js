import { NextJSCoreConfig } from './lib/nextjsconfig'
import * as PublicConfig from './lib/configs/public'
import * as ServerConfig from './lib/configs/server'
import * as EnvConfig from './lib/configs/env'
import * as SecretsConfig from './lib/configs/secrets'
import * as GlobalConfig from './lib/configs/globals'

class FeatureConfig extends NextJSCoreConfig {
  constructor(featurename){
    super(featurename)
    this.setConfigs('public', PublicConfig)
    this.setConfigs('server', ServerConfig)
    this.setConfigs('secrets', SecretsConfig)
    this.setConfigs('env', EnvConfig)
    this.setConfigs('globals', GlobalConfig)
  }
}
export { FeatureConfig as NextJSConfig}
export { FeatureConfig, EnvConfig, GlobalConfig, ServerConfig, SecretsConfig, PublicConfig };
