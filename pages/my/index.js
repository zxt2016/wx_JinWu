//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    dataInfo: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrl:app.globalData.imgUrl,
    //授权弹框
    setting: false,
    showModel: false,
    token:wx.getStorageSync('token'),
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

    var token = wx.getStorageSync('token');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      if(!token){
        wx.showToast({
          title: '登录失效，请重新登录',
          icon:'none',
          duration:3000
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '../login/login',
          })
        },2000);
      }

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
    this.myData();

    // if(){}





  },
  onShow(){
    var that = this;
    //判断用户是否授权
   wx.getSetting({
    success: (res) => {
      //没有授权需要弹框
      if (!res.authSetting['scope.userInfo']) {
        that.setData({
          showModel: true,
        })
      } else {//判断用户已经授权。不需要弹框
        that.setData({
          showModel: false,
        })
      }
    }, fail: function () {
      that.setData({
        showModel: true,
      })
    }
  })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '../login/login',
      })
    },300);
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
      url: '../project/index?str=my',
    })
  },
  myEnergy: function(e) {
    wx.navigateTo({
      url: '../myEnergy/index',
    })
  },
  gongYi:function(e){
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon:'none',
      duration:3000
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
  },
  myData: function(e) {
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/wxUser/userCompanyInfo',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'Authorization': _this.data.token,
        'openId': '1'
      },
      success (res) {
        console.log(res) 
        _this.setData({
          dataInfo: res.data.data
        })
      }
    })
  },
  quxiao: function () {
    var that = this;
    that.setData({
      showModel: false
    })
    wx.reLaunch({
      url: '../index/index',
    })
  },
  nones: function () {
    var that = this;
    that.setData({
      showModel: false,
      setting: false
    })
  },
  //同意授权后
  callback: function () {
    var that = this;
    that.setData({
      showModel: true,
      setting: false
    })
  },

  //取消去设置页
  cancel: function () {
    var that = this;
    that.setData({
      showModel: false,
      setting: false
    })
    wx.reLaunch({
      url: '../index/index',
    })
  },
})
