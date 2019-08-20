//index.js
//获取应用实例
import { IMyApp } from "../../app";
import mockMarkers from "../../mock/markers";
import routes from "../../mock/routes";

const app = getApp<IMyApp>();

Page({
  data: {
    mapContext: {} as wx.MapContext,
    bounding: wx.getMenuButtonBoundingClientRect(),
    windowWidth: wx.getSystemInfoSync().screenWidth,
    enablePanorama: app.globalData.config.panorama.active,
    markers: [] as any,
    allMarkers: [] as any,
    latitude: 23.632674,
    longitude: 113.679404,
    scale: 16,
    catIndex: 0,
    showDeck: false,
    showCats: true,
    toggleRoutes: false,
    routeIndex: 0,
    routes,
    route: [
      {
        points: [],
        ...app.globalData.config.markerStyle.polylineStyle
      }
    ],
    focusPointId: ""
  },
  navigateTo(e: any) {
    let url: string = "";
    switch (e.target.id) {
      case "school":
        url = `/pages/detail/detail?id=${e.target.id}`;
        break;
      case "panorama":
        url = `/pages/web-view/web-view?id=0`;
        break;
      case "search":
        url = `/pages/search/search`;
        break;
      default:
        url = `/pages/detail/detail?id=${e.markerId}${
          !this.data.toggleRoutes ? "&index=" + this.data.catIndex : ""
        }`;
        break;
    }
    wx.navigateTo({
      url
    });
  },
  closeRoutes() {
    this.setData!({
      markers: this.data.allMarkers[this.data.catIndex].data,
      toggleRoutes: false
    });
    this.includePoints(100);
  },
  locate() {
    this.data.mapContext.moveToLocation();
  },
  selectRoute(e: any) {
    if (!e.target.dataset.id) return;
    this.setData!({
      routeIndex: e.target.dataset.id,
      markers: this.data.routes[e.target.dataset.id].data,
      "route[0].points": this.data.routes[e.target.dataset.id].data,
      toggleRoutes: true
    });
    this.includePoints(100);
  },
  focusPoint(e: any) {
    console.log(e);

    this.setData!({
      scale: 18,
      latitude: this.data.markers[e.currentTarget.id[1]].latitude,
      longitude: this.data.markers[e.currentTarget.id[1]].longitude,
      focusPointId: e.currentTarget.id
    });
  },
  // TODO:
  loadRoutes() {
    let route: any;
    for (route of this.data.routes) {
      let count = 0;
      for (let point of route.data) {
        if (point.name) {
          count += 1;
          for (const i of this.data.allMarkers) {
            for (const j of i.data) {
              // console.count(1)
              if (j.name === point.name || j.short_name === point.name) {
                point = Object.assign(point, j);
                break;
              }
            }
          }
        } else {
          point.width = 0.1;
          point.height = 0.1;
        }
      }
      route.count = count;
    }
  },
  toggleCats() {
    this.setData!({
      showCats: !this.data.showCats
    });
  },
  toggleFAB() {
    this.setData!({
      showDeck: !this.data.showDeck,
      showCats: this.data.showDeck
    });
  },
  selectCat(e: any) {
    this.setData!({
      markers: this.data.allMarkers[e.target.dataset.id].data,
      catIndex: e.target.dataset.id
    });
    this.includePoints(100);
  },
  includePoints(padding: number) {
    this.data.mapContext.includePoints({
      padding: [padding, padding, padding, padding],
      points: this.data.markers
    });
  },
  clearMarkers(markers: any[]) {
    let num = 0;
    for (const i of markers) {
      for (const j of i.data) {
        j.id = num;
        num += 1;
        j.iconPath = `../../assets/images/markers/${i.icon}.png`;
        j.width = 35;
        j.height = 35;
        j.width = app.globalData.config.markerStyle.width;
        j.height = app.globalData.config.markerStyle.height;
        j.callout = Object.assign(
          { content: j.short_name ? j.short_name : j.name },
          app.globalData.config.markerStyle.calloutStyle
        );
      }
    }
    return markers;
  },
  async loadMarkers() {
    let markers: any[] = [];
    if (app.globalData.config.debug) {
      // 本地
      markers = mockMarkers;
    } else {
      // 云
      await wx.cloud
        .database()
        .collection("markers")
        .get()
        .then((res: { data: any[] }) => {
          markers = res.data;
        });
    }
    markers = this.clearMarkers(markers);
    app.globalData.markers = markers;
    this.setData!({
      markers: markers[this.data.catIndex].data,
      allMarkers: markers
    });
  },
  onReady() {
    this.setData!({
      mapContext: wx.createMapContext("map")
    });
  },
  async onLoad() {
    await this.loadMarkers();
    this.loadRoutes();
  }
});
