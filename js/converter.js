// 颜色映射配置（新版格式）
const COLOR_MAPPING = {
    // 基础颜色映射
    'editor.background': ['EBK', [0, 0, '000000', 'F3F3F3', 0]],
    'editor.foreground': ['TXT', [0, 0, '333333', 'FFFFFF', 0]],
    'editorCursor.foreground': ['CAR', [0, 0, '000000', 'FFFFFF', 0]],
    'editor.selectionBackground': ['SEL', [0, 1, '264F78', 'FFFFFF', 0]],
    'editorLineNumber.foreground': ['LNO', [0, 0, '858585', 'FFFFFF', 0]],
    
    // 语法高亮扩展
    'editorSuggestWidget.background': ['PopupBg', [0, 0, '252526', 'FFFFFF', 0]],
    'editorSuggestWidget.foreground': ['PopupFg', [0, 0, 'D4D4D4', '252526', 0]],
    
    // 新增V3格式必需项
    'editorBracketMatch.background': ['BRC', [1, 1, '2F32DC', '756E58', 0]],
    'editor.findMatchHighlightBackground': ['FND', [0, 1, '009985', '423607', 0]]
};

document.getElementById('themeFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const vsTheme = JSON.parse(event.target.result);
            const sakuraConfig = convertTheme(vsTheme);
            updatePreview(vsTheme.colors);
            enableDownload(sakuraConfig);
            displayColorGrid(vsTheme.colors);
        } catch (error) {
            alert('无效的主题文件: ' + error.message);
        }
    };
    reader.readAsText(file);
});

function convertTheme(vsTheme) {
    let config = [
        '; テキストエディタ色設定 Ver3',
        '[SakuraColor]'
    ];

    // 生成颜色配置项
    Object.entries(COLOR_MAPPING).forEach(([vsKey, [sakuraKey, settings]]) => {
        const color = vsTheme.colors[vsKey];
        if (color) {
            const [display, bold, defaultFg, defaultBg, underline] = settings;
            const fg = color ? hexToRgb(color) : defaultFg;
            const bg = hexToRgb(vsTheme.colors['editor.background'] || defaultBg);
            config.push(`C[${sakuraKey}]=${display},${bold},${fg},${bg},${underline}`);
        }
    });

    // 添加必需默认项
    config.push(
        'C[VER]=0,0,837b65,362b00,0',
        'C[PGV]=1,0,f0fbff,ffe6be,0'
    );

    return config.join('\n');
}

// HEX转RRGGBB格式
function hexToRgb(hex) {
    if (!hex) return '000000';
    return hex.replace('#', '').padEnd(6, '0').substring(0,6).toUpperCase();
}

// 保持原有预览功能
function updatePreview(colors) {
    const preview = document.getElementById('editorPreview');
    preview.style.backgroundColor = colors['editor.background'];
    preview.style.color = colors['editor.foreground'];
}

function enableDownload(config) {
    const blob = new Blob([config], { type: 'text/plain;charset=utf-8' }); // 明确编码
    const url = URL.createObjectURL(blob);
    
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = false;
    
    // 清理旧的事件监听器
    downloadBtn.replaceWith(downloadBtn.cloneNode(true));
    const newBtn = document.getElementById('downloadBtn');
    
    newBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sakura-theme.col';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
}

// 保持原有颜色网格功能
function displayColorGrid(colors) {
    const grid = document.getElementById('colorGrid');
    grid.innerHTML = '';
    
    Object.entries(colors).forEach(([name, hex]) => {
        const item = document.createElement('div');
        item.className = 'color-item';
        item.style.backgroundColor = hex;
        item.style.color = getContrastColor(hex);
        item.textContent = name.split('.').pop();
        grid.appendChild(item);
    });
}

function getContrastColor(hex) {
    const r = parseInt(hex.substr(1,2), 16);
    const g = parseInt(hex.substr(3,2), 16);
    const b = parseInt(hex.substr(5,2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
}
