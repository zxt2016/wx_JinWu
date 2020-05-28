// pages/project/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      projectList:{},
      totalNum:'',
      show_btn: false,
      imgUrl:app.globalData.imgUrl,
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.str == 'my'){

      this.setData({
        show_btn: true
        })
    } 
  },
  dataList: function() { 
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/wxOrder/getProjectList',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': app.globalData.token,
        'openId': '1'
      },
      data: {
        size: '10',
        current: '1',
      },
      success (res) {
        console.log(res) 
        _this.setData({
          projectList: res.data.data.records,
          totalNum: res.data.data.total,
        })
      }
    })
  },

  searchBtn: function(e) {
    var _this = this
    var name = e.detail.value
    wx.request({
      url: app.globalData.baseUrl+'/wxOrder/getProjectList',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': app.globalData.token,
        'openId': '1'
      },
      data: {
        size: '10',
        current: '1',
        projectName: name
      },
      success (res) {
        console.log(res) 
        _this.setData({
          projectList: res.data.data.records,
          totalNum: res.data.data.total
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.dataList();
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