// pages/purchase/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //认购份额
    num:1,
    minusStatus:'disable',
    imgUrl:app.globalData.imgUrl,
    proData:{},
    // 最大可买份额
    maxNum:0,
    //协议是否同意
    status:true,
    singleAmount:'',
    oldAmount:'',
    // 用户当前状态
    userType:0,
    codeShow:false,
    yqCode:'',
    proId:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options);
    //根据招募单ID获取详情
    if(options.proId){
      wx.request({
        url: app.globalData.baseUrl+'/wxRecruitOrder/recruitOrderDetail',
        method:'GET',
        data:{
          id:options.proId
        },
        success(res){
          console.log(res);
          if(res.data.errcode == 0){
            var data = res.data.data;
            data.capacity = (data.capacity/1000).toFixed(2);
            data.totalInvestment = (data.totalInvestment/10000).toFixed(2);
            data.singleInvestment = (data.singleInvestment/10000).toFixed(2);

            _this.setData({
              proData:data,
              maxNum:data.remainingNum,
              singleAmount:data.singleAmount.toFixed(2),
              oldAmount:data.singleAmount,
              proId:options.proId
            })
          }else{
            wx.showToast({
              title: res.data.errmsg,
              icon:'nnone'
            })
          }
        
        },
      })
    }

  },
    //事件处理函数
    /*点击减号*/
    bindMinus: function() {
      var num = this.data.num;
      if (num>1) {
      num--;
      this.setData({
        singleAmount:(num*this.data.oldAmount).toFixed(2),
      });
      }
      var minusStatus = num>1 ? 'normal':'disable';
      this.setData({
        num:num,
        minusStatus:minusStatus,
      })
    },
    /*点击加号*/
    bindPlus: function() {
      var num = this.data.num;
      if(num >= this.data.maxNum){
        num=this.data.maxNum;
        wx.showToast({
          title: '份额只剩这么多了！',
          icon:'none',
          duration:3000
        })
      }else{
        num++;
        this.setData({
          singleAmount:(num*this.data.oldAmount).toFixed(2),
        });
      }
      
      var minusStatus = num > 1 ? 'normal' : 'disable';
      this.setData({
        num:num,
        minusStatus: minusStatus
      })
    },
    /*输入框事件*/
    bindManual: function(e) {
      var num = e.detail.value;
      if(num >= this.data.maxNum){
        num=this.data.maxNum;
      }
      var minusStatus = num > 1 ? 'normal' : 'disable';
      this.setData({
        num:num,
        minusStatus: minusStatus
      })
    },

    //跳转协议页面
    agreement_btn: function(e) {
      // wx.showModal({
      //   title: '提示',
      //   content: '该协议包含商业保密信息，若您想要了解详情，请联系客服：17631123590。',
      //   success (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
      wx.navigateTo({
        url: "../xieYi/subscriptionDeposit_agreement/index",
      })
    },
    // 支付事件
    payMoney(){
      var _this = this;
      var stat = this.data.status;
      if(stat == true){
        //先验证用户身份
        wx.request({
          url: app.globalData.baseUrl+'/wxRecruitOrder/checkUser',
          method:'GET',
          header:{
            'Authorization': wx.getStorageSync('token'),
          },
          success(res){
            console.log(res);
            if(res.data.data.type == '1'){
              wx.showToast({
                title: '请填写邀请码',
                icon:'none',
                duration:3000
              })
              _this.setData({
                userType:res.data.data.type,
                codeShow:true
              });

            }else if(res.data.data.type == '2'){
                wx.showToast({
                  title: '请完成实名认证',
                  icon:'none',
                  duration:3000
                })
                setTimeout(function(){
                  wx.navigateTo({
                    url: '../realName_renZheng/index?src=purchase&proId='+_this.data.proId,
                  })
                },1000);
            }else{
                var id = _this.data.proData.id;
                var num = _this.data.num;
                wx.request({
                  url: app.globalData.baseUrl+'/wxRecruitOrder/getRecruitOrder?id='+id+'&num='+num,
                  method:'GET',
                  header:{
                    'Authorization': wx.getStorageSync('token'),
                  },
                  success(res){
                    console.log(res);
                    if(res.data.errcode == 0){
                      var orderId = res.data.data;
                      //根据订单号获取微信支付参数
                      wx.request({
                        url: app.globalData.baseUrl+'/wxRecruitOrder/getWeChatPayParams?id='+orderId,
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
                                      url: '../pay_success/index',
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
                        },
                      })
                    }else{
                      wx.showToast({
                        title: res.data.errmsg,
                        icon:'none',
                        duration:2000
                      })
                    }
                    
                  },
                })
            }
          },

        })
      }else{
        wx.showToast({
          title: '请勾选《发电站认购协议》',
          icon:'none',
          duration:3000
        })
      }
      
    },
    // 是否同意协议
    xieYiBtn(){
      var stat = this.data.status;
      if(stat == true){
        this.setData({
          status:false
        });
      }else{
        this.setData({
          status:true
        });
      }
    },
    codeVal(e){
      console.log(e);
      var val = e.detail.value;
      this.setData({
        yqCode:val
      });
    },
    cancel(){
      this.setData({
        codeShow:false
      });
    },
    sure(){
      var _this = this;
      var code = this.data.yqCode;
      if(code == ''){
        wx.showToast({
          title: '请输入邀请码',
          icon:'none'
        })
      }else{
        wx.request({
          url: app.globalData.baseUrl+'/wxUser/inputInvitedCode',
          method:'POST',
          header:{
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data:JSON.stringify({
            invitedCode:code
          }),
          success(res){
            console.log(res);
            if(res.data.errcode == 0){
              _this.payMoney();
            }else{
              wx.showToast({
                title: res.data.errmsg,
                icon:'none'
              })
            }
          },
        })
      }
    },
  
})