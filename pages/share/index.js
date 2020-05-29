//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrl:app.globalData.imgUrl,
    token:wx.getStorageSync('token'),
    dataInfo:{}
  },
  onLoad: function () {
    
    this.dataList();
  },
  dataList: function() { 
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/wxUser/userCompanyInfo',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': app.globalData.token,
        'openId': '1'
      },
      success (res) {
        console.log(res) 
        _this.setData({
          dataInfo: res.data.data.wxCompanyList
        })
      }
    })
  }
 
})
