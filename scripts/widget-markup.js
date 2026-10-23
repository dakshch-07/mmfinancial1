/**
 * WIDGET MARKUP GENERATOR
 * Generates semantic, accessible HTML widgets for all 18 calculators.
 * MM Financial Services Consultant (Mukesh Tiwari)
 */

function getWidgetHTML(calc) {
  const type = calc.widgetType;

  if (type === 'eligibility') {
    const isPersonal = calc.id === 'personal-loan-eligibility-calculator';
    const defaultRate = calc.defaultRate || (isPersonal ? 11.0 : 8.75);
    const defaultTenure = calc.defaultTenure || (isPersonal ? 5 : 20);
    const maxTenure = calc.maxTenure || (isPersonal ? 7 : 30);

    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="eligibility" data-calc-id="${calc.id}">
        <!-- Level 1 Profile Tabs -->
        <div class="calc-tabs-bar" role="tablist">
            <button type="button" class="calc-tab-btn active" id="tabSalaried" role="tab" aria-selected="true" data-profile="salaried">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Salaried Professional</span>
            </button>
            <button type="button" class="calc-tab-btn" id="tabBusiness" role="tab" aria-selected="false" data-profile="business">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <span>Business / Self-Employed (ITR)</span>
            </button>
        </div>

        <div class="calc-widget-grid">
            <!-- Left: Inputs Card -->
            <div class="calc-card inputs-card">
                <!-- Salaried Inputs -->
                <div id="salariedFields" class="profile-fields active">
                    <div class="input-group">
                        <div class="input-header">
                            <label for="salSalaryInput">Net Monthly Salary (In-Hand)</label>
                            <span class="input-badge" id="salSalaryBadge">₹50,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="salSalaryInput" class="calc-input" value="50,000" inputmode="numeric" aria-label="Net Monthly Salary">
                        </div>
                        <input type="range" id="salSalarySlider" class="calc-slider" min="10000" max="1000000" step="1000" value="50000">
                        <div class="slider-limits"><span>₹10,000</span><span>₹10,00,000</span></div>
                    </div>

                    ${!isPersonal ? `
                    <div class="input-group">
                        <div class="input-header">
                            <label for="salBonusInput">Annual Performance Bonus</label>
                            <span class="input-badge" id="salBonusBadge">₹0</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="salBonusInput" class="calc-input" value="0" inputmode="numeric" aria-label="Annual Bonus">
                        </div>
                        <input type="range" id="salBonusSlider" class="calc-slider" min="0" max="2000000" step="5000" value="0">
                        <div class="slider-limits"><span>₹0</span><span>₹20,00,000 (50% counted)</span></div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="salRentInput">Monthly Rental Income</label>
                            <span class="input-badge" id="salRentBadge">₹0</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="salRentInput" class="calc-input" value="0" inputmode="numeric" aria-label="Monthly Rental Income">
                        </div>
                        <input type="range" id="salRentSlider" class="calc-slider" min="0" max="500000" step="1000" value="0">
                        <div class="slider-limits"><span>₹0</span><span>₹5,00,000 (50% counted)</span></div>
                    </div>
                    ` : ''}

                    <div class="input-group">
                        <div class="input-header">
                            <label for="salEmiInput">Existing Monthly EMIs / Obligations</label>
                            <span class="input-badge" id="salEmiBadge">₹0</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="salEmiInput" class="calc-input" value="0" inputmode="numeric" aria-label="Existing Monthly EMIs">
                        </div>
                        <input type="range" id="salEmiSlider" class="calc-slider" min="0" max="500000" step="500" value="0">
                        <div class="slider-limits"><span>₹0</span><span>₹5,00,000</span></div>
                    </div>
                </div>

                <!-- Business Inputs (2-Year ITR Banking Assessment) -->
                <div id="businessFields" class="profile-fields" style="display:none;">
                    <div class="input-group">
                        <div class="input-header">
                            <label for="bizProfitInput">Latest Year Net Profit (ITR Year 1 PAT)</label>
                            <span class="input-badge" id="bizProfitBadge">₹12,00,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="bizProfitInput" class="calc-input" value="12,00,000" inputmode="numeric" aria-label="Latest Year Net Profit">
                        </div>
                        <input type="range" id="bizProfitSlider" class="calc-slider" min="100000" max="20000000" step="25000" value="1200000">
                        <div class="slider-limits"><span>₹1 Lakh</span><span>₹2 Crore</span></div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="bizProfit2Input">Previous Year Net Profit (ITR Year 2 PAT)</label>
                            <span class="input-badge" id="bizProfit2Badge">₹10,00,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="bizProfit2Input" class="calc-input" value="10,00,000" inputmode="numeric" aria-label="Previous Year Net Profit">
                        </div>
                        <input type="range" id="bizProfit2Slider" class="calc-slider" min="100000" max="20000000" step="25000" value="1000000">
                        <div class="slider-limits"><span>₹1 Lakh</span><span>₹2 Crore</span></div>
                    </div>

                    <!-- 2-Year ITR Bank Assessment Strip -->
                    <div class="biz-calc-summary-card">
                        <div class="biz-summary-header">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mini-icon"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            <span>2-Year ITR Assessment (24 Months / 12 Months)</span>
                        </div>
                        <div class="biz-summary-grid">
                            <div class="biz-stat-item">
                                <span class="biz-stat-label">2-Yr Avg Annual Profit</span>
                                <span class="biz-stat-val" id="bizAvgAnnualProfit">₹11,00,000</span>
                            </div>
                            <div class="biz-stat-item">
                                <span class="biz-stat-label">Monthly Profit (24M)</span>
                                <span class="biz-stat-val" id="bizMonthlyProfit">₹91,667</span>
                            </div>
                            <div class="biz-stat-item highlight">
                                <span class="biz-stat-label">Total Monthly Cash Flow</span>
                                <span class="biz-stat-val" id="bizTotalMonthlyIncome">₹1,29,167</span>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="bizDepreciationInput">Annual Depreciation (Non-Cash Add-back)</label>
                            <span class="input-badge" id="bizDepreciationBadge">₹1,50,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="bizDepreciationInput" class="calc-input" value="1,50,000" inputmode="numeric" aria-label="Annual Depreciation">
                        </div>
                        <input type="range" id="bizDepreciationSlider" class="calc-slider" min="0" max="5000000" step="10000" value="150000">
                        <div class="slider-limits"><span>₹0</span><span>₹50 Lakh (100% added back)</span></div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="bizSalaryInput">Annual Partner / Director Remuneration</label>
                            <span class="input-badge" id="bizSalaryBadge">₹3,00,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="bizSalaryInput" class="calc-input" value="3,00,000" inputmode="numeric" aria-label="Partner Director Salary">
                        </div>
                        <input type="range" id="bizSalarySlider" class="calc-slider" min="0" max="5000000" step="10000" value="300000">
                        <div class="slider-limits"><span>₹0</span><span>₹50 Lakh (drawn from firm)</span></div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="bizRentInput">Monthly Rental Income</label>
                            <span class="input-badge" id="bizRentBadge">₹0</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="bizRentInput" class="calc-input" value="0" inputmode="numeric" aria-label="Monthly Rental Income">
                        </div>
                        <input type="range" id="bizRentSlider" class="calc-slider" min="0" max="500000" step="1000" value="0">
                        <div class="slider-limits"><span>₹0</span><span>₹5,00,000</span></div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="bizEmiInput">Existing Monthly Business/Personal EMIs</label>
                            <span class="input-badge" id="bizEmiBadge">₹0</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="bizEmiInput" class="calc-input" value="0" inputmode="numeric" aria-label="Existing Business EMIs">
                        </div>
                        <input type="range" id="bizEmiSlider" class="calc-slider" min="0" max="1000000" step="1000" value="0">
                        <div class="slider-limits"><span>₹0</span><span>₹10,00,000</span></div>
                    </div>
                </div>

                <!-- Common Rate & Tenure -->
                <div class="input-group">
                    <div class="input-header">
                        <label for="eligRateInput">Interest Rate (% p.a.)</label>
                        <span class="input-badge" id="eligRateBadge">${defaultRate}%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="eligRateInput" class="calc-input" value="${defaultRate}" inputmode="decimal" aria-label="Interest Rate">
                    </div>
                    <input type="range" id="eligRateSlider" class="calc-slider" min="6.0" max="24.0" step="0.05" value="${defaultRate}">
                    <div class="slider-limits"><span>6.0%</span><span>24.0%</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="eligTenureInput">Loan Tenure (Years)</label>
                        <span class="input-badge" id="eligTenureBadge">${defaultTenure} Years</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Yr</span>
                        <input type="text" id="eligTenureInput" class="calc-input" value="${defaultTenure}" inputmode="numeric" aria-label="Loan Tenure">
                    </div>
                    <input type="range" id="eligTenureSlider" class="calc-slider" min="1" max="${maxTenure}" step="1" value="${defaultTenure}">
                    <div class="slider-limits"><span>1 Year</span><span>${maxTenure} Years</span></div>
                </div>
            </div>

            <!-- Right: Results Card -->
            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Maximum Eligible Loan Amount</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="eligMaxLoan">0</span>
                    </div>
                    <span class="result-word-amount" id="eligMaxLoanWords">Calculating...</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Monthly EMI Capacity</span>
                        <span class="metric-val">₹<span id="eligEmiCapacity">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Estimated Monthly EMI</span>
                        <span class="metric-val">₹<span id="eligEstimatedEmi">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Applicable FOIR</span>
                        <span class="metric-val"><span id="eligFoirApplied">${isPersonal ? 65 : 60}</span>%</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total Repayment</span>
                        <span class="metric-val">₹<span id="eligTotalPayable">0</span></span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="eligWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Free Sanction Help &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'loan-emi') {
    const defaultAmount = calc.defaultAmount || 5000000;
    const minAmount = calc.minAmount || 100000;
    const maxAmount = calc.maxAmount || 100000000;
    const stepAmount = calc.stepAmount || 50000;
    const defaultRate = calc.defaultRate || 8.75;
    const minRate = calc.minRate || 6.0;
    const maxRate = calc.maxRate || 20.0;
    const defaultTenure = calc.defaultTenure || 20;
    const maxTenure = calc.maxTenure || 30;

    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="loan-emi" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <!-- Left: Inputs Card -->
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="emiAmountInput">Loan Amount Required</label>
                        <span class="input-badge" id="emiAmountBadge">₹${(defaultAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="emiAmountInput" class="calc-input" value="${(defaultAmount).toLocaleString('en-IN')}" inputmode="numeric" aria-label="Loan Amount">
                    </div>
                    <input type="range" id="emiAmountSlider" class="calc-slider" min="${minAmount}" max="${maxAmount}" step="${stepAmount}" value="${defaultAmount}">
                    <div class="slider-limits"><span>₹${(minAmount).toLocaleString('en-IN')}</span><span>₹${(maxAmount).toLocaleString('en-IN')}</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="emiRateInput">Interest Rate (% p.a.)</label>
                        <span class="input-badge" id="emiRateBadge">${defaultRate}%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="emiRateInput" class="calc-input" value="${defaultRate}" inputmode="decimal" aria-label="Interest Rate">
                    </div>
                    <input type="range" id="emiRateSlider" class="calc-slider" min="${minRate}" max="${maxRate}" step="${calc.stepRate || 0.05}" value="${defaultRate}">
                    <div class="slider-limits"><span>${minRate}%</span><span>${maxRate}%</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="emiTenureInput">Loan Tenure (Years)</label>
                        <span class="input-badge" id="emiTenureBadge">${defaultTenure} Years</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Yr</span>
                        <input type="text" id="emiTenureInput" class="calc-input" value="${defaultTenure}" inputmode="numeric" aria-label="Loan Tenure">
                    </div>
                    <input type="range" id="emiTenureSlider" class="calc-slider" min="1" max="${maxTenure}" step="1" value="${defaultTenure}">
                    <div class="slider-limits"><span>1 Year</span><span>${maxTenure} Years</span></div>
                </div>

                ${calc.hasPrepayment ? `
                <div class="prepay-toggle-box">
                    <button type="button" class="prepay-toggle-btn" id="prepayToggleBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        <span>Calculate Prepayment Savings (Optional)</span>
                    </button>
                    <div class="prepay-content" id="prepayContent" style="display:none; margin-top: 10px;">
                        <div class="input-group">
                            <label for="prepayAmountInput" style="font-size: 0.78rem; font-weight:700;">Part Prepayment Amount (₹)</label>
                            <input type="text" id="prepayAmountInput" class="calc-input" value="0" inputmode="numeric">
                        </div>
                        <div class="input-group" style="margin-bottom:0;">
                            <label for="prepayMonthInput" style="font-size: 0.78rem; font-weight:700;">Prepay After Month #</label>
                            <input type="number" id="prepayMonthInput" class="calc-input" value="12" min="1" max="360">
                        </div>
                        <div id="prepaySavingsNotice" class="prepay-notice" style="display:none;"></div>
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Right: Results Card -->
            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Monthly Loan EMI</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="emiResultVal">0</span>
                    </div>
                    <span class="result-word-amount" id="emiResultWords">Calculating...</span>
                </div>

                <!-- Donut Chart & Breakdown -->
                <div class="donut-section">
                    <svg class="donut-svg" viewBox="0 0 100 100" aria-hidden="true">
                        <circle class="donut-bg" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-primary" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-secondary" cx="50" cy="50" r="38"></circle>
                    </svg>
                    <div class="donut-legend">
                        <div class="legend-item">
                            <span class="legend-dot primary"></span>
                            <div>
                                <span class="legend-label">Principal Amount</span>
                                <strong class="legend-val">₹<span id="donutPrincipal">0</span></strong>
                            </div>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot secondary"></span>
                            <div>
                                <span class="legend-label">Total Interest</span>
                                <strong class="legend-val">₹<span id="donutInterest">0</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Total Interest</span>
                        <span class="metric-val">₹<span id="emiTotalInterest">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total Repayment</span>
                        <span class="metric-val">₹<span id="emiTotalPayable">0</span></span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="emiWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Apply for Loan &rarr;</a>
                </div>
            </div>
        </div>

        <!-- Amortization Schedule Table -->
        <div class="schedule-box">
            <div class="schedule-header">
                <div>
                    <h3 class="schedule-title">Year-by-Year Amortization Schedule</h3>
                    <p class="schedule-subtitle">Click any year row to view individual monthly principal and interest breakdowns.</p>
                </div>
                <button type="button" class="btn-outline-sm" id="btnDownloadCsv">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Download Schedule (CSV)</span>
                </button>
            </div>
            <div class="table-responsive">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Opening Balance</th>
                            <th>EMI Paid</th>
                            <th>Principal Paid</th>
                            <th>Interest Paid</th>
                            <th>Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody id="scheduleTableBody"></tbody>
                </table>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'comparison') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="comparison" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <!-- Left: Comparison Inputs -->
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="compPrincipalInput">Outstanding Loan Principal (₹)</label>
                        <span class="input-badge" id="compPrincipalBadge">₹50,00,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="compPrincipalInput" class="calc-input" value="50,00,000" inputmode="numeric">
                    </div>
                    <input type="range" id="compPrincipalSlider" class="calc-slider" min="500000" max="50000000" step="50000" value="5000000">
                </div>

                <div class="comp-dual-columns">
                    <!-- Current Loan -->
                    <div class="comp-col">
                        <h4 class="comp-col-title">Current Loan Offer</h4>
                        <div class="input-group">
                            <label for="compRate1Input" style="font-size:0.75rem; font-weight:700;">Rate (% p.a.)</label>
                            <input type="text" id="compRate1Input" class="calc-input" value="9.25" inputmode="decimal">
                        </div>
                        <div class="input-group">
                            <label for="compTenure1Input" style="font-size:0.75rem; font-weight:700;">Tenure (Years)</label>
                            <input type="text" id="compTenure1Input" class="calc-input" value="20" inputmode="numeric">
                        </div>
                    </div>
                    <!-- Proposed Loan -->
                    <div class="comp-col">
                        <h4 class="comp-col-title">Proposed New Offer</h4>
                        <div class="input-group">
                            <label for="compRate2Input" style="font-size:0.75rem; font-weight:700;">Rate (% p.a.)</label>
                            <input type="text" id="compRate2Input" class="calc-input" value="8.50" inputmode="decimal">
                        </div>
                        <div class="input-group">
                            <label for="compTenure2Input" style="font-size:0.75rem; font-weight:700;">New Tenure (Yrs)</label>
                            <input type="text" id="compTenure2Input" class="calc-input" value="20" inputmode="numeric">
                        </div>
                    </div>
                </div>

                <div class="input-group" style="margin-top:6px;">
                    <div class="input-header">
                        <label for="compFeesInput">Estimated Transfer Fees / Processing Charges (₹)</label>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="compFeesInput" class="calc-input" value="25,000" inputmode="numeric">
                    </div>
                </div>
            </div>

            <!-- Right: Savings Results Card -->
            <div class="calc-card result-card">
                <div class="result-highlight-box" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);">
                    <span class="result-label" style="color: #a3e635;">Net Interest Savings</span>
                    <div class="result-hero-amount" style="color: #ffffff;">
                        <span class="rupee-sign" style="color:#a3e635;">₹</span><span id="compNetSavings">0</span>
                    </div>
                    <span class="result-word-amount" id="compNetSavingsWords" style="color: #e2e8f0;">After deducting fees</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Current Monthly EMI</span>
                        <span class="metric-val">₹<span id="compEmi1">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">New Monthly EMI</span>
                        <span class="metric-val">₹<span id="compEmi2">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Monthly EMI Reduction</span>
                        <span class="metric-val" style="color:#059669;">₹<span id="compMonthlySavings">0</span>/mo</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Break-Even Period</span>
                        <span class="metric-val"><span id="compBreakEven">0</span> Months</span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="compWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Apply for Transfer &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'education-loan') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="education-loan" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="eduAmountInput">Total Course Loan Amount (₹)</label>
                        <span class="input-badge" id="eduAmountBadge">₹25,00,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="eduAmountInput" class="calc-input" value="25,00,000" inputmode="numeric">
                    </div>
                    <input type="range" id="eduAmountSlider" class="calc-slider" min="100000" max="15000000" step="50000" value="2500000">
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="eduRateInput">Interest Rate (% p.a.)</label>
                        <span class="input-badge" id="eduRateBadge">9.5%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="eduRateInput" class="calc-input" value="9.5" inputmode="decimal">
                    </div>
                    <input type="range" id="eduRateSlider" class="calc-slider" min="7.0" max="16.0" step="0.05" value="9.5">
                </div>

                <div class="input-group">
                    <label for="eduMoratoriumInput" style="font-size:0.78rem; font-weight:700;">Moratorium Grace Period (Months)</label>
                    <input type="number" id="eduMoratoriumInput" class="calc-input" value="24" min="6" max="60" step="6">
                </div>

                <div class="input-group">
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.78rem; font-weight:600;">
                        <input type="checkbox" id="eduSimpleInterestCheck" style="width:16px;height:16px;">
                        <span>Pay Simple Interest during studies (Avoid capitalization)</span>
                    </label>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="eduTenureInput">Repayment Tenure (Years)</label>
                        <span class="input-badge" id="eduTenureBadge">10 Years</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Yr</span>
                        <input type="text" id="eduTenureInput" class="calc-input" value="10" inputmode="numeric">
                    </div>
                    <input type="range" id="eduTenureSlider" class="calc-slider" min="1" max="15" step="1" value="10">
                </div>

                <div class="input-group">
                    <label for="eduTaxSlabSelect" style="font-size:0.78rem; font-weight:700;">Income Tax Slab (Section 80E)</label>
                    <select id="eduTaxSlabSelect" class="calc-input">
                        <option value="0.30">30% Highest Tax Bracket</option>
                        <option value="0.20">20% Middle Tax Bracket</option>
                        <option value="0.10">10% Lower Bracket</option>
                        <option value="0">0% (No Tax Deduction)</option>
                    </select>
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Monthly Repayment EMI</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="eduEmiVal">0</span>
                    </div>
                    <span class="result-word-amount" id="eduEmiWords">Starting after moratorium</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Principal at Repayment</span>
                        <span class="metric-val">₹<span id="eduRepayPrincipal">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total Interest Paid</span>
                        <span class="metric-val">₹<span id="eduTotalInterest">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Sec 80E Annual Tax Saved</span>
                        <span class="metric-val" style="color:#059669;">₹<span id="eduAnnualTaxSaved">0</span>/yr</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total 8-Yr Tax Saved</span>
                        <span class="metric-val" style="color:#059669;">₹<span id="eduTotalTaxSaved">0</span></span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="eduWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Get Student Loan Help &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'gold-loan') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="gold-loan" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="goldGramsInput">Total Gold Weight (Net Grams)</label>
                        <span class="input-badge" id="goldGramsBadge">50 Grams</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Gm</span>
                        <input type="text" id="goldGramsInput" class="calc-input" value="50" inputmode="numeric">
                    </div>
                    <input type="range" id="goldGramsSlider" class="calc-slider" min="5" max="500" step="1" value="50">
                    <div class="slider-limits"><span>5g</span><span>500g</span></div>
                </div>

                <div class="input-group">
                    <label for="goldPuritySelect" style="font-size:0.78rem; font-weight:700;">Gold Purity (Carat)</label>
                    <select id="goldPuritySelect" class="calc-input">
                        <option value="0.916" selected>22 Karat (91.6% Hallmark Standard)</option>
                        <option value="0.999">24 Karat (99.9% Pure Bullion/Coins)</option>
                        <option value="0.833">20 Karat (83.3%)</option>
                        <option value="0.750">18 Karat (75.0% Diamond Jewelry)</option>
                    </select>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="goldPriceInput">Current 24K Gold Rate per Gram (₹)</label>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="goldPriceInput" class="calc-input" value="7,000" inputmode="numeric">
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="goldLtvSlider">Loan-to-Value (LTV % — RBI Max 75%)</label>
                        <span class="input-badge" id="goldLtvBadge">75%</span>
                    </div>
                    <input type="range" id="goldLtvSlider" class="calc-slider" min="50" max="75" step="1" value="75">
                    <div class="slider-limits"><span>50%</span><span>75% (RBI Limit)</span></div>
                </div>

                <div class="input-group">
                    <label for="goldRateInput" style="font-size:0.78rem; font-weight:700;">Interest Rate (% p.a.)</label>
                    <input type="text" id="goldRateInput" class="calc-input" value="9.0" inputmode="decimal">
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Maximum Eligible Gold Loan</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="goldMaxLoan">0</span>
                    </div>
                    <span class="result-word-amount" id="goldMaxLoanWords">Calculating...</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Market Value of Gold</span>
                        <span class="metric-val">₹<span id="goldMarketVal">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Pure Gold Content</span>
                        <span class="metric-val"><span id="goldPureWeight">0</span> Grams</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Monthly Interest Payout</span>
                        <span class="metric-val">₹<span id="goldMonthlyInterest">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Annual Interest Cost</span>
                        <span class="metric-val">₹<span id="goldAnnualInterest">0</span></span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="goldWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Apply for Gold Loan &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'lap') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="lap" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="lapPropValueInput">Property Market Value (₹)</label>
                        <span class="input-badge" id="lapPropValueBadge">₹1,00,00,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="lapPropValueInput" class="calc-input" value="1,00,00,000" inputmode="numeric">
                    </div>
                    <input type="range" id="lapPropValueSlider" class="calc-slider" min="2000000" max="100000000" step="100000" value="10000000">
                    <div class="slider-limits"><span>₹20 Lakh</span><span>₹10 Crore</span></div>
                </div>

                <div class="input-group">
                    <label for="lapPropTypeSelect" style="font-size:0.78rem; font-weight:700;">Property Category & Maximum LTV</label>
                    <select id="lapPropTypeSelect" class="calc-input">
                        <option value="0.65" selected>Residential Property (Up to 65% LTV)</option>
                        <option value="0.55">Commercial Property (Up to 55% LTV)</option>
                        <option value="0.50">Industrial / Plot (Up to 50% LTV)</option>
                    </select>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="lapIncomeInput">Net Monthly Income / Profit (₹)</label>
                        <span class="input-badge" id="lapIncomeBadge">₹1,50,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="lapIncomeInput" class="calc-input" value="1,50,000" inputmode="numeric">
                    </div>
                    <input type="range" id="lapIncomeSlider" class="calc-slider" min="30000" max="2000000" step="5000" value="150000">
                </div>

                <div class="input-group">
                    <label for="lapEmiInput" style="font-size:0.78rem; font-weight:700;">Existing Monthly EMI Obligations (₹)</label>
                    <input type="text" id="lapEmiInput" class="calc-input" value="0" inputmode="numeric">
                </div>

                <div class="input-group">
                    <label for="lapRateInput" style="font-size:0.78rem; font-weight:700;">Interest Rate (% p.a.)</label>
                    <input type="text" id="lapRateInput" class="calc-input" value="9.5" inputmode="decimal">
                </div>

                <div class="input-group">
                    <label for="lapTenureInput" style="font-size:0.78rem; font-weight:700;">Tenure (Years, max 20)</label>
                    <input type="number" id="lapTenureInput" class="calc-input" value="15" min="1" max="20">
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Binding LAP Sanction Eligibility</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="lapMaxLoan">0</span>
                    </div>
                    <span class="result-word-amount" id="lapMaxLoanWords">Calculating...</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Collateral Limit (LTV)</span>
                        <span class="metric-val">₹<span id="lapCollateralLimit">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Income Limit (FOIR)</span>
                        <span class="metric-val">₹<span id="lapIncomeLimit">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Monthly LAP EMI</span>
                        <span class="metric-val">₹<span id="lapMonthlyEmi">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total Repayment</span>
                        <span class="metric-val">₹<span id="lapTotalPayable">0</span></span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="lapWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Apply for LAP Loan &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'fd') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="fd" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="fdAmountInput">Total Deposit Amount (₹)</label>
                        <span class="input-badge" id="fdAmountBadge">₹1,00,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="fdAmountInput" class="calc-input" value="1,00,000" inputmode="numeric">
                    </div>
                    <input type="range" id="fdAmountSlider" class="calc-slider" min="10000" max="10000000" step="5000" value="100000">
                    <div class="slider-limits"><span>₹10,00,000</span><span>₹1 Crore</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="fdRateInput">Annual Interest Rate (% p.a.)</label>
                        <span class="input-badge" id="fdRateBadge">7.0%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="fdRateInput" class="calc-input" value="7.0" inputmode="decimal">
                    </div>
                    <input type="range" id="fdRateSlider" class="calc-slider" min="3.0" max="12.0" step="0.05" value="7.0">
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="fdTenureInput">Tenure (Years)</label>
                        <span class="input-badge" id="fdTenureBadge">5 Years</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Yr</span>
                        <input type="text" id="fdTenureInput" class="calc-input" value="5" inputmode="numeric">
                    </div>
                    <input type="range" id="fdTenureSlider" class="calc-slider" min="1" max="10" step="1" value="5">
                </div>

                <div class="input-group">
                    <label for="fdCompoundingSelect" style="font-size:0.78rem; font-weight:700;">Compounding Frequency</label>
                    <select id="fdCompoundingSelect" class="calc-input">
                        <option value="4" selected>Quarterly (Standard Bank Practice)</option>
                        <option value="12">Monthly</option>
                        <option value="2">Half-Yearly</option>
                        <option value="1">Annually</option>
                    </select>
                </div>

                <div class="input-group">
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.78rem; font-weight:600;">
                        <input type="checkbox" id="fdSeniorCheck" style="width:16px;height:16px;">
                        <span>Senior Citizen (+0.50% Extra Interest Rate)</span>
                    </label>
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Total Maturity Amount</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="fdMaturityVal">0</span>
                    </div>
                    <span class="result-word-amount" id="fdMaturityWords">Calculating...</span>
                </div>

                <div class="donut-section">
                    <svg class="donut-svg" viewBox="0 0 100 100" aria-hidden="true">
                        <circle class="donut-bg" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-primary" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-secondary" cx="50" cy="50" r="38"></circle>
                    </svg>
                    <div class="donut-legend">
                        <div class="legend-item">
                            <span class="legend-dot primary"></span>
                            <div>
                                <span class="legend-label">Invested Principal</span>
                                <strong class="legend-val">₹<span id="fdInvestedVal">0</span></strong>
                            </div>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot secondary"></span>
                            <div>
                                <span class="legend-label">Total Interest Earned</span>
                                <strong class="legend-val">₹<span id="fdInterestVal">0</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="fdWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Invest in Fixed Deposits &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'rd') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="rd" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="rdDepositInput">Monthly Deposit Amount (₹)</label>
                        <span class="input-badge" id="rdDepositBadge">₹5,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="rdDepositInput" class="calc-input" value="5,000" inputmode="numeric">
                    </div>
                    <input type="range" id="rdDepositSlider" class="calc-slider" min="500" max="200000" step="500" value="5000">
                    <div class="slider-limits"><span>₹500</span><span>₹2,00,000</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="rdRateInput">Annual Interest Rate (% p.a.)</label>
                        <span class="input-badge" id="rdRateBadge">6.5%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="rdRateInput" class="calc-input" value="6.5" inputmode="decimal">
                    </div>
                    <input type="range" id="rdRateSlider" class="calc-slider" min="3.0" max="10.0" step="0.05" value="6.5">
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="rdMonthsInput">Tenure in Months (Quarterly Compounding)</label>
                        <span class="input-badge" id="rdMonthsBadge">24 Months</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Mo</span>
                        <input type="text" id="rdMonthsInput" class="calc-input" value="24" inputmode="numeric">
                    </div>
                    <input type="range" id="rdMonthsSlider" class="calc-slider" min="6" max="120" step="3" value="24">
                    <div class="slider-limits"><span>6 Mo (0.5 Yr)</span><span>120 Mo (10 Yrs)</span></div>
                </div>

                <div class="input-group">
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.78rem; font-weight:600;">
                        <input type="checkbox" id="rdSeniorCheck" style="width:16px;height:16px;">
                        <span>Senior Citizen (+0.50% Extra Interest Rate)</span>
                    </label>
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Total RD Maturity Value</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="rdMaturityVal">0</span>
                    </div>
                    <span class="result-word-amount" id="rdMaturityWords">Quarterly Compounded</span>
                </div>

                <div class="donut-section">
                    <svg class="donut-svg" viewBox="0 0 100 100" aria-hidden="true">
                        <circle class="donut-bg" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-primary" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-secondary" cx="50" cy="50" r="38"></circle>
                    </svg>
                    <div class="donut-legend">
                        <div class="legend-item">
                            <span class="legend-dot primary"></span>
                            <div>
                                <span class="legend-label">Total Deposited</span>
                                <strong class="legend-val">₹<span id="rdDepositedVal">0</span></strong>
                            </div>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot secondary"></span>
                            <div>
                                <span class="legend-label">Total Interest</span>
                                <strong class="legend-val">₹<span id="rdInterestVal">0</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="rdWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Start Savings Plan &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'dream-rd') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="dream-rd" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="dreamTargetInput">Target Goal Corpus (₹)</label>
                        <span class="input-badge" id="dreamTargetBadge">₹5,00,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="dreamTargetInput" class="calc-input" value="5,00,000" inputmode="numeric">
                    </div>
                    <input type="range" id="dreamTargetSlider" class="calc-slider" min="50000" max="10000000" step="10000" value="500000">
                    <div class="slider-limits"><span>₹50,000</span><span>₹1 Crore</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="dreamYearsInput">Target Time Horizon (Years)</label>
                        <span class="input-badge" id="dreamYearsBadge">3 Years</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Yr</span>
                        <input type="text" id="dreamYearsInput" class="calc-input" value="3" inputmode="numeric">
                    </div>
                    <input type="range" id="dreamYearsSlider" class="calc-slider" min="1" max="10" step="1" value="3">
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="dreamRateInput">Expected Annual Rate (% p.a.)</label>
                        <span class="input-badge" id="dreamRateBadge">6.5%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="dreamRateInput" class="calc-input" value="6.5" inputmode="decimal">
                    </div>
                    <input type="range" id="dreamRateSlider" class="calc-slider" min="4.0" max="10.0" step="0.1" value="6.5">
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Required Monthly Savings</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="dreamMonthlyVal">0</span>
                    </div>
                    <span class="result-word-amount" id="dreamMonthlyWords">Every month to reach target</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Target Corpus</span>
                        <span class="metric-val">₹<span id="dreamTargetDisplay">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total You Deposit</span>
                        <span class="metric-val">₹<span id="dreamTotalDeposited">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Bank Interest Earned</span>
                        <span class="metric-val" style="color:#059669;">₹<span id="dreamInterestEarned">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total Installments</span>
                        <span class="metric-val"><span id="dreamTotalInstallments">36</span> Months</span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="dreamWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Plan My Goal &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'sip') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="sip" data-calc-id="${calc.id}">
        <!-- SIP / Lumpsum Toggle -->
        <div class="calc-tabs-bar" role="tablist">
            <button type="button" class="calc-tab-btn active" id="tabSip" role="tab" aria-selected="true" data-mode="sip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>
                <span>Systematic Investment Plan (SIP)</span>
            </button>
            <button type="button" class="calc-tab-btn" id="tabLumpsum" role="tab" aria-selected="false" data-mode="lumpsum">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span>One-Time Lumpsum Investment</span>
            </button>
        </div>

        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <!-- SIP Input Group -->
                <div id="sipModeInputs">
                    <div class="input-group">
                        <div class="input-header">
                            <label for="sipAmountInput">Monthly SIP Amount (₹)</label>
                            <span class="input-badge" id="sipAmountBadge">₹10,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="sipAmountInput" class="calc-input" value="10,000" inputmode="numeric">
                        </div>
                        <input type="range" id="sipAmountSlider" class="calc-slider" min="500" max="500000" step="500" value="10000">
                        <div class="slider-limits"><span>₹500</span><span>₹5,00,000</span></div>
                    </div>

                    <div class="input-group">
                        <div class="input-header">
                            <label for="sipStepUpSlider">Annual Step-Up (% Increase / Year)</label>
                            <span class="input-badge" id="sipStepUpBadge">0%</span>
                        </div>
                        <input type="range" id="sipStepUpSlider" class="calc-slider" min="0" max="25" step="1" value="0">
                        <div class="slider-limits"><span>0% (Constant)</span><span>25% Yearly</span></div>
                    </div>
                </div>

                <!-- Lumpsum Input Group -->
                <div id="lumpsumModeInputs" style="display:none;">
                    <div class="input-group">
                        <div class="input-header">
                            <label for="lumpAmountInput">Total One-Time Lumpsum (₹)</label>
                            <span class="input-badge" id="lumpAmountBadge">₹1,00,000</span>
                        </div>
                        <div class="input-with-symbol">
                            <span class="currency-prefix">₹</span>
                            <input type="text" id="lumpAmountInput" class="calc-input" value="1,00,000" inputmode="numeric">
                        </div>
                        <input type="range" id="lumpAmountSlider" class="calc-slider" min="5000" max="10000000" step="5000" value="100000">
                        <div class="slider-limits"><span>₹5,000</span><span>₹1 Crore</span></div>
                    </div>
                </div>

                <!-- Common Rate & Years -->
                <div class="input-group">
                    <div class="input-header">
                        <label for="sipRateInput">Expected Annual Return Rate (% p.a.)</label>
                        <span class="input-badge" id="sipRateBadge">12.0%</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="sipRateInput" class="calc-input" value="12.0" inputmode="decimal">
                    </div>
                    <input type="range" id="sipRateSlider" class="calc-slider" min="6.0" max="30.0" step="0.5" value="12.0">
                    <div class="slider-limits"><span>6.0%</span><span>30.0%</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="sipYearsInput">Investment Time Horizon (Years)</label>
                        <span class="input-badge" id="sipYearsBadge">10 Years</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Yr</span>
                        <input type="text" id="sipYearsInput" class="calc-input" value="10" inputmode="numeric">
                    </div>
                    <input type="range" id="sipYearsSlider" class="calc-slider" min="1" max="40" step="1" value="10">
                    <div class="slider-limits"><span>1 Year</span><span>40 Years</span></div>
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Expected Total Wealth Corpus</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="sipMaturityVal">0</span>
                    </div>
                    <span class="result-word-amount" id="sipMaturityWords">Compounded Growth</span>
                </div>

                <div class="donut-section">
                    <svg class="donut-svg" viewBox="0 0 100 100" aria-hidden="true">
                        <circle class="donut-bg" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-primary" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-secondary" cx="50" cy="50" r="38"></circle>
                    </svg>
                    <div class="donut-legend">
                        <div class="legend-item">
                            <span class="legend-dot primary"></span>
                            <div>
                                <span class="legend-label">Total Amount Invested</span>
                                <strong class="legend-val">₹<span id="sipInvestedVal">0</span></strong>
                            </div>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot secondary"></span>
                            <div>
                                <span class="legend-label">Estimated Wealth Gain</span>
                                <strong class="legend-val">₹<span id="sipReturnsVal">0</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="sipWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Start SIP with NJ Wealth &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'ppf') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="ppf" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="ppfDepositInput">Yearly Contribution (₹ — Section 80C)</label>
                        <span class="input-badge" id="ppfDepositBadge">₹1,50,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="ppfDepositInput" class="calc-input" value="1,50,000" inputmode="numeric">
                    </div>
                    <input type="range" id="ppfDepositSlider" class="calc-slider" min="500" max="150000" step="500" value="150000">
                    <div class="slider-limits"><span>₹500 Min</span><span>₹1,50,000 Max (80C Limit)</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="ppfYearsSelect" style="font-size:0.78rem; font-weight:700;">PPF Duration (15-Year Mandatory Lock-in)</label>
                    </div>
                    <select id="ppfYearsSelect" class="calc-input">
                        <option value="15" selected>15 Years (Standard Maturity)</option>
                        <option value="20">20 Years (1 Extension Block of 5 Yrs)</option>
                        <option value="25">25 Years (2 Extension Blocks)</option>
                        <option value="30">30 Years (3 Extension Blocks)</option>
                    </select>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="ppfRateInput">Government Sovereign Rate (% p.a.)</label>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="ppfRateInput" class="calc-input" value="7.1" inputmode="decimal">
                    </div>
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">100% Tax-Free Maturity Corpus (EEE)</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="ppfMaturityVal">0</span>
                    </div>
                    <span class="result-word-amount" id="ppfMaturityWords">Sovereign Guarantee</span>
                </div>

                <div class="donut-section">
                    <svg class="donut-svg" viewBox="0 0 100 100" aria-hidden="true">
                        <circle class="donut-bg" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-primary" cx="50" cy="50" r="38"></circle>
                        <circle class="donut-slice-secondary" cx="50" cy="50" r="38"></circle>
                    </svg>
                    <div class="donut-legend">
                        <div class="legend-item">
                            <span class="legend-dot primary"></span>
                            <div>
                                <span class="legend-label">Total Invested</span>
                                <strong class="legend-val">₹<span id="ppfInvestedVal">0</span></strong>
                            </div>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot secondary"></span>
                            <div>
                                <span class="legend-label">Tax-Free Interest</span>
                                <strong class="legend-val">₹<span id="ppfInterestVal">0</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="ppfWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Tax-Free Wealth Advice &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'ssy') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="ssy" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <div class="input-header">
                        <label for="ssyDepositInput">Yearly Contribution (₹ — 15 Years Deposit)</label>
                        <span class="input-badge" id="ssyDepositBadge">₹1,50,000</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">₹</span>
                        <input type="text" id="ssyDepositInput" class="calc-input" value="1,50,000" inputmode="numeric">
                    </div>
                    <input type="range" id="ssyDepositSlider" class="calc-slider" min="250" max="150000" step="250" value="150000">
                    <div class="slider-limits"><span>₹250 Min</span><span>₹1,50,000 Max</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="ssyAgeInput">Girl Child Current Age (0 to 10 Years)</label>
                        <span class="input-badge" id="ssyAgeBadge">1 Year</span>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">Age</span>
                        <input type="text" id="ssyAgeInput" class="calc-input" value="1" inputmode="numeric">
                    </div>
                    <input type="range" id="ssyAgeSlider" class="calc-slider" min="0" max="10" step="1" value="1">
                    <div class="slider-limits"><span>0 (Newborn)</span><span>10 Years</span></div>
                </div>

                <div class="input-group">
                    <div class="input-header">
                        <label for="ssyRateInput">Government Sovereign Rate (% p.a.)</label>
                    </div>
                    <div class="input-with-symbol">
                        <span class="currency-prefix">%</span>
                        <input type="text" id="ssyRateInput" class="calc-input" value="8.2" inputmode="decimal">
                    </div>
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Tax-Free Maturity Corpus at Age 21</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="ssyMaturityVal">0</span>
                    </div>
                    <span class="result-word-amount" id="ssyMaturityWords">Govt Backed EEE</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Total Invested (15 Yrs)</span>
                        <span class="metric-val">₹<span id="ssyInvestedVal">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Total Interest (21 Yrs)</span>
                        <span class="metric-val" style="color:#059669;">₹<span id="ssyInterestVal">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Maturity Age</span>
                        <span class="metric-val">Age 21</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Tax Exemption</span>
                        <span class="metric-val">100% EEE</span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="ssyWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Child Future Planning &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  if (type === 'life-insurance') {
    return `
    <div class="calc-widget" id="calcWidget" data-widget-type="life-insurance" data-calc-id="${calc.id}">
        <div class="calc-widget-grid">
            <div class="calc-card inputs-card">
                <div class="input-group">
                    <label for="insExpenseInput" style="font-size:0.78rem; font-weight:700;">Family's Annual Living Expenses (₹)</label>
                    <input type="text" id="insExpenseInput" class="calc-input" value="6,00,000" inputmode="numeric">
                </div>

                <div class="input-group">
                    <label for="insYearsInput" style="font-size:0.78rem; font-weight:700;">Years of Family Financial Dependency</label>
                    <input type="number" id="insYearsInput" class="calc-input" value="20" min="5" max="40">
                </div>

                <div class="input-group">
                    <label for="insDebtsInput" style="font-size:0.78rem; font-weight:700;">Total Outstanding Debts & Loans to Clear (₹)</label>
                    <input type="text" id="insDebtsInput" class="calc-input" value="40,00,000" inputmode="numeric">
                </div>

                <div class="input-group">
                    <label for="insGoalsInput" style="font-size:0.78rem; font-weight:700;">Future Goals (Children's Education & Marriage) (₹)</label>
                    <input type="text" id="insGoalsInput" class="calc-input" value="30,00,000" inputmode="numeric">
                </div>

                <div class="input-group">
                    <label for="insAssetsInput" style="font-size:0.78rem; font-weight:700;">Less: Existing Savings, FDs & Mutual Funds (₹)</label>
                    <input type="text" id="insAssetsInput" class="calc-input" value="15,00,000" inputmode="numeric">
                </div>
            </div>

            <div class="calc-card result-card">
                <div class="result-highlight-box">
                    <span class="result-label">Recommended Term Life Insurance Cover</span>
                    <div class="result-hero-amount">
                        <span class="rupee-sign">₹</span><span id="insCoverVal">0</span>
                    </div>
                    <span class="result-word-amount" id="insCoverWords">Human Life Value (HLV)</span>
                </div>

                <div class="result-metrics-grid">
                    <div class="metric-box">
                        <span class="metric-title">Living Expense Pool</span>
                        <span class="metric-val">₹<span id="insExpensePool">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Debts + Milestone Goals</span>
                        <span class="metric-val">₹<span id="insDebtsGoals">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Less Current Assets</span>
                        <span class="metric-val" style="color:#059669;">- ₹<span id="insCurrentAssets">0</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-title">Suggested Term</span>
                        <span class="metric-val">Up to Age 65</span>
                    </div>
                </div>

                <div class="result-cta-group">
                    <a href="https://wa.me/919594736833" id="insWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn btn-wa-full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                        <span>Share on WhatsApp</span>
                    </a>
                    <a href="/#contact" class="btn btn-navy-full">Get Term Cover Advice &rarr;</a>
                </div>
            </div>
        </div>
    </div>
    `;
  }

  return '<div>Calculator widget coming soon</div>';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getWidgetHTML };
}
