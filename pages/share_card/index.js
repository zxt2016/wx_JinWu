const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareData:{},
    userInfo:'',
    headerImg:'',
    //二维码
    maImg:'',
    //分享卡片
    cardImg:'',
    //总招募额度
    totalNum:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: '分享海报',
    });
    wx.showLoading({
      title:'海报绘制中...'
    });
    this.setData({
      shareData:wx.getStorageSync('shareData'),
      totalNum:(parseInt(wx.getStorageSync('shareData').totalInvestment)/10000).toFixed(2)
    });

    var imgSrc = wx.getStorageSync('userInfo').avatarUrl;
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
    });
    wx.downloadFile({
      url: imgSrc,
      success(res){
        if(res.statusCode == 200){
          _this.setData({
            headerImg:res.tempFilePath,
          });
        }
      },
    })
    //二维码
    wx.request({
      url: app.globalData.baseUrl+'/qr/code',
      method:"POST",
      header:{
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token'),
      },
      data:{
        path:'../project_detail/index',
        type:2,
        width:156,
        // id:_this.data.shareData.id
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          wx.downloadFile({
            url: res.data.data,
            success(res){
              console.log(res);
              _this.setData({
                maImg:res.tempFilePath,
              });
            },
          })
        }
      },
    })
  },
onShow(){
  var _this = this;
  setTimeout(function(){
    _this.draw();
    wx.hideLoading();
  },500);
},
  /**
   *  画布
   * **/ 
  draw(){
    var _this = this;
    var user = _this.data.userInfo;
    console.log(_this.data.shareData,123);
    // 画布
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.beginPath();
    ctx.drawImage('../image/share/card_bg1.png',0,0,323,520);
    ctx.drawImage('../image/share/card_bg2.png',17,17,290,476);
    // ctx.drawImage('../image/share/card_logo.png',230,35,54,16);
    ctx.save();
    ctx.arc(70, 75, 30, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(_this.data.headerImg,40,45,60,60); 
    ctx.restore();
    ctx.setFontSize(16);
    ctx.fillText(user.nickName, 110, 75);
    ctx.setFontSize(12);
    ctx.setFillStyle('#666');
    ctx.fillText('诚邀您成为合伙人', 110, 95);
    ctx.drawImage('../image/share/card_img1.png', 36,110,251,138);
    ctx.drawImage('../image/share/card_box.png', 43,220,235,180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(14);
    if(_this.data.shareData.projectName){
      ctx.fillText(_this.data.shareData.projectName,64, 252);
    }
    
    ctx.setLineWidth(1);
    ctx.setStrokeStyle('#e5e5e5');
    ctx.moveTo(64, 265);
    ctx.lineTo(255, 265);
    ctx.stroke();
    ctx.setFontSize(12);
    ctx.fillText('合伙企业',64, 290);
    ctx.setFillStyle('#176eff');
    if(_this.data.shareData.companyName){
      ctx.fillText(_this.data.shareData.companyName,(255-(_this.data.shareData.companyName.split('')).length*12), 290);
    }
    
    ctx.setFillStyle('#333');
    ctx.fillText('项目地址',64, 315);
    ctx.setFillStyle('#176eff');
    if(_this.data.shareData.projectAddress){
      ctx.fillText(_this.data.shareData.projectAddress,(255-(_this.data.shareData.projectAddress.split('')).
      length*12), 315);
    }
    
    ctx.setFillStyle('#333');
    ctx.fillText('总招募额度',64, 340);
    ctx.setFillStyle('#176eff');
    if(_this.data.totalNum){
      ctx.fillText(_this.data.totalNum+'万',(255-(_this.data.totalNum.split('')).length*8.2), 340);
    }
    
    ctx.setFillStyle('#333');
    ctx.fillText('预计年化收益',64, 365);
    ctx.setFillStyle('red');
    ctx.font = 'italic 18px 微软雅黑'
    if(_this.data.shareData.annualized){
      ctx.fillText(_this.data.shareData.annualized+'%',(240-(_this.data.shareData.annualized.split('')).length*12), 368);
    }
    ctx.drawImage('../image/share/card_img2.png', 64,420,94,45);
    ctx.drawImage(_this.data.maImg, 180,395,74,84);
    ctx.draw(false,function(e){
      setTimeout(function(){
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 323,
          height: 520,
          canvasId: 'shareCanvas',
          success(res) {
            console.log(res)
            _this.setData({
              cardImg:res.tempFilePath
            });

          //   wx.saveImageToPhotosAlbum({
          //     filePath: res.tempFilePath,
          //     success:function(res){
          //       console.log(res);
          //       wx.showToast({
          //         title: '已保存到本地相册',
          //         icon:"none",
          //         duration:3000
          //       })
          //     },fail:function(err){
          //       console.log(err);
          //     }
          // })











          }
        })
      },300);
    });
  },
})