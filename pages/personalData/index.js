// pages/personalData/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    dataInfo: {},
    img_url:''
  },
  changeAvatar:function(){
    const _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0];
        _this.setData({
          personImage: tempFilePath
        })
        wx.uploadFile({
           url: 'http://39.99.175.166:9000/admin/image/AliYunImgUpload', //图片上传至开发服务器接口
           filePath: tempFilePath,
           name: 'file',
           formData: {},
           success(res) {
             let icon = this.dataInfo.icon
             const data = res.data;
             _this.setData({
              icon: data,
            })
           }
         })   
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "个人资料"
    });
    this.dataList()
  },
  dataList: function(e) {
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

  userInfo: function(e) {
    console.log(e)
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/wxUser/update/info',
      method:'POST',
      dataType:'json',
      contentType: 'application/json',
      data:JSON.stringify({
        icon: e.detail.value.icon_img,
        nickName: e.detail.value.nickName,
        address: e.detail.value.address,
      }),
      success (res) {
        console.log(res);
            if (res.statusCode == 200){
              wx.showToast({
                title: '修改成功',
                icon:'none',
                duration:2000
              })
            }
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