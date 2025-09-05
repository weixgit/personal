class EmbroideryTextEffect {
    constructor() {
        this.textElement = document.getElementById('embroideryText');
        this.textInput = document.getElementById('textInput');
        this.autoChangeInterval = null;
        this.isAutoChanging = false;
        
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