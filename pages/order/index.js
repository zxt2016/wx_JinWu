
    // pages/order/order.js
    const app = getApp();
    Page({
     
      /**
      * 页面的初始数据
      */
      data: {
      imgUrl:app.globalData.imgUrl,
      order_list: {},  
      currtab: 0,
      swipertab: [{ name: '待支付', index: 0 }, { name: '定金支付完成', index: 1 }, { name: '已完成', index: 2 }, { name: '取消', index: 3 }],
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
      
    orderShow: function () {
      var that = this
      switch (this.data.currtab) {
      case 0:
      that.orderList(0)
      break
      case 1:
      that.orderList(1)
      break
      case 2:
      that.orderList(2)
      break
      case 3:
      that.orderList(3)
      break
      }
    },

      orderList: function(num) { 
        console.log(num)
        var _this = this
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/getList',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'authorization': app.globalData.token,
            'openId': '1'
          },
          data: {
            size: '10',
            current: '1',
            status: num,
          },
          success (res) {
            console.log(res) 
            _this.setData({
              order_list: res.data.data.records
            })
          }
        })
      },

      cancle_btn: function(e) {
        var order_id = e.currentTarget.id
        var that = this
        wx.showModal({
          title: '提示',
          content: '是否取消该订单？取消后将不能恢复。',
          success:function(res){
                if(res.confirm){
                  that.cancle_order(order_id);
                  console.log('弹框后点确定')
                }else{
                    console.log('弹框后点取消')
                }
          }
        })
      },

      cancle_order: function(order_id) {
        var _this = this
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/cancelOrder',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'authorization': app.globalData.token,
            'openId': '1'
          },
          data: {
            id: order_id
          },
          success (res) {
            if( res.data.errcode == 1){
              var that = this
              wx.showToast({
                title: res.data.errmsg,
                icon:'loading',
                duration:2000
              })
            }else{
              var that = this
              wx.showToast({
                title: '取消成功',
                icon:'success',
                duration:2000
              })
            }
          }
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
  