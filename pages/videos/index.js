// pages/videos/index.js
import request from '../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], //导航标签数据
        navId: '', //导航点击的标识
        videoList: [], //视频列表数据
        videoTwoList: [],
        videoID: [], //视频的id标识
        videoUpdateTime: [], //视频的播放时长
        isTriggered: false, //下拉刷新
        refresheId: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getVideoGroupListData();
        this.getVideoList(10);
        this.getVideoTwoList(20);
    },

    async getVideoGroupListData() {
        let videoGroupListData = await request('/video/group/list');
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 14),
            navId: videoGroupListData.data[0].id
        })
    },
    //获取视频数据
    async getVideoList(offset) {
        let videoListData = await request('/video/timeline/recommend', {
            offset: offset
        });
        if (videoListData.code === 200) {
            wx.showToast({
                title: '视频获取成功!',
            })
            this.setData({
                videoList: videoListData.datas,
                isTriggered: false
            })
        } else {
            wx.showToast({
                title: '视频获取失败!',
                icon: 'error'
            })
        }
    },
    async getVideoTwoList(offset) {
        let videoTwoListData = await request('/video/timeline/recommend', {
            offset: offset
        });
        wx.hideLoading({
            success: (res) => {
                console.log(res);
            },
        })
        if (videoTwoListData.code === 200) {
            wx.showToast({
                title: '视频获取成功!',
            })
            this.setData({
                videoTwoList: videoTwoListData.datas
            })
        } else {
            wx.showToast({
                title: '视频获取失败!',
                icon: 'error'
            })
        }

    },
    changeActive(event) {
        wx.showLoading({
            title: '加载中.....'
        })
        let navId = event.currentTarget.id; //通过id向event传参的时候，如果是number会自动转换为string
        this.setData({
            navId: navId * 1
        })
        let navTwoId = navId + 1;
        this.getVideoList(navId);
        this.getVideoTwoList(navTwoId);
    },
    handlePlay(event) {
        let vid = event.currentTarget.id;
        this.setData({
            videoID: vid
        })
        //创建控制video标签的实例对象
        this.videoContextPrev = wx.createVideoContext(vid);
        //关闭当前播放的视频
        // this.videoContextPrev.stop();
        let {
            videoUpdateTime
        } = this.data;
        let videoItem = videoUpdateTime.find(item => item.vid === vid);
        if (videoItem) {
            //获取播放的时间点
            let timepoint = videoItem.currentTime;
            this.timer1 = setTimeout(() => {
                let videoContext1 = wx.createVideoContext(vid);
                //跳转到指定的时间位置
                videoContext1.seek(timepoint);
                videoContext1.play();
            }, 200)
        }
        //没有播放记录就开始重新播放
        else {
            this.timer2 = setTimeout(() => {
                let videoContext2 = wx.createVideoContext(vid);
                videoContext2.play();
            }, 200)
        }
    },
    handleTimeUpdate(event) {
        let {
            videoUpdateTime
        } = this.data;
        let videoTimeObj = {
            vid: event.currentTarget.id,
            currentTime: event.detail.currentTime
        };

        let videoItem = videoUpdateTime.find(item =>
            item.vid === videoTimeObj.vid
        );
        if (videoItem) {
            //如果存在，则将播放时间修改为当前时间
            videoItem.currentTime = videoTimeObj.currentTime;
        } else {
            //没有，则在数组中添加当前视频的播放对象
            videoUpdateTime.push(videoTimeObj);
        }
        this.setData({
            videoUpdateTime
        })

    },
    handleEnded(event) {
        let {
            videoUpdateTime
        } = this.data
        let index = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id)
        // splice(index,howmany) ——> 删除从index位置开始的数，howmany为删除的个数
        // 若 howmany 小于等于 0，则不删除
        videoUpdateTime.splice(index, 1)
        this.setData({
            videoUpdateTime: videoUpdateTime,
            // 这里将videoId重置，使页面渲染的视频均为image封面图覆盖
            videoID: ''
        })
    },
    //下拉刷新
    handleRefresher(event) {
        let refresheId = event.timeStamp;
        this.setData({
            refresheId
        })
        let refreshTwoId = refresheId + 1;
        this.getVideoList(refresheId);
        this.getVideoTwoList(refreshTwoId);
    },
    //上拉刷新
    async handleToLower(event) {
        let refresheId = event.timeStamp;

        let videoListData = await request('/video/timeline/recommend', {
            offset: refresheId
        });
        let videoTwoListData = await request('/video/timeline/recommend', {
            offset: refresheId+1
        }); 
        if (videoListData.code === 200||videoTwoListData.code===200) {
            wx.showToast({
                title: '视频加载成功',
            })
            this.setData({
                videoList:videoListData.datas,
                videoTwoList:videoTwoListData.datas
            })
        } else {
            wx.showToast({
                title: '视频加载失败!',
                icon: 'error'
            })
        }

     
        // this.getVideoTwoList(refreshTwoId);

    },
    //转发功能
    handleForward(){
        console.log('1111');
    },
    toSearch(){
        wx.navigateTo({
          url: '/pages/searchMusic/searchMusic',
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