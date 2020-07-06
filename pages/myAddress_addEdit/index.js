// pages/myAddress_addEdit/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['', '', ''],
    // customItem: '全部'
    addData:{
      username:'',
      phone:'',
      address:''
    },
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      wx.setNavigationBarTitle({
        title: "编辑收货人"
      });
      var data =JSON.parse(wx.getStorageSync('address'));
      console.log(data);

      this.setData({
        id:options.id,
        region:data.city.split(' '),
        addData:{
          username:data.username,
          phone:data.phone,
          address:data.address
        }
      });
      
    }else{
      wx.setNavigationBarTitle({
        title: "新增收货人"
      });
    }
  },
  // 省市区三级联动
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 表单提交
  formSubmit(e) {
    var _this = this;
    var reg = /^(13[0-9]|14[5-9]|15[012356789]|16[0-9]|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
    var form = e.detail.value;
    console.log(e.detail.value)
    if(form.name ==""){
      wx.showToast({
        title: '请输入收货人姓名',
        icon:'none'
      })
    }else if(form.phone == ''){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
    }else if(reg.test(form.phone) == false){
      wx.showToast({
        title: '手机号格式不正确',
        icon:'none'
      })
    }else if(this.data.region[0] == ''){
      wx.showToast({
        title: '请选择省市区',
        icon:'none'
      })
    }else if(form.addDetail == ''){
      wx.showToast({
        title: '请输入详细地址',
        icon:'none'
      })
    }else{
      // console.log({
      //   username:form.name,
      //   phone:form.phone,
      //   city:_this.data.region[0]+_this.data.region[1]+_this.data.region[2],
      //   address:form.addDetail
      // })
      console.log({
        username:form.name,
        phone:form.phone,
        city:_this.data.region[0]+' '+_this.data.region[1]+' '+_this.data.region[2],
        address:form.addDetail
      })
      if(!_this.data.id){
        
        wx.request({
          url: app.globalData.baseUrl+'/wxUserAddress/add',
          method: 'POST', 
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data:JSON.stringify(
            {
              username:form.name,
              phone:form.phone,
              city:_this.data.region[0]+' '+_this.data.region[1]+' '+_this.data.region[2],
              address:form.addDetail
            }
          ),
          success (res) {
            console.log(res);
            if(res.data.errcode == 0){
              wx.showToast({
                title: '操作成功',
                icon:'none'
              })
              setTimeout(function(){
                wx.navigateTo({
                  url: '../myAddress/index',
                })
              },500);
            }
          }
        })
      }else{
        console.log(333)
        wx.request({
          url: app.globalData.baseUrl+'/wxUserAddress/update',
          method: 'POST', 
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          data:JSON.stringify(
            {
              id:_this.data.id,
              username:form.name,
              phone:form.phone,
              city:_this.data.region[0]+' '+_this.data.region[1]+' '+_this.data.region[2],
              address:form.addDetail
            }
          ),
          success (res) {
            console.log(res);
            if(res.data.errcode == 0){
              wx.showToast({
                title: '操作成功',
                icon:'none'
              })
              setTimeout(function(){
                wx.navigateTo({
                  url: '../myAddress/index',
                })
              },500);
            }
          }
        })
      }
      
    }
  },
})