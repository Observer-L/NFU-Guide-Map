//app.ts
export interface IMyApp {
  globalData: {
    userInfo?: wx.UserInfo;
    markers: any[];
    config: any;
    cloudRoot: string;
  };
}

import { config } from "./config/index";

App<IMyApp>({
  onLaunch() {
    let env: string;
    if (config.debug) {
      wx.setEnableDebug({
        enableDebug: true
      });
      env = config.cloud.dev.id;
    } else {
      env = config.cloud.prod.id;
    }
    wx.cloud.init({
      env,
      traceUser: true
    });
    console.log("* 当前环境：", env);
    this.globalData.config = config;
    this.globalData.cloudRoot =
      config.cloud[config.debug ? "dev" : "prod"].cloudRoot;

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
