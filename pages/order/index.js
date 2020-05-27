
    // pages/order/order.js
    Page({
     
      /**
      * 页面的初始数据
      */
      data: {
      currtab: 0,
      swipertab: [{ name: '待支付', index: 0 }, { name: '支付中', index: 1 }, { name: '定金支付完成', index: 2 }, { name: '已完成', index: 3 }, { name: '取消', index: 4 }],
      },
       
      /**
      * 生命周期函数--监听页面加载
      */
      onLoad: function (options) {
       
      },
      /**
      * 生命周期函数--监听页面初次渲染完成
      */
      onReady: function () {
      // 页面渲染完成
      this.getDeviceInfo()
      this.orderShow()
      },
       
      getDeviceInfo: function () {
      let that = this
      wx.getSystemInfo({
      success: function (res) {
      that.setData({
      deviceW: res.windowWidth,
      deviceH: res.windowHeight
      })
      }
      })
      },
       
      /**
      * @Explain：选项卡点击切换
      */
      tabSwitch: function (e) {
      var that = this
      if (this.data.currtab === e.target.dataset.current) {
      return false
      } else {
      that.setData({
      currtab: e.target.dataset.current
      })
      }
      },
       
      tabChange: function (e) {
      this.setData({ currtab: e.detail.current })
      this.orderShow()
      },
  //跳转详情页面
  order_detail: function(e) {
    wx.navigateTo({
      url: '../order_detail/index',
    })
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
  