/* ================================================
   PROMOTION DETAIL - Page Script
   ================================================
   Reads ?index=N from URL, fetches promotions data,
   renders HORIZONTAL layout: content LEFT, image RIGHT
   Icons: SVG only (per UI/UX checklist)
   ================================================ */

/* SVG Icon templates */
const DETAIL_ICONS = {
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`,
    clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
    chevronLeft: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    chevronRight: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    search: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    alertTriangle: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
};

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('promoDetailContainer');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const index = parseInt(params.get('index'), 10);

    if (isNaN(index) || index < 0) {
        showError(container);
        return;
    }

    try {
        console.log('[PromoDetail] Fetching promotions for index:', index);
        const promotions = await fetchSheet(SheetsConfig.SHEETS.PROMOTIONS);
        console.log('[PromoDetail] Fetched promotions:', promotions.length, 'items');

        if (!promotions || index >= promotions.length) {
            console.warn('[PromoDetail] Index out of range:', index, '/ total:', promotions ? promotions.length : 0);
            showError(container);
            return;
        }

        const promo = promotions[index];
        console.log('[PromoDetail] Rendering promo:', promo);
        renderPromoDetail(container, promo);

        if (promo.title) {
            document.title = `${promo.title} - Fungha Dimsum`;
        }

    } catch (error) {
        console.error('[PromoDetail] Error loading data:', error);
        showError(container, true);
    }
});

/**
 * Render promotion detail — HORIZONTAL layout
 * Left: content (title, desc, info, CTA)
 * Right: poster image (sticky)
 */
function renderPromoDetail(container, promo) {
    const title = promo.title || promo.alt || 'Chương Trình Khuyến Mãi';
    const description = promo.description || '';
    const validDate = promo.valid_date || '';
    const conditions = promo.conditions || '';
    const image = promo.image || '';

    let html = '';

    // Breadcrumb
    html += `
        <div class="promo-detail-breadcrumb">
            <a href="index.html#promotions" class="promo-detail-back">
                ${DETAIL_ICONS.chevronLeft}
                <span>Quay lại Khuyến Mãi</span>
            </a>
        </div>
    `;

    // === HORIZONTAL SPLIT LAYOUT ===
    html += '<div class="promo-detail-split">';

    // LEFT: Content
    html += '<div class="promo-detail-left">';

    // Title with ornaments
    html += `
        <div class="promo-detail-title-block">
            <div class="promo-detail-title-ornament left"></div>
            <h1 class="promo-detail-title">${title}</h1>
            <div class="promo-detail-title-ornament right"></div>
        </div>
    `;

    // Info card
    html += `
        <div class="promo-detail-card">
            <div class="promo-detail-card-corner top-left"></div>
            <div class="promo-detail-card-corner top-right"></div>
            <div class="promo-detail-card-corner bottom-left"></div>
            <div class="promo-detail-card-corner bottom-right"></div>
    `;

    // Description
    if (description) {
        const formattedDesc = description.replace(/\\n/g, '<br>');
        html += `<p class="promo-detail-desc">${formattedDesc}</p>`;
    }

    // Info grid with SVG icons
    if (validDate || conditions) {
        html += '<div class="promo-detail-info-grid">';

        if (validDate) {
            html += `
                <div class="promo-detail-info-item">
                    <div class="promo-detail-info-icon">${DETAIL_ICONS.calendar}</div>
                    <div class="promo-detail-info-text">
                        <span class="promo-detail-info-label">Thời Gian Áp Dụng</span>
                        <div class="promo-detail-info-value">${validDate}</div>
                    </div>
                </div>
            `;
        }

        if (conditions) {
            html += `
                <div class="promo-detail-info-item">
                    <div class="promo-detail-info-icon">${DETAIL_ICONS.clipboard}</div>
                    <div class="promo-detail-info-text">
                        <span class="promo-detail-info-label">Điều Kiện Áp Dụng</span>
                        <div class="promo-detail-info-value">${conditions}</div>
                    </div>
                </div>
            `;
        }

        html += '</div>';
    }

    // CTA button
    html += `
            <div class="promo-detail-cta-wrap">
                <a href="index.html#contact" class="promo-detail-cta">
                    <span>Đặt Bàn Ngay</span>
                    ${DETAIL_ICONS.chevronRight}
                </a>
            </div>
        </div>
    `;

    html += '</div>'; // end .promo-detail-left

    // RIGHT: Poster image
    if (image) {
        html += `
            <div class="promo-detail-right">
                <div class="promo-detail-poster-wrap">
                    <img src="${image}" alt="${promo.alt || title}" class="promo-detail-poster">
                </div>
            </div>
        `;
    }

    html += '</div>'; // end .promo-detail-split

    container.innerHTML = html;
}

/**
 * Show error / not found state
 */
function showError(container, isNetworkError = false) {
    const icon = isNetworkError ? DETAIL_ICONS.alertTriangle : DETAIL_ICONS.search;

    container.innerHTML = `
        <div class="promo-detail-content" style="max-width:800px;width:90%;margin:0 auto;padding:40px 0 60px;">
            <div class="promo-detail-error">
                <div class="promo-detail-error-icon">${icon}</div>
                <h2 class="promo-detail-error-title">
                    ${isNetworkError ? 'Không thể tải dữ liệu' : 'Không tìm thấy khuyến mãi'}
                </h2>
                <p class="promo-detail-error-text">
                    ${isNetworkError
                        ? 'Vui lòng kiểm tra kết nối mạng và thử lại.'
                        : 'Chương trình khuyến mãi này không tồn tại hoặc đã kết thúc.'}
                </p>
                <a href="index.html#promotions" class="promo-detail-error-link">
                    ${DETAIL_ICONS.chevronLeft}
                    Quay lại trang Khuyến Mãi
                </a>
            </div>
        </div>
    `;
}
