// pages/captchaPage/captchaPage.js
import request from '../../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        captcha: ''
    },
    handleCaptcha(event) {
        this.setData({
            captcha: event.detail.value
        })
        // console.log(event.detail.value);
    },
    async login() {
        let phone = wx.getStorageSync('phone');
        let {captcha}=this.data;
        // console.log(phone);
        let captchaNumber = await request('/captcha/verify', {
            phone,
            captcha
        })
        console.log(captchaNumber);
        if (captchaNumber.code === 200) {
            wx.showToast({
                title: '登录成功',
            })
            wx.removeStorage({
                key:'phone',
                success(res){
                    console.log(res);
                }
            });
            wx.reLaunch({
                url: '/pages/personal/index',
            })
        } else {
            wx.showToast({
                title: '登录失败,重新登录!',
                icon: 'error'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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