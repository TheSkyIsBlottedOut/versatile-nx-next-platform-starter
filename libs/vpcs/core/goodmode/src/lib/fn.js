const O = Object;
const fn = O.create(null);
fn.obj = () => O.create(null);
fn.O = fn.obj()
fn.O.O = O
fn._ = fn.obj()
fn.curry = (f, ...i) => (...j) => f(...i, ...j);
fn.rcurry = (f, ...i) => (...j) => f(...j, ...i);
fn.O.prop = fn.curry(O.defineProperty)
fn.O.proto = fn.curry(O.getPrototypeOf)
fn._.getter = (obj, key, fn, args = {}) => fn.O.prop(obj, key, {...args, get: fn});
fn._.setter = (obj, key, fn, args = {}) => fn.O.prop(obj, key, {...args, set: fn});
fn._.method = (obj, key, fn, args = {}) => fn.O.prop(obj, key, {...args, value: fn});
fn._.value  = (obj, key, val, args = {}) => fn.O.prop(obj, key, {...args, value: val});
fn._.method(fn, 'set', ( key ) => {
  const args = { enumerable: false, configurable: false, writable: false }
  const r = fn.obj()
  fn._.getter(r, 'enumerable', () => { args.enumerable = true; return r} )
  fn._.getter(r, 'configurable', () => { args.configurable = true; return r } )
  fn._.getter(r, 'writable', () =>  { args.writable = true; return r } )
  fn._.method(r, 'on', (obj) => {
    const s = fn.obj()
    const obj2method = (obj) => (typeof obj === 'function') ? obj : () => obj
    const obj2getter = (obj) => (typeof obj === 'function' && obj.length === 0) ? obj : (() => obj)
    fn._.method(s, 'getter', (getval) => fn._.getter(obj, key, obj2getter(getval), args))
    fn._.method(s, 'method', (getval) => fn._.method(obj, key, obj2method(getval), args))
    fn._.method(s, 'value', (val) => fn._.value(obj, key, val, args))
    fn._.method(s, 'setter', (setval) => fn._.setter(obj, key, setval, args))
    return s
  })
  return r
})








/*


const fn = O.create({ O: {} });

const fn.obj = O.create(null)
const fn.proto =
const StyleFucker = Object.create({})
const O = Object;


// Classy
// eslint-ignore-file
import { logger } from '@vpcs/app-logging/client';
import * as sigma from '@web/libs/sigma/helpers'
import { object } from 'valibot';


/* This library has two parts:

  1. A useful part:
    $.client.vpcsApi is a frontend call which will pass along values as headers to the backend.
    This is important because we have lots of authenticated values which need to be propagated back.
    (it should probably deepmerge with other provided headers, it will someday, there's literally a
    $.fn.deepMerge function further down)
  2. A stupid part: most of the rest is either just boilerplate stuff i like to have available or
    at some point I wrote a btree class for zero reason whatsoever
    Ignore everything except the client stuff, if you like the getters check the pattern in an Express application's
    router ( $.add('name').to(obj).get(...) ), it's much cleaner and smalltalky


*/
/*

const $ = { fn: Object.create({}) };
// Object.defineProperty is just one of several terrible long method names on Object, this is just shorteners.
$.fn.getter = (obj, key, fn) => Object.defineProperty(obj, key, { get: fn });
$.fn.setter = (obj, key, fn) => Object.defineProperty(obj, key, { set: fn });
$.fn.method = (obj, key, fn) => Object.defineProperty(obj, key, { value: fn });

// This creates a blank object 'the right way'
$.fn.getter($.fn, 'obj', () => Object.create({}));

// here I am using the getter pattern on $.fn to define curry on $.fn itself
$.fn.getter(
  $.fn, 'curry', () => (fn, ...args) => (..._args) => fn(...args, ..._args) );
$.client = $.fn.obj;


$.prime = $.fn.obj;
$.prime.known = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
$.prime.findNext = () => {
  let n = $.prime.known[ $.prime.known.length - 1 ] + 2
  while ($.prime.known.some((p) => n % p === 0)) n += 2
  $.prime.known.push(n)
  return n
}
$.prime.isPrime = (num) => {
  const search_space = Math.floor(Math.sqrt(num));
  while ($.prime.known[-1] < search_space) {
    $.prime.findNext($.prime.known[-1]);
  }
  return !$.prime
    .filter((prime) => prime <= search_space)
    .some((prime) => num % prime === 0)
}

$.prime.factorize = (num) => {
  while ($.prime.known[-1] < num) {
    $.prime.findNext($.prime.known[-1]);
  }
  return $.prime
    .filter((prime) => prime <= num)
    .filter((prime) => num % prime === 0)
    .sort();
}

// all numbers can be expressed as the product of two or more primes except primes
$.prime.factorCombinations = (num) => {
  const factors = $.prime.factorize(num)
  const all_factors = []
  let dup = num
  while (dup > 1) {
    for (let factor of factors) {
      if (dup % factor === 0) {
        all_factors.push(factor)
        dup /= factor
      }
    }
  }
  return all_factors
}

// this sticks stuff in the window.vpcs object under the symbol table
// which makes them visible to chrome inspector as [[...]] but not to Object.keys or getOwnPropertyNames
$.client.lib = (key, lib) => {
  if (!window) return false
  window.vpcs ??= {};
  window.vpcs[Symbol.for(key)] ??= (() => lib)();
}

// We need this for the client side logger
$.fn.getter($.client, 'initLog', async () => { $.logger = await logger() })

$.fn.getter($.client, 'log', async () => {
  const logger = ($.fn.pn($.client).includes('logger')) ? $.client.logger() : await $.client.initLog();
  return logger.context({ cookies: await $.client.cookies(), source: 'classy' });
})
// THE MDN SAYS COOKIESTORE IS CORRECT NOW (document.cookie is the old way though)
$.client.cookies = async () => {
  if (window.cookieStore) {
    console.debug('using cookie store');
    const cookielist = await window.cookieStore.getAll();
    return cookielist.reduce((acc, cookie) => {
      acc[cookie.name] = cookie.value;
      return acc;
    }, {});
  } else if (typeof document.cookie === 'string') {
    return document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key.trim()] = value;
      return acc;
    }, {});
  }
}

// I just figure we'd need this at some point
$.client.populateForm = (data) => {
  console.log('populating form with data', data);
  const d = new $.obj(data);
  d.keys.forEach((key) => {
    console.log('checking key', key);
    const value = d[key];
    const input = document.findElementById(key) ?? document.querySelector(`input[name="${key}"]`);
    console.log('found input with id', key);
    if (input) input.value = value
  });
}


$.fn.sigma = sigma;
$.fn.s4 = (o) => Symbol.for(o);
$.client.getNamedContext = (storagekey, context) => {
  const response = window[storagekey][context]
  return (typeof response === 'string' && response.startsWith('{') && response.endsWith('}')) ? JSON.parse(response) : response
}

$.client.getSession = $.fn.curry($.client.getNamedContext, 'sessionStorage')
$.client.getCache = $.fn.curry($.client.getNamedContext, 'localStorage')
$.client.setSession = (context, data) => window.sessionStorage[context] = JSON.stringify(data)
$.client.setCache = (context, data) => window.localStorage[context] = JSON.stringify(data)
$.fn.getter($.client, 'codex', () => window.localStorage.globalState )

$.fn.getter($.client, 'globalctx', () => {
  try { return $.fn.sigma.unpack($.client.codex) } catch (e) { return {} }
})

$.client.codify = (obj) => {
  const globals = $.client.globalctx
  const newctx = { ...globals, ...obj}
  window.localStorage.globalState = $.fn.sigma.pack(newctx)
}


// THis is the money function, it wraps fetch with stuff you need
$.client.vpcsApi = async (api_subpath, args = {}) => {
  const classyopts = (args.classy) ? args.classy : {};
  delete args.classy;
  const cookies = await $.client.cookies();
  let apiUrl = (api_subpath.startsWith('/api') || api_subpath.startsWith('http')) ? api_subpath : `/api/vpcs/${api_subpath}`
  if (!apiUrl.startsWith('http')) { apiUrl = `//${window.location.host}${apiUrl}` }
  console.log('vpcs api request', apiUrl, args);
  const gctx = $.client.globalctx ?? {}
  const submission = {
    method: args.method ?? (args.body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Request-Id': `classy-api-request-${+Date.now()}`,
      'X-User-Id': gctx?.user_id ?? gctx.user?.id ?? cookies.user,
      'X-Session-Id': cookies.session,
      'X-Browser-Id': cookies.browser,
      'X-Auth-Token': gctx.token ?? cookies.auth,
      ...(args.headers ?? {})
    }
  }
  //$.client.logger?.data?.({ submission })?.debug?.('classy.api.call')
  console.debug('classy.api.call', { submission });
  if (args.body) { submission.body = JSON.stringify(args.body) }
  return await fetch(apiUrl, submission)
    .then((res) => {
      console.debug('result', {res})
      const cookies = (res.headers.getSetCookie) ? res.headers.getSetCookie() : res.headers.get('Set-Cookie').split(',')
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split(';')[0].split('=');
        window.cookies.set(key, value);
      });
      // return a neatly formatted body
      return res.json()
    }).then((res) => {
      if (res && classyopts.contextualize && Array.isArray(classyopts.contextualize)) {
        const updates = $.fn.obj
        classyopts.contextualize.forEach((key) => {
          const value = res[key] ?? res.data?.[key] ?? res.data?.results?.[key] ?? res?.results?.[key]
          if (value) updates[key] = value
        })
        $.client.codify(updates)
      }
      return res
    })
    .catch((err) => {
      return { error: err.message, stack: err.stack };
    });
};
$.client.setCookies = async (cookies) => {
  // i guess this sets cookies too
  for (let key in cookies) {
    if (window.cookieStore) {
      await window.cookieStore.set(key, cookies[key]);
    } else {
      document.cookie = `${key}=${cookies[key]}`;
    }
  }
}


// I hate Object
$.fn.pn = $.fn.curry(Object.getOwnPropertyNames);
$.fn.pd = $.fn.curry(Object.getOwnPropertyDescriptors);

// just wait
const _dt = (r) => {
  $.fn.method(r, 'is', (...types) => types.includes(r.type) || types.includes(r.subtype))
  $.fn.method(r, 'not', (...types) => !(types.includes(r.type) || types.includes(r.subtype)) )
  return r
}
// here we go
const _t = (obj) => {
  // better typecasting
  if (Array.isArray(obj)) return { type: 'array', values: obj.map(_t) }
  if (typeof obj === 'number') {
    if (obj === Math.floor(obj)) return { type: 'number', subtype: 'integer', value: obj, magnitude: Math.floor(Math.log10(obj)) }
    return { type: 'number', subtype: 'float', value: obj, magnitude: Math.floor(Math.log10(obj)), precision: obj.toString().split('.')[1].length }
  }
  if (typeof obj === 'object'){
    if (typeof obj.constructor.name === 'string' && obj.constructor.name !== 'object') return {type: 'object', subtype: obj.constructor.name.toLowerCase(), value: obj, props: $.fn.pn(obj)}
    return {type: 'object', subtype: 'hash', keys: Object.keys(obj)}
  }
  if ([true, false, undefined, null].includes(obj)) return { type: 'boolean', subtype: 'literal', 'truthy': !!obj }
  if (typeof obj === 'function') return { type: 'function', subtype: 'callable', name: obj.name, arity: obj.length }
}


// does it not bother you that typeof [] === 'object'
$.fn.type = (obj) => _dt(_t(obj))


// these are for the deepmerge below
$.fn.obj2ary = (obj) => {
  return Object.keys(obj).map((key) => {
    const value = obj[key];
    if (typeof value === 'object') {
      return [key, $.fn.obj2ary(value)];
    } else {
      return [key, value];
    }
  });
};

$.fn.ary2obj = (ary) => {
  return ary.reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = $.fn.ary2obj(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// this is to let you read all the functions off a thing
$.fn.proto = (obj) => Object.getPrototypeOf(obj);
$.fn.deepMerge = (...mergeables) => {
  // object mergeables all go into one array
  const objects = mergeables.filter(
    (obj) => typeof obj === 'object' && !Array.isArray(obj)
  );
  // array mergeables all go into one array
  const arrays = mergeables.filter((obj) => Array.isArray(obj));
  const other = mergeables.filter((obj) => ![objects, arrays].includes(obj));
  // always merge into the leftmost type. preprocess with obj2ary or ary2obj if you want to merge similar types.
  const leftmost = Array.isArray(
    mergeables.filter((obj) => [Object, Array].includes(obj.constructor))
  )
    ? 'array'
    : 'object';
  if (leftmost === 'array') {
    // grab each array at each index, and merge them together. deepmerge object types.
    const result = [];
    const longestArray = Math.max(...arrays.map((arr) => arr.length));
    for (let i = 0; i < longestArray; i++) {
      const arraysAtIndex = arrays.filter((arr) => arr[i]);
      // if everything is array/object, deepmerge
      if (arraysAtIndex.every((item) => typeof item === 'object')) {
        result.push($.fn.deepMerge(...arraysAtIndex.map((arr) => arr[i])));
      } else {
        // concat everything that isn't in the last (number of arrays) indices
        const subarray = result.slice(-arraysAtIndex.length, result.length);
        arraysAtIndex
          .filter((item) => !subarray.includes(item))
          .forEach((item) => result.push(item));
      }
    }
    objects.forEach((obj) => result.push(obj));
    other.forEach((item) => result.push(item));
    return result;
  } else {
    // merge objects together
    const result = objects.reduce((acc, obj) => {
      for (let key in obj) {
        if (
          acc[key] &&
          typeof acc[key] === 'object' &&
          typeof obj[key] === 'object'
        ) {
          acc[key] = $.fn.deepMerge(acc[key], obj[key]);
        } else {
          acc[key] = obj[key];
        }
      }
      return acc;
    }, {});
    // add arrays to the key 'array_values'
    result.array_values = $.fn.deepMerge(...arrays);
    result.other_values = other.uniq();
    return result;
  }
};

// this is a thing i do all the tiem so it's good to have it somewhere, sets are unique
// ...sets also memoize outside of functions in NextJS <_< it's how they store state
$.fn.sortedUnique = (...args) => [...new Set(args.flat())].sort();


// "Don't monkeypatch objects", they said. So I just extend them with better versions of themselves
$.obj = class extends Object {
  get keys() {
    return Object.keys(this);
  }
  get values() {
    return Object.values(this);
  }
  get clone() {
    return Object.assign({}, this);
  }
  get pn() {
    return $.sortedUnique(
      ...$.fn.pn(this),
      ...$.fn.pn(this.proto),
      ...$.fn.pn(this.proto.proto),
      ...$.fn.pn(this.cons),
      ...$.fn.pn(this.cons.proto),
      ...$.fn.pn(this.cons.proto.proto)
    );
  }

  get cons() {
    return this.constructor;
  }
  get proto() {
    return Object.getPrototypeOf(this);
  }

  static up(obj) {
    return Object.assign(new this(), obj);
  }
};
// why have an array when you can have this thing
$.ary = class extends Array {
  get compact() {
    return this.filter((x) => ![null, undefined].includes(x));
  }
  get nonempty() {
    return this.filter((x) => ![null, undefined, '', {}, []].includes(x));
  }
  get flatten() {
    return this.flat(Infinity);
  }
  get uniq() {
    return [...new Set(this)];
  }
  get clone() {
    return this.slice();
  }
  static up(ary) {
    return new this(...ary);
  }
  static forRange(min, max, step = 1) {
    return Array.from(
      { length: Math.floor((max - min) / step) },
      (_, i) => min + i * step
    );
  }
  static fromString(str) {
    return new $.chrary(str.split(''))
  }
  chunk(size) {
    return Array.from({ length: Math.ceil(this.length / size) }, (_, i) =>
      this.slice(i * size, i * size + size)
    );
  }
  get first() {
    return this[0];
  }
  get last() {
    return this[this.length - 1];
  }
  get rest() {
    return this.slice(1);
  }
  get shuffleOnce() {
    return this.sort(() => Math.random() - 0.5);
  }
  get shuffle() {
    let dup = this.clone;
    $.int.up(13).times(() => (dup = dup.shuffleOnce))
    return dup
  }
  get sample() {
    return this[Math.floor(Math.random() * this.length)];
  }
  get draw() {
    return this.sample;
  }
  rotate(x = 1) {
    return [...this.slice(x), ...this.slice(0, x)];
  }
  rewind(x = 1) {
    return [...this.slice(-x), ...this.slice(0, -x)];
  }
  get grouped() {
    return this.reduce((acc, x) => {
      acc[x] ||= 0;
      acc[x] += 1;
      return acc;
    }, {});
  }
  get groupedSorted() {
    return Object.entries(this.grouped).sort((a, b) => b[1] - a[1]);
  }
  get freq() {
    return this.grouped;
  }
  get freqSorted() {
    return this.groupedSorted;
  }
  get freqMax() {
    return this.groupedSorted[0];
  }
  get freqMin() {
    return this.groupedSorted[-1];
  }
  get freqMode() {
    return this.groupedSorted[0][0];
  }
  get freqMean() {
    return this.freqSorted.map(([key, value]) => key * value).sum / this.length;
  }
  get freqMedian() {
    const sorted = this.sort();
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
  get freqStddev() {
    const mean = this.freqMean;
    const squared_diffs = this.map((x) => (x - mean) ** 2);
    return Math.sqrt(squared_diffs.sum / this.length);
  }
};


// This is stupid
$.int = class extends Number {
  radix(radix) {
    return parseInt(this, radix);
  }
  get hex() {
    return this.toString(16);
  }
  get bin() {
    return this.toString(2);
  }
  get oct() {
    return this.toString(8);
  }
  get float() {
    return parseFloat(this);
  }
  get abs() {
    return Math.abs(this);
  }
  get ceil() {
    return Math.ceil(this);
  }
  get floor() {
    return Math.floor(this);
  }
  get round() {
    return Math.round(this);
  }
  get trunc() {
    return Math.trunc(this);
  }
  get isEven() {
    return $.up(this % 2) === 0;
  }
  get isPrime() {
    return $.prime.isPrime(this);
  }
  get factors() {
    return $.prime.factorize(this);
  }
  get factorCombinations() {
    return $.prime.factorCombinations(this);
  }
  get char() {
    return String.fromCharCode(this);
  }
  get isOdd() {
    return $.up(this % 2) !== 0;
  }
  get isNegative() {
    return $.up(this < 0);
  }
  get isPositive() {
    return $.up(this > 0);
  }
  get isZero() {
    return this === 0;
  }
  get isNonZero() {
    return this !== 0;
  }
  get sqrt() {
    return Math.sqrt(this);
  }
  get log10() {
    return Math.log10(this);
  }
  get log2() {
    return Math.log2(this);
  }
  get log() {
    return Math.log(this);
  }

  // let's just throw in metric conversions
  get feet2meter() {
    return $.up(this * 0.3048);
  }
  get meter2feet() {
    return $.up(this / 0.3048);
  }
  get feet2inch() {
    return $.up(this * 12);
  }
  get inch2feet() {
    return $.up(this / 12);
  }
  get inch2cm() {
    return $.up(this * 2.54);
  }
  get cm2inch() {
    return $.up(this / 2.54);
  }
  get cm2mm() {
    return $.up(this * 10);
  }
  get mm2cm() {
    return $.up(this / 10);
  }
  get oz2ml() {
    return $.up(this * 29.5735)
  }
  get ml2oz() {
    return $.up(this / 29.5735)
  }
  get gal2l() {
    return $.up(this * 3.78541)
  }
  get l2gal() {
    return $.up(this / 3.78541)
  }
  get lb2kg() {
    return $.up(this * 0.453592)
  }
  get kg2lb() {
    return $.up(this / 0.453592)
  }
  get parsec2ly() {
    return $.up(this * 3.26156)
  }
  get mph2kph() {
    return $.up(this * 1.60934)
  }
  get kph2mph() {
    return $.up(this / 1.60934)
  }
  get parsec2picometer() {
    return $.up(this * 3.08567756e28)
  }
  get parsec2meter() {
    return this * (3.08567756e16)
  }
  get parsec2mile() {
    return $.up(this * 1.9174e13)
  }
  get days() {
    return $.up(this * 86400)
  }
  get hours() {
    return $.up(this * 3600)
  }
  get minutes() {
    return this * $.up(60)
  }
  get seconds() {
    return this;
  }
  get weeks() {
    return this * $.up(604800)
  }
  get ago() {
    return Date.now() - $.up(this * 1000);
  }
  get fromNow() {
    return Date.now() + $.up(this * 1000);
  }

  // iterator. $.int.up(1).upto(5).fn(console.log)
  upto(num) {
    return {
      fn: $.fn.curry($.ary.forRange(this, num).map),
      stepFn: (step) => $.fn.curry($.ary.forRange(this, num, step).map),
    };
  }
  downto(num) {
    return {
      fn: $.fn.curry($.ary.forRange(num, this).map),
      stepFn: (step) => $.fn.curry($.ary.forRange(num, this, step).map),
    };
  }
  times(fn) {
    return $.ary.forRange(0, this).map(fn);
  }
  get factorial() {
    return $.ary.forRange(1, this).reduce((acc, x) => acc * x, 1);
  }
  get fib() {
    return $.ary.forRange(1, this).reduce((acc, x) => acc + x, 1);
  }
  get fibs() {
    return $.ary.forRange(1, this).map((x) => x.fib);
  }
  get isFib() {
    return this.fibs.includes(this);
  }
  get isFactorial() {
    return this.factorial === this;
  }
  get isPerfect() {
    return this.factors.sum === this;
  }
  get isAbundant() {
    return this.factors.sum > this;
  }
  get isDeficient() {
    return this.factors.sum < this;
  }
  get isSquare() {
    return Math.sqrt(this) % 1 === 0;
  }
  get isCube() {
    return Math.cbrt(this) % 1 === 0;
  }
  get isPowerOfTwo() {
    return Math.log2(this) % 1 === 0;
  }
  get isPowerOfThree() {
    return Math.log3(this) % 1 === 0;
  }
  get isSqrt() {
    return Math.sqrt(this) % 1 === 0;
  }
  get isCbrt() {
    return Math.cbrt(this) % 1 === 0;
  }
  get cbrt() {
    return Math.cbrt(this);
  }
};

$.numary = class extends $.ary {
  constructor(...args) {
    if (args.length === 1 && Array.isArray(args[0])) args = args[0]
    super(...args.reject((x) => isNaN(x)));
  }


  // yes an array of numbers is a binary tree
  // 0 is the root node, 1 and 2 the next level, 3,4,5,6 the next, each block is just 2x the size of the block before it
  toBTree() {
    return $.btree.fromArray(this);
  }

  asKeyFrameSequence(str) {
    // '%%: { transform: rotate(%%deg) }' => '0% { transform: rotate(0deg) };\n100% { transform: rotate(360deg) }'
    // use length to split into equal parts
    const frames = this.length;
    const step = 100 / frames;
    // interpolate %% and # to create keyframes
    return this.map(
      (x, i) =>
        `${step * i}% { ${str.replace(/%%/g, step * i).replace(/#/g, x)} }`
    ).join(';\n');
  }

  // NUMBER ARRAYS ONLY HAVE NUMBERS
  push(...args) {
    return super.push(...args.reject((x) => isNaN(x)));
  }
  concat(...args) {
    return super.concat(...args.reject((x) => isNaN(x)));
  }
  unshift(...args) {
    return super.unshift(...args.reject((x) => isNaN(x)));
  }
  splice(...args) {
    return super.splice(...args.reject((x) => isNaN(x)));
  }
  set(index, value) {
    return super.set(index, isNaN(value) ? 0 : value);
  }
  get sum() {
    return this.reduce((acc, x) => acc + x, 0);
  }
  // sum times i get mean
  get mean() {
    return this.sum / this.length;
  }
  get avg() {
    return this.mean;
  }
  get median() {
    const sorted = this.sort();
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
  get stddev() {
    const mean = this.mean;
    const squared_diffs = this.map((x) => (x - mean) ** 2);
    return Math.sqrt(squared_diffs.sum / this.length);
  }

  get variance() {
    return this.stddev ** 2;
  }

  get min() {
    return Math.min(...this);
  }
  get max() {
    return Math.max(...this);
  }
  get range() {
    return this.max - this.min;
  }
  get mode() {
    const counts = this.reduce((acc, x) => {
      acc[x] ||= 0;
      acc[x] += 1;
      return acc;
    }, {});
    const max = Math.max(...Object.values(counts));
    return Object.keys(counts).find((key) => counts[key] === max);
  }

  get freq() {
    return this.reduce((acc, x) => {
      acc[x] ||= 0;
      acc[x] += 1;
      return acc;
    }, {});
  }

  get freqSorted() {
    return Object.entries(this.freq).sort((a, b) => b[1] - a[1]);
  }
};

$.chrary = class extends $.ary {
  constructor(...args) {
    super(...args.reject((x) => typeof x !== 'string' || x.length !== 1));
  }

  toBTree() {
    return $.btree.fromArray(this);
  }
  push(...args) {
    args = args.reject((x) => typeof x !== 'string' || x.length !== 1);
    return super.push(
      ...args.reject((x) => typeof x !== 'string' || x.length !== 1)
    );
  }
  concat(...args) {
    args = args.reject((x) => typeof x !== 'string' || x.length !== 1);
    return super.concat(
      ...args.reject((x) => typeof x !== 'string' || x.length !== 1)
    );
  }
  unshift(...args) {
    args = args.reject((x) => typeof x !== 'string' || x.length !== 1);
    return super.unshift(
      ...args.reject((x) => typeof x !== 'string' || x.length !== 1)
    );
  }
  splice(...args) {
    args = args.reject((x) => typeof x !== 'string' || x.length !== 1);
    return super.splice(
      ...args.reject((x) => typeof x !== 'string' || x.length !== 1)
    );
  }
  set(index, value) {
    return super.set(
      index,
      typeof value !== 'string' || value.length !== 1 ? '' : value
    );
  }
  frequency() {
    return this.reduce((acc, x) => {
      acc[x] ||= 0;
      acc[x] += 1;
      return acc;
    }, {});
  }

  get frequencySorted() {
    return Object.entries(this.frequency).sort((a, b) => b[1] - a[1]);
  }
  static fromString(str) {
    return str.split('');
  }
  static up(ary) {
    return new this(...ary);
  }
};

$.node = class extends $.obj {
  constructor(value, left = null, right = null, parent = null) {
    super();
    this.value = value;
    this.left = left;
    this.right = right;
    this.parent = parent;
  }

  set parent(node) {
    this._parent = node;
  }
  get isLeaf() {
    return !this.left && !this.right;
  }
  get isFull() {
    return this.left && this.right;
  }
  get isHalf() {
    return this.left || this.right;
  }
  get isBalanced() {
    return Math.abs(this.height(this.left) - this.height(this.right)) <= 1;
  }
  get height() {
    return 1 + Math.max(this.height(this.left), this.height(this.right));
  }

  static fromArray(ary) {
    const root = this.up(ary[0]);
    for (let i = 1; i < ary.length; i++) {
      root.add(ary[i]);
    }
    return root;
  }

  add(value) {
    if (value < this.value) {
      this.left
        ? this.left.add(value)
        : (this.left = this.constructor.up(value, null, null, this));
    } else {
      this.right
        ? this.right.add(value)
        : (this.right = this.constructor.up(value, null, null, this));
    }
    return this;
  }

  contains(value) {
    if (value === this.value) return true;
    if (value < this.value) {
      return this.left ? this.left.contains(value) : false;
    }
    return this.right ? this.right.contains(value) : false;
  }

  get isEmpty() {
    return this.isBlank && !this.left && !this.right;
  }
  get isBlank() {
    return this.value === '' || this.value === null || this.value === undefined;
  }

  remove(value) {
    if (!this.contains(value)) return this;
    if (this.value == value) {
      if (this.isLeaf) {
        this.parent.left === this
          ? (this.parent.left = null)
          : (this.parent.right = null);
      } else if (this.left && this.right) {
        const min = this._findMin(this.right);
        this.value = min.value;
        this.right.remove(min.value);
      } else {
        this.parent.left === this
          ? (this.parent.left = this.left || this.right)
          : (this.parent.right = this.left || this.right);
      }
    }
  }

  get min() {
    return this.left ? this.left.min() : this.value;
  }
  get max() {
    return this.right ? this.right.max() : this.value;
  }
  get ordered() {
    if (this.isEmpty) return [];
    return [...this.left.ordered, this.value, ...this.right.ordered];
  }

  get depth() {
    let ctr = 0;
    let node = Object.assign({}, this);
    while (node.parent) {
      ctr += 1;
      node = node.parent;
    }
    return ctr;
  }

  get size() {
    return this.ordered.length;
  }
  get balanceFactor() {
    return this.height(this.left) - this.height(this.right);
  }

  get isRoot() {
    return !this.parent;
  }
  get isCompletelyFull() {
    return (
      this.isFull && this.left.isCompletelyFull && this.right.isCompletelyFull
    );
  }
  get isCompletelyBalanced() {
    return (
      this.isBalanced &&
      this.left.isCompletelyBalanced &&
      this.right.isCompletelyBalanced
    );
  }
  pathTo(val) {
    if (this.value === val) return [this.value];
    if (val < this.value) return [this.value, ...this.left.pathTo(val)];
    return [this.value, ...this.right.pathTo(val)];
  }

  balance() {
    if (this.balanceFactor > 1) {
      if (this.left.balanceFactor < 0) {
        this.left.rotateLeft();
      }
      this.rotateRight();
    } else if (this.balanceFactor < -1) {
      if (this.right.balanceFactor > 0) {
        this.right.rotateRight();
      }
      this.rotateLeft();
    }
    return this;
  }
};

$.btree = class {
  constructor(...values) {
    if (values.length === 0) {
      this.root = new $.node(null, null, null, null);
    } else {
      this.root = $.node.fromArray(values);
    }
  }

  get ordered() {
    return this.root.ordered;
  }

  add(value) {
    if (!this.root.value) {
      this.root.value = value;
    } else {
      this.root.add(value);
    }
  }

  remove(value) {
    this.root.remove(value);
  }

  contains(value) {
    return this.root.contains(value);
  }

  get min() {
    return this.root.min;
  }

  get max() {
    return this.root.max;
  }

  get size() {
    return this.root.size;
  }

  get depth() {
    return this.root.depth;
  }

  get balanceFactor() {
    return this.root.balanceFactor;
  }

  get isBalanced() {
    return this.root.isBalanced;
  }

  get isFull() {
    return this.root.isFull;
  }

  get isHalf() {
    return this.root.isHalf;
  }

  get isLeaf() {
    return this.root.isLeaf;
  }

  get isRoot() {
    return this.root.isRoot;
  }

  get isCompletelyFull() {
    return this.root.isCompletelyFull;
  }

  get isCompletelyBalanced() {
    return this.root.isCompletelyBalanced;
  }

  pathTo(val) {
    return this.root.pathTo(val);
  }

  get height() {
    return this.root.height;
  }

  get balance() {
    return this.root.balance();
  }
  static up(ary) {
    if (ary.constructor === $.chrary) return this.fromArray(ary);
    if (ary.constructor === $.numary) return this.fromArray(ary);
    return new this(...ary);
  }
};

$.fn.method($.btree, 'fromArray', (ary) => {
  const root = new $.node(ary[0]);
  for (let i = 1; i < ary.length; i++) {
    root.add(ary[i]);
  }
  return root;
});

$.str = class extends String {
  get ascii() {
    return $.chrary.fromString(this).map((x) => x.charCodeAt(0));
  }
  get chrs() {
    return this.split('');
  }
  get words() {
    return this.split(' ');
  }
  get lines() {
    return this.split('\n');
  }
  get sentences() {
    return this.split('. ');
  }
  get paragraphs() {
    return this.split('\n\n');
  }
  get upper() {
    return this.toUpperCase() === this;
  }
  get intern() { return Symbol.for(this)}
  ljust(num = 80, char = ' ') {
    return this.padEnd(num, char);
  }
  rjust(num = 80, char = ' ') {
    return this.padStart(num, char);
  }
  center(num = 80, char = ' ') {
    return this.padStart(num / 2, char).padEnd(num, char);
  }
  get titleize() {
    return this.split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
  get capitalize() {
    return this[0].toUpperCase() + this.slice(1);
  }
  get reverse() {
    return this.split('').reverse().join('');
  }
  get isPalindrome() {
    return this === this.reverse;
  }
  scan(rgxstr) {
    if (typeof rgxstr === 'string') rgxstr = new RegExp(rgxstr, 'g');
    return this.match(rgxstr);
  }
  get lower() {
    return this.toLowerCase();
  }
  get title() {
    return this.titleize;
  }
  get camel() {
    return this.split(' ')
      .map((word, i) => (i === 0 ? word : word.capitalize))
      .join('');
  }
  get snake() {
    return this.split(' ').join('_');
  }
  get kebab() {
    return this.split(' ').join('-');
  }
  get dot() {
    return this.split(' ').join('.');
  }
  get unkebab() {
    return this.split('-').join(' ');
  }
  get unsnake() {
    return this.split('_').join(' ');
  }
  get undot() {
    return this.split('.').join(' ');
  }
  get uncamel() {
    return this.replace(/([A-Z])/g, ' $1').toLowerCase();
  }
  get untitle() {
    return this.split(' ')
      .map((word, i) => (i === 0 ? word : word.capitalize))
      .join(' ');
  }
  get hashed() {
    // we'll use a simple hash algo, just idx and xor charcode
    return this.split('')
      .map((char, i) => char.charCodeAt(0) ^ i)
      .map((x) => $.int.up(x).hex.unicode)
      .join('');
  }
  get unhashed() {
    const hexes = this.match(/.{1,4}/g);
    return hexes
      .map((hex) => String.fromCharCode(parseInt(hex, 16) ^ hexes.indexOf(hex)))
      .join('');
  }
  get unicode() {
    return this.split('')
      .map((char) => char.charCodeAt(0).toString(16))
      .join('')
      .chunk(4)
      .map((hex) => `\\u${hex}`)
      .join('');
  }
  chunk(size) {
    return this.match(new RegExp(`.{1,${size}}`, 'g'));
  }
  get isBlank() {
    return this.trim() === '';
  }
  get rotate() {
    return this.split('').rotate.join('');
  }
  get rot13() {
    return this.replace(/[a-zA-Z]/g, (char) =>
      String.fromCharCode(
        (char <= 'Z' ? 90 : 122) >= (char = char.charCodeAt(0) + 13)
          ? char
          : char - 26
      )
    );
  }
  get base64() {
    return btoa(this);
  }
  get unbase64() {
    return atob(this);
  }

  get json() {
    return JSON.parse(this);
  }
  get obj() {
    return JSON.parse(this);
  }
  get invertBits() {
    return this.split('')
      .map((char) => char.charCodeAt(0) ^ 1)
      .join('');
  }
  get invertBytes() {
    return this.split('')
      .map((char) => char.charCodeAt(0) ^ 255)
      .join('');
  }
  get invertNibbles() {
    return this.split('')
      .map((char) => char.charCodeAt(0) ^ 15)
      .join('');
  }
  get invertWords() {
    return this.split('')
      .map((char) => char.charCodeAt(0) ^ 65535)
      .join('');
  }
  static up(str) {
    return new this(str);
  }
};

$.float = class extends Number {
  get abs() {
    return Math.abs(this);
  }
  get ceil() {
    return Math.ceil(this);
  }
  get floor() {
    return Math.floor(this);
  }
  get int() {
    return Math.floor(this);
  }
  prec(num = 2) {
    return parseFloat(this.toFixed(num));
  }
  get percent() {
    return this < 1 ? $.up(this * 100) : this;
  }
  get isNegative() {
    return $.up(this < 0);
  }
  get isPositive() {
    return $.up(this > 0);
  }
  get isZero() {
    return this === 0;
  }
  get isNonZero() {
    return this !== 0;
  }
  get dollars() {
    return `$${this.toFixed(2)}`;
  }
  get yen() {
    return `¥${this.toFixed(2)}`;
  }
  static get now() {
    return new this(+Date.now());
  }
  static up(num) {
    return new this(num);
  }
  get rad2deg() {
    return this.map((x) => (x * 180) / Math.PI);
  }
  get deg2rad() {
    return this.map((x) => (x * Math.PI) / 180);
  }
  get cos2sin() {
    return this.map((x) => Math.cos(x) - Math.sin(x));
  }
  get sin2cos() {
    return this.map((x) => Math.sin(x) - Math.cos(x));
  }

  // why are you doing this?
  // https://youtu.be/NF1pwjL9-DE?si=3AAbthTfdineNfQs
  get tan2cos() {
    return this.map((x) => Math.tan(x) - Math.cos(x));
  }
  get cos2tan() {
    return this.map((x) => Math.cos(x) - Math.tan(x));
  }
  get sin2tan() {
    return this.map((x) => Math.sin(x) - Math.tan(x));
  }
  get tan2sin() {
    return this.map((x) => Math.tan(x) - Math.sin(x));
  }
  get deg2opposite() {
    return this.map((x) => 90 - x);
  }
  get deg2adjacent() {
    return this.map((x) => 90 - x);
  }
  get deg2hypotenuse() {
    return this.map((x) => 90 - x);
  }
  get rad2opposite() {
    return this.map((x) => Math.PI / 2 - x);
  }
  get rad2adjacent() {
    return this.map((x) => Math.PI / 2 - x);
  }
  get rad2hypotenuse() {
    return this.map((x) => Math.PI / 2 - x);
  }
  get cos2opposite() {
    return this.map((x) => Math.cos(x) / Math.sin(x));
  }
  get cos2adjacent() {
    return this.map((x) => Math.cos(x) / Math.tan(x));
  }
  get cos2hypotenuse() {
    return this.map((x) => Math.cos(x) / Math.sin(x));
  }
  get sin2opposite() {
    return this.map((x) => Math.sin(x) / Math.cos(x));
  }
  get sin2adjacent() {
    return this.map((x) => Math.sin(x) / Math.tan(x));
  }
  get sin2hypotenuse() {
    return this.map((x) => Math.sin(x) / Math.cos(x));
  }
  get tan2opposite() {
    return this.map((x) => Math.tan(x) / Math.cos(x));
  }
  get tan2adjacent() {
    return this.map((x) => Math.tan(x) / Math.sin(x));
  }
  get tan2hypotenuse() {
    return this.map((x) => Math.tan(x) / Math.cos(x));
  }
  get f2c() {
    return this.map((x) => ((x - 32) * 5) / 9);
  }
  get c2f() {
    return this.map((x) => (x * 9) / 5 + 32);
  }
  get f2k() {
    return this.map((x) => ((x - 32) * 5) / 9 + 273.15);
  }
  get k2f() {
    return this.map((x) => ((x - 273.15) * 9) / 5 + 32);
  }
  get c2k() {
    return this.map((x) => x + 273.15);
  }
  get k2c() {
    return this.map((x) => x - 273.15);
  }
  get m2km() {
    return this.map((x) => x / 1000);
  }
  get km2m() {
    return this.map((x) => x * 1000);
  }
  get m2cm() {
    return this.map((x) => x * 100);
  }
  get cm2m() {
    return this.map((x) => x / 100);
  }
  get m2mm() {
    return this.map((x) => x * 1000);
  }
  get mm2m() {
    return this.map((x) => x / 1000);
  }
};

$.statary = class extends $.numary {
  get zscore() {
    const mean = this.mean;
    const stddev = this.stddev;
    return this.map((x) => (x - mean) / stddev);
  }
  get zscores() {
    return this.zscore;
  }
  get derivative() {
    return this.map((x, i) => x - this[i - 1]);
  }
  get integral() {
    return this.map((x, i) => this.slice(0, i).sum);
  }
  get cumulative() {
    return this.integral;
  }
  get diff() {
    return this.derivative;
  }
  get diff2() {
    return this.diff.derivative;
  }
  get diff3() {
    return this.diff2.derivative;
  }
  get diff4() {
    return this.diff3.derivative;
  }
};

$.strary = class extends $.ary {
  constructor(...args) {
    super(...args.reject((x) => typeof x !== 'string'));
  }

  toBTree() {
    return $.btree.fromArray(this);
  }
  push(...args) {
    args = args.reject((x) => typeof x !== 'string');
    return super.push(...args.reject((x) => typeof x !== 'string'));
  }
  concat(...args) {
    args = args.reject((x) => typeof x !== 'string');
    return super.concat(...args.reject((x) => typeof x !== 'string'));
  }
  unshift(...args) {
    args = args.reject((x) => typeof x !== 'string');
    return super.unshift(...args.reject((x) => typeof x !== 'string'));
  }
  splice(...args) {
    args = args.reject((x) => typeof x !== 'string');
    return super.splice(...args.reject((x) => typeof x !== 'string'));
  }
  set(index, value) {
    return super.set(index, typeof value !== 'string' ? '' : value);
  }
  static fromString(str) {
    return str.split('');
  }
  static up(ary) {
    return new this(...ary);
  }
};

export { Fn }
// this just uses the type fn to automatically upgrade other things into appropriate better classes.
// ...classy
/*
$.fn.enhance = (obj) => {
  const t = $.fn.type(obj)
  if (t.is('string')) return $.str.up(obj)
  if (t.is('number')) return (obj === Math.floor(obj)) ? $.int.up(obj) : $.float.up(obj)
  if (Array.isArray(obj)) {
    const types = obj.map((x) => x.constructor).uniq();
    if (types.length === 1) {
      if (types[0] === String) return $.strary.up(obj);
      if (types[0] === Number) return $.numary.up(obj);
    }
    return $.ary.up(obj);
  }
  if (typeof obj === 'object') return $.obj.up(obj);
  return obj;
};
$.enhance = $.fn.enhance
$.fn.proto = (obj) => Object.getPrototypeOf(obj)

$.fn.hasMethod = (obj, method) => {
  if (Object.getOwnPropertyNames($.fn.proto(obj)).includes(method)) return true
  if (Object.getOwnPropertySymbols($.fn.proto(obj)).includes(method)) return true
  return false
}
$.intern = $.fn.obj
$.intern.infinity = '♾️'
$.intern.sigma = '∑'
$.intern.dollar = '$'
$.sym = (k) => $.fn.s4($.intern[k])
// i would stop using $ for everything but it's the shortest uncommon
// i also like using o_o and v_v
const o_o = $.sym('infinity')
const enhancer = (obj, fn) => {
  if (!Object.getOwnPropertySymbols($.fn.proto(obj)).includes(o_o)) {
    $.fn.getter($.fn.proto(obj), o_o, fn)
  }
}
enhancer(String,  () => { return $.str.up(this) })
enhancer(Number,  () => { return (this === Math.floor(this)) ? $.int.up(this) : $.float.up(this) })
enhancer(Array,  () => {
  const types = this.map((x) => x.constructor).uniq()
  if (types.length === 1) {
    if (types[0] === String) return new $.strary(this)
    if (types[0] === Number) {
      if (this.every((x) => x === Math.floor(x))) return new $.numary(this)
      return new $.statary(this)
    }
  }
  return new $.ary(this)
})
enhancer(Object,  () => { return new $.obj(this) })
*/