// pages/privateLove/privateLove.js
import moment from 'moment'
import Pubsub, { countSubscriptions } from 'pubsub-js'
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        privateLoveId: '',
        privateMusicList: [],
        musicLink: '', //播放的音乐url
        currentTime: '00:00',
        durationTime: '00:00',
        currentWidth: 0,
        index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let {
            privateLoveId,
        } = this.data;
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this.getPrivateLove();
        //监视音乐是否播放
        this.backgroundAudioManager.onPlay(() => {
            this.changeMusic(true);
            appInstance.globalData.musicId = privateLoveId;
            // console.log(privateLoveId,'1');
        });
        this.backgroundAudioManager.onPause(() => {
            this.changeMusic(false);
        })
        this.backgroundAudioManager.onStop(() => {
            this.changeMusic(false);
        })
        //监听音乐的实时播放进度
        this.backgroundAudioManager.onTimeUpdate(() => {
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
            this.setData({
                currentTime,
                currentWidth
            })
        })
        //监听音乐播放结束
        this.backgroundAudioManager.onEnded(async () => {
            let {index,privateMusicList}=this.data;
            let privateMusicListData = await request('/personal_fm');
            if(index==privateMusicList.length-1){
                index=0;
            }else{
                index+=1;
            }
            this.setData({
                index
            })
            let  privateLoveId=privateMusicList[index].id;
            let durationTime=moment(privateMusicList[index].duration).format('mm:ss');
            this.setData({
                privateLoveId,
                privateMusicList:privateMusicListData.data,
                durationTime
            })
            this.MusicControl(true,privateLoveId);
            this.handleMusicPlay();
        })
    },
    async getPrivateLove() {
        let privateMusicListData = await request('/personal_fm');
        let {index}=this.data;
        let durationTime=moment(privateMusicListData.data[index].duration).format('mm:ss');
        this.setData({
            privateMusicList: privateMusicListData.data,
            privateLoveId: privateMusicListData.data[index].id,
            durationTime
        })
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===privateMusicListData.data[index].id ) {
            this.setData({
                isPlay: true
            })
        }
        this.handleMusicPlay();

    },
    changeMusic(isPlay) {
        this.setData({
            isPlay
        })
        //修改全局音乐的播放状态
        appInstance.globalData.isMusicPlay = isPlay;
    },
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        let {
            privateLoveId,
            musicLink
        } = this.data;
        this.MusicControl(isPlay, privateLoveId, musicLink);
    },
    //控制音乐播放或者暂停的功能函数
    async MusicControl(isPlay, privateLoveId, musicLink) {
        let {
            index,
            privateMusicList
        } = this.data;
        if (isPlay) {
            if (!musicLink) {
                let privateLinkData = await request('/song/url', {
                    id: privateLoveId
                });
                musicLink = privateLinkData.data[0].url;
                this.setData({
                    musicLink,
                    privateMusicList
                })
            }
            this.backgroundAudioManager.src = musicLink;
            this.backgroundAudioManager.title = this.data.privateMusicList[index].name;
            this.backgroundAudioManager.coverImgUrl = this.data.privateMusicList[index].album.picUrl;
        } else {
            this.backgroundAudioManager.pause();
        }
    },
    //切换上/下一首音乐
    switchMusic(event) {
        let {
            index,
            privateMusicList
        } = this.data;
        let type = event.currentTarget.id;
        if (type === 'pre') {
            (index === 0) && (index = privateMusicList.length);
            index -= 1;
        } else {
            (index === privateMusicList.length - 1) && (index = -1);
            index += 1;
        }
        this.setData({
            index,
            privateMusicList
        })
        let privateLoveId = privateMusicList[index].id;
        this.getPrivateLove();
        this.MusicControl(true, privateLoveId);
     
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