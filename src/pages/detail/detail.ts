//detail.js
import { IMyApp } from "../../app";

const app = getApp<IMyApp>();

Page({
  data: {
    marker: {} as any,
    logoUrl: "",
    cloudRoot: app.globalData.cloudRoot,
    enablePanorama: app.globalData.config.panorama.active,
    imgUrls: []
  },
  previewImage(e: any) {
    wx.previewImage({
      current: this.data.imgUrls[e.target.dataset.id],
      urls: this.data.imgUrls
    });
  },
  navigateTo(e: any) {
    switch (e.target.id) {
      case "address":
      case "navigate":
        wx.openLocation({
          latitude: Number(this.data.marker.latitude),
          longitude: Number(this.data.marker.longitude),
          name: this.data.marker.name,
          scale: 15
        });
        break;
      case "phone":
        wx.makePhoneCall({
          phoneNumber: this.data.marker.contact.phone
        });
        break;
      case "panorama":
        wx.navigateTo({
          url: `/pages/web-view/web-view?id=${this.data.marker.panorama}`
        });
        break;
      default:
        break;
    }
  },
  onLoad(options: any) {
    console.log(options);
    let marker: any;
    const debug: boolean = app.globalData.config.debug;
    const imgUrls: any = [];
    switch (options.id) {
      case "school":
        marker =
          app.globalData.markers[app.globalData.markers.length - 1].data[0];
        break;
      default:
        if (!options.index) {
          for (const m of app.globalData.markers) {
            for (const i of m.data) {
              if (i.id == options.id) {
                marker = i;
                break;
              }
            }
          }
        } else {
          marker = app.globalData.markers[options.index].data.filter(
            (m: any) => m.id == options.id
          )[0];
        }
        break;
    }
    if (!debug) {
      for (let i = 0; i < marker.images; i++) {
        imgUrls.push(
          this.data.cloudRoot +
            "images/" +
            (marker.short_name || marker.name) +
            "/" +
            i +
            ".jpg"
        );
      }
    }
    this.setData!({
      marker,
      imgUrls,
      logoUrl:
        marker.logo && !debug
          ? this.data.cloudRoot + "logo/" + marker.logo + ".jpg"
          : ""
    });
  }
});
