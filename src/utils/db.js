const Set = (key, value) => {
  wx.setStorageSync(key, value)
}

const Get = (key) => {
  return wx.getStorageSync(key)
}

module.exports = {
  Set,
  Get
}
