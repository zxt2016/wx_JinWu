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
      height: wx.getSystemInfoSync().windowHeight-180,  
      dicHeight: wx.getSystemInfoSync().windowHeight,
    })
    
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
        _this.setData({
          stationList: data,
          recordsImg:data.recordsImg
        })
      }
    })
    // 获取发电信息
    wx.request({
      url: app.globalData.baseUrl+'/wxRecruitOrder/getStationElecDetail',
      method:'GET',
      data:{
        stationId:_this.data.stationId
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          _this.setData({
            powerTotal:res.data.data,
          })
          
          var time = new Array();
          var numVal = new Array();
          var data = _this.data.powerTotal.day;
          for(var i=0;i<data.length;i++){
            time.push(data[i].time);
            numVal.push((data[i].powerToday/1000).toFixed(2));
          }
          _this.setData({
            time:time,
            numVal:numVal
          })
        }
       
      },
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
      height: wx.getSystemInfoSync().windowHeight-240,  
    })
  }else if(e.detail.current == 1){
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-140,  
    })
    // 图表数据
    var windowWidth = 320;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
    // var simulationData = _this.createSimulationData();
    if(_this.data.time.length <1){
      wx.showToast({
        title: '暂无数据',
        icon:'none'
      })
    }else{
      lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: _this.data.time,
        animation: true,
        // background: '#f5f5f5',
        series: [{
            name: '发电量',
            data: _this.data.numVal,
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
        width: windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
            lineStyle: 'curve'
        }
    });
    }
    



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
  // var simulationData = this.createSimulationData();
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
  wx.downloadFile({
    url: src,
    success: function (res) {
      console.log(res)
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        success: function (res) {
          console.log('打开文档成功')
        }
      })
    }
  })
},
})