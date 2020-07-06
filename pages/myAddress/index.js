// pages/myAddress/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: "地址管理"
    });
    wx.request({
      url: app.globalData.baseUrl+'/wxUserAddress',
      method:'GET',
      header:{
        'Authorization': wx.getStorageSync('token'),
      },
      success(res){
        _this.setData({
          address:res.data.data,
        });
        console.log(_this.data.address);
      }
    })
  },
  // 编辑
  editBtn(e){
    var index = e.currentTarget.dataset.index;  
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('address', JSON.stringify(this.data.address[index]));
    wx.navigateTo({
      url: '../myAddress_addEdit/index?id='+id,
    })
  },
  // 删除
  delBtn(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;  
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确定删除此条数据？',
      success (res) {
        if (res.confirm) {
          console.log(id);
          wx.request({
            url: app.globalData.baseUrl+'/wxUserAddress/delete?id='+id,
            method:'POST',
            header:{
              'Authorization': wx.getStorageSync('token'),
            },
            success(res){
              console.log(res);
              if(res.data.errcode == 0){
                wx.showToast({
                  title: '删除成功',
                  icon:'none'
                })
                setTimeout(function(){
                  _this.onLoad();
                },800);
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  add(){
    wx.navigateTo({
      url: '../myAddress_addEdit/index',
    })
  },
  
})