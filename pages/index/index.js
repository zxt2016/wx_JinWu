//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //轮播图效果
    banner_img: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    circular: true,
    //电站tab切换标识
    stationType:1,
    //星系旋转标识
    step:1,
    //星球数据
    starData:[
      {
        num:0,
      },
      {
        num:1,
      },
      {
        num:2,
      },
      {
        num:3,
      },
      {
        num:4,
      },
    ],

  },
  //事件处理函数
  bindViewTap: function() { 
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
    this.getBannerList();
  },
  onShow(){
    var _this = this;
    // setInterval(function(){
    //   _this.starRotate();
    // },3000);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getBannerList: function() { 
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/advertising/getBannertList',
      method: 'GET', 
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        var img_list = []
        for (var i = 0; i < res.data.data.length; i++) {
          img_list.push(res.data.data[i].img,)
        }  
        _this.setData({
          banner_img: img_list
        })
      }
    })
  },
  //电站切换
  stationTab: function(e){
    this.setData({
      stationType:e.currentTarget.dataset.num
    });
  },
  //星系转动-->从右向左
  starRotate:function(){
    var _this = this,
    starData = _this.data.starData
    //设定最大值为5，
    for(var i=0;i<starData.length;i++){
      if(starData[i].num == 0){
        starData[i].num = starData.length-1;
      }else{
        var val = starData[i].num;
        starData[i].num = val-1;
      }
    }
    _this.setData({starData});
  },

  
})
