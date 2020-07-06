//index.js
//获取应用实例
const app = getApp();


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    imgUrl:app.globalData.imgUrl,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //轮播图效果
    banner_img: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    circular: true,
    //星系轮播
    indicatorDots2: false,
    vertical2: false,
    autoplay2: false,
    interval2: 5000,
    duration2: 800,
    circular2: true,
    //电站tab切换标识
    stationType:1,
    //星系旋转标识
    step:1,
    //星球数据
    starData:[
      {
        num:0,
        width:'70',
        height:'70',
        translateX:'',
        translateY:''
      },
      {
        num:1,
        width:'70',
        height:'70',
        translateX:'',
        translateY:''
      },
      {
        num:2,
        width:'70',
        height:'70',
        translateX:'',
        translateY:''
      },
      {
        num:3,
        width:'70',
        height:'70',
        translateX:'',
        translateY:''
      },
      {
        num:4,
        width:'70',
        height:'70',
        translateX:'',
        translateY:''
      },
    ],
    //平均角度
    deg:'',
    translateX:'',
    translateY:'',
    width:'',
    height:'',
    // 招募单列表（项目）
    projectData:[],
    projectData2:[],

    //招募单实时发电量
    projectPower:'',
    proMonthPower:'',
    proTotalPower:'',
    //我的项目实时发电量
    myPower:'',
    //我的项目为空的标识
    powerTip:1,

    //授权弹框
    setting: false,
    showModel: false,
    token:'',
    id:'',
    refresh:false,

    //判断点击的是认购还是tab切换
    tabs:false,
    //收益表显示标识
    profit:true,
    //列表展开收起标识
    shTip1:false,
    shTip2:false,
    //投入金额
    getMoney:100000,
    //年份选择
    years:[1,2,5,8,20],
    //选择值
    yearIndex:0,
    //年化收益年份对应
    profit:[6.5,7,7.5,8.5,9],
    // 计算电站规模
    capacitys:'',
    //实际年化收益
    myMoney:'',
    todayPower:'',
    animation:'',
    animationEvent:'',
    gzType:'',
    companyId:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) { 
    var _this = this;
    console.log(app.globalData.navData)
    if(options.login == 'ok'){
      this.setData({
        refresh:true,
      });
    }else if(options.src == 'paySuccess'){
      this.setData({
        refresh:true,
      });
    }
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getBannerList();
    this.getProList();
    // 获取招募单实时发电量
    wx.request({
      url: app.globalData.baseUrl+'/power/company/power',
      method: 'GET', 
      header:{
        'Authorization':wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          _this.setData({
            projectPower:res.data.data.nowElec,
            proMonthPower:res.data.data.monthElec,
            proTotalPower:res.data.data.yearElec
          });
        }
      },
    })
},
onShow(){
  if(this.data.refresh == true){
    this.onLoad();
  }
  if(this.data.getMoney !=''){
    this.setData({
      capacitys:(this.data.getMoney/3.5/1000).toFixed(2)+'kW',
    });
    this.countMoney();
  }
},
threeCircleMove(json){
    var _this = this;
    //要操作的元素
    var obj = {};
    //方向(顺时针'+'或逆时针'-')
    var dir = json.dir;
    var dir = dir || '+';
    //最大圈数
    var max = json.max;
    max = Number(max) || 'all'; 
    //半径
    var r = json.r;
    r = Number(r) || 100;
    //圆心x轴坐标
    var x0 = json.x0;
    var y0 = json.y0;
    //元素的初始宽高
    var offsetHeight =json.height;
    var offsetWidth =json.width;
    //元素的宽高
    var height,width;
    //初始夹角，以角度为单位
    var a0 = json.a0;
    a0 = json.a;
    
    //当前夹角
    var a = a0;
    //当前圈数
    var num = json.num || 0;
    //清除定时器
    // if(obj.timer){return;}
    //声明当前值cur
    var cur = {};
    var data = _this.data.starData;
    var timer = new Array();
    var timer= setInterval(function(){
      //将这些瞬时值储存在obj对象中的属性中
      obj.a = a;
      obj.x0 = x0;
      obj.width = width;
      obj.height = height;
      obj.x = x;
      obj.num = num;
      //如果元素运动到指定圈数则停止定时器
      if(num == max){
          clearInterval(timer);
      }
      //顺时针
      if(dir == '+'){
          a++;
          if(a == a0 + 360){
              a = a0;
              num++;
          }
      //逆时针
      }else{
          a--;
          if(a == a0 - 360){
              a = a0;
              num++;
          }
      }

    
      // for(var i=0;i<data.length;i++){
      //   var x = data[i].translateX + x0 + r*Math.cos((90 + a*Math.PI)/180);
      //   var z = y0 + r*Math.sin((90 + a*Math.PI)/180)/4;
      //   width = (offsetWidth/2) + offsetWidth/2*Math.sin((90 + a*Math.PI)/180);
      //   data[i].translateX = x;
      //   _this.setData({
      //     starData:data
      //   });
      //   // height = (offsetHeight/2) + offsetWidth/2*Math.sin((90 + a*Math.PI)/180);
      // }
      
      // _this.setData({
      //   translateX:x,
      //   translateY:y,
      //   width:width,
      //   height:height
      // });
      
  },3000);
    
    
    
},

getUserInfo: function(e) {
  console.log(e)
  app.globalData.userInfo = e.detail.userInfo
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
},

getBannerList: function() { 
  var _this = this
  wx.request({
    url: app.globalData.baseUrl+'/advertising/getBannertList',
    method: 'GET', 
    header: {
      'content-type': 'application/json'
    },
    success (res) {
      var img_list = []
      for (var i = 0; i < res.data.data.length; i++) {
        img_list.push(res.data.data[i].img,)
      } 
      _this.setData({
        banner_img: img_list
      })
    }
  })
},
//电站切换
stationTab: function(e){
  var _this = this;
  var tab = e.currentTarget.dataset.num;
  this.setData({
    stationType:tab,
    tabs:true
  });
  
  if(tab == 1){
    // 获取招募单实时发电量
    wx.request({
      url: app.globalData.baseUrl+'/power/company/power',
      method: 'GET', 
      header:{
        'Authorization':wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          _this.setData({
            projectPower:(res.data.data.nowElec/1000).toFixed(2),
            proMonthPower:(res.data.data.monthElec/1000).toFixed(2),
            proTotalPower:(res.data.data.yearElec/1000).toFixed(2)
          });
        }
      },
    })

    //获取招募单列表
    this.getProList();

  }else if(tab == 2){
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
              url: '../login/login?str=index',
            })
          },500);
        }else{
          // 获取我的电站实时发电量
          wx.request({
            url: app.globalData.baseUrl+'/power/user/power',
            method: 'GET', 
            header:{
              'Authorization':wx.getStorageSync('token'),
              'content-type': 'application/json'
            },
            success(res){
              console.log(res);
              if(res.data.errcode == 0){
                _this.setData({
                  myPower:res.data.data,
                  projectPower:(res.data.data.nowElec/1000).toFixed(2),
                  proMonthPower:(res.data.data.monthElec/1000).toFixed(2),
                  proTotalPower:(res.data.data.yearElec/1000).toFixed(2)
                });
              }
            },
          })
          //获取我的电站列表
          _this.getMinePro();
        }
      }
    }, fail: function () {
      _this.setData({
        showModel: true,
      })
    }
    })
  }
},
//项目查看详情
lookDetails:function(e){
  var id = e.currentTarget.dataset.id;
  var name = e.currentTarget.dataset.name;
  //招募单点击详情跳转到项目详情页
  if(this.data.stationType == 1){
    setTimeout(function(){
        wx.navigateTo({
          url: '../project_detail/index?id='+id,
        })
    },500);
    //我的电站跳转该项目下电站列表
  }else{
    wx.navigateTo({
      url: '../station/index?str='+id+'&name='+name,
    })
  }
  
},
//查看年份收益表
lookProfit:function(){

},
//关注
guanZhu(e){
  var that = this;
  var companyId = e.currentTarget.dataset.id;
  var follow = e.currentTarget.dataset.follow;
  this.setData({
    companyId:companyId
  });
  if(follow == true){
    this.setData({
      gzType:2,
    });
  }else{
    this.setData({
      gzType:1,
    });
  }
  /**
   * 先验证是否授权、登录
   * 验证招募单状态
   * **/ 
  //获取用户信息
  wx.getSetting({
    success: res => {
      //没有授权需要弹框
    if (!res.authSetting['scope.userInfo']) {
      that.setData({
        showModel: true,
      })
    } else {//判断用户已经授权,判断是否登录
      that.setData({
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
            url: '../login/login?gzType='+that.data.gzType+'&companyId='+that.data.companyId,
          })
        },500);
      }else{
        // 验证招募单状态
        wx.request({
          url: app.globalData.baseUrl+'/wxRecruitOrder/followCompany',
          method:'GET',
          header:{
            'Authorization': wx.getStorageSync('token'),
          },
          data:{
            companyId:companyId,
            type:that.data.gzType
          },
          success(res){
            console.log(res);
            if(res.data.errcode == 0){
              wx.showToast({
                title: res.data.data,
                icon:'none'
              })
              that.getProList();

            }
          },
        })
      }
    }
  }, fail: function () {
    that.setData({
      showModel: true,
    })
  }
  })
},
//认购
renGou(e){
  var that = this;
  var power = e.currentTarget.dataset.power;
  this.setData({
    tabs:false
  });
  if(power != 1){
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon:'none',
      duration:3000
    })
  }else{
    wx.showModal({
      title: '提示',
      content: '预定会支付1%的预定份额总值，预定成功后请与客服联系：17631123590。',
      cancelColor:'#666666',
      confirmColor:'#2c7bfe',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var id = e.currentTarget.dataset.id;
          that.setData({
            id:id
          });
          /**
           * 先验证是否授权、登录
           * 验证招募单状态
           * **/ 
          //获取用户信息
          wx.getSetting({
            success: res => {
              //没有授权需要弹框
            if (!res.authSetting['scope.userInfo']) {
              that.setData({
                showModel: true,
              })
            } else {//判断用户已经授权,判断是否登录
              that.setData({
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
                    url: '../login/login?renGou=ok&proId='+id,
                  })
                },500);
              }else{
                // 验证招募单状态
                wx.request({
                  url: app.globalData.baseUrl+'/wxRecruitOrder/getRecruitOrderStatus',
                  method:'GET',
                  header:{
                    'Authorization': wx.getStorageSync('token'),
                  },
                  data:{
                    id:id
                  },
                  success(res){
                    console.log(res);
                    if(res.data.errcode == 0){
                      setTimeout(function(){
                        wx.navigateTo({
                          url: '../purchase/index?tip=renGou&proId='+id,
                        })
                      },500);
                    }
                  },
                })
              }
            }
          }, fail: function () {
            that.setData({
              showModel: true,
            })
          }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
},
//加载更多
getMore(){
  if(this.data.stationType == 1){
    this.getProList();
    if(this.data.shTip1 == false){
      this.setData({
        shTip1:true,
      });
    }else{
      this.setData({
        shTip1:false,
      });
    }
  }else{
    this.getMinePro();
    if(this.data.shTip2 == false){
      this.setData({
        shTip2:true,
      });
    }else{
      this.setData({
        shTip2:false,
      });
    }
  }
  
},
getUserInfo: function(e) {
  var _this = this;
  app.globalData.userInfo = e.detail.userInfo
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
  if(this.data.tabs == false){
    if(this.data.gzType == 1){
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login?gzType='+_this.data.gzType+'&companyId='+_this.data.companyId
        })
      },300);
    }else{
      setTimeout(function(){
        wx.navigateTo({
          url: '../login/login?renGou=ok&proId='+_this.data.id,
        })
      },300);
    }
  }else{
    setTimeout(function(){
      wx.navigateTo({
        url: '../login/login?str=index',
      })
    },300);
  }
  
},
quxiao: function () {
  var that = this;
  that.setData({
    showModel: false
  })
  wx.reLaunch({
    url: '../index/index',
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
    url: '../index/index',
  })
},


//获取招募单列表
getProList(){
  var _this = this;
  wx.request({
    url: app.globalData.baseUrl+'/wxRecruitOrder/list',
    method: 'GET', 
    contentType: 'application/json;charset=UTF-8 ',
    data:{
      current:1,
      size:1000,
      userId:wx.getStorageSync('userId')
    },
    success(res){
      console.log(res);

      if(res.data.errcode == 0){
        var data = res.data.data.records;
        for(var i=0;i<data.length;i++){
          data[i].capacity = (data[i].capacity/1000).toFixed(2);
          data[i].totalInvestment = (data[i].totalInvestment/10000).toFixed(2);
          if(data[i].status == 1){
            data[i].power = 1
          }else{
            data[i].power = 2
          }
        }
        _this.setData({
          projectData:data,
        });
      }
    },
  })
},
//获取我的电站列表
getMinePro(){
  var _this = this;
  wx.request({
    url: app.globalData.baseUrl+'/wxOrder/getProjectList',
    method:'GET',
    header:{
      'Authorization':wx.getStorageSync('token'),
      'content-type': 'application/json'
    },
    data:{
      current:1,
      size:1000
    },
    success(res){
      console.log(res);
      if(res.data.errcode == 0){
        var data = res.data.data.records;
        for(var i=0;i<data.length;i++){
          data[i].capacity = (data[i].capacity/1000).toFixed(2);
          data[i].totalInvestment = (data[i].totalInvestment/10000).toFixed(2);
          if(data[i].status == 1){
            data[i].power = 1
          }else{
            data[i].power = 2
          }
        }
        _this.setData({
          projectData2:data,
        });
      }
    },
  })
},

//预期收益计算器年份选择
yearBtn(e){
  var index = e.currentTarget.dataset.index;
  console.log(index);
  this.setData({
    yearIndex:index,
  });
  if(this.data.getMoney != ''){
    this.countMoney();
  }
  
  
},
//投入金额
getMoney(e){
  console.log(e);
  var num = (parseInt(e.detail.value)/3.5/1000).toFixed(2);
  this.setData({
    getMoney:e.detail.value,
    capacitys:num+'kW',
  });
  if(this.data.yearIndex !=''){
    this.countMoney();
  }
  
},
//计算实际年化收益
countMoney(){ 
  /**
   * 实际年化收益 = 投入金额*预期年化
   * **/
  this.setData({
    myMoney:(parseInt(this.data.getMoney)*this.data.profit[this.data.yearIndex]/100*this.data.years[this.data.yearIndex]).toFixed(2)
  });
},


})
