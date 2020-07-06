//app.js
App({
  onLaunch: function () {
    var _this = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    this.globalData.token = wx.getStorageSync('token');
    var openId = wx.getStorageSync('openId');
    // 登录
    wx.login({
      success: res => {
      // console.log(res);
      var code = res.code;
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      this.globalData.code = code;
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              wx.setStorageSync('userInfo',res.userInfo);
              this.globalData.userInfo = res.userInfo;
              //下载头像
              // wx.downloadFile({
              //   url: res.userInfo.avatarUrl,
              //   success: function(res) {
              //     if (res.statusCode === 200) {
              //       console.log('图片下载成功' + res.tempFilePath)
              //       const fs = wx.getFileSystemManager()
              //       fs.saveFile({
              //         tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              //         success(res) {
              //           console.log('图片缓存成功', res.savedFilePath) 
              //           wx.setStorageSync('headerImg', res.savedFilePath)
              //         }
              //       })
              //     }else {
              //       console.log('响应失败', res.statusCode)
              //     }
              //   }
              // })
              

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: _this.globalData.baseUrl+'/refreshToken',
      method: 'GET', 
      header: { 
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token'),
        'openId': openId
      },
      success (res) {
        if(res.data.errcode == 0){
          wx.setStorageSync('token',res.data.data);
        }
      }
    })
  },
  globalData: {
    token:'',
    code:'',
    userInfo: '',
    // baseUrl:'https://www.jwpower.cn/makeland',
    // baseUrl:'http://192.168.1.5:8080/photovoltaic',
    baseUrl:'http://shvy76.natappfree.cc/makeland',
    // baseUrl:'http://ay5kdp.natappfree.cc/photovoltaic',
    imgUrl:'https://www.jwpower.cn/image',
    
  }
})