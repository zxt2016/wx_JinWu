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
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //表单提交
    formSubmit(e){
      var phone = e.detail.value.phone;
      var code = e.detail.value.code;
      if(!phone){
        wx.showToast({
          title: '请输入手机号',
          icon:'none',
          duration: 2000
        })
      } else if (/^(13[0-9]|14[5-9]|15[012356789]|16[0-9]|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(phone) != true){
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 2000
        })
      }else if(!code){
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000
        })
      }else{
        //登录
        wx.request({
          url: app.globalData.baseUrl+'/login',
          method:'POST',
          contentType: 'application/json',
          data:JSON.stringify({
            phone:phone,
            validateCode:code
          }),
          success:res=>{
            console.log(res);
            if (res.statusCode == 200){
              //存储token
              wx.setStorage({
                key: 'token',
                data: res.data.data.access_token,
              });
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
          }
        })
      }
    },
  }
})
