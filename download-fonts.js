const https = require('https');
const fs = require('fs');
const path = require('path');

// 创建fonts目录
const fontsDir = path.join(__dirname, 'fonts');
if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
}

// Google Fonts API配置
const API_KEY = 'AIzaSyB8QOQOQOQOQOQOQOQOQOQOQOQOQOQOQOQ'; // 需要替换为真实的API密钥
const BASE_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

// 要下载的字体列表
const fontsToDownload = [
    'Roboto',
    'Open Sans',
    'Lato',
    'Source Sans Pro',
    'Montserrat',
    'Poppins'
];

// 下载字体文件的函数
function downloadFont(fontUrl, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(fontsDir, filename));
        
        https.get(fontUrl, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ 下载完成: ${filename}`);
                    resolve();
                });
            } else {
                reject(new Error(`下载失败: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(path.join(fontsDir, filename), () => {}); // 删除部分下载的文件
            reject(err);
        });
    });
}

// 创建示例字体文件（模拟字体内容）
function createSampleFonts() {
    console.log('📝 创建示例字体文件...');
    
    // 创建一个简单的字体CSS文件
    const fontCSS = `
/* 示例字体样式 */
@font-face {
    font-family: 'SampleFont';
    src: url('data:font/woff2;base64,') format('woff2');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'SampleFontBold';
    src: url('data:font/woff2;base64,') format('woff2');
    font-weight: bold;
    font-style: normal;
}
`;

    fs.writeFileSync(path.join(fontsDir, 'sample-fonts.css'), fontCSS);
    
    // 创建字体信息文件
    const fontInfo = {
        fonts: [
            {
                name: 'Roboto',
                description: 'Google Material Design字体',
                url: 'https://fonts.google.com/specimen/Roboto',
                files: ['Roboto-Regular.ttf', 'Roboto-Bold.ttf']
            },
            {
                name: 'Open Sans',
                description: 'Google开源字体',
                url: 'https://fonts.google.com/specimen/Open+Sans',
                files: ['OpenSans-Regular.ttf', 'OpenSans-Bold.ttf']
            },
            {
                name: 'Lato',
                description: '现代无衬线字体',
                url: 'https://fonts.google.com/specimen/Lato',
                files: ['Lato-Regular.ttf', 'Lato-Bold.ttf']
            }
        ],
        instructions: {
            download: '从Google Fonts下载字体文件',
            usage: '在SVG文本导出器中上传字体文件',
            formats: ['TTF', 'OTF', 'WOFF', 'WOFF2']
        }
    };

    fs.writeFileSync(path.join(fontsDir, 'font-info.json'), JSON.stringify(fontInfo, null, 2));
    
    console.log('✅ 示例字体文件创建完成');
}

// 创建字体使用说明
function createFontInstructions() {
    const instructions = `
# SVG文本字体使用说明

## 如何获取字体文件

### 方法1: 从Google Fonts下载
1. 访问 https://fonts.google.com/
2. 搜索并选择您喜欢的字体
3. 点击"Download family"下载ZIP文件
4. 解压后选择.ttf或.otf文件上传

### 方法2: 使用系统字体
1. 在Windows: C:\\Windows\\Fonts\\
2. 在macOS: /Library/Fonts/ 或 ~/Library/Fonts/
3. 在Linux: /usr/share/fonts/

### 方法3: 购买商业字体
- Adobe Fonts
- MyFonts
- Fonts.com

## 推荐字体

### 免费字体
- **Roboto** - Google Material Design
- **Open Sans** - 清晰易读
- **Lato** - 现代简洁
- **Source Sans Pro** - Adobe开源
- **Montserrat** - 几何风格

### 中文字体
- **思源黑体** - Adobe开源
- **文泉驿微米黑** - 开源中文字体
- **微软雅黑** - Windows系统字体

## 使用技巧

1. **字体格式选择**:
   - WOFF2: 最佳压缩，现代浏览器支持
   - WOFF: 良好压缩，广泛支持
   - TTF: 通用格式，文件较大
   - OTF: 高级特性，文件较大

2. **字体大小优化**:
   - 选择包含所需字符的字体文件
   - 避免下载整个字体族
   - 考虑使用字体子集

3. **性能考虑**:
   - 字体文件大小影响加载速度
   - 建议使用WOFF2格式
   - 考虑字体预加载

## 常见问题

**Q: 为什么字体没有正确显示？**
A: 确保字体文件格式正确，且包含所需的字符。

**Q: 可以同时使用多个字体吗？**
A: 可以，但需要分别上传每个字体文件。

**Q: 导出的图片质量如何？**
A: 导出为PNG可获得最佳质量，JPG适合照片类内容。
`;

    fs.writeFileSync(path.join(fontsDir, 'USAGE.md'), instructions);
    console.log('✅ 使用说明创建完成');
}

// 主函数
async function main() {
    console.log('🚀 开始设置字体文件...');
    
    try {
        // 创建示例字体文件
        createSampleFonts();
        
        // 创建使用说明
        createFontInstructions();
        
        console.log('✅ 字体设置完成！');
        console.log('📁 字体文件位置:', fontsDir);
        console.log('📖 查看使用说明:', path.join(fontsDir, 'USAGE.md'));
        
    } catch (error) {
        console.error('❌ 设置失败:', error.message);
    }
}

// 运行主函数
main();