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
  onLoad: function(options){ 
    this.setData({  
      str: options.str  
    })  
    console.log(str)
   } 
})

