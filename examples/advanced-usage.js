const MapboxExporter = require('../export-map');

async function advancedExample() {
    const exporter = new MapboxExporter({
        accessToken: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN',
        headless: true,
        timeout: 45000
    });

    try {
        await exporter.init();

        // 示例1: 带标记点的地图
        console.log('\n=== 导出带标记点的地图 ===');
        const mapWithMarkers = {
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [121.4737, 31.2304], // 上海
            zoom: 11,
            width: 1400,
            height: 900,
            markers: [
                MapboxExporter.createMarker([121.4737, 31.2304], {
                    color: '#FF0000',
                    size: '25px',
                    popup: '<h3>上海市中心</h3><p>东方明珠塔附近</p>'
                }),
                MapboxExporter.createMarker([121.5074, 31.2277], {
                    color: '#00FF00',
                    size: '20px',
                    popup: '<h3>浦东新区</h3><p>金融中心</p>'
                }),
                MapboxExporter.createMarker([121.4458, 31.2204], {
                    color: '#0000FF',
                    size: '20px',
                    popup: '<h3>黄浦区</h3><p>外滩地区</p>'
                })
            ],
            format: 'png'
        };

        const markersImage = await exporter.exportMap(mapWithMarkers);
        await exporter.saveToFile(markersImage, 'outputs/shanghai-with-markers.png');

        // 示例2: 卫星地图
        console.log('\n=== 导出卫星地图 ===');
        const satelliteMap = {
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [116.3974, 39.9093], // 天安门
            zoom: 16,
            width: 1600,
            height: 1200,
            bearing: 45, // 旋转45度
            pitch: 30,   // 倾斜30度
            showWatermark: true,
            format: 'jpeg'
        };

        const satelliteImage = await exporter.exportMap(satelliteMap);
        await exporter.saveToFile(satelliteImage, 'outputs/tiananmen-satellite.jpg');

        // 示例3: 深色主题地图
        console.log('\n=== 导出深色主题地图 ===');
        const darkMap = {
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [114.1694, 22.3193], // 香港
            zoom: 12,
            width: 1200,
            height: 800,
            markers: [
                MapboxExporter.createMarker([114.1694, 22.3193], {
                    color: '#FFD700',
                    size: '30px',
                    popup: '<h3>香港中环</h3>'
                })
            ],
            showWatermark: false,
            format: 'png'
        };

        const darkImage = await exporter.exportMap(darkMap);
        await exporter.saveToFile(darkImage, 'outputs/hongkong-dark.png');

        // 示例4: 高分辨率导出
        console.log('\n=== 导出高分辨率地图 ===');
        const highResMap = {
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [139.6917, 35.6895], // 东京
            zoom: 13,
            width: 2400,  // 高分辨率
            height: 1800,
            deviceScaleFactor: 3, // 3x 像素密度
            format: 'png'
        };

        const highResImage = await exporter.exportMap(highResMap);
        await exporter.saveToFile(highResImage, 'outputs/tokyo-high-res.png');

        console.log('\n🎉 所有高级示例导出完成！');

    } catch (error) {
        console.error('导出失败:', error.message);
    } finally {
        await exporter.close();
    }
}

// 批量导出示例
async function batchExportExample() {
    const exporter = new MapboxExporter({
        accessToken: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN',
        headless: true
    });

    try {
        await exporter.init();

        // 批量配置
        const batchConfigs = [
            {
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [116.4074, 39.9042],
                zoom: 10,
                width: 800,
                height: 600,
                output: 'outputs/batch/beijing.png'
            },
            {
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [121.4737, 31.2304],
                zoom: 10,
                width: 800,
                height: 600,
                output: 'outputs/batch/shanghai.png'
            },
            {
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [113.2644, 23.1291],
                zoom: 10,
                width: 800,
                height: 600,
                output: 'outputs/batch/guangzhou.png'
            }
        ];

        console.log('\n=== 批量导出中国主要城市 ===');
        const results = await exporter.exportMultiple(batchConfigs);
        
        console.log('\n批量导出结果:');
        results.forEach((result, index) => {
            if (result.success) {
                console.log(`✅ 第${index + 1}个: ${result.outputPath} (${(result.size / 1024).toFixed(2)} KB)`);
            } else {
                console.log(`❌ 第${index + 1}个: ${result.error}`);
            }
        });

    } catch (error) {
        console.error('批量导出失败:', error.message);
    } finally {
        await exporter.close();
    }
}

// 运行示例
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--batch')) {
        batchExportExample();
    } else {
        advancedExample();
    }
}

module.exports = { advancedExample, batchExportExample };