//index.js
//获取应用实例
const app = getApp();
// var THREE = require('../../utils/three');
// var OrbitControls = require('../../utils/OrbitControls');
// import { OrbitControls } from '../../utils/gltf-loader'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //轮播图效果
    banner_img: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    circular: true,
    //星系轮播
    autoplay2: false,
    circular2: true,
    indicatorDots2: false,


    //电站tab切换标识
    stationType:1,
    //星系旋转标识
    step:1,
    //星球数据
    starData:[
      {
        num:0,
      },
      {
        num:1,
      },
      {
        num:2,
      },
      {
        num:3,
      },
      {
        num:4,
      },
    ],
    animation: {},
  },
  //事件处理函数
  bindViewTap: function() { 
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () { 
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getBannerList();


    // wx.createSelectorQuery()
    //   .select('#c')
    //   .node()
    //   .exec((res) => {
    //     const canvas = THREE.global.registerCanvas(res[0].node)
    //     // const canvas = res[0].node
    //     this.setData({ canvasId: canvas._canvasId })

    //     const camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 1, 1000);
    //     camera.position.z = 500;
    //     const scene = new THREE.Scene();
    //     scene.background = new THREE.Color(0xAAAAAA);
    //     const renderer = new THREE.WebGLRenderer({ antialias: true });
      
    //     const controls = new OrbitControls(camera, renderer.domElement);
    //     // controls.enableDamping = true;
    //     // controls.dampingFactor = 0.25;
    //     // controls.enableZoom = false;
    //     camera.position.set(200, 200, 500);
    //     controls.update();
    //     const geometry = new THREE.BoxBufferGeometry(200, 200, 200);
      
    //     const texture = new THREE.TextureLoader().load('./pikachu.png');
    //     const material = new THREE.MeshBasicMaterial({ map: texture });
      
    //     // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
    //     const mesh = new THREE.Mesh(geometry, material);
    //     scene.add(mesh);
      
    //     // renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
    //     // renderer.setSize(canvas.width, canvas.height);
      
    //     function onWindowResize() {
    //       camera.aspect = window.innerWidth / window.innerHeight;
    //       camera.updateProjectionMatrix();
    //       renderer.setSize(canvas.width, canvas.height);
    //     }
    //     function render() {
    //       canvas.requestAnimationFrame(render);
    //       // mesh.rotation.x += 0.005;
    //       // mesh.rotation.y += 0.01;
    //       controls.update();
    //       renderer.render(scene, camera);
    //     }

    //     render()

    //   })
  },
  onUnload: function () {
    THREE.global.unregisterCanvas(this.data.canvasId)
  },
  touchStart(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
  },
  touchMove(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
  },
  touchEnd(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
  },
  touchCancel(e) {
    // console.log('canvas', e)
  },
  longTap(e) {
    // console.log('canvas', e)
  },
  tap(e) {
    // console.log('canvas', e)
  },
  documentTouchStart(e) {
    // console.log('document',e)
  },
  documentTouchMove(e) {
    // console.log('document',e)
  },
  documentTouchEnd(e) {
    // console.log('document',e)
  },





  onShow(){
    var _this = this;
    // setInterval(function(){
    //   _this.starRotate();
    // },3000);
  },



  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getBannerList: function() { 
    var _this = this
    wx.request({
      url: app.globalData.baseUrl+'/advertising/getBannertList',
      method: 'GET', 
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        var img_list = []
        for (var i = 0; i < res.data.data.length; i++) {
          img_list.push(res.data.data[i].img,)
        }  
        _this.setData({
          banner_img: img_list
        })
      }
    })
  },
  //电站切换
  stationTab: function(e){
    this.setData({
      stationType:e.currentTarget.dataset.num
    });
  },
  //星系转动-->从右向左
  starRotate:function(){
    var _this = this,
    starData = _this.data.starData
    //设定最大值为5，
    for(var i=0;i<starData.length;i++){
      if(starData[i].num == 0){
        starData[i].num = starData.length-1;
      }else{
        var val = starData[i].num;
        starData[i].num = val-1;
      }
    }
    _this.setData({starData});
  },

  
})
