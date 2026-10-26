/**
 * FINANCIAL CALCULATORS HUB & SUITE — calculators.js
 * MM Financial Services Consultant (Mukesh Tiwari)
 * 100% Client-side Vanilla JS engines for all 18 calculators.
 */

const CONFIG = {
  whatsappNumber: "919594736833",   // Official WhatsApp contact
  phone: "+919594736833",
  defaults: {
    homeLoan:     { rate: 8.75, tenure: 20, maxTenure: 30, maxAmount: 100000000 },
    personalLoan: { rate: 11,   tenure: 5,  maxTenure: 7,  maxAmount: 5000000 },
    carLoan:      { rate: 9,    tenure: 5,  maxTenure: 8,  maxAmount: 10000000 },
    twoWheeler:   { rate: 11,   tenure: 3,  maxTenure: 5,  maxAmount: 1000000 },
    educationLoan:{ rate: 9.5,  tenure: 10, maxTenure: 15, maxAmount: 15000000 },
    goldLoan:     { rate: 9,    tenure: 1,  maxTenure: 3,  ltv: 0.75, goldRatePerGram: 7000 },
    lap:          { rate: 9.5,  tenure: 15, maxTenure: 20, ltv: 0.65 },
    fd:           { rate: 7, maxYears: 10 },
    rd:           { rate: 6.5, maxYears: 10 },
    sip:          { returnRate: 12, maxYears: 40 },
    ppf:          { rate: 7.1, minYearly: 500, maxYearly: 150000, years: 15 },
    ssy:          { rate: 8.2, minYearly: 250, maxYearly: 150000, depositYears: 15, maturityYears: 21 },
    foir: {
      bonusFactor: 0.5,
      rentFactor: 0.5,
      homeLoanFoir: 0.60,
      lapFoir: 0.60,
      personalLoanFoir: 0.65,
      businessFoir: 0.60
    }
  }
};

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Universal Formatting Helpers ───────────────────────────────────────── */
  function fmtINR(val) {
    if (!isFinite(val) || isNaN(val)) return '0';
    return Math.round(val).toLocaleString('en-IN');
  }

  function parseNumber(val) {
    if (typeof val === 'number') return isFinite(val) ? val : 0;
    const clean = String(val || '').replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isFinite(num) && num >= 0 ? num : 0;
  }

  function wordFormINR(val) {
    if (!isFinite(val) || val <= 0) return '0 Lakh';
    if (val >= 1e7) {
      const cr = val / 1e7;
      return cr.toFixed(2).replace(/\.?0+$/, '') + ' Crore';
    }
    if (val >= 1e5) {
      const lk = val / 1e5;
      return lk.toFixed(2).replace(/\.?0+$/, '') + ' Lakh';
    }
    if (val >= 1e3) {
      const th = val / 1e3;
      return th.toFixed(1).replace(/\.?0+$/, '') + ' Thousand';
    }
    return '₹' + fmtINR(val);
  }

  function animateNumber(element, target, duration = 300) {
    if (!element) return;
    if (prefersReducedMotion) {
      element.textContent = fmtINR(target);
      return;
    }
    const start = parseNumber(element.textContent);
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      element.textContent = fmtINR(start + (target - start) * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    slider.style.setProperty('--slider-fill', pct.toFixed(2) + '%');
  }

  /* ── Input Binding (Auto-select on focus & leading zero stripping) ──────── */
  function bindSync(inputEl, sliderEl, min, max, step, onChange, isFloat = false) {
    if (!inputEl || !sliderEl) return;

    sliderEl.min = min;
    sliderEl.max = max;
    sliderEl.step = step;

    inputEl.addEventListener('focus', function () {
      setTimeout(() => {
        try { this.select(); } catch (e) {}
      }, 10);
    });

    inputEl.addEventListener('click', function () {
      if (this.value === '0' || parseNumber(this.value) === 0) {
        setTimeout(() => {
          try { this.select(); } catch (e) {}
        }, 10);
      }
    });

    sliderEl.addEventListener('input', () => {
      inputEl.value = isFloat ? parseFloat(sliderEl.value).toFixed(2) : fmtINR(sliderEl.value);
      updateSliderFill(sliderEl);
      if (onChange) onChange();
    });

    inputEl.addEventListener('input', () => {
      if (!isFloat) {
        let raw = inputEl.value.replace(/[^0-9]/g, '');
        if (raw.length > 1 && raw.startsWith('0')) {
          raw = raw.replace(/^0+/, '');
          if (raw === '') raw = '0';
        }
        if (inputEl.value !== raw) {
          inputEl.value = raw;
        }
      }
      const val = isFloat ? (parseFloat(inputEl.value) || 0) : parseNumber(inputEl.value);
      const curMin = parseFloat(sliderEl.min);
      const curMax = parseFloat(sliderEl.max);
      sliderEl.value = Math.max(curMin, Math.min(curMax, val));
      updateSliderFill(sliderEl);
      if (onChange) onChange();
    });

    inputEl.addEventListener('blur', () => {
      const curMin = parseFloat(sliderEl.min);
      const curMax = parseFloat(sliderEl.max);
      let val = isFloat ? (parseFloat(inputEl.value) || curMin) : parseNumber(inputEl.value);
      val = Math.max(curMin, Math.min(curMax, val));
      inputEl.value = isFloat ? val.toFixed(2) : fmtINR(val);
      sliderEl.value = val;
      updateSliderFill(sliderEl);
      if (onChange) onChange();
    });

    updateSliderFill(sliderEl);
  }

  /* ── Core Mathematical Formulas ─────────────────────────────────────────── */
  function calculateEmi(P, annualRate, tenureYears, tenureMonths) {
    if (P <= 0) return { emi: 0, totalPayable: 0, totalInterest: 0 };
    const r = (annualRate / 12) / 100;
    const n = (typeof tenureMonths === 'number' && tenureMonths > 0)
      ? tenureMonths
      : (tenureYears * 12);
    if (n <= 0) return { emi: 0, totalPayable: 0, totalInterest: 0 };
    if (r === 0) {
      const emi = P / n;
      return { emi, totalPayable: P, totalInterest: 0 };
    }
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    return { emi, totalPayable, totalInterest };
  }

  function calculateFdMaturity(P, annualRate, years, months = 0, compounding = 4) {
    const t = years + (months / 12);
    const r = annualRate / 100;
    if (r === 0 || t === 0) return { maturity: P, interest: 0 };
    const maturity = P * Math.pow(1 + (r / compounding), compounding * t);
    return { maturity, interest: maturity - P };
  }

  function calculateRdMaturity(monthlyDeposit, annualRate, months) {
    const r = annualRate / 100;
    if (r === 0 || months <= 0) return { maturity: monthlyDeposit * months, interest: 0, deposited: monthlyDeposit * months };
    let maturity = 0;
    for (let k = 1; k <= months; k++) {
      maturity += monthlyDeposit * Math.pow(1 + r / 4, (4 * k) / 12);
    }
    const deposited = monthlyDeposit * months;
    return { maturity, interest: maturity - deposited, deposited };
  }

  function calculateSipMaturity(monthlyDeposit, annualReturn, years, stepUpPct = 0) {
    const i = (annualReturn / 12) / 100;
    const totalMonths = years * 12;
    let invested = 0;
    let maturity = 0;
    let currentMonthly = monthlyDeposit;

    if (stepUpPct > 0) {
      for (let y = 1; y <= years; y++) {
        for (let m = 1; m <= 12; m++) {
          const monthsRemaining = totalMonths - ((y - 1) * 12 + m) + 1;
          invested += currentMonthly;
          maturity += currentMonthly * Math.pow(1 + i, monthsRemaining);
        }
        currentMonthly += currentMonthly * (stepUpPct / 100);
      }
    } else {
      invested = monthlyDeposit * totalMonths;
      if (i === 0) {
        maturity = invested;
      } else {
        maturity = monthlyDeposit * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
      }
    }
    return { invested, maturity, returns: maturity - invested };
  }

  function calculateLumpsumMaturity(P, annualReturn, years) {
    const r = annualReturn / 100;
    const maturity = P * Math.pow(1 + r, years);
    return { invested: P, maturity, returns: maturity - P };
  }

  /* ── SVG Donut Generator ────────────────────────────────────────────────── */
  function updateDonut(svgEl, val1, val2) {
    if (!svgEl) return;
    const total = val1 + val2;
    if (total <= 0) return;
    const circ = 2 * Math.PI * 38; // ≈ 238.76
    const pct1 = Math.max(0, Math.min(1, val1 / total));
    const slice1 = pct1 * circ;

    const sliceEl1 = svgEl.querySelector('.donut-slice-primary');
    const sliceEl2 = svgEl.querySelector('.donut-slice-secondary');
    if (sliceEl1) {
      sliceEl1.style.strokeDasharray = `${slice1} ${circ}`;
      sliceEl1.style.strokeDashoffset = '0';
    }
    if (sliceEl2) {
      sliceEl2.style.strokeDasharray = `${circ - slice1} ${circ}`;
      sliceEl2.style.strokeDashoffset = `-${slice1}`;
    }
  }

  /* ── Amortization Table & CSV Download Helper ──────────────────────────── */
  function buildAmortizationSchedule(P, annualRate, tenureYears, tenureMonths) {
    const r = (annualRate / 12) / 100;
    const totalMonths = (typeof tenureMonths === 'number' && tenureMonths > 0)
      ? tenureMonths
      : (tenureYears * 12);
    const emiRes = calculateEmi(P, annualRate, tenureYears, totalMonths);
    const emi = emiRes.emi;

    let balance = P;
    const schedule = [];
    let yearlyRecord = null;

    for (let m = 1; m <= totalMonths; m++) {
      const year = Math.ceil(m / 12);
      if (m % 12 === 1 || !yearlyRecord || yearlyRecord.year !== year) {
        yearlyRecord = {
          year,
          openingBalance: balance,
          emiPaid: 0,
          principalPaid: 0,
          interestPaid: 0,
          closingBalance: 0,
          months: []
        };
        schedule.push(yearlyRecord);
      }

      const interest = balance * r;
      const principal = Math.min(balance, emi - interest);
      const opening = balance;
      balance = Math.max(0, balance - principal);

      yearlyRecord.emiPaid += emi;
      yearlyRecord.principalPaid += principal;
      yearlyRecord.interestPaid += interest;
      yearlyRecord.closingBalance = balance;

      yearlyRecord.months.push({
        month: m,
        openingBalance: opening,
        emi,
        principal,
        interest,
        closingBalance: balance
      });
    }
    return schedule;
  }

  function renderAmortizationTable(tableBodyEl, schedule, viewMode = 'years') {
    if (!tableBodyEl) return;
    tableBodyEl.innerHTML = '';

    const schedBox = tableBodyEl.closest('.schedule-box');
    const schedTitle = schedBox ? schedBox.querySelector('.schedule-title') : document.querySelector('.schedule-title');
    const schedSubtitle = schedBox ? schedBox.querySelector('.schedule-subtitle') : document.querySelector('.schedule-subtitle');

    if (viewMode === 'months') {
      if (schedTitle) schedTitle.textContent = 'Month-by-Month Amortization Schedule';
      if (schedSubtitle) schedSubtitle.textContent = 'Complete monthly breakdown of principal, interest, and remaining balance.';

      schedule.forEach(yr => {
        yr.months.forEach(m => {
          const trMonth = document.createElement('tr');
          trMonth.className = 'month-standalone-row';
          trMonth.innerHTML = `
            <td><strong>Month ${m.month}</strong></td>
            <td>₹${fmtINR(m.openingBalance)}</td>
            <td>₹${fmtINR(m.emi)}</td>
            <td>₹${fmtINR(m.principal)}</td>
            <td>₹${fmtINR(m.interest)}</td>
            <td>₹${fmtINR(m.closingBalance)}</td>
          `;
          tableBodyEl.appendChild(trMonth);
        });
      });
      return;
    }

    // Default: Yearly grouping with expandable monthly breakdown
    if (schedTitle) schedTitle.textContent = 'Year-by-Year Amortization Schedule';
    if (schedSubtitle) schedSubtitle.textContent = 'Click any year row to view individual monthly principal and interest breakdowns.';

    schedule.forEach(yr => {
      const trYear = document.createElement('tr');
      trYear.className = 'year-row';
      trYear.innerHTML = `
        <td><span class="expand-year-icon">▶</span><strong>Year ${yr.year}</strong></td>
        <td>₹${fmtINR(yr.openingBalance)}</td>
        <td>₹${fmtINR(yr.emiPaid)}</td>
        <td>₹${fmtINR(yr.principalPaid)}</td>
        <td>₹${fmtINR(yr.interestPaid)}</td>
        <td>₹${fmtINR(yr.closingBalance)}</td>
      `;

      tableBodyEl.appendChild(trYear);

      const monthRows = [];
      yr.months.forEach(m => {
        const trMonth = document.createElement('tr');
        trMonth.className = 'month-row';
        trMonth.innerHTML = `
          <td style="padding-left: 28px;">Month ${m.month}</td>
          <td>₹${fmtINR(m.openingBalance)}</td>
          <td>₹${fmtINR(m.emi)}</td>
          <td>₹${fmtINR(m.principal)}</td>
          <td>₹${fmtINR(m.interest)}</td>
          <td>₹${fmtINR(m.closingBalance)}</td>
        `;
        tableBodyEl.appendChild(trMonth);
        monthRows.push(trMonth);
      });

      trYear.addEventListener('click', () => {
        const isOpen = monthRows[0] && monthRows[0].classList.contains('open');
        const icon = trYear.querySelector('.expand-year-icon');
        monthRows.forEach(row => row.classList.toggle('open', !isOpen));
        if (icon) icon.textContent = isOpen ? '▶' : '▼';
      });
    });
  }

  function downloadScheduleCSV(schedule, filename = 'loan-schedule.csv') {
    const headers = ['Period', 'Month', 'Opening Balance (Rs)', 'EMI (Rs)', 'Principal (Rs)', 'Interest (Rs)', 'Closing Balance (Rs)'];
    const rows = [headers];

    schedule.forEach(yr => {
      yr.months.forEach(m => {
        rows.push([
          `Year ${yr.year}`,
          m.month,
          Math.round(m.openingBalance),
          Math.round(m.emi),
          Math.round(m.principal),
          Math.round(m.interest),
          Math.round(m.closingBalance)
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ── Universal WhatsApp Link Builder ────────────────────────────────────── */
  function updateWhatsAppCta(btnEl, calcName, detailsStr) {
    if (!btnEl) return;
    const msg = `Hello Mukesh ji, I used the ${calcName} on your MM Financial Services website.\nDetails: ${detailsStr}\nPlease guide me further with consultation.`;
    btnEl.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  /* ── 1. ELIGIBILITY WIDGET CONTROLLER ──────────────────────────────────── */
  function initEligibilityWidget(widget) {
    let profile = 'salaried';
    const tabSalaried = document.getElementById('tabSalaried');
    const tabBusiness = document.getElementById('tabBusiness');
    const salariedFields = document.getElementById('salariedFields');
    const businessFields = document.getElementById('businessFields');

    function switchProfile(p) {
      profile = p;
      if (tabSalaried) tabSalaried.classList.toggle('active', p === 'salaried');
      if (tabBusiness) tabBusiness.classList.toggle('active', p === 'business');
      if (salariedFields) salariedFields.style.display = p === 'salaried' ? 'block' : 'none';
      if (businessFields) businessFields.style.display = p === 'business' ? 'block' : 'none';
      recalc();
    }

    if (tabSalaried) tabSalaried.addEventListener('click', () => switchProfile('salaried'));
    if (tabBusiness) tabBusiness.addEventListener('click', () => switchProfile('business'));

    // Bind Salaried inputs
    bindSync(document.getElementById('salSalaryInput'), document.getElementById('salSalarySlider'), 10000, 1000000, 1000, recalc);
    bindSync(document.getElementById('salBonusInput'), document.getElementById('salBonusSlider'), 0, 2000000, 5000, recalc);
    bindSync(document.getElementById('salRentInput'), document.getElementById('salRentSlider'), 0, 500000, 1000, recalc);
    bindSync(document.getElementById('salEmiInput'), document.getElementById('salEmiSlider'), 0, 500000, 500, recalc);

    // Bind Business inputs (2 Years ITR, Depreciation, Salary/Remuneration, Rent, Obligations)
    bindSync(document.getElementById('bizProfitInput'), document.getElementById('bizProfitSlider'), 100000, 20000000, 25000, recalc);
    bindSync(document.getElementById('bizProfit2Input'), document.getElementById('bizProfit2Slider'), 100000, 20000000, 25000, recalc);
    bindSync(document.getElementById('bizDepreciationInput'), document.getElementById('bizDepreciationSlider'), 0, 5000000, 10000, recalc);
    bindSync(document.getElementById('bizSalaryInput'), document.getElementById('bizSalarySlider'), 0, 5000000, 10000, recalc);
    bindSync(document.getElementById('bizRentInput'), document.getElementById('bizRentSlider'), 0, 500000, 1000, recalc);
    bindSync(document.getElementById('bizEmiInput'), document.getElementById('bizEmiSlider'), 0, 1000000, 1000, recalc);

    const isPersonal = widget.dataset.calcId === 'personal-loan-eligibility-calculator';
    const defaultRate = isPersonal ? 11.0 : 8.75;
    const maxTenure = isPersonal ? 7 : 30;

    const cibilSel = document.getElementById('eligCibilSelect');
    const cibilBadge = document.getElementById('eligCibilBadge');

    if (cibilSel) {
      cibilSel.addEventListener('change', () => {
        const val = cibilSel.value;
        if (cibilBadge) {
          cibilBadge.textContent = val === '750+' ? '750+ (Prime)' : val;
        }
        // Benchmark rate adjustments based on CIBIL
        let base = defaultRate;
        if (val === '700-749') base += 0.25;
        else if (val === '650-699') base += 0.75;
        else if (val === 'Below 650') base += 1.50;
        else if (val === 'New to Credit') base += 0.50;

        const rateIn = document.getElementById('eligRateInput');
        const rateSl = document.getElementById('eligRateSlider');
        if (rateIn) rateIn.value = base.toFixed(2);
        if (rateSl) rateSl.value = base.toFixed(2);
        recalc();
      });
    }

    bindSync(document.getElementById('eligRateInput'), document.getElementById('eligRateSlider'), 6.0, 24.0, 0.05, recalc, true);
    bindSync(document.getElementById('eligTenureInput'), document.getElementById('eligTenureSlider'), 1, maxTenure, 1, recalc);

    function recalc() {
      const rate = parseFloat((document.getElementById('eligRateInput') || {}).value) || defaultRate;
      const tenure = parseInt((document.getElementById('eligTenureInput') || {}).value, 10) || (isPersonal ? 5 : 20);

      // FOIR requirements:
      // Personal Loan = 65% (0.65)
      // Home Loan & LAP = 60% (0.60)
      const appliedFoir = isPersonal ? CONFIG.defaults.foir.personalLoanFoir : CONFIG.defaults.foir.homeLoanFoir;

      let eligibleIncome = 0;
      let existingEmi = 0;

      if (profile === 'salaried') {
        const salary = parseNumber((document.getElementById('salSalaryInput') || {}).value);
        const bonus = parseNumber((document.getElementById('salBonusInput') || {}).value);
        const rent = parseNumber((document.getElementById('salRentInput') || {}).value);
        existingEmi = parseNumber((document.getElementById('salEmiInput') || {}).value);

        // Salaried: FOIR applied to net monthly salary + 50% bonus/12 + 50% rent
        const monthlyEquivalent = salary + (bonus / 12 * 0.5) + (rent * 0.5);
        eligibleIncome = monthlyEquivalent * appliedFoir;
      } else {
        // Business / Self-Employed: 2-Year ITR assessment (24 Months / 12 Months)
        const profit1 = parseNumber((document.getElementById('bizProfitInput') || {}).value);
        const profit2 = parseNumber((document.getElementById('bizProfit2Input') || {}).value);
        const depr = parseNumber((document.getElementById('bizDepreciationInput') || {}).value);
        const remun = parseNumber((document.getElementById('bizSalaryInput') || {}).value);
        const rent = parseNumber((document.getElementById('bizRentInput') || {}).value);
        existingEmi = parseNumber((document.getElementById('bizEmiInput') || {}).value);

        // 2 Years Income Average: (Year 1 + Year 2) / 24 months = Monthly Profit
        const total2YrProfit = profit1 + profit2;
        const avgAnnualProfit = total2YrProfit / 2;
        const monthlyProfit = total2YrProfit / 24;

        // Add-backs: Annual Depreciation / 12, Annual Salary/Remuneration / 12, Monthly Rent
        const monthlyDepr = depr / 12;
        const monthlyRemun = remun / 12;
        const monthlyRent = rent * 0.5;

        // Total Monthly Cash Flow for Business Underwriting
        const totalMonthlyBusinessIncome = monthlyProfit + monthlyDepr + monthlyRemun + monthlyRent;

        // Applied FOIR: 60% for Home Loan / LAP, 65% for Personal Loan
        eligibleIncome = totalMonthlyBusinessIncome * appliedFoir;

        // Update Business calculation summary badges
        const elAvgP = document.getElementById('bizAvgAnnualProfit');
        if (elAvgP) elAvgP.textContent = '₹' + fmtINR(avgAnnualProfit);

        const elMonP = document.getElementById('bizMonthlyProfit');
        if (elMonP) elMonP.textContent = '₹' + fmtINR(monthlyProfit);

        const elTotInc = document.getElementById('bizTotalMonthlyIncome');
        if (elTotInc) elTotInc.textContent = '₹' + fmtINR(totalMonthlyBusinessIncome);
      }

      const eligibleEmi = Math.max(0, eligibleIncome - existingEmi);
      let maxLoan = 0;
      let estimatedEmi = 0;
      let totalPayable = 0;

      if (eligibleEmi > 0 && rate > 0 && tenure > 0) {
        const r = (rate / 12) / 100;
        const n = tenure * 12;
        const emiPerLakh = (100000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        maxLoan = Math.floor((eligibleEmi / emiPerLakh) * 100000 / 1000) * 1000;
        const res = calculateEmi(maxLoan, rate, tenure);
        estimatedEmi = res.emi;
        totalPayable = res.totalPayable;
      }

      // Update Input Badges
      const salSalB = document.getElementById('salSalaryBadge'); if (salSalB) salSalB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('salSalaryInput') || {}).value));
      const salBonB = document.getElementById('salBonusBadge'); if (salBonB) salBonB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('salBonusInput') || {}).value));
      const salRentB = document.getElementById('salRentBadge'); if (salRentB) salRentB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('salRentInput') || {}).value));
      const salEmiB = document.getElementById('salEmiBadge'); if (salEmiB) salEmiB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('salEmiInput') || {}).value));

      const bizProfB = document.getElementById('bizProfitBadge'); if (bizProfB) bizProfB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('bizProfitInput') || {}).value));
      const bizProf2B = document.getElementById('bizProfit2Badge'); if (bizProf2B) bizProf2B.textContent = '₹' + fmtINR(parseNumber((document.getElementById('bizProfit2Input') || {}).value));
      const bizDepB = document.getElementById('bizDepreciationBadge'); if (bizDepB) bizDepB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('bizDepreciationInput') || {}).value));
      const bizSalB = document.getElementById('bizSalaryBadge'); if (bizSalB) bizSalB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('bizSalaryInput') || {}).value));
      const bizRentB = document.getElementById('bizRentBadge'); if (bizRentB) bizRentB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('bizRentInput') || {}).value));
      const bizEmiB = document.getElementById('bizEmiBadge'); if (bizEmiB) bizEmiB.textContent = '₹' + fmtINR(parseNumber((document.getElementById('bizEmiInput') || {}).value));

      const rateB = document.getElementById('eligRateBadge'); if (rateB) rateB.textContent = rate.toFixed(2) + '%';
      const tenB = document.getElementById('eligTenureBadge'); if (tenB) tenB.textContent = tenure + ' Years';

      // Update Result UI
      animateNumber(document.getElementById('eligMaxLoan'), maxLoan);
      const wordsEl = document.getElementById('eligMaxLoanWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(maxLoan);

      animateNumber(document.getElementById('eligEmiCapacity'), eligibleEmi);
      animateNumber(document.getElementById('eligEstimatedEmi'), estimatedEmi);
      const foirEl = document.getElementById('eligFoirApplied');
      if (foirEl) foirEl.textContent = Math.round(appliedFoir * 100);
      animateNumber(document.getElementById('eligTotalPayable'), totalPayable);

      updateWhatsAppCta(
        document.getElementById('eligWhatsAppBtn'),
        isPersonal ? 'Personal Loan Eligibility Calculator' : 'Home Loan Eligibility Calculator',
        `Profile: ${profile}, Max Loan: ₹${fmtINR(maxLoan)}, Monthly EMI: ₹${fmtINR(estimatedEmi)}, Rate: ${rate}%, Tenure: ${tenure} yrs, Applied FOIR: ${Math.round(appliedFoir * 100)}%`
      );
    }

    recalc();
  }

  /* ── 2. LOAN EMI WIDGET CONTROLLER ─────────────────────────────────────── */
  function initLoanEmiWidget(widget) {
    const amountIn = document.getElementById('emiAmountInput');
    const amountSl = document.getElementById('emiAmountSlider');
    const rateIn = document.getElementById('emiRateInput');
    const rateSl = document.getElementById('emiRateSlider');
    const tenureIn = document.getElementById('emiTenureInput');
    const tenureSl = document.getElementById('emiTenureSlider');
    const svgDonut = widget.querySelector('.donut-svg');
    const tableBody = document.getElementById('scheduleTableBody');
    const btnCsv = document.getElementById('btnDownloadCsv');

    let currentSchedule = [];
    let currentTenureUnit = 'years'; // 'years' | 'months'

    // Capture initial slider boundaries (in years)
    const baseMaxYears = parseFloat(tenureSl.max) || 30;
    const baseMinYears = parseFloat(tenureSl.min) || 1;
    const baseMaxMonths = baseMaxYears * 12;
    const baseMinMonths = 6;

    bindSync(amountIn, amountSl, parseFloat(amountSl.min), parseFloat(amountSl.max), parseFloat(amountSl.step), recalc);
    bindSync(rateIn, rateSl, parseFloat(rateSl.min), parseFloat(rateSl.max), parseFloat(rateSl.step), recalc, true);
    bindSync(tenureIn, tenureSl, parseFloat(tenureSl.min), parseFloat(tenureSl.max), parseFloat(tenureSl.step), recalc);

    // Setup Year/Month Toggle buttons
    const unitToggleBtns = widget.querySelectorAll('.tenure-unit-btn');
    const tenureGroup = tenureIn ? tenureIn.closest('.input-group') : null;
    const tenureLabel = tenureGroup ? tenureGroup.querySelector('label') : null;
    const tenurePrefix = tenureGroup ? tenureGroup.querySelector('.currency-prefix') : null;
    const tenureLimits = tenureGroup ? tenureGroup.querySelectorAll('.slider-limits span') : null;

    function setTenureUnit(newUnit) {
      if (currentTenureUnit === newUnit) return;
      currentTenureUnit = newUnit;

      unitToggleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === newUnit);
      });

      if (newUnit === 'months') {
        const currentYrs = parseFloat(tenureIn.value) || 20;
        const moVal = Math.max(baseMinMonths, Math.min(baseMaxMonths, Math.round(currentYrs * 12)));

        tenureSl.min = baseMinMonths;
        tenureSl.max = baseMaxMonths;
        tenureSl.step = 1;
        tenureSl.value = moVal;
        tenureIn.value = moVal;

        if (tenureLabel) tenureLabel.textContent = 'Loan Tenure (Months)';
        if (tenurePrefix) tenurePrefix.textContent = 'Mo';
        if (tenureLimits && tenureLimits.length >= 2) {
          tenureLimits[0].textContent = baseMinMonths + ' Months';
          tenureLimits[1].textContent = baseMaxMonths + ' Months';
        }
      } else {
        const currentMos = parseFloat(tenureIn.value) || 240;
        const yrVal = Math.max(baseMinYears, Math.min(baseMaxYears, Math.round(currentMos / 12) || 1));

        tenureSl.min = baseMinYears;
        tenureSl.max = baseMaxYears;
        tenureSl.step = 1;
        tenureSl.value = yrVal;
        tenureIn.value = yrVal;

        if (tenureLabel) tenureLabel.textContent = 'Loan Tenure (Years)';
        if (tenurePrefix) tenurePrefix.textContent = 'Yr';
        if (tenureLimits && tenureLimits.length >= 2) {
          tenureLimits[0].textContent = baseMinYears + (baseMinYears === 1 ? ' Year' : ' Years');
          tenureLimits[1].textContent = baseMaxYears + ' Years';
        }
      }

      updateSliderFill(tenureSl);
      recalc();
    }

    unitToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setTenureUnit(btn.dataset.unit);
      });
    });

    if (tenurePrefix) {
      tenurePrefix.style.cursor = 'pointer';
      tenurePrefix.title = 'Click to switch between Years and Months';
      tenurePrefix.addEventListener('click', () => {
        setTenureUnit(currentTenureUnit === 'years' ? 'months' : 'years');
      });
    }

    // Optional Part-Prepayment Toggle
    const prepayBtn = document.getElementById('prepayToggleBtn');
    const prepayContent = document.getElementById('prepayContent');
    const prepayAmtIn = document.getElementById('prepayAmountInput');
    const prepayMoIn = document.getElementById('prepayMonthInput');
    const prepayNotice = document.getElementById('prepaySavingsNotice');

    if (prepayBtn && prepayContent) {
      prepayBtn.addEventListener('click', () => {
        const isShown = prepayContent.style.display !== 'none';
        prepayContent.style.display = isShown ? 'none' : 'block';
        recalc();
      });
      if (prepayAmtIn) prepayAmtIn.addEventListener('input', recalc);
      if (prepayMoIn) prepayMoIn.addEventListener('input', recalc);
    }

    function recalc() {
      const P = parseNumber(amountIn.value);
      const rate = parseFloat(rateIn.value) || 8.75;
      const rawTenure = parseFloat(tenureIn.value) || (currentTenureUnit === 'months' ? 240 : 20);

      const tenureMonths = currentTenureUnit === 'months'
        ? rawTenure
        : (rawTenure * 12);
      const tenureYears = tenureMonths / 12;

      const emiRes = calculateEmi(P, rate, tenureYears, tenureMonths);

      // Badges
      const amtBadge = document.getElementById('emiAmountBadge'); if (amtBadge) amtBadge.textContent = '₹' + fmtINR(P);
      const rateBadge = document.getElementById('emiRateBadge'); if (rateBadge) rateBadge.textContent = rate.toFixed(2) + '%';
      const tenBadge = document.getElementById('emiTenureBadge'); 
      if (tenBadge) {
        if (currentTenureUnit === 'months') {
          const yrs = (rawTenure / 12).toFixed(1).replace(/\.0$/, '');
          tenBadge.textContent = `${rawTenure} Months (${yrs} Yrs)`;
        } else {
          tenBadge.textContent = rawTenure + (rawTenure === 1 ? ' Year' : ' Years');
        }
      }

      animateNumber(document.getElementById('emiResultVal'), emiRes.emi);
      const wordsEl = document.getElementById('emiResultWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(emiRes.emi) + ' / month';

      animateNumber(document.getElementById('donutPrincipal'), P);
      animateNumber(document.getElementById('donutInterest'), emiRes.totalInterest);
      animateNumber(document.getElementById('emiTotalInterest'), emiRes.totalInterest);
      animateNumber(document.getElementById('emiTotalPayable'), emiRes.totalPayable);

      updateDonut(svgDonut, P, emiRes.totalInterest);

      currentSchedule = buildAmortizationSchedule(P, rate, tenureYears, tenureMonths);
      renderAmortizationTable(tableBody, currentSchedule);

      // Prepayment calculation
      if (prepayContent && prepayContent.style.display !== 'none' && prepayAmtIn && prepayNotice) {
        const prepayAmt = parseNumber(prepayAmtIn.value);
        const prepayMo = parseInt(prepayMoIn.value, 10) || 12;
        if (prepayAmt > 0 && prepayMo > 0 && prepayMo < tenureMonths) {
          // Compute remaining balance at prepay month
          const r = (rate / 12) / 100;
          let bal = P;
          for (let m = 1; m <= prepayMo; m++) {
            const int = bal * r;
            const princ = emiRes.emi - int;
            bal = Math.max(0, bal - princ);
          }
          const revisedBal = Math.max(0, bal - prepayAmt);
          // New tenure with same EMI
          if (revisedBal > 0 && r > 0 && emiRes.emi > revisedBal * r) {
            const newN = Math.log(emiRes.emi / (emiRes.emi - revisedBal * r)) / Math.log(1 + r);
            const revisedTenureMonths = prepayMo + Math.ceil(newN);
            const monthsSaved = Math.max(0, tenureMonths - revisedTenureMonths);
            const revisedTotalInt = (prepayMo * emiRes.emi) + (Math.ceil(newN) * emiRes.emi) - P;
            const intSaved = Math.max(0, emiRes.totalInterest - revisedTotalInt);

            prepayNotice.style.display = 'block';
            prepayNotice.innerHTML = `<strong>Prepayment Benefit:</strong> You save <strong>₹${fmtINR(intSaved)}</strong> in interest and close your loan <strong>${Math.floor(monthsSaved / 12)} years ${monthsSaved % 12} months</strong> earlier!`;
          }
        } else {
          prepayNotice.style.display = 'none';
        }
      }

      const tenureSummary = currentTenureUnit === 'months' 
        ? `${rawTenure} Months` 
        : `${rawTenure} Years`;

      updateWhatsAppCta(
        document.getElementById('emiWhatsAppBtn'),
        'EMI Calculator',
        `Principal: ₹${fmtINR(P)}, Rate: ${rate}%, Tenure: ${tenureSummary}, Monthly EMI: ₹${fmtINR(emiRes.emi)}, Total Interest: ₹${fmtINR(emiRes.totalInterest)}`
      );
    }

    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        downloadScheduleCSV(currentSchedule, 'loan-amortization-schedule.csv');
      });
    }

    recalc();
  }

  /* ── 3. COMPARISON WIDGET CONTROLLER ───────────────────────────────────── */
  function initComparisonWidget(widget) {
    const pIn = document.getElementById('compPrincipalInput');
    const pSl = document.getElementById('compPrincipalSlider');
    const r1In = document.getElementById('compRate1Input');
    const t1In = document.getElementById('compTenure1Input');
    const r2In = document.getElementById('compRate2Input');
    const t2In = document.getElementById('compTenure2Input');
    const feesIn = document.getElementById('compFeesInput');

    bindSync(pIn, pSl, 500000, 50000000, 50000, recalc);
    if (r1In) r1In.addEventListener('input', recalc);
    if (t1In) t1In.addEventListener('input', recalc);
    if (r2In) r2In.addEventListener('input', recalc);
    if (t2In) t2In.addEventListener('input', recalc);
    if (feesIn) feesIn.addEventListener('input', recalc);

    function recalc() {
      const P = parseNumber(pIn.value);
      const r1 = parseFloat(r1In.value) || 9.25;
      const t1 = parseInt(t1In.value, 10) || 20;
      const r2 = parseFloat(r2In.value) || 8.50;
      const t2 = parseInt(t2In.value, 10) || 20;
      const fees = parseNumber(feesIn.value);

      const res1 = calculateEmi(P, r1, t1);
      const res2 = calculateEmi(P, r2, t2);

      const grossSavings = Math.max(0, res1.totalInterest - res2.totalInterest);
      const netSavings = Math.max(0, grossSavings - fees);
      const monthlySavings = Math.max(0, res1.emi - res2.emi);
      const breakEvenMonths = monthlySavings > 0 ? Math.ceil(fees / monthlySavings) : 0;

      const badgeP = document.getElementById('compPrincipalBadge');
      if (badgeP) badgeP.textContent = '₹' + fmtINR(P);

      animateNumber(document.getElementById('compNetSavings'), netSavings);
      const wordsEl = document.getElementById('compNetSavingsWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(netSavings) + ' saved';

      animateNumber(document.getElementById('compEmi1'), res1.emi);
      animateNumber(document.getElementById('compEmi2'), res2.emi);
      animateNumber(document.getElementById('compMonthlySavings'), monthlySavings);
      const beEl = document.getElementById('compBreakEven');
      if (beEl) beEl.textContent = breakEvenMonths;

      updateWhatsAppCta(
        document.getElementById('compWhatsAppBtn'),
        'Home Loan Balance Transfer Calculator',
        `Principal: ₹${fmtINR(P)}, Current Rate: ${r1}% (EMI ₹${fmtINR(res1.emi)}), New Rate: ${r2}% (EMI ₹${fmtINR(res2.emi)}), Net Savings: ₹${fmtINR(netSavings)}`
      );
    }

    recalc();
  }

  /* ── 4. EDUCATION LOAN CONTROLLER ──────────────────────────────────────── */
  function initEducationLoanWidget(widget) {
    const amtIn = document.getElementById('eduAmountInput');
    const amtSl = document.getElementById('eduAmountSlider');
    const rateIn = document.getElementById('eduRateInput');
    const rateSl = document.getElementById('eduRateSlider');
    const moratIn = document.getElementById('eduMoratoriumInput');
    const simpleCheck = document.getElementById('eduSimpleInterestCheck');
    const tenIn = document.getElementById('eduTenureInput');
    const tenSl = document.getElementById('eduTenureSlider');
    const taxSelect = document.getElementById('eduTaxSlabSelect');

    let currentEduUnit = 'years';
    const baseMaxYears = parseFloat(tenSl ? tenSl.max : 15) || 15;
    const baseMinYears = parseFloat(tenSl ? tenSl.min : 1) || 1;
    const baseMaxMonths = baseMaxYears * 12;
    const baseMinMonths = 6;

    bindSync(amtIn, amtSl, 100000, 15000000, 50000, recalc);
    bindSync(rateIn, rateSl, 7.0, 16.0, 0.05, recalc, true);
    bindSync(tenIn, tenSl, 1, 15, 1, recalc);

    // Setup Year/Month Toggle buttons
    const unitToggleBtns = widget.querySelectorAll('.tenure-unit-btn');
    const tenureGroup = tenIn ? tenIn.closest('.input-group') : null;
    const tenureLabel = tenureGroup ? tenureGroup.querySelector('label') : null;
    const tenurePrefix = tenureGroup ? tenureGroup.querySelector('.currency-prefix') : null;
    const tenureLimits = tenureGroup ? tenureGroup.querySelectorAll('.slider-limits span') : null;

    function setEduUnit(newUnit) {
      if (currentEduUnit === newUnit) return;
      currentEduUnit = newUnit;

      unitToggleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === newUnit);
      });

      if (newUnit === 'months') {
        const currentYrs = parseFloat(tenIn.value) || 10;
        const moVal = Math.max(baseMinMonths, Math.min(baseMaxMonths, Math.round(currentYrs * 12)));

        tenSl.min = baseMinMonths;
        tenSl.max = baseMaxMonths;
        tenSl.step = 1;
        tenSl.value = moVal;
        tenIn.value = moVal;

        if (tenureLabel) tenureLabel.textContent = 'Repayment Tenure (Months)';
        if (tenurePrefix) tenurePrefix.textContent = 'Mo';
        if (tenureLimits && tenureLimits.length >= 2) {
          tenureLimits[0].textContent = baseMinMonths + ' Months';
          tenureLimits[1].textContent = baseMaxMonths + ' Months';
        }
      } else {
        const currentMos = parseFloat(tenIn.value) || 120;
        const yrVal = Math.max(baseMinYears, Math.min(baseMaxYears, Math.round(currentMos / 12) || 1));

        tenSl.min = baseMinYears;
        tenSl.max = baseMaxYears;
        tenSl.step = 1;
        tenSl.value = yrVal;
        tenIn.value = yrVal;

        if (tenureLabel) tenureLabel.textContent = 'Repayment Tenure (Years)';
        if (tenurePrefix) tenurePrefix.textContent = 'Yr';
        if (tenureLimits && tenureLimits.length >= 2) {
          tenureLimits[0].textContent = baseMinYears + ' Year';
          tenureLimits[1].textContent = baseMaxYears + ' Years';
        }
      }

      updateSliderFill(tenSl);
      recalc();
    }

    unitToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setEduUnit(btn.dataset.unit);
      });
    });

    if (tenurePrefix) {
      tenurePrefix.style.cursor = 'pointer';
      tenurePrefix.title = 'Click to switch between Years and Months';
      tenurePrefix.addEventListener('click', () => {
        setEduUnit(currentEduUnit === 'years' ? 'months' : 'years');
      });
    }

    if (moratIn) moratIn.addEventListener('input', recalc);
    if (simpleCheck) simpleCheck.addEventListener('change', recalc);
    if (taxSelect) taxSelect.addEventListener('change', recalc);

    function recalc() {
      const P = parseNumber(amtIn.value);
      const rate = parseFloat(rateIn.value) || 9.5;
      const moratMonths = parseInt(moratIn.value, 10) || 24;
      const paySimple = simpleCheck ? simpleCheck.checked : false;
      const rawTenure = parseFloat(tenIn.value) || (currentEduUnit === 'months' ? 120 : 10);
      const tenureMonths = currentEduUnit === 'months' ? rawTenure : (rawTenure * 12);
      const tenureYears = tenureMonths / 12;
      const taxRate = parseFloat(taxSelect.value) || 0.30;

      let repayPrincipal = P;
      if (!paySimple && moratMonths > 0) {
        repayPrincipal = P * Math.pow(1 + (rate / 12 / 100), moratMonths);
      }

      const res = calculateEmi(repayPrincipal, rate, tenureYears, tenureMonths);
      const totalInterest = res.totalInterest;

      // 80E tax benefits (first 8 years max)
      const yr1Interest = repayPrincipal * (rate / 100);
      const annualTaxSaved = yr1Interest * taxRate;
      const benefitYears = Math.min(8, tenureYears);
      const totalTaxSaved = (totalInterest / (tenureYears || 1)) * benefitYears * taxRate;

      const tenBadge = document.getElementById('eduTenureBadge');
      if (tenBadge) {
        if (currentEduUnit === 'months') {
          const yrs = (rawTenure / 12).toFixed(1).replace(/\.0$/, '');
          tenBadge.textContent = `${rawTenure} Months (${yrs} Yrs)`;
        } else {
          tenBadge.textContent = rawTenure + (rawTenure === 1 ? ' Year' : ' Years');
        }
      }

      animateNumber(document.getElementById('eduEmiVal'), res.emi);
      const wordsEl = document.getElementById('eduEmiWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(res.emi) + ' / month';

      animateNumber(document.getElementById('eduRepayPrincipal'), repayPrincipal);
      animateNumber(document.getElementById('eduTotalInterest'), totalInterest);
      animateNumber(document.getElementById('eduAnnualTaxSaved'), annualTaxSaved);
      animateNumber(document.getElementById('eduTotalTaxSaved'), totalTaxSaved);

      const tenureSummary = currentEduUnit === 'months' ? `${rawTenure} Months` : `${rawTenure} Years`;

      updateWhatsAppCta(
        document.getElementById('eduWhatsAppBtn'),
        'Education Loan Calculator',
        `Course Loan: ₹${fmtINR(P)}, Repay Principal: ₹${fmtINR(repayPrincipal)}, Tenure: ${tenureSummary}, Monthly EMI: ₹${fmtINR(res.emi)}, 80E Tax Saved: ₹${fmtINR(totalTaxSaved)}`
      );
    }

    recalc();
  }

  /* ── 5. GOLD LOAN CONTROLLER ───────────────────────────────────────────── */
  function initGoldLoanWidget(widget) {
    const gramsIn = document.getElementById('goldGramsInput');
    const gramsSl = document.getElementById('goldGramsSlider');
    const puritySel = document.getElementById('goldPuritySelect');
    const priceIn = document.getElementById('goldPriceInput');
    const ltvSl = document.getElementById('goldLtvSlider');
    const rateIn = document.getElementById('goldRateInput');

    bindSync(gramsIn, gramsSl, 5, 500, 1, recalc);
    if (puritySel) puritySel.addEventListener('change', recalc);
    if (priceIn) priceIn.addEventListener('input', recalc);
    if (ltvSl) {
      ltvSl.addEventListener('input', () => {
        const b = document.getElementById('goldLtvBadge');
        if (b) b.textContent = ltvSl.value + '%';
        updateSliderFill(ltvSl);
        recalc();
      });
    }
    if (rateIn) rateIn.addEventListener('input', recalc);

    function recalc() {
      const grams = parseNumber(gramsIn.value);
      const purity = parseFloat(puritySel.value) || 0.916;
      const price24k = parseNumber(priceIn.value) || 7000;
      const ltvPct = parseFloat(ltvSl.value) || 75;
      const rate = parseFloat(rateIn.value) || 9.0;

      const pureWeight = grams * purity;
      const marketVal = pureWeight * price24k;
      const maxLoan = marketVal * (ltvPct / 100);
      const monthlyInt = maxLoan * (rate / 12 / 100);
      const annualInt = maxLoan * (rate / 100);

      const bG = document.getElementById('goldGramsBadge');
      if (bG) bG.textContent = grams + ' Grams';

      animateNumber(document.getElementById('goldMaxLoan'), maxLoan);
      const wordsEl = document.getElementById('goldMaxLoanWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(maxLoan);

      animateNumber(document.getElementById('goldMarketVal'), marketVal);
      const pwEl = document.getElementById('goldPureWeight');
      if (pwEl) pwEl.textContent = pureWeight.toFixed(1);
      animateNumber(document.getElementById('goldMonthlyInterest'), monthlyInt);
      animateNumber(document.getElementById('goldAnnualInterest'), annualInt);

      updateWhatsAppCta(
        document.getElementById('goldWhatsAppBtn'),
        'Gold Loan Calculator',
        `Weight: ${grams}g, Purity: ${puritySel.options[puritySel.selectedIndex].text}, Gold Value: ₹${fmtINR(marketVal)}, Eligible Loan: ₹${fmtINR(maxLoan)}`
      );
    }

    recalc();
  }

  /* ── 6. LOAN AGAINST PROPERTY (LAP) CONTROLLER ─────────────────────────── */
  function initLapWidget(widget) {
    const propIn = document.getElementById('lapPropValueInput');
    const propSl = document.getElementById('lapPropValueSlider');
    const propSel = document.getElementById('lapPropTypeSelect');
    const incIn = document.getElementById('lapIncomeInput');
    const incSl = document.getElementById('lapIncomeSlider');
    const emiIn = document.getElementById('lapEmiInput');
    const rateIn = document.getElementById('lapRateInput');
    const tenIn = document.getElementById('lapTenureInput');

    bindSync(propIn, propSl, 2000000, 100000000, 100000, recalc);
    bindSync(incIn, incSl, 30000, 2000000, 5000, recalc);
    if (propSel) propSel.addEventListener('change', recalc);
    if (emiIn) emiIn.addEventListener('input', recalc);
    if (rateIn) rateIn.addEventListener('input', recalc);
    if (tenIn) tenIn.addEventListener('input', recalc);

    function recalc() {
      const propVal = parseNumber(propIn.value);
      const ltvPct = parseFloat(propSel.value) || 0.65;
      const netInc = parseNumber(incIn.value);
      const existingEmi = parseNumber(emiIn.value);
      const rate = parseFloat(rateIn.value) || 9.5;
      const tenure = parseInt(tenIn.value, 10) || 15;

      const collateralLimit = propVal * ltvPct;
      const foir = 0.60;
      const maxEmiCapacity = Math.max(0, (netInc * foir) - existingEmi);

      let incomeLimit = 0;
      if (maxEmiCapacity > 0 && rate > 0 && tenure > 0) {
        const r = (rate / 12) / 100;
        const n = tenure * 12;
        const emiPerLakh = (100000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        incomeLimit = Math.floor((maxEmiCapacity / emiPerLakh) * 100000 / 1000) * 1000;
      }

      const finalSanction = Math.min(collateralLimit, incomeLimit);
      const res = calculateEmi(finalSanction, rate, tenure);

      const bP = document.getElementById('lapPropValueBadge'); if (bP) bP.textContent = '₹' + fmtINR(propVal);
      const bI = document.getElementById('lapIncomeBadge'); if (bI) bI.textContent = '₹' + fmtINR(netInc);

      animateNumber(document.getElementById('lapMaxLoan'), finalSanction);
      const wordsEl = document.getElementById('lapMaxLoanWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(finalSanction);

      animateNumber(document.getElementById('lapCollateralLimit'), collateralLimit);
      animateNumber(document.getElementById('lapIncomeLimit'), incomeLimit);
      animateNumber(document.getElementById('lapMonthlyEmi'), res.emi);
      animateNumber(document.getElementById('lapTotalPayable'), res.totalPayable);

      updateWhatsAppCta(
        document.getElementById('lapWhatsAppBtn'),
        'Loan Against Property (LAP) Calculator',
        `Property Value: ₹${fmtINR(propVal)}, Income: ₹${fmtINR(netInc)}/mo, Collateral Limit: ₹${fmtINR(collateralLimit)}, Eligible LAP: ₹${fmtINR(finalSanction)}, Monthly EMI: ₹${fmtINR(res.emi)}`
      );
    }

    recalc();
  }

  /* ── 7. FIXED DEPOSIT CONTROLLER ───────────────────────────────────────── */
  function initFdWidget(widget) {
    const amtIn = document.getElementById('fdAmountInput');
    const amtSl = document.getElementById('fdAmountSlider');
    const rateIn = document.getElementById('fdRateInput');
    const rateSl = document.getElementById('fdRateSlider');
    const tenIn = document.getElementById('fdTenureInput');
    const tenSl = document.getElementById('fdTenureSlider');
    const compSel = document.getElementById('fdCompoundingSelect');
    const senCheck = document.getElementById('fdSeniorCheck');
    const svgDonut = widget.querySelector('.donut-svg');

    bindSync(amtIn, amtSl, 10000, 10000000, 5000, recalc);
    bindSync(rateIn, rateSl, 3.0, 12.0, 0.05, recalc, true);
    bindSync(tenIn, tenSl, 1, 10, 1, recalc);
    if (compSel) compSel.addEventListener('change', recalc);
    if (senCheck) senCheck.addEventListener('change', recalc);

    function recalc() {
      const P = parseNumber(amtIn.value);
      let rate = parseFloat(rateIn.value) || 7.0;
      if (senCheck && senCheck.checked) rate += 0.50;
      const years = parseInt(tenIn.value, 10) || 5;
      const comp = parseInt(compSel.value, 10) || 4;

      const res = calculateFdMaturity(P, rate, years, 0, comp);

      const bA = document.getElementById('fdAmountBadge'); if (bA) bA.textContent = '₹' + fmtINR(P);
      const bR = document.getElementById('fdRateBadge'); if (bR) bR.textContent = rate.toFixed(2) + '%';
      const bT = document.getElementById('fdTenureBadge'); if (bT) bT.textContent = years + ' Years';

      animateNumber(document.getElementById('fdMaturityVal'), res.maturity);
      const wordsEl = document.getElementById('fdMaturityWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(res.maturity);

      animateNumber(document.getElementById('fdInvestedVal'), P);
      animateNumber(document.getElementById('fdInterestVal'), res.interest);

      updateDonut(svgDonut, P, res.interest);

      updateWhatsAppCta(
        document.getElementById('fdWhatsAppBtn'),
        'Fixed Deposit Calculator',
        `Principal: ₹${fmtINR(P)}, Rate: ${rate}%, Tenure: ${years} yrs, Maturity: ₹${fmtINR(res.maturity)}, Interest Earned: ₹${fmtINR(res.interest)}`
      );
    }

    recalc();
  }

  /* ── 8. RECURRING DEPOSIT CONTROLLER ───────────────────────────────────── */
  function initRdWidget(widget) {
    const depIn = document.getElementById('rdDepositInput');
    const depSl = document.getElementById('rdDepositSlider');
    const rateIn = document.getElementById('rdRateInput');
    const rateSl = document.getElementById('rdRateSlider');
    const moIn = document.getElementById('rdMonthsInput');
    const moSl = document.getElementById('rdMonthsSlider');
    const senCheck = document.getElementById('rdSeniorCheck');
    const svgDonut = widget.querySelector('.donut-svg');

    bindSync(depIn, depSl, 500, 200000, 500, recalc);
    bindSync(rateIn, rateSl, 3.0, 10.0, 0.05, recalc, true);
    bindSync(moIn, moSl, 6, 120, 3, recalc);
    if (senCheck) senCheck.addEventListener('change', recalc);

    function recalc() {
      const dep = parseNumber(depIn.value);
      let rate = parseFloat(rateIn.value) || 6.5;
      if (senCheck && senCheck.checked) rate += 0.50;
      const months = parseInt(moIn.value, 10) || 24;

      const res = calculateRdMaturity(dep, rate, months);

      const bD = document.getElementById('rdDepositBadge'); if (bD) bD.textContent = '₹' + fmtINR(dep);
      const bR = document.getElementById('rdRateBadge'); if (bR) bR.textContent = rate.toFixed(2) + '%';
      const bM = document.getElementById('rdMonthsBadge'); if (bM) bM.textContent = months + ' Months (' + (months / 12).toFixed(1) + ' Yrs)';

      animateNumber(document.getElementById('rdMaturityVal'), res.maturity);
      const wordsEl = document.getElementById('rdMaturityWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(res.maturity);

      animateNumber(document.getElementById('rdDepositedVal'), res.deposited);
      animateNumber(document.getElementById('rdInterestVal'), res.interest);

      updateDonut(svgDonut, res.deposited, res.interest);

      updateWhatsAppCta(
        document.getElementById('rdWhatsAppBtn'),
        'Recurring Deposit Calculator',
        `Monthly Deposit: ₹${fmtINR(dep)}, Rate: ${rate}%, Months: ${months}, Maturity Value: ₹${fmtINR(res.maturity)}, Interest: ₹${fmtINR(res.interest)}`
      );
    }

    recalc();
  }

  /* ── 9. DREAM BUILDER RD CONTROLLER ────────────────────────────────────── */
  function initDreamRdWidget(widget) {
    const tgtIn = document.getElementById('dreamTargetInput');
    const tgtSl = document.getElementById('dreamTargetSlider');
    const yrIn = document.getElementById('dreamYearsInput');
    const yrSl = document.getElementById('dreamYearsSlider');
    const rateIn = document.getElementById('dreamRateInput');
    const rateSl = document.getElementById('dreamRateSlider');

    bindSync(tgtIn, tgtSl, 50000, 10000000, 10000, recalc);
    bindSync(yrIn, yrSl, 1, 10, 1, recalc);
    bindSync(rateIn, rateSl, 4.0, 10.0, 0.1, recalc, true);

    function recalc() {
      const target = parseNumber(tgtIn.value);
      const years = parseInt(yrIn.value, 10) || 3;
      const rate = parseFloat(rateIn.value) || 6.5;
      const months = years * 12;

      // Compute quarterly compounding accumulation factor for 1 rupee per month
      const r = rate / 100;
      let factor = 0;
      for (let k = 1; k <= months; k++) {
        factor += Math.pow(1 + r / 4, (4 * k) / 12);
      }

      const reqMonthly = factor > 0 ? target / factor : target / months;
      const totalDeposited = reqMonthly * months;
      const interestEarned = Math.max(0, target - totalDeposited);

      const bT = document.getElementById('dreamTargetBadge'); if (bT) bT.textContent = '₹' + fmtINR(target);
      const bY = document.getElementById('dreamYearsBadge'); if (bY) bY.textContent = years + ' Years';
      const bR = document.getElementById('dreamRateBadge'); if (bR) bR.textContent = rate.toFixed(1) + '%';

      animateNumber(document.getElementById('dreamMonthlyVal'), reqMonthly);
      const wordsEl = document.getElementById('dreamMonthlyWords');
      if (wordsEl) wordsEl.textContent = '₹' + fmtINR(reqMonthly) + ' per month';

      animateNumber(document.getElementById('dreamTargetDisplay'), target);
      animateNumber(document.getElementById('dreamTotalDeposited'), totalDeposited);
      animateNumber(document.getElementById('dreamInterestEarned'), interestEarned);
      const instEl = document.getElementById('dreamTotalInstallments');
      if (instEl) instEl.textContent = months;

      updateWhatsAppCta(
        document.getElementById('dreamWhatsAppBtn'),
        'Dream Builder Goal-Based RD Calculator',
        `Target Goal: ₹${fmtINR(target)}, Horizon: ${years} yrs, Required Monthly Deposit: ₹${fmtINR(reqMonthly)}, Bank Interest: ₹${fmtINR(interestEarned)}`
      );
    }

    recalc();
  }

  /* ── 10. SIP & LUMPSUM CONTROLLER ──────────────────────────────────────── */
  function initSipWidget(widget) {
    let mode = 'sip';
    const tabSip = document.getElementById('tabSip');
    const tabLump = document.getElementById('tabLumpsum');
    const sipInputs = document.getElementById('sipModeInputs');
    const lumpInputs = document.getElementById('lumpsumModeInputs');

    function switchMode(m) {
      mode = m;
      if (tabSip) tabSip.classList.toggle('active', m === 'sip');
      if (tabLump) tabLump.classList.toggle('active', m === 'lumpsum');
      if (sipInputs) sipInputs.style.display = m === 'sip' ? 'block' : 'none';
      if (lumpInputs) lumpInputs.style.display = m === 'lumpsum' ? 'block' : 'none';
      recalc();
    }

    if (tabSip) tabSip.addEventListener('click', () => switchMode('sip'));
    if (tabLump) tabLump.addEventListener('click', () => switchMode('lumpsum'));

    const sipAmtIn = document.getElementById('sipAmountInput');
    const sipAmtSl = document.getElementById('sipAmountSlider');
    const stepSl = document.getElementById('sipStepUpSlider');
    const lumpAmtIn = document.getElementById('lumpAmountInput');
    const lumpAmtSl = document.getElementById('lumpAmountSlider');
    const rateIn = document.getElementById('sipRateInput');
    const rateSl = document.getElementById('sipRateSlider');
    const yrIn = document.getElementById('sipYearsInput');
    const yrSl = document.getElementById('sipYearsSlider');
    const svgDonut = widget.querySelector('.donut-svg');

    bindSync(sipAmtIn, sipAmtSl, 500, 500000, 500, recalc);
    bindSync(lumpAmtIn, lumpAmtSl, 5000, 10000000, 5000, recalc);
    bindSync(rateIn, rateSl, 6.0, 30.0, 0.5, recalc, true);
    bindSync(yrIn, yrSl, 1, 40, 1, recalc);

    if (stepSl) {
      stepSl.addEventListener('input', () => {
        const b = document.getElementById('sipStepUpBadge');
        if (b) b.textContent = stepSl.value + '% Yearly';
        updateSliderFill(stepSl);
        recalc();
      });
    }

    function recalc() {
      const rate = parseFloat(rateIn.value) || 12.0;
      const years = parseInt(yrIn.value, 10) || 10;
      let res = { invested: 0, maturity: 0, returns: 0 };

      if (mode === 'sip') {
        const monthly = parseNumber(sipAmtIn.value);
        const stepUp = parseFloat(stepSl.value) || 0;
        res = calculateSipMaturity(monthly, rate, years, stepUp);

        const bS = document.getElementById('sipAmountBadge'); if (bS) bS.textContent = '₹' + fmtINR(monthly);
      } else {
        const lump = parseNumber(lumpAmtIn.value);
        res = calculateLumpsumMaturity(lump, rate, years);

        const bL = document.getElementById('lumpAmountBadge'); if (bL) bL.textContent = '₹' + fmtINR(lump);
      }

      const bR = document.getElementById('sipRateBadge'); if (bR) bR.textContent = rate.toFixed(1) + '%';
      const bY = document.getElementById('sipYearsBadge'); if (bY) bY.textContent = years + ' Years';

      animateNumber(document.getElementById('sipMaturityVal'), res.maturity);
      const wordsEl = document.getElementById('sipMaturityWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(res.maturity);

      animateNumber(document.getElementById('sipInvestedVal'), res.invested);
      animateNumber(document.getElementById('sipReturnsVal'), res.returns);

      updateDonut(svgDonut, res.invested, res.returns);

      updateWhatsAppCta(
        document.getElementById('sipWhatsAppBtn'),
        'Mutual Fund SIP & Lumpsum Calculator',
        `Mode: ${mode.toUpperCase()}, Invested: ₹${fmtINR(res.invested)}, Expected Return: ${rate}%, Horizon: ${years} yrs, Projected Maturity: ₹${fmtINR(res.maturity)} (Wealth Gain: ₹${fmtINR(res.returns)})`
      );
    }

    recalc();
  }

  /* ── 11. PPF CONTROLLER ────────────────────────────────────────────────── */
  function initPpfWidget(widget) {
    const depIn = document.getElementById('ppfDepositInput');
    const depSl = document.getElementById('ppfDepositSlider');
    const yrSel = document.getElementById('ppfYearsSelect');
    const rateIn = document.getElementById('ppfRateInput');
    const svgDonut = widget.querySelector('.donut-svg');

    bindSync(depIn, depSl, 500, 150000, 500, recalc);
    if (yrSel) yrSel.addEventListener('change', recalc);
    if (rateIn) rateIn.addEventListener('input', recalc);

    function recalc() {
      const yearly = parseNumber(depIn.value);
      const years = parseInt(yrSel.value, 10) || 15;
      const rate = parseFloat(rateIn.value) || 7.1;

      let balance = 0;
      let totalInvested = 0;

      for (let y = 1; y <= years; y++) {
        balance += yearly;
        totalInvested += yearly;
        const interest = balance * (rate / 100);
        balance += interest;
      }

      const totalInterest = balance - totalInvested;

      const bD = document.getElementById('ppfDepositBadge'); if (bD) bD.textContent = '₹' + fmtINR(yearly);

      animateNumber(document.getElementById('ppfMaturityVal'), balance);
      const wordsEl = document.getElementById('ppfMaturityWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(balance);

      animateNumber(document.getElementById('ppfInvestedVal'), totalInvested);
      animateNumber(document.getElementById('ppfInterestVal'), totalInterest);

      updateDonut(svgDonut, totalInvested, totalInterest);

      updateWhatsAppCta(
        document.getElementById('ppfWhatsAppBtn'),
        'PPF Calculator',
        `Yearly Contribution: ₹${fmtINR(yearly)}, Duration: ${years} yrs, Rate: ${rate}%, Tax-Free Maturity: ₹${fmtINR(balance)}, Interest Earned: ₹${fmtINR(totalInterest)}`
      );
    }

    recalc();
  }

  /* ── 12. SUKANYA SAMRIDDHI YOJANA CONTROLLER ───────────────────────────── */
  function initSsyWidget(widget) {
    const depIn = document.getElementById('ssyDepositInput');
    const depSl = document.getElementById('ssyDepositSlider');
    const ageIn = document.getElementById('ssyAgeInput');
    const ageSl = document.getElementById('ssyAgeSlider');
    const rateIn = document.getElementById('ssyRateInput');

    bindSync(depIn, depSl, 250, 150000, 250, recalc);
    bindSync(ageIn, ageSl, 0, 10, 1, recalc);
    if (rateIn) rateIn.addEventListener('input', recalc);

    function recalc() {
      const yearly = parseNumber(depIn.value);
      const childAge = parseInt(ageIn.value, 10) || 1;
      const rate = parseFloat(rateIn.value) || 8.2;

      let balance = 0;
      let totalInvested = 0;

      // 15 years deposit
      for (let y = 1; y <= 15; y++) {
        balance += yearly;
        totalInvested += yearly;
        const interest = balance * (rate / 100);
        balance += interest;
      }

      // Next 6 years compounding without deposit
      for (let y = 16; y <= 21; y++) {
        const interest = balance * (rate / 100);
        balance += interest;
      }

      const totalInterest = balance - totalInvested;

      const bD = document.getElementById('ssyDepositBadge'); if (bD) bD.textContent = '₹' + fmtINR(yearly);
      const bA = document.getElementById('ssyAgeBadge'); if (bA) bA.textContent = childAge + ' Years';

      animateNumber(document.getElementById('ssyMaturityVal'), balance);
      const wordsEl = document.getElementById('ssyMaturityWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(balance);

      animateNumber(document.getElementById('ssyInvestedVal'), totalInvested);
      animateNumber(document.getElementById('ssyInterestVal'), totalInterest);

      updateWhatsAppCta(
        document.getElementById('ssyWhatsAppBtn'),
        'Sukanya Samriddhi Yojana (SSY) Calculator',
        `Yearly Deposit: ₹${fmtINR(yearly)}, Child Age: ${childAge} yrs, Rate: ${rate}%, Tax-Free Maturity at 21: ₹${fmtINR(balance)}, Interest Earned: ₹${fmtINR(totalInterest)}`
      );
    }

    recalc();
  }

  /* ── 13. LIFE INSURANCE NEED CONTROLLER ────────────────────────────────── */
  function initLifeInsuranceWidget(widget) {
    const expIn = document.getElementById('insExpenseInput');
    const yrsIn = document.getElementById('insYearsInput');
    const debtsIn = document.getElementById('insDebtsInput');
    const goalsIn = document.getElementById('insGoalsInput');
    const assetsIn = document.getElementById('insAssetsInput');

    if (expIn) expIn.addEventListener('input', recalc);
    if (yrsIn) yrsIn.addEventListener('input', recalc);
    if (debtsIn) debtsIn.addEventListener('input', recalc);
    if (goalsIn) goalsIn.addEventListener('input', recalc);
    if (assetsIn) assetsIn.addEventListener('input', recalc);

    function recalc() {
      const annualExp = parseNumber(expIn.value);
      const years = parseInt(yrsIn.value, 10) || 20;
      const debts = parseNumber(debtsIn.value);
      const goals = parseNumber(goalsIn.value);
      const assets = parseNumber(assetsIn.value);

      const livingPool = annualExp * years;
      const debtsAndGoals = debts + goals;
      const totalNeeds = livingPool + debtsAndGoals;
      const netCover = Math.max(0, Math.ceil((totalNeeds - assets) / 100000) * 100000);

      animateNumber(document.getElementById('insCoverVal'), netCover);
      const wordsEl = document.getElementById('insCoverWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(netCover);

      animateNumber(document.getElementById('insExpensePool'), livingPool);
      animateNumber(document.getElementById('insDebtsGoals'), debtsAndGoals);
      animateNumber(document.getElementById('insCurrentAssets'), assets);

      updateWhatsAppCta(
        document.getElementById('insWhatsAppBtn'),
        'Life Insurance Need Calculator',
        `Living Pool: ₹${fmtINR(livingPool)}, Outstanding Debts & Goals: ₹${fmtINR(debtsAndGoals)}, Existing Assets: ₹${fmtINR(assets)}, Recommended Life Cover: ₹${fmtINR(netCover)}`
      );
    }

    recalc();
  }

  /* ── Universal Formula Accordion Toggle ─────────────────────────────────── */
  function initFormulaAccordions() {
    document.querySelectorAll('.calc-formula-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.toggle('open');
        const body = btn.parentElement.querySelector('.calc-formula-body');
        if (body) body.style.display = isOpen ? 'block' : 'none';
      });
    });
  }

  /* ── Universal FAQ Accordion Toggle ─────────────────────────────────────── */
  function initFAQAccordions() {
    document.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const answer = btn.parentElement.querySelector('.faq-answer-body');
        if (answer) answer.style.display = isOpen ? 'block' : 'none';
      });
    });
  }

  /* ── Hub Filtering & Instant Search Engine ──────────────────────────────── */
  function initHubFilters() {
    const chipBtns = document.querySelectorAll('.hub-chip-btn');
    const searchInput = document.getElementById('hubSearchInput');
    const cards = document.querySelectorAll('.hub-card');
    if (!cards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function filterCards() {
      cards.forEach(card => {
        const cat = card.dataset.category || '';
        const title = (card.querySelector('.hub-card-title') || {}).textContent || '';
        const desc = (card.querySelector('.hub-card-desc') || {}).textContent || '';
        const text = (title + ' ' + desc).toLowerCase();

        const matchCat = (activeCategory === 'all' || cat.toLowerCase() === activeCategory.toLowerCase());
        const matchSearch = (!searchQuery || text.includes(searchQuery.toLowerCase()));

        card.style.display = (matchCat && matchSearch) ? 'flex' : 'none';
      });
    }

    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        chipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category || 'all';
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        filterCards();
      });
    }
  }

  /* ── Mobile Drawer Toggle ───────────────────────────────────────────────── */
  function initMobileDrawer() {
    const toggle = document.getElementById('mobileToggle');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('drawerClose');
    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
      });
    }
    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      });
    }
  }

  /* ── Main Router on DOMContentLoaded ────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initFormulaAccordions();
    initFAQAccordions();
    initHubFilters();
    initMobileDrawer();

    const widget = document.getElementById('calcWidget');
    if (widget) {
      const type = widget.dataset.widgetType;
      if (type === 'eligibility') initEligibilityWidget(widget);
      else if (type === 'loan-emi') initLoanEmiWidget(widget);
      else if (type === 'comparison') initComparisonWidget(widget);
      else if (type === 'education-loan') initEducationLoanWidget(widget);
      else if (type === 'gold-loan') initGoldLoanWidget(widget);
      else if (type === 'lap') initLapWidget(widget);
      else if (type === 'fd') initFdWidget(widget);
      else if (type === 'rd') initRdWidget(widget);
      else if (type === 'dream-rd') initDreamRdWidget(widget);
      else if (type === 'sip') initSipWidget(widget);
      else if (type === 'ppf') initPpfWidget(widget);
      else if (type === 'ssy') initSsyWidget(widget);
      else if (type === 'life-insurance') initLifeInsuranceWidget(widget);
    }
  });

  window.MMCalc = {
    CONFIG,
    fmtINR,
    parseNumber,
    wordFormINR,
    calculateEmi,
    calculateFdMaturity,
    calculateRdMaturity,
    calculateSipMaturity,
    calculateLumpsumMaturity
  };

})();
