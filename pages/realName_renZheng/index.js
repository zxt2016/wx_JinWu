// pages/personalData/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    realName:'张111',
    idCard:'',
    bankCard:'',
    // 上层页面
    preSrc:'',
    // 招募单id
    proId:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "实名认证"
    });
    if(options.src){
      this.setData({
        preSrc:options.src,
        proId:options.proId
      });
    }
  },

  adInputChange: function(e) {
    this.setData({
      realName:e.detail.value.realName,
      idCard:e.detail.value.idCard,
      bankCard:e.detail.value.bankCard,
    });
  },
  //  表单提交
  realName: function(e) {
    console.log(e)
    var _this = this
    var name = e.detail.value.realName;
    var idCard = e.detail.value.idCard;
    var bankCard = e.detail.value.bankCard;
    console.log(name,idCard,bankCard);
    if(name ==""){
      wx.showToast({
        title: '请输入真实姓名',
        icon:'none',
        duration:2000
      })
    }else if(idCard == ""){
      wx.showToast({
        title: '请输入身份证号码',
        icon:'none',
        duration:2000
      })
    }else if(bankCard == ""){
      wx.showToast({
        title: '请输入银行卡号',
        icon:'none',
        duration:2000
      })
    }else{
      wx.request({
        url: app.globalData.baseUrl+'/wxUser/nameAuthentication',
        method:'POST',
        dataType:'json',
        contentType: 'application/json',
        header: {
          'content-type': 'application/json',
          'authorization': wx.getStorageSync('token'),
        },
        data:JSON.stringify({
          realName: name,
          idCard: idCard,
          bankCard: bankCard,
        }),
        success (res) {
          console.log(res);
              if (res.data.errcode == 0){
                wx.showToast({
                  title: res.data.data,
                  icon:'none',
                  duration:2000
                })
                if(_this.data.preSrc != ''){
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '../'+_this.data.preSrc+'/index?proId='+_this.data.proId,
                    })
                  },2000);
                }
              }else{
                wx.showToast({
                  title: res.data.errmsg,
                  icon:'none',
                  duration:2000
                })
              }
        }
      })
    }
    
  },
})