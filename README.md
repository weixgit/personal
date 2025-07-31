# Mapbox 地图导出工具

> 使用 Node.js 和 Puppeteer 实现的高质量 Mapbox 地图图片导出工具

## 功能特性

- 🗺️ **多样式支持** - 支持所有 Mapbox 地图样式
- 📍 **标记点** - 支持添加自定义标记点和弹窗
- 🎨 **自定义图层** - 支持 GeoJSON 数据和自定义样式
- 📏 **灵活尺寸** - 支持任意尺寸和高分辨率导出
- 🔄 **批量导出** - 支持批量导出多个地图
- 🎯 **边界适配** - 支持根据地理边界自动调整视图
- 🖼️ **多格式** - 支持 PNG 和 JPEG 格式

## 安装

```bash
# 克隆项目
git clone <repository-url>
cd mapbox-export-tool

# 安装依赖
npm install
```

## 快速开始

### 1. 设置 Mapbox Access Token

首先需要获取 Mapbox Access Token：

1. 访问 [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. 登录你的账户
3. 创建或复制现有的 Access Token
4. 设置环境变量：

```bash
export MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

### 2. 基础使用

```javascript
const MapboxExporter = require('./src/mapbox-exporter');

async function example() {
  const exporter = new MapboxExporter();
  
  // 导出北京地图
  const outputPath = await exporter.exportMap({
    center: [116.3974, 39.9093], // 北京坐标
    zoom: 12,
    width: 1024,
    height: 768,
    outputPath: 'beijing-map.png'
  });
  
  console.log(`地图已导出: ${outputPath}`);
}

example();
```

### 3. 运行示例

```bash
# 基础示例
npm run example

# 高级示例
node examples/advanced-usage.js

# 测试导出
npm run test
```

## API 文档

### MapboxExporter 类

#### 构造函数

```javascript
const exporter = new MapboxExporter(options);
```

**参数:**
- `options.accessToken` - Mapbox Access Token (可选，优先使用环境变量)
- `options.width` - 默认宽度 (默认: 1024)
- `options.height` - 默认高度 (默认: 768)
- `options.zoom` - 默认缩放级别 (默认: 10)
- `options.center` - 默认中心点 (默认: [116.3974, 39.9093])
- `options.style` - 默认地图样式 (默认: 'mapbox://styles/mapbox/streets-v11')

#### exportMap(options)

导出单个地图。

**参数:**
- `options.center` - 地图中心点 `[lng, lat]`
- `options.zoom` - 缩放级别 (1-22)
- `options.width` - 图片宽度 (像素)
- `options.height` - 图片高度 (像素)
- `options.style` - 地图样式 URL
- `options.format` - 输出格式 ('png' | 'jpeg')
- `options.quality` - JPEG 质量 (1-100)
- `options.deviceScaleFactor` - 设备像素比 (默认: 2)
- `options.outputPath` - 输出文件路径
- `options.bounds` - 地图边界 `[[sw_lng, sw_lat], [ne_lng, ne_lat]]`
- `options.markers` - 标记点数组
- `options.layers` - 自定义图层配置

**返回:** `Promise<string>` - 导出的文件路径

#### batchExport(configs)

批量导出多个地图。

**参数:**
- `configs` - 导出配置数组

**返回:** `Promise<Array>` - 导出结果数组

## 使用示例

### 基础导出

```javascript
const outputPath = await exporter.exportMap({
  center: [121.4737, 31.2304], // 上海
  zoom: 12,
  style: 'mapbox://styles/mapbox/satellite-v9',
  outputPath: 'shanghai-satellite.png'
});
```

### 添加标记点

```javascript
await exporter.exportMap({
  center: [116.3974, 39.9093],
  zoom: 13,
  markers: [
    {
      lng: 116.3974,
      lat: 39.9093,
      color: '#FF0000',
      popup: '天安门广场'
    },
    {
      lng: 116.4074,
      lat: 39.9163,
      color: '#00FF00',
      popup: '故宫博物院'
    }
  ],
  outputPath: 'beijing-with-markers.png'
});
```

### 使用边界

```javascript
await exporter.exportMap({
  bounds: [
    [116.25, 39.82], // 西南角
    [116.55, 40.02]  // 东北角
  ],
  style: 'mapbox://styles/mapbox/outdoors-v11',
  outputPath: 'beijing-bounds.png'
});
```

### 自定义图层

```javascript
await exporter.exportMap({
  center: [116.3974, 39.9093],
  zoom: 11,
  layers: {
    sources: {
      'custom-data': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [/* GeoJSON features */]
        }
      }
    },
    layers: [
      {
        id: 'custom-layer',
        type: 'fill',
        source: 'custom-data',
        paint: {
          'fill-color': '#ff6b6b',
          'fill-opacity': 0.3
        }
      }
    ]
  },
  outputPath: 'custom-layers.png'
});
```

### 批量导出

```javascript
const configs = [
  { center: [116.3974, 39.9093], outputPath: 'beijing.png' },
  { center: [121.4737, 31.2304], outputPath: 'shanghai.png' },
  { center: [113.2644, 23.1291], outputPath: 'guangzhou.png' }
];

const results = await exporter.batchExport(configs);
results.forEach((result, index) => {
  if (result.success) {
    console.log(`✓ 导出成功: ${result.outputPath}`);
  } else {
    console.log(`✗ 导出失败: ${result.error}`);
  }
});
```

## 地图样式

支持所有 Mapbox 预定义样式：

- `mapbox://styles/mapbox/streets-v11` - 街道地图
- `mapbox://styles/mapbox/outdoors-v11` - 户外地图
- `mapbox://styles/mapbox/light-v10` - 浅色地图
- `mapbox://styles/mapbox/dark-v10` - 深色地图
- `mapbox://styles/mapbox/satellite-v9` - 卫星地图
- `mapbox://styles/mapbox/satellite-streets-v11` - 卫星街道地图
- `mapbox://styles/mapbox/navigation-day-v1` - 导航地图（白天）
- `mapbox://styles/mapbox/navigation-night-v1` - 导航地图（夜间）

也支持自定义样式 URL。

## 配置选项

### 默认配置

```javascript
{
  width: 1024,           // 图片宽度
  height: 768,           // 图片高度
  zoom: 10,              // 缩放级别
  center: [116.3974, 39.9093], // 北京坐标
  style: 'mapbox://styles/mapbox/streets-v11',
  format: 'png',         // 输出格式
  quality: 90,           // JPEG 质量
  deviceScaleFactor: 2,  // 高分辨率
  timeout: 30000,        // 超时时间
  waitForLoad: true      // 等待地图加载完成
}
```

### 标记点配置

```javascript
{
  lng: 116.3974,         // 经度
  lat: 39.9093,          // 纬度
  color: '#FF0000',      // 颜色
  popup: '标记点描述'     // 弹窗内容
}
```

## 故障排除

### 常见问题

1. **Access Token 错误**
   ```
   Error: Mapbox access token is required
   ```
   解决方案：设置正确的 `MAPBOX_ACCESS_TOKEN` 环境变量

2. **超时错误**
   ```
   Error: Navigation timeout exceeded
   ```
   解决方案：增加 `timeout` 配置或检查网络连接

3. **内存不足**
   ```
   Error: Process out of memory
   ```
   解决方案：减少图片尺寸或 `deviceScaleFactor`

### 调试模式

设置环境变量启用调试：

```bash
DEBUG=mapbox-exporter node examples/basic-usage.js
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本
- 基础地图导出功能
- 标记点支持
- 自定义图层支持
- 批量导出功能
