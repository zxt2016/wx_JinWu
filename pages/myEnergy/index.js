const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system:'',
    animation: '',
    //用户总能量
    totalEnergy:'',
    //用户可用能量
    balanceEnergy:'',
    //能量气泡数据
    energy:[],
    //能量排行榜
    rankingList:[],
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
            totalEnergy:res.data.totalEnergy,
            balanceEnergy:res.data.balanceEnergy
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
        current:1,
        size:10
      },
      success(res){
        console.log(res);
        if(res.statusCode == 200){
          _this.setData({
            rankingList:res.data.data.records
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
        num: val.length >=4 ? (val/1000).toFixed(1) + 'kw' : val+'w',
        title: bubble[i].type == 1 ? '邀请': bubble[i].type == 2 ? '分享' : bubble[i].type == 3 ? '发电' : '',
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
        myList: that.randomArry(arryList.concat(emptarry))
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
        console.log(e.currentTarget.id)
        console.log('元素位置----', view_x, view_y)
        let myCollect_x = that.data.my_collect.left + dpi * 130 / 2 + dpi * 260 / 2 * 0.5,
          myCollect_y = that.data.my_collect.right + that.data.myList[e.currentTarget.id].top+dpi*116/2 + dpi*113*0.5;
        console.log('收集按钮位置----', myCollect_x, myCollect_y);
        console.log('移动位置----', myCollect_x - view_x, myCollect_y - view_y);
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
  },

    

})