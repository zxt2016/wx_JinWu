//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrl:app.globalData.imgUrl,
    token:wx.getStorageSync('token'),
  },
  onLoad: function () {
    
    
  },
 
})
