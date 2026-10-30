const crypto = require('crypto');
const {
    LOAN_ELIGIBILITY_CONFIG,
    computeLoanEligibility,
    formatIndianCurrencyNoSymbol
} = require('./eligibility-config');

function createSignedToken(payload) {
    const dataStr = JSON.stringify(payload);
    const signature = crypto
        .createHmac('sha256', LOAN_ELIGIBILITY_CONFIG.security.tokenSecret)
        .update(dataStr)
        .digest('hex');
    const tokenObj = {
        payload,
        signature
    };
    return Buffer.from(JSON.stringify(tokenObj)).toString('base64');
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }
        body = body || {};

        // Support GET for testing
        if (req.method === 'GET') {
            body = req.query || {};
        }

        const empType = String(body.loanEmpType || body.empType || '').trim();
        const loanType = String(body.loanType || '').trim();
        const rawAmount = String(body.loanAmount || '').replace(/[^0-9.]/g, '');
        const rawIncome = String(body.loanIncome || '').replace(/[^0-9.]/g, '');
        const rawEmi = String(body.loanExistingEmi || '').replace(/[^0-9.]/g, '');
        const loanTenure = String(body.loanTenure || '20 Years').trim();

        // 1. Input Validation
        const errors = {};
        if (!empType) {
            errors.loanEmpType = 'Please select your employment profile.';
        }
        if (!loanType) {
            errors.loanType = 'Please select a loan category.';
        }

        const loanAmount = parseFloat(rawAmount);
        if (isNaN(loanAmount) || loanAmount < LOAN_ELIGIBILITY_CONFIG.limits.minLoanAmount) {
            errors.loanAmount = `Minimum loan amount is ₹${formatIndianCurrencyNoSymbol(LOAN_ELIGIBILITY_CONFIG.limits.minLoanAmount)}.`;
        } else if (loanAmount > LOAN_ELIGIBILITY_CONFIG.limits.maxLoanAmount) {
            errors.loanAmount = `Maximum loan amount is ₹${formatIndianCurrencyNoSymbol(LOAN_ELIGIBILITY_CONFIG.limits.maxLoanAmount)}.`;
        }

        const loanIncome = parseFloat(rawIncome);
        const isSalaried = empType.toLowerCase().includes('salaried');
        if (isNaN(loanIncome) || loanIncome <= 0) {
            errors.loanIncome = isSalaried 
                ? 'Please enter your monthly net salary.' 
                : 'Please enter your annual net profit as per ITR.';
        } else if (isSalaried && loanIncome < LOAN_ELIGIBILITY_CONFIG.limits.minSalariedMonthlySalary) {
            errors.loanIncome = `Minimum monthly salary for consideration is ₹${formatIndianCurrencyNoSymbol(LOAN_ELIGIBILITY_CONFIG.limits.minSalariedMonthlySalary)}.`;
        } else if (!isSalaried && loanIncome < LOAN_ELIGIBILITY_CONFIG.limits.minBusinessAnnualProfit) {
            errors.loanIncome = `Minimum annual net profit for consideration is ₹${formatIndianCurrencyNoSymbol(LOAN_ELIGIBILITY_CONFIG.limits.minBusinessAnnualProfit)}.`;
        }

        const loanExistingEmi = parseFloat(rawEmi) || 0;
        if (loanExistingEmi < 0) {
            errors.loanExistingEmi = 'Existing EMI obligations cannot be negative.';
        }

        const loanCibil = String(body.loanCibil || body.cibilScore || '750+').trim();
        const customRoi = parseFloat(body.loanRoi || body.customRoi);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed. Please correct the highlighted fields.',
                errors
            });
        }

        // 2. Perform Eligibility Computation
        const result = computeLoanEligibility({
            empType,
            loanType,
            loanAmount,
            loanIncome,
            loanExistingEmi,
            loanTenure,
            cibilScore: loanCibil,
            customRoi: !isNaN(customRoi) ? customRoi : undefined,
            customFoir: body.customFoir !== undefined ? parseFloat(body.customFoir) : undefined,
            rentalFoir: body.rentalFoir !== undefined ? parseFloat(body.rentalFoir) : undefined,
            bonusIncome: parseFloat(String(body.bonusIncome || '').replace(/[^0-9.]/g, '')) || 0,
            rentalIncome: parseFloat(String(body.rentalIncome || '').replace(/[^0-9.]/g, '')) || 0,
            depreciation: parseFloat(String(body.depreciation || '').replace(/[^0-9.]/g, '')) || 0,
            directorSalary: parseFloat(String(body.directorSalary || '').replace(/[^0-9.]/g, '')) || 0,
            termLoanInterest: parseFloat(String(body.termLoanInterest || '').replace(/[^0-9.]/g, '')) || 0
        });

        const timestamp = Date.now();

        // 3. If Eligible: Generate Cryptographic Signed Token for Step 2
        let token = null;
        if (result.isEligible) {
            token = createSignedToken({
                empType,
                loanType,
                loanAmount,
                loanIncome,
                loanExistingEmi,
                loanTenure,
                maxEligibleLoan: result.maxEligibleLoan,
                foirUsed: result.foirPercentText,
                estimatedEmi: result.estimatedReqEmi,
                timestamp
            });
        }

        return res.status(200).json({
            status: 'ok',
            eligible: result.isEligible,
            data: {
                isEligible: result.isEligible,
                isSalaried: result.isSalaried,
                baseMonthlyIncome: result.baseMonthlyIncome || 0,
                consideredRentMonthly: result.consideredRentMonthly || 0,
                consideredBonusMonthly: result.consideredBonusMonthly || 0,
                consideredDeprMonthly: result.consideredDeprMonthly || 0,
                consideredRemunMonthly: result.consideredRemunMonthly || 0,
                existingEmi: result.existingEmi || 0,
                grossMonthlyIncome: result.grossMonthlyIncome,
                formattedGrossIncome: `₹${formatIndianCurrencyNoSymbol(result.grossMonthlyIncome)}`,
                foirUsed: result.foirPercentText,
                foirLabel: result.foirLabel,
                eligibleEmiCapacity: result.eligibleEmiCapacity,
                formattedEmiCapacity: `₹${formatIndianCurrencyNoSymbol(result.eligibleEmiCapacity)} / month`,
                maxEligibleLoan: result.maxEligibleLoan,
                formattedMaxLoan: `₹${formatIndianCurrencyNoSymbol(result.maxEligibleLoan)}`,
                reqAmount: result.reqAmount,
                formattedReqAmount: `₹${formatIndianCurrencyNoSymbol(result.reqAmount)}`,
                estimatedReqEmi: result.estimatedReqEmi,
                formattedEstimatedEmi: `₹${formatIndianCurrencyNoSymbol(result.estimatedReqEmi)} / month`,
                tenureMonths: result.tenureMonths,
                roi: result.roi,
                tips: result.tips,
                token,
                timestamp
            }
        });
    } catch (err) {
        console.error('Check eligibility error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred during eligibility verification.'
        });
    }
};
