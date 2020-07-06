// pages/station/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationList:{},
    recruitId:'' ,
    projectName: '',
    imgUrl:app.globalData.imgUrl,
    name:'',
    //上拉加载
    limit: 5,//显示数据量
    page: 1,//当前页
    load: true,
    loading: false,//加载动画的显示
    total:0, //数据总数
  },

  station_detail: function(e) {
      wx.navigateTo({
        url: '../station_detail/index',
      })
  },
  dataList: function(recruitId) { 
    var _this = this;
    console.log(recruitId);
    wx.request({
      url: app.globalData.baseUrl+'/wxRecruitOrder/getStationList',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        current:_this.data.page,
        size:_this.data.limit,
        recruitId: recruitId, 
      },
      success (res) {
        console.log(res) 
        _this.setData({
          stationList: res.data.data.records,
          total:res.data.data.total,
          page:_this.data.page*1+1
        })
      }
    })
  },

  searchBtn: function(e) {
    var _this = this
    _this.setData({
      name:e.detail.value
    })
    wx.request({
      url: app.globalData.baseUrl+'/wxRecruitOrder/getStationList',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        current:_this.data.page,
        size:_this.data.limit,
        recruitId: _this.recruitId, 
        name: _this.name,
      },
      success (res) {
        console.log(res) 
        _this.setData({
          stationList: res.data.data.records,
          total:res.data.data.total,
          page:_this.data.page*1+1
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      recruitId: options.str,
      projectName: options.name
    })
    this.dataList(options.str);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
  },
  station_btn: function(e) {
    wx.navigateTo({
      url: '../station_detail/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
onReachBottom: function () {
  var that = this;
  if (that.data.load) {//全局标志位，方式请求未响应是多次触发
    console.log(that.data.stationList.length)
    if (that.data.stationList.length >= that.data.total) {
      wx.showToast({
        title: '已经到底了！',
        icon:"none",
        duration:3000
      })
    }else{
        that.setData({  
          load: false,
          loading: true,//加载动画的显示
        })
        wx.request({
          url: app.globalData.baseUrl+'/wxRecruitOrder/getStationList',
          method:'GET',
          header:{'Authorization':that.data.token},
          contentType: 'application/json;charset=UTF-8 ',
          data:{
            current:that.data.page,
            size:that.data.limit,
            name: that.data.name,
            recruitId: that.data.recruitId, 
      },
      success (res) {
        console.log(res) 
        var content = that.data.stationList.concat(res.data.data.records);
        that.setData({
          stationList: content,
          page: that.data.page * 1 + 1,
          load: true,
          loading: false,
        })
      },
          fail: function (res) {
              that.setData({
                loading: false,
                load: true,
              })
              wx.showToast({
                title: '数据异常',
                icon: 'none',
                duration: 2000,
              }) 
          },
          complete: function (res) { },
        })
      }
    }
},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})