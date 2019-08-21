//board.js
import { IMyApp } from "../../app";
import mockComments from "../../mock/comments";
import mockBoard from "../../mock/board";
import info from "../../config/info";
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";

const app = getApp<IMyApp>();

Page({
  data: {
    info,
    comment: "",
    comments: [] as any,
    messages: [],
    activeNum: [0],
    showComment: false,
    showAbout: false,
    loading: false,
    bounding: wx.getMenuButtonBoundingClientRect()
  },
  onLoad() {
    this.loadBoardMessages();
    this.loadComments();
  },
  copy(e: any) {
    let data: string = "";
    switch (e.currentTarget.id) {
      case "github":
        data = info.contact.github;
        break;
      case "qq":
        data = info.contact.qq;
        break;
      default:
        break;
    }
    wx.setClipboardData({ data });
  },
  toggleBoard(e: any) {
    this.setData!({
      activeNum: e.detail
    });
  },
  toggleAbout() {
    this.setData!({
      showAbout: !this.data.showAbout
    });
  },
  toggleComments() {
    this.setData!({
      showComment: !this.data.showComment
    });
  },
  inputComment(e: any) {
    this.setData!({
      comment: e.detail
    });
  },
  send(e: any) {
    const self = this;
    let userInfo: any = e.detail.userInfo;
    // TODO: validate
    if (!self.data.comment.trim()) {
      Toast.fail({
        message: "请检查输入内容",
        duration: 1000
      });
      return;
    }
    this.setData!({
      loading: true
    });
    const data = {
      username: userInfo.nickName,
      created_time: new Date().getTime(),
      avatar: userInfo.avatarUrl,
      content: self.data.comment
    };
    self.data.comments.unshift(data);
    if (app.globalData.config.debug) {
      setTimeout(() => {
        Toast.success({
          message: "测试留言成功",
          duration: 1000
        });
        this.setData!({
          comments: self.data.comments,
          comment: "",
          loading: false
        });
      }, 2000);
    } else {
      const db = wx.cloud.database();

      db.collection("comments")
        .add({ data })
        .then(() => {
          wx.cloud
            .callFunction({
              name: "loadComments"
            })
            .then(() => {
              this.setData!({
                comments: self.data.comments,
                comment: "",
                loading: false
              });
              Toast.success({
                message: "留言成功",
                duration: 1000
              });
            });
        });
    }
  },
  async loadComments() {
    let comments: any;
    if (app.globalData.config.debug) {
      comments = mockComments;
    } else {
      await wx.cloud
        .callFunction({
          name: "loadComments"
        })
        .then((res: any) => {
          comments = res.result.data.reverse();
        });
    }
    this.setData!({
      comments
    });
  },
  loadBoardMessages() {
    if (app.globalData.config.debug) {
      this.setData!({
        messages: mockBoard
      });
    } else {
      const db = wx.cloud.database();
      db.collection("board")
        .get()
        .then((res: any) => {
          console.log(res);

          this.setData!({
            messages: res.data
          });
        });
    }
  }
});
