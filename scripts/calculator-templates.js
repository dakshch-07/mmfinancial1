const fs = require('fs');
const path = require('path');
const { CALCULATORS } = require('./calculator-data.js');

const BASE_URL = 'https://mm-financial-demo.vercel.app';
const OUT_DIR = path.join(__dirname, '..', 'calculators');

// Shared Header & Navigation HTML — Exactly matching index.html
function getHeaderHTML(activeSlug = '') {
  return `
    <!-- 1. NAVBAR (Identical to Home Page) -->
    <header class="site-header" id="header">
        <div class="nav-container">
            <a href="/" class="brand-logo" aria-label="MM Financial Services Consultant Home">
                <div class="monogram-seal">
                    <span class="seal-inner">MM</span>
                </div>
                <div class="brand-text">
                    <span class="brand-name">MM FINANCIAL SERVICES</span>
                    <span class="brand-sub">CONSULTANT</span>
                </div>
            </a>

            <nav class="main-nav" id="mainNav" aria-label="Primary Navigation">
                <ul class="nav-links">
                    <li><a href="/" class="nav-link">Home</a></li>
                    <li><a href="/#about" class="nav-link">About</a></li>
                    <li><a href="/loans" class="nav-link">Loans</a></li>
                    <li><a href="/mutual-funds" class="nav-link">Mutual Funds</a></li>
                    <li><a href="/insurance" class="nav-link">Insurance</a></li>
                    <li><a href="/calculators" class="nav-link active">Calculators</a></li>
                    <li><a href="/#how-it-works" class="nav-link">How It Works</a></li>
                    <li><a href="/#why-us" class="nav-link">Why Us</a></li>
                    <li><a href="/#faq" class="nav-link">FAQ</a></li>
                    <li><a href="/#contact" class="nav-link">Contact</a></li>
                </ul>
            </nav>

            <div class="nav-actions">
                <a href="tel:+919594736833" class="nav-phone" title="Call Mukesh Tiwari directly">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span class="phone-digits">95947 36833</span>
                </a>
                <a href="/#contact" class="btn btn-brick-sm">Get Free Consultation</a>
                <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation menu" aria-expanded="false">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </button>
            </div>
        </div>
    </header>

    <!-- 2. TRUST TICKER BAR (Infinite Marquee) -->
    <div class="top-ticker-bar" role="region" aria-label="Official announcements and trust notices">
        <div class="ticker-inner">
            <div class="ticker-content">
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> <strong>Your Goals. Our Guidance. A Better Financial Future.</strong></span>
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> <strong>MM Financial Services Consultant</strong> &mdash; 18 Free Financial Calculators</span>
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> Direct Advisor Access: Call <strong>9594736833</strong> &bull; <em>mmfsc09@gmail.com</em></span>
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> <strong>Loans &bull; Mutual Funds &bull; Insurance</strong> &mdash; Mukesh Tiwari</span>
            </div>
            <div class="ticker-content" aria-hidden="true">
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> <strong>Your Goals. Our Guidance. A Better Financial Future.</strong></span>
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> <strong>MM Financial Services Consultant</strong> &mdash; 18 Free Financial Calculators</span>
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> Direct Advisor Access: Call <strong>9594736833</strong> &bull; <em>mmfsc09@gmail.com</em></span>
                <span class="ticker-item"><span class="ticker-bullet">&#9670;</span> <strong>Loans &bull; Mutual Funds &bull; Insurance</strong> &mdash; Mukesh Tiwari</span>
            </div>
        </div>
    </div>

    <!-- MOBILE DRAWER -->
    <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
        <div class="drawer-header">
            <div class="monogram-seal mini"><span class="seal-inner">MM</span></div>
            <span class="drawer-title">MM Financial Services</span>
            <button class="drawer-close" id="drawerClose" aria-label="Close menu">&times;</button>
        </div>
        <div class="drawer-body">
            <ul class="drawer-links">
                <li><a href="/" class="drawer-link">Home</a></li>
                <li><a href="/#about" class="drawer-link">About Mukesh Tiwari</a></li>
                <li><a href="/loans" class="drawer-link">Loans &amp; Financing</a></li>
                <li><a href="/mutual-funds" class="drawer-link">Mutual Funds &amp; SIP</a></li>
                <li><a href="/insurance" class="drawer-link">Insurance Solutions</a></li>
                <li><a href="/calculators" class="drawer-link active">All 18 Calculators</a></li>
                <li><a href="/#how-it-works" class="drawer-link">How It Works</a></li>
                <li><a href="/#why-us" class="drawer-link">Why Choose Us</a></li>
                <li><a href="/#faq" class="drawer-link">FAQ</a></li>
                <li><a href="/#contact" class="drawer-link">Contact Mukesh Tiwari</a></li>
            </ul>
        </div>
        <div class="drawer-footer">
            <p class="drawer-advisor">Advisor: <strong>Mukesh Tiwari</strong></p>
            <a href="tel:+919594736833" class="btn btn-navy-full" style="padding:10px; font-size:0.85rem;">Call 95947 36833</a>
        </div>
    </div>
    <div class="drawer-backdrop" id="drawerBackdrop"></div>
  `;
}

// Top Bar with Back Button & Breadcrumbs for Individual Calculator Pages
function getTopBarAndBreadcrumbHTML(calc) {
  return `
    <div class="calc-top-nav-bar">
        <div class="calc-container">
            <div class="calc-top-nav-inner">
                <a href="/calculators" class="calc-back-btn" title="Return to calculators hub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    <span>Back to All 18 Calculators</span>
                </a>
                <nav class="calc-breadcrumb" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span class="bc-sep">&rsaquo;</span>
                    <a href="/calculators">Calculators</a>
                    <span class="bc-sep">&rsaquo;</span>
                    <span class="bc-curr">${calc.name}</span>
                </nav>
            </div>
        </div>
    </div>
  `;
}

// Shared Footer HTML — Matching index.html compact design
function getFooterHTML() {
  return `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-top-grid">
                <!-- Col 1: Brand Info -->
                <div class="footer-brand-col">
                    <div class="footer-logo-wrap">
                        <div class="monogram-seal mini"><span class="seal-inner">MM</span></div>
                        <div class="footer-brand-text">
                            <span class="footer-brand-name">MM FINANCIAL SERVICES</span>
                            <span class="footer-brand-sub">CONSULTANT</span>
                        </div>
                    </div>
                    <p class="footer-advisor">Advisor: <strong>Mukesh Tiwari</strong></p>
                    <p class="footer-tagline">&ldquo;Your Goals. Our Guidance. A Better Financial Future.&rdquo;</p>
                    <p class="footer-mission" style="font-size: 0.74rem; color: var(--color-gold-light); line-height: 1.35; margin: 4px 0 8px;">
                        <strong>Our Mission:</strong> To help individuals and businesses make smarter financial decisions through reliable guidance and suitable financial solutions.
                    </p>
                    <div class="footer-nj-badge">
                        <span class="nj-shield">&#9873;</span>
                        <span>Certified Financial Advisory &bull; Mumbai</span>
                    </div>
                </div>

                <!-- Col 2: Services -->
                <div class="footer-links-col">
                    <h4 class="footer-heading">Our Services</h4>
                    <ul class="footer-links-list">
                        <li><a href="/loans" class="footer-link">Loans &amp; Financing</a></li>
                        <li><a href="/mutual-funds" class="footer-link">Mutual Funds &amp; SIP (NJ Wealth)</a></li>
                        <li><a href="/insurance" class="footer-link">Insurance Solutions</a></li>
                    </ul>
                </div>

                <!-- Col 3: Popular Calculators -->
                <div class="footer-links-col">
                    <h4 class="footer-heading">Popular Calculators</h4>
                    <ul class="footer-links-list">
                        <li><a href="/calculators/home-loan-emi-calculator" class="footer-link">Home Loan EMI Calculator</a></li>
                        <li><a href="/calculators/home-loan-eligibility-calculator" class="footer-link">Home Loan Eligibility</a></li>
                        <li><a href="/calculators/sip-calculator" class="footer-link">SIP &amp; Lumpsum Calculator</a></li>
                        <li><a href="/calculators/fd-calculator" class="footer-link">Fixed Deposit (FD) Calculator</a></li>
                        <li><a href="/calculators/ppf-calculator" class="footer-link">PPF Calculator</a></li>
                        <li><a href="/calculators/loan-against-property-calculator" class="footer-link">LAP Calculator</a></li>
                        <li><a href="/calculators" class="footer-link"><strong>View All 18 Calculators &rarr;</strong></a></li>
                    </ul>
                </div>

                <!-- Col 4: Direct Contact -->
                <div class="footer-links-col">
                    <h4 class="footer-heading">Direct Contact</h4>
                    <div class="footer-contact-items">
                        <p class="footer-contact-p"><strong>Advisor:</strong> Mukesh Tiwari</p>
                        <p class="footer-contact-p"><strong>Phone:</strong> <a href="tel:+919594736833">95947 36833</a></p>
                        <p class="footer-contact-p"><strong>WhatsApp:</strong> <a href="https://wa.me/919594736833" target="_blank" rel="noopener noreferrer">95947 36833</a></p>
                        <p class="footer-contact-p"><strong>Email:</strong> <a href="mailto:mmfsc09@gmail.com">mmfsc09@gmail.com</a></p>
                        <p class="footer-contact-p"><strong>Location:</strong> Mumbai, Maharashtra, India</p>
                    </div>
                </div>
            </div>

            <!-- Disclaimer Bar -->
            <div class="footer-disclaimer-box">
                <div class="disclaimer-header">
                    <svg class="disclaimer-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="8"/></svg>
                    <strong>Statutory Regulatory Disclaimers &amp; Information:</strong>
                </div>
                <p class="disclaimer-text" style="color: var(--color-gold-light); font-weight: 600; margin-bottom: 6px;">
                    Investment in mutual funds is subject to market risks. Please read all scheme-related documents carefully. Loan approval and insurance coverage are subject to the respective provider's terms and conditions.
                </p>
                <p class="disclaimer-text">
                    <strong>MM Financial Services Consultant</strong> (Mukesh Tiwari) provides financial consultancy across loans, mutual funds, and insurance. Mutual fund distribution is facilitated through the NJ Wealth partner network. All loan sanctions, interest rates, terms, and processing times are determined solely by lending banks/NBFCs based on underwriting criteria.
                </p>
            </div>

            <div class="footer-bottom-bar">
                <p class="copyright-text">&copy; 2026 MM Financial Services Consultant. All Rights Reserved.</p>
                <a href="#header" class="back-to-top" aria-label="Back to top">
                    <span>Back to Top</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
                </a>
            </div>
        </div>
    </footer>

    <!-- FLOATING WHATSAPP -->
    <a href="https://wa.me/919594736833?text=Hello%20Mukesh%20ji,%20I%20visited%20your%20website%20and%20would%20like%20to%20consult%20regarding%20financial%20services." 
       class="floating-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <div class="wa-floating-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.182 8.182 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.64 4.2 3.7.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.3z"/>
            </svg>
        </div>
        <span class="floating-wa-label">Talk on WhatsApp</span>
    </a>
  `;
}

// "Other Calculators" Strip Generator
function getOtherCalculatorsStripHTML(currentId) {
  const others = CALCULATORS.filter(c => c.id !== currentId).slice(0, 6);
  const cardsHTML = others.map(c => `
    <a href="/calculators/${c.slug}" class="other-calc-card">
        <div class="other-calc-icon">${c.icon}</div>
        <div class="other-calc-info">
            <span class="other-calc-cat">${c.category}</span>
            <h4 class="other-calc-title">${c.name}</h4>
        </div>
        <span class="other-calc-arrow">&rarr;</span>
    </a>
  `).join('');

  return `
    <section class="other-calcs-section" id="othercalculators">
        <div class="calc-container">
            <div class="other-calcs-header">
                <div>
                    <h3 class="other-calcs-title">Explore Other Financial Calculators</h3>
                    <p class="other-calcs-desc">Instant, accurate financial tools to plan every aspect of your wealth and loans.</p>
                </div>
                <a href="/calculators" class="btn-outline-back">View All 18 Calculators &rarr;</a>
            </div>
            <div class="other-calcs-grid">
                ${cardsHTML}
            </div>
        </div>
    </section>
  `;
}

// Universal Disclaimer Builder
function getDisclaimerHTML(extraText = '') {
  return `
    <div class="calc-disclaimer-box" role="note" aria-label="Disclaimer">
        <div class="calc-disclaimer-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Regulatory Notice &amp; Statutory Disclaimer</span>
        </div>
        <p>This calculator provides an indicative estimate only. It is not an offer, sanction, approval or financial advice. Actual loan sanction, rates, eligibility, and returns depend on lending banks, AMCs, credit evaluation, and prevailing regulatory guidelines. MM Financial Services Consultant acts as an authorized partner/advisor and is not a lender.</p>
        ${extraText ? `<p style="margin-top: 4px; font-weight: 600; color: var(--color-navy);">${extraText}</p>` : ''}
    </div>
  `;
}

// Explainer & FAQ Section Builder
function getExplainerAndFaqHTML(calc) {
  const faqItems = calc.faqs.map((f, idx) => `
    <div class="faq-card">
        <button type="button" class="faq-question-btn" aria-expanded="false" id="faqBtn_${idx}">
            <span>${f.q}</span>
            <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer-body" id="faqAns_${idx}">
            <p>${f.a}</p>
        </div>
    </div>
  `).join('');

  return `
    <!-- EDITORIAL EXPLAINER GUIDE SECTION -->
    <section class="calc-guide-section">
        <div class="calc-container">
            <div class="calc-guide-header">
                <span class="calc-hero-badge">Comprehensive Guide</span>
                <h2 class="calc-guide-title">How Does the ${calc.name} Work?</h2>
                <div class="calc-title-divider"></div>
            </div>

            <div class="calc-guide-content">
                <div class="calc-guide-body">
                    <p>Financial decisions should never be based on guesswork. Whether taking a home loan, investing via SIP, or planning an insurance safety net, precision in calculations saves substantial money over time. The <strong>${calc.name}</strong> from <strong>MM Financial Services Consultant</strong> empowers you to simulate real-world financial scenarios in real time.</p>
                    
                    <h3>Key Highlights of This Tool</h3>
                    <ul>
                        <li><strong>100% Client-Side Calculations:</strong> Runs instantly in your browser with zero latency and zero data tracking.</li>
                        <li><strong>Official Financial Formulas:</strong> Matches standard Indian banking reducing balance and quarterly compounding norms.</li>
                        <li><strong>Transparent Breakdowns:</strong> View the exact math, principal vs interest splits, and year-by-year schedules.</li>
                        <li><strong>Direct Guidance:</strong> Direct consultation access to Mukesh Tiwari${calc.categorySlug === 'investments' ? ' (NJ Wealth Authorized Partner)' : ''} for professional financial advisory.</li>
                    </ul>

                    <h3>Tips to Maximize Your Advantage</h3>
                    <p>Keep your existing obligations within 40-50% of your net monthly income to ensure optimal loan terms. For wealth accumulation, starting early and stepping up your contributions annually by even 10% drastically multiplies your long-term maturity corpus through compounding.</p>
                </div>

                <div class="calc-guide-sidebar">
                    <div class="sidebar-advisor-box">
                        <div class="sidebar-avatar">MT</div>
                        <h4 class="sidebar-name">Mukesh Tiwari</h4>
                        <p class="sidebar-title">${calc.categorySlug === 'investments' ? 'NJ Wealth Authorized Partner<br>' : 'Financial Consultant<br>'}MM Financial Services Consultant</p>
                        <p style="font-size: 0.8rem; color: var(--color-charcoal-muted); margin-bottom: 16px;">
                            Need tailored guidance for your loan sanction or mutual fund portfolio? Connect directly with zero middleman runaround.
                        </p>
                        <a href="tel:+919594736833" class="sidebar-phone-btn">&#128222; Call 95947 36833</a>
                        <a href="https://wa.me/919594736833?text=Hello%20Mukesh%20ji,%20I%20used%20the%20${encodeURIComponent(calc.name)}%20and%20want%20to%20consult." target="_blank" rel="noopener noreferrer" class="sidebar-wa-btn">&#128172; Chat on WhatsApp</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ ACCORDION SECTION -->
    <section class="calc-faq-section">
        <div class="calc-container">
            <h2 class="calc-faq-title">Frequently Asked Questions</h2>
            <div class="faq-list">
                ${faqItems}
            </div>
        </div>
    </section>
  `;
}

// JSON-LD Schemas Builder
function getJsonLdSchema(calc) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": calc.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Calculators", "item": `${BASE_URL}/calculators` },
      { "@type": "ListItem", "position": 3, "name": calc.name, "item": `${BASE_URL}/calculators/${calc.slug}` }
    ]
  };

  return `
    <script type="application/ld+json">
    ${JSON.stringify(faqSchema, null, 2)}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
    </script>
  `;
}

module.exports = {
  BASE_URL,
  OUT_DIR,
  getHeaderHTML,
  getTopBarAndBreadcrumbHTML,
  getFooterHTML,
  getOtherCalculatorsStripHTML,
  getDisclaimerHTML,
  getExplainerAndFaqHTML,
  getJsonLdSchema
};
