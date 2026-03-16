/* ================================================
   FUNGHA DIMSUM - Google Sheets Data Fetcher
   ================================================
   Fetch data from published Google Sheets using gviz/tq endpoint.
   No API key required — Sheet must be "Published to the web".
   ================================================ */

const SheetsConfig = {
    // ⚠️ THAY SPREADSHEET_ID bằng ID thật của Google Sheet
    // Lấy từ URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
    SPREADSHEET_ID: '18imOp692hx3fyKOUiPESjmIIU-VMSMG1zaqHZqu5Aeg',

    // Tên các sheets (tabs) trong Google Spreadsheet
    SHEETS: {
        HERO: 'hero_slides',
        MENU: 'menu_items',
        PROMOTIONS: 'promotions',
        BRANCHES: 'branches',
        ABOUT_INFO: 'about_info',
        ABOUT_STATS: 'about_stats',
        ABOUT_FEATURES: 'about_features',
        SITE_INFO: 'site_info'
    },

    // Cache key prefix
    CACHE_PREFIX: 'fungha_data_',
    // Cache duration (milliseconds) — 0.1 minutes (dev mode)
    CACHE_DURATION: 0.1 * 60 * 1000
};

/**
 * Build the gviz/tq URL for a given sheet name
 */
function buildSheetUrl(sheetName) {
    return `https://docs.google.com/spreadsheets/d/${SheetsConfig.SPREADSHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(sheetName)}`;
}

/**
 * Parse the gviz/tq response (JSONP-like) into a clean array of objects.
 * Response format: google.visualization.Query.setResponse({...})
 */
function parseGvizResponse(text) {
    // Response format: /*O_o*/ google.visualization.Query.setResponse({...});
    // Extract the JSON object between the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;

    if (start === -1 || end === 0) {
        throw new Error('Invalid gviz response format');
    }

    const jsonString = text.substring(start, end);
    const json = JSON.parse(jsonString);

    if (json.status !== 'ok') {
        throw new Error(`Google Sheets error: ${json.status} - ${json.errors?.[0]?.message || 'Unknown'}`);
    }

    const table = json.table;
    let headers = table.cols.map(col => col.label);
    let rows = table.rows;

    // If labels are all empty, use the first data row as headers
    const hasLabels = headers.some(h => h && h.trim() !== '');
    if (!hasLabels && rows.length > 0) {
        headers = rows[0].c.map(cell => cell ? (cell.v || '') : '');
        rows = rows.slice(1); // skip header row from data
    }

    // Convert to array of objects
    return rows.map(row => {
        const obj = {};
        row.c.forEach((cell, i) => {
            const key = headers[i];
            if (key && key.trim() !== '') {
                obj[key.trim()] = cell ? (cell.v !== null && cell.v !== undefined ? String(cell.v) : '') : '';
            }
        });
        return obj;
    }).filter(obj => Object.keys(obj).length > 0);
}

/**
 * Check if cached data is still valid
 */
function getCachedData(sheetName) {
    try {
        const cacheKey = SheetsConfig.CACHE_PREFIX + sheetName;
        const cached = sessionStorage.getItem(cacheKey);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp > SheetsConfig.CACHE_DURATION) {
            sessionStorage.removeItem(cacheKey);
            return null;
        }

        return data;
    } catch {
        return null;
    }
}

/**
 * Save data to session cache
 */
function setCachedData(sheetName, data) {
    try {
        const cacheKey = SheetsConfig.CACHE_PREFIX + sheetName;
        sessionStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch {
        // sessionStorage full or unavailable — ignore
    }
}

/**
 * Fetch a single sheet by name. Returns array of objects.
 * Uses cache if available.
 */
async function fetchSheet(sheetName) {
    // Check cache first
    const cached = getCachedData(sheetName);
    if (cached) {
        console.log(`[Sheets] Using cached data for "${sheetName}"`);
        return cached;
    }

    const url = buildSheetUrl(sheetName);
    console.log(`[Sheets] Fetching "${sheetName}"...`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet "${sheetName}": ${response.status}`);
    }

    const text = await response.text();
    const data = parseGvizResponse(text);

    // Cache the result
    setCachedData(sheetName, data);

    console.log(`[Sheets] Loaded "${sheetName}": ${data.length} rows`);
    return data;
}

/**
 * Fetch all sheets in parallel. Returns an object with all data.
 * { hero: [...], menu: [...], promotions: [...], branches: [...] }
 */
async function fetchAllSheetsData() {
    const { SHEETS } = SheetsConfig;

    const [hero, menu, promotions, branches, aboutInfo, aboutStats, aboutFeatures, siteInfoRows] = await Promise.all([
        fetchSheet(SHEETS.HERO),
        fetchSheet(SHEETS.MENU),
        fetchSheet(SHEETS.PROMOTIONS),
        fetchSheet(SHEETS.BRANCHES),
        fetchSheet(SHEETS.ABOUT_INFO),
        fetchSheet(SHEETS.ABOUT_STATS),
        fetchSheet(SHEETS.ABOUT_FEATURES),
        fetchSheet(SHEETS.SITE_INFO)
    ]);

    // Convert site_info key-value rows to a single object
    const siteInfo = {};
    siteInfoRows.forEach(row => {
        if (row.key) siteInfo[row.key.trim()] = row.value || '';
    });

    return { hero, menu, promotions, branches, aboutInfo, aboutStats, aboutFeatures, siteInfo };
}

// Export for use by data-renderer.js and promotion-detail.js
window.SheetsConfig = SheetsConfig;
window.fetchSheet = fetchSheet;
window.fetchAllSheetsData = fetchAllSheetsData;
