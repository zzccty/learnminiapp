// pages/player/player.js
let musiclist=[]
//正在播放中的index索引的值
let PlayingIndex=0
//获取全局唯一的背景音频管理器
const backgroundAudioManager=wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:"",
    isPlaying:false//默认不播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PlayingIndex=options.index
    musiclist=wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  //获取对应的歌曲信息
  _loadMusicDetail(musicId){
    backgroundAudioManager.stop()//用于点击上下曲时，暂停上一首歌曲
    let music=musiclist[PlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musicURL',
        musicId:musicId,
      }
    }).then((res)=>{
      //做格式化输出
      let result=JSON.parse(res.result)
      //获取播放背景音频、将歌曲名字给了背景音频
      backgroundAudioManager.src=result.data[0].url
      backgroundAudioManager.title=music.name
      //如果开始播放，给isplaying改变一个状态
      this.setData({
        isPlaying:true
      })
    })
  },
  //暂停播放切换点击事件,处理了时间联动
  onTogglePlaying:function(){
    if (this.data.isPlaying) {
      //为TRUE是正在播放,将它暂停
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    //做数据绑定
    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },
  onShang:function(){
    PlayingIndex--
    if (PlayingIndex<0) {
      PlayingIndex=musiclist.length-1 //如果小于0，让他获取到最后一首歌的索引值
    }
    this._loadMusicDetail(musiclist[PlayingIndex].id)//获取对应歌曲信息
  },
  onXia:function(){
    PlayingIndex++
    if (PlayingIndex===musiclist.length) { //如果最大到了歌单长度，那么播放第一首音乐
      PlayingIndex=0
    }
    this._loadMusicDetail(musiclist[PlayingIndex].id)//获取对应歌曲信息
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