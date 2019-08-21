Component({
  properties: {
    color: {
      type: String,
      value: "white"
    },
    delta: {
      type: String,
      optionalTypes: [Number],
      value: 1
    }
  },

  data: {
    bounding: wx.getMenuButtonBoundingClientRect()
  },

  methods: {
    onButtonTap: function() {
      wx.navigateBack({
        delta: this.data.delta
      });
    }
  }
});
