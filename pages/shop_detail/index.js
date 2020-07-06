// pages/shop_detail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    //轮播图
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    // banner图片宽度
    bannerImgWid:'',
    // 商品信息
    shopDetail:{
      title:'周生生18k红色黄金Love Decode心形吊坠',
      newPrice:24690,
      oldPrice:45367,
      integral:88888,
    },
    currtab: 0,
    swipertab: [{ name: '商品详情', index: 0 }, { name: '规格参数', index: 1 }, { name: '配送售后', index: 2 }, { name: '运营资质', index: 3 }],

    // swiper高度自适应问题
    windowWidth: 0,
    windowHeight:0,
    // imgUrls: [...],
    imgsHeight: '400',
    current: 0,
    imgWidth: 750,
    zizhiimg:'',
    // 上滑、下拉标识
    up:false,
    address:[], 
    addressShow:false,
    addressId:'',
    shopId:'',
    //授权弹框
    setting: false,
    showModel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: "商品详情"
    });
    // 获取设备屏幕宽度
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight
        });
      }
    })
    if(options.proId){
      wx.request({
        url: app.globalData.baseUrl+'/wxCommodity/info',
        method: 'GET', 
        header: {
          'Authorization': wx.getStorageSync('token')
        },
        data: {
          id:options.proId
        },
        success (res) {
          console.log(res)
          var json = res.data.data;
          var imgs= json.imgs.split(',');
          var r = imgs.filter(function (s) {
            return s && s.trim();
         });
         json.imgs = r;
          _this.setData({
            shopDetail: json,
            shopId:options.proId
          })
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   console.log(111)
  //   this.setData({
  //     up:false
  //   });
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.windowHeight-80)
    if(this.data.up == false){
      this.setData({
        up:true,
      });
      wx.pageScrollTo({
        scrollTop: this.data.windowHeight-80,
        duration: 300
      })
    }
  },

// 获取滚动条位置
onPageScroll:function(e){ // 获取滚动条当前位置
  if(this.data.up == true){
    if(e.scrollTop == 0){
      this.setData({
        up:false
      });
    }
  }
},


  //tab切换
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
tabChange(e){
  var that = this;
  this.setData({
    currtab:e.detail.current,
  });
},
// 每张图片加载完成会执行 imageload 方法
imageLoad: function(e) {
  // console.log(e);
  // 获取图片宽高比
  const ratio = e.detail.width / e.detail.height
  if(e.currentTarget.dataset.type == 'banner'){ //banner轮播
    // 按照宽高比计算图片高度 250px 时的宽度
    const imgWidth = 250 * ratio
    this.setData({
      bannerImgWid:imgWidth
    });
  }else if(e.currentTarget.dataset.type == 'details'){ //商品详情
    // 按照宽高比计算图片宽度 100% 时的高度
    const imgHeight = this.data.windowWidth / ratio
    // 把每一张图片对应的高度记录到 imgsHeight 数组里
    this.setData({
      imgsHeight : imgHeight
    });
  }else if(e.currentTarget.dataset.type == 'zizhi'){  //运营资质图片
    // 按照宽高比计算图片宽度 100% 时的高度
    const imgHeight = this.data.windowWidth / ratio
    // 把每一张图片对应的高度记录到 imgsHeight 数组里
    this.setData({
      zizhiimg : imgHeight
    });
  }
  
},
//点击购买-->判断登录
buyBtn(e){
  var _this = this;
  var status = e.currentTarget.dataset.status;
  /**
   * 先验证是否授权、登录
   * **/ 
  //获取用户信息
  wx.getSetting({
    success: res => {
      //没有授权需要弹框
    if (!res.authSetting['scope.userInfo']) {
      _this.setData({
        showModel: true,
      })
    } else {//判断用户已经授权,判断是否登录
      _this.setData({
        showModel: false,
      })
      if(!wx.getStorageSync('token')){
        wx.showToast({
          title: '请先登录',
          icon:'none',
          duration:2000
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '../login/login?shop=ok&shopId='+_this.data.shopId,
          })
        },500);
      }else{
        if(status == 0){
          wx.showToast({
            title: '即将上线，敬请期待',
            icon:'none'
          })
        }else{
          // 获取收获地址
          wx.request({
            url: app.globalData.baseUrl+'/wxUserAddress',
            method:'GET',
            header:{
              'Authorization': wx.getStorageSync('token'),
            },
            success(res){
              _this.setData({
                address:res.data.data,
                addressShow:true
              });
              console.log(_this.data.address);
            }
          })
        }
      }
    }
  }, fail: function () {
    that.setData({
      showModel: true,
    })
  }
  })


  
},

// 选择收货地址获取id
radioChange(e) {
  console.log('radio发生change事件，携带value值为：', e.detail.value)
  this.setData({
    addressId:e.detail.value
  });
},
//取消选择地址
canlce(){
  this.setData({
    addressId:'',
    addressShow:false
  });
},
//确定选择地址 -->调用下单接口
sure(){
  var _this = this;
  console.log(111);
  if(_this.data.addressId ==""){
    wx.showToast({
      title: '请选择收货人',
      icon:'none'
    })
  }else{
    console.log(JSON.stringify(
      {
        id:_this.data.shopId,
        userAddressId:_this.data.addressId
      }
    ))
    // 下单
    wx.request({
      url: app.globalData.baseUrl+'/wxCommodityOrder',
      method:'POST',
      header:{
        'Authorization': wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      data:JSON.stringify(
        {
          id:_this.data.shopId,
          userAddressId:_this.data.addressId
        }
      ),
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          wx.request({
            url: app.globalData.baseUrl+'/wxCommodityOrder/getWeChatPayParams?id='+res.data.data,
            method:'GET',
            header:{
              'Authorization': wx.getStorageSync('token'),
            },
            success(res){
              console.log(res);
              if(res.data.errcode == 0){
                wx.requestPayment(
                  {
                  timeStamp: res.data.data.orderString.timeStamp,
                  nonceStr: res.data.data.orderString.nonceStr,
                  package: res.data.data.orderString.package,
                  signType: res.data.data.orderString.signType,
                  paySign: res.data.data.orderString.sign,
                  success:function(res){
                      console.log(res);
                      if(res.errMsg == "requestPayment:ok"){
                        wx.navigateTo({
                          url: '../pay_success/index?type=shop',
                        })
                      }else{
                        wx.showToast({
                          title: '支付失败！',
                          icon:'none',
                          duration:3000
                        })
                      }
                  },
                  fail:function(res){},
                    complete:function(res){}
                  })
              }
              // _this.setData({
              //   address:res.data.data,
              //   addressShow:false
              // });
            }
          })
        }else{
          // 60002=商品不存在
          // 60003=商品暂未开放
          // 60004=能量值未达标，不能购买
          // 60005=商品订单异常
          // 60006=请勿重复取消订单
          // 60007=当前状态不能取消订单，请联系客服
          wx.showToast({
            title: res.data.errmsg,
            icon:'none'
          })

        }
      }
    })
  }
  




  _this.setData({
    addressShow:false
  });
},





getUserInfo: function(e) {
  var _this = this;
  app.globalData.userInfo = e.detail.userInfo
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
  setTimeout(function(){
    wx.navigateTo({
      url: '../login/login?shop=ok&shopId='+_this.data.shopId,
    })
  },300);
  
},
quxiao: function () {
  var that = this;
  that.setData({
    showModel: false
  })
  wx.reLaunch({
    url: '../shop_detail/index?proId='+this.data.shopId,
  })
},
nones: function () {
  var that = this;
  that.setData({
    showModel: false,
    setting: false
  })
},
//同意授权后
callback: function () {
  var that = this;
  that.setData({
    showModel: true,
    setting: false
  })
},

//取消去设置页
cancel: function () {
  var that = this;
  that.setData({
    showModel: false,
    setting: false
  })
  wx.reLaunch({
    url: '../shop_detail/index?proId='+this.data.shopId,
  })
},
})