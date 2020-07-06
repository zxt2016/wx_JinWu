// pages/pay_success/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    tip:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.type == 'shop'){
      this.setData({
        tip:2
      });
     }
  },
  //返回首页
  backHome(){
    wx.reLaunch({
      url: '../index/index?src=paySuccess',
      success: function (e) { 
        var page = getCurrentPages().pop(); 
        if (page == undefined || page == null) return; 
        page.onLoad(); 
      }
    })
  },
  //查看订单
  lookOrder(){
    if(this.data.tip != 2){
      wx.reLaunch({
        url: '../order/index?tip=0', //招募单订单
      })
    }else{
      wx.reLaunch({
        url: '../order/index?tip=1', //低碳圈订单
      })
    }
    
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