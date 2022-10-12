// pages/ListenMusic/listenMusic.js
import Pubsub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        musicList: {},
        musicId: '',
        musicLink: '',
        currentTime: "00:00",
        durationTime: "05:21",
        currentWidth: 0, //实时进度条的宽度
        durationWidth: 0 //进度条的总宽度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // //获取播放进度条的总宽度
        // const query = wx.createSelectorQuery();
        // query.select('.barControl').boundingClientRect();
        // query.exec((res) => {
        //     this.setData({
        //         durationWidth: res[0].width*2
        //     })
        // })


        let musicId = options.musicId;
        // console.log(musicId,'1111111');
        this.setData({
            musicId
        })
        // this.getMusicList(musicId);
        //创建音乐控件
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        // 判断当前页面音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            // 修改当前页面音乐播放状态为true
            this.setData({
                isPlay: true
            })
        } else {
            this.backgroundAudioManager.stop();
        }

        //监视音乐是否播放
        this.backgroundAudioManager.onPlay(() => {
            this.changeMusic(true);
            appInstance.globalData.musicId = this.data.musicId;
        });
        this.backgroundAudioManager.onPause(() => {
            this.changeMusic(false);
        })
        this.backgroundAudioManager.onStop(() => {
            this.changeMusic(false);
        })
        //监听音乐播放结束----单循循环
        this.backgroundAudioManager.onEnded(() => {
            let {
                isPlay,
                musicId,
                musicLink
            } = this.data;
            this.MusicControl(isPlay, musicId, musicLink);
        })
        //监听音乐实时播放的进度
        // this.backgroundAudioManager.onTimeUpdate(() => {
        //     let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
        //     let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * this.data.durationWidth;
        //     this.setData({
        //         currentTime,
        //         currentWidth
        //     })
        // })
        this.handleMusicPlay();

    },
    changeMusic(isPlay) {
        this.setData({
            isPlay
        })
        //修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = isPlay;
    },
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        let {
            musicId,
            musicLink
        } = this.data;
        this.MusicControl(isPlay, musicId, musicLink);
    },
    // async getMusicList(musicId) {
    //     // let muiscListData = await request('/song/detail', {
    //     //     ids: musicId
    //     // });
    //     // let musicListData=await request('/song/detail',{
    //     //     ids:musicId
    //     // })
    //     // console.log(musicListData);
    //     // let durationTime = moment(muiscListData.songs[0].dt).format('mm:ss');
    //     // this.setData({
    //     //     musicList: muiscListData.songs[0]
    //     // })

    // },

    //控制音乐播放或者暂停的功能函数
    async MusicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                let musicLinkData = await request('/song/url', {
                    id: musicId
                });
                musicLink = musicLinkData.data[0].url;
                this.setData({
                    musicLink
                })
            }
            //音乐播放
            this.backgroundAudioManager.src = musicLink;
            this.backgroundAudioManager.title ="未知名音乐家";
            // this.backgroundAudioManager.coverImgUrl = "/static/images/bizijpg.jpg"

        } else {
            this.backgroundAudioManager.pause();
        }
    },
    //切换音乐
    switchMusic(event) {
        // console.log(event);
        let type = event.currentTarget.id;
        // console.log(type);
        this.backgroundAudioManager.stop();
        //接收来自recommendSong页面发布的musicId
        Pubsub.subscribe('musicId', (message, musicId) => {
            this.setData({
                musicId
            })
            //获取音乐的详情
            // this.getMusicList(musicId);
            //自动播放当前音乐
            this.MusicControl(true, musicId);
            //取消订阅
            Pubsub.unsubscribe('musicId');
        })

        //发布消息给recommendSong页面
        Pubsub.publish('switchType', type);
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