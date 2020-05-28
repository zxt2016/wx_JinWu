const app = getApp();
Page({
  data: {
    num: '',
    imgUrl:app.globalData.imgUrl,
  },
  onLoad: function(options) {
    this.setData({
      num: options.str
    })
  }
})
