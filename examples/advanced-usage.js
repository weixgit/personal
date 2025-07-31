const MapboxExporter = require('../src/mapbox-exporter');

async function advancedExample() {
  try {
    const exporter = new MapboxExporter();

    console.log('=== 高级地图导出示例 ===');

    // 1. 自定义图层示例
    console.log('\n1. 导出带自定义图层的地图...');
    const customLayersExport = await exporter.exportMap({
      center: [116.3974, 39.9093],
      zoom: 11,
      style: 'mapbox://styles/mapbox/light-v10',
      layers: {
        sources: {
          'beijing-districts': {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {
                    name: '朝阳区',
                    color: '#ff6b6b'
                  },
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [116.45, 39.95],
                      [116.55, 39.95],
                      [116.55, 39.85],
                      [116.45, 39.85],
                      [116.45, 39.95]
                    ]]
                  }
                }
              ]
            }
          }
        },
        layers: [
          {
            id: 'beijing-districts-fill',
            type: 'fill',
            source: 'beijing-districts',
            paint: {
              'fill-color': ['get', 'color'],
              'fill-opacity': 0.3
            }
          },
          {
            id: 'beijing-districts-line',
            type: 'line',
            source: 'beijing-districts',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': 2
            }
          }
        ]
      },
      outputPath: 'exports/beijing-custom-layers.png'
    });
    console.log(`导出完成: ${customLayersExport}`);

    // 2. 批量导出示例
    console.log('\n2. 批量导出多个城市地图...');
    const batchConfigs = [
      {
        center: [116.3974, 39.9093], // 北京
        zoom: 10,
        style: 'mapbox://styles/mapbox/streets-v11',
        outputPath: 'exports/batch/beijing.png',
        markers: [{ lng: 116.3974, lat: 39.9093, color: '#FF0000', popup: '北京' }]
      },
      {
        center: [121.4737, 31.2304], // 上海
        zoom: 10,
        style: 'mapbox://styles/mapbox/streets-v11',
        outputPath: 'exports/batch/shanghai.png',
        markers: [{ lng: 121.4737, lat: 31.2304, color: '#00FF00', popup: '上海' }]
      },
      {
        center: [113.2644, 23.1291], // 广州
        zoom: 10,
        style: 'mapbox://styles/mapbox/streets-v11',
        outputPath: 'exports/batch/guangzhou.png',
        markers: [{ lng: 113.2644, lat: 23.1291, color: '#0000FF', popup: '广州' }]
      },
      {
        center: [114.0579, 22.5431], // 深圳
        zoom: 10,
        style: 'mapbox://styles/mapbox/streets-v11',
        outputPath: 'exports/batch/shenzhen.png',
        markers: [{ lng: 114.0579, lat: 22.5431, color: '#FF00FF', popup: '深圳' }]
      }
    ];

    const batchResults = await exporter.batchExport(batchConfigs);
    
    console.log('\n批量导出结果:');
    batchResults.forEach((result, index) => {
      if (result.success) {
        console.log(`✓ 第 ${index + 1} 个地图导出成功: ${result.outputPath}`);
      } else {
        console.log(`✗ 第 ${index + 1} 个地图导出失败: ${result.error}`);
      }
    });

    // 3. 高分辨率导出
    console.log('\n3. 导出超高分辨率地图...');
    const highResExport = await exporter.exportMap({
      center: [116.3974, 39.9093],
      zoom: 15,
      width: 4096,
      height: 4096,
      deviceScaleFactor: 3, // 3倍像素密度
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      format: 'png',
      outputPath: 'exports/beijing-4k.png'
    });
    console.log(`导出完成: ${highResExport}`);

    // 4. 不同格式导出
    console.log('\n4. 导出不同格式的地图...');
    const formats = ['png', 'jpeg'];
    
    for (const format of formats) {
      const formatExport = await exporter.exportMap({
        center: [116.3974, 39.9093],
        zoom: 12,
        width: 1024,
        height: 768,
        format: format,
        quality: format === 'jpeg' ? 95 : undefined,
        outputPath: `exports/beijing-format.${format}`
      });
      console.log(`${format.toUpperCase()} 格式导出完成: ${formatExport}`);
    }

    // 5. 路线规划可视化
    console.log('\n5. 导出路线规划地图...');
    const routeExport = await exporter.exportMap({
      bounds: [
        [116.35, 39.88], // 西南
        [116.45, 39.96]  // 东北
      ],
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      layers: {
        sources: {
          'route': {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [116.3974, 39.9093], // 起点
                  [116.4074, 39.9163], // 中点
                  [116.4174, 39.9233], // 终点
                ]
              }
            }
          }
        },
        layers: [
          {
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          }
        ]
      },
      markers: [
        { lng: 116.3974, lat: 39.9093, color: '#00FF00', popup: '起点' },
        { lng: 116.4174, lat: 39.9233, color: '#FF0000', popup: '终点' }
      ],
      outputPath: 'exports/beijing-route.png'
    });
    console.log(`导出完成: ${routeExport}`);

    console.log('\n=== 高级示例全部完成! ===');
    
  } catch (error) {
    console.error('高级导出失败:', error.message);
  }
}

// 运行示例
if (require.main === module) {
  advancedExample();
}

module.exports = advancedExample;