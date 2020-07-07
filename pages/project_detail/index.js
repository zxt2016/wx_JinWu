// pages/station_detail/index.js
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    infoList:{},
    // 认购授权标识
    power:0,
    //授权弹框
    setting: false,
    showModel: false,
    token:'',
    id:'',
    profit:[],
    profitShow:false,

    // tab切换
    order_list: [],  
    currtab: 0,
    swipertab: [{ name: '基本信息', index: 0 }, { name: '发电情况', index: 1 }, { name: '预期年化', index: 2 }, { name: '认购情况', index: 3 }],
    //发电总数据
    powerTotal:[],
    // 发电数据
    time:[],
    numVal:[],
    currIndex:0,

    // 25年数据
    allPower:'',
    all_c:'',
    all_mei:'',
    all_tree:'',
    // 持有收益
    annualized:[
      {
        year:'1年',
        val:'6.5%'
      },{
        year:'2年',
        val:'7%'
      },
      {
        year:'3年',
        val:'7.15%'
      },
      {
        year:'4年',
        val:'7.3%'
      },
      {
        year:'5年',
        val:'7.5%'
      },
      {
        year:'6年',
        val:'7.8%'
      },
      {
        year:'7年',
        val:'8%'
      },
      {
        year:'8年',
        val:'8.5%'
      },
      {
        year:'9年',
        val:'9%'
      },
      {
        year:'10年',
        val:'9%'
      },
      {
        year:'11年',
        val:'9%'
      },
      {
        year:'12年',
        val:'9%'
      },
      {
        year:'13年',
        val:'9%'
      },
      {
        year:'14年',
        val:'9%'
      },
      {
        year:'15年',
        val:'9%'
      },
      {
        year:'16年',
        val:'9%'
      },
      {
        year:'17年',
        val:'9%'
      },
      {
        year:'18年',
        val:'9%'
      },
      {
        year:'19年',
        val:'9%'
      },
      {
        year:'20年',
        val:'9%'
      },
    ],
    height:300,
    dicHeight:'',

    //认购周期
    startTime:'',
    endTime:'',
    windowWidth:320,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: "合伙企业详情"
    });
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-340,  
      dicHeight: wx.getSystemInfoSync().windowHeight,
    })

    try {
        var res = wx.getSystemInfoSync();
        _this.setData({
          windowWidth:res.windowWidth
        })
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }

    //根据招募单ID获取详情
    if(options.id){
      this.setData({
        id:options.id,
      });
      wx.request({
        url: app.globalData.baseUrl+'/wxRecruitOrder/recruitOrderDetail',
        method:'GET',
        header:{
          'Authorization': wx.getStorageSync('token'),
        },
        data:{
          id:options.id
        },
        success(res){
          console.log(res);
          if(res.data.errcode == 0){
            var data = res.data.data;
            data.capacity = (data.capacity/1000).toFixed(2);
            data.totalInvestment = (data.totalInvestment/10000).toFixed(2);
            data.singleInvestment = (data.singleInvestment/10000).toFixed(2);
            var power = (res.data.data.capacity*1.2*25).toFixed(2);
            var time1 = data.startTime.substring(0,4)+'年'+data.startTime.substring(5,7)+'月'+data.startTime.substring(8,10)+'日';
            var time2 = data.endTime.substring(0,4)+'年'+data.endTime.substring(5,7)+'月'+data.endTime.substring(8,10)+'日';
            console.log(time1);
            _this.setData({
              infoList:data,
              power:data.status,
              profit:data.yieldList,
              allPower:power,
              all_c:(power/1000).toFixed(2),
              all_mei:(power*0.4).toFixed(2),
              all_tree:(power/5.02).toFixed(2),
              startTime:time1,
              endTime:time2,
            })
          }
         
        },
      })
    }
 },
 backHome(){
  wx.reLaunch({
    url: '../index/index',
    success: function (e) { 
      var page = getCurrentPages().pop(); 
      if (page == undefined || page == null) return; 
      page.onLoad(); 
    }
  })
},

 //认购
renGou(){
  var that = this;
  if(that.data.power != 1){
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon:'none',
      duration:3000
    })
  }else{
    var id = this.data.infoList.id;
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
  }
},
//tab切换
tabSwitch: function (e) {
  var that = this
  if (this.data.currtab === e.target.dataset.current) {
    return false
  } else {
    that.setData({
      page:1,
      currtab: e.target.dataset.current
    })
  }
},
tabChange(e){
  var that = this;
  console.log(e);
  this.setData({
    currtab:e.detail.current,
  });
  if(e.detail.current == 0){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-340,  
    })
  }else if(e.detail.current == 1){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-140,  
    })
    wx.request({
      url: app.globalData.baseUrl+'/power/project',
      method:'GET',
      header:{
        'Authorization': wx.getStorageSync('token'),
      },
      data:{
        id:that.data.id
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){

          if(res.data.data.length == 0){
            _this.setData({
              lineNo:false
            });
          }else{
            that.setData({
              powerTotal:res.data.data,
              lineNo:true
            })
            
            var time = new Array();
            var numVal = new Array();
            var data = res.data.data;
            for(var i=0;i<data.length;i++){
              var date = data[i].time.replace(/-/g,'.');
              time.push(date.substring(5,date.length));
              numVal.push((data[i].energy).toFixed(2));
            }
            that.setData({
              time:time,
              numVal:numVal
            })
            console.log(time,numVal);
            that.drawLine(time,numVal);
          }
          
        }
       
      },
    })
  }else if(e.detail.current == 2){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,  
    })
  }else if(e.detail.current == 3){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-300,  
    })
  }
},

// 跳转电站列表
goToStation(e){
  var id = e.currentTarget.dataset.id;
  var name = e.currentTarget.dataset.name;
  wx.navigateTo({
    url: '../station/index?str='+id+'&name='+name,
  })
},

// 图表事件
touchHandler: function (e) {
  lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data 
      }
  });
},    
createSimulationData: function () {
  var categories = [];
  var data = [];
  for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random()*(20-10)+10);
  }
  // data[4] = null;
  return {
      categories: categories,
      data: data
  }
},

updateData: function () {
  var that = this;
  var series = [{
      name: '发电量',
      data: that.data.numVal,
      format: function (val, name) {
          return val + '万';
      }
  }];
  lineChart.updateData({
      categories: that.data.time,
      series: series
  });
},

//图表事件切换
timeTab(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      currIndex:index
    });
    console.log(index);
    var time = new Array();
    var numVal = new Array();
    if(index == 0){ //日
      var data = this.data.powerTotal.day;
      for(var i=0;i<data.length;i++){
        time.push(data[i].time);
        numVal.push((data[i].energy/1000).toFixed(2));
      }
    }else if(index == 1){ //月
      var arr = new Array();
      var data = this.data.powerTotal.month;
      for(var i=0;i<data.length;i++){
        time.push(data[i].month+'月');
        numVal.push((data[i].monthEnergy/1000).toFixed(2));
      }
    }else if(index == 2){ //年
      var arr = new Array();
      var data = this.data.powerTotal.year;
      for(var i=0;i<data.length;i++){
        time.push(data[i].year);
        numVal.push((data[i].yearEnergy/1000).toFixed(2));
      }
    }
    this.setData({
      time:time,
      numVal:numVal
    })
    this.updateData();
},

// 绘制折线图
drawLine(time,numVal){
  var _this = this;
  lineChart = new wxCharts({
    canvasId: 'lineCanvas',
    type: 'line',
    categories: time,
    animation: true,
    // background: '#f5f5f5',
    series: [{
        name: '七日发电量',
        data: numVal,
        format: function (val, name) {
            return val + 'kWh';
        }
    }],
    xAxis: {
        disableGrid: true
    },
    yAxis: {
        title: '发电量（kWh）',
        format: function (val) {
            return val.toFixed(2);
        },
        min: 0
    },
    width: _this.data.windowWidth,
    height: 200,
    dataLabel: false,
    dataPointShape: true,
    extra: {
        lineStyle: 'curve'
    }
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
      url: '../login/login?renGou=ok&proId='+_this.data.id,
    })
  },300);
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
//查看年份收益表
lookBtn(){
  this.setData({
    profitShow:true
  });
},
cancelLook(){
  this.setData({
    profitShow:false
  });
},















})