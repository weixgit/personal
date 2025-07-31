const MapboxExporter = require('../src/mapbox-exporter');

async function basicExample() {
  try {
    // 创建导出器实例
    // 需要设置环境变量 MAPBOX_ACCESS_TOKEN 或在构造函数中传入
    const exporter = new MapboxExporter({
      // accessToken: 'your-mapbox-access-token-here' // 可选，如果没有设置环境变量
    });

    console.log('=== 基础地图导出示例 ===');

    // 1. 简单导出 - 默认设置
    console.log('\n1. 导出默认地图 (北京)...');
    const defaultExport = await exporter.exportMap({
      outputPath: 'exports/beijing-default.png'
    });
    console.log(`导出完成: ${defaultExport}`);

    // 2. 自定义位置和样式
    console.log('\n2. 导出上海地图 (卫星样式)...');
    const shanghaiExport = await exporter.exportMap({
      center: [121.4737, 31.2304], // 上海坐标
      zoom: 12,
      style: 'mapbox://styles/mapbox/satellite-v9',
      width: 1920,
      height: 1080,
      outputPath: 'exports/shanghai-satellite.png'
    });
    console.log(`导出完成: ${shanghaiExport}`);

    // 3. 带标记点的地图
    console.log('\n3. 导出带标记点的地图...');
    const markersExport = await exporter.exportMap({
      center: [116.3974, 39.9093], // 北京
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
        },
        {
          lng: 116.3906,
          lat: 39.9058,
          color: '#0000FF',
          popup: '人民大会堂'
        }
      ],
      outputPath: 'exports/beijing-with-markers.png'
    });
    console.log(`导出完成: ${markersExport}`);

    // 4. 使用边界自动适配
    console.log('\n4. 导出指定边界的地图...');
    const boundsExport = await exporter.exportMap({
      bounds: [
        [116.25, 39.82], // 西南角
        [116.55, 40.02]  // 东北角
      ],
      style: 'mapbox://styles/mapbox/outdoors-v11',
      outputPath: 'exports/beijing-bounds.png'
    });
    console.log(`导出完成: ${boundsExport}`);

    console.log('\n=== 所有导出完成! ===');
    
  } catch (error) {
    console.error('导出失败:', error.message);
    
    if (error.message.includes('access token')) {
      console.log('\n请设置 Mapbox Access Token:');
      console.log('1. 访问 https://account.mapbox.com/access-tokens/');
      console.log('2. 创建或复制你的 access token');
      console.log('3. 设置环境变量: export MAPBOX_ACCESS_TOKEN=your_token_here');
      console.log('4. 或在代码中直接传入: new MapboxExporter({ accessToken: "your_token_here" })');
    }
  }
}

// 运行示例
if (require.main === module) {
  basicExample();
}

module.exports = basicExample;