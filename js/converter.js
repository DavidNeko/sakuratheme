const COLOR_MAPPING = {
    // 基础颜色
    'editor.background': ['EBK', [0,0,0,0,0]],  // 偶数行背景
    'editor.foreground': ['TXT', [0,0,0,0,0]],
    'editorCursor.foreground': ['CAR', [0,0,0,0,0]],
    'editor.selectionBackground': ['SEL', [0,0,0,0,0]],
    'editor.lineHighlightBackground': ['CBK', [0,0,0,0,0]],
    
    // 语法高亮
    'comment': ['CMT', [0,0,0,0,0]],
    'string': ['SQT', [0,0,0,0,0]],
    'keyword': ['KW1', [0,1,0,0,0]],  // 太字
    'number': ['NUM', [0,0,0,0,0]],
    'function': ['KW2', [0,0,0,0,0]],
    
    // 行号等界面元素
    'editorLineNumber.foreground': ['LNO', [0,0,0,0,0]],
    'editorGutter.background': ['EBK', [0,0,0,0,0]],
    
    // 扩展语法（需要与VSCode的tokenColors匹配）
    'entity.name.type.class': ['KW3', [0,0,0,0,0]],
    'entity.name.function': ['KW4', [0,0,0,0,0]],
    'storage.type': ['KW5', [0,0,0,0,0]]
};

function convertTheme(vsTheme) {
    let config = [
        '; テキストエディタ色設定 Ver3',
        '[SakuraColor]'
    ];

    // 生成默认配置
    const defaultColors = {
        'TXT': { fg: 'FFFFFF', bg: '1E1E1E' },
        'EBK': { fg: '000000', bg: 'F3F3F3' },
        // 其他默认值...
    };

    // 转换颜色项
    Object.entries(COLOR_MAPPING).forEach(([vsKey, [sakuraKey, flags]]) => {
        const color = getColor(vsTheme, vsKey);
        const entry = formatEntry(sakuraKey, flags, color);
        config.push(entry);
    });

    return config.join('\n');
}

// 深度获取颜色值（支持tokenColors）
function getColor(theme, path) {
    // 从colors直接获取
    if (theme.colors?.[path]) {
        return {
            fg: theme.colors[path],
            bg: theme.colors['editor.background']
        };
    }
    
    // 从tokenColors解析
    const token = theme.tokenColors?.find(t => 
        t.scope?.split(',').includes(path)
    );
    return {
        fg: token?.settings?.foreground || defaultColors[sakuraKey].fg,
        bg: token?.settings?.background || defaultColors[sakuraKey].bg
    };
}

// 格式化单个条目
function formatEntry(key, flags, color) {
    const [display, bold, , , underline] = flags;
    return `C[${key}]=${display},${bold},${hexToRgb(color.fg)},${hexToRgb(color.bg)},${underline}`;
}

// HEX转RRGGBB格式
function hexToRgb(hex) {
    if (!hex) return '000000';
    return hex.replace('#', '').padEnd(6, '0').substring(0,6);
}
