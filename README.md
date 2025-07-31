# Mapbox 地图导出工具

一个基于 Node.js 和 Puppeteer 的 Mapbox 地图导出工具，支持将 Mapbox 地图导出为高质量的图片文件。

## ✨ 特性

- 🗺️ **多种地图样式**: 支持街道、卫星、深色、户外等多种预设样式
- 📍 **自定义标记**: 添加彩色标记点和弹窗信息
- 🎨 **灵活配置**: 自定义地图中心、缩放级别、尺寸等参数
- 🔄 **地图变换**: 支持地图旋转和倾斜效果
- 📸 **高分辨率**: 支持高分辨率和不同像素密度的导出
- 📦 **批量导出**: 支持批量导出多个地图
- 🖼️ **多种格式**: 支持 PNG 和 JPEG 格式
- 💻 **双接口**: 提供命令行和编程两种使用方式

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 设置 Mapbox Access Token

1. 访问 [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. 创建或复制你的 Access Token
3. 设置环境变量：

```bash
export MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

### 运行演示

```bash
npm start
# 或
node index.js
```

## 📖 使用方法

### 1. 命令行使用

#### 基本导出

```bash
node export-map.js export \
  --token YOUR_TOKEN \
  --center 116.4074,39.9042 \
  --zoom 12 \
  --style streets \
  --width 1200 \
  --height 800 \
  --output beijing.png
```

#### 命令行参数

| 参数 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `--token` | `-t` | Mapbox Access Token | 环境变量 |
| `--style` | `-s` | 地图样式 | `streets` |
| `--center` | `-c` | 地图中心坐标 (lng,lat) | `116.4074,39.9042` |
| `--zoom` | `-z` | 缩放级别 | `10` |
| `--width` | `-w` | 图片宽度 | `1200` |
| `--height` | `-h` | 图片高度 | `800` |
| `--output` | `-o` | 输出文件路径 | `map-export.png` |
| `--format` | `-f` | 图片格式 (png/jpeg) | `png` |
| `--bearing` | | 地图旋转角度 | `0` |
| `--pitch` | | 地图倾斜角度 | `0` |
| `--no-watermark` | | 不显示水印 | `false` |

#### 批量导出

```bash
node export-map.js batch \
  --token YOUR_TOKEN \
  --config batch-config.json
```

### 2. 编程使用

#### 基本示例

```javascript
const MapboxExporter = require('./export-map');

async function exportMap() {
    const exporter = new MapboxExporter({
        accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN'
    });

    await exporter.init();

    const config = {
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [116.4074, 39.9042], // 北京
        zoom: 12,
        width: 1200,
        height: 800,
        format: 'png'
    };

    const imageBuffer = await exporter.exportMap(config);
    await exporter.saveToFile(imageBuffer, 'beijing.png');
    
    await exporter.close();
}

exportMap();
```

#### 带标记点的地图

```javascript
const config = {
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [121.4737, 31.2304], // 上海
    zoom: 12,
    width: 1200,
    height: 800,
    markers: [
        MapboxExporter.createMarker([121.4944, 31.2397], {
            color: '#FF0000',
            size: '25px',
            popup: '<h3>东方明珠塔</h3><p>上海地标建筑</p>'
        }),
        MapboxExporter.createMarker([121.4737, 31.2304], {
            color: '#00FF00',
            size: '20px',
            popup: '<h3>人民广场</h3><p>上海市中心</p>'
        })
    ]
};
```

#### 批量导出

```javascript
const configs = [
    {
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [116.4074, 39.9042],
        zoom: 10,
        output: 'beijing.png'
    },
    {
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [121.4737, 31.2304],
        zoom: 10,
        output: 'shanghai.png'
    }
];

const results = await exporter.exportMultiple(configs);
```

## 🎨 地图样式

支持以下预设样式：

| 样式名 | 描述 | Mapbox 样式 ID |
|--------|------|----------------|
| `streets` | 街道地图 | `mapbox://styles/mapbox/streets-v12` |
| `outdoors` | 户外地图 | `mapbox://styles/mapbox/outdoors-v12` |
| `light` | 浅色主题 | `mapbox://styles/mapbox/light-v11` |
| `dark` | 深色主题 | `mapbox://styles/mapbox/dark-v11` |
| `satellite` | 卫星地图 | `mapbox://styles/mapbox/satellite-v9` |
| `satellite-streets` | 卫星街道 | `mapbox://styles/mapbox/satellite-streets-v12` |
| `navigation` | 导航地图 | `mapbox://styles/mapbox/navigation-day-v1` |
| `navigation-night` | 夜间导航 | `mapbox://styles/mapbox/navigation-night-v1` |

## 📁 项目结构

```
mapbox-export-tool/
├── package.json              # 项目配置
├── export-map.js            # 主导出模块
├── map-template.html        # HTML 模板
├── index.js                 # 演示入口
├── batch-config.json        # 批量导出配置示例
├── examples/                # 使用示例
│   ├── basic-usage.js       # 基础使用示例
│   └── advanced-usage.js    # 高级使用示例
├── outputs/                 # 输出目录
│   └── batch/              # 批量导出目录
└── README.md               # 项目文档
```

## ⚙️ 配置选项

### MapboxExporter 构造函数选项

```javascript
const exporter = new MapboxExporter({
    accessToken: 'your_token',    // Mapbox Access Token
    headless: true,               // 无头模式 (默认: true)
    timeout: 30000,               // 超时时间 (默认: 30000ms)
    quality: 90                   // JPEG 质量 (默认: 90)
});
```

### 地图配置选项

```javascript
const mapConfig = {
    accessToken: 'your_token',           // Mapbox Access Token
    style: 'mapbox://styles/...',        // 地图样式
    center: [lng, lat],                  // 地图中心坐标
    zoom: 10,                            // 缩放级别
    bearing: 0,                          // 旋转角度 (度)
    pitch: 0,                            // 倾斜角度 (度)
    width: 1200,                         // 图片宽度
    height: 800,                         // 图片高度
    format: 'png',                       // 输出格式 (png/jpeg)
    deviceScaleFactor: 2,                // 像素密度
    showWatermark: true,                 // 显示水印
    markers: [],                         // 标记点数组
    layers: []                           // 自定义图层
};
```

### 标记点配置

```javascript
const marker = MapboxExporter.createMarker([lng, lat], {
    color: '#FF0000',                    // 标记颜色
    size: '20px',                        // 标记大小
    popup: '<h3>标题</h3><p>描述</p>'    // 弹窗内容 (HTML)
});
```

## 🔧 高级功能

### 高分辨率导出

```javascript
const config = {
    width: 2400,
    height: 1800,
    deviceScaleFactor: 3,  // 3x 像素密度
    format: 'png'
};
```

### 地图变换效果

```javascript
const config = {
    bearing: 45,    // 顺时针旋转 45 度
    pitch: 30,      // 向上倾斜 30 度
    style: 'mapbox://styles/mapbox/satellite-streets-v12'
};
```

### 批量配置文件

创建 `batch-config.json` 文件：

```json
[
  {
    "name": "北京地图",
    "style": "mapbox://styles/mapbox/streets-v12",
    "center": [116.4074, 39.9042],
    "zoom": 11,
    "width": 1200,
    "height": 800,
    "output": "outputs/beijing.png",
    "markers": [
      {
        "coordinates": [116.3974, 39.9093],
        "color": "#FF0000",
        "popup": "<h3>天安门广场</h3>"
      }
    ]
  }
]
```

## 🚨 注意事项

1. **Access Token**: 使用前必须设置有效的 Mapbox Access Token
2. **网络连接**: 需要稳定的网络连接以加载地图瓦片
3. **内存使用**: 高分辨率导出会消耗更多内存
4. **并发限制**: 批量导出时建议控制并发数量
5. **样式权限**: 确保 Access Token 有权限访问所选择的地图样式

## 🐛 故障排除

### 常见问题

1. **Access Token 错误**
   ```
   解决方案: 检查 token 是否正确，是否有相应权限
   ```

2. **地图加载超时**
   ```
   解决方案: 增加 timeout 参数，检查网络连接
   ```

3. **样式加载失败**
   ```
   解决方案: 确认样式 URL 正确，token 有访问权限
   ```

4. **图片导出失败**
   ```
   解决方案: 检查输出目录权限，确保磁盘空间充足
   ```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请创建 Issue 或联系开发者。
