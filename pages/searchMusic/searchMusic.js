// pages/searchMusic/searchMusic.js
import request from '../../utils/request'
import Pubsub from 'pubsub-js'
let isSend=false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderDefault:'',
        hotList:[],
        getInputData:'',
        searchList:[],
        historyList:[],
        musicId:'',
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getplaceholderDefault();
        //订阅消息type
        Pubsub.subscribe('switchType',(message,type)=>{
            let {index,searchList}=this.data;
            if(type==='pre'){
                if(index===0){
                    index=searchList.length-1;
                }else{
                    index-=1;
                }
            }else{
                if(index===searchList.length-1){
                    index=0;
                }else{
                    index+=1;
                }
            }
            this.setData({
                index
            })
            let musicId=searchList[index].id;
            //将musicId发送给listenMusic页面
            Pubsub.publish('musicId',musicId);
        })
    },
    async getplaceholderDefault(){
        let placeholderDefaultData= await  request('/search/default');
        let hotListData=await request('/search/hot/detail');
        this.setData({
            placeholderDefault:placeholderDefaultData.data.showKeyword,
            hotList:hotListData.data
        })
    },
    handleInputChange(event){
        this.setData({
            getInputData:event.detail.value.trim()
        })
        //当表单内容为空的时候，直接清空searchList
        if(!this.data.getInputData){
            this.setData({
                searchList:[]
            })
            return;
        }
        //节流
        if(isSend){
            return;
        }
        isSend=true;
        this.getSearchList();//第一次执行
        //函数节流
        setTimeout(()=>{
            isSend=false;
            
        },717)
    },
   async getSearchList(){
       let {getInputData,historyList}=this.data;
        let searchListData=await request('/cloudsearch',{keywords:getInputData,limit:17});
        this.setData({
            searchList:searchListData.result.songs
        })
        //将搜索的关键字存放到历史数组中
        if(historyList.indexOf(getInputData)!==-1){
            historyList.splice(historyList.indexOf(getInputData),1);
        }
       
        
            historyList.unshift(getInputData);
        this.setData({
            historyList
        })


    },
    //清空表单项
    clearContent(){
        // console.log('1111');
        this.setData({
            getInputData:'',
            searchList:[]
        })
    },
    //删除历史记录
    deleteHistory(){
        wx.showModal({
          cancelColor: '#75bb92',
          confirmColor:'#75bb92',
          content:'确定清空全部历史记录?',
          confirmText:'清空',
          success:(res)=>{
              if(res.confirm){
                  this.setData({
                      historyList:[]
                  })
              }
          }
        })
    },
    //搜索功能
    handleListen(event){
        // console.log(event);
        let {index,song}=event.currentTarget.dataset;
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