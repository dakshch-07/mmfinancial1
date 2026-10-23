const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Replace old calculator sections
const startMarker = '        <!-- 9. EMI / SIP CALCULATOR SECTION -->';
const endMarker = '        </section><!-- /#loan-eligibility -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const previewStrip = `        <!-- 9. FINANCIAL CALCULATORS PREVIEW STRIP -->
        <section class="calc-strip-section" id="calculators">
            <div class="container">
                <div class="section-heading text-center">
                    <span class="section-badge">18 Free Interactive Tools</span>
                    <h2 class="section-title">Smart Financial Calculators</h2>
                    <div class="title-divider-gold"></div>
                    <p class="section-lead">
                        Simulate borrowing capacity, EMI repayment schedules, wealth compounding, and deposits instantly with 100% bank-accurate client-side calculators.
                    </p>
                </div>

                <div class="calc-strip-grid">
                    <!-- Card 1: Home Loan EMI -->
                    <a href="/calculators/home-loan-emi-calculator" class="calc-strip-card" aria-label="Home Loan EMI Calculator">
                        <div class="calc-strip-icon-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        </div>
                        <div class="calc-strip-content">
                            <span class="calc-strip-badge">Most Popular Loan Tool</span>
                            <h3 class="calc-strip-title">Home Loan EMI Calculator</h3>
                            <p class="calc-strip-desc">Calculate exact monthly EMIs, total interest, and prepayment savings with full amortization schedules.</p>
                            <span class="calc-strip-btn">Calculate EMI &rarr;</span>
                        </div>
                    </a>

                    <!-- Card 2: Home Loan Eligibility -->
                    <a href="/calculators/home-loan-eligibility-calculator" class="calc-strip-card" aria-label="Home Loan Eligibility">
                        <div class="calc-strip-icon-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        </div>
                        <div class="calc-strip-content">
                            <span class="calc-strip-badge">Salaried &amp; Business</span>
                            <h3 class="calc-strip-title">Home Loan Eligibility</h3>
                            <p class="calc-strip-desc">Check your maximum borrowing power based on net salary, bonus, rental income, or business ITR profit under FOIR norms.</p>
                            <span class="calc-strip-btn">Check Eligibility &rarr;</span>
                        </div>
                    </a>

                    <!-- Card 3: SIP Calculator -->
                    <a href="/calculators/sip-calculator" class="calc-strip-card" aria-label="Mutual Fund SIP & Lumpsum Calculator">
                        <div class="calc-strip-icon-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                        </div>
                        <div class="calc-strip-content">
                            <span class="calc-strip-badge">NJ Wealth Partner</span>
                            <h3 class="calc-strip-title">Mutual Fund SIP &amp; Lumpsum</h3>
                            <p class="calc-strip-desc">Project your long-term wealth compounding through systematic investments (SIP), step-up increments, or lumpsum allocations.</p>
                            <span class="calc-strip-btn">Calculate SIP &rarr;</span>
                        </div>
                    </a>

                    <!-- Card 4: Fixed Deposit Calculator -->
                    <a href="/calculators/fd-calculator" class="calc-strip-card" aria-label="Fixed Deposit FD Calculator">
                        <div class="calc-strip-icon-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        </div>
                        <div class="calc-strip-content">
                            <span class="calc-strip-badge">Guaranteed Return</span>
                            <h3 class="calc-strip-title">Fixed Deposit (FD) Calculator</h3>
                            <p class="calc-strip-desc">Calculate exact maturity proceeds and interest earnings across quarterly compounding and senior citizen rates.</p>
                            <span class="calc-strip-btn">Calculate FD &rarr;</span>
                        </div>
                    </a>
                </div>

                <div class="calc-strip-footer-action text-center">
                    <a href="/calculators" class="btn btn-brick btn-lg">
                        <span>Explore All 18 Calculators</span>
                        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                    <p class="calc-strip-subtext">
                        Loans &bull; Fixed Deposits &bull; Recurring Deposits &bull; Mutual Funds &bull; PPF &bull; Sukanya Samriddhi &bull; Life Insurance
                    </p>
                </div>
            </div>
        </section>`;

content = content.slice(0, startIndex) + previewStrip + content.slice(endIndex + endMarker.length);

// 2. Replace Footer links
const oldFooterLinks = `                        <li><a href="#calculator" class="footer-link">EMI &amp; SIP Calculator</a></li>
                        <li><a href="#loan-eligibility" class="footer-link">Loan Calculator</a></li>`;

const newFooterLinks = `                        <li><a href="/calculators" class="footer-link"><strong>Financial Calculators Hub (18)</strong></a></li>
                        <li><a href="/calculators/home-loan-emi-calculator" class="footer-link">Home Loan EMI Calculator</a></li>
                        <li><a href="/calculators/home-loan-eligibility-calculator" class="footer-link">Home Loan Eligibility</a></li>
                        <li><a href="/calculators/sip-calculator" class="footer-link">SIP &amp; Lumpsum Calculator</a></li>`;

content = content.replace(oldFooterLinks, newFooterLinks);

// 3. Remove script tag for loan-calculator.js
const oldScriptTag = `    <!-- Loan Eligibility Calculator -->
    <script src="loan-calculator.js"></script>`;
content = content.replace(oldScriptTag, '');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('✓ Successfully updated index.html with new 4-card preview strip and cleaned up obsolete calculator markup/scripts.');
