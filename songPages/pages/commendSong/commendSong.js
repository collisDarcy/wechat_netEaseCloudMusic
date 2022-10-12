// pages/commendSong/commendSong.js
import Pubsub from 'pubsub-js'
import request from '../../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        year:'',
        month:'',
        day:'',
        recommendList:[],
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let userInfo=wx.getStorageSync('userInfo');
        // if(!userInfo){
        //     wx.showToast({
        //       title: 'Please Login',
        //       icon:'error',
        //       success:()=>{
        //           wx.reLaunch({
        //             url: '/LoginPages/pages/login/login',
        //           })
        //       }
        //     })
        // }
        this.getRecommendList();
        //订阅来自listenMusic页面发布的额消息
        Pubsub.subscribe('switchType',(message,type)=>{
            let {recommendList,index}=this.data;
            if(type==='pre'){
                //上一首
               if(index===0){
                   index=recommendList.length-1;
               }else{
                   index-=1;
               }
            }else{
                //下一首
                if(index===recommendList.length-1){
                    index=0;
                }else{
                    index+=1;
                }
            }
            this.setData({
                index
            })
            let musicId=recommendList[index].id;
            //将musicId发送给listenMusic页面
            Pubsub.publish('musicId',musicId);
        })
        //更新时间
        this.setData({
            year:new Date().getFullYear(),
            month:new Date().getMonth()+1,
            day:new Date().getDate()
        })

    },
    async getRecommendList(){
        let recommendListData=  await request('/recommend/songs');
        // console.log(recommendListData);
        this.setData({
            recommendList:recommendListData.data.dailySongs
        })
    },
    handleListen(event){
        let {index,song}=event.currentTarget.dataset;
        // console.log(event);
        this.setData({
            index
        })
        wx.navigateTo({
          url: '/songPages/pages/listenMusic/listenMusic?musicId='+song.id
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