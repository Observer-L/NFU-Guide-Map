# 数据使用说明

## 更新流程

![flow](https://656e-enanyuan-6db383-1257936504.tcb.qcloud.la/showcase/flow.svg?sign=abe8b922388e9920ea89b81f64efc20c&t=1566635619)

## 安装使用

请先确保本地已配置好 Python 环境，进入到程序目录：

```
  pipenv install
  pipenv run python main.py
```

## 数据格式

每个场景分类数据格式如下：

```javascript
  {
    _id: "5ce8fe1c29c7a8581bc1e989",  // id，云数据库录入upsert更新用
    type: "生活服务",   // 场景名称
    icon: "shfw",     // marker默认图标，为场景名称拼音缩写
    scale: 15.0,   // 场景在地图上的缩放值，可选。已废弃，用includePoints代替
    position: 0, // 指定在各个场景中的排列顺序
    data: [   // 该场景下的地点markers
      {
        name: "孙中山铜像",   // 地点名称
        short_name: "铜像", // 名称缩写
        desc: "中山铜像...", // 描述信息
        logo: "tx",   // 地点logo，缩写拼音, 如作各院系logo展示
        icon: "tx@2",   // 自定义marker图标，“@”后数字为图标相较于默认图标的缩放值
        images: 3,  // 图片数量，作拼接路径用（cloud://cloudRoot/1教/n.jpg）
        panorama: 0,  // 全景场景id
        latitude: "23.635875",  // 经度
        longitude: "113.678965",  // 纬度
        contact: { phone: "020-123456", address: "出门左转" }   // 联系方式
      }
    ]
  }
```

> 注意：使用 [JSON Lines](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/import.html?search-key=JSON%20lines) 格式以录入云数据库

## 辅助工具

1. [腾讯地图 - 坐标拾取器](https://lbs.qq.com/tool/getpoint/index.html)
