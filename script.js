class EmbroideryTextEffect {
    constructor() {
        this.textElement = document.getElementById('embroideryText');
        this.textInput = document.getElementById('textInput');
        this.autoChangeInterval = null;
        this.isAutoChanging = false;
        this.currentFont = null;
        this.fontName = 'Default';
        
        // 预设文字数组
        this.presetTexts = ['C', 'HELLO', '刺绣', 'LOVE', '2024', 'JS', 'CSS', 'HTML', '美丽', 'ART'];
        this.currentIndex = 0;
        
        // 初始化
        this.init();
    }
    
    init() {
        // 设置初始文字的data属性
        this.updateDataText();
        
        // 绑定输入框回车事件
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.changeText();
            }
        });
        
        // 绑定字体文件上传事件
        const fontFile = document.getElementById('fontFile');
        if (fontFile) {
            fontFile.addEventListener('change', this.handleFontFile.bind(this));
        }
        
        // 添加鼠标悬停效果
        this.textElement.addEventListener('mouseenter', () => {
            if (!this.isAutoChanging) {
                this.textElement.classList.add('changing');
            }
        });
        
        this.textElement.addEventListener('mouseleave', () => {
            this.textElement.classList.remove('changing');
        });
    }
    
    updateDataText() {
        this.textElement.setAttribute('data-text', this.textElement.textContent);
    }
    
    // 改变文字的主要方法
    changeText() {
        const newText = this.textInput.value.trim();
        if (newText && newText !== this.textElement.textContent) {
            this.animateTextChange(newText);
            this.textInput.value = '';
        }
    }
    
    // 设置特定文字
    setText(text) {
        if (text !== this.textElement.textContent) {
            this.animateTextChange(text);
        }
    }
    
    // 文字变化动画
    animateTextChange(newText) {
        // 添加淡出动画
        this.textElement.classList.add('fade-out');
        
        setTimeout(() => {
            // 更新文字内容
            this.textElement.textContent = newText;
            this.updateDataText();
            
            // 移除淡出，添加淡入动画
            this.textElement.classList.remove('fade-out');
            this.textElement.classList.add('fade-in');
            
            // 添加随机颜色变化
            this.addColorVariation();
            
            setTimeout(() => {
                this.textElement.classList.remove('fade-in');
            }, 800);
        }, 400);
    }
    
    // 添加颜色变化效果
    addColorVariation() {
        const hue = Math.random() * 60; // 0-60度的色相变化
        const brightness = 1 + (Math.random() - 0.5) * 0.2; // 轻微的亮度变化
        const contrast = 1 + (Math.random() - 0.5) * 0.3; // 轻微的对比度变化
        
        this.textElement.style.filter = `
            contrast(${contrast}) 
            brightness(${brightness}) 
            hue-rotate(${hue}deg)
        `;
        
        // 3秒后恢复原始滤镜
        setTimeout(() => {
            this.textElement.style.filter = 'contrast(1.1) brightness(1.05)';
        }, 3000);
    }
    
    // 开始自动变化
    startAutoChange() {
        if (this.isAutoChanging) return;
        
        this.isAutoChanging = true;
        this.autoChangeInterval = setInterval(() => {
            const randomText = this.presetTexts[Math.floor(Math.random() * this.presetTexts.length)];
            this.animateTextChange(randomText);
        }, 3000); // 每3秒变化一次
        
        // 立即开始第一次变化
        setTimeout(() => {
            const randomText = this.presetTexts[Math.floor(Math.random() * this.presetTexts.length)];
            this.animateTextChange(randomText);
        }, 500);
    }
    
    // 停止自动变化
    stopAutoChange() {
        if (this.autoChangeInterval) {
            clearInterval(this.autoChangeInterval);
            this.autoChangeInterval = null;
            this.isAutoChanging = false;
        }
    }
    
    // 添加打字机效果
    typewriterEffect(text, callback) {
        this.textElement.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                this.textElement.textContent += text.charAt(i);
                this.updateDataText();
                i++;
            } else {
                clearInterval(typeInterval);
                if (callback) callback();
            }
        }, 150);
    }
    
    // 添加随机闪烁效果
    addSparkleEffect() {
        const sparkles = [];
        const sparkleCount = 5;
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: radial-gradient(circle, #fff 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: sparkle 1s ease-out forwards;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                
                this.textElement.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1000);
            }, i * 200);
        }
    }
}

// 添加闪烁动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
    
    .sparkle {
        z-index: 1000;
    }
`;
document.head.appendChild(style);

// 全局函数供HTML调用
let embroideryEffect;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    embroideryEffect = new EmbroideryTextEffect();
});

// HTML中按钮调用的函数
function changeText() {
    embroideryEffect.changeText();
}

function setText(text) {
    embroideryEffect.setText(text);
}

function startAutoChange() {
    embroideryEffect.startAutoChange();
}

function stopAutoChange() {
    embroideryEffect.stopAutoChange();
}

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                embroideryEffect.changeText();
                break;
            case ' ':
                e.preventDefault();
                if (embroideryEffect.isAutoChanging) {
                    embroideryEffect.stopAutoChange();
                } else {
                    embroideryEffect.startAutoChange();
                }
                break;
        }
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        if (e.target === embroideryEffect.textElement) {
            embroideryEffect.addSparkleEffect();
        }
    });
}

// SVG导出相关方法
EmbroideryTextEffect.prototype.handleFontFile = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = this.arrayBufferToBase64(arrayBuffer);
        const fileType = file.type || 'font/ttf';
        const fontUrl = `data:${fileType};base64,${base64}`;
        
        this.fontName = this.generateFontName(file.name);
        await this.loadFont(this.fontName, fontUrl);
        
        // 更新字体信息显示
        const fontInfo = document.getElementById('fontInfo');
        const fontName = document.getElementById('fontName');
        if (fontInfo && fontName) {
            fontName.textContent = `字体: ${this.fontName}`;
            fontInfo.style.display = 'block';
        }
        
        // 应用字体到当前文本
        this.textElement.style.fontFamily = this.fontName;
        
        console.log(`字体 ${this.fontName} 加载成功`);
    } catch (error) {
        console.error('字体加载失败:', error);
        alert('字体加载失败: ' + error.message);
    }
};

EmbroideryTextEffect.prototype.arrayBufferToBase64 = function(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

EmbroideryTextEffect.prototype.generateFontName = function(fileName) {
    const name = fileName.split('.')[0];
    return name.replace(/[^a-zA-Z0-9]/g, '') + '_' + Date.now();
};

EmbroideryTextEffect.prototype.loadFont = function(fontName, fontUrl) {
    return new Promise((resolve, reject) => {
        const fontFace = new FontFace(fontName, `url(${fontUrl})`);
        
        fontFace.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            this.currentFont = fontName;
            resolve();
        }).catch((error) => {
            reject(new Error(`字体加载失败: ${error.message}`));
        });
    });
};

EmbroideryTextEffect.prototype.createSVG = function() {
    const text = this.textElement.textContent;
    const fontSize = parseInt(window.getComputedStyle(this.textElement).fontSize);
    const fontColor = window.getComputedStyle(this.textElement).color;
    const fontFamily = this.currentFont || 'Georgia, serif';
    
    // 获取文本的边界框
    const bbox = this.textElement.getBBox ? this.textElement.getBBox() : { width: text.length * fontSize * 0.6, height: fontSize };
    
    // 创建SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', bbox.width + 100);
    svg.setAttribute('height', bbox.height + 100);
    svg.setAttribute('viewBox', `0 0 ${bbox.width + 100} ${bbox.height + 100}`);
    
    // 添加背景
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', '#ffffff');
    svg.appendChild(rect);
    
    // 添加文本
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.textContent = text;
    textElement.setAttribute('x', (bbox.width + 100) / 2);
    textElement.setAttribute('y', (bbox.height + 100) / 2 + fontSize / 3);
    textElement.setAttribute('font-size', fontSize);
    textElement.setAttribute('font-family', fontFamily);
    textElement.setAttribute('fill', fontColor);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    
    // 添加刺绣效果（简化版）
    const shadowText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    shadowText.textContent = text;
    shadowText.setAttribute('x', (bbox.width + 100) / 2 + 2);
    shadowText.setAttribute('y', (bbox.height + 100) / 2 + fontSize / 3 + 2);
    shadowText.setAttribute('font-size', fontSize);
    shadowText.setAttribute('font-family', fontFamily);
    shadowText.setAttribute('fill', '#888888');
    shadowText.setAttribute('text-anchor', 'middle');
    shadowText.setAttribute('dominant-baseline', 'middle');
    
    svg.insertBefore(shadowText, textElement);
    svg.appendChild(textElement);
    
    return svg;
};

// 全局导出函数
function exportToSVG() {
    if (!embroideryEffect) return;
    
    try {
        const svg = embroideryEffect.createSVG();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'embroidery-text.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('SVG文件下载成功！');
    } catch (error) {
        console.error('SVG导出失败:', error);
        alert('SVG导出失败: ' + error.message);
    }
}

function exportToPNG() {
    if (!embroideryEffect) return;
    
    try {
        const svg = embroideryEffect.createSVG();
        const svgData = new XMLSerializer().serializeToString(svg);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'embroidery-text.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
                URL.revokeObjectURL(url);
                
                alert('PNG文件下载成功！');
            }, 'image/png');
        };
        
        img.src = url;
    } catch (error) {
        console.error('PNG导出失败:', error);
        alert('PNG导出失败: ' + error.message);
    }
}

function exportToJPG() {
    if (!embroideryEffect) return;
    
    try {
        const svg = embroideryEffect.createSVG();
        const svgData = new XMLSerializer().serializeToString(svg);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 设置白色背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'embroidery-text.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
                URL.revokeObjectURL(url);
                
                alert('JPG文件下载成功！');
            }, 'image/jpeg', 0.9);
        };
        
        img.src = url;
    } catch (error) {
        console.error('JPG导出失败:', error);
        alert('JPG导出失败: ' + error.message);
    }
}