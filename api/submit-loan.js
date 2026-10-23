const crypto = require('crypto');
const {
    LOAN_ELIGIBILITY_CONFIG,
    computeLoanEligibility,
    formatIndianCurrencyNoSymbol
} = require('./eligibility-config');

// In-memory IP rate limiter for serverless environment
const ipSubmissionTracker = new Map();

function verifySignedToken(tokenBase64) {
    if (!tokenBase64) return { valid: false, reason: 'MISSING_TOKEN' };
    try {
        const decodedStr = Buffer.from(tokenBase64, 'base64').toString('utf8');
        const tokenObj = JSON.parse(decodedStr);
        if (!tokenObj || !tokenObj.payload || !tokenObj.signature) {
            return { valid: false, reason: 'MALFORMED_TOKEN' };
        }

        const dataStr = JSON.stringify(tokenObj.payload);
        const expectedSig = crypto
            .createHmac('sha256', LOAN_ELIGIBILITY_CONFIG.security.tokenSecret)
            .update(dataStr)
            .digest('hex');

        if (tokenObj.signature !== expectedSig) {
            return { valid: false, reason: 'INVALID_SIGNATURE' };
        }

        // Check expiration
        const now = Date.now();
        const ageSec = (now - (tokenObj.payload.timestamp || 0)) / 1000;
        if (ageSec > LOAN_ELIGIBILITY_CONFIG.security.tokenTtlSeconds) {
            return { valid: false, reason: 'EXPIRED_TOKEN' };
        }

        return { valid: true, payload: tokenObj.payload };
    } catch (e) {
        return { valid: false, reason: 'DECODE_ERROR' };
    }
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            status: 'error',
            message: 'Method not allowed. Only POST is accepted.'
        });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }
        body = body || {};

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

        // 1. Rate Limiting Check (Max 5 submissions per 10 minutes per IP)
        const now = Date.now();
        const windowMs = 10 * 60 * 1000;
        const maxSubmissions = 5;
        const clientHistory = ipSubmissionTracker.get(clientIp) || [];
        const recentSubmissions = clientHistory.filter(t => now - t < windowMs);

        if (recentSubmissions.length >= maxSubmissions) {
            return res.status(429).json({
                status: 'error',
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many applications submitted recently from this IP. Please wait a few minutes or contact Mukesh Tiwari directly on WhatsApp.'
            });
        }

        // 2. Anti-Bot: Honeypot Field Check
        // If a bot fills any hidden honeypot fields, reject immediately
        const honeypot = String(body.extra_loan_fax || body.website_url || '').trim();
        if (honeypot) {
            return res.status(400).json({
                status: 'error',
                code: 'BOT_DETECTED',
                message: 'Automated submission rejected.'
            });
        }

        // 3. Token Verification (Must have valid cryptographic signature from Step 1)
        const token = body.eligibilityToken;
        const tokenCheck = verifySignedToken(token);
        if (!tokenCheck.valid) {
            return res.status(403).json({
                status: 'error',
                code: 'INVALID_OR_MISSING_TOKEN',
                message: 'Eligibility verification token is missing or expired. Please perform the eligibility check again.',
                reason: tokenCheck.reason
            });
        }

        // 4. Anti-Bot: Time-Based Check using server token timestamp
        const tokenTimestamp = parseInt(tokenCheck.payload.timestamp, 10) || 0;
        if (tokenTimestamp && (now - tokenTimestamp < LOAN_ELIGIBILITY_CONFIG.security.minSubmitTimeMs)) {
            return res.status(400).json({
                status: 'error',
                code: 'SUBMISSION_TOO_FAST',
                message: 'Submission completed too fast. Please review your details and submit again.'
            });
        }

        // 5. SERVER-SIDE ELIGIBILITY RECOMPUTATION (Anti-Bypass Protection)
        // Even if DOM is edited or API is called directly, server verifies eligibility independently!
        const rawAmount = String(body.loanAmount || '').replace(/[^0-9.]/g, '');
        const rawIncome = String(body.loanIncome || '').replace(/[^0-9.]/g, '');
        const rawEmi = String(body.loanExistingEmi || '').replace(/[^0-9.]/g, '');

        const evalResult = computeLoanEligibility({
            empType: body.loanEmpType,
            loanType: body.loanType,
            loanAmount: parseFloat(rawAmount) || 0,
            loanIncome: parseFloat(rawIncome) || 0,
            loanExistingEmi: parseFloat(rawEmi) || 0,
            loanTenure: body.loanTenure,
            bonusIncome: parseFloat(String(body.bonusIncome || '').replace(/[^0-9.]/g, '')) || 0,
            rentalIncome: parseFloat(String(body.rentalIncome || '').replace(/[^0-9.]/g, '')) || 0,
            depreciation: parseFloat(String(body.depreciation || '').replace(/[^0-9.]/g, '')) || 0,
            directorSalary: parseFloat(String(body.directorSalary || '').replace(/[^0-9.]/g, '')) || 0,
            termLoanInterest: parseFloat(String(body.termLoanInterest || '').replace(/[^0-9.]/g, '')) || 0
        });

        if (!evalResult.isEligible) {
            return res.status(403).json({
                status: 'error',
                code: 'ELIGIBILITY_CHECK_FAILED',
                message: 'Application rejected: The submitted financial numbers do not meet lending eligibility criteria.',
                data: {
                    maxEligibleLoan: evalResult.maxEligibleLoan,
                    requestedLoan: evalResult.reqAmount,
                    tips: evalResult.tips
                }
            });
        }

        // 6. Applicant Details Validation (Step 2 Fields)
        const fullName = String(body.loanFullName || '').trim();
        const phone = String(body.loanPhone || '').replace(/[^0-9]/g, '');
        const email = String(body.loanEmail || '').trim();
        const city = String(body.loanCity || '').trim();
        const message = String(body.loanMessage || '').trim();

        if (fullName.length < 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid applicant full name.'
            });
        }

        // 10-digit Indian Mobile Regex (starts with 6, 7, 8, or 9)
        const indianPhoneRegex = /^[6-9]\d{9}$/;
        if (!indianPhoneRegex.test(phone)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid 10-digit Indian mobile number.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid email address.'
            });
        }

        // Record submission for rate limiting
        recentSubmissions.push(now);
        ipSubmissionTracker.set(clientIp, recentSubmissions);

        // 7. Build Official Verified WhatsApp Payload
        const formattedAmount = `₹${formatIndianCurrencyNoSymbol(evalResult.reqAmount)}`;
        const formattedMaxEligible = `₹${formatIndianCurrencyNoSymbol(evalResult.maxEligibleLoan)}`;
        const formattedIncome = `₹${formatIndianCurrencyNoSymbol(evalResult.grossMonthlyIncome)}`;
        const formattedEstEmi = `₹${formatIndianCurrencyNoSymbol(evalResult.estimatedReqEmi)}`;

        const waText = 
            `*New Verified Loan Lead — MM Financial Services*\n` +
            `----------------------------------------\n` +
            `*Status:* 🟢 ELIGIBLE (System Verified)\n` +
            `*Eligible Capacity:* Up to ${formattedMaxEligible}\n` +
            `*Requested Loan:* ${formattedAmount}\n` +
            `*Est. Monthly Installment:* ${formattedEstEmi}/mo\n` +
            `*Applied FOIR:* ${evalResult.foirPercentText} (${evalResult.foirLabel})\n` +
            `----------------------------------------\n` +
            `*Applicant Name:* ${fullName}\n` +
            `*Contact Number:* +91 ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Location / City:* ${city || 'Mumbai MMR'}\n` +
            `*Profile:* ${body.loanEmpType}\n` +
            `*Loan Type:* ${body.loanType}\n` +
            `*Monthly Income / Profit:* ${formattedIncome}\n` +
            `*Existing EMIs:* ₹${formatIndianCurrencyNoSymbol(evalResult.existingEmi)}/mo\n` +
            `*Preferred Tenure:* ${body.loanTenure}\n` +
            `*Applicant Notes:* ${message || 'None'}\n` +
            `----------------------------------------\n` +
            `*Verified At:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n` +
            `Advisor: Mukesh Tiwari (+91 95947 36833)`;

        const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(waText)}`;

        return res.status(200).json({
            status: 'success',
            message: `Congratulations ${fullName}! Your loan eligibility is verified. Connecting with Mukesh Tiwari...`,
            lead: {
                fullName,
                phone,
                email,
                city,
                loanAmount: evalResult.reqAmount,
                maxEligibleLoan: evalResult.maxEligibleLoan,
                estimatedEmi: evalResult.estimatedReqEmi,
                foirUsed: evalResult.foirPercentText,
                isEligible: true
            },
            waUrl
        });

    } catch (err) {
        console.error('Submit loan error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error while processing loan application.'
        });
    }
};
