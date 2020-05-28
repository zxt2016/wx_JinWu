// pages/station_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var id = ''
      this.setData({
        id: options.id
      })
      var _this = this
    wx.request({
      url: 'http://192.168.1.4:8080/photovoltaic/wxRecruitOrder/getStationDetail',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODcwMTY1MTA0MyIsImF1dGgiOiJST0xFX1VTRVIiLCJpZCI6MTI2NTgyNTA4NDkwMTQzMzM0NiwidGVsIjoiMTg3MDE2NTEwNDMiLCJleHAiOjE1OTA2NDY3NDZ9.MMx4cNKzZLtn14GYcZ-tTpkA2rmsGDu8zyESSJ0Rk4IzwkCF3K4R02Ev2wVeEHupBCuju8b76lKivuE8uMX_Fw',
        'openId': '1'
      },
      data: {
        stationId: id
      },
      success (res) {
        console.log(res) 
        _this.setData({
          stationList: res.data.data.records,
        })
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})