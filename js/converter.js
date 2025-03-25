// js/converter.js
const DEFAULT_COLORS = {
    // 格式: [显示方式, 太字, 文字色(RGB), 背景色(RGB), 下線]
    'BRC': [0, 1, '000080', 'f0fbff', 0],
    'CAR': [1, 0, '000000', 'f0fbff', 0],
    'CBK': [0, 0, '000000', '80ffff', 0],
    'CMT': [1, 0, '008000', 'f0fbff', 0],
    'CTL': [1, 0, '00ffff', 'f0fbff', 0],
    'CVL': [0, 0, 'ff8080', 'f0fbff', 0],
    'DFA': [1, 0, 'd20000', 'ffd0a2', 0],
    'DFC': [1, 0, '006f00', 'c0fdbd', 0],
    'DFD': [1, 0, '006ad5', 'ace9ff', 0],
    'EBK': [0, 0, '000000', 'f3f3f3', 0],
    'EOF': [1, 0, 'ffff00', '000000', 0],
    'EOL': [1, 0, 'ff8000', 'f0fbff', 0],
    'FN2': [1, 0, '000000', 'ffffa0', 0],
    'FN3': [1, 0, '000000', '99ff99', 0],
    'FN4': [1, 0, '000000', '9999ff', 0],
    'FN5': [1, 0, '000000', 'ff66ff', 0],
    'FND': [1, 0, '000000', '00ffff', 0],
    'HDC': [0, 0, '400080', 'f0fbff', 0],
    'IME': [1, 0, '0000ff', 'f0fbff', 0],
    'KW1': [1, 0, 'ff0000', 'f0fbff', 0],
    'KW2': [1, 0, '0080ff', 'f0fbff', 0],
    'KW3': [1, 0, '0080ff', 'f0fbff', 0],
    'KW4': [1, 0, '0080ff', 'f0fbff', 0],
    'KW5': [1, 0, '0080ff', 'f0fbff', 0],
    'KW6': [1, 0, '0080ff', 'f0fbff', 0],
    'KW7': [1, 0, '0080ff', 'f0fbff', 0],
    'KW8': [1, 0, '0080ff', 'f0fbff', 0],
    'KW9': [1, 0, '0080ff', 'f0fbff', 0],
    'KWA': [1, 0, '0080ff', 'f0fbff', 0],
    'LNO': [1, 0, 'ff0000', 'efefef', 0],
    'MOD': [1, 1, 'ff0000', 'efefef', 0],
    'MRK': [1, 0, 'f0fbff', 'c08000', 0],
    'NOT': [0, 0, 'ffc0c0', 'f0fbff', 0],
    'NUM': [0, 0, '0000eb', 'f0fbff', 0],
    'PGV': [1, 0, 'f0fbff', 'ffe6be', 0],
    'RAP': [1, 0, 'ff00ff', 'f0fbff', 0],
    'RK1': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK2': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK3': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK4': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK5': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK6': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK7': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK8': [0, 0, 'ff0000', 'f0fbff', 0],
    'RK9': [0, 0, 'ff0000', 'f0fbff', 0],
    'RKA': [0, 0, 'ff0000', 'f0fbff', 0],
    'RUL': [1, 0, '000000', 'efefef', 0],
    'SEL': [1, 0, 'c56a31', 'c56a31', 0],
    'SPC': [0, 0, 'c0c0c0', 'f0fbff', 0],
    'SQT': [0, 0, '808040', 'f0fbff', 0],
    'TAB': [1, 0, '808080', 'f0fbff', 0],
    'TXT': [1, 0, '000000', 'f0fbff', 0],
    'UND': [1, 0, 'ff0000', 'f0fbff', 0],
    'URL': [1, 0, 'ff0000', 'f0fbff', 1],
    'VER': [0, 0, 'c0c0c0', 'f0fbff', 0],
    'WQT': [0, 0, '400080', 'f0fbff', 0],
    'ZEN': [1, 0, 'c0c0c0', 'f0fbff', 0]
};

const VSCODE_MAPPING = {
    'editor.background': 'EBK',
    'editor.foreground': 'TXT',
    'editorCursor.foreground': 'CAR',
    'editor.selectionBackground': 'SEL',
    'editor.lineHighlightBackground': 'CBK',
    'editorLineNumber.foreground': 'LNO',
    'editorBracketMatch.border': 'BRC',
    'editor.findMatchHighlightBackground': 'FND',
    'textLink.foreground': 'URL',
    'editorGutter.modifiedBackground': 'MOD',
    'editorGutter.addedBackground': 'DFC',
    'editorGutter.deletedBackground': 'DFD',
    'comment': 'CMT',
    'string': 'SQT',
    'keyword': 'KW1',
    'number': 'NUM'
};

document.getElementById('themeFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const raw = event.target.result;
            const vsTheme = JSON.parse(raw);
            
            // 过滤无效字段并初始化必要属性
            const cleanTheme = {
                name: vsTheme.name || 'Unnamed Theme',
                colors: vsTheme.colors || {},
                tokenColors: vsTheme.tokenColors || []
            };

            const sakuraConfig = convertTheme(cleanTheme);
            updatePreview(cleanTheme.colors);
            enableDownload(sakuraConfig);
            displayColorGrid(cleanTheme.colors);
        } catch (error) {
            alert(`无效的主题文件: ${error.message}`);
            console.error('Error details:', error);
        }
    };
    reader.readAsText(file);
});

function convertTheme(vsTheme) {
    let config = [
        '; テキストエディタ色設定 Ver3',
        `; Generated from: ${vsTheme.name}`,
        '[SakuraColor]'
    ];

    Object.entries(DEFAULT_COLORS).forEach(([sakuraKey, defaultSettings]) => {
        const vsKey = Object.keys(VSCODE_MAPPING).find(k => VSCODE_MAPPING[k] === sakuraKey);
        const color = getColorValue(vsTheme, vsKey);
        
        const [display, bold, defaultFg, defaultBg, underline] = defaultSettings;
        
        // 转换颜色为BGR格式
        const fg = color?.fg ? rgbToBgr(color.fg) : rgbToBgr(defaultFg);
        const bg = color?.bg ? rgbToBgr(color.bg) : rgbToBgr(defaultBg);
        
        config.push(`C[${sakuraKey}]=${display},${bold},${fg},${bg},${underline}`);
    });

    return config.join('\n');
}

function getColorValue(theme, vsKey) {
    // 从colors获取
    if (vsKey && theme.colors[vsKey]) {
        return {
            fg: theme.colors[vsKey],
            bg: theme.colors['editor.background'] || DEFAULT_COLORS['EBK'][3]
        };
    }
    
    // 从tokenColors获取
    if (vsKey) {
        const token = theme.tokenColors.find(t => 
            t.scope?.split(',').includes(vsKey)
        );
        if (token?.settings) {
            return {
                fg: token.settings.foreground,
                bg: token.settings.background || DEFAULT_COLORS['EBK'][3]
            };
        }
    }
    
    return null;
}

// RGB转BGR核心函数
function rgbToBgr(rgb) {
    if (!rgb) return '000000';
    
    // 移除#号并规范化
    let hex = rgb.replace(/#/g, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    hex = hex.padEnd(6, '0').substring(0, 6).toLowerCase();
    
    // 分解RGB并重组为BGR
    const r = hex.substring(0, 2);
    const g = hex.substring(2, 4);
    const b = hex.substring(4, 6);
    return `${b}${g}${r}`; // BGR顺序
}

// 其余辅助函数保持不变
function updatePreview(colors) {
    const preview = document.getElementById('editorPreview');
    preview.style.backgroundColor = colors['editor.background'];
    preview.style.color = colors['editor.foreground'];
}

function enableDownload(config) {
    const blob = new Blob([config], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sakura-theme.col';
        a.click();
        URL.revokeObjectURL(url);
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
