const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取能量记录数据
    record:[],
    //累计收取能量
    total:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var _this = this;
    
    console.log(option);
    //查询用户记录
    wx.request({
      url: app.globalData.baseUrl+'/wxEnergyStatistics/list',
      method:'GET',
      header:{'Authorization':app.globalData.token},
      contentType: 'application/json;charset=UTF-8 ',
      data:{
        current:1,
        size:10
      },
      success(res){
        console.log(res);
        if(res.statusCode == 200){
          _this.setData({
            record:res.data.data.records,
            total:option.total
          });
        }
      },
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