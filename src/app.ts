//app.ts
export interface IMyApp {
  globalData: {
    userInfo?: wx.UserInfo;
    markers: any[];
    config: any;
    cloudRoot: string;
  };
}

import config from "./config/index";

App<IMyApp>({
  onLaunch() {
    if (config.debug) {
      wx.setEnableDebug({
        enableDebug: true
      });
    } else {
      wx.cloud.init({
        env: config.cloud.id,
        traceUser: true
      });
      this.globalData.cloudRoot = config.cloud.cloudRoot;
    }
    this.globalData.config = config;

    // 展示本地存储能力
    // var logs: number[] = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  globalData: {
    config,
    markers: [],
    cloudRoot: ""
  }
});
