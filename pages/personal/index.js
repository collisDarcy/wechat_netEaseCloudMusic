// pages/personal/index.js
import request from '../../utils/request';
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},
    recentListenMusicList: []
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    // 动态更新coverTransform的状态值
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 120) {
      moveDistance = 120;
    }
    this.setData({
      coverTransition: '',
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransition: 'transform 1s linear',
      coverTransform: `translateY(0)`
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/LoginPages/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       //读取存储到本地的用户信息
       let userInfo = wx.getStorageSync('userInfo');

       if (userInfo) {
         this.setData({
           userInfo: JSON.parse(userInfo)
         })
         this.getUserListenMusicList(this.data.userInfo.userId);
       }
  },
  //获取用户的播放记录
  async getUserListenMusicList(userId) {
    let recentListenMusicListData = await request('/user/record', {
      uid: userId,
      type: 1
    });
    let index = 0;
    let recentListenMusicList = recentListenMusicListData.weekData.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      recentListenMusicList
    })
  },
  //退出接口
  async handleLogout() {
    let LogoutResult = await request('/logout');
    if (LogoutResult.code === 200) {
      wx.removeStorage({
        key: 'userInfo',
        success(res){
          wx.showToast({
            title: '退出成功!',
          })
        }
    })
    this.data.userInfo={};
    this.data.recentListenMusicList=[];
  } else {
      wx.showToast({
        title: '退出登录失败',
        icon: 'error'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})