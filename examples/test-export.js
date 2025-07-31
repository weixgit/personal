const MapboxExporter = require('../src/mapbox-exporter');

async function testExport() {
  console.log('=== Mapbox 导出工具测试 ===\n');

  try {
    // 检查环境变量
    if (!process.env.MAPBOX_ACCESS_TOKEN) {
      console.log('⚠️  警告: 未设置 MAPBOX_ACCESS_TOKEN 环境变量');
      console.log('请先设置你的 Mapbox Access Token:');
      console.log('export MAPBOX_ACCESS_TOKEN=your_token_here\n');
      
      // 尝试使用示例 token (这个不会工作，仅用于演示)
      console.log('使用示例配置进行测试...');
    }

    const exporter = new MapboxExporter({
      // 如果没有环境变量，这里会抛出错误，这是预期的行为
    });

    console.log('✓ MapboxExporter 实例创建成功');

    // 简单测试导出
    console.log('\n开始测试导出...');
    const testConfig = {
      center: [116.3974, 39.9093], // 北京天安门
      zoom: 12,
      width: 800,
      height: 600,
      style: 'mapbox://styles/mapbox/streets-v11',
      outputPath: 'exports/test-export.png',
      markers: [
        {
          lng: 116.3974,
          lat: 39.9093,
          color: '#FF0000',
          popup: '测试标记点'
        }
      ]
    };

    console.log('配置信息:');
    console.log(`- 中心点: [${testConfig.center.join(', ')}]`);
    console.log(`- 缩放级别: ${testConfig.zoom}`);
    console.log(`- 尺寸: ${testConfig.width}x${testConfig.height}`);
    console.log(`- 输出路径: ${testConfig.outputPath}`);

    const outputPath = await exporter.exportMap(testConfig);
    
    console.log('\n✅ 测试成功!');
    console.log(`导出的地图文件: ${outputPath}`);
    console.log('\n你可以打开这个文件查看导出的地图图片。');

  } catch (error) {
    console.log('\n❌ 测试失败:');
    console.error(error.message);

    if (error.message.includes('access token')) {
      console.log('\n解决方案:');
      console.log('1. 访问 https://account.mapbox.com/access-tokens/');
      console.log('2. 登录你的 Mapbox 账户');
      console.log('3. 创建一个新的 access token 或复制现有的');
      console.log('4. 设置环境变量:');
      console.log('   export MAPBOX_ACCESS_TOKEN=pk.your_token_here');
      console.log('5. 重新运行测试: npm run test');
    }
  }
}

// 运行测试
if (require.main === module) {
  testExport();
}

module.exports = testExport;