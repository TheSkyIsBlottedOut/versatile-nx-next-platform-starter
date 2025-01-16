import { NextJSCoreConfig } from './lib/nextjsconfig'
import { PublicConfig } from './lib/configs/public'
import { ServerConfig } from './lib/configs/server'
import { EnvConfig } from './lib/configs/env'
import { SecretsConfig } from './lib/configs/secrets'
import { GlobalConfig } from './lib/configs/globals'

class FeatureConfig extends NextJSCoreConfig {
  constructor(featurename: string){
    super(featurename)
    this.setConfigs('public', PublicConfig)
    this.setConfigs('server', ServerConfig)
    this.setConfigs('secrets', SecretsConfig)
    if (EnvConfig) this.setConfigs('env', EnvConfig)
    this.setConfigs('globals', GlobalConfig)
  }
}



export { FeatureConfig, EnvConfig, GlobalConfig, ServerConfig, SecretsConfig, PublicConfig };
export { FeatureConfig as NextJSConfig }
export default FeatureConfig
