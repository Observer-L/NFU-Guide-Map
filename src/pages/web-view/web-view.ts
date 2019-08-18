//web-view.js
//获取应用实例
import { IMyApp } from "../../app";

const app = getApp<IMyApp>();

Page({
  data: {
    panoramaUrl: app.globalData.config.panorama.rootUrl
  },
  onLoad(options: any) {
    console.log(options);
    this.setData!({
      panoramaUrl: this.data.panoramaUrl += options.id
    });
  }
});
