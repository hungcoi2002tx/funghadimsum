/* ================================================
   FUNGHA DIMSUM - Data Renderer
   ================================================
   Renders dynamic content from Google Sheets data
   into the DOM containers.
   ================================================ */

/**
 * SVG icon templates for about features and menu
 */
const SVG_ICONS = {
    layers: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    heart: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    clock: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`
};

/* ============ ABOUT SECTION ============ */
function renderAbout(aboutInfo, aboutStats, aboutFeatures) {
    const container = document.getElementById('aboutDynamicContainer');
    if (!container) return;
    if (!aboutInfo || aboutInfo.length === 0) return;

    const info = aboutInfo[0]; // Single row
    let html = '';

    // Section Title
    html += `
        <div class="about-title-block">
            <div class="about-title-ornament left"></div>
            <h2 class="about-title">${info.title || 'Về Chúng Tôi'}</h2>
            <div class="about-title-ornament right"></div>
        </div>
    `;

    // Hero Image + Intro
    html += `
        <div class="about-hero-row">
            <div class="about-image-column">
                <div class="about-image-wrapper">
                    <img src="${info.image || 'images/home1.jpg'}" alt="${info.image_alt || 'FungHa Dimsum'}" class="about-image">
                </div>
            </div>
            <div class="about-intro-column">
                <h3 class="about-subtitle">${info.subtitle || 'Fungha Dimsum'}</h3>
                <p class="about-intro-text">${info.intro_text || ''}</p>
    `;

    // Stats
    if (aboutStats && aboutStats.length > 0) {
        html += '<div class="about-stats">';
        aboutStats.forEach((stat, i) => {
            if (i > 0) html += '<div class="about-stat-divider"></div>';
            html += `
                <div class="about-stat-item">
                    <span class="about-stat-number">${stat.number}</span>
                    <span class="about-stat-label">${stat.label}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    html += '</div></div>'; // close about-intro-column + about-hero-row

    // Feature Cards
    if (aboutFeatures && aboutFeatures.length > 0) {
        html += '<div class="about-features">';
        aboutFeatures.forEach(feature => {
            const iconSvg = SVG_ICONS[feature.icon] || SVG_ICONS.layers;
            html += `
                <div class="about-feature-card">
                    <div class="about-feature-icon">${iconSvg}</div>
                    <h4 class="about-feature-title">${feature.title}</h4>
                    <p class="about-feature-desc">${feature.description}</p>
                </div>
            `;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

/* ============ HERO SLIDES ============ */
function renderHeroSlides(slides) {
    const container = document.getElementById('heroSliderContainer');
    const dotsContainer = document.getElementById('heroDotsContainer');
    if (!container || !slides || slides.length === 0) return;

    // Clear loading skeleton
    container.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    slides.forEach((slide, i) => {
        // Create slide div
        const slideDiv = document.createElement('div');
        slideDiv.className = `hero-slide${i === 0 ? ' active' : ''}`;
        slideDiv.setAttribute('data-desktop', slide.desktop || '');
        slideDiv.setAttribute('data-mobile', slide.mobile || '');
        slideDiv.style.backgroundImage = `url('${slide.desktop || ''}')`;
        container.appendChild(slideDiv);

        // Create dot
        if (dotsContainer) {
            const dot = document.createElement('span');
            dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
            dot.setAttribute('data-index', i);
            dotsContainer.appendChild(dot);
        }
    });
}

/* ============ MENU ============ */
function renderMenu(menuItems) {
    const tabsContainer = document.getElementById('menuTabsContainer');
    const contentContainer = document.getElementById('menuContentContainer');
    if (!tabsContainer || !contentContainer || !menuItems || menuItems.length === 0) return;

    // Clear loading skeleton
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';

    // Group items by category
    const categories = [];
    const categoryMap = {};

    menuItems.forEach(item => {
        const catId = item.category;
        if (!categoryMap[catId]) {
            categoryMap[catId] = {
                id: catId,
                name: item.category_name || catId,
                icon: item.icon || 'images/banh_bao.svg',
                items: []
            };
            categories.push(categoryMap[catId]);
        }
        categoryMap[catId].items.push({
            name: item.item_name,
            price: item.price,
            image: item.image || 'images/banh_bao.svg'
        });
    });

    // Render tabs
    categories.forEach((cat, i) => {
        const li = document.createElement('li');
        li.className = `menu-tab${i === 0 ? ' active' : ''}`;
        li.setAttribute('data-target', cat.id);
        li.innerHTML = `
            <img src="${cat.icon}" alt="${cat.name}" class="tab-icon-img">
            <span class="tab-text">${cat.name}</span>
        `;
        tabsContainer.appendChild(li);
    });

    // Render panes
    categories.forEach((cat, i) => {
        const pane = document.createElement('div');
        pane.className = `menu-pane${i === 0 ? ' active' : ''}`;
        pane.id = cat.id;

        if (cat.items.length === 0) {
            pane.innerHTML = `<p class="menu-empty-message">Thực đơn ${cat.name} đang được cập nhật...</p>`;
        } else {
            const grid = document.createElement('div');
            grid.className = 'menu-grid';

            cat.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item';
                itemDiv.innerHTML = `
                    <div class="menu-item-img-wrap">
                        <img src="${item.image}" alt="${item.name}" class="menu-item-img" loading="lazy">
                    </div>
                    <h3 class="menu-item-name">${item.name}</h3>
                    <div class="menu-item-price">${item.price}</div>
                `;
                grid.appendChild(itemDiv);
            });

            pane.appendChild(grid);
        }

        contentContainer.appendChild(pane);
    });
}

/* ============ PROMOTIONS ============ */
function renderPromotions(promos) {
    const track = document.getElementById('promoTrack');
    const dotsContainer = document.getElementById('promoDots');
    if (!track || !promos || promos.length === 0) return;

    // Clear loading skeleton
    track.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    promos.forEach((promo, i) => {
        // Create promo card
        const card = document.createElement('div');
        card.className = 'promo-card';
        card.setAttribute('data-index', i);
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <div class="promo-card-inner">
                <div class="promo-card-glow"></div>
                <div class="promo-card-border"></div>
                <div class="promo-poster-wrap">
                    <img src="${promo.image}" alt="${promo.alt || 'Khuyến mãi'}" class="promo-poster" loading="lazy">
                </div>
                <a href="promotion-detail?index=${i}" class="promo-cta-btn">
                    <span class="promo-cta-text">Xem Chi Tiết</span>
                    <svg class="promo-cta-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </a>
            </div>
        `;
        // Click on card navigates to detail page
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the CTA link directly (it has its own href)
            if (e.target.closest('.promo-cta-btn')) return;
            window.location.href = `promotion-detail?index=${i}`;
        });
        track.appendChild(card);

        // Create dot
        if (dotsContainer) {
            const dot = document.createElement('span');
            dot.className = `promo-dot${i === 0 ? ' active' : ''}`;
            dot.setAttribute('data-slide', i);
            dotsContainer.appendChild(dot);
        }
    });
}

/* ============ BRANCHES (CONTACT) ============ */
function renderBranches(branches) {
    const container = document.getElementById('branchesContainer');
    if (!container || !branches || branches.length === 0) return;

    // Clear loading skeleton
    container.innerHTML = '';

    branches.forEach((branch, i) => {
        const card = document.createElement('div');
        card.className = `branch-card${i === 0 ? ' active' : ''}`;
        card.setAttribute('data-branch', branch.number || (i + 1));
        card.setAttribute('data-map', branch.map_embed || '');
        card.setAttribute('data-lat', branch.lat || '');
        card.setAttribute('data-lng', branch.lng || '');
        card.innerHTML = `
            <div class="branch-number">${branch.number || String(i + 1).padStart(2, '0')}</div>
            <div class="branch-info">
                <div class="branch-name">${branch.name}</div>
                <div class="branch-address">
                    <span class="branch-icon">📍</span>
                    ${branch.address}
                </div>
                <div class="branch-phone">
                    <span class="branch-icon">📱</span>
                    <a href="tel:${branch.phone_raw || branch.phone.replace(/\./g, '')}">${branch.phone}</a>
                </div>
            </div>
            <div class="branch-arrow">›</div>
        `;
        container.appendChild(card);
    });

    // Update map to first branch
    const firstBranch = branches[0];
    if (firstBranch) {
        const contactMap = document.getElementById('contact-map');
        const mapLabel = document.getElementById('map-branch-label');
        if (contactMap && firstBranch.map_embed) {
            contactMap.src = firstBranch.map_embed;
        }
        if (mapLabel) {
            const labelText = mapLabel.querySelector('.map-label-text');
            const labelLink = mapLabel.querySelector('.map-label-link');
            if (labelText) labelText.textContent = firstBranch.name;
            if (labelLink && firstBranch.lat && firstBranch.lng) {
                labelLink.href = `https://maps.google.com/?q=${firstBranch.lat},${firstBranch.lng}`;
            }
        }
    }
}

/* ============ LOADING SKELETONS ============ */
function showLoadingSkeletons() {
    // Hero skeleton
    const heroContainer = document.getElementById('heroSliderContainer');
    if (heroContainer && heroContainer.children.length === 0) {
        heroContainer.innerHTML = `<div class="hero-slide active" style="background: linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 100%);"></div>`;
    }

    // Menu skeleton
    const menuTabs = document.getElementById('menuTabsContainer');
    const menuContent = document.getElementById('menuContentContainer');
    if (menuTabs && menuTabs.children.length === 0) {
        menuTabs.innerHTML = `<li class="menu-tab active"><span class="tab-text" style="opacity:0.5">Đang tải...</span></li>`;
    }
    if (menuContent && menuContent.children.length === 0) {
        menuContent.innerHTML = `<div class="menu-pane active"><p class="menu-empty-message">Đang tải thực đơn...</p></div>`;
    }

    // Promo skeleton
    const promoTrack = document.getElementById('promoTrack');
    if (promoTrack && promoTrack.children.length === 0) {
        promoTrack.innerHTML = `<div class="promo-card" data-index="0"><div class="promo-card-inner" style="display:flex;align-items:center;justify-content:center;min-height:300px;"><p style="color:rgba(255,255,255,0.5);">Đang tải khuyến mãi...</p></div></div>`;
    }

    // Branches skeleton
    const branchesContainer = document.getElementById('branchesContainer');
    if (branchesContainer && branchesContainer.children.length === 0) {
        branchesContainer.innerHTML = `<div class="branch-card active" style="opacity:0.5;"><div class="branch-info"><div class="branch-name">Đang tải chi nhánh...</div></div></div>`;
    }
}

/* ============ HOTLINE (CONTACT SECTION) ============ */
function renderHotline(siteInfo) {
    const hotlineNumber = document.getElementById('hotlineNumber');
    if (!hotlineNumber || !siteInfo.hotline) return;

    hotlineNumber.textContent = siteInfo.hotline;
    hotlineNumber.href = `tel:${siteInfo.hotline_raw || siteInfo.hotline.replace(/\s/g, '')}`;
}

/* ============ FOOTER ============ */
function renderFooter(siteInfo) {
    if (!siteInfo) return;

    // Tagline
    const tagline = document.getElementById('footerTagline');
    if (tagline && siteInfo.tagline) tagline.textContent = siteInfo.tagline;

    // Hours
    const hours = document.getElementById('footerHours');
    if (hours && siteInfo.hours) hours.textContent = siteInfo.hours;

    // Phone
    const phone = document.getElementById('footerPhone');
    if (phone && siteInfo.hotline) {
        phone.textContent = siteInfo.hotline;
        phone.parentElement.href = `tel:${siteInfo.hotline_raw || siteInfo.hotline.replace(/\s/g, '')}`;
    }

    // Email
    const email = document.getElementById('footerEmail');
    if (email && siteInfo.email) {
        email.textContent = siteInfo.email;
        email.parentElement.href = `mailto:${siteInfo.email}`;
    }

    // Social links
    const socialMap = {
        footerFacebook: 'facebook',
        footerInstagram: 'instagram',
        footerZalo: 'zalo',
        footerTiktok: 'tiktok'
    };
    Object.entries(socialMap).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && siteInfo[key]) el.href = siteInfo[key];
    });

    // Copyright
    const copyright = document.getElementById('footerCopyright');
    if (copyright && siteInfo.copyright) copyright.textContent = siteInfo.copyright;
}

/* ============ MAIN INIT ============ */
async function initDynamicContent() {
    console.log('[Renderer] Starting dynamic content load...');

    // Show loading state
    showLoadingSkeletons();

    try {
        // Fetch all data from Google Sheets
        const data = await fetchAllSheetsData();

        // Render each section
        renderAbout(data.aboutInfo, data.aboutStats, data.aboutFeatures);
        renderHeroSlides(data.hero);
        renderMenu(data.menu);
        renderPromotions(data.promotions);
        renderBranches(data.branches);
        renderHotline(data.siteInfo);
        renderFooter(data.siteInfo);

        console.log('[Renderer] All sections rendered successfully.');

        // Dispatch event for main.js to initialize interactive features
        document.dispatchEvent(new CustomEvent('data-rendered', { detail: data }));

    } catch (error) {
        console.error('[Renderer] Failed to load data:', error);

        // Show error message in dynamic sections
        const errorMsg = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
        const containers = ['menuContentContainer', 'promoTrack', 'branchesContainer'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = `<p style="text-align:center; color: rgba(255,255,255,0.6); padding: 2rem;">${errorMsg}</p>`;
            }
        });
    }
}

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', initDynamicContent);
