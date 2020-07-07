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
    stationList:{},
    stationName:'',
    stationId:'',
    // tab切换

    // order_list: [],  
    currtab: 0,
    swipertab: [{ name: '基本信息', index: 0 }, { name: '发电情况', index: 1 }, { name: '相关文件', index: 2 }],
    //发电总数据
    powerTotal:[],
    // 发电数据
    time:[],
    numVal:[],
    currIndex:0,
    height:300,
    dicHeight:'',
    //pdf预览
    recordsImg:'',
    windowWidth:320,
    //折线图无数据
    lineNo:true,
    //电站逆变器SN
    deviceSn:'',

    //轮播图效果
    banner_img: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    console.log(options);
    this.setData({
      stationName: options.name,
      stationId:options.str,
      height: wx.getSystemInfoSync().windowHeight-100,  
      dicHeight: wx.getSystemInfoSync().windowHeight,
    })

    try {
      var res = wx.getSystemInfoSync();
      _this.data.windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
    
    // 获取基本信息
    wx.request({
      url: app.globalData.baseUrl+'/wxRecruitOrder/getStationDetail',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
      },
      data: {
        stationId: options.str
      },
      success (res) {
        console.log(res) 
        var data = res.data.data;
        data.capacity = (data.capacity/1000).toFixed(2);
        var bannerImg = data.stationImg.split(',');
        _this.setData({
          stationList: data,
          recordsImg:data.recordsImg,
          deviceSn:data.deviceSn,
          banner_img:bannerImg
        })
      }
    })
 },
//tab切换
tabSwitch: function (e) {
  var _this = this
  if (this.data.currtab === e.target.dataset.current) {
    return false
  } else {
    _this.setData({
      page:1,
      currtab: e.target.dataset.current
    })
  }
  // if(e.target.dataset.current == 1){
   
  // }
},
tabChange(e){
  var _this = this;
  console.log(e);
  this.setData({
    currtab:e.detail.current,
  });
  if(e.detail.current == 0){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-100,  
    })
  }else if(e.detail.current == 1){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-240,  
    })
    if(_this.data.powerTotal.length == 0){
      // 获取发电信息
      wx.request({
        url: app.globalData.baseUrl+'/power/station',
        method:'GET',
        data:{
          deviceSn:_this.data.deviceSn
        },
        success(res){
          console.log(res);
          if(res.data.errcode == 0){
            if(res.data.data.length == 0){
                _this.setData({
                  lineNo:false
                });
            }else{
              _this.setData({
                powerTotal:res.data.data,
                lineNo:true
              })
              
              var time = new Array();
              var numVal = new Array();
              var data = res.data.data;
              for(var i=0;i<data.length;i++){
                var date = data[i].time.replace(/-/g,'.');
                time.push(date.substring(5,date.length));
                numVal.push((data[i].powerToday).toFixed(2));
              }
              _this.setData({
                time:time,
                numVal:numVal
              })
              console.log(time,numVal);
              _this.drawLine(time,numVal);
            }

            
          }
        
        },
      })
    }else{
      _this.drawLine(_this.data.time,_this.data.numVal);
    }
    

  }else if(e.detail.current == 2){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight/1.8,  
    })
  }
},
  // 图表事件
// touchHandler: function (e) {
//   // console.log(lineChart.getCurrentDataIndex(e));
//   lineChart.showToolTip(e, {
//       // background: '#7cb5ec',
//       format: function (item, category) {
//           return category + ' ' + item.name + ':' + item.data 
//       }
//   });
// },    
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
      data: _this.data.numVal,
      format: function (val, name) {
          return val + '万';
      }
  }];
  lineChart.updateData({
      categories: _this.data.time,
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
        numVal.push((data[i].powerToday/1000).toFixed(2));
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
// pdf预览事件
lookPDF(e){
  var src = e.currentTarget.dataset.src;
  wx.showLoading({
    title:'加载中...'
  });
  wx.downloadFile({
    url: src,
    success: function (res) {
      console.log(res)
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        success: function (res) {
          console.log('打开文档成功')
          wx.hideLoading();
        }
      })
    }
  })
},

//绘制折线图
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
})