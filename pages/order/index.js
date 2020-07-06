
    // pages/order/order.js
    const app = getApp();
    Page({
     
      /**
      * 页面的初始数据
      */
      data: {
        imgUrl:app.globalData.imgUrl,
        data1:[],
        data2:[],
        data3:[],
        data4:[],
        order_list: [],  
        currtab: 0,
        swipertab: [
          { name: '待支付', index: 0 },
          { name: '定金支付完成', index: 1 },
          { name: '已完成', index: 2 }, 
          { name: '取消', index: 3 }
        ],
        currtab2: 0,
        shoptab: [
          { name: '待支付', index: 0 },
          { name: '已支付', index: 1 },
          { name: '已发货', index: 2 }, 
          { name: '已完成', index: 3 }, 
          { name: '取消', index: 4 }
        ],
        deviceW:'',
        deviceH:'',
        //上拉加载
        limit: 4,//显示数据量
        page: 1,//当前页
        load: true,
        loading: false,//加载动画的显示
        total:0, //数据总数
        total1:0,
        total2:0,
        total3:0,
        total4:0,

        // tab切换
        tabs: ['合伙企业订单','低碳圈订单'],
        activeTab: 0,
        // 低碳圈订单数据
        co2Data:[],
        page2:1,
        limit2:4,
      },
       
      /**
      * 生命周期函数--监听页面加载
      */
      onLoad: function (options) {
        var _this = this;
        //tip:0,定金支付成功页跳转 1:低碳圈
        if(options.tip == 0){
          this.setData({
            currtab:options.tip,
            activeTab:options.tip,
          });
        }else if(options.tip == 1){
          this.setData({
            currtab2:options.tip,
            activeTab:options.tip,
          });
        }
        
        //先获取4种状态下的初始数据
        /**
         * 待支付
         * **/ 
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/getList',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data: {
            current:_this.data.page,
            size:_this.data.limit,
            status:0,
          },
          success (res) {
            console.log(res);
            var data = res.data.data.records;
            for(var i=0;i<data.length;i++){
              data[i].capacity = (parseInt(data[i].capacity)/1000).toFixed(2);
              data[i].subscriptionAmont = (parseInt(data[i].subscriptionAmont)/1000).toFixed(2);
            }
            _this.setData({
              data1: data,
              total1:res.data.data.total,
            })
          }
        })
        /**
         * 定金支付完成
         * **/ 
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/getList',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data: {
            current:_this.data.page,
            size:_this.data.limit,
            status:1,
          },
          success (res) {
            console.log(res);
            var data = res.data.data.records;
            for(var i=0;i<data.length;i++){
              data[i].capacity = (parseInt(data[i].capacity)/1000).toFixed(2);
              data[i].subscriptionAmont = (parseInt(data[i].subscriptionAmont)/1000).toFixed(2);
            }
            _this.setData({
              data2: data,
              total2:res.data.data.total,
            })
          }
        })
        /**
         * 已完成
         * **/ 
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/getList',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data: {
            current:_this.data.page,
            size:_this.data.limit,
            status:2,
          },
          success (res) {
            console.log(res);
            var data = res.data.data.records;
            for(var i=0;i<data.length;i++){
              data[i].capacity = (parseInt(data[i].capacity)/1000).toFixed(2);
              data[i].subscriptionAmont = (parseInt(data[i].subscriptionAmont)/1000).toFixed(2);
            }
            _this.setData({
              data3: data,
              total3:res.data.data.total,
            })
          }
        })
        /**
         * 取消
         * **/ 
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/getList',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data: {
            current:_this.data.page,
            size:_this.data.limit,
            status:3,
          },
          success (res) {
            console.log(res);
            var data = res.data.data.records;
            for(var i=0;i<data.length;i++){
              data[i].capacity = (parseInt(data[i].capacity)/1000).toFixed(2);
              data[i].subscriptionAmont = (parseInt(data[i].subscriptionAmont)/1000).toFixed(2);
            }
            _this.setData({
              data4: data,
              total4:res.data.data.total,
            })
          }
        })
      },
      /**
      * 生命周期函数--监听页面初次渲染完成
      */
      onReady: function () {
        // 页面渲染完成
        this.getDeviceInfo()
        this.orderShow()
      },
       
      getDeviceInfo: function () {
        let that = this
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              deviceW: res.windowWidth,
              deviceH: res.windowHeight
            })
          }
        })
      },
       /**
      * 页面上拉触底事件的处理函数
      */
      onReachBottom: function () {
        var _this = this;
        var num = this.data.currtab;
        if (_this.data.load) { //全局标志位，方式请求未响应是多次触发
          console.log(_this.data.order_list.length,_this.data.total);
          if (_this.data.order_list.length >= _this.data.total) {
            wx.showToast({
              title: '已经到底了！',
              icon:"none",
              duration:3000
            })
          }else{
            _this.setData({  
                load: false,
                loading: true,//加载动画的显示
              })
    
              wx.request({
                url: app.globalData.baseUrl+'/wxOrder/getList',
                method: 'GET', 
                header: {
                  'content-type': 'application/json',
                  'Authorization': wx.getStorageSync('token'),
                },
                data: {
                  current:_this.data.page,
                  size:_this.data.limit,
                  status: num,
                },
                success (res) {
                  console.log(res);
                  var content = res.data.data.records;
                  for(var i=0;i<content.length;i++){
                    content[i].capacity = (parseInt(content[i].capacity)/1000).toFixed(2);
                    content[i].subscriptionAmont = (parseInt(content[i].subscriptionAmont)/10000).toFixed(2);
                  }
                  
                  var data = _this.data.order_list.concat(content);
                  console.log(data);
                  _this.setData({
                    order_list: data,
                    page:_this.data.page*1+1,
                    load: true,
                    loading: false,
                  })
                  console.log( _this.data.order_list)
                }
              })
            }
          }
      },
      /**
      * @Explain：选项卡点击切换
      */
      tabSwitch: function (e) {
        var that = this
        if(this.data.activeTab == 0){
          if (this.data.currtab === e.target.dataset.current) {
            return false
          } else {
            that.setData({
              page:1,
              currtab: e.target.dataset.current
            })
          }
        }else{
          if (this.data.currtab2 === e.target.dataset.current) {
            return false
          } else {
            that.setData({
              page:1,
              currtab2: e.target.dataset.current
            })
          }
        }
        
      },
      tabChange: function (e) {
        this.setData({ 
          page:1,
          currtab: e.detail.current
         })
        this.orderShow()
      },
      tabChange2: function (e) {
        this.setData({ 
          page:1,
          currtab2: e.detail.current
         })
        // this.orderShow()
      },
      orderShow: function () {
        
        this.orderList(this.data.currtab)
      },
      orderList: function(num) { 
        var _this = this;
        console.log(num,_this.data.page)
        if(num == 0){
          _this.setData({
            order_list: _this.data.data1,
            total:_this.data.total1,
            page:_this.data.page*1+1
          })
        }else if(num == 1){
          _this.setData({
            order_list: _this.data.data2,
            total:_this.data.total2,
            page:_this.data.page*1+1
          })
        }else if(num == 2){
          _this.setData({
            order_list: _this.data.data3,
            total:_this.data.total3,
            page:_this.data.page*1+1
          })
        }else if(num == 3){
          _this.setData({
            order_list: _this.data.data4,
            total:_this.data.total4,
            page:_this.data.page*1+1
          })
        }
        // wx.request({
        //   url: app.globalData.baseUrl+'/wxOrder/getList',
        //   method: 'GET', 
        //   header: {
        //     'content-type': 'application/json',
        //     'Authorization': wx.getStorageSync('token'),
        //   },
        //   data: {
        //     current:_this.data.page,
        //     size:_this.data.limit,
        //     status: num,
        //   },
        //   success (res) {
        //     console.log(res) 
        //     _this.setData({
        //       order_list: res.data.data.records,
        //       total:res.data.data.total,
        //       page:_this.data.page*1+1
        //     })
        //   }
        // })
      },

      cancle_btn: function(e) {
        var order_id = e.currentTarget.id
        var that = this
        wx.showModal({
          title: '提示',
          content: '是否取消该订单？取消后将不能恢复。',
          success:function(res){
            if(res.confirm){
              that.cancle_order(order_id);
              console.log('弹框后点确定')
            }else{
                console.log('弹框后点取消')
            }
          }
        })
      },
      cancle_order: function(order_id) {
        var _this = this
        wx.request({
          url: app.globalData.baseUrl+'/wxOrder/cancelOrder',
          method: 'GET', 
          header: {
            'content-type': 'application/json',
            'authorization': app.globalData.token,
            'openId': '1'
          },
          data: {
            id: order_id
          },
          success (res) {
            if( res.data.errcode == 1){
              wx.showToast({
                title: res.data.errmsg,
                icon:'loading',
                duration:2000
              })
            }else{
              wx.showToast({
                title: '取消成功',
                icon:'success',
                duration:2000
              })
            }
          }
        })
      },
  

  // 页面滚动事件
  // onPageScroll:function(e){
  //   var height = wx.getSystemInfoSync().windowHeight;
  //   console.log(height,e.scrollTop);
  // },




  // tab
  onTabClick(e) {
    var _this = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({ 
      activeTab: index 
    })
    if(index == 1){
      // 获取待支付订单
      console.log({
        current:_this.data.page2,
        size:_this.data.limit2,
        status:0,
      });
      wx.request({
        url: app.globalData.baseUrl+'/wxCommodityOrder/getList',
        method: 'GET', 
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token'),
        },
        data: {
          current:_this.data.page2,
          size:_this.data.limit2,
          status:0,
        },
        success (res) {
          console.log(res);
          if(res.data.errcode == 0){
            _this.setData({
              co2Data: res.data.data.records,
            })
          }
        }
      })
    }
  },
  // 取消订单
  cancelBtn(e){
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.baseUrl+'/wxCommodityOrder/cancel',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token'),
      },
      data: {
        id:id
      },
      success (res) {
        console.log(res);
      }
    })
  },
  // 支付
  payBtn(e){
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.baseUrl+'/wxCommodityOrder/getWeChatPayParams',
      method: 'GET', 
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token'),
      },
      data: {
        id:id
      },
      success (res) {
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
      }
    })
  }
  // onChange(e) {
  //   const index = e.currentTarget.dataset.index;
  //   console.log(index);
  //   this.setData({ 
  //     activeTab: index 
  //   })
  // },
  })
  