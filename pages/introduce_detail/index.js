Page({
  data: {
    num: ''
  },
  onLoad: function(options) {
    this.setData({
      num: options.str
    })
  }
})
