const ts = () => `[${new Date().toISOString()}]`
module.exports = (...args) => console.log(ts(), ...args)
