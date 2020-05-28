// pages/partnership/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{},
    imgUrl:app.globalData.imgUrl,
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