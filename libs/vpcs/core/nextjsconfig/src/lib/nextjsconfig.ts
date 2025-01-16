
type ConfigKeyType = 'public'|'server'|'secrets'|'globals'|'env'
type ConfigDataNonRecursive = string|number|string[]|number[]|boolean
type ConfigData = Record<'name'|'environment', string>|Record<string, ConfigDataNonRecursive|ConfigDataNonRecursive[]>
type ConfigRecord = { public: ConfigData, server: ConfigData, secrets: ConfigData, globals: ConfigData, env: ConfigData }
class NextJSCoreConfig {i
  feature_name: string
  configdata: ConfigRecord
  static staticData: ConfigData = {}

  constructor(featurename: string){
    this.feature_name  = featurename
    this.configdata = { public: {}, server: {}, secrets: {}, globals: {}, env: {} }
  }

  get globals(): ConfigData { return this.configdata.globals ?? {} }
  get secrets(): ConfigData { return this.configdata.secrets ?? {} }
  get featureConfig(): ConfigData { return { ...(this.client as object), ...(this.server as object) } }
  get client(){ return (this.configdata.public as object as Record<string, ConfigData>)[this.feature_name] ?? {} }
  get server(){ return (this.configdata.server as object as Record<string, ConfigData>)[this.feature_name] ?? {} }
  get config(){ return this.featureConfig }
  get env(){ return this.configdata.env }
  get appEnvironment(){ return this.globals.environment ?? 'development' }
  get projectName(){ return this.globals.name ?? 'unknown' }
  setConfigs(key: ConfigKeyType, value: object): void{
    this.configdata[key] = { ...(this.configdata[key] as object), ...value }
  }
}
export { NextJSCoreConfig }
export type { ConfigData, ConfigKeyType, ConfigRecord }

