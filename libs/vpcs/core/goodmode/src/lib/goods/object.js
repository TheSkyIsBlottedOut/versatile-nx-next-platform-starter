
require { Fn } from '../fn'

GoodObject = class extends O {

  constructor(...args) { super (...args) }
  keypath(dot_separated_keys) {
    const _keys = dot_separated_keys.split(/\.+/g)
    const final = _keys.pop()
    const ptr = _keys.reduce((_this, k) => {
      _this[k] ??= new Good.Object()
      return _this[k]
    }, this)
    return ptr[final]
  }
  get keys() { return Object.keys(this) }
  get proto() { return O.getPrototypeOf(this) }
  get cons() { return this.constructor }
  get ancestors() {
    const __unchecked_ancestors = [this]
    const _ancestors = []
    while (__unchecked_ancestors.length > 0) {
      const current = __unchecked_ancestors.shift()
      _ancestors.push(current)
      if (current.constructor && current.constructor.name !== 'Function')__unchecked_ancestors.push(current.constructor)
      if (fn.O.proto(current)) __unchecked_ancestors.push(fn.O.proto(current))
    }
  }
  get propnames() { this.ancestors.map((a) => Object.getOwnPropertyNames(a)).flat() }
  get propsymbols() { this.ancestors.map((a) => Object.getOwnPropertySymbols(a)).flat() }

  merge(...objs) { return new GoodObject(Object.assign(this, ...objs)) }
  static enhance(obj) { (obj?.constructor?.GoodMode ?? false) ? obj : new GoodObject(obj) }
  static get GoodMode() { return true }
  static create(obj) { return new GoodObject(obj) }
}

