const fs = require('fs');
const path = require('path');

// In serverless, /tmp is writable across invocations within the same container instance.
// In local dev, ./data/records.json is persistent.
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'records.json');
const TMP_DATA_FILE = path.join('/tmp', 'mmt_records.json');

function getDataFilePath() {
    try {
        if (!fs.existsSync(LOCAL_DATA_DIR)) {
            fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
        }
        return LOCAL_DATA_FILE;
    } catch (e) {
        return TMP_DATA_FILE;
    }
}

// In-memory fallback cache
let memoryStore = {
    enquiries: [],
    leads: []
};

function readStore() {
    const filePath = getDataFilePath();
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.enquiries) && Array.isArray(parsed.leads)) {
                // Merge with in-memory to preserve records
                const enqIds = new Set(parsed.enquiries.map(e => e.id));
                memoryStore.enquiries.forEach(e => {
                    if (!enqIds.has(e.id)) parsed.enquiries.unshift(e);
                });
                const leadIds = new Set(parsed.leads.map(l => l.id));
                memoryStore.leads.forEach(l => {
                    if (!leadIds.has(l.id)) parsed.leads.unshift(l);
                });
                memoryStore = parsed;
                return parsed;
            }
        }
    } catch (err) {
        console.warn('Error reading store file, using memory store:', err.message);
    }
    return memoryStore;
}

function writeStore(store) {
    memoryStore = store;
    const filePath = getDataFilePath();
    try {
        fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
    } catch (err) {
        console.warn('Error writing store file:', err.message);
    }
}

const ADMIN_PIN = 'mmt@2026';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }
        body = body || {};

        const action = req.query.action || body.action || '';

        // 1. PUBLIC ACTIONS: SAVE ENQUIRY / SAVE LEAD (from forms or calculators)
        if (action === 'save-enquiry' || (req.method === 'POST' && body.type === 'enquiry')) {
            const store = readStore();
            const enquiry = {
                id: 'ENQ-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: 'enquiry',
                category: body.category || 'General',
                customerName: String(body.customerName || body.fullName || 'Anonymous Visitor').trim(),
                phone: String(body.phone || body.phoneNum || '').trim(),
                email: String(body.email || '').trim(),
                city: String(body.city || '').trim(),
                amount: body.amount || body.approxAmount || body.loanAmount || '',
                details: body.details || body.notes || body.message || {},
                status: 'New',
                timestamp: new Date().toISOString(),
                istTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
            };

            store.enquiries.unshift(enquiry);
            // Cap at 2000
            if (store.enquiries.length > 2000) store.enquiries.pop();
            writeStore(store);

            return res.status(200).json({ status: 'success', id: enquiry.id, message: 'Enquiry recorded' });
        }

        if (action === 'save-lead' || (req.method === 'POST' && body.type === 'lead')) {
            const store = readStore();
            const lead = {
                id: 'LEAD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: 'lead',
                category: body.category || 'Loan Application',
                customerName: String(body.customerName || body.fullName || body.loanFullName || 'Anonymous Lead').trim(),
                phone: String(body.phone || body.loanPhone || '').trim(),
                email: String(body.email || body.loanEmail || '').trim(),
                city: String(body.city || body.loanCity || 'Mumbai MMR').trim(),
                loanType: body.loanType || '',
                empType: body.empType || body.loanEmpType || '',
                requestedAmount: body.requestedAmount || body.loanAmount || 0,
                maxEligibleLoan: body.maxEligibleLoan || '',
                estimatedEmi: body.estimatedEmi || '',
                roi: body.roi || '',
                cibilScore: body.cibilScore || body.loanCibil || '',
                foirUsed: body.foirUsed || '',
                monthlyIncome: body.monthlyIncome || body.loanIncome || '',
                existingEmi: body.existingEmi || body.loanExistingEmi || 0,
                preferredTenure: body.preferredTenure || body.loanTenure || '',
                notes: body.notes || body.message || '',
                status: 'New',
                verified: true,
                timestamp: new Date().toISOString(),
                istTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
            };

            store.leads.unshift(lead);
            if (store.leads.length > 2000) store.leads.pop();
            writeStore(store);

            return res.status(200).json({ status: 'success', id: lead.id, message: 'Lead recorded' });
        }

        // 2. ADMIN AUTH CHECK FOR PRIVILEGED ACTIONS
        const reqPin = req.headers['x-admin-pin'] || req.query.pin || body.pin || '';
        if (reqPin !== ADMIN_PIN) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized. Invalid Admin PIN.' });
        }

        // 3. ADMIN PRIVILEGED ACTIONS
        if (action === 'get-all' || req.method === 'GET') {
            const store = readStore();
            return res.status(200).json({
                status: 'success',
                counts: {
                    enquiries: store.enquiries.length,
                    leads: store.leads.length,
                    total: store.enquiries.length + store.leads.length
                },
                enquiries: store.enquiries,
                leads: store.leads
            });
        }

        if (action === 'update-status') {
            const { id, targetType, newStatus } = body;
            const store = readStore();
            const list = targetType === 'lead' ? store.leads : store.enquiries;
            const item = list.find(x => x.id === id);
            if (item) {
                item.status = newStatus || 'Contacted';
                item.updatedAt = new Date().toISOString();
                writeStore(store);
                return res.status(200).json({ status: 'success', message: 'Status updated' });
            }
            return res.status(404).json({ status: 'error', message: 'Record not found' });
        }

        if (action === 'delete-record') {
            const { id, targetType } = body;
            const store = readStore();
            if (targetType === 'lead') {
                store.leads = store.leads.filter(x => x.id !== id);
            } else {
                store.enquiries = store.enquiries.filter(x => x.id !== id);
            }
            writeStore(store);
            return res.status(200).json({ status: 'success', message: 'Record deleted' });
        }

        if (action === 'clear-all') {
            writeStore({ enquiries: [], leads: [] });
            return res.status(200).json({ status: 'success', message: 'All records cleared' });
        }

        return res.status(400).json({ status: 'error', message: 'Unknown action' });

    } catch (err) {
        console.error('Admin API error:', err);
        return res.status(500).json({ status: 'error', message: err.message || 'Internal server error' });
    }
};
