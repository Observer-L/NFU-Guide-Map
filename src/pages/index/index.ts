//index.js
import { IMyApp } from "../../app";
import { mockMarkers, mockRoutes } from "../../mock/index";

const app = getApp<IMyApp>();

Page({
  data: {
    markers: [] as any,
    allMarkers: [] as any,
    circles: [],
    latitude: 23.632674,
    longitude: 113.679404,
    scale: 16,
    catIndex: 0,
    routeIndex: 0,
    showDeck: false,
    showCats: true,
    toggleRoutes: false,
    focusPointId: "",
    routes: mockRoutes,
    route: [
      {
        points: [],
        ...app.globalData.config.markerStyle.polylineStyle
      }
    ],
    mapContext: {} as wx.MapContext,
    bounding: wx.getMenuButtonBoundingClientRect(),
    windowWidth: wx.getSystemInfoSync().screenWidth,
    enablePanorama: app.globalData.config.panorama.active
  },
  navigateTo(e: any) {
    let url: string;
    switch (e.target.id) {
      case "school":
        url = `/pages/detail/detail?id=${e.target.id}`;
        break;
      case "panorama":
        url = `/pages/web-view/web-view?id=0`;
        break;
      case "board":
        url = "/pages/board/board";
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
    const route = this.data.routes[e.target.dataset.id];
    const circles = route.circles;
    const _circles = [];
    if (circles) {
      for (const c of circles) {
        _circles.push({
          ...c,
          ...app.globalData.config.markerStyle.circleStyle
        });
      }
    }
    this.setData!({
      routeIndex: e.target.dataset.id,
      markers: route.data,
      "route[0].points": route.data,
      toggleRoutes: true,
      circles: _circles
    });
    this.includePoints(100);
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
  focusPoint(e: any) {
    this.setData!({
      scale: 18,
      latitude: this.data.markers[e.currentTarget.id[1]].latitude,
      longitude: this.data.markers[e.currentTarget.id[1]].longitude,
      focusPointId: e.currentTarget.id
    });
  },
  includePoints(padding: number) {
    this.data.mapContext.includePoints({
      padding: [padding, padding, padding, padding],
      points: this.data.markers
    });
  },
  sortMarkers(markers: any): any {
    if (markers.length <= 1) return markers;
    const left = [];
    const right = [];
    const pivotIndex = Math.floor(markers.length / 2);
    const pivot = markers.splice(pivotIndex, 1)[0];
    for (const i of markers) {
      if (i.position < pivot.position) {
        left.push(i);
      } else {
        right.push(i);
      }
    }
    return this.sortMarkers(left).concat([pivot], this.sortMarkers(right));
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
              if (j.name === point.name || j.short_name === point.name) {
                point = Object.assign(point, j);
                break;
              }
            }
          }
        } else {
          // 隐藏节点
          point.iconPath = `/assets/images/markers/jd.png`;
          point.width = 1;
          point.height = 1;
        }
      }
      route.count = count;
    }
    this.setData!({
      routes: this.data.routes
    });
  },
  clearMarkers(markers: any[]) {
    let num = 0;
    for (const i of markers) {
      for (const j of i.data) {
        j.id = num;
        num += 1;
        j.iconPath = `/assets/images/markers/${j.icon ? j.icon : i.icon}.png`;
        if (j.icon) {
          const scale =
            j.icon.indexOf("@") !== -1
              ? j.icon.slice(j.icon.indexOf("@") + 1)
              : 1;
          j.width = app.globalData.config.markerStyle.width * scale;
          j.height = app.globalData.config.markerStyle.height * scale;
        } else {
          j.width = app.globalData.config.markerStyle.width;
          j.height = app.globalData.config.markerStyle.height;
        }
        j.callout = Object.assign(
          { content: j.short_name ? j.short_name : j.name },
          app.globalData.config.markerStyle.calloutStyle
        );
      }
    }
    return markers;
  },
  async loadMarkers() {
    let markers;
    if (app.globalData.config.debug) {
      // 本地
      markers = mockMarkers;
    } else {
      // 云
      await wx.cloud
        .callFunction({
          name: "loadMarkers"
        })
        .then((res: any) => {
          markers = res.result.data;
        });
    }
    markers = this.clearMarkers(this.sortMarkers(markers));
    app.globalData.markers = markers;
    this.setData!({
      markers: markers[this.data.catIndex].data,
      allMarkers: markers
    });
  },
  async onLoad() {
    await this.loadMarkers();
    this.loadRoutes();
  },
  onReady() {
    this.setData!({
      mapContext: wx.createMapContext("map")
    });
  }
});
