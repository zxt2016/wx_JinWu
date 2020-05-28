// pages/share/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
  },

  share_rules: function(e) {
    wx.navigateTo({
      url: '../share_rules/index',
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
