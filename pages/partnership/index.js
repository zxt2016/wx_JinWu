// pages/partnership/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{}
  },
//跳转详情页
partnership_detail: function(e){
  wx.navigateTo({
    url: '../partnership_detail/index',
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.myData()
  },

  myData: function(e) {
    var _this = this
    wx.request({
      url: 'http://192.168.1.4:8080/photovoltaic/wxUser/userCompanyInfo',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODcwMTY1MTA0MyIsImF1dGgiOiJST0xFX1VTRVIiLCJpZCI6MTI2NTgyNTA4NDkwMTQzMzM0NiwidGVsIjoiMTg3MDE2NTEwNDMiLCJleHAiOjE1OTA2NTk0MjR9.pyaiZmt9J1Lb_XROxAtj35REEM5FwrP_B1-9uH3tnFfzkHR_jtjx1BlObi-TdXpazPzZ-IdAiWmK-S8k-SDqLQ',
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