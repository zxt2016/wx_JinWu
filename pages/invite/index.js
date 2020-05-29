// pages/invite/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
  },

  //跳转邀请规则页面
  invite_rules: function(e) {
    wx.navigateTo({
      url: '../invite_rules/index',
    })
  },
  /**
   * 用户邀请好友
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "金乌光联，共享光伏电站，共享绿色财富。",
      path: "/pages/share2/share2?id=" + that.data.userId + "&src=" + that.data.shareBg + "&tab2=" + that.data.tab2,
      success: function (res) {
        // console.log(res);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

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