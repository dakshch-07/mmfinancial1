const fs = require('fs');
const path = require('path');
const { CALCULATORS } = require('./calculator-data.js');
const {
  BASE_URL,
  OUT_DIR,
  getHeaderHTML,
  getTopBarAndBreadcrumbHTML,
  getFooterHTML,
  getOtherCalculatorsStripHTML,
  getDisclaimerHTML,
  getExplainerAndFaqHTML,
  getJsonLdSchema
} = require('./calculator-templates.js');
const { getWidgetHTML } = require('./widget-markup.js');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ── 1. GENERATE HUB PAGE (calculators/index.html) ─────────────────────────────
function generateHubPage() {
  const cardsHTML = CALCULATORS.map(c => `
    <a href="/calculators/${c.slug}" class="hub-card" data-category="${c.categorySlug}" aria-label="${c.name}">
        <div class="hub-card-header">
            <div class="hub-card-icon">${c.icon}</div>
            <div class="hub-card-meta">
                <span class="hub-card-cat">${c.category}</span>
                <h3 class="hub-card-title">${c.name}</h3>
            </div>
        </div>
        <p class="hub-card-desc">${c.intro.slice(0, 115)}...</p>
        <div class="hub-card-footer">
            ${c.badge ? `<span class="hub-card-badge">${c.badge}</span>` : '<span></span>'}
            <span class="hub-card-action">Calculate &rarr;</span>
        </div>
    </a>
  `).join('\n');

  const hubHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>18 Free Financial Calculators | MM Financial Services Consultant</title>
    <meta name="description" content="Calculate loan eligibility, EMI, SIP wealth compounding, FD/RD returns, PPF, SSY and life insurance with 18 free client-side calculators from Mukesh Tiwari.">
    <link rel="canonical" href="${BASE_URL}/calculators">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/style.css?v=2.3">
    <link rel="stylesheet" href="/calculators/calculators.css?v=2.3">
</head>
<body class="theme-light">
    ${getHeaderHTML('hub')}

    <main class="hub-main-content">
        <!-- TOP NAV BAR WITH BACK TO HOME BUTTON -->
        <div class="calc-top-nav-bar">
            <div class="calc-container">
                <div class="calc-top-nav-inner">
                    <a href="/" class="calc-back-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        <span>Back to Home</span>
                    </a>
                    <div class="calc-breadcrumb">
                        <a href="/">Home</a>
                        <span class="bc-sep">&rsaquo;</span>
                        <span class="bc-curr">All 18 Financial Calculators</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- HUB HERO -->
        <section class="hub-hero">
            <div class="calc-container">
                <div class="hub-hero-inner">
                    <span class="calc-hero-badge">All-in-One Financial Suite</span>
                    <h1 class="hub-hero-title">Smart Financial Calculators</h1>
                    <p class="hub-hero-subtitle">
                        Simulate borrowing limits, EMI repayment amortization, wealth compounding, and family protection needs instantly with 100% bank-accurate, client-side tools.
                    </p>
                </div>
            </div>
        </section>

        <!-- HUB CONTROLS & GRID -->
        <section class="hub-grid-section">
            <div class="calc-container">
                <div class="hub-controls-bar">
                    <!-- Category Chips -->
                    <div class="hub-filter-chips" role="tablist" aria-label="Calculator Categories">
                        <button type="button" class="hub-chip-btn active" data-category="all">All (18)</button>
                        <button type="button" class="hub-chip-btn" data-category="loans">Loans (11)</button>
                        <button type="button" class="hub-chip-btn" data-category="deposits">Deposits (3)</button>
                        <button type="button" class="hub-chip-btn" data-category="investments">Investments (3)</button>
                        <button type="button" class="hub-chip-btn" data-category="insurance">Insurance (1)</button>
                    </div>

                    <!-- Instant Search -->
                    <div class="hub-search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="hub-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="search" id="hubSearchInput" class="hub-search-input" placeholder="Search calculators (e.g. Home Loan, SIP, PPF)..." aria-label="Search financial calculators">
                    </div>
                </div>

                <!-- Cards Grid -->
                <div class="hub-cards-grid" id="hubCardsGrid">
                    ${cardsHTML}
                </div>
            </div>
        </section>

        <!-- ADVISORY BANNER -->
        <section class="calc-guide-section" style="padding-top: 20px;">
            <div class="calc-container">
                <div class="calc-guide-content">
                    <div class="calc-guide-body">
                        <h2>Personalized Financial Guidance by Mukesh Tiwari</h2>
                        <p>Calculators provide rapid benchmarks, but every family and business profile is unique. Mukesh Tiwari (Authorized Partner of NJ Wealth) provides personalized structuring across 30+ leading banks, NBFCs, and mutual fund houses.</p>
                        <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:20px;">
                            <a href="/#contact" class="btn btn-navy-full" style="display:inline-flex; width:auto; padding:12px 24px;">Request Free Callback &rarr;</a>
                            <a href="https://wa.me/919594736833?text=Hello%20Mukesh%20ji,%20I%20would%20like%20to%20discuss%20my%20financial%20planning." target="_blank" rel="noopener noreferrer" class="btn btn-wa-full" style="display:inline-flex; width:auto; padding:12px 24px;">Chat on WhatsApp &rarr;</a>
                        </div>
                    </div>
                    <div class="calc-guide-sidebar">
                        <div class="sidebar-advisor-box">
                            <div class="sidebar-avatar">MT</div>
                            <h4 class="sidebar-name">Mukesh Tiwari</h4>
                            <p class="sidebar-title">Authorized Partner &bull; NJ Wealth</p>
                            <p style="font-size:0.8rem; color:var(--color-charcoal-muted); margin-bottom:14px;">Direct advisor line for home loans, business funding & wealth portfolios.</p>
                            <a href="tel:+919594736833" class="sidebar-phone-btn">&#128222; Call 95947 36833</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    ${getFooterHTML()}

    <script src="/script.js?v=2.3"></script>
    <script src="/calculators/calculators.js?v=2.3"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), hubHTML, 'utf8');
  console.log('✓ Generated calculators/index.html (Hub)');
}

// ── 2. GENERATE ALL 18 INDIVIDUAL CALCULATOR PAGES ────────────────────────────
function generateCalculatorPages() {
  CALCULATORS.forEach(calc => {
    const pageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.metaTitle}</title>
    <meta name="description" content="${calc.metaDescription}">
    <link rel="canonical" href="${BASE_URL}/calculators/${calc.slug}">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/style.css?v=2.3">
    <link rel="stylesheet" href="/calculators/calculators.css?v=2.3">
    ${getJsonLdSchema(calc)}
</head>
<body class="theme-light">
    ${getHeaderHTML(calc.slug)}

    <main class="calc-page-main">
        <!-- TOP NAV BAR WITH BACK BUTTON & BREADCRUMB -->
        ${getTopBarAndBreadcrumbHTML(calc)}

        <!-- HERO / HEADER (COMPACT) -->
        <section class="calc-page-hero">
            <div class="calc-container">
                <div class="calc-hero-content">
                    ${calc.badge ? `<span class="calc-hero-badge">${calc.badge}</span>` : ''}
                    <h1 class="calc-hero-title">${calc.h1}</h1>
                    <p class="calc-hero-subtitle">${calc.intro}</p>
                </div>
            </div>
        </section>

        <!-- WIDGET CONTAINER -->
        <section class="calc-widget-section">
            <div class="calc-container">
                ${getWidgetHTML(calc)}
                ${getDisclaimerHTML(calc.disclaimerExtra)}
            </div>
        </section>

        <!-- OTHER CALCULATORS STRIP -->
        ${getOtherCalculatorsStripHTML(calc.id)}

        <!-- EDITORIAL GUIDE & FAQS -->
        ${getExplainerAndFaqHTML(calc)}
    </main>

    ${getFooterHTML()}

    <script src="/script.js?v=2.3"></script>
    <script src="/calculators/calculators.js?v=2.3"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(OUT_DIR, `${calc.slug}.html`), pageHTML, 'utf8');
    console.log(`✓ Generated calculators/${calc.slug}.html`);
  });
}

generateHubPage();
generateCalculatorPages();
console.log('Finished generating all 19 calculator pages successfully.');
