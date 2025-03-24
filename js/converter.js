// 颜色映射配置（新版格式）
const DEFAULT_COLORS = {
    // 格式: [显示方式, 太字, 文字色, 背景色, 下線]
    'BRC': [0,1,'000080','f0fbff',0],
    'CAR': [1,0,'000000','f0fbff',0],
    'CBK': [0,0,'000000','80ffff',0],
    'CMT': [1,0,'008000','f0fbff',0],
    'CTL': [1,0,'00ffff','f0fbff',0],
    'CVL': [0,0,'ff8080','f0fbff',0],
    'DFA': [1,0,'d20000','ffd0a2',0],
    'DFC': [1,0,'006f00','c0fdbd',0],
    'DFD': [1,0,'006ad5','ace9ff',0],
    'EBK': [0,0,'000000','f3f3f3',0],
    'EOF': [1,0,'ffff00','000000',0],
    'EOL': [1,0,'ff8000','f0fbff',0],
    'FN2': [1,0,'000000','ffffa0',0],
    'FN3': [1,0,'000000','99ff99',0],
    'FN4': [1,0,'000000','9999ff',0],
    'FN5': [1,0,'000000','ff66ff',0],
    'FND': [1,0,'000000','00ffff',0],
    'HDC': [0,0,'400080','f0fbff',0],
    'IME': [1,0,'0000ff','f0fbff',0],
    'KW1': [1,0,'ff0000','f0fbff',0],
    'KW2': [1,0,'0080ff','f0fbff',0],
    'KW3': [1,0,'0080ff','f0fbff',0],
    'KW4': [1,0,'0080ff','f0fbff',0],
    'KW5': [1,0,'0080ff','f0fbff',0],
    'KW6': [1,0,'0080ff','f0fbff',0],
    'KW7': [1,0,'0080ff','f0fbff',0],
    'KW8': [1,0,'0080ff','f0fbff',0],
    'KW9': [1,0,'0080ff','f0fbff',0],
    'KWA': [1,0,'0080ff','f0fbff',0],
    'LNO': [1,0,'ff0000','efefef',0],
    'MOD': [1,1,'ff0000','efefef',0],
    'MRK': [1,0,'f0fbff','c08000',0],
    'NOT': [0,0,'ffc0c0','f0fbff',0],
    'NUM': [0,0,'0000eb','f0fbff',0],
    'PGV': [1,0,'f0fbff','ffe6be',0],
    'RAP': [1,0,'ff00ff','f0fbff',0],
    'RK1': [0,0,'ff0000','f0fbff',0],
    'RK2': [0,0,'ff0000','f0fbff',0],
    'RK3': [0,0,'ff0000','f0fbff',0],
    'RK4': [0,0,'ff0000','f0fbff',0],
    'RK5': [0,0,'ff0000','f0fbff',0],
    'RK6': [0,0,'ff0000','f0fbff',0],
    'RK7': [0,0,'ff0000','f0fbff',0],
    'RK8': [0,0,'ff0000','f0fbff',0],
    'RK9': [0,0,'ff0000','f0fbff',0],
    'RKA': [0,0,'ff0000','f0fbff',0],
    'RUL': [1,0,'000000','efefef',0],
    'SEL': [1,0,'c56a31','c56a31',0],
    'SPC': [0,0,'c0c0c0','f0fbff',0],
    'SQT': [0,0,'808040','f0fbff',0],
    'TAB': [1,0,'808080','f0fbff',0],
    'TXT': [1,0,'000000','f0fbff',0],
    'UND': [1,0,'ff0000','f0fbff',0],
    'URL': [1,0,'ff0000','f0fbff',1],
    'VER': [0,0,'c0c0c0','f0fbff',0],
    'WQT': [0,0,'400080','f0fbff',0],
    'ZEN': [1,0,'c0c0c0','f0fbff',0]
};

const VSCODE_MAPPING = {
    // 增加对新版VSCode主题的支持
    'editor.background': 'EBK',
    'editor.foreground': 'TXT',
    'editorCursor.foreground': 'CAR',
    'editor.selectionBackground': 'SEL',
    'editorLineNumber.foreground': 'LNO',
    'editor.findMatchBackground': 'FND',
    'editorBracketMatch.border': 'BRC',
    
    // 新增映射
    'textLink.foreground': 'URL',
    'editorGutter.modifiedBackground': 'MOD',
    'editorGutter.addedBackground': 'DFC',
    'editorGutter.deletedBackground': 'DFD'
};

document.getElementById('themeFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            // 添加JSON验证
            const rawData = event.target.result;
            // 预验证JSON结构
            if (!validateThemeJSON(rawData)) {
                throw new Error('无效的主题文件格式');
            }
            
            const vsTheme = JSON.parse(rawData);
            // 强制初始化关键字段
            vsTheme.colors = vsTheme.colors || {};
            vsTheme.tokenColors = vsTheme.tokenColors || [];
            
            const sakuraConfig = convertTheme(vsTheme);
            updatePreview(vsTheme.colors);
            enableDownload(sakuraConfig);
            displayColorGrid(vsTheme.colors);
        } catch (error) {
            showErrorDetails(error);
        }
    };
    reader.readAsText(file);
});

function validateThemeJSON(raw) {
    return raw.includes('"colors"') && 
           raw.includes('"name"');
}

function showErrorDetails(error) {
    console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        input: event.target.result
    });
    alert(`转换失败: ${error.message}\n详细日志已输出到控制台`);
}

// 增加默认背景色常量
const DEFAULT_BG = 'FFFFFF';

function convertTheme(vsTheme) {
    // 过滤VSCode特殊字段
    // 确保tokenColors存在
    const cleanTheme = {
        name: vsTheme.name,
        colors: vsTheme.colors || {},
        tokenColors: vsTheme.tokenColors || []  // 明确初始化
    };
    
    let config = [
        '; テキストエディタ色設定 Ver3',
        `; Generated from: ${cleanTheme.name || 'Unknown Theme'}`,
        '[SakuraColor]'
    ];

    // 生成所有必需项
    Object.entries(DEFAULT_COLORS).forEach(([key, defaultValues]) => {
        const vsKey = findVSCodeKey(key);
        const color = getColorValue(cleanTheme, vsKey);
        
        const [display, bold, defaultFg, defaultBg, underline] = defaultValues;
        
        // 安全获取颜色值
        const safeFg = color?.fg ? color.fg.toString() : defaultFg;
        const safeBg = color?.bg ? color.bg.toString() : defaultBg;
        
        const fg = hexToRgb(safeFg);
        const bg = hexToRgb(safeBg);
        
        config.push(`C[${key}]=${display},${bold},${fg},${bg},${underline}`);
    });

    return config.join('\n');
}

function findVSCodeKey(sakuraKey) {
    return Object.entries(VSCODE_MAPPING).find(([_, v]) => v === sakuraKey)?.[0];
}

function getColorValue(theme, vsKey) {
    // 添加安全访问
    const safeTokenColors = theme.tokenColors || [];
    
    // 优先从colors获取
    if (vsKey && theme.colors[vsKey]) {
        return {
            fg: theme.colors[vsKey],
            bg: theme.colors['editor.background'] || DEFAULT_BG
        };
    }
    
    // 从tokenColors获取（添加空值保护）
    const token = safeTokenColors.find(t => {
        try {
            return t.scope?.split(',').includes(vsKey);
        } catch {
            return false;
        }
    });
    
    return token?.settings ? {
        fg: token.settings.foreground,
        bg: token.settings.background || DEFAULT_BG
    } : null;
}

// HEX转RRGGBB格式
function hexToRgb(hex) {
    // 添加类型检查和安全处理
    if (typeof hex !== 'string') hex = '';
    let value = hex.replace(/#/g, '');  // 移除所有#符号
    
    // 处理缩写格式
    if (value.length === 3) {
        value = value.split('').map(c => c + c).join('');
    }
    
    // 填充和截断
    return value
        .padEnd(6, '0')    // 确保至少6字符
        .substring(0, 6)    // 最多取6字符
        .toUpperCase();     // 统一大写
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
