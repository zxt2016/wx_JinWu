//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "我的"
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  personal_data: function(e) {
    wx.navigateTo({
      url: '../personalData/index',
    })
  },

  invite_btn: function(e) {
    wx.navigateTo({
      url: '../invite/index',
    })
  },

  share_btn: function(e){
    wx.navigateTo({
      url: '../share/index',
    })
  },
  partnership: function(e) {
    wx.navigateTo({
      url: '../partnership/index',
    })
  },
  project: function(e) {
    wx.navigateTo({
      url: '../project/index',
    })
  },

  order: function(e) {
    wx.navigateTo({
      url: '../order/index',
    })
  },
  contact_us: function(e) {
    wx.navigateTo({
      url: '../about_us/index',
    })
  }
})
