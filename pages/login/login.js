// pages/login/login.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tip:true,
    phone:'',
    code:'',
    inviteCode:'',

    //倒计时参数
    InterValObj:'', //timer变量，控制时间
    count: 60,  //间隔函数，1秒执行
    curCount:'', //当前剩余秒数
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //表单提交
    formSubmit(e){
      var phone = e.detail.value.phone;
      var code = e.detail.value.code;
      var inviteCode = e.detail.value.inviteCode;
      if(!phone){
        wx.showToast({
          title: '请输入手机号',
          icon:'none',
          duration: 3000
        })
      } else if (/^(13[0-9]|14[5-9]|15[012356789]|16[0-9]|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(phone) != true){
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 3000
        })
      }else if(!code){
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 3000
        })
      }else{
        console.log(JSON.stringify({
          phone: phone,
          validateCode: code,
          invitedCode: inviteCode
        }));
        //登录并绑定头像、昵称
        wx.request({
          url: app.globalData.baseUrl+'/login',
          method:'POST',
          dataType:'json',
          contentType: 'application/json',
          data:JSON.stringify({
            phone:phone,
            validateCode:code,
            invitedCode: inviteCode,
            avatarUrl:app.globalData.userInfo.avatarUrl,
            nickName:app.globalData.userInfo.nickName
          }),
          success:res=>{
            console.log(res);
            if (res.statusCode == 200){
              //存储token
              app.globalData.token = res.data.data.access_token;
              wx.setStorageSync('token', res.data.data.access_token);
              console.log(app.globalData.token);
              wx.request({
                url: app.globalData.baseUrl +'/wxUser/code2Session?code='+app.globalData.code,
                method:'POST',
                header: {
                  'content-type': 'application/json',
                  'Authorization': res.data.data.access_token,
                },
                success: rea => {
                  console.log(rea);
                  wx.setStorageSync('userId', rea.data.data.id);
                  wx.setStorageSync('openId', rea.data.data.openid);
                  wx.setStorageSync('phone', rea.data.data.phone);
                  wx.setStorageSync('userName', rea.data.data.username);

                  wx.showToast({
                    title: '登录成功',
                    icon:'none',
                    duration:2000
                  })
                  setTimeout(function(){
                    wx.switchTab({
                      url: '../index/index',
                    })
                  },2000);
                }
              })

              
            }
          }
        })
      }
    },
    changeVal(e){
      var text = e.currentTarget.dataset.type;
      var input_val = e.detail.value;
      if(text == 'phone'){
        if(!input_val){
          wx.showToast({
            title: '请输入手机号',
            icon:'none',
            duration: 3000
          })
        } else if (/^(13[0-9]|14[5-9]|15[012356789]|16[0-9]|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(input_val) != true){
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            duration: 3000
          })
        }else{
            this.setData({
              phone:input_val
            });
        }
      }else if(text == 'code'){
        if(!input_val){
          wx.showToast({
            title: '请输入短信验证码',
            icon:'none',
            duration: 3000
          })
        }
      }
      
    },
    //获取验证码-倒计时
    sendMessage() {
      var _this = this;
      if(!_this.data.phone){
        wx.showToast({
          title: '请输入手机号',
          icon:'none',
          duration: 3000
        })
      } else if (/^(13[0-9]|14[5-9]|15[012356789]|16[0-9]|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(_this.data.phone) != true){
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 3000
        })
      }else{
        //向后台发送处理数据
        wx.request({
          url: app.globalData.baseUrl+'/sms/send',
          method:'POST',
          dataType:'json',
          header:{
            'Authorization':app.globalData.token,
            'content-type': 'application/json'
          },
          data:{
            phone:_this.data.phone,
          },
          success(res){
            console.log(res);
            if(res.data.errcode == 0){
              //设置button效果，开始计时
              _this.setData({
                tip:false,
                curCount:_this.data.count,
              });
              var times = setInterval(function(){
                var time = _this.data.curCount;
              
                if (time == 0) {
                    clearInterval(times);//停止计时器
                    _this.setData({
                      tip:true
                    });
                }else {
                  time--;
                  _this.setData({
                    curCount:time
                  });
                }
              }, 1000)
              wx.showToast({
                title: '验证码发送成功',
                icon:'none',
                duration: 3000
              })
            }else{
              console.log(111);
              if(res.data.errcode == 30001){
                wx.showToast({
                  title: '次数已达上限,请30分钟后操作',
                  icon:'none',
                  duration: 3000
                })
              }else{
                wx.showToast({
                  title: res.data.errmsg,
                  icon:'none',
                  duration: 3000
                })
              }
              
            }
          },
        })
      }
    },
  
  
  }
})
