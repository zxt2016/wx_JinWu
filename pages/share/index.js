//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrl:app.globalData.imgUrl,
    token:wx.getStorageSync('token'),
    dataInfo:[],
  },
  onLoad: function () {
    
    this.dataList();
  },
  dataList: function() { 
    var _this = this;
    wx.request({
      url: app.globalData.baseUrl+'/wxOrder/getProjectList',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('token'),
      },
      data:{
        current:1,
        size:10,
      },
      success (res) {
        console.log(res) 
        var data = res.data.data.records;
        for(var i=0;i<data.length;i++){
          data[i].capacity = (data[i].capacity/1000).toFixed(2);
        }
        _this.setData({
          dataInfo: data
        })
      }
    })
  },
  shareEvent(e){
    var id = e.currentTarget.dataset.id;
    var data = this.data.dataInfo;
    for(var i=0;i<data.length;i++){
      if(id = data[i].id){
        wx.setStorageSync('shareData',data[i]);
      }
    }
    setTimeout(function(){
      wx.navigateTo({
        url: '../share_card/index',
      })
    },300); 
  },
})
