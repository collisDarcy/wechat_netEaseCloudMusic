// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannersList:[],
        musicsList:[],
        topList:[],
        privateMusicList:[],
        privateMusicId:'',
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
     let bannersList = await request('/banner',{type:1});
     this.setData({
         bannersList:bannersList.banners
     })
     let musicsList =await request('/personalized',{limit:20});
     this.setData({
         musicsList:musicsList.result
     })
     let topListData=await request('/toplist/artist');
     let {artists} = topListData.list;
     this.setData({
         topList:artists
     })
    },
    recommendSong(){
        wx.navigateTo({
          url: '/songPages/pages/commendSong/commendSong'
        })
    },
    privateMusic(){
       wx.navigateTo({
          url: '/pages/privateLove/privateLove'
        })
    },
    toSearch(){
        wx.navigateTo({
          url: '/pages/searchMusic/searchMusic'
        })
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