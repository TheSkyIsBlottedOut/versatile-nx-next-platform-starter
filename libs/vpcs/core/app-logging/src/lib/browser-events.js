// @ts-disable-rules invalid-characters
'use client'
var $ = null
if (typeof localStorage !== 'undefined') {
  $ = Object.create({ fn: {}, intel: {}, _: {}})
  $.fn.curry = (fn, ...a) => (...b) => fn(...a, ...b)
  $.fn.rcurry = (fn, ...a) => (...b) => fn(...b, ...a)

  $.fn.wrapFn = (fn) => (typeof fn === 'function') ? fn : () => fn

  const cookieNames = ['session', 'browser', 'user']
  const cookies = {}
  cookieNames.forEach(async (cookie) => {
    cookies[cookie] = await cookieStore.get(cookie)
  })
  $.identifiers = cookies

  $.fn.add = (key) => {
    return {
      to: (obj) => {
        return {
          getter: (getval) => Object.defineProperty(obj, key, { get: $.fn.wrapFn(getval) }),
          setter: (setval) => Object.defineProperty(obj, key, { set: $.fn.wrapFn(setval) }),
          method: (fn) => Object.defineProperty(obj, key, { value: $.fn.wrapFn(fn), enumerable: false })
        }
      }
    }
  }

  $.fn.add('obj').to($.fn).getter(() => Object.create(null))

  $.fn.relisten = (obj, key) => { $.fn.add(key).to($._).method($.fn.rcurry(obj.addEventListener, {passive: true}).bind(obj)) }
  $.fn.relisten(window, 'w')
  $.fn.relisten(document, 'd')
  $.fn.relisten(Element.prototype, 'el')
  $.fn.relisten(HTMLElement.prototype, '$el')
  $.loggerTarget = (args) => {
    localStorage.setItem('logs', (localStorage.getItem('logs').replace(/\]$/, `,${JSON.stringify(args)}]`)))
  }
  $.fn.browserInfo = async () => {
    if (!localStorage) return {}
    // @eslint-ignore no-undef
    var navigator, window, document, chrome, screen
    const n = navigator ?? {}, w = window ?? {}, d = document ?? {}, c = chrome ?? {}, s = screen ?? {}, l = window?.location ?? {}
    const rr = {}
    try {
      rr.window = {
        innerHeight: w.innerHeight,
        innerWidth: w.innerWidth,
        outerHeight: w.outerHeight,
        outerWidth: w.outerWidth,
        pageXOffset: w.pageXOffset,
        pageYOffset: w.pageYOffset,
        screenX: w.screenX,
        screenY: w.screenY,
        scrollX: w.scrollX,
        scrollY: w.scrollY
      }
    } catch (e) { }
    try {

      rr.document = {
        documentURI: d.documentURI,
        domain: d.domain,
        lastModified: d.lastModified,
        referrer: d.referrer,
        title: d.title,
        URL: d.URL,
      }
    } catch (e) { }

    try {
      rr.screen = {
        availHeight: s.availHeight,
        availWidth: s.availWidth,
        colorDepth: s.colorDepth,
        height: s.height,
        pixelDepth: s.pixelDepth,
        width: s.width
      }
    } catch (e) { }
    return rr

  }
  $.fn.log = async (msgex, context) => {
    const message = `client.events.${msgex}`
    const meta =  { timestamp: new Date().toUTCString(), utime: Date.now(), context, identifiers: $.identifiers }
    $.loggerTarget({ message, meta })
  }
  $.fn.iterateLoggableEvents = (prefix, events) => {
    events.forEach((event) => {
      $._[prefix]?.(event, (e) => $.fn.log(`${prefix}.${event}`, { event: e }))
    })
  }
  $.fn.begin = () => {
    const windowEvents = ['afterprint', 'appinstalled', 'beforeinstallprompt', 'beforeprint', 'blur',  'copy', 'cut', 'devicemotion', 'deviceorientation', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'error', 'focus', 'hashchange', 'languagechange', 'load', 'message', 'offline', 'online', 'pagehide', 'pageshow', 'popstate', 'resize', 'unload', 'rejectionhandled', 'unhandledrejection']
    const documentEvents = ['copy', 'cut', 'DOMContentLoaded', 'fullscreenchange', 'keydown', 'keypress', 'keyup', 'paste', 'readystatechange', 'visibilitychange']
    const elementEvents = ['click', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mouseup'] //'mousemove']
    const htmlElementEvents = ['beforetoggle', 'cancel', 'change', 'copy', 'cut', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'focus', 'focusin', 'focusout', 'input', 'invalid', 'paste', 'reset', 'search', 'select', 'submit', 'toggle']
    $.fn.iterateLoggableEvents('w', windowEvents)
    $.fn.iterateLoggableEvents('d', documentEvents)
    $.fn.iterateLoggableEvents('el', elementEvents)
    $.fn.iterateLoggableEvents('$el', htmlElementEvents)
  }
  $.fn.expose = () => {
    if (!window) return
    window.vpcs ??= new Object({})
    if (window?.vpcs?.KtM) return;
    $.fn.add('KtM').to(window.vpcs).getter(() => $)
  }
}
export { $ as KtM }