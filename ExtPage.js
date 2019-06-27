const ExtPage = options => {
  let data = {}
  const originalOnLoadFunc = options.onLoad
  options.onLoad = function(...args) {
    this.data = new Proxy(this.data, {
      set: (target, key, value, receiver) => {
        data[key] = value
        return Reflect.set(target, key, value, receiver);
      }
    })
    return originalOnLoadFunc ? originalOnLoadFunc.call(this, ...args) : undefined
  }
  for (let key in options) {
    if (typeof options[key] === 'function') {
      const originalFunc = options[key]
      options[key] = function(...args) {
        let result = originalFunc.call(this, ...args)
        Object.getOwnPropertyNames(data).length && this.setData(data)
        return result
      }
    }
  }
  return Page(options)
}

export default ExtPage