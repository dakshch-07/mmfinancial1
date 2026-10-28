/**
 * FINANCIAL CALCULATORS HUB & SUITE — calculators.js
 * MM Financial Services Consultant (Mukesh Tiwari)
 * 100% Client-side Vanilla JS engines for all calculators.
 */

const LAMF_CONFIG = {
  ltv: { equity: 0.45, debt: 0.80 },        // editable defaults
  ltvLimits: { equity: [0.30, 0.50], debt: [0.60, 0.85] },
  rate: { default: 10.5, min: 10.5, max: 15.0, step: 0.05 },
  daysInYear: 365,
  maxSchemes: 15,
  navApi: { search: "https://api.mfapi.in/mf/search?q=", latest: "https://api.mfapi.in/mf/{code}/latest" },
  debtKeywords: ["debt","liquid","overnight","gilt","money market","bond","duration","credit risk","banking & psu","floater","corporate bond","ultra short","low duration","short duration","medium duration","long duration","dynamic bond","fixed maturity"],
  whatsappNumber: "919594736833",            // Mukesh Tiwari
  phone: "+919594736833"
};

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
    },
    charges: {
      stampDutyRate: 0.003,
      govtBankLegalUnder1Cr: 6500,
      govtBankValuationUnder1Cr: 5500,
      govtBankLegal1CrTo5Cr: 13000,
      govtBankValuation1CrTo5Cr: 5500,
      govtBankLegalAbove5Cr: 13000,
      govtBankValuationAbove5Cr: 11000,
      govtBankPfOfferMin: 2500,
      govtBankPfOfferMax: 12000,            // 0.3% of loan amount (Fixed Govt Charges)
      noticeOfIntimationGovt: 15000,   // Loan amount up to 30 Lacs: 15,000 Govt
      noticeVendorMin: 1800,           // Vendor fee 1,800 - 3,000 as per bank
      noticeVendorMax: 3000,
      notaryFrankingMin: 3500,         // Notary & Franking with Document Charges 3,500 - 10,000 as per bank
      notaryFrankingMax: 10000
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

    /* ── Government Bank Legal, Valuation & PF Calculation Helper ── */
  function calcGovtBankFees(marketValue) {
    const mv = Number(marketValue) || 0;
    if (mv < 10000000) {
      return {
        legal: 6500,
        valuation: 5500,
        total: 12000,
        slab: "Under ₹1 Cr",
        breakdown: "₹6,500 + ₹5,500 (Legal + Valuation)"
      };
    } else if (mv < 50000000) {
      return {
        legal: 13000,
        valuation: 5500,
        total: 18500,
        slab: "₹1 Cr to ₹5 Cr",
        breakdown: "₹13,000 (2 Legal ₹6,500+₹6,500) + ₹5,500 (Valuation)"
      };
    } else {
      return {
        legal: 13000,
        valuation: 11000,
        total: 24000,
        slab: "₹5 Cr & Above",
        breakdown: "₹13,000 (Legal) + ₹11,000 (Valuation)"
      };
    }
  }

function parseNumber(val) {
    if (typeof val === 'number') return isFinite(val) ? val : 0;
    const clean = String(val || '').replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isFinite(num) && num >= 0 ? num : 0;
  }

  function badgeWordINR(val) {
    if (!isFinite(val) || val <= 0) return '₹0';
    if (val >= 1e7) {
      const cr = (val / 1e7).toFixed(2).replace(/\.?0+$/, '');
      return '₹' + cr + ' Cr (' + cr + ' Crore)';
    }
    if (val >= 1e5) {
      const lk = (val / 1e5).toFixed(2).replace(/\.?0+$/, '');
      return '₹' + lk + ' Lakh';
    }
    if (val >= 1e3) {
      const th = (val / 1e3).toFixed(1).replace(/\.?0+$/, '');
      return '₹' + th + ' Thousand';
    }
    return '₹' + fmtINR(val);
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
      let val = isFloat ? (parseFloat(inputEl.value) || 0) : parseNumber(inputEl.value);
      if (val > 0) val = Math.max(curMin, Math.min(curMax, val));
      inputEl.value = val === 0 ? '' : (isFloat ? val.toFixed(2) : fmtINR(val));
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
  
  /* ── 15. Dropline Overdraft (DOD) Loan Calculator ───────────────────────── */
  function initDroplineOdWidget(widget) {
    const limitIn = widget.querySelector('#dodLimitInput');
    const limitSl = widget.querySelector('#dodLimitSlider');
    const limitBadge = widget.querySelector('#dodLimitBadge');

    const rateIn = widget.querySelector('#dodRateInput');
    const rateSl = widget.querySelector('#dodRateSlider');
    const rateBadge = widget.querySelector('#dodRateBadge');

    const tenureIn = widget.querySelector('#dodTenureInput');
    const tenureSl = widget.querySelector('#dodTenureSlider');
    const tenureBadge = widget.querySelector('#dodTenureBadge');

    const utilIn = widget.querySelector('#dodUtilInput');
    const utilSl = widget.querySelector('#dodUtilSlider');
    const utilBadge = widget.querySelector('#dodUtilBadge');

    const emiIn = widget.querySelector('#dodEmiInput');
    const emiSl = widget.querySelector('#dodEmiSlider');
    const emiBadge = widget.querySelector('#dodEmiBadge');

    const monthlyDropDisplay = widget.querySelector('#dodMonthlyDropDisplay');
    const monthlyDropWords = widget.querySelector('#dodMonthlyDropWords');
    const firstMonthInterest = widget.querySelector('#dodFirstMonthInterest');
    const dailyInterest = widget.querySelector('#dodDailyInterest');
    const totalDropVal = widget.querySelector('#dodTotalDropVal');
    const totalInterestVal = widget.querySelector('#dodTotalInterestVal');
    const scheduleTbody = document.getElementById('dodScheduleTableBody');
    const btnDownloadDodCsv = document.getElementById('btnDownloadDodCsv');
    const chargesContainer = widget.querySelector('.statutory-charges-box');
    const waBtn = widget.querySelector('#dodWhatsAppBtn');

    let currentDodSchedule = [];

    syncInputSlider(limitIn, limitSl, limitBadge, 'currency');
    syncInputSlider(rateIn, rateSl, rateBadge, 'percent');
    syncInputSlider(tenureIn, tenureSl, tenureBadge, 'custom', function (v) {
      const yrs = parseInt(v, 10) || 1;
      return yrs + ' Years (' + (yrs * 12) + ' Months)';
    });
    syncInputSlider(utilIn, utilSl, utilBadge, 'custom', function (v) {
      return (parseInt(v, 10) || 80) + '% Utilized';
    });
    syncInputSlider(emiIn, emiSl, emiBadge, 'currency');

    function calculateDod() {
      const limit = parseNumber(limitIn ? limitIn.value : 5000000);
      const rate = parseFloat(rateIn ? rateIn.value : 9.25) || 9.25;
      const tenureYears = parseInt(tenureIn ? tenureIn.value : 5, 10) || 5;
      const tenureMonths = Math.max(1, tenureYears * 12);
      const utilPct = Math.min(100, Math.max(5, parseFloat(utilIn ? utilIn.value : 80) || 80));

      const monthlyDrop = limit / tenureMonths;
      
      currentDodSchedule = [];
      let currentLimit = limit;
      let totalInterest = 0;
      const monthlyRate = (rate / 100) / 12;

      for (let m = 1; m <= tenureMonths; m++) {
        const openingLimit = currentLimit;
        const closingLimit = Math.max(0, openingLimit - monthlyDrop);
        const utilizedAmount = (openingLimit * (utilPct / 100));
        const monthInterest = utilizedAmount * monthlyRate;
        totalInterest += monthInterest;

        currentDodSchedule.push({
          month: m,
          openingLimit: openingLimit,
          monthlyDrop: monthlyDrop,
          closingLimit: closingLimit,
          interest: monthInterest,
          principalDrop: monthlyDrop
        });

        currentLimit = closingLimit;
      }

      const firstMonthUtilized = limit * (utilPct / 100);
      const firstMonthInt = firstMonthUtilized * monthlyRate;
      const dailyInt = (firstMonthUtilized * (rate / 100)) / 365;

      if (monthlyDropDisplay) monthlyDropDisplay.textContent = '₹' + fmtINR(monthlyDrop);
      if (monthlyDropWords) monthlyDropWords.textContent = formatCurrencyWords(monthlyDrop);
      if (firstMonthInterest) firstMonthInterest.textContent = fmtINR(firstMonthInt);
      if (dailyInterest) dailyInterest.textContent = fmtINR(dailyInt);
      if (totalDropVal) totalDropVal.textContent = fmtINR(limit);
      if (totalInterestVal) totalInterestVal.textContent = fmtINR(totalInterest);

      if (scheduleTbody) {
        scheduleTbody.innerHTML = '';
        currentDodSchedule.forEach(function (row) {
          const tr = document.createElement('tr');
          tr.innerHTML = '<td>Month ' + row.month + '</td>' +
            '<td>₹' + fmtINR(row.openingLimit) + '</td>' +
            '<td style="color: #dc2626; font-weight: 600;">-₹' + fmtINR(row.monthlyDrop) + '</td>' +
            '<td style="font-weight: 700; color: var(--color-navy);">₹' + fmtINR(row.closingLimit) + '</td>' +
            '<td style="color: #b45309;">₹' + fmtINR(row.interest) + '</td>' +
            '<td style="color: #15803d; font-weight: 600;">₹' + fmtINR(row.principalDrop) + '</td>';
          scheduleTbody.appendChild(tr);
        });
      }

      if (chargesContainer) {
        const stampDuty = Math.round(limit * CONFIG.defaults.charges.stampDutyRate);
        const stampEl = chargesContainer.querySelector('.charge-stamp-duty');
        if (stampEl) stampEl.textContent = '₹' + fmtINR(stampDuty);
        const baseDisplayEl = chargesContainer.querySelector('.charges-loan-base-display');
        if (baseDisplayEl) baseDisplayEl.textContent = limit > 0 ? ('(₹' + fmtINR(limit) + ')') : '';

        const govtFees = calcGovtBankFees(limit);
        const govtLegalValEl = chargesContainer.querySelector('.govt-legal-valuation-val');
        const govtSlabEl = chargesContainer.querySelector('.govt-legal-valuation-slab');
        if (govtLegalValEl) govtLegalValEl.textContent = '₹' + fmtINR(govtFees.total);
        if (govtSlabEl) govtSlabEl.textContent = '(' + govtFees.breakdown + ')';

        const dodPfIn = widget.querySelector('#dodPfInput');
        const dodInsIn = widget.querySelector('#dodInsuranceInput');
        const dodTotBox = widget.querySelector('#dodCustomChargesTotal');
        const dodTotVal = widget.querySelector('#dodCustomChargesTotalVal');

        let pfVal = parseNumber((dodPfIn && dodPfIn.value) || 0);
        if (pfVal === 0 && limit > 0) {
          pfVal = Math.round(limit * (0.0025 * 1.18));
          if (dodPfIn && !dodPfIn.dataset.userEdited) {
            dodPfIn.placeholder = '₹' + fmtINR(pfVal) + ' (0.25%+GST)';
          }
        }

        let insVal = parseNumber((dodInsIn && dodInsIn.value) || 0);
        if (insVal === 0 && limit > 0) {
          insVal = Math.round(limit * 0.02);
          if (dodInsIn && !dodInsIn.dataset.userEdited) {
            dodInsIn.placeholder = '₹' + fmtINR(insVal) + ' (2% Life / Property)';
          }
        }

        const totalCharges = pfVal + insVal;
        if (dodTotBox && dodTotVal) {
          dodTotBox.style.display = totalCharges > 0 ? 'block' : 'none';
          dodTotVal.textContent = '₹' + fmtINR(totalCharges);
        }
      }

      if (waBtn) {
        const lines = [
          'Hi Mukesh ji, I checked the Dropline Overdraft (DOD) Calculator on your portal:',
          '• Sanctioned Limit: ₹' + fmtINR(limit),
          '• Tenure: ' + tenureYears + ' Years (' + tenureMonths + ' Months)',
          '• Interest Rate: ' + rate + '% p.a.',
          '• Monthly Limit Drop: ₹' + fmtINR(monthlyDrop) + '/month',
          '• Est. First Month Interest: ₹' + fmtINR(firstMonthInt),
          'Please advise on best bank sanction and Govt Bank offer rates.'
        ];
        waBtn.href = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(lines.join('\n'));
      }
    }

    [limitIn, limitSl, rateIn, rateSl, tenureIn, tenureSl, utilIn, utilSl, emiIn, emiSl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', calculateDod);
      el.addEventListener('change', calculateDod);
    });

    const dodPfIn = widget.querySelector('#dodPfInput');
    const dodInsIn = widget.querySelector('#dodInsuranceInput');
    [dodPfIn, dodInsIn].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        input.dataset.userEdited = 'true';
        calculateDod();
      });
    });

    if (btnDownloadDodCsv) {
      btnDownloadDodCsv.addEventListener('click', function () {
        if (!currentDodSchedule || !currentDodSchedule.length) return;
        let csv = 'Month,Opening Limit (INR),Monthly Drop (INR),Closing Limit (INR),Estimated Monthly Interest (INR),Principal Reduction (INR)\n';
        currentDodSchedule.forEach(function (r) {
          csv += [
            r.month,
            Math.round(r.openingLimit),
            Math.round(r.monthlyDrop),
            Math.round(r.closingLimit),
            Math.round(r.interest),
            Math.round(r.principalDrop)
          ].join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'Dropline_Overdraft_Schedule.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    calculateDod();
  }

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

    // 3 to 6 Months Salary Average Controller
    const salAvgToggleBtn = document.getElementById('salAvgToggleBtn');
    const salAvgContainer = document.getElementById('salAvgContainer');
    const salAvgToggleIcon = document.getElementById('salAvgToggleIcon');
    const btnAvg3Mo = document.getElementById('btnAvg3Mo');
    const btnAvg6Mo = document.getElementById('btnAvg6Mo');
    const salMo4to6Row = document.getElementById('salMo4to6Row');
    const salAvgDisplayVal = document.getElementById('salAvgDisplayVal');
    const btnApplyAvgSalary = document.getElementById('btnApplyAvgSalary');
    let salAvgMonthsCount = 3;

    if (salAvgToggleBtn && salAvgContainer) {
      salAvgToggleBtn.addEventListener('click', () => {
        const isOpen = salAvgContainer.style.display !== 'none';
        salAvgContainer.style.display = isOpen ? 'none' : 'block';
        if (salAvgToggleIcon) salAvgToggleIcon.textContent = isOpen ? '+ Open' : '− Close';
      });
    }

    function computeSalaryAverage() {
      const m1 = parseNumber((document.getElementById('salMo1') || {}).value);
      const m2 = parseNumber((document.getElementById('salMo2') || {}).value);
      const m3 = parseNumber((document.getElementById('salMo3') || {}).value);
      let total = m1 + m2 + m3;
      let count = salAvgMonthsCount;
      if (salAvgMonthsCount === 6) {
        const m4 = parseNumber((document.getElementById('salMo4') || {}).value);
        const m5 = parseNumber((document.getElementById('salMo5') || {}).value);
        const m6 = parseNumber((document.getElementById('salMo6') || {}).value);
        total += m4 + m5 + m6;
      }
      const avg = count > 0 ? Math.round(total / count) : 0;
      if (salAvgDisplayVal) salAvgDisplayVal.textContent = '₹' + fmtINR(avg);
      return avg;
    }

    if (btnAvg3Mo && btnAvg6Mo) {
      btnAvg3Mo.addEventListener('click', () => {
        salAvgMonthsCount = 3;
        btnAvg3Mo.style.background = '#eff6ff';
        btnAvg3Mo.style.color = '#1d4ed8';
        btnAvg3Mo.style.borderColor = '#3b82f6';
        btnAvg6Mo.style.background = '#ffffff';
        btnAvg6Mo.style.color = '#64748b';
        btnAvg6Mo.style.borderColor = '#cbd5e1';
        if (salMo4to6Row) salMo4to6Row.style.display = 'none';
        computeSalaryAverage();
      });

      btnAvg6Mo.addEventListener('click', () => {
        salAvgMonthsCount = 6;
        btnAvg6Mo.style.background = '#eff6ff';
        btnAvg6Mo.style.color = '#1d4ed8';
        btnAvg6Mo.style.borderColor = '#3b82f6';
        btnAvg3Mo.style.background = '#ffffff';
        btnAvg3Mo.style.color = '#64748b';
        btnAvg3Mo.style.borderColor = '#cbd5e1';
        if (salMo4to6Row) salMo4to6Row.style.display = 'grid';
        computeSalaryAverage();
      });
    }

    ['salMo1', 'salMo2', 'salMo3', 'salMo4', 'salMo5', 'salMo6'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', computeSalaryAverage);
        el.addEventListener('blur', () => {
          const v = parseNumber(el.value);
          if (v > 0) el.value = '₹' + fmtINR(v);
        });
      }
    });

    if (btnApplyAvgSalary) {
      btnApplyAvgSalary.addEventListener('click', () => {
        const avg = computeSalaryAverage();
        if (avg > 0) {
          const salIn = document.getElementById('salSalaryInput');
          const salSl = document.getElementById('salSalarySlider');
          if (salIn) salIn.value = '₹' + fmtINR(avg);
          if (salSl) {
            salSl.value = avg;
            updateSliderFill(salSl);
          }
          const salB = document.getElementById('salSalaryBadge');
          if (salB) salB.textContent = badgeWordINR(avg);
          recalc();
        }
      });
    }

    // Live red badge update & recalculation on Manual Loan Amount Required
    const eligReqAmtIn = document.getElementById('eligReqLoanInput');
    const eligReqBadge = document.getElementById('eligReqLoanBadge');
    if (eligReqAmtIn) {
      eligReqAmtIn.addEventListener('input', () => {
        const val = parseNumber(eligReqAmtIn.value);
        if (eligReqBadge) eligReqBadge.textContent = badgeWordINR(val);
        recalc();
      });
      eligReqAmtIn.addEventListener('blur', () => {
        const val = parseNumber(eligReqAmtIn.value);
        if (val > 0) eligReqAmtIn.value = '₹' + fmtINR(val);
        if (eligReqBadge) eligReqBadge.textContent = badgeWordINR(val);
      });
    }

    // Rental Program LRD Controls
    const lrdProgramFields = document.getElementById('lrdProgramFields');
    const lrdRentIn = document.getElementById('lrdRentInput');
    const lrdFoirIn = document.getElementById('lrdFoirInput');
    const lrdFoirSl = document.getElementById('lrdFoirSlider');

    if (lrdRentIn) {
      lrdRentIn.addEventListener('input', recalc);
      lrdRentIn.addEventListener('blur', () => {
        const val = parseNumber(lrdRentIn.value);
        if (val > 0) lrdRentIn.value = '₹' + fmtINR(val);
      });
    }
    if (lrdFoirIn && lrdFoirSl) {
      bindSync(lrdFoirIn, lrdFoirSl, 65, 85, 1, recalc, true);
    }

    const salCompCatGroup = document.getElementById('salCompCatGroup');
    const salCustomFoirIn = document.getElementById('salCustomFoirInput');
    const salCustomFoirSl = document.getElementById('salCustomFoirSlider');
    const salCompFoirBadge = document.getElementById('salCompFoirBadge');
    let salFoirUserManual = false;

    if (salCustomFoirIn) {
      if (salCustomFoirSl) bindSync(salCustomFoirIn, salCustomFoirSl, 60, 70, 1, recalc, true);

      salCustomFoirIn.addEventListener('input', () => {
        salFoirUserManual = true;
        let v = parseFloat(salCustomFoirIn.value);
        if (!isNaN(v) && salCompFoirBadge) {
          if (v > 70) v = 70;
          salCompFoirBadge.textContent = v + '% FOIR';
        }
        recalc();
      });
      salCustomFoirIn.addEventListener('blur', () => {
        let v = parseFloat(salCustomFoirIn.value);
        if (isNaN(v) || v < 60) v = 60;
        if (v > 70) v = 70;
        salCustomFoirIn.value = v;
        if (salCustomFoirSl) {
          salCustomFoirSl.value = v;
          updateSliderFill(salCustomFoirSl);
        }
        if (salCompFoirBadge) salCompFoirBadge.textContent = v + '% FOIR';
        recalc();
      });
    }

    if (salCustomFoirSl) {
      salCustomFoirSl.addEventListener('input', () => {
        salFoirUserManual = true;
      });
    }

    // Bind Business inputs (2 Years ITR, Depreciation, Salary/Remuneration, Rent, Obligations)
    bindSync(document.getElementById('bizProfitInput'), document.getElementById('bizProfitSlider'), 100000, 20000000, 25000, recalc);
    bindSync(document.getElementById('bizProfit2Input'), document.getElementById('bizProfit2Slider'), 100000, 20000000, 25000, recalc);
    bindSync(document.getElementById('bizDepreciationInput'), document.getElementById('bizDepreciationSlider'), 0, 5000000, 10000, recalc);
    bindSync(document.getElementById('bizSalaryInput'), document.getElementById('bizSalarySlider'), 0, 5000000, 10000, recalc);
    bindSync(document.getElementById('bizRentInput'), document.getElementById('bizRentSlider'), 0, 500000, 1000, recalc);
    bindSync(document.getElementById('bizEmiInput'), document.getElementById('bizEmiSlider'), 0, 1000000, 1000, recalc);

    // Business Turnover Program (2% to 7% Multiplier)
    const bizProgSel = document.getElementById('bizProgramSelect');
    const turnoverFields = document.getElementById('turnoverProgramFields');
    const itrFields = document.getElementById('itrProgramFields');
    const bizTurnoverIn = document.getElementById('bizTurnoverInput');
    const bizTurnoverSl = document.getElementById('bizTurnoverSlider');
    const bizTurnoverPctIn = document.getElementById('bizTurnoverPctInput');
    const bizTurnoverPctSl = document.getElementById('bizTurnoverPctSlider');

    const bizTurnoverYear2In = document.getElementById('bizTurnoverYear2Input');
    const bizTurnoverYear2Sl = document.getElementById('bizTurnoverYear2Slider');

    if (bizTurnoverIn && bizTurnoverSl) {
      bindSync(bizTurnoverIn, bizTurnoverSl, 1000000, 500000000, 500000, recalc);
    }
    if (bizTurnoverYear2In && bizTurnoverYear2Sl) {
      bindSync(bizTurnoverYear2In, bizTurnoverYear2Sl, 1000000, 500000000, 500000, recalc);
    }
    if (bizTurnoverPctIn) {
      if (bizTurnoverPctSl) bindSync(bizTurnoverPctIn, bizTurnoverPctSl, 1.0, 20.0, 0.1, recalc, true);
      bizTurnoverPctIn.addEventListener('input', () => {
        const opt = bizIndustrySel ? bizIndustrySel.options[bizIndustrySel.selectedIndex] : null;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 20.0) : 20.0;
        let v = parseFloat(bizTurnoverPctIn.value);
        if (!isNaN(v) && v > maxVal) {
          bizTurnoverPctIn.value = maxVal.toFixed(1);
        }
        recalc();
      });
      bizTurnoverPctIn.addEventListener('blur', () => {
        const opt = bizIndustrySel ? bizIndustrySel.options[bizIndustrySel.selectedIndex] : null;
        const minVal = opt ? (parseFloat(opt.dataset.min) || 1.0) : 1.0;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 20.0) : 20.0;
        let v = parseFloat(bizTurnoverPctIn.value);
        if (isNaN(v) || v < minVal) v = minVal;
        if (v > maxVal) v = maxVal;
        bizTurnoverPctIn.value = v.toFixed(1);
        recalc();
      });
    }

    const bizIndustrySel = document.getElementById('bizIndustrySelect');
    const bizTurnoverMinLim = document.getElementById('bizTurnoverMinLimit');
    const bizTurnoverMaxLim = document.getElementById('bizTurnoverMaxLimit');
    const bizTurnoverNote = document.getElementById('bizTurnoverNote');

    if (bizIndustrySel) {
      bizIndustrySel.addEventListener('change', () => {
        const opt = bizIndustrySel.options[bizIndustrySel.selectedIndex];
        const minVal = parseFloat(opt.dataset.min) || 1.0;
        const maxVal = parseFloat(opt.dataset.max) || 20.0;
        const defVal = parseFloat(opt.dataset.def) || 5.0;

        if (bizTurnoverPctSl) {
          bizTurnoverPctSl.min = minVal;
          bizTurnoverPctSl.max = maxVal;
          bizTurnoverPctSl.step = (minVal === maxVal) ? 0.1 : 0.1;
          bizTurnoverPctSl.value = defVal;
          updateSliderFill(bizTurnoverPctSl);
        }
        const isMultiplier = opt.dataset.isMultiplier === 'true' || opt.value === 'doctor' || opt.value === 'ca' || opt.value === 'cs';
        const prefixEl = document.getElementById('bizTurnoverPrefix');
        const labelEl = document.getElementById('bizTurnoverPctLabel');
        if (prefixEl) prefixEl.textContent = isMultiplier ? 'x' : '%';
        if (labelEl) labelEl.textContent = isMultiplier ? 'Gross Receipts Multiplier (Times)' : 'Manual Net Cash Margin % (Editable)';

        if (bizTurnoverPctIn) {
          bizTurnoverPctIn.value = isMultiplier ? defVal.toString() : defVal.toFixed(1);
        }
        if (bizTurnoverMinLim && bizTurnoverMaxLim) {
          bizTurnoverMinLim.textContent = isMultiplier ? minVal + 'x (Min)' : minVal.toFixed(1) + '% (Min)';
          bizTurnoverMaxLim.textContent = isMultiplier ? maxVal + 'x (Max)' : maxVal.toFixed(1) + '% (Max)';
        }
        if (bizTurnoverNote) {
          const notes = {
            mfg: 'Manufacturing norm: 10% to 15% of annual turnover treated as derived cash profit.',
            services: 'Services sector norm: 10% to 15% of annual turnover treated as derived cash profit.',
            trader: 'Trading / Retail norm: 5% to 10% of annual turnover treated as derived cash profit.',
            ca: 'Chartered Accountant (CA): 2% to 3% of annual gross professional receipts.',
            cs: 'Company Secretary (CS): 1.5% of annual gross professional receipts.',
            doctor: 'Doctor (MBBS / Specialist): 2% to 3% of annual gross professional receipts.',
            custom: 'Custom multiplier applied to annual turnover as accepted by specific lender.'
          };
          bizTurnoverNote.textContent = notes[bizIndustrySel.value] || 'Bank benchmark applied.';
        }

        const isReceipt = (bizIndustrySel.value === 'doctor' || bizIndustrySel.value === 'ca' || bizIndustrySel.value === 'cs');
        const l1 = document.getElementById('bizTurnoverLabel');
        const l2 = document.getElementById('bizTurnoverYear2Label');
        const lAvg = document.getElementById('bizAvgTurnoverLabel');
        if (l1) l1.textContent = isReceipt ? 'Current Financial Year Gross Receipts / Fees (₹)' : 'Current Financial Year Gross Turnover (₹)';
        if (l2) l2.textContent = isReceipt ? 'Previous Financial Year Gross Receipts / Fees (₹)' : 'Previous Financial Year Gross Turnover (₹)';
        if (lAvg) lAvg.textContent = isReceipt ? '2-Year Average Gross Receipts:' : '2-Year Average Turnover:';

        recalc();
      });
    }

    if (bizProgSel) {
      bizProgSel.addEventListener('change', () => {
        const val = bizProgSel.value;
        const isTurnover = val === 'turnover';
        const isLrd = val === 'lrd';
        if (turnoverFields) turnoverFields.style.display = isTurnover ? 'block' : 'none';
        if (lrdProgramFields) lrdProgramFields.style.display = isLrd ? 'block' : 'none';
        if (itrFields) itrFields.style.display = (!isTurnover && !isLrd) ? 'block' : 'none';
        recalc();
      });
    }

    const isPersonal = widget.dataset.calcId === 'personal-loan-eligibility-calculator';
    const defaultRate = isPersonal ? 11.0 : 8.75;
    const maxTenure = isPersonal ? 7 : 30;

    const cibilSel = document.getElementById('eligCibilSelect');
    const cibilBadge = document.getElementById('eligCibilBadge');

    if (cibilSel) {
      cibilSel.addEventListener('change', () => {
        const val = cibilSel.value;
        if (cibilBadge) {
          if (val === '750-900' || val === '750+' || val === '800+') {
            cibilBadge.textContent = (val === '750-900' || val === '750+') ? '750 - 900 (Manual ROI)' : '800 - 900 (Super Prime)';
          } else {
            cibilBadge.textContent = val;
          }
        }
        // Benchmark rate adjustments based on CIBIL (750-900 allows manual rate entry)
        let base = defaultRate;
        if (val === '750-900' || val === '750+') {
          // Keep current manual interest rate untouched or default prime
          const rateIn = document.getElementById('eligRateInput');
          if (rateIn && parseFloat(rateIn.value) > 0) base = parseFloat(rateIn.value);
        } else if (val === '700-749') base += 0.25;
        else if (val === '650-699') base += 0.75;
        else if (val === 'Below 650') base += 1.50;
        else if (val === 'New to Credit') base += 0.50;

        const rateIn = document.getElementById('eligRateInput');
        const rateSl = document.getElementById('eligRateSlider');
        if (rateIn && (val !== '750-900' && val !== '750+')) rateIn.value = base.toFixed(2);
        if (rateSl) rateSl.value = base.toFixed(2);
        recalc();
      });
    }

    bindSync(document.getElementById('eligRateInput'), document.getElementById('eligRateSlider'), 6.0, 24.0, 0.05, recalc, true);
    bindSync(document.getElementById('eligTenureInput'), document.getElementById('eligTenureSlider'), 1, maxTenure, 1, recalc);

    // Personal Loan Tenure Unit Switcher (Years 1-7 or Months 12-84)
    let currentEligTenureUnit = 'years';
    const eligTenureIn = document.getElementById('eligTenureInput');
    const eligTenureSl = document.getElementById('eligTenureSlider');
    const eligTenureLabel = document.getElementById('eligTenureLabel');
    const eligTenurePrefix = document.getElementById('eligTenurePrefix');
    const eligTenureLimits = document.querySelectorAll('#eligTenureLimits span');
    const eligUnitBtns = widget.querySelectorAll('.tenure-unit-toggle .tenure-unit-btn');

    if (eligUnitBtns && eligUnitBtns.length > 0) {
      eligUnitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetUnit = btn.dataset.unit;
          if (targetUnit === currentEligTenureUnit) return;
          currentEligTenureUnit = targetUnit;
          eligUnitBtns.forEach(b => b.classList.toggle('active', b === btn));

          if (currentEligTenureUnit === 'months') {
            const currentYrs = parseFloat(eligTenureIn ? eligTenureIn.value : 5) || 5;
            const moVal = Math.max(12, Math.min(84, Math.round(currentYrs * 12)));
            if (eligTenureSl) {
              eligTenureSl.min = 12;
              eligTenureSl.max = 84;
              eligTenureSl.step = 1;
              eligTenureSl.value = moVal;
              updateSliderFill(eligTenureSl);
            }
            if (eligTenureIn) eligTenureIn.value = moVal;
            if (eligTenureLabel) eligTenureLabel.textContent = 'Loan Tenure (Months)';
            if (eligTenurePrefix) eligTenurePrefix.textContent = 'Mo';
            if (eligTenureLimits && eligTenureLimits.length >= 2) {
              eligTenureLimits[0].textContent = '12 Months';
              eligTenureLimits[1].textContent = '84 Months';
            }
          } else {
            const currentMos = parseFloat(eligTenureIn ? eligTenureIn.value : 60) || 60;
            const yrVal = Math.max(1, Math.min(7, Math.round(currentMos / 12) || 1));
            if (eligTenureSl) {
              eligTenureSl.min = 1;
              eligTenureSl.max = 7;
              eligTenureSl.step = 1;
              eligTenureSl.value = yrVal;
              updateSliderFill(eligTenureSl);
            }
            if (eligTenureIn) eligTenureIn.value = yrVal;
            if (eligTenureLabel) eligTenureLabel.textContent = 'Loan Tenure (Years)';
            if (eligTenurePrefix) eligTenurePrefix.textContent = 'Yr';
            if (eligTenureLimits && eligTenureLimits.length >= 2) {
              eligTenureLimits[0].textContent = '1 Year';
              eligTenureLimits[1].textContent = '7 Years';
            }
          }
          recalc();
        });
      });
    }

    function recalc() {
      const rate = parseFloat((document.getElementById('eligRateInput') || {}).value) || defaultRate;
      const rawTenure = parseFloat((document.getElementById('eligTenureInput') || {}).value) || (isPersonal ? (currentEligTenureUnit === 'months' ? 60 : 5) : 20);
      const tenureMonths = currentEligTenureUnit === 'months' ? rawTenure : (rawTenure * 12);
      const tenure = tenureMonths / 12;

      // FOIR requirements:
      // Personal Loan = 65% (0.65)
      // Home Loan & LAP = 60% (0.60)
      let appliedFoir = isPersonal ? CONFIG.defaults.foir.personalLoanFoir : CONFIG.defaults.foir.homeLoanFoir;

      let eligibleIncome = 0;
      let existingEmi = 0;

      if (profile === 'salaried') {
        const salary = parseNumber((document.getElementById('salSalaryInput') || {}).value);
        const bonus = parseNumber((document.getElementById('salBonusInput') || {}).value);
        const rent = parseNumber((document.getElementById('salRentInput') || {}).value);
        existingEmi = parseNumber((document.getElementById('salEmiInput') || {}).value);

        // Salaried FOIR is fixed at 65% for ANY salary amount by default.
        // It ONLY changes if the user manually edits / moves the FOIR slider.
        let salFoir = 0.65;
        const customVal = salCustomFoirIn ? parseFloat(salCustomFoirIn.value) : null;
        if (salFoirUserManual && customVal && !isNaN(customVal) && customVal >= 30 && customVal <= 85) {
          salFoir = customVal / 100;
        } else {
          salFoir = 0.65;
          if (salCustomFoirIn && salCustomFoirIn.value != 65) {
            salCustomFoirIn.value = 65;
            if (salCustomFoirSl) {
              salCustomFoirSl.value = 65;
              updateSliderFill(salCustomFoirSl);
            }
            if (salCompFoirBadge) salCompFoirBadge.textContent = '65% FOIR';
          }
        }

        appliedFoir = salFoir;

        // Salaried: FOIR applied to net monthly salary + 50% bonus/12 + 50% rent
        const monthlyEquivalent = salary + (bonus / 12 * 0.5) + (rent * 0.5);
        eligibleIncome = monthlyEquivalent * appliedFoir;
      } else {
        // Business / Self-Employed Assessment: Net Profit (ITR) OR Turnover Program (2% - 7%)
        const isTurnoverProg = (bizProgSel && bizProgSel.value === 'turnover');
        let totalMonthlyBusinessIncome = 0;

        const isLrdProg = (bizProgSel && bizProgSel.value === 'lrd');
        const isLrdIndustry = (bizProgSel && bizProgSel.value === 'turnover' && bizIndustrySel && bizIndustrySel.value === 'lrd');

        if (isLrdProg || isLrdIndustry) {
          // Rental Program LRD (Lease Rental Discounting)
          // RENT * 65-85% = VALUE AND LESS OBLIGATION / PER LAKHS EMI = LOAN AMOUNT
          const rentVal = parseNumber((document.getElementById('lrdRentInput') || {}).value) || parseNumber((document.getElementById('bizRentInput') || {}).value) || parseNumber((document.getElementById('bizTurnoverInput') || {}).value);
          const lrdFoir = parseFloat((document.getElementById('lrdFoirInput') || {}).value) || 75;
          const discountedRent = Math.round(rentVal * (lrdFoir / 100));

          totalMonthlyBusinessIncome = discountedRent;
          appliedFoir = 1.0;

          const lrdRentB = document.getElementById('lrdRentBadge'); if (lrdRentB) lrdRentB.textContent = badgeWordINR(rentVal);
          const lrdFoirB = document.getElementById('lrdFoirBadge'); if (lrdFoirB) lrdFoirB.textContent = lrdFoir + '% FOIR';
          const lrdNetB = document.getElementById('lrdNetRentBadge'); if (lrdNetB) lrdNetB.textContent = '₹' + fmtINR(discountedRent) + ' / mo';
        } else if (isTurnoverProg) {
          const turnover1 = parseNumber((document.getElementById('bizTurnoverInput') || {}).value);
          const turnover2 = parseNumber((document.getElementById('bizTurnoverYear2Input') || {}).value);
          const avgTurnover = (turnover1 > 0 && turnover2 > 0) ? Math.round((turnover1 + turnover2) / 2) : (turnover1 || turnover2 || 0);
          const opt = bizIndustrySel ? bizIndustrySel.options[bizIndustrySel.selectedIndex] : null;
          const isMultiplier = opt && (opt.dataset.isMultiplier === 'true' || opt.value === 'doctor' || opt.value === 'ca' || opt.value === 'cs');
          const turnoverPct = parseFloat((document.getElementById('bizTurnoverPctInput') || {}).value) || (isMultiplier ? 3.0 : 5.0);

          let annualDerivedIncome = 0;
          if (isMultiplier) {
            // Doctor / Professional: 3x Gross Receipts
            annualDerivedIncome = avgTurnover * turnoverPct;
            totalMonthlyBusinessIncome = Math.round(annualDerivedIncome / 12);
            appliedFoir = 1.0; // Monthly income directly available for EMI capacity
          } else {
            // Manufacturing / Services / Trader: Turnover * Margin %
            annualDerivedIncome = avgTurnover * (turnoverPct / 100);
            appliedFoir = 0.85; // 85% FOIR as specified
            totalMonthlyBusinessIncome = Math.round((annualDerivedIncome * appliedFoir) / 12);
          }

          // Add-backs: Rent & Remuneration
          const remun = parseNumber((document.getElementById('bizSalaryInput') || {}).value);
          const rent = parseNumber((document.getElementById('bizRentInput') || {}).value);
          totalMonthlyBusinessIncome += (remun / 12) + (rent * 0.5);

          const bT = document.getElementById('bizTurnoverBadge'); if (bT) bT.textContent = badgeWordINR(turnover1);
          const bT2 = document.getElementById('bizTurnoverYear2Badge'); if (bT2) bT2.textContent = badgeWordINR(turnover2);
          const bAvg = document.getElementById('bizAvgTurnoverBadge'); if (bAvg) bAvg.textContent = badgeWordINR(avgTurnover);
          const bTP = document.getElementById('bizTurnoverPctBadge'); if (bTP) bTP.textContent = isMultiplier ? turnoverPct + 'x' : turnoverPct.toFixed(1) + '%';
          const bMon = document.getElementById('bizMonthlyIncomeBadge'); if (bMon) bMon.textContent = '₹' + fmtINR(Math.round(totalMonthlyBusinessIncome)) + ' / mo';
          // formula text removed as per user instruction
        } else {
          // 2-Year ITR assessment (24 Months / 12 Months)
          const profit1 = parseNumber((document.getElementById('bizProfitInput') || {}).value);
          const profit2 = parseNumber((document.getElementById('bizProfit2Input') || {}).value);
          const depr = parseNumber((document.getElementById('bizDepreciationInput') || {}).value);
          const remun = parseNumber((document.getElementById('bizSalaryInput') || {}).value);
          const rent = parseNumber((document.getElementById('bizRentInput') || {}).value);

          // 2 Years Income Average: (Year 1 + Year 2) / 24 months = Monthly Profit
          const total2YrProfit = profit1 + profit2;
          const avgAnnualProfit = total2YrProfit / 2;
          const monthlyProfit = total2YrProfit / 24;

          // Add-backs: Annual Depreciation / 12, Annual Salary/Remuneration / 12, Monthly Rent
          const monthlyDepr = depr / 12;
          const monthlyRemun = remun / 12;
          const monthlyRent = rent * 0.5;

          // Total Monthly Cash Flow for Business Underwriting
          totalMonthlyBusinessIncome = monthlyProfit + monthlyDepr + monthlyRemun + monthlyRent;

          // Update Business calculation summary badges
          const elAvgP = document.getElementById('bizAvgAnnualProfit');
          if (elAvgP) elAvgP.textContent = '₹' + fmtINR(avgAnnualProfit);

          const elMonP = document.getElementById('bizMonthlyProfit');
          if (elMonP) elMonP.textContent = '₹' + fmtINR(monthlyProfit);
        }

        existingEmi = parseNumber((document.getElementById('bizEmiInput') || {}).value);

        // Applied FOIR: Already integrated in turnover program (85% or 100% for Doctor)
        eligibleIncome = (isTurnoverProg || isLrdProg || isLrdIndustry) ? totalMonthlyBusinessIncome : (totalMonthlyBusinessIncome * appliedFoir);

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
      const salSalB = document.getElementById('salSalaryBadge'); if (salSalB) salSalB.textContent = badgeWordINR(parseNumber((document.getElementById('salSalaryInput') || {}).value));
      const salBonB = document.getElementById('salBonusBadge'); if (salBonB) salBonB.textContent = badgeWordINR(parseNumber((document.getElementById('salBonusInput') || {}).value));
      const salRentB = document.getElementById('salRentBadge'); if (salRentB) salRentB.textContent = badgeWordINR(parseNumber((document.getElementById('salRentInput') || {}).value));
      const salEmiB = document.getElementById('salEmiBadge'); if (salEmiB) salEmiB.textContent = badgeWordINR(parseNumber((document.getElementById('salEmiInput') || {}).value));

      const bizProfB = document.getElementById('bizProfitBadge'); if (bizProfB) bizProfB.textContent = badgeWordINR(parseNumber((document.getElementById('bizProfitInput') || {}).value));
      const bizProf2B = document.getElementById('bizProfit2Badge'); if (bizProf2B) bizProf2B.textContent = badgeWordINR(parseNumber((document.getElementById('bizProfit2Input') || {}).value));
      const bizDepB = document.getElementById('bizDepreciationBadge'); if (bizDepB) bizDepB.textContent = badgeWordINR(parseNumber((document.getElementById('bizDepreciationInput') || {}).value));
      const bizSalB = document.getElementById('bizSalaryBadge'); if (bizSalB) bizSalB.textContent = badgeWordINR(parseNumber((document.getElementById('bizSalaryInput') || {}).value));
      const bizRentB = document.getElementById('bizRentBadge'); if (bizRentB) bizRentB.textContent = badgeWordINR(parseNumber((document.getElementById('bizRentInput') || {}).value));
      const bizEmiB = document.getElementById('bizEmiBadge'); if (bizEmiB) bizEmiB.textContent = badgeWordINR(parseNumber((document.getElementById('bizEmiInput') || {}).value));

      const rateB = document.getElementById('eligRateBadge'); if (rateB) rateB.textContent = rate.toFixed(2) + '%';
      const tenB = document.getElementById('eligTenureBadge');
      if (tenB) {
        if (currentEligTenureUnit === 'months') {
          const yrs = (tenureMonths / 12).toFixed(1).replace(/\.0$/, '');
          tenB.textContent = Math.round(tenureMonths) + " Months (" + yrs + " Yrs)";
        } else {
          const mos = Math.round(tenureMonths);
          tenB.textContent = rawTenure + (rawTenure === 1 ? " Year (" : " Years (") + mos + " Mo)";
        }
      }

      // Update Result UI
      animateNumber(document.getElementById('eligMaxLoan'), maxLoan);
      const wordsEl = document.getElementById('eligMaxLoanWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(maxLoan);

      animateNumber(document.getElementById('eligEmiCapacity'), eligibleEmi);
      animateNumber(document.getElementById('eligEstimatedEmi'), estimatedEmi);
      const foirEl = document.getElementById('eligFoirApplied');
      if (foirEl) {
        const roundedFoir = Math.round(appliedFoir * 100);
        foirEl.textContent = roundedFoir;
        const foirTitleEl = foirEl.closest('.metric-box') ? foirEl.closest('.metric-box').querySelector('.metric-title') : null;
        if (foirTitleEl) {
          foirTitleEl.textContent = profile === 'salaried' ? 'Applicable FOIR (50-70%)' : 'Applicable FOIR';
        }
      }
      animateNumber(document.getElementById('eligTotalPayable'), totalPayable);

      // Render Indicative Statutory Charges on Eligibility Card (Calculated on Required Loan Amount if entered, else Max Eligibility)
      const chargesContainer = widget.querySelector('.statutory-charges-box');
      const reqAmtIn = document.getElementById('eligReqLoanInput');
      const manualReqLoan = reqAmtIn ? parseNumber(reqAmtIn.value) : 0;
      const chargeBaseAmount = manualReqLoan > 0 ? manualReqLoan : maxLoan;
      if (chargesContainer) {
        const baseDisplayEl = chargesContainer.querySelector('.charges-loan-base-display');
        if (baseDisplayEl) baseDisplayEl.textContent = chargeBaseAmount > 0 ? ('on ₹' + fmtINR(chargeBaseAmount)) : '';

        if (isPersonal) {
          // Personal Loan: PF 2.5% – 3% + 18% GST
          const pfMin = Math.round(chargeBaseAmount * 0.025 * 1.18);
          const pfMax = Math.round(chargeBaseAmount * 0.03 * 1.18);
          const pfMinEl = chargesContainer.querySelector('.pl-pf-min-val');
          const pfMaxEl = chargesContainer.querySelector('.pl-pf-max-val');
          if (pfMinEl) pfMinEl.textContent = chargeBaseAmount > 0 ? ('₹' + fmtINR(pfMin)) : '—';
          if (pfMaxEl) pfMaxEl.textContent = chargeBaseAmount > 0 ? ('₹' + fmtINR(pfMax)) : '—';
        } else {
          const stampDuty = Math.round(chargeBaseAmount * CONFIG.defaults.charges.stampDutyRate);
          const stampEl = chargesContainer.querySelector('.charge-stamp-duty');
          if (stampEl) stampEl.textContent = '₹' + fmtINR(stampDuty);
          const govtFees = calcGovtBankFees(chargeBaseAmount);
          const govtLegalValEl = chargesContainer.querySelector(".govt-legal-valuation-val");
          const govtSlabEl = chargesContainer.querySelector(".govt-legal-valuation-slab");
          if (govtLegalValEl) govtLegalValEl.textContent = "₹" + fmtINR(govtFees.total);
          if (govtSlabEl) govtSlabEl.textContent = "(" + govtFees.breakdown + ")";
        } // end else (home loan charges)
      } // end if (chargesContainer)

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
      const amtBadge = document.getElementById('emiAmountBadge'); if (amtBadge) amtBadge.textContent = badgeWordINR(P);
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

      // Render Indicative Statutory Charges Breakdown Box
      const chargesContainer = widget.querySelector('.statutory-charges-box');
      if (chargesContainer) {
        const stampDuty = Math.round(P * CONFIG.defaults.charges.stampDutyRate);
        const stampEl = chargesContainer.querySelector('.charge-stamp-duty');
        if (stampEl) stampEl.textContent = '₹' + fmtINR(stampDuty);
      }

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
      if (badgeP) badgeP.textContent = badgeWordINR(P);

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
    const mvLtvIn = document.getElementById('lapMvLtvInput');
    const mvLtvSl = document.getElementById('lapMvLtvSlider');
    const mvLtvMinLim = document.getElementById('lapMvLtvMinLimit');
    const mvLtvMaxLim = document.getElementById('lapMvLtvMaxLimit');
    const mvLtvNote = document.getElementById('lapMvLtvNote');

    const agreeValIn = document.getElementById('lapAgreementValueInput');
    const agreeLtvIn = document.getElementById('lapAgreementLtvInput');
    const agreeLtvSl = document.getElementById('lapAgreementLtvSlider');

    const progSel = document.getElementById('lapProgramSelect');
    const incGroup = document.getElementById('lapIncomeGroup');
    const turnoverGroup = document.getElementById('lapTurnoverGroup');
    const incIn = document.getElementById('lapIncomeInput');
    const incSl = document.getElementById('lapIncomeSlider');
    const turnoverIn = document.getElementById('lapTurnoverInput');
    const turnoverSl = document.getElementById('lapTurnoverSlider');
    const turnoverPctIn = document.getElementById('lapTurnoverPctInput');
    const turnoverPctSl = document.getElementById('lapTurnoverPctSlider');
    const emiIn = document.getElementById('lapEmiInput');
    const rateIn = document.getElementById('lapRateInput');
    const tenIn = document.getElementById('lapTenureInput');

    bindSync(propIn, propSl, 2000000, 100000000, 100000, recalc);
    bindSync(incIn, incSl, 30000, 2000000, 5000, recalc);

    // MV LTV Slider & Input Synchronization (Housing: 50-98%, Commercial: 60-90%, Industrial: 45-80%)
    if (mvLtvIn && mvLtvSl) {
      bindSync(mvLtvIn, mvLtvSl, 45, 98, 1, recalc, true);
      mvLtvIn.addEventListener('input', () => {
        const opt = propSel ? propSel.options[propSel.selectedIndex] : null;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 98) : 98;
        let v = parseFloat(mvLtvIn.value);
        if (!isNaN(v) && v > maxVal) {
          mvLtvIn.value = maxVal;
        }
        recalc();
      });
      mvLtvIn.addEventListener('blur', () => {
        const opt = propSel ? propSel.options[propSel.selectedIndex] : null;
        const minVal = opt ? (parseFloat(opt.dataset.min) || 45) : 45;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 98) : 98;
        let v = parseFloat(mvLtvIn.value);
        if (isNaN(v) || v < minVal) v = minVal;
        if (v > maxVal) v = maxVal;
        mvLtvIn.value = v;
        if (mvLtvSl) {
          mvLtvSl.value = v;
          updateSliderFill(mvLtvSl);
        }
        recalc();
      });
    }

    // Agreement Value & Agreement LTV Synchronization (45% - 95%)
    if (agreeValIn) {
      agreeValIn.addEventListener('input', recalc);
    }
    if (agreeLtvIn && agreeLtvSl) {
      bindSync(agreeLtvIn, agreeLtvSl, 45, 95, 1, recalc, true);
      agreeLtvIn.addEventListener('input', () => {
        let v = parseFloat(agreeLtvIn.value);
        if (!isNaN(v) && v > 95) agreeLtvIn.value = 95;
        recalc();
      });
      agreeLtvIn.addEventListener('blur', () => {
        let v = parseFloat(agreeLtvIn.value);
        if (isNaN(v) || v < 45) v = 45;
        if (v > 95) v = 95;
        agreeLtvIn.value = v;
        if (agreeLtvSl) {
          agreeLtvSl.value = v;
          updateSliderFill(agreeLtvSl);
        }
        recalc();
      });
    }

    // Property Category Change Listener (Industrial 45-80%, Commercial 60-90%, Housing 50-98%)
    if (propSel) {
      propSel.addEventListener('change', () => {
        const opt = propSel.options[propSel.selectedIndex];
        const minVal = parseFloat(opt.dataset.min) || 50;
        const maxVal = parseFloat(opt.dataset.max) || 98;
        const defVal = parseFloat(opt.dataset.def) || 75;

        if (mvLtvSl) {
          mvLtvSl.min = minVal;
          mvLtvSl.max = maxVal;
          mvLtvSl.value = defVal;
          updateSliderFill(mvLtvSl);
        }
        if (mvLtvIn) {
          mvLtvIn.value = defVal;
        }
        if (mvLtvMinLim) mvLtvMinLim.textContent = minVal + '% (Min)';
        if (mvLtvMaxLim) mvLtvMaxLim.textContent = maxVal + '% (Max)';

        if (mvLtvNote) {
          const notes = {
            housing: 'Housing / Residential: Bank loan limit ranges from 50% to 98% of certified Market Value.',
            commercial: 'Commercial Property: Bank loan limit ranges from 60% to 90% of certified Market Value.',
            industrial: 'Industrial Property: Bank loan limit ranges from 45% to 80% of certified Market Value.'
          };
          mvLtvNote.textContent = notes[propSel.value] || 'Property valuation norm applied.';
        }
        recalc();
      });
    }

    const lapTurnoverYear2In = document.getElementById('lapTurnoverYear2Input');
    const lapTurnoverYear2Sl = document.getElementById('lapTurnoverYear2Slider');

    if (turnoverIn && turnoverSl) {
      bindSync(turnoverIn, turnoverSl, 1000000, 500000000, 500000, recalc);
    }
    if (lapTurnoverYear2In && lapTurnoverYear2Sl) {
      bindSync(lapTurnoverYear2In, lapTurnoverYear2Sl, 1000000, 500000000, 500000, recalc);
    }
    if (turnoverPctIn) {
      if (turnoverPctSl) bindSync(turnoverPctIn, turnoverPctSl, 1.0, 20.0, 0.1, recalc, true);
      turnoverPctIn.addEventListener('input', () => {
        const opt = lapIndustrySel ? lapIndustrySel.options[lapIndustrySel.selectedIndex] : null;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 20.0) : 20.0;
        let v = parseFloat(turnoverPctIn.value);
        if (!isNaN(v) && v > maxVal) {
          turnoverPctIn.value = maxVal.toFixed(1);
        }
        recalc();
      });
      turnoverPctIn.addEventListener('blur', () => {
        const opt = lapIndustrySel ? lapIndustrySel.options[lapIndustrySel.selectedIndex] : null;
        const minVal = opt ? (parseFloat(opt.dataset.min) || 1.0) : 1.0;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 20.0) : 20.0;
        let v = parseFloat(turnoverPctIn.value);
        if (isNaN(v) || v < minVal) v = minVal;
        if (v > maxVal) v = maxVal;
        turnoverPctIn.value = v.toFixed(1);
        recalc();
      });
    }

    const lapIndustrySel = document.getElementById('lapIndustrySelect');
    const lapTurnoverMinLim = document.getElementById('lapTurnoverMinLimit');
    const lapTurnoverMaxLim = document.getElementById('lapTurnoverMaxLimit');
    const lapTurnoverNote = document.getElementById('lapTurnoverNote');

    if (lapIndustrySel) {
      lapIndustrySel.addEventListener('change', () => {
        const opt = lapIndustrySel.options[lapIndustrySel.selectedIndex];
        const minVal = parseFloat(opt.dataset.min) || 1.0;
        const maxVal = parseFloat(opt.dataset.max) || 20.0;
        const defVal = parseFloat(opt.dataset.def) || 5.0;

        if (turnoverPctSl) {
          turnoverPctSl.min = minVal;
          turnoverPctSl.max = maxVal;
          turnoverPctSl.step = (minVal === maxVal) ? 0.1 : 0.1;
          turnoverPctSl.value = defVal;
          updateSliderFill(turnoverPctSl);
        }
        const isMultiplier = opt.dataset.isMultiplier === 'true' || opt.value === 'doctor' || opt.value === 'ca' || opt.value === 'cs';
        const prefixEl = document.getElementById('lapTurnoverPrefix');
        const labelEl = document.getElementById('lapTurnoverPctLabel');
        if (prefixEl) prefixEl.textContent = isMultiplier ? 'x' : '%';
        if (labelEl) labelEl.textContent = isMultiplier ? 'Gross Receipts Multiplier (Times)' : 'Manual Net Cash Margin % (Editable)';

        if (turnoverPctIn) {
          turnoverPctIn.value = isMultiplier ? defVal.toString() : defVal.toFixed(1);
        }
        if (lapTurnoverMinLim && lapTurnoverMaxLim) {
          lapTurnoverMinLim.textContent = isMultiplier ? minVal + 'x (Min)' : minVal.toFixed(1) + '% (Min)';
          lapTurnoverMaxLim.textContent = isMultiplier ? maxVal + 'x (Max)' : maxVal.toFixed(1) + '% (Max)';
        }
        if (lapTurnoverNote) {
          const notes = {
            mfg: 'Manufacturing norm: 10% to 15% of annual turnover treated as derived cash profit.',
            services: 'Services sector norm: 10% to 15% of annual turnover treated as derived cash profit.',
            trader: 'Trading / Retail norm: 5% to 10% of annual turnover treated as derived cash profit.',
            ca: 'Chartered Accountant (CA): 2% to 3% of annual gross professional receipts.',
            cs: 'Company Secretary (CS): 1.5% of annual gross professional receipts.',
            doctor: 'Doctor (MBBS / Specialist): 2% to 3% of annual gross professional receipts.',
            custom: 'Custom multiplier applied to annual turnover as accepted by specific lender.'
          };
          lapTurnoverNote.textContent = notes[lapIndustrySel.value] || 'Bank benchmark applied.';
        }
        recalc();
      });
    }

    const lapLrdGroup = document.getElementById('lapLrdGroup');
    const lapLrdRentIn = document.getElementById('lapLrdRentInput');
    const lapLrdFoirIn = document.getElementById('lapLrdFoirInput');
    const lapLrdFoirSl = document.getElementById('lapLrdFoirSlider');

    if (lapLrdRentIn) {
      lapLrdRentIn.addEventListener('input', recalc);
      lapLrdRentIn.addEventListener('blur', () => {
        const val = parseNumber(lapLrdRentIn.value);
        if (val > 0) lapLrdRentIn.value = '₹' + fmtINR(val);
      });
    }
    if (lapLrdFoirIn && lapLrdFoirSl) {
      bindSync(lapLrdFoirIn, lapLrdFoirSl, 65, 85, 1, recalc, true);
    }

    const lapReqAmtInSetup = document.getElementById('lapReqLoanInput');
    const lapReqBadge = document.getElementById('lapReqLoanBadge');
    if (lapReqAmtInSetup) {
      lapReqAmtInSetup.addEventListener('input', () => {
        const val = parseNumber(lapReqAmtInSetup.value);
        if (lapReqBadge) lapReqBadge.textContent = badgeWordINR(val);
        recalc();
      });
      lapReqAmtInSetup.addEventListener('blur', () => {
        const val = parseNumber(lapReqAmtInSetup.value);
        if (val > 0) lapReqAmtInSetup.value = '₹' + fmtINR(val);
        if (lapReqBadge) lapReqBadge.textContent = badgeWordINR(val);
      });
    }

    if (progSel) {
      progSel.addEventListener('change', () => {
        const val = progSel.value;
        const isTurnover = val === 'turnover';
        const isLrd = val === 'lrd';
        if (turnoverGroup) turnoverGroup.style.display = isTurnover ? 'block' : 'none';
        if (lapLrdGroup) lapLrdGroup.style.display = isLrd ? 'block' : 'none';
        if (incGroup) incGroup.style.display = (!isTurnover && !isLrd) ? 'block' : 'none';
        recalc();
      });
    }

    if (emiIn) emiIn.addEventListener('input', recalc);
    if (rateIn) rateIn.addEventListener('input', recalc);
    if (tenIn) tenIn.addEventListener('input', recalc);

    function recalc() {
      const propVal = parseNumber((propIn || {}).value);
      const mvLtvVal = parseFloat((mvLtvIn || {}).value) || 75;
      const agreeVal = parseNumber((agreeValIn || {}).value);
      const agreeLtvVal = parseFloat((agreeLtvIn || {}).value) || 90;

      const isTurnover = (progSel && progSel.value === 'turnover');
      const isLrd = (progSel && progSel.value === 'lrd') || (isTurnover && lapIndustrySel && lapIndustrySel.value === 'lrd');

      let netInc = 0;
      let appliedFoirLap = 0.60;
      if (isLrd) {
        // Rental Program LRD for LAP: RENT * 65-85% = VALUE AND LESS OBLIGATION / PER LAKHS EMI = LOAN AMOUNT
        const rentVal = parseNumber((document.getElementById('lapLrdRentInput') || {}).value) || parseNumber((turnoverIn || {}).value);
        const lrdFoir = parseFloat((document.getElementById('lapLrdFoirInput') || {}).value) || 75;
        const discountedRent = Math.round(rentVal * (lrdFoir / 100));

        netInc = discountedRent;
        appliedFoirLap = 1.0;

        const bRent = document.getElementById('lapLrdRentBadge'); if (bRent) bRent.textContent = badgeWordINR(rentVal);
        const bFoir = document.getElementById('lapLrdFoirBadge'); if (bFoir) bFoir.textContent = lrdFoir + '% FOIR';
        const bNet = document.getElementById('lapLrdNetRentBadge'); if (bNet) bNet.textContent = '₹' + fmtINR(discountedRent) + ' / mo';
      } else if (isTurnover) {
        const turnover1 = parseNumber((turnoverIn || {}).value);
        const turnover2 = parseNumber((lapTurnoverYear2In || {}).value);
        const avgTurnover = (turnover1 > 0 && turnover2 > 0) ? Math.round((turnover1 + turnover2) / 2) : (turnover1 || turnover2 || 0);
        const opt = lapIndustrySel ? lapIndustrySel.options[lapIndustrySel.selectedIndex] : null;
        const isMultiplier = opt && (opt.dataset.isMultiplier === 'true' || opt.value === 'doctor' || opt.value === 'ca' || opt.value === 'cs');
        const pct = parseFloat((turnoverPctIn || {}).value) || (isMultiplier ? 3.0 : 5.0);

        if (isMultiplier) {
          // Doctor / Professional: 3x Gross Receipts
          const annualDerived = avgTurnover * pct;
          netInc = Math.round(annualDerived / 12);
          appliedFoirLap = 1.0;
        } else {
          // Manufacturing / Trader / Services: 85% FOIR on margin
          const annualDerived = avgTurnover * (pct / 100);
          netInc = Math.round((annualDerived * 0.85) / 12);
          appliedFoirLap = 1.0;
        }

        const bT = document.getElementById('lapTurnoverBadge'); if (bT) bT.textContent = badgeWordINR(turnover1);
        const bT2 = document.getElementById('lapTurnoverYear2Badge'); if (bT2) bT2.textContent = badgeWordINR(turnover2);
        const bAvg = document.getElementById('lapAvgTurnoverBadge'); if (bAvg) bAvg.textContent = badgeWordINR(avgTurnover);
        const bTP = document.getElementById('lapTurnoverPctBadge'); if (bTP) bTP.textContent = isMultiplier ? pct + 'x' : pct.toFixed(1) + '%';
        const bMon = document.getElementById('lapMonthlyIncomeBadge'); if (bMon) bMon.textContent = '₹' + fmtINR(netInc) + ' / mo';
        // formula text removed as per user instruction
      } else {
        netInc = parseNumber((incIn || {}).value);
        const bI = document.getElementById('lapIncomeBadge'); if (bI) bI.textContent = badgeWordINR(netInc);
      }

      const existingEmi = parseNumber((emiIn || {}).value);
      const rate = parseFloat((rateIn || {}).value) || 9.5;
      const tenure = parseInt((tenIn || {}).value, 10) || 15;

      // 1. Collateral Market Value Limit (MV x 75% or selected LTV)
      const mvCollateralLimit = Math.round(propVal * (mvLtvVal / 100));

      // 2. Agreement Value Limit (Agreement Value x 45% - 95%)
      const agreeCollateralLimit = agreeVal > 0 ? Math.round(agreeVal * (agreeLtvVal / 100)) : 0;

      // Effective Collateral Limit: If agreement value is entered, banks limit to min(MV limit, Agreement limit)
      const effectiveCollateralLimit = agreeVal > 0 ? Math.min(mvCollateralLimit, agreeCollateralLimit) : mvCollateralLimit;

      // 3. Income Limit (FOIR capacity)
      const foir = isTurnover ? appliedFoirLap : 0.60;
      const maxEmiCapacity = Math.max(0, (netInc * foir) - existingEmi);

      let incomeLimit = 0;
      if (maxEmiCapacity > 0 && rate > 0 && tenure > 0) {
        const r = (rate / 12) / 100;
        const n = tenure * 12;
        const emiPerLakh = (100000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        incomeLimit = Math.floor((maxEmiCapacity / emiPerLakh) * 100000 / 1000) * 1000;
      }

      // Final Binding Sanction is lower of Collateral limit and Income repayment capacity
      const finalSanction = (propVal > 0 && netInc > 0) ? Math.min(effectiveCollateralLimit, incomeLimit) : (propVal > 0 ? effectiveCollateralLimit : incomeLimit);
      const res = calculateEmi(finalSanction, rate, tenure);

      // Update Badges
      const bP = document.getElementById('lapPropValueBadge'); if (bP) bP.textContent = badgeWordINR(propVal);
      const bMvLtv = document.getElementById('lapMvLtvBadge'); if (bMvLtv) bMvLtv.textContent = mvLtvVal + '%';
      const bAgree = document.getElementById('lapAgreementValueBadge'); if (bAgree) bAgree.textContent = badgeWordINR(agreeVal);
      const bAgreeLtv = document.getElementById('lapAgreementLtvBadge'); if (bAgreeLtv) bAgreeLtv.textContent = agreeLtvVal + '%';

      animateNumber(document.getElementById('lapMaxLoan'), finalSanction);
      const wordsEl = document.getElementById('lapMaxLoanWords');
      if (wordsEl) wordsEl.textContent = wordFormINR(finalSanction);

      // Update Breakdown Metric Boxes
      const mvLimitTitle = document.getElementById('lapMvLimitTitle');
      if (mvLimitTitle) mvLimitTitle.textContent = 'MV Limit (' + mvLtvVal + '%)';
      animateNumber(document.getElementById('lapMvLimitVal'), mvCollateralLimit);

      const agreeLimitTitle = document.getElementById('lapAgreeLimitTitle');
      if (agreeLimitTitle) agreeLimitTitle.textContent = 'Agreement Limit (' + agreeLtvVal + '%)';
      animateNumber(document.getElementById('lapAgreementLimitVal'), agreeCollateralLimit);

      animateNumber(document.getElementById('lapCollateralLimit'), effectiveCollateralLimit);
      animateNumber(document.getElementById('lapIncomeLimit'), incomeLimit);
      animateNumber(document.getElementById('lapMonthlyEmi'), res.emi);
      animateNumber(document.getElementById('lapTotalPayable'), res.totalPayable);

      // Render Indicative Statutory Charges on LAP Result Card (Calculated on Required Loan Amount if entered, else Final Sanction)
      const chargesContainer = widget.querySelector('.statutory-charges-box');
      const lapReqAmtIn = document.getElementById('lapReqLoanInput');
      const manualLapReqLoan = lapReqAmtIn ? parseNumber(lapReqAmtIn.value) : 0;
      const lapChargeBaseAmount = manualLapReqLoan > 0 ? manualLapReqLoan : finalSanction;
      if (chargesContainer) {
        const stampDuty = Math.round(lapChargeBaseAmount * CONFIG.defaults.charges.stampDutyRate);
        const stampEl = chargesContainer.querySelector('.charge-stamp-duty');
        if (stampEl) stampEl.textContent = '₹' + fmtINR(stampDuty);
        const baseDisplayEl = chargesContainer.querySelector('.charges-loan-base-display');
        if (baseDisplayEl) baseDisplayEl.textContent = lapChargeBaseAmount > 0 ? ('(₹' + fmtINR(lapChargeBaseAmount) + ')') : '';
        const lapMvVal = Math.max(parseNumber((propIn && propIn.value) || 0), lapChargeBaseAmount);
        const lapGovtFees = calcGovtBankFees(lapMvVal);
        const lapGovtLegalValEl = chargesContainer.querySelector(".govt-legal-valuation-val");
        const lapGovtSlabEl = chargesContainer.querySelector(".govt-legal-valuation-slab");
        if (lapGovtLegalValEl) lapGovtLegalValEl.textContent = "₹" + fmtINR(lapGovtFees.total);
        if (lapGovtSlabEl) lapGovtSlabEl.textContent = "(" + lapGovtFees.breakdown + ")";

        // Dynamic Bank Charges for LAP: PF 1%+GST for LRD, 0.25%+GST standard, Life Insurance 2%, Property Insurance 7%
        const isLrdActiveLap = (progSel && (progSel.value === 'lrd' || (progSel.value === 'turnover' && lapIndustrySel && lapIndustrySel.value === 'lrd')));
        const defaultPfRateLap = isLrdActiveLap ? (0.01 * 1.18) : (0.0025 * 1.18);

        const lapPfIn = widget.querySelector('#lapPfInput');
        const lapInsIn = widget.querySelector('#lapInsuranceInput');
        const lapTotBox = widget.querySelector('#lapCustomChargesTotal');
        const lapTotVal = widget.querySelector('#lapCustomChargesTotalVal');

        let pfVal = parseNumber((lapPfIn && lapPfIn.value) || 0);
        if (pfVal === 0 && lapChargeBaseAmount > 0) {
          pfVal = Math.round(lapChargeBaseAmount * defaultPfRateLap);
          if (lapPfIn && !lapPfIn.dataset.userEdited) {
            lapPfIn.placeholder = isLrdActiveLap ? ('₹' + fmtINR(pfVal) + ' (1%+GST LRD)') : ('₹' + fmtINR(pfVal) + ' (0.25%+GST)');
          }
        }

        let insVal = parseNumber((lapInsIn && lapInsIn.value) || 0);
        if (insVal === 0 && lapChargeBaseAmount > 0) {
          insVal = Math.round(lapChargeBaseAmount * 0.02);
          if (lapInsIn && !lapInsIn.dataset.userEdited) {
            lapInsIn.placeholder = '₹' + fmtINR(insVal) + ' (2% Life / Property)';
          }
        }

        const totalBankCharges = pfVal + insVal;
        if (lapTotBox && lapTotVal) {
          lapTotBox.style.display = totalBankCharges > 0 ? 'block' : 'none';
          lapTotVal.textContent = '₹' + fmtINR(totalBankCharges);
        }
      }

      updateWhatsAppCta(
        document.getElementById('lapWhatsAppBtn'),
        'Loan Against Property (LAP) Calculator',
        'Market Value: ₹' + fmtINR(propVal) + ' (' + mvLtvVal + '%), Agreement Value: ₹' + fmtINR(agreeVal) + ' (' + agreeLtvVal + '%), Income: ₹' + fmtINR(netInc) + '/mo, Effective Collateral Limit: ₹' + fmtINR(effectiveCollateralLimit) + ', Eligible LAP: ₹' + fmtINR(finalSanction) + ', Monthly EMI: ₹' + fmtINR(res.emi)
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

      const bA = document.getElementById('fdAmountBadge'); if (bA) bA.textContent = badgeWordINR(P);
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

      const bD = document.getElementById('rdDepositBadge'); if (bD) bD.textContent = badgeWordINR(dep);
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

      const bT = document.getElementById('dreamTargetBadge'); if (bT) bT.textContent = badgeWordINR(target);
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

        const bS = document.getElementById('sipAmountBadge'); if (bS) bS.textContent = badgeWordINR(monthly);
      } else {
        const lump = parseNumber(lumpAmtIn.value);
        res = calculateLumpsumMaturity(lump, rate, years);

        const bL = document.getElementById('lumpAmountBadge'); if (bL) bL.textContent = badgeWordINR(lump);
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

      const bD = document.getElementById('ppfDepositBadge'); if (bD) bD.textContent = badgeWordINR(yearly);

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

      const bD = document.getElementById('ssyDepositBadge'); if (bD) bD.textContent = badgeWordINR(yearly);
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

        const matchCat = (activeCategory === 'all' || cat.toLowerCase().split(/\\s+/).includes(activeCategory.toLowerCase()));
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

  /* ── 14. LOAN AGAINST MUTUAL FUNDS (LAMF) CONTROLLER ───────────────────── */
  function initLamfWidget(widget) {
    let schemes = [
      {
        id: 'scheme_' + Date.now() + '_1',
        name: '',
        code: null,
        type: 'equity', // 'equity' | 'debt'
        units: 0,
        nav: 0,
        navDate: '',
        navAgeWarning: false,
        ltv: LAMF_CONFIG.ltv.equity,
        isLockIn: false
      }
    ];

    // In-memory cache for search queries and scheme latest NAVs
    const searchCache = new Map();
    const navCache = new Map();

    const tbody = document.getElementById('lamfTableBody');
    const cardsContainer = document.getElementById('lamfCardsContainer');
    const btnAdd = document.getElementById('btnAddScheme');
    const btnClearAll = document.getElementById('btnClearAllSchemes');
    const countBadge = document.getElementById('lamfSchemeCount');

    // Stats elements
    const elTotalLimit = document.getElementById('lamfTotalLimit');
    const elTotalLimitWords = document.getElementById('lamfTotalLimitWords');
    const elEquityLimit = document.getElementById('lamfEquityLimit');
    const elDebtLimit = document.getElementById('lamfDebtLimit');
    const cardEquitySub = document.getElementById('cardEquitySub');
    const cardDebtSub = document.getElementById('cardDebtSub');

    // Controls
    const rateIn = document.getElementById('lamfRateInput');
    const rateSl = document.getElementById('lamfRateSlider');
    const rateBadge = document.getElementById('lamfRateBadge');
    const utilSl = document.getElementById('lamfUtilSlider');
    const utilBadge = document.getElementById('lamfUtilBadge');
    const utilAmountIn = document.getElementById('lamfUtilAmountInput');

    // Tenure Controls (12 to 84 Months or 1 to 7 Years)
    const tenureIn = document.getElementById('lamfTenureInput');
    const tenureSl = document.getElementById('lamfTenureSlider');
    const tenureBadge = document.getElementById('lamfTenureBadge');
    const tenureLabel = document.getElementById('lamfTenureLabel');
    const tenurePrefix = document.getElementById('lamfTenurePrefix');
    const tenureMinLimit = document.getElementById('lamfTenureMinLimit');
    const tenureMaxLimit = document.getElementById('lamfTenureMaxLimit');
    const unitToggleBtns = widget.querySelectorAll('.lamf-unit-btn');
    const elTenureSummary = document.getElementById('lamfTenureSummary');
    const elTenureTotalInterest = document.getElementById('lamfTenureTotalInterest');

    let currentTenureUnit = 'months'; // 'months' | 'years'

    // Interest outputs
    const elMonthlyInterest = document.getElementById('lamfMonthlyInterest');
    const elAnnualInterest = document.getElementById('lamfAnnualInterest');
    const elDailyInterest = document.getElementById('lamfDailyInterest');

    // Stress testing
    const stressSl = document.getElementById('lamfStressSlider');
    const stressBadge = document.getElementById('lamfStressBadge');
    const stressNewLimit = document.getElementById('lamfStressNewLimit');
    const stressLimitDiff = document.getElementById('lamfStressLimitDiff');
    const warningBanner = document.getElementById('lamfWarningBanner');

    // SVG Visual Chart & Legend
    const chartContainer = document.getElementById('lamfChartContainer');

    // CTA
    
    // 2-Year Income / ITR Assessment event listeners
    const incomeToggleEl = document.getElementById('lamfIncomeCheckToggle');
    const incomeFieldsBox = document.getElementById('lamfIncomeFieldsContainer');
    const itr1In = document.getElementById('lamfItr1Input');
    const itr2In = document.getElementById('lamfItr2Input');
    const exEmiIn = document.getElementById('lamfExistingEmiInput');

    if (incomeToggleEl && incomeFieldsBox) {
      incomeToggleEl.addEventListener('change', () => {
        incomeFieldsBox.style.display = incomeToggleEl.checked ? 'block' : 'none';
        recalculate();
      });
    }
    if (itr1In) {
      itr1In.addEventListener('input', recalculate);
      itr1In.addEventListener('blur', () => {
        const v = parseNumber(itr1In.value);
        if (v > 0) itr1In.value = '₹' + fmtINR(v);
      });
    }
    if (itr2In) {
      itr2In.addEventListener('input', recalculate);
      itr2In.addEventListener('blur', () => {
        const v = parseNumber(itr2In.value);
        if (v > 0) itr2In.value = '₹' + fmtINR(v);
      });
    }
    if (exEmiIn) {
      exEmiIn.addEventListener('input', recalculate);
      exEmiIn.addEventListener('blur', () => {
        const v = parseNumber(exEmiIn.value);
        if (v > 0) exEmiIn.value = '₹' + fmtINR(v);
      });
    }

    const waBtn = document.getElementById('lamfWhatsAppBtn');

    // Helper: is debt keyword
    function detectFundType(categoryName, schemeName) {
      const combined = `${categoryName || ''} ${schemeName || ''}`.toLowerCase();
      for (const kw of LAMF_CONFIG.debtKeywords) {
        if (combined.includes(kw)) return 'debt';
      }
      return 'equity';
    }

    // Helper: check lock-in
    function checkLockIn(name) {
      const s = (name || '').toLowerCase();
      return s.includes('elss') || s.includes('tax saver') || s.includes('lock-in') || s.includes('retirement');
    }

    // Fetch search query with debounce, phonetic/fuzzy normalization & multi-stage fallback
    async function searchSchemes(query) {
      const rawQ = query.trim().toLowerCase();
      if (searchCache.has(rawQ)) return searchCache.get(rawQ);

      // Common typos & Indian MF AMC phonetic mapping dictionary
      const corrections = [
        [/\bprudencial\b/g, 'prudential'],
        [/\bnipon\b/g, 'nippon'],
        [/\bnipoon\b/g, 'nippon'],
        [/\bfranklin templeton\b/g, 'franklin'],
        [/\bparag parik\b/g, 'parag parikh'],
        [/\bmirai\b/g, 'mirae'],
        [/\bmiraey\b/g, 'mirae'],
        [/\baxiss\b/g, 'axis'],
        [/\bsbii\b/g, 'sbi'],
        [/\bhdf\b/g, 'hdfc'],
        [/\bkotak mahindra\b/g, 'kotak']
      ];

      let normalizedQ = rawQ;
      for (const [pattern, repl] of corrections) {
        normalizedQ = normalizedQ.replace(pattern, repl);
      }

      async function queryApi(term) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        try {
          const res = await fetch(LAMF_CONFIG.navApi.search + encodeURIComponent(term), { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) return [];
          const list = await res.json();
          return Array.isArray(list) ? list : [];
        } catch (err) {
          clearTimeout(timeoutId);
          return [];
        }
      }

      // Step 1: Query with normalized text (e.g. "prudential" instead of "prudencial")
      let results = await queryApi(normalizedQ);

      // Step 2: If no results, try stripping redundant filler words like "fund", "mutual fund"
      if (!results || results.length === 0) {
        const stripped = normalizedQ.replace(/\bmutual\s+fund\b/g, '').replace(/\bfund\b/g, '').replace(/\s+/g, ' ').trim();
        if (stripped && stripped !== normalizedQ && stripped.length >= 3) {
          results = await queryApi(stripped);
        }
      }

      // Step 3: If still no results, fallback to first 2-3 prominent keywords (e.g. "icici prudential")
      if (!results || results.length === 0) {
        const words = normalizedQ.split(/\s+/).filter(w => w.length > 2 && w !== 'fund');
        if (words.length >= 2) {
          const fallbackTerm = words.slice(0, 2).join(' ');
          results = await queryApi(fallbackTerm);
        }
      }

      // Sort results: Modern Regular/Direct Growth options appear first
      results.sort((a, b) => {
        const aName = (a.schemeName || '').toLowerCase();
        const bName = (b.schemeName || '').toLowerCase();

        // Direct / Regular Plan prioritization
        const aPlan = aName.includes('regular plan') || aName.includes('direct plan');
        const bPlan = bName.includes('regular plan') || bName.includes('direct plan');
        if (aPlan && !bPlan) return -1;
        if (!aPlan && bPlan) return 1;

        // Prioritize Growth options
        const aGrowth = aName.includes('growth');
        const bGrowth = bName.includes('growth');
        if (aGrowth && !bGrowth) return -1;
        if (!aGrowth && bGrowth) return 1;

        // Penalize old discontinued or bonus/premium-plus suffixes
        const aOld = aName.includes('dividend') || aName.includes('premium') || aName.includes('bonus');
        const bOld = bName.includes('dividend') || bName.includes('premium') || bName.includes('bonus');
        if (aOld && !bOld) return 1;
        if (!aOld && bOld) return -1;

        return 0;
      });

      results = results.slice(0, 15);
      searchCache.set(rawQ, results);
      return results;
    }

    // Fetch latest NAV
    async function fetchLatestNav(code) {
      if (navCache.has(code)) return navCache.get(code);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      try {
        const url = LAMF_CONFIG.navApi.latest.replace('{code}', code);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('NAV fetch failed');
        const data = await res.json();
        navCache.set(code, data);
        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        return null;
      }
    }

    // Render Table and Mobile Cards
    function render() {
      if (countBadge) countBadge.textContent = schemes.length;
      if (btnAdd) btnAdd.disabled = schemes.length >= LAMF_CONFIG.maxSchemes;

      // Desktop table render
      if (tbody) {
        tbody.innerHTML = '';
        schemes.forEach((s, idx) => {
          const tr = document.createElement('tr');
          tr.className = 'lamf-row';
          tr.dataset.id = s.id;

          const totalVal = Math.round(s.units * s.nav);
          const eligibleVal = totalVal > 0 ? Math.round(totalVal * s.ltv) : 0;

          tr.innerHTML = `
            <td style="width: 28%;">
              <div class="lamf-search-box">
                <input type="text" class="lamf-search-input scheme-name-input" placeholder="Type scheme name (min 3 chars)..." value="${escapeHtml(s.name)}" aria-label="Scheme Name" autocomplete="off">
                <div class="lamf-dropdown scheme-dropdown" role="listbox"></div>
                ${s.isLockIn ? '<div class="lamf-lockin-alert">⚠️ ELSS / Lock-in fund: Pledging subject to lender lock-in approval.</div>' : ''}
              </div>
            </td>
            <td style="width: 14%;">
              <select class="lamf-select-compact scheme-type-select" aria-label="Fund Type">
                <option value="equity" ${s.type === 'equity' ? 'selected' : ''}>Equity / Hybrid (${Math.round(LAMF_CONFIG.ltv.equity * 100)}% LTV)</option>
                <option value="debt" ${s.type === 'debt' ? 'selected' : ''}>Debt / Liquid (${Math.round(LAMF_CONFIG.ltv.debt * 100)}% LTV)</option>
              </select>
            </td>
            <td style="width: 12%;">
              <input type="number" step="0.001" min="0" class="lamf-input-compact scheme-units-input" placeholder="0.000" value="${s.units > 0 ? s.units : ''}" inputmode="decimal" aria-label="Units">
            </td>
            <td style="width: 14%;">
              <div style="position: relative;">
                <input type="number" step="0.0001" min="0" class="lamf-input-compact scheme-nav-input" placeholder="0.00" value="${s.nav > 0 ? s.nav : ''}" inputmode="decimal" aria-label="NAV" style="${s.navManualRequired ? 'border-color: #f59e0b; background: #fffbeb;' : ''}">
                ${s.navDate ? `<span class="lamf-meta-date">As of: ${s.navDate} ${s.navAgeWarning ? '⚠️' : ''}</span>` : ''}
                ${s.navManualRequired ? `<span class="lamf-meta-date" style="color: #b45309; font-weight: 600;">Discontinued plan. Please enter NAV</span>` : ''}
              </div>
            </td>
            <td style="width: 14%;">
              <span class="lamf-val-text total-val-display">${totalVal > 0 ? '₹' + fmtINR(totalVal) : '—'}</span>
            </td>
            <td style="width: 10%;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" step="1" min="${s.type === 'equity' ? LAMF_CONFIG.ltvLimits.equity[0] * 100 : LAMF_CONFIG.ltvLimits.debt[0] * 100}" max="${s.type === 'equity' ? LAMF_CONFIG.ltvLimits.equity[1] * 100 : LAMF_CONFIG.ltvLimits.debt[1] * 100}" class="lamf-input-compact scheme-ltv-input" value="${Math.round(s.ltv * 100)}" aria-label="LTV Percentage" style="min-width: 55px;">
                <span style="font-size: 0.8rem; font-weight:700; color:#64748b;">%</span>
              </div>
            </td>
            <td style="width: 14%;">
              <span class="lamf-val-text lamf-val-highlight eligible-val-display">${eligibleVal > 0 ? '₹' + fmtINR(eligibleVal) : '—'}</span>
            </td>
            <td style="width: 4%; text-align: center;">
              <button type="button" class="lamf-btn-remove" title="Remove Scheme" aria-label="Remove Scheme">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </td>
          `;

          bindRowEvents(tr, s, idx);
          tbody.appendChild(tr);
        });
      }

      // Mobile cards render
      if (cardsContainer) {
        cardsContainer.innerHTML = '';
        schemes.forEach((s, idx) => {
          const card = document.createElement('div');
          card.className = 'lamf-scheme-card';
          card.dataset.id = s.id;

          const totalVal = Math.round(s.units * s.nav);
          const eligibleVal = totalVal > 0 ? Math.round(totalVal * s.ltv) : 0;

          card.innerHTML = `
            <div class="lamf-scheme-card-header">
              <span class="lamf-count-tag" style="background: var(--color-navy); color:#fff; font-size: 0.72rem;">#${idx + 1} Scheme</span>
              <button type="button" class="lamf-btn-remove" title="Remove Scheme" aria-label="Remove Scheme">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div class="lamf-search-box" style="margin-bottom: 12px;">
              <label class="lamf-card-label">Mutual Fund Scheme</label>
              <input type="text" class="lamf-search-input scheme-name-input" placeholder="Search scheme name (min 3 chars)..." value="${escapeHtml(s.name)}" aria-label="Scheme Name" autocomplete="off" style="margin-top:4px;">
              <div class="lamf-dropdown scheme-dropdown" role="listbox"></div>
              ${s.isLockIn ? '<div class="lamf-lockin-alert">⚠️ ELSS / Lock-in fund: Subject to lender lock-in approval.</div>' : ''}
            </div>

            <div class="lamf-card-grid">
              <div class="lamf-card-field">
                <label class="lamf-card-label">Category / Type</label>
                <select class="lamf-select-compact scheme-type-select">
                  <option value="equity" ${s.type === 'equity' ? 'selected' : ''}>Equity / Hybrid</option>
                  <option value="debt" ${s.type === 'debt' ? 'selected' : ''}>Debt / Liquid</option>
                </select>
              </div>

              <div class="lamf-card-field">
                <label class="lamf-card-label">Units Held</label>
                <input type="number" step="0.001" min="0" class="lamf-input-compact scheme-units-input" placeholder="0.000" value="${s.units > 0 ? s.units : ''}" inputmode="decimal">
              </div>

              <div class="lamf-card-field">
                <label class="lamf-card-label">NAV (₹)</label>
                <input type="number" step="0.0001" min="0" class="lamf-input-compact scheme-nav-input" placeholder="0.00" value="${s.nav > 0 ? s.nav : ''}" inputmode="decimal" style="${s.navManualRequired ? 'border-color: #f59e0b; background: #fffbeb;' : ''}">
                ${s.navDate ? `<span class="lamf-meta-date">As of: ${s.navDate}</span>` : ''}
                ${s.navManualRequired ? `<span class="lamf-meta-date" style="color: #b45309; font-weight: 600;">Discontinued plan. Please enter NAV</span>` : ''}
              </div>

              <div class="lamf-card-field">
                <label class="lamf-card-label">LTV (%)</label>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input type="number" step="1" class="lamf-input-compact scheme-ltv-input" value="${Math.round(s.ltv * 100)}">
                  <span style="font-weight:700; color:#64748b;">%</span>
                </div>
              </div>
            </div>

            <div class="lamf-card-footer">
              <div>
                <span class="lamf-card-label">Total Value:</span>
                <strong style="color: var(--color-navy); font-size: 0.95rem;">${totalVal > 0 ? '₹' + fmtINR(totalVal) : '—'}</strong>
              </div>
              <div style="text-align: right;">
                <span class="lamf-card-label">Eligible Credit:</span>
                <strong style="color: var(--color-brick); font-size: 1.05rem;">${eligibleVal > 0 ? '₹' + fmtINR(eligibleVal) : '—'}</strong>
              </div>
            </div>
          `;

          bindRowEvents(card, s, idx);
          cardsContainer.appendChild(card);
        });
      }

    // Manual PF & Insurance optional inputs
    const eligPfIn = widget.querySelector('#customPfInput');
    const eligInsIn = widget.querySelector('#customInsuranceInput');
    const eligTotBox = widget.querySelector('#customChargesTotal');
    const eligTotVal = widget.querySelector('#customChargesTotalVal');
    function updateEligCustomCharges() {
      const pfVal = parseNumber((eligPfIn && eligPfIn.value) || 0);
      const insVal = parseNumber((eligInsIn && eligInsIn.value) || 0);
      const totalCustom = pfVal + insVal;
      if (eligTotBox && eligTotVal) {
        eligTotBox.style.display = totalCustom > 0 ? 'block' : 'none';
        eligTotVal.textContent = '₹' + fmtINR(totalCustom);
      }
    }
    if (eligPfIn) {
      eligPfIn.addEventListener('input', updateEligCustomCharges);
      eligPfIn.addEventListener('blur', () => {
        const val = parseNumber(eligPfIn.value);
        if (val > 0) eligPfIn.value = '₹' + fmtINR(val);
      });
    }
    if (eligInsIn) {
      eligInsIn.addEventListener('input', updateEligCustomCharges);
      eligInsIn.addEventListener('blur', () => {
        const val = parseNumber(eligInsIn.value);
        if (val > 0) eligInsIn.value = '₹' + fmtINR(val);
      });
    }

    
    // Manual PF & Insurance optional inputs
    const emiPfIn = widget.querySelector('#customPfInput');
    const emiInsIn = widget.querySelector('#customInsuranceInput');
    const emiTotBox = widget.querySelector('#customChargesTotal');
    const emiTotVal = widget.querySelector('#customChargesTotalVal');
    function updateEmiCustomCharges() {
      const pfVal = parseNumber((emiPfIn && emiPfIn.value) || 0);
      const insVal = parseNumber((emiInsIn && emiInsIn.value) || 0);
      const totalCustom = pfVal + insVal;
      if (emiTotBox && emiTotVal) {
        emiTotBox.style.display = totalCustom > 0 ? 'block' : 'none';
        emiTotVal.textContent = '₹' + fmtINR(totalCustom);
      }
    }
    if (emiPfIn) {
      emiPfIn.addEventListener('input', updateEmiCustomCharges);
      emiPfIn.addEventListener('blur', () => {
        const val = parseNumber(emiPfIn.value);
        if (val > 0) emiPfIn.value = '₹' + fmtINR(val);
      });
    }
    if (emiInsIn) {
      emiInsIn.addEventListener('input', updateEmiCustomCharges);
      emiInsIn.addEventListener('blur', () => {
        const val = parseNumber(emiInsIn.value);
        if (val > 0) emiInsIn.value = '₹' + fmtINR(val);
      });
    }

    
    // Manual PF & Insurance optional inputs for LAP
    const lapPfIn = widget.querySelector('#lapPfInput');
    const lapInsIn = widget.querySelector('#lapInsuranceInput');
    const lapTotBox = widget.querySelector('#lapCustomChargesTotal');
    const lapTotVal = widget.querySelector('#lapCustomChargesTotalVal');
    function updateLapCustomCharges() {
      const pfVal = parseNumber((lapPfIn && lapPfIn.value) || 0);
      const insVal = parseNumber((lapInsIn && lapInsIn.value) || 0);
      const totalCustom = pfVal + insVal;
      if (lapTotBox && lapTotVal) {
        lapTotBox.style.display = totalCustom > 0 ? 'block' : 'none';
        lapTotVal.textContent = '₹' + fmtINR(totalCustom);
      }
    }
    if (lapPfIn) {
      lapPfIn.addEventListener('input', updateLapCustomCharges);
      lapPfIn.addEventListener('blur', () => {
        const val = parseNumber(lapPfIn.value);
        if (val > 0) lapPfIn.value = '₹' + fmtINR(val);
      });
    }
    if (lapInsIn) {
      lapInsIn.addEventListener('input', updateLapCustomCharges);
      lapInsIn.addEventListener('blur', () => {
        const val = parseNumber(lapInsIn.value);
        if (val > 0) lapInsIn.value = '₹' + fmtINR(val);
      });
    }

    calculate();
    }

    // Helper: escape HTML string
    function escapeHtml(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Bind event handlers for an individual row/card
    function bindRowEvents(container, s, idx) {
      const nameIn = container.querySelector('.scheme-name-input');
      const dropdown = container.querySelector('.scheme-dropdown');
      const typeSelect = container.querySelector('.scheme-type-select');
      const unitsIn = container.querySelector('.scheme-units-input');
      const navIn = container.querySelector('.scheme-nav-input');
      const ltvIn = container.querySelector('.scheme-ltv-input');
      const btnRemove = container.querySelector('.lamf-btn-remove');

      let debounceTimer = null;
      let activeIndex = -1;

      // Autocomplete Search
      if (nameIn && dropdown) {
        nameIn.addEventListener('input', () => {
          s.name = nameIn.value;
          s.isLockIn = checkLockIn(s.name);
          clearTimeout(debounceTimer);
          const q = nameIn.value.trim();
          if (q.length < 3) {
            dropdown.classList.remove('open');
            dropdown.innerHTML = '';
            return;
          }

          debounceTimer = setTimeout(async () => {
            const list = await searchSchemes(q);
            if (!list || list.length === 0) {
              dropdown.innerHTML = '<div class="lamf-dropdown-item" style="color:#94a3b8; font-style:italic;">No matching funds found. Enter name and NAV manually.</div>';
              dropdown.classList.add('open');
              return;
            }

            dropdown.innerHTML = list.map(item => `
              <div class="lamf-dropdown-item" data-code="${item.schemeCode}" data-name="${escapeHtml(item.schemeName)}">
                ${escapeHtml(item.schemeName)}
              </div>
            `).join('');
            dropdown.classList.add('open');
            activeIndex = -1;
          }, 300);
        });

        // Keyboard navigation for dropdown
        nameIn.addEventListener('keydown', (e) => {
          const items = dropdown.querySelectorAll('.lamf-dropdown-item[data-code]');
          if (!dropdown.classList.contains('open') || items.length === 0) return;

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            highlightItem(items);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            highlightItem(items);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < items.length) {
              items[activeIndex].click();
            }
          } else if (e.key === 'Escape') {
            dropdown.classList.remove('open');
          }
        });

        function highlightItem(items) {
          items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
          if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
        }

        // Click outside closes dropdown
        document.addEventListener('click', (e) => {
          if (!container.contains(e.target)) {
            dropdown.classList.remove('open');
          }
        });

        // Selecting a scheme from dropdown
        dropdown.addEventListener('click', async (e) => {
          const item = e.target.closest('.lamf-dropdown-item[data-code]');
          if (!item) return;

          const code = item.dataset.code;
          const schemeName = item.dataset.name;
          s.name = schemeName;
          s.code = code;
          s.isLockIn = checkLockIn(schemeName);
          nameIn.value = schemeName;
          dropdown.classList.remove('open');

          // Fetch NAV
          nameIn.placeholder = 'Fetching live NAV...';
          const navData = await fetchLatestNav(code);
          nameIn.placeholder = 'Type scheme name (min 3 chars)...';

          if (navData && navData.data && navData.data.length > 0) {
            const rawNav = parseFloat(navData.data[0].nav);
            s.nav = (!isNaN(rawNav) && rawNav > 0) ? rawNav : 0;
            s.navDate = navData.data[0].date || '';

            // Check if NAV older than 5 days
            if (s.navDate) {
              const parts = s.navDate.split('-'); // dd-mm-yyyy
              if (parts.length === 3) {
                const navD = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                const ageDays = (Date.now() - navD.getTime()) / (1000 * 60 * 60 * 24);
                s.navAgeWarning = ageDays > 5;
              }
            }

            // Auto-detect Equity vs Debt
            const category = (navData.meta && (navData.meta.scheme_category || navData.meta.scheme_type)) || '';
            s.type = detectFundType(category, schemeName);
            s.ltv = s.type === 'equity' ? LAMF_CONFIG.ltv.equity : LAMF_CONFIG.ltv.debt;
          } else {
            s.nav = 0;
            s.navDate = '';
          }

          // If scheme is discontinued / returned 0 NAV, flag it so user knows to input NAV
          if (s.nav === 0) {
            s.navManualRequired = true;
          } else {
            s.navManualRequired = false;
          }

          render();
        });
      }

      // Helper to update row/card display metrics live without re-rendering the whole form
      function updateRowDisplay() {
        const totalVal = Math.round(s.units * s.nav);
        const eligibleVal = totalVal > 0 ? Math.round(totalVal * s.ltv) : 0;
        const totEl = container.querySelector('.total-val-display');
        const eligEl = container.querySelector('.eligible-val-display');
        if (totEl) totEl.textContent = totalVal > 0 ? '₹' + fmtINR(totalVal) : '—';
        if (eligEl) eligEl.textContent = eligibleVal > 0 ? '₹' + fmtINR(eligibleVal) : '—';
      }

      // Fund type override
      if (typeSelect) {
        typeSelect.addEventListener('change', () => {
          s.type = typeSelect.value;
          s.ltv = s.type === 'equity' ? LAMF_CONFIG.ltv.equity : LAMF_CONFIG.ltv.debt;
          if (ltvIn) ltvIn.value = Math.round(s.ltv * 100);
          updateRowDisplay();
          recalculate();
        });
      }

      // Units input
      if (unitsIn) {
        unitsIn.addEventListener('input', () => {
          const val = parseFloat(unitsIn.value);
          s.units = (!isNaN(val) && val >= 0) ? val : 0;
          updateRowDisplay();
          recalculate();
        });
      }

      // NAV input
      if (navIn) {
        navIn.addEventListener('input', () => {
          const val = parseFloat(navIn.value);
          s.nav = (!isNaN(val) && val >= 0) ? val : 0;
          if (s.nav > 0) {
            navIn.style.borderColor = '';
            const errNote = container.querySelector('.nav-err-note');
            if (errNote) errNote.remove();
          }
          updateRowDisplay();
          recalculate();
        });
      }

      // LTV % input
      if (ltvIn) {
        ltvIn.addEventListener('input', () => {
          const val = parseFloat(ltvIn.value);
          if (!isNaN(val) && val >= 0) {
            s.ltv = Math.min(1, Math.max(0, val / 100));
            updateRowDisplay();
            recalculate();
          }
        });
      }

      // Remove row
      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          schemes = schemes.filter(item => item.id !== s.id);
          if (schemes.length === 0) {
            // keep at least 1 empty row
            schemes.push({
              id: 'scheme_' + Date.now(),
              name: '',
              code: null,
              type: 'equity',
              units: 0,
              nav: 0,
              navDate: '',
              navAgeWarning: false,
              ltv: LAMF_CONFIG.ltv.equity,
              isLockIn: false
            });
          }
          render();
        });
      }
    }

    // Add Scheme Button
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        if (schemes.length >= LAMF_CONFIG.maxSchemes) return;
        schemes.push({
          id: 'scheme_' + Date.now() + '_' + (schemes.length + 1),
          name: '',
          code: null,
          type: 'equity',
          units: 0,
          nav: 0,
          navDate: '',
          navAgeWarning: false,
          ltv: LAMF_CONFIG.ltv.equity,
          isLockIn: false
        });
        render();
      });
    }

    // Clear All Schemes Button
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => {
        schemes = [
          {
            id: 'scheme_' + Date.now(),
            name: '',
            code: null,
            type: 'equity',
            units: 0,
            nav: 0,
            navDate: '',
            navAgeWarning: false,
            ltv: LAMF_CONFIG.ltv.equity,
            isLockIn: false
          }
        ];
        render();
      });
    }

    // Tenure Toggle (12 to 84 Months or 1 to 7 Years)
    function setTenureUnit(newUnit) {
      if (currentTenureUnit === newUnit) return;
      currentTenureUnit = newUnit;

      unitToggleBtns.forEach(btn => {
        const isActive = btn.dataset.unit === newUnit;
        btn.classList.toggle('active', isActive);
        btn.style.background = isActive ? '#ffffff' : 'transparent';
        btn.style.color = isActive ? 'var(--color-navy)' : '#64748b';
      });

      if (newUnit === 'months') {
        const currentYrs = parseFloat(tenureIn.value) || 3;
        const moVal = Math.max(12, Math.min(84, Math.round(currentYrs * 12)));
        tenureSl.min = 12;
        tenureSl.max = 84;
        tenureSl.step = 1;
        tenureSl.value = moVal;
        tenureIn.value = moVal;
        if (tenurePrefix) tenurePrefix.textContent = 'Mo';
        if (tenureMinLimit) tenureMinLimit.textContent = '12 Months (1 Yr)';
        if (tenureMaxLimit) tenureMaxLimit.textContent = '84 Months (7 Yrs)';
      } else {
        const currentMos = parseFloat(tenureIn.value) || 36;
        const yrVal = Math.max(1, Math.min(7, Math.round(currentMos / 12) || 1));
        tenureSl.min = 1;
        tenureSl.max = 7;
        tenureSl.step = 1;
        tenureSl.value = yrVal;
        tenureIn.value = yrVal;
        if (tenurePrefix) tenurePrefix.textContent = 'Yr';
        if (tenureMinLimit) tenureMinLimit.textContent = '1 Year (12 Mo)';
        if (tenureMaxLimit) tenureMaxLimit.textContent = '7 Years (84 Mo)';
      }

      updateSliderFill(tenureSl);
      recalculate();
    }

    unitToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setTenureUnit(btn.dataset.unit);
      });
    });

    if (tenurePrefix) {
      tenurePrefix.style.cursor = 'pointer';
      tenurePrefix.title = 'Switch between Months (12-84) and Years (1-7)';
      tenurePrefix.addEventListener('click', () => {
        setTenureUnit(currentTenureUnit === 'months' ? 'years' : 'months');
      });
    }

    if (tenureIn && tenureSl) {
      tenureSl.addEventListener('input', () => {
        tenureIn.value = tenureSl.value;
        updateSliderFill(tenureSl);
        recalculate();
      });

      tenureIn.addEventListener('input', () => {
        const val = parseInt(tenureIn.value, 10);
        const minVal = parseFloat(tenureSl.min);
        const maxVal = parseFloat(tenureSl.max);
        if (!isNaN(val) && val >= minVal && val <= maxVal) {
          tenureSl.value = val;
          updateSliderFill(tenureSl);
          recalculate();
        }
      });
    }

    // Global Interest Rate Slider & Input Sync
    if (rateIn && rateSl) {
      rateSl.addEventListener('input', () => {
        rateIn.value = parseFloat(rateSl.value).toFixed(2);
        if (rateBadge) rateBadge.textContent = `${rateIn.value}%`;
        updateSliderFill(rateSl);
        recalculate();
      });
      rateIn.addEventListener('input', () => {
        const val = parseFloat(rateIn.value);
        if (!isNaN(val) && val >= 10.5 && val <= 15.0) {
          rateSl.value = val;
          if (rateBadge) rateBadge.textContent = `${val.toFixed(2)}%`;
          updateSliderFill(rateSl);
          recalculate();
        }
      });
    }

    // Utilisation Slider & Amount Sync
    if (utilSl && utilAmountIn) {
      utilSl.addEventListener('input', () => {
        const pct = parseFloat(utilSl.value) || 0;
        if (utilBadge) utilBadge.textContent = `${Math.round(pct)}%`;
        updateSliderFill(utilSl);

        const currentTotal = computeTotals().totalLimit;
        const withdrawn = Math.round((pct / 100) * currentTotal);
        utilAmountIn.value = withdrawn;
        recalculate();
      });

      utilAmountIn.addEventListener('input', () => {
        const amt = parseNumber(utilAmountIn.value);
        const currentTotal = computeTotals().totalLimit;
        if (currentTotal > 0) {
          const pct = Math.min(100, Math.max(0, (amt / currentTotal) * 100));
          utilSl.value = pct;
          if (utilBadge) utilBadge.textContent = `${Math.round(pct)}%`;
          updateSliderFill(utilSl);
        }
        recalculate();
      });
    }

    // Market Fall Stress Slider Sync
    if (stressSl) {
      stressSl.addEventListener('input', () => {
        const pct = parseFloat(stressSl.value) || 0;
        if (stressBadge) {
          stressBadge.textContent = (pct > 0 ? `+${pct}%` : `${pct}%`);
          stressBadge.style.color = pct < 0 ? '#b91c1c' : (pct > 0 ? '#15803d' : '#92400e');
        }
        updateSliderFill(stressSl);
        recalculate();
      });
    }

    // Math Totals Computation
    function computeTotals() {
      let equityLimit = 0;
      let debtLimit = 0;
      let totalPortfolioVal = 0;
      let hasEquity = false;
      let hasDebt = false;

      schemes.forEach(s => {
        const val = s.units * s.nav;
        const elig = val * s.ltv;
        totalPortfolioVal += val;

        if (s.type === 'equity') {
          equityLimit += elig;
          if (val > 0) hasEquity = true;
        } else {
          debtLimit += elig;
          if (val > 0) hasDebt = true;
        }
      });

      const totalLimit = Math.round(equityLimit + debtLimit);
      return {
        equityLimit: Math.round(equityLimit),
        debtLimit: Math.round(debtLimit),
        totalLimit,
        totalPortfolioVal: Math.round(totalPortfolioVal),
        hasEquity,
        hasDebt
      };
    }

    // Recalculate Live Stats
    function recalculate() {
      const totals = computeTotals();
      const totalLimit = totals.totalLimit;

      // Update Subtotals
      if (elEquityLimit) elEquityLimit.textContent = '₹' + fmtINR(totals.equityLimit);
      if (elDebtLimit) elDebtLimit.textContent = '₹' + fmtINR(totals.debtLimit);

      if (cardEquitySub) cardEquitySub.style.display = totals.hasEquity ? 'flex' : 'none';
      if (cardDebtSub) cardDebtSub.style.display = totals.hasDebt ? 'flex' : 'none';

      // Update Total Limit Animation
      animateNumber(elTotalLimit, totalLimit);
      if (elTotalLimitWords) elTotalLimitWords.textContent = totalLimit > 0 ? wordFormINR(totalLimit) : 'Rs 0';

      // Keep Withdrawn Amount in Sync
      let utilPct = parseFloat(utilSl ? utilSl.value : 100) || 100;
      let withdrawn = parseNumber(utilAmountIn ? utilAmountIn.value : 0);

      if (document.activeElement !== utilAmountIn) {
        withdrawn = Math.round((utilPct / 100) * totalLimit);
        if (utilAmountIn) utilAmountIn.value = withdrawn;
      } else {
        if (totalLimit > 0) {
          utilPct = Math.min(100, Math.max(0, (withdrawn / totalLimit) * 100));
          if (utilSl) {
            utilSl.value = utilPct;
            updateSliderFill(utilSl);
          }
          if (utilBadge) utilBadge.textContent = `${Math.round(utilPct)}%`;
        }
      }

            // Interest & Monthly EMI Calculation
      const annualRate = parseFloat(rateIn ? rateIn.value : LAMF_CONFIG.rate.default) || LAMF_CONFIG.rate.default;
      const annualInterest = Math.round(withdrawn * (annualRate / 100));
      const monthlyInterest = (withdrawn * (annualRate / 100)) / 12;
      const dailyInterest = (withdrawn * (annualRate / 100)) / LAMF_CONFIG.daysInYear;

      // Tenure Calculation (12-84 Months or 1-7 Years)
      const rawTenure = parseFloat(tenureIn ? tenureIn.value : 36) || (currentTenureUnit === 'months' ? 36 : 3);
      const tenureMonths = currentTenureUnit === 'months' ? rawTenure : (rawTenure * 12);
      const tenureYears = tenureMonths / 12;

      // Regular Term Loan Monthly EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
      let calculatedMonthlyEmi = 0;
      if (withdrawn > 0 && tenureMonths > 0) {
        calculatedMonthlyEmi = Math.round(calculateEmi(withdrawn, annualRate, tenureMonths));
      }

      const elMonthlyEmi = document.getElementById('lamfMonthlyEmi');
      if (elMonthlyEmi) elMonthlyEmi.textContent = '₹' + fmtINR(calculatedMonthlyEmi);

      if (tenureBadge) {
        if (currentTenureUnit === 'months') {
          const yrs = (rawTenure / 12).toFixed(1).replace(/\.0$/, '');
          tenureBadge.textContent = `${rawTenure} Months (${yrs} Yrs)`;
        } else {
          const mos = Math.round(rawTenure * 12);
          tenureBadge.textContent = `${rawTenure} ${rawTenure === 1 ? 'Year' : 'Years'} (${mos} Mo)`;
        }
      }

      if (elTenureSummary) {
        elTenureSummary.textContent = `${tenureMonths} Mo`;
      }

      const totalTenureInterest = Math.round(annualInterest * (tenureMonths / 12));
      if (elTenureTotalInterest) elTenureTotalInterest.textContent = '₹' + fmtINR(totalTenureInterest);

      if (elAnnualInterest) elAnnualInterest.textContent = '₹' + fmtINR(annualInterest);
      if (elMonthlyInterest) elMonthlyInterest.textContent = '₹' + fmtINR(Math.round(monthlyInterest));
      if (elDailyInterest) elDailyInterest.textContent = '₹' + fmtINR(Math.round(dailyInterest));

      // Stress Test: Market Fall Impact
      const stressPct = parseFloat(stressSl ? stressSl.value : 0) || 0;
      const stressMultiplier = 1 + (stressPct / 100);
      const stressedLimit = Math.round(totalLimit * stressMultiplier);
      const limitDiff = stressedLimit - totalLimit;

      if (stressNewLimit) stressNewLimit.textContent = '₹' + fmtINR(stressedLimit);
      if (stressLimitDiff) {
        if (limitDiff === 0) {
          stressLimitDiff.textContent = 'No change';
          stressLimitDiff.style.color = '#64748b';
        } else if (limitDiff < 0) {
          stressLimitDiff.textContent = `(–₹${fmtINR(Math.abs(limitDiff))})`;
          stressLimitDiff.style.color = '#b91c1c';
        } else {
          stressLimitDiff.textContent = `(+₹${fmtINR(limitDiff)})`;
          stressLimitDiff.style.color = '#15803d';
        }
      }

      // Warning Banner if New Limit falls below withdrawn amount
      if (warningBanner) {
        if (withdrawn > 0 && stressedLimit < withdrawn) {
          warningBanner.style.display = 'block';
          warningBanner.innerHTML = `⚠️ <strong>Margin Call Warning:</strong> With market shift of ${stressPct}%, your sanctioned credit limit drops to <strong>₹${fmtINR(stressedLimit)}</strong>, which is below your withdrawn borrowing of <strong>₹${fmtINR(withdrawn)}</strong>. You may be requested by the lender to pledge additional fund units or repay part of the overdraft (₹${fmtINR(withdrawn - stressedLimit)}).`;
        } else {
          warningBanner.style.display = 'none';
        }
      }

      // Render Visual SVG Bar
      
      // 2-Year ITR / Income Eligibility Assessment
      const incomeToggle = document.getElementById('lamfIncomeCheckToggle');
      if (incomeToggle && incomeToggle.checked) {
        const itr1 = parseNumber((document.getElementById('lamfItr1Input') || {}).value);
        const itr2 = parseNumber((document.getElementById('lamfItr2Input') || {}).value);
        const exEmi = parseNumber((document.getElementById('lamfExistingEmiInput') || {}).value);

        const total2Yr = itr1 + itr2;
        const avgAnnual = Math.round(total2Yr / 2);
        const monthlyDerived = Math.round(total2Yr / 24);

        // 60% FOIR norm
        const netCashForEmi = Math.max(0, (monthlyDerived * 0.60) - exEmi);

        // Max supported loan based on EMI capacity over selected tenure
        const r = (annualRate / 100) / 12;
        const n = tenureMonths;
        let incomeSupportedLoan = 0;
        if (r > 0 && n > 0 && netCashForEmi > 0) {
          incomeSupportedLoan = Math.round((netCashForEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
        }

        const elAvg = document.getElementById('lamfAvgProfitVal');
        const elDer = document.getElementById('lamfDerivedMonthlyVal');
        const elElig = document.getElementById('lamfIncomeEligLoanVal');
        const elBadge = document.getElementById('lamfIncomeStatusBadge');

        if (elAvg) elAvg.textContent = '₹' + fmtINR(avgAnnual);
        if (elDer) elDer.textContent = '₹' + fmtINR(monthlyDerived);
        if (elElig) elElig.textContent = '₹' + fmtINR(incomeSupportedLoan);

        if (elBadge) {
          if (incomeSupportedLoan >= totalLimit) {
            elBadge.style.background = '#ecfdf5';
            elBadge.style.color = '#166534';
            elBadge.innerHTML = '✅ <strong>Approved:</strong> 2-Year Average Income supports 100% of your ₹' + fmtINR(totalLimit) + ' Mutual Fund limit.';
          } else {
            elBadge.style.background = '#fffbeb';
            elBadge.style.color = '#92400e';
            elBadge.innerHTML = '⚠️ <strong>Note:</strong> 2-Year Average Income supports up to ₹' + fmtINR(incomeSupportedLoan) + '. Add co-applicant to unlock full ₹' + fmtINR(totalLimit) + '.';
          }
        }
      }
      renderSvgChart(totals);

      // Render Indicative Statutory Charges on LAMF Card
      const lamfChargesBox = widget.querySelector('.statutory-charges-box');
      if (lamfChargesBox) {
        const chargeBaseAmount = totalLimit;
        const stampDuty = Math.round(chargeBaseAmount * CONFIG.defaults.charges.stampDutyRate);
        const stampEl = lamfChargesBox.querySelector('.charge-stamp-duty');
        if (stampEl) stampEl.textContent = '₹' + fmtINR(stampDuty);
        const baseDisplayEl = lamfChargesBox.querySelector('.charges-loan-base-display');
        if (baseDisplayEl) baseDisplayEl.textContent = chargeBaseAmount > 0 ? ('(₹' + fmtINR(chargeBaseAmount) + ')') : '';

        const govtFees = calcGovtBankFees(chargeBaseAmount);
        const govtLegalValEl = lamfChargesBox.querySelector('.govt-legal-valuation-val');
        const govtSlabEl = lamfChargesBox.querySelector('.govt-legal-valuation-slab');
        if (govtLegalValEl) govtLegalValEl.textContent = '₹' + fmtINR(govtFees.total);
        if (govtSlabEl) govtSlabEl.textContent = '(' + govtFees.breakdown + ')';

        const lamfPfIn = widget.querySelector('#lamfPfInput');
        const lamfInsIn = widget.querySelector('#lamfInsuranceInput');
        const lamfTotBox = widget.querySelector('#lamfCustomChargesTotal');
        const lamfTotVal = widget.querySelector('#lamfCustomChargesTotalVal');

        let pfVal = parseNumber((lamfPfIn && lamfPfIn.value) || 0);
        if (pfVal === 0 && chargeBaseAmount > 0) {
          pfVal = Math.round(chargeBaseAmount * (0.0025 * 1.18));
          if (lamfPfIn && !lamfPfIn.dataset.userEdited) {
            lamfPfIn.placeholder = '₹' + fmtINR(pfVal) + ' (0.25%+GST)';
          }
        }

        let insVal = parseNumber((lamfInsIn && lamfInsIn.value) || 0);
        if (insVal === 0 && chargeBaseAmount > 0) {
          insVal = Math.round(chargeBaseAmount * 0.02);
          if (lamfInsIn && !lamfInsIn.dataset.userEdited) {
            lamfInsIn.placeholder = '₹' + fmtINR(insVal) + ' (2% Life / Property)';
          }
        }

        const totalBankCharges = pfVal + insVal;
        if (lamfTotBox && lamfTotVal) {
          lamfTotBox.style.display = totalBankCharges > 0 ? 'block' : 'none';
          lamfTotVal.textContent = '₹' + fmtINR(totalBankCharges);
        }
      }

      // Update Live WhatsApp CTA Link
      updateLamfWhatsApp(totals, annualRate, withdrawn);
    }

    // Render Hand-Written Inline SVG Stacked Bar
    function renderSvgChart(totals) {
      if (!chartContainer) return;
      const activeSchemes = schemes.filter(s => (s.units * s.nav * s.ltv) > 0);
      if (activeSchemes.length === 0 || totals.totalLimit <= 0) {
        chartContainer.innerHTML = `
          <div style="text-align: center; padding: 20px 10px; color: #94a3b8; font-size: 0.85rem;">
            Add your mutual fund schemes above to generate your portfolio collateral distribution.
          </div>
        `;
        return;
      }

      const colors = ['#0d2140', '#c79a3f', '#a13a2e', '#1e40af', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#4b5563'];
      let cumulativeX = 0;
      const barHeight = 26;
      const totalEligible = totals.totalLimit;

      const segments = activeSchemes.map((s, idx) => {
        const elig = Math.round(s.units * s.nav * s.ltv);
        const widthPct = (elig / totalEligible) * 100;
        const color = colors[idx % colors.length];
        const rect = `<rect x="${cumulativeX}%" y="0" width="${widthPct}%" height="${barHeight}" fill="${color}" rx="0" ry="0"><title>${escapeHtml(s.name || 'Scheme')}: ₹${fmtINR(elig)} (${widthPct.toFixed(1)}%)</title></rect>`;
        cumulativeX += widthPct;
        return {
          rect,
          name: s.name || `Scheme #${idx + 1}`,
          color,
          elig,
          pct: widthPct.toFixed(1)
        };
      });

      const legendHtml = segments.map(seg => `
        <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; margin-right: 14px; margin-top: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 2px; background: ${seg.color}; flex-shrink: 0;"></span>
          <span style="color: var(--color-navy); font-weight: 600;">${escapeHtml(seg.name)}</span>
          <span style="color: #64748b;">(₹${fmtINR(seg.elig)} &bull; ${seg.pct}%)</span>
        </div>
      `).join('');

      chartContainer.innerHTML = `
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #64748b;">Collateral Limit Distribution</span>
          <span style="font-size: 0.72rem; color: var(--color-navy); font-weight: 700;">Total Limit: ₹${fmtINR(totals.totalLimit)}</span>
        </div>
        <svg width="100%" height="${barHeight}" style="border-radius: 6px; overflow: hidden; background: #f1f5f9; display: block;" role="img" aria-label="Scheme collateral share">
          ${segments.map(s => s.rect).join('')}
        </svg>
        <div style="margin-top: 10px; display: flex; flex-wrap: wrap;">
          ${legendHtml}
        </div>
      `;
    }

    // Build WhatsApp CTA Link
    function updateLamfWhatsApp(totals, rate, withdrawn) {
      if (!waBtn) return;
      const activeSchemes = schemes.filter(s => s.name.trim() !== '' && s.units > 0);
      let schemeText = '';
      if (activeSchemes.length > 0) {
        const top5 = activeSchemes.slice(0, 5).map(s => `${s.name} (${s.units} units @ NAV ₹${s.nav})`).join(', ');
        const remaining = activeSchemes.length - 5;
        schemeText = top5 + (remaining > 0 ? ` and ${remaining} more` : '');
      } else {
        schemeText = 'Not specified yet';
      }

      const tenureVal = (tenureIn ? tenureIn.value : 36) + ' Months';

      const msg = `Hello Mukesh ji,\nI evaluated Loan Against Mutual Funds (LAMF) on your website.\n\n` +
                  `*Schemes:* ${schemeText}\n` +
                  `*Total Mutual Fund Value:* ₹${fmtINR(totals.totalPortfolioVal)}\n` +
                  `*Estimated Credit Limit:* ₹${fmtINR(totals.totalLimit)}\n` +
                  `*Equity Sub-limit:* ₹${fmtINR(totals.equityLimit)} | *Debt Sub-limit:* ₹${fmtINR(totals.debtLimit)}\n` +
                  `*Tenure:* ${tenureVal}\n` +
                  `*Indicative Interest Rate:* 10.50% p.a.\n\n` +
                  `Please guide me with the online paperless lien-marking and sanction process.`;

      waBtn.href = `https://wa.me/${LAMF_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    }

    // Initial table render
    render();
  }

  /* ── Main Router on DOMContentLoaded ────────────────────────────────────── */

  /* ── Universal Calculator Reset Engine ─────────────────────────────────── */
  function setupUniversalResetButton(widget) {
    if (!widget) return;
    const inputsCard = widget.querySelector('.inputs-card') || widget.querySelector('.lamf-schemes-card');
    if (!inputsCard) return;

    // Check if reset button already exists
    let resetBtn = widget.querySelector('.calc-reset-btn');
    if (!resetBtn) {
      // Create Header Bar with Reset Button
      const headerBar = document.createElement('div');
      headerBar.className = 'calc-card-header-bar';
      headerBar.innerHTML = `
        <span class="calc-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;color:var(--color-navy);"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          Loan &amp; Investment Details
        </span>
        <button type="button" class="calc-reset-btn" title="Reset all inputs to defaults">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset / Clear
        </button>
      `;
      inputsCard.insertBefore(headerBar, inputsCard.firstChild);
      resetBtn = headerBar.querySelector('.calc-reset-btn');
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. Clear or reset text inputs & textareas
        const inputs = widget.querySelectorAll('input:not([type="button"]):not([type="submit"]):not([type="reset"])');
        inputs.forEach(input => {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = input.defaultChecked || false;
          } else if (input.type === 'range') {
            // Restore default value or min
            const def = input.getAttribute('value') || input.min || '0';
            input.value = def;
            updateSliderFill(input);
          } else if (input.id === 'salCustomFoirInput' || input.id === 'lrdFoirInput' || input.id === 'lapLrdFoirInput') {
            input.value = input.id === 'salCustomFoirInput' ? '65' : '75';
          } else if (input.id === 'eligRateInput' || input.id === 'lapRateInput') {
            input.value = input.getAttribute('value') || '8.75';
          } else if (input.id === 'eligTenureInput' || input.id === 'lapTenureInput') {
            input.value = input.getAttribute('value') || '20';
          } else {
            // For salary, rent, profits, manual loan req, turnovers: reset to empty / placeholder default
            const initialDefault = input.getAttribute('value');
            input.value = (initialDefault !== null && initialDefault !== '') ? initialDefault : '';
            delete input.dataset.userEdited;
          }
        });

        // 2. Reset dropdown selects
        const selects = widget.querySelectorAll('select');
        selects.forEach(sel => {
          sel.selectedIndex = 0;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // 3. Reset badges
        const badges = widget.querySelectorAll('.input-badge');
        badges.forEach(b => {
          if (b.id === 'salCompFoirBadge') b.textContent = '65% FOIR';
          else if (b.id === 'lrdFoirBadge' || b.id === 'lapLrdFoirBadge') b.textContent = '75% FOIR';
          else if (b.id.includes('RateBadge')) {
            const rIn = widget.querySelector('#eligRateInput') || widget.querySelector('#emiRateInput') || widget.querySelector('#lapRateInput');
            if (rIn) b.textContent = parseFloat(rIn.value || 8.75).toFixed(2) + '%';
          } else if (b.id.includes('TenureBadge')) {
            const tIn = widget.querySelector('#eligTenureInput') || widget.querySelector('#emiTenureInput') || widget.querySelector('#lapTenureInput');
            if (tIn) b.textContent = (tIn.value || 20) + ' Years';
          } else {
            b.textContent = '₹0';
          }
        });

        // 4. Trigger input/change on primary input to force full recalculation
        const triggerIn = widget.querySelector('.calc-input') || widget.querySelector('input');
        if (triggerIn) {
          triggerIn.dispatchEvent(new Event('input', { bubbles: true }));
          triggerIn.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Special handling for LAMF
        if (widget.dataset.widgetType === 'lamf') {
          const clearAllBtn = widget.querySelector('#btnClearAllSchemes');
          if (clearAllBtn) clearAllBtn.click();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFormulaAccordions();
    initFAQAccordions();
    initHubFilters();
    initMobileDrawer();

    const widget = document.getElementById('calcWidget');
    if (widget) {
      setupUniversalResetButton(widget);
      const type = widget.dataset.widgetType;
      if (type === 'dropline-od') initDroplineOdWidget(widget);
      else if (type === 'eligibility') initEligibilityWidget(widget);
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
      else if (type === 'lamf') initLamfWidget(widget);
    }
  });

  window.MMCalc = {
    CONFIG,
    LAMF_CONFIG,
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
