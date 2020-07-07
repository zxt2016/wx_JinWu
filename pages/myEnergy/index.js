const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system:'',
    animation: '',
    userId:'',
    icon:'',
    token:wx.getStorageSync('token'),
    //用户总能量
    totalEnergy:0,
    //用户可用能量
    balanceEnergy:0,
    //能量气泡数据
    energy:[],
    //能量排行榜
    rankingList:[],
    imgUrl:app.globalData.imgUrl,
    //上拉加载
    limit: 5,//显示数据量
    page: 1,//当前页
    load: true,
    loading: false,//加载动画的显示
    total:0, //数据总数
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      system:wx.getSystemInfoSync(),
      token:wx.getStorageSync('token')
    })

    //查询用户能量
    wx.request({
      url: app.globalData.baseUrl+'/wxEnergy',
      method:'GET',
      header:{'Authorization':_this.data.token},
      contentType: 'application/json;charset=UTF-8 ',
      success(res){
        console.log(res);
        if(res.statusCode == 200){
          
          _this.setData({
            icon:res.data.icon,
            userId:res.data.userId,
            totalEnergy:(res.data.totalEnergy/1000).toFixed(2),
            balanceEnergy:(res.data.balanceEnergy/1000).toFixed(2)
          });
        }
      },
    })
    //获取用户能量列表--渲染气泡
    wx.request({
      url: app.globalData.baseUrl+'/wxEnergy/list',
      method:'GET',
      header:{'Authorization':_this.data.token},
      contentType: 'application/json;charset=UTF-8 ',
      success(res){
        console.log(res);
        if(res.statusCode == 200){
          _this.setData({
            energy:res.data.data
          });
          _this.bubble();

        }
      },
    })
    //能量排行榜
    wx.request({
      url: app.globalData.baseUrl+'/wxEnergy/rank',
      method:'GET',
      header:{'Authorization':_this.data.token},
      contentType: 'application/json;charset=UTF-8 ',
      data:{
        current:_this.data.page,
        size:_this.data.limit
      },
      success(res){
        console.log(res);
        if(res.statusCode == 200){
          var data = res.data.data.records;
          for(var i=0;i<data.length;i++){
            data[i].balanceEnergy = (data[i].balanceEnergy/1000).toFixed(2);
            data[i].totalEnergy = (data[i].totalEnergy/1000).toFixed(2);
          }
          _this.setData({
            rankingList:data,
            total:res.data.data.total,
            page:_this.data.page*1+1
          });
        }
      },
    })
    
  },

  /**
   * 遍历数据
   */
  bubble() {
    let that=this;
    let anmition=wx.createAnimation({
      duration: 1200,
      timingFunction: 'ease',
    })
    that.setData({
      animation:anmition
    })
    let arryList = new Array();
    //气泡数据测试
    // let arryList2 = [
    //   {
    //     energy:1289,
    //     type:1
    //   },{
    //     energy:4386,
    //     type:2
    //   },{
    //     energy:83290,
    //     type:3
    //   },{
    //     energy:986,
    //     type:1
    //   },{
    //     energy:29,
    //     type:1
    //   },{
    //     energy:100,
    //     type:1
    //   },
    // ];
    //遍历气泡数组
    let bubble = that.data.energy;
    // let bubble = arryList2;
    console.log(bubble);
    for (let i = 0; i <bubble.length; i++) {
      var val = bubble[i].energy.toString();
      var obj = {
        num: val.length >=4 ? (val/1000).toFixed(1) + 'kg' : val+'g',
        title: bubble[i].type == 1 ? '邀请': bubble[i].type == 2 ? '分享' : bubble[i].type == 3 ? '发电' : bubble[i].type == 4 ? '首买':'',
        anima: '',
        styleObject: '',
        isShow: true,
        realItem: true,
        size:val.length
      }
      arryList.push(obj)
    }
    //随机左边距 上边距 动画延时
    let left_width = 0, top_height = 0, anm_time,valsL = 300,valsH = 200;
    for (let i = 0; i < arryList.length; i++) {
      console.log(left_width);
      if(left_width != 0){
        left_width = Math.floor(Math.random() * 200 + 60);
      }else{
        left_width = Math.floor(Math.random() * 40 + 1);
      }
      if(top_height != 0){
        top_height = Math.floor(Math.random() * 140 + 80);
      }else{
        top_height = Math.floor(Math.random() * 100 + 80);
      }
      anm_time = (Math.random() * 1.1 + 0).toFixed(1);
      console.log('id:' + i + '左边距:' + left_width + ',上边距:' + top_height + ',动画时间:' + anm_time);
      arryList[i].top = top_height;
      arryList[i].styleObject =  that.formatStyle({
          "left": left_width + 'px',
          "top": top_height + 'px',
          "animation": 'heart 1.3s ease-in-out ' + anm_time + 's infinite alternate'
        })
      }
    
    // 空数组
    var emptarry = new Array();
    for (var i = 0; i < 16 - arryList.length; i++) {
      emptarry.push({
        realItem: false
      })
    }
    that.setData({
        myList: that.randomArry(arryList)
    })
    const query = wx.createSelectorQuery()
    query.select('#my_collect').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
     that.setData({
       my_collect:res[0]
     })
    })
  },
  //随机数组
  randomArry(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    return arr;
  },
/**
 * 格式化Style
 */
  formatStyle(position) {
    let styles = []
    for (let key in position) {
      styles.push(`${key}: ${position[key]};`)
    }
    return styles.join(' ')
  },
  //收集能量 
  bindTab(e) {
    let that = this;
    var id = that.data.energy[e.currentTarget.dataset.index].id;
    console.log(id);
    wx.request({
      url:app.globalData.baseUrl + '/wxEnergy/get',
      method:'GET',
      header:{'Authorization':that.data.token},
      contentType: 'application/json;charset=UTF-8 ',
      data:{
        id:id
      },
      success(res){
        console.log(res);
        if(res.data.errcode == 0){
          
          // that.data.myList[e.currentTarget.id].styleObject.animation = ''; //将css动画置空
          console.log(that.data.myList[e.currentTarget.id].styleObject);
          let myItm = that.data.myList[e.currentTarget.id];
          myItm.styleObject= myItm.styleObject.split("animation")[0];
          console.log(myItm.styleObject)
          console.log(that.data.my_collect)
          let itd = 'myList[' + e.currentTarget.id +'].styleObject';
          that.setData({
            [itd]: myItm.styleObject
          })
          setTimeout(function () {
              let dpi = that.data.system.screenWidth / 750; //计算像素密度
              //元素的位置
              let view_x = e.detail.x,
                view_y = e.detail.y + dpi * 116 / 2;
              let myCollect_x = that.data.my_collect.left + dpi * 130 / 2 + dpi * 260 / 2 * 0.5,
                myCollect_y = that.data.my_collect.right + that.data.myList[e.currentTarget.id].top+dpi*116/2 + dpi*113*0.5;
            var animation = wx.createAnimation({
              duration: 1200,
              timingFunction: 'ease',
            })

            that.animation = animation;
            animation.translate(myCollect_x - view_x + 30, myCollect_y - that.data.my_collect.height - 170 - view_y).opacity(0).step();
            animation.translateX(myCollect_x - view_x).step();
            animation.translateY(myCollect_y - view_y).step();
            let anmi = 'myList[' + e.currentTarget.id + '].anima';
            that.setData({
              [anmi]: animation.export()
            })
              setTimeout(function () {
                that.setData({
                  ['myList[' + e.currentTarget.id + '].isShow']: false
                })
              }, 1100)
          }, 100)
          var totalEnergy = res.data.data.totalEnergy;
          var energy = res.data.data.energy;
          setTimeout(function(){
            //能量排行榜
            wx.request({
              url: app.globalData.baseUrl+'/wxEnergy/rank',
              method:'GET',
              header:{'Authorization':_this.data.token},
              contentType: 'application/json;charset=UTF-8 ',
              data:{
                current:that.data.page,
                size:that.data.limit
              },
              success(res){
                console.log(res);
                if(res.statusCode == 200){
                  var data = res.data.data.records;
                  for(var i=0;i<data.length;i++){
                    data[i].balanceEnergy = (data[i].balanceEnergy/1000).toFixed(2);
                    data[i].totalEnergy = (data[i].totalEnergy/1000).toFixed(2);
                  }
                  that.setData({
                    rankingList:data,
                    total:res.data.data.total,
                    page:that.data.page*1+1,
                    totalEnergy:parseFloat(totalEnergy/1000).toFixed(2),
                    balanceEnergy:parseFloat(energy/1000).toFixed(2)
                  });
                }
              },
            })
          },1000);

        }
      },
    })
  },
  getRecord(){
    var _this = this;
    wx.navigateTo({
      url: '../myEnergy_record/index?total='+ _this.data.totalEnergy,
    });
  },
  // 上拉加载
onReachBottom: function () {
    var that = this;
    if (that.data.load) {//全局标志位，方式请求未响应是多次触发
      if (that.data.rankingList.length >= that.data.total) {
        wx.showToast({
          title: '已经到底了！',
          icon:"none",
          duration:3000
        })
      }else{
          that.setData({  
            load: false,
            loading: true,//加载动画的显示
          })
          wx.request({
            url: app.globalData.baseUrl+'/wxEnergy/rank',
            method:'GET',
            header:{'Authorization':that.data.token},
            contentType: 'application/json;charset=UTF-8 ',
            data:{
              current:that.data.page,
              size:that.data.limit
            },
            success: function (res) {
              console.log(res)
              if(res.data.errcode ==0){
                var content = that.data.rankingList.concat(res.data.data.records);
                that.setData({
                  rankingList: content,
                  page: that.data.page * 1 + 1,
                  load: true,
                  loading: false,
                })
              }
              
            },
            fail: function (res) {
                that.setData({
                  loading: false,
                  load: true,
                })
                wx.showToast({
                  title: '数据异常',
                  icon: 'none',
                  duration: 2000,
                }) 
            },
            complete: function (res) { },
          })
        }
      }
  },
  // 查看能量规则
  lookRule(){
    wx.navigateTo({
      url: '../xieYi/energy/index',
    })
  }
})