class SVGTextExporter {
    constructor() {
        this.currentFont = null;
        this.fontName = 'CustomFont';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSVG();
    }

    setupEventListeners() {
        // 字体文件上传
        const fontUpload = document.getElementById('fontUpload');
        const fontFile = document.getElementById('fontFile');

        fontUpload.addEventListener('click', () => fontFile.click());
        fontUpload.addEventListener('dragover', this.handleDragOver.bind(this));
        fontUpload.addEventListener('dragleave', this.handleDragLeave.bind(this));
        fontUpload.addEventListener('drop', this.handleDrop.bind(this));
        fontFile.addEventListener('change', this.handleFontFile.bind(this));

        // 实时更新SVG
        const inputs = ['textInput', 'fontSize', 'fontColor', 'backgroundColor', 'textAlign', 'svgWidth', 'svgHeight'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            element.addEventListener('input', this.updateSVG.bind(this));
            element.addEventListener('change', this.updateSVG.bind(this));
        });

        // 字体大小滑块显示
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        fontSizeSlider.addEventListener('input', (e) => {
            fontSizeValue.textContent = e.target.value + 'px';
            this.updateSVG();
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.loadFontFile(files[0]);
        }
    }

    handleFontFile(e) {
        const file = e.target.files[0];
        if (file) {
            this.loadFontFile(file);
        }
    }

    async loadFontFile(file) {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const success = document.getElementById('success');
        const fontInfo = document.getElementById('fontInfo');

        // 隐藏之前的消息
        error.style.display = 'none';
        success.style.display = 'none';
        loading.style.display = 'block';

        try {
            // 验证文件类型
            const validTypes = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2'];
            const fileType = file.type;
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (!validTypes.includes(fileType) && !['ttf', 'otf', 'woff', 'woff2'].includes(fileExtension)) {
                throw new Error('不支持的文件格式。请上传 .ttf, .otf, .woff 或 .woff2 文件。');
            }

            // 读取文件
            const arrayBuffer = await file.arrayBuffer();
            const base64 = this.arrayBufferToBase64(arrayBuffer);
            
            // 创建字体名称
            this.fontName = this.generateFontName(file.name);
            
            // 创建字体URL
            const fontUrl = `data:${fileType || 'font/ttf'};base64,${base64}`;
            
            // 加载字体
            await this.loadFont(this.fontName, fontUrl);
            
            // 更新字体信息
            this.updateFontInfo(file);
            
            // 更新SVG
            this.updateSVG();
            
            loading.style.display = 'none';
            success.style.display = 'block';
            success.textContent = `字体 "${this.fontName}" 加载成功！`;
            
        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = `字体加载失败: ${err.message}`;
            console.error('字体加载错误:', err);
        }
    }

    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    generateFontName(fileName) {
        const name = fileName.split('.')[0];
        return name.replace(/[^a-zA-Z0-9]/g, '') + '_' + Date.now();
    }

    loadFont(fontName, fontUrl) {
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
    }

    updateFontInfo(file) {
        const fontInfo = document.getElementById('fontInfo');
        const fontName = document.getElementById('fontName');
        const fontFormat = document.getElementById('fontFormat');
        const fontSize = document.getElementById('fontSize');

        fontName.textContent = `字体名称: ${this.fontName}`;
        fontFormat.textContent = `格式: ${file.type || file.name.split('.').pop().toUpperCase()}`;
        fontSize.textContent = `文件大小: ${(file.size / 1024).toFixed(2)} KB`;
        
        fontInfo.style.display = 'block';
    }

    updateSVG() {
        const svg = document.getElementById('textSvg');
        const text = document.getElementById('textInput').value || 'Hello SVG!';
        const fontSize = document.getElementById('fontSize').value;
        const fontColor = document.getElementById('fontColor').value;
        const backgroundColor = document.getElementById('backgroundColor').value;
        const textAlign = document.getElementById('textAlign').value;
        const svgWidth = parseInt(document.getElementById('svgWidth').value);
        const svgHeight = parseInt(document.getElementById('svgHeight').value);

        // 更新SVG尺寸
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('height', svgHeight);
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

        // 清空SVG内容
        svg.innerHTML = '';

        // 添加背景
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', backgroundColor);
        svg.appendChild(rect);

        // 添加文本
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.textContent = text;
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('fill', fontColor);
        textElement.setAttribute('font-family', this.currentFont || 'Arial, sans-serif');
        textElement.setAttribute('text-anchor', textAlign === 'left' ? 'start' : textAlign === 'right' ? 'end' : 'middle');
        
        // 计算文本位置
        const x = textAlign === 'left' ? 20 : textAlign === 'right' ? svgWidth - 20 : svgWidth / 2;
        const y = svgHeight / 2 + parseInt(fontSize) / 3;
        
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);

        svg.appendChild(textElement);
    }

    async exportAsPNG() {
        await this.exportImage('png');
    }

    async exportAsJPG() {
        await this.exportImage('jpeg');
    }

    async exportImage(format) {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const success = document.getElementById('success');

        // 隐藏之前的消息
        error.style.display = 'none';
        success.style.display = 'none';
        loading.style.display = 'block';

        try {
            const svg = document.getElementById('textSvg');
            const svgData = new XMLSerializer().serializeToString(svg);
            
            // 创建canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置canvas尺寸
            const svgWidth = parseInt(document.getElementById('svgWidth').value);
            const svgHeight = parseInt(document.getElementById('svgHeight').value);
            canvas.width = svgWidth;
            canvas.height = svgHeight;

            // 创建图片
            const img = new Image();
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                // 绘制到canvas
                ctx.drawImage(img, 0, 0);
                
                // 导出
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                const quality = format === 'jpeg' ? 0.9 : undefined;
                
                canvas.toBlob((blob) => {
                    const downloadUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = `svg-text-export.${format}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(downloadUrl);
                    URL.revokeObjectURL(url);
                    
                    loading.style.display = 'none';
                    success.style.display = 'block';
                    success.textContent = `图片导出成功！格式: ${format.toUpperCase()}`;
                }, mimeType, quality);
            };

            img.onerror = () => {
                loading.style.display = 'none';
                error.style.display = 'block';
                error.textContent = '图片导出失败，请检查SVG内容';
                URL.revokeObjectURL(url);
            };

            img.src = url;

        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = `导出失败: ${err.message}`;
            console.error('导出错误:', err);
        }
    }

    downloadSVG() {
        try {
            const svg = document.getElementById('textSvg');
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'svg-text-export.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const success = document.getElementById('success');
            const error = document.getElementById('error');
            error.style.display = 'none';
            success.style.display = 'block';
            success.textContent = 'SVG文件下载成功！';
            
        } catch (err) {
            const error = document.getElementById('error');
            error.style.display = 'block';
            error.textContent = `SVG下载失败: ${err.message}`;
            console.error('SVG下载错误:', err);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new SVGTextExporter();
});

// 添加一些示例字体（可选）
const exampleFonts = {
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',
    'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
    'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap'
};

// 预加载一些Google字体
function loadGoogleFonts() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700|Open+Sans:wght@300;400;600;700|Lato:wght@300;400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

// 加载Google字体
loadGoogleFonts();