// ../../tempale/tabBar/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navActive:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // current:wx.getStorageSync('tabIndex'),
    navData: [
      {
        pagePath: "../index/index",
        text: "首页",
        iconPath:"../../image/bar_icon1_grey.png",
        selectedIconPath:"../../image/bar_icon1_blue.png"
      },
      {
        pagePath: "../guarantee/index",
        text: "保障",
        iconPath:"../../image/bar_icon2_grey.png",
        selectedIconPath:"../../image/bar_icon2_blue.png"
      },
      {
        pagePath: "../shop/index",
        text: "低碳圈",
        iconPath:"../../image/shopDetail/shop.png",
        // iconPath:'https://www.jwpower.cn/image/shop_icon.png',
        // selectedIconPath:"../../image/shop_icon.png"
      },
      {
        pagePath: "../introduce/index",
        text: "发现",
        iconPath:"../../image/bar_icon3_grey.png",
        selectedIconPath:"../../image/bar_icon3_blue.png"
      },
      {
        pagePath: "../my/index",
        text: "我的",
        iconPath:"../../image/bar_icon4_grey.png",
        selectedIconPath:"../../image/bar_icon4_blue.png"
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabBarEvent(e){
      var src = e.currentTarget.dataset.src;
      // var index = e.currentTarget.dataset.index;
      // wx.setStorageSync('tabIndex', index)
      console.log(src);
      wx.redirectTo({
        url: src,
      })
    },
  }
})
