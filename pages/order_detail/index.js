// pages/order_detail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    stationList:{},
    recruitId:'' ,
  },

  dataList: function(recruitId) { 
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/wxRecruitOrder/getStationList',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': app.globalData.token,
        'openId': '1'
      },
      data: {
        size: '10',
        current: '1',
        recruitId: recruitId, 
      },
      success (res) {
        console.log(res) 
        _this.setData({
          stationList: res.data.data.records,
        })
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      recruitId: options.str
    })
    console.log(options.str)
    this.dataList(options.str);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  station_detail: function(e) {
    wx.navigateTo({
      url: '../station_detail/index',
    })
  }
})