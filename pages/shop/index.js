// pages/shop/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      shopData:[],
      logoWidth:[],
      imgUrl:app.globalData.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var _this = this;
    wx.setNavigationBarTitle({
      title: "低碳圈"
    });

    wx.request({
      url: app.globalData.baseUrl+'/wxCommodity',
      method: 'GET', 
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        size: 10,
        current: 1,
      },
      success (res) {
        console.log(res) 
        _this.setData({
          shopData: res.data.data.records,
        })
      }
    })

  },
  shopDetail(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../shop_detail/index?proId='+id,
    })
  },
  //限购说明
  xianGou(){
    wx.showToast({
      title: '每人限购一件商品',
      icon:'none',
    })
  },

  /**
   * 商品列表logo图片加载完成后根据固定高度计算宽度
   * **/
  imageLoad: function(e) {
    var index = e.currentTarget.dataset.index;
    // 获取图片宽高比
    const ratio = e.detail.width / e.detail.height
    // 按照宽高比计算图片高度 100px 时的宽度
    const imgWidth = 100 * ratio;
    this.data.shopData[index].width = imgWidth;
    this.setData({
      shopData:this.data.shopData
    });
  },
})