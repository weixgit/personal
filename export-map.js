const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');

class MapboxExporter {
    constructor(options = {}) {
        this.options = {
            accessToken: options.accessToken || process.env.MAPBOX_ACCESS_TOKEN,
            headless: options.headless !== false,
            timeout: options.timeout || 30000,
            quality: options.quality || 90,
            ...options
        };
        
        this.browser = null;
        this.page = null;
    }

    /**
     * 初始化浏览器和页面
     */
    async init() {
        console.log(chalk.blue('🚀 正在启动浏览器...'));
        
        this.browser = await puppeteer.launch({
            headless: this.options.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-default-apps',
                '--disable-extensions'
            ]
        });

        this.page = await this.browser.newPage();
        
        // 设置页面错误处理
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(chalk.red('页面错误:'), msg.text());
            }
        });

        this.page.on('pageerror', error => {
            console.error(chalk.red('页面异常:'), error.message);
        });

        console.log(chalk.green('✅ 浏览器启动成功'));
    }

    /**
     * 导出地图为图片
     */
    async exportMap(config) {
        if (!this.page) {
            throw new Error('请先调用 init() 方法初始化浏览器');
        }

        if (!config.accessToken && !this.options.accessToken) {
            throw new Error('请提供 Mapbox Access Token');
        }

        console.log(chalk.blue('🗺️  正在生成地图...'));

        // 合并配置
        const mapConfig = {
            accessToken: config.accessToken || this.options.accessToken,
            style: config.style || 'mapbox://styles/mapbox/streets-v12',
            center: config.center || [116.4074, 39.9042],
            zoom: config.zoom || 10,
            bearing: config.bearing || 0,
            pitch: config.pitch || 0,
            width: config.width || 1200,
            height: config.height || 800,
            showWatermark: config.showWatermark !== false,
            markers: config.markers || [],
            layers: config.layers || [],
            ...config
        };

        try {
            // 设置视口大小
            await this.page.setViewport({
                width: mapConfig.width,
                height: mapConfig.height,
                deviceScaleFactor: config.deviceScaleFactor || 2
            });

            // 加载 HTML 模板
            const templatePath = path.join(__dirname, 'map-template.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');
            
            // 将配置注入到页面中
            await this.page.setContent(templateContent);
            await this.page.evaluate((config) => {
                window.mapConfig = config;
            }, mapConfig);

            // 等待地图加载完成
            console.log(chalk.yellow('⏳ 等待地图加载完成...'));
            
            await this.page.waitForFunction(
                () => window.mapReady === true,
                { timeout: this.options.timeout }
            );

            // 额外等待确保所有资源加载完成
            await this.page.waitForTimeout(2000);

            console.log(chalk.green('✅ 地图加载完成'));

            // 截取屏幕截图
            const screenshot = await this.page.screenshot({
                type: config.format || 'png',
                quality: config.format === 'jpeg' ? this.options.quality : undefined,
                fullPage: false,
                clip: {
                    x: 0,
                    y: 0,
                    width: mapConfig.width,
                    height: mapConfig.height
                }
            });

            return screenshot;

        } catch (error) {
            console.error(chalk.red('❌ 地图导出失败:'), error.message);
            throw error;
        }
    }

    /**
     * 保存图片到文件
     */
    async saveToFile(imageBuffer, outputPath) {
        try {
            // 确保输出目录存在
            const outputDir = path.dirname(outputPath);
            await fs.ensureDir(outputDir);

            // 保存文件
            await fs.writeFile(outputPath, imageBuffer);
            console.log(chalk.green('💾 图片已保存到:'), chalk.cyan(outputPath));
            
            return outputPath;
        } catch (error) {
            console.error(chalk.red('❌ 保存文件失败:'), error.message);
            throw error;
        }
    }

    /**
     * 批量导出地图
     */
    async exportMultiple(configs) {
        const results = [];
        
        for (let i = 0; i < configs.length; i++) {
            const config = configs[i];
            console.log(chalk.blue(`\n📍 正在导出第 ${i + 1}/${configs.length} 个地图...`));
            
            try {
                const imageBuffer = await this.exportMap(config);
                const outputPath = config.output || `map-export-${i + 1}.png`;
                await this.saveToFile(imageBuffer, outputPath);
                
                results.push({
                    success: true,
                    config,
                    outputPath,
                    size: imageBuffer.length
                });
            } catch (error) {
                console.error(chalk.red(`❌ 第 ${i + 1} 个地图导出失败:`, error.message));
                results.push({
                    success: false,
                    config,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    /**
     * 关闭浏览器
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log(chalk.blue('🔒 浏览器已关闭'));
        }
    }

    /**
     * 获取预设的地图样式
     */
    static getPresetStyles() {
        return {
            streets: 'mapbox://styles/mapbox/streets-v12',
            outdoors: 'mapbox://styles/mapbox/outdoors-v12',
            light: 'mapbox://styles/mapbox/light-v11',
            dark: 'mapbox://styles/mapbox/dark-v11',
            satellite: 'mapbox://styles/mapbox/satellite-v9',
            'satellite-streets': 'mapbox://styles/mapbox/satellite-streets-v12',
            navigation: 'mapbox://styles/mapbox/navigation-day-v1',
            'navigation-night': 'mapbox://styles/mapbox/navigation-night-v1'
        };
    }

    /**
     * 创建标记点配置
     */
    static createMarker(coordinates, options = {}) {
        return {
            coordinates,
            color: options.color || '#FF0000',
            size: options.size || '20px',
            popup: options.popup || null
        };
    }
}

// 命令行接口
if (require.main === module) {
    program
        .name('mapbox-export')
        .description('Mapbox 地图导出工具')
        .version('1.0.0');

    program
        .command('export')
        .description('导出单个地图')
        .option('-t, --token <token>', 'Mapbox Access Token')
        .option('-s, --style <style>', '地图样式', 'streets')
        .option('-c, --center <lng,lat>', '地图中心点坐标', '116.4074,39.9042')
        .option('-z, --zoom <level>', '缩放级别', '10')
        .option('-w, --width <pixels>', '图片宽度', '1200')
        .option('-h, --height <pixels>', '图片高度', '800')
        .option('-o, --output <path>', '输出文件路径', 'map-export.png')
        .option('-f, --format <format>', '图片格式 (png/jpeg)', 'png')
        .option('--bearing <degrees>', '地图旋转角度', '0')
        .option('--pitch <degrees>', '地图倾斜角度', '0')
        .option('--no-watermark', '不显示水印')
        .action(async (options) => {
            const exporter = new MapboxExporter({
                accessToken: options.token
            });

            try {
                await exporter.init();

                const center = options.center.split(',').map(Number);
                const styles = MapboxExporter.getPresetStyles();
                
                const config = {
                    style: styles[options.style] || options.style,
                    center,
                    zoom: parseInt(options.zoom),
                    width: parseInt(options.width),
                    height: parseInt(options.height),
                    bearing: parseFloat(options.bearing),
                    pitch: parseFloat(options.pitch),
                    format: options.format,
                    showWatermark: options.watermark !== false,
                    output: options.output
                };

                const imageBuffer = await exporter.exportMap(config);
                await exporter.saveToFile(imageBuffer, options.output);

                console.log(chalk.green('\n🎉 地图导出成功！'));
                
            } catch (error) {
                console.error(chalk.red('\n❌ 导出失败:'), error.message);
                process.exit(1);
            } finally {
                await exporter.close();
            }
        });

    program
        .command('batch')
        .description('批量导出地图')
        .option('-c, --config <path>', '配置文件路径', 'batch-config.json')
        .option('-t, --token <token>', 'Mapbox Access Token')
        .action(async (options) => {
            try {
                const configPath = path.resolve(options.config);
                const configs = await fs.readJson(configPath);
                
                const exporter = new MapboxExporter({
                    accessToken: options.token
                });

                await exporter.init();
                const results = await exporter.exportMultiple(configs);
                
                const successful = results.filter(r => r.success).length;
                const failed = results.filter(r => !r.success).length;
                
                console.log(chalk.green(`\n🎉 批量导出完成！成功: ${successful}, 失败: ${failed}`));
                
                await exporter.close();
                
            } catch (error) {
                console.error(chalk.red('\n❌ 批量导出失败:'), error.message);
                process.exit(1);
            }
        });

    program.parse();
}

module.exports = MapboxExporter;