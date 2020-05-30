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
    token:wx.getStorageSync('token'),
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
    // 认购授权标识
    power:2,
    //招募单实时发电量
    projectPower:'',
    //我的项目实时发电量
    myPower:'',
    //我的项目为空的标识
    powerTip:1,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () { 
    var _this = this;
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

    // 获取招募单列表
    wx.request({
      url: app.globalData.baseUrl+'/wxRecruitOrder/list',
      method: 'GET', 
      contentType: 'application/json;charset=UTF-8 ',
      data:{
        current:1,
        size:10
      },
      success(res){
        if(res.statusCode == 200){
          _this.setData({
              projectData:res.data.data.records,
          });
        }
        console.log(res);
      },
    })
    // 获取招募单实时发电量
    wx.request({
      url: app.globalData.baseUrl+'/power/company/power',
      method: 'GET', 
      header:{
        'Authorization':app.globalData.token,
        'content-type': 'application/json'
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          _this.setData({
            projectPower:(res.data.data/1000).toFixed(2),
          });
        }
      },
    })
    // 获取我的电站实时发电量
    wx.request({
      url: app.globalData.baseUrl+'/power/user/power',
      method: 'GET', 
      header:{
        'Authorization':app.globalData.token,
        'content-type': 'application/json'
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          _this.setData({
            myPower:res.data.data,
          });
        }
        console.log(res);
      },
    })

  },
  onShow(){
    var _this = this;
    //星球旋转特效
    


//     const query = wx.createSelectorQuery()
//     var data = _this.data.starData;
//     var deg = 360/data.length;
//     for(var i=0;i<data.length;i++){
//       query.select('.star'+i).boundingClientRect()
//     }
//       query.exec(function(res){
//         console.log(res);
//         for(var n=0;n<res.length;n++){
// //           X坐标=a + Math.sin(角度 * (Math.PI / 180)) * r ；
// // Y坐标=b + Math.cos(角度 * (Math.PI / 180)) * r ； 
//           var x_position = -20 + Math.sin(deg*n* (Math.PI / 180))*130;
//           var z_position = 0 + Math.cos(deg*n* (Math.PI / 180))*130;
//           console.log(x_position,z_position)
//           data[n].translateX = x_position;
//           data[n].translateZ = z_position;
          
          
//         }
//         _this.setData({
//             starData:data
//         });
//         var json ={
//           r:140,
//           x0:-10,
//           y0:-40,

//           width:res[0].width,
//           height:res[0].height,
//           a:360/_this.data.starData.length,
//           num:0,
//           max:10
//       }
//       // _this.threeCircleMove(json);
//       })
      //每个点角度为72 
      // X坐标=a + Math.sin(角度 * (Math.PI / 180)) * r
      // Y坐标=b + Math.cos(角度 * (Math.PI / 180)) * r
      
    

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
  if(tab == 1){
    if(this.data.projectData.length == 0){
      wx.request({
        url: app.globalData.baseUrl+'/wxRecruitOrder/list',
        method: 'GET', 
        header: {
          'content-type': 'application/json'
        },
        data:{
          current:1,
          size:10
        },
        success(res){
          if(res.statusCode == 200){
            _this.setData({
                projectData:res.data.data.records,
            });
          }
        },
      })
    }
  }else if(tab == 2){
    if(this.data.projectData2.length == 0){
      wx.request({
        url: app.globalData.baseUrl+'/wxOrder/getProjectList',
        method:'GET',
        header:{
          'Authorization':_this.data.token,
          'content-type': 'application/json'
        },
        data:{
          current:1,
          size:10
        },
        success(res){
          console.log(res);
          if(res.statusCode == 200){
            if(res.data.data.records.length == 0){
              _this.setData({
                powerTip:2,
                projectData2:res.data.data.records,
              });
            }else{  
              _this.setData({
                powerTip:1,
                projectData2:res.data.data.records,
              });
            }
          }
        },
      })
    }
  }
  this.setData({
    stationType:e.currentTarget.dataset.num
  });
},
//星系转动-->从右向左
starRotate:function(){
  var _this = this,
  starData = _this.data.starData
  //设定最大值为5，
  for(var i=0;i<starData.length;i++){
    if(starData[i].num == 0){
      starData[i].num = starData.length-1;
    }else{
      var val = starData[i].num;
      starData[i].num = val-1;
    }
  }
  _this.setData({starData});
},
//项目查看详情
lookDetails:function(e){
  var id = e.currentTarget.dataset.id;
  var name = e.currentTarget.dataset.name;
  var proData = new Array();
  // if(this.data.stationType == 1){
  //   proData = this.data.projectData;
  //   for(var i=0;i<proData.length;i++){
  //     if(id == proData[i].id){
  //       wx.setStorageSync('project_index',proData[i]);
  //       break;
  //     }
  //   }
  //   setTimeout(function(){
  //     wx.navigateTo({
  //       url: '../project_detail/index',
  //     })
  //   },300);
  // }else{
    
  // }
  wx.navigateTo({
    url: '../station/index?str='+id+'&name='+name,
  })
},
renGou(){
  var that = this;
  if(that.data.power == 2){
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon:'none',
      duration:3000
    })
  }
},
})
