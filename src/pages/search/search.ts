//search.js
//获取应用实例
import { IMyApp } from "../../app";

const app = getApp<IMyApp>();

Page({
  data: {
    allMarkers: [] as any,
    markers: [],
    isInputFocus: false,
    catIndex: 0,
    keyword: "",
    windowWidth: wx.getSystemInfoSync().screenWidth
  },
  selectCat(e: any) {
    let catIndex: number = e.target.id[1];
    this.setData!({
      catIndex,
      markers: app.globalData.markers[catIndex].data
    });
  },
  initResults() {
    if (this.data.keyword) {
      this.setData!({
        keyword: "",
        markers: this.data.allMarkers[this.data.catIndex].data
      });
    }
  },
  toggleResults() {
    this.setData!({
      isInputFocus: !this.data.isInputFocus
    });
  },
  search(e: any) {
    let value: string = e.detail.value.trim();
    let results: any = [];
    for (const i of this.data.allMarkers) {
      for (const j of i.data) {
        if (j.name.includes(value)) {
          results.push(j);
        }
      }
    }
    this.setData!({
      markers: results,
      keyword: value
    });
  },
  navigateTo(e: any) {
    if (e.target.dataset.id) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${e.target.dataset.id}&index=${this.data.catIndex}`
      });
    }
  },
  onLoad() {
    this.setData!({
      search: this.search.bind(this),
      allMarkers: app.globalData.markers,
      markers: app.globalData.markers[this.data.catIndex].data
    });
  }
});
