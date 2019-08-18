Component({
  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {},

  data: {
    bounding: wx.getMenuButtonBoundingClientRect()
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      console.log(this.data.bounding);
    },
    moved: function() {},
    detached: function() {}
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
    hide: function() {},
    resize: function() {}
  },

  methods: {
    onButtonTap: function() {
      wx.navigateBack({
        delta: 1
      });
    }
  }
});
