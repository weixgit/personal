#!/usr/bin/env node

const MapboxExporter = require('./export-map');
const chalk = require('chalk');

async function demo() {
    console.log(chalk.blue.bold('\n🗺️  Mapbox 地图导出工具演示\n'));
    
    // 检查环境变量
    if (!process.env.MAPBOX_ACCESS_TOKEN) {
        console.log(chalk.yellow('⚠️  请设置 MAPBOX_ACCESS_TOKEN 环境变量'));
        console.log(chalk.gray('   export MAPBOX_ACCESS_TOKEN=your_token_here\n'));
        console.log(chalk.blue('或者在代码中直接设置 accessToken 参数\n'));
    }

    const exporter = new MapboxExporter({
        accessToken: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN',
        headless: true,
        timeout: 30000
    });

    try {
        await exporter.init();

        // 演示基本功能
        console.log(chalk.green('📍 正在导出北京地图...'));
        
        const basicConfig = {
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [116.4074, 39.9042], // 北京
            zoom: 11,
            width: 1200,
            height: 800,
            format: 'png',
            markers: [
                MapboxExporter.createMarker([116.3974, 39.9093], {
                    color: '#FF0000',
                    size: '25px',
                    popup: '<h3>天安门广场</h3><p>北京市中心</p>'
                })
            ]
        };

        const imageBuffer = await exporter.exportMap(basicConfig);
        await exporter.saveToFile(imageBuffer, 'demo-beijing.png');

        console.log(chalk.green('\n✅ 演示完成！'));
        console.log(chalk.cyan('📁 输出文件: demo-beijing.png'));
        
        // 显示使用提示
        console.log(chalk.blue.bold('\n📖 使用方法:'));
        console.log(chalk.gray('1. 命令行导出:'));
        console.log(chalk.white('   node export-map.js export --token YOUR_TOKEN --center 116.4074,39.9042 --zoom 12'));
        
        console.log(chalk.gray('\n2. 批量导出:'));
        console.log(chalk.white('   node export-map.js batch --token YOUR_TOKEN --config batch-config.json'));
        
        console.log(chalk.gray('\n3. 编程使用:'));
        console.log(chalk.white('   const MapboxExporter = require("./export-map");'));
        console.log(chalk.white('   // 参考 examples/ 目录下的示例文件'));

        console.log(chalk.blue.bold('\n🎨 支持的地图样式:'));
        const styles = MapboxExporter.getPresetStyles();
        Object.keys(styles).forEach(key => {
            console.log(chalk.gray(`   ${key}: ${styles[key]}`));
        });

        console.log(chalk.blue.bold('\n📋 主要功能:'));
        console.log(chalk.gray('   ✓ 多种地图样式 (街道、卫星、深色等)'));
        console.log(chalk.gray('   ✓ 自定义标记点和弹窗'));
        console.log(chalk.gray('   ✓ 地图旋转和倾斜'));
        console.log(chalk.gray('   ✓ 高分辨率导出'));
        console.log(chalk.gray('   ✓ 批量导出'));
        console.log(chalk.gray('   ✓ PNG/JPEG 格式支持'));
        console.log(chalk.gray('   ✓ 命令行和编程接口'));

    } catch (error) {
        console.error(chalk.red('\n❌ 演示失败:'), error.message);
        
        if (error.message.includes('Access Token')) {
            console.log(chalk.yellow('\n💡 解决方案:'));
            console.log(chalk.gray('1. 访问 https://account.mapbox.com/access-tokens/'));
            console.log(chalk.gray('2. 创建或复制你的 Access Token'));
            console.log(chalk.gray('3. 设置环境变量: export MAPBOX_ACCESS_TOKEN=your_token'));
        }
    } finally {
        await exporter.close();
    }
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
    demo().catch(error => {
        console.error(chalk.red('程序异常:'), error);
        process.exit(1);
    });
}

module.exports = { demo, MapboxExporter };