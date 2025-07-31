const MapboxExporter = require('../export-map');

async function basicExample() {
    // 创建导出器实例
    const exporter = new MapboxExporter({
        accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN', // 替换为你的 Mapbox Access Token
        headless: true, // 无头模式
        timeout: 30000 // 30秒超时
    });

    try {
        // 初始化浏览器
        await exporter.init();

        // 基本地图配置
        const mapConfig = {
            style: 'mapbox://styles/mapbox/streets-v12', // 街道样式
            center: [116.4074, 39.9042], // 北京坐标
            zoom: 12,
            width: 1200,
            height: 800,
            format: 'png'
        };

        // 导出地图
        console.log('正在导出基础地图...');
        const imageBuffer = await exporter.exportMap(mapConfig);
        await exporter.saveToFile(imageBuffer, 'outputs/basic-map.png');

        console.log('基础地图导出完成！');

    } catch (error) {
        console.error('导出失败:', error.message);
    } finally {
        // 关闭浏览器
        await exporter.close();
    }
}

// 运行示例
if (require.main === module) {
    basicExample();
}

module.exports = basicExample;