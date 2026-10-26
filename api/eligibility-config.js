/**
 * MM FINANCIAL SERVICES CONSULTANT — LOAN ELIGIBILITY CONFIGURATION
 * Advisor: Mukesh Tiwari (+91 95947 36833 | mmfsc09@gmail.com)
 * 
 * EDIT ALL POLICY NUMBERS, SLABS, AND RATES IN THIS SINGLE FILE.
 * Changes here apply immediately to both serverless verification and client calculators.
 */

const LOAN_ELIGIBILITY_CONFIG = {
    // 1. BENCHMARK INTEREST RATES (% per annum)
    defaultRoi: 8.50,
    roiByCategory: {
        'Home Loan': 8.50,
        'Home Loan Balance Transfer': 8.50,
        'Mortgage Loan Against Property (LAP)': 9.50,
        'Personal Loan': 11.50,
        'Business Loan / Working Capital': 12.00,
        'Commercial & Industrial Property Loan': 9.75,
        'Loan Against Mutual Funds (LAMF)': 10.00,
        'Education Loan': 9.50,
        'Car / Auto Loan': 9.00
    },

    // CIBIL Score Slabs & Risk Assessment
    cibilSlabs: {
        '750+': { label: '750+ (Excellent / Lowest ROI)', roiAdjustment: 0.0, foirAdjustment: 0.0, eligible: true },
        '700-749': { label: '700 - 749 (Good / Prime Banking)', roiAdjustment: 0.25, foirAdjustment: 0.0, eligible: true },
        '650-699': { label: '650 - 699 (Fair / Standard NBFC)', roiAdjustment: 0.75, foirAdjustment: -0.05, eligible: true },
        'Below 650': { label: 'Below 650 (Advisory / Co-Applicant Needed)', roiAdjustment: 1.50, foirAdjustment: -0.10, eligible: false, advisory: true },
        'New to Credit': { label: 'New to Credit (No History)', roiAdjustment: 0.50, foirAdjustment: -0.05, eligible: true }
    },

    // 2. SALARIED FOIR SLABS (Fixed Obligation to Income Ratio)
    // Slabs evaluated by Monthly Net Take-Home Salary (₹)
    salariedFoirSlabs: [
        { min: 0, max: 35000, foir: 0.45, label: '45% FOIR (Salary up to ₹35,000)' },
        { min: 35001, max: 75000, foir: 0.50, label: '50% FOIR (Salary ₹35,001 - ₹75,000)' },
        { min: 75001, max: 150000, foir: 0.60, label: '60% FOIR (Salary ₹75,001 - ₹1,50,000)' },
        { min: 150001, max: Infinity, foir: 0.65, label: '65% FOIR (Salary > ₹1,50,000)' }
    ],

    // 3. BUSINESS FOIR SLABS
    // Slabs evaluated by derived Monthly Income from ITR (₹)
    businessFoirSlabs: [
        { min: 0, max: 50000, foir: 0.50, label: '50% FOIR (Monthly income up to ₹50,000)' },
        { min: 50001, max: 100000, foir: 0.60, label: '60% FOIR (Monthly income ₹50,001 - ₹1,00,000)' },
        { min: 100001, max: Infinity, foir: 0.65, label: '65% FOIR (Monthly income > ₹1,00,000)' }
    ],

    // 4. INCOME ADD-BACK & MULTIPLIER RULES
    salariedAddBacks: {
        annualBonusPercent: 0.50,     // 50% of annual bonus considered monthly (bonus / 12 * 50%)
        rentalIncomePercent: 0.50     // 50% of verified rental income considered
    },

    businessAddBacks: {
        depreciationFactor: 1.00,     // 100% of book depreciation added back
        directorRemunerationFactor: 1.00, // 100% of partner/director salary added back
        termLoanInterestFactor: 1.00, // 100% of business term loan interest added back
        rentalIncomeFactor: 0.50      // 50% of rental income added back
    },

    // 5. EMI PER LAKH REFERENCE LOOKUP TABLE (At benchmark 8.5% ROI per ₹1,00,000)
    // Key: tenure in months -> EMI (₹)
    emiPerLakhLookup: {
        6: 17079,   // 6 Months
        12: 8722,   // 1 Year
        18: 5936,   // 1.5 Years
        24: 4546,   // 2 Years
        36: 3157,   // 3 Years
        48: 2465,   // 4 Years
        60: 2052,   // 5 Years
        72: 1778,   // 6 Years
        84: 1584,   // 7 Years
        120: 1240,  // 10 Years
        180: 985,   // 15 Years
        240: 868,   // 20 Years
        300: 805,   // 25 Years
        360: 769    // 30 Years
    },

    // 6. SANITY LIMITS & VALIDATION RULES
    limits: {
        minLoanAmount: 50000,         // ₹50,000
        maxLoanAmount: 500000000,     // ₹50 Crore
        minSalariedMonthlySalary: 10000, // Min ₹10,000 / month
        minBusinessAnnualProfit: 50000,  // Min ₹50,000 / year
        minTenureMonths: 6,
        maxTenureMonths: 360          // 30 Years
    },

    // 7. ANTI-BYPASS & SECURITY
    security: {
        tokenSecret: 'mm_loan_secure_token_secret_2026_mukesh_tiwari',
        tokenTtlSeconds: 1800,        // Token valid for 30 minutes
        minSubmitTimeMs: 2500,        // Submissions faster than 2.5s flagged as bot
        enableOtpVerification: false  // Config flag: Mobile OTP verification before submit (default OFF)
    }
};

/**
 * Helper: Parse tenure string to months
 * e.g. "20 Years" -> 240, "12 Months" -> 12, "2 Years" -> 24
 */
function parseTenureToMonths(tenureStr) {
    if (!tenureStr) return 240;
    if (typeof tenureStr === 'number') return tenureStr;
    const s = String(tenureStr).trim().toLowerCase();
    const numMatch = s.match(/\d+/);
    if (!numMatch) return 240;
    const val = parseInt(numMatch[0], 10);
    if (s.includes('year') || s.includes('yr')) {
        return val * 12;
    }
    return val;
}

/**
 * Calculate exact EMI per ₹1,00,000 for given tenure and ROI
 */
function calculateEmiPerLakh(tenureMonths, annualRoi) {
    const P = 100000;
    const r = (annualRoi / 12) / 100;
    const n = Math.max(1, tenureMonths);
    if (r <= 0) return Math.round(P / n);
    const pow = Math.pow(1 + r, n);
    const emi = (P * r * pow) / (pow - 1);
    return Math.round(emi);
}

/**
 * Core Eligibility Calculation Function
 */
function computeLoanEligibility(params) {
    const empType = String(params.empType || '').trim();
    const loanType = String(params.loanType || 'Home Loan').trim();
    const reqAmount = Math.max(0, parseFloat(params.loanAmount) || 0);
    const existingEmi = Math.max(0, parseFloat(params.loanExistingEmi) || 0);
    const tenureMonths = parseTenureToMonths(params.loanTenure);
    const cibil = String(params.cibilScore || params.cibil || '750+').trim();
    
    // Check if custom ROI is provided, otherwise evaluate category ROI + CIBIL adjustment
    const customRoi = parseFloat(params.customRoi || params.loanRoi);
    const categoryRoi = LOAN_ELIGIBILITY_CONFIG.roiByCategory[loanType] || LOAN_ELIGIBILITY_CONFIG.defaultRoi;
    const cibilInfo = LOAN_ELIGIBILITY_CONFIG.cibilSlabs[cibil] || LOAN_ELIGIBILITY_CONFIG.cibilSlabs['750+'];
    const roi = (!isNaN(customRoi) && customRoi >= 5.0 && customRoi <= 30.0) 
        ? customRoi 
        : parseFloat((categoryRoi + (cibilInfo.roiAdjustment || 0)).toFixed(2));

    // Check if Salaried
    const isSalaried = empType.toLowerCase().includes('salaried');

    let grossMonthlyIncome = 0;
    let appliedFoir = 0.50;
    let foirLabel = '';

    if (isSalaried) {
        const baseSalary = Math.max(0, parseFloat(params.loanIncome) || 0);
        const bonus = Math.max(0, parseFloat(params.bonusIncome) || 0);
        const rent = Math.max(0, parseFloat(params.rentalIncome) || 0);

        const monthlyBonus = (bonus / 12) * LOAN_ELIGIBILITY_CONFIG.salariedAddBacks.annualBonusPercent;
        const monthlyRent = rent * LOAN_ELIGIBILITY_CONFIG.salariedAddBacks.rentalIncomePercent;
        grossMonthlyIncome = baseSalary + monthlyBonus + monthlyRent;

        // Determine FOIR slab
        const slab = LOAN_ELIGIBILITY_CONFIG.salariedFoirSlabs.find(
            s => grossMonthlyIncome >= s.min && grossMonthlyIncome <= s.max
        ) || LOAN_ELIGIBILITY_CONFIG.salariedFoirSlabs[LOAN_ELIGIBILITY_CONFIG.salariedFoirSlabs.length - 1];

        appliedFoir = slab.foir;
        foirLabel = slab.label;
    } else {
        // Business / Self-Employed
        const netProfit = Math.max(0, parseFloat(params.loanIncome) || 0);
        const depr = Math.max(0, parseFloat(params.depreciation) || 0);
        const directorSalary = Math.max(0, parseFloat(params.directorSalary) || 0);
        const loanInterest = Math.max(0, parseFloat(params.termLoanInterest) || 0);
        const rent = Math.max(0, parseFloat(params.rentalIncome) || 0);

        const annualCashProfit = netProfit + 
            (depr * LOAN_ELIGIBILITY_CONFIG.businessAddBacks.depreciationFactor) +
            (directorSalary * LOAN_ELIGIBILITY_CONFIG.businessAddBacks.directorRemunerationFactor) +
            (loanInterest * LOAN_ELIGIBILITY_CONFIG.businessAddBacks.termLoanInterestFactor) +
            (rent * LOAN_ELIGIBILITY_CONFIG.businessAddBacks.rentalIncomeFactor);

        grossMonthlyIncome = Math.round(annualCashProfit / 12);

        // Determine FOIR slab
        const slab = LOAN_ELIGIBILITY_CONFIG.businessFoirSlabs.find(
            s => grossMonthlyIncome >= s.min && grossMonthlyIncome <= s.max
        ) || LOAN_ELIGIBILITY_CONFIG.businessFoirSlabs[LOAN_ELIGIBILITY_CONFIG.businessFoirSlabs.length - 1];

        appliedFoir = slab.foir;
        foirLabel = slab.label;
    }

    // Eligible EMI Capacity = (Monthly Income * FOIR) - Existing Obligations
    const maxAllowableEmi = Math.round(grossMonthlyIncome * appliedFoir);
    const eligibleEmiCapacity = Math.max(0, maxAllowableEmi - existingEmi);

    // EMI per Lakh
    const emiPerLakh = calculateEmiPerLakh(tenureMonths, roi);

    // Max Eligible Loan Amount
    let maxEligibleLoan = 0;
    if (emiPerLakh > 0 && eligibleEmiCapacity > 0) {
        maxEligibleLoan = Math.round((eligibleEmiCapacity / emiPerLakh) * 100000);
    }

    // Estimated EMI for the required loan amount
    const estimatedReqEmi = Math.round((reqAmount / 100000) * emiPerLakh);

    // Eligibility condition: Max Eligible Loan >= Required Loan Amount AND Eligible EMI > 0
    const isEligible = (maxEligibleLoan >= reqAmount) && (eligibleEmiCapacity > 0) && (grossMonthlyIncome > 0);

    // Generate Tailored Tips if Ineligible
    const tips = [];
    if (!isEligible) {
        if (maxEligibleLoan > 0) {
            const roundedLakh = Math.floor(maxEligibleLoan / 50000) * 0.5; // round to nearest 50k
            tips.push(`Borrowing Capacity: Based on your current income and FOIR, you qualify for up to ₹${formatIndianCurrencyNoSymbol(maxEligibleLoan)}.`);
        }
        if (existingEmi > 0) {
            const potentialGain = Math.round((existingEmi / emiPerLakh) * 100000);
            tips.push(`Clear Existing EMIs: Paying off existing loans of ₹${formatIndianCurrencyNoSymbol(existingEmi)}/mo can increase your eligibility by approx ₹${formatIndianCurrencyNoSymbol(potentialGain)}.`);
        }
        if (tenureMonths < 240) {
            tips.push(`Extend Tenure: Increasing your tenure to 20 or 25 years will lower monthly obligations and qualify you for higher sanction.`);
        }
        tips.push('Add a Co-Applicant: Including a earning spouse, parent, or partner can pool family income to comfortably meet this loan requirement.');
    }

    return {
        isEligible,
        isSalaried,
        grossMonthlyIncome,
        appliedFoir,
        foirPercentText: `${Math.round(appliedFoir * 100)}%`,
        foirLabel,
        existingEmi,
        eligibleEmiCapacity,
        maxEligibleLoan,
        reqAmount,
        tenureMonths,
        roi,
        cibilScore: cibil,
        emiPerLakh,
        estimatedReqEmi,
        tips
    };
}

function formatIndianCurrencyNoSymbol(num) {
    if (!num || isNaN(num)) return '0';
    const val = Math.round(num);
    const s = val.toString();
    if (s.length <= 3) return s;
    let lastThree = s.substring(s.length - 3);
    let otherNumbers = s.substring(0, s.length - 3);
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LOAN_ELIGIBILITY_CONFIG,
        parseTenureToMonths,
        calculateEmiPerLakh,
        computeLoanEligibility,
        formatIndianCurrencyNoSymbol
    };
}
