// pages/introduce/index.js
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

  },
  /**
   * 组件的方法列表
   */
  methods: {
    introduce_detail: function(e) {
      var id = e.currentTarget.id;
      wx.navigateTo({
        url: '../introduce_detail/index?str='+id,
      })
    }
  }
})

