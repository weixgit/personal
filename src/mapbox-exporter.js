const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class MapboxExporter {
  constructor(options = {}) {
    this.accessToken = options.accessToken || process.env.MAPBOX_ACCESS_TOKEN;
    this.defaultOptions = {
      width: 1024,
      height: 768,
      zoom: 10,
      center: [116.3974, 39.9093], // 北京坐标
      style: 'mapbox://styles/mapbox/streets-v11',
      format: 'png',
      quality: 90,
      deviceScaleFactor: 2, // 高分辨率
      timeout: 30000,
      waitForLoad: true,
      ...options
    };
    
    if (!this.accessToken) {
      throw new Error('Mapbox access token is required. Set MAPBOX_ACCESS_TOKEN environment variable or pass it in options.');
    }
  }

  /**
   * 导出地图为图片
   * @param {Object} options - 导出选项
   * @param {string} options.outputPath - 输出文件路径
   * @param {Array} options.center - 地图中心点 [lng, lat]
   * @param {number} options.zoom - 缩放级别
   * @param {number} options.width - 图片宽度
   * @param {number} options.height - 图片高度
   * @param {string} options.style - 地图样式
   * @param {Array} options.bounds - 地图边界 [[sw_lng, sw_lat], [ne_lng, ne_lat]]
   * @param {Array} options.markers - 标记点数组
   * @param {Object} options.layers - 自定义图层
   * @returns {Promise<string>} 导出的文件路径
   */
  async exportMap(options = {}) {
    const config = { ...this.defaultOptions, ...options };
    
    // 确保输出目录存在
    if (config.outputPath) {
      await fs.ensureDir(path.dirname(config.outputPath));
    }

    let browser;
    try {
      console.log('启动浏览器...');
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions'
        ]
      });

      const page = await browser.newPage();
      
      // 设置视口大小
      await page.setViewport({
        width: config.width,
        height: config.height,
        deviceScaleFactor: config.deviceScaleFactor
      });

      console.log('加载地图页面...');
      
      // 生成HTML内容
      const htmlContent = this.generateMapHTML(config);
      
      // 加载HTML内容
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: config.timeout 
      });

      if (config.waitForLoad) {
        console.log('等待地图加载完成...');
        // 等待地图完全加载
        await page.waitForFunction(
          () => window.mapLoaded === true,
          { timeout: config.timeout }
        );
        
        // 额外等待确保所有瓦片加载完成
        await page.waitForTimeout(2000);
      }

      console.log('截取地图图片...');
      
      // 截图选项
      const screenshotOptions = {
        type: config.format,
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: config.width,
          height: config.height
        }
      };

      if (config.format === 'jpeg') {
        screenshotOptions.quality = config.quality;
      }

      let outputPath = config.outputPath;
      if (!outputPath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        outputPath = `exports/map-export-${timestamp}.${config.format}`;
        await fs.ensureDir('exports');
      }

      const screenshot = await page.screenshot(screenshotOptions);
      await fs.writeFile(outputPath, screenshot);

      console.log(`地图导出成功: ${outputPath}`);
      return outputPath;

    } catch (error) {
      console.error('导出地图时出错:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * 生成地图HTML内容
   * @param {Object} config - 配置选项
   * @returns {string} HTML内容
   */
  generateMapHTML(config) {
    const markersScript = config.markers ? this.generateMarkersScript(config.markers) : '';
    const layersScript = config.layers ? this.generateLayersScript(config.layers) : '';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <title>Mapbox Export</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
    <style>
        body { margin: 0; padding: 0; }
        #map { 
            position: absolute; 
            top: 0; 
            bottom: 0; 
            width: 100%; 
            height: 100vh;
        }
    </style>
</head>
<body>
    <div id='map'></div>
    <script>
        window.mapLoaded = false;
        
        mapboxgl.accessToken = '${this.accessToken}';
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: '${config.style}',
            center: [${config.center[0]}, ${config.center[1]}],
            zoom: ${config.zoom},
            preserveDrawingBuffer: true,
            attributionControl: false
        });

        map.on('load', function() {
            console.log('Map loaded');
            
            ${layersScript}
            ${markersScript}
            
            // 如果设置了边界，则适配边界
            ${config.bounds ? `
            map.fitBounds([
                [${config.bounds[0][0]}, ${config.bounds[0][1]}],
                [${config.bounds[1][0]}, ${config.bounds[1][1]}]
            ], {
                padding: 20
            });
            ` : ''}
            
            // 等待所有瓦片加载完成
            setTimeout(() => {
                window.mapLoaded = true;
                console.log('Map fully loaded');
            }, 1000);
        });

        map.on('error', function(e) {
            console.error('Map error:', e);
            window.mapLoaded = true; // 即使出错也设置为true，避免无限等待
        });
    </script>
</body>
</html>`;
  }

  /**
   * 生成标记点脚本
   * @param {Array} markers - 标记点数组
   * @returns {string} JavaScript代码
   */
  generateMarkersScript(markers) {
    if (!markers || markers.length === 0) return '';
    
    return markers.map((marker, index) => {
      const { lng, lat, color = '#FF0000', text = '', popup = '' } = marker;
      
      return `
        // 添加标记点 ${index + 1}
        const marker${index} = new mapboxgl.Marker({ color: '${color}' })
            .setLngLat([${lng}, ${lat}])
            ${popup ? `.setPopup(new mapboxgl.Popup().setHTML('${popup}'))` : ''}
            .addTo(map);
      `;
    }).join('\n');
  }

  /**
   * 生成图层脚本
   * @param {Object} layers - 图层配置
   * @returns {string} JavaScript代码
   */
  generateLayersScript(layers) {
    if (!layers) return '';
    
    let script = '';
    
    // 添加数据源
    if (layers.sources) {
      Object.entries(layers.sources).forEach(([sourceId, sourceConfig]) => {
        script += `
          map.addSource('${sourceId}', ${JSON.stringify(sourceConfig)});
        `;
      });
    }
    
    // 添加图层
    if (layers.layers) {
      layers.layers.forEach(layer => {
        script += `
          map.addLayer(${JSON.stringify(layer)});
        `;
      });
    }
    
    return script;
  }

  /**
   * 批量导出地图
   * @param {Array} exportConfigs - 导出配置数组
   * @returns {Promise<Array>} 导出的文件路径数组
   */
  async batchExport(exportConfigs) {
    const results = [];
    
    for (let i = 0; i < exportConfigs.length; i++) {
      console.log(`导出第 ${i + 1}/${exportConfigs.length} 个地图...`);
      try {
        const outputPath = await this.exportMap(exportConfigs[i]);
        results.push({ success: true, outputPath, config: exportConfigs[i] });
      } catch (error) {
        console.error(`导出第 ${i + 1} 个地图失败:`, error);
        results.push({ success: false, error: error.message, config: exportConfigs[i] });
      }
    }
    
    return results;
  }
}

module.exports = MapboxExporter;