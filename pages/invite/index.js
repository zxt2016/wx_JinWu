// pages/invite/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    userCode:'',
    num:'',
    list:[],
    imgUrl:app.globalData.imgUrl,
    userInfo:wx.getStorageSync('userInfo'),
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
    console.log(wx.getStorageSync('userInfo').nickName);
    console.log("pages/login/login?code=" + that.data.userCode);
    return {
      title: wx.getStorageSync('userInfo').nickName+"邀请您加入低碳光伏合伙人-共建低碳，共享收益。",
      path: "pages/login/login?code=" + that.data.userCode,
      imageUrl:'https://www.jwpower.cn/image/invite_logo.png',
      success: function (res) {
        console.log(res);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "邀请好友"
    });
    var _this = this;
    wx.request({
      url: app.globalData.baseUrl+'/wxUser/invited/List',
      method:'GET',
      header: {
        'content-type': 'application/json',
        'Authorization':wx.getStorageSync('token')
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          _this.setData({
            userCode:res.data.data.code,
            num:res.data.data.num,
            list:res.data.data.list
          });
        }else if(res.data.errcode == 41001){
          wx.showToast({
            title: '登录超时，请重新登录',
            icon:'none',
            duration:3000
          })
          setTimeout(function(){
            wx.navigateTo({
              url: '../login/login',
            })
          },2000);
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
})