// 颜色映射配置
const COLOR_MAPPING = {
    'editor.background': 'Bg',
    'editor.foreground': 'Fg',
    'editor.selectionBackground': 'Sel',
    'editorLineNumber.foreground': 'LineNum',
    'editorCursor.foreground': 'Caret',
    'editorSuggestWidget.background': 'PopupBg',
    'editorSuggestWidget.foreground': 'PopupFg'
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
    let sakuraConfig = ['[Color]\n'];
    
    Object.entries(COLOR_MAPPING).forEach(([vsKey, sakuraKey]) => {
        const color = vsTheme.colors[vsKey];
        if (color) {
            sakuraConfig.push(`${sakuraKey}=${hexToBgr(color)}`);
        }
    });
    
    return sakuraConfig.join('\n');
}

function hexToBgr(hex) {
    const r = parseInt(hex.substr(1,2), 16);
    const g = parseInt(hex.substr(3,2), 16);
    const b = parseInt(hex.substr(5,2), 16);
    return (b << 16) | (g << 8) | r;
}

function updatePreview(colors) {
    const preview = document.getElementById('editorPreview');
    preview.style.backgroundColor = colors['editor.background'];
    preview.style.color = colors['editor.foreground'];
}

function enableDownload(config) {
    const blob = new Blob([config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sakura-theme.col';
        a.click();
    };
}

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
