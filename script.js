/**
 * MM FINANCIAL SERVICES CONSULTANT
 * Advisor: Mukesh Tiwari
 * Script: GSAP Animations, Live Financial Calculators (EMI & SIP), Filtering, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderAndNav();
    initHeroAnimations();
    initStatCounters();
    initServiceFilters();
    initServiceCardCalculators();
    initEnquiryButtons();
    initCalculators();
    initFaqAccordion();
    initContactForm();
    initScrollReveals();
    initTypewriterAnimation();
    initBioToggle();
    initTestimonialsCarousel();
    initDedicatedEnquiryForms();
});

/* ==========================================================================
   1. Header, Sticky Behavior & Mobile Drawer
   ========================================================================== */
function initHeaderAndNav() {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Drawer Open / Close
    function openDrawer() {
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        drawerBackdrop.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.drawer-link', 
                { opacity: 0, x: 20 }, 
                { opacity: 1, x: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out', delay: 0.1 }
            );
        }
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        drawerBackdrop.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   2. GSAP Hero & Entrance Animations
   ========================================================================== */
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Timeline for Hero
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });

    heroTl.from('.hero-badge-pill', { opacity: 0, y: -20, delay: 0.1 })
          .from('.hero-headline', { opacity: 0, y: 25, duration: 1 }, '-=0.5')
          .from('.hero-subtext', { opacity: 0, y: 20 }, '-=0.6')
          .from('.hero-trust-strip', { opacity: 0, scale: 0.96, y: 15 }, '-=0.5')
          .from('.hero-cta-group', { opacity: 0, y: 20 }, '-=0.5')
          .from('.hero-subnote', { opacity: 0 }, '-=0.4');

    // Continuous subtle floating animation for founder badge
    if (document.querySelector('.founder-floating-badge')) {
        gsap.to('.founder-floating-badge', {
            y: -5,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

/* ==========================================================================
   3. Stat Counters with GSAP ScrollTrigger
   ========================================================================== */
function initStatCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    if (!statCards.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        statCards.forEach(card => {
            const numEl = card.querySelector('.stat-num');
            if (!numEl) return;

            const targetVal = parseFloat(numEl.getAttribute('data-target')) || 0;

            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(numEl, {
                        innerText: targetVal,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        onUpdate: function () {
                            numEl.innerHTML = Math.ceil(this.targets()[0].innerText);
                        }
                    });
                }
            });
        });
    } else {
        // Fallback if GSAP is not present
        statCards.forEach(card => {
            const numEl = card.querySelector('.stat-num');
            if (numEl) numEl.innerText = numEl.getAttribute('data-target') || '0';
        });
    }
}

/* ==========================================================================
   4. Services Filter Tabs
   ========================================================================== */
function initServiceFilters() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const serviceCards = document.querySelectorAll('.service-pillar-card, .service-card');
    const pillarLinks = document.querySelectorAll('.pillar-link');

    function applyFilter(category) {
        filterPills.forEach(btn => {
            const isMatch = btn.getAttribute('data-filter') === category;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        serviceCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'flex';
                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(card);
                    gsap.set(card, { x: 0, clearProps: 'transform' });
                    gsap.fromTo(card, 
                        { opacity: 0, y: 15, x: 0 }, 
                        { opacity: 1, y: 0, x: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' }
                    );
                } else {
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                }
            } else {
                card.style.display = 'none';
                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(card);
                    gsap.set(card, { clearProps: 'transform' });
                }
            }
        });

        // Auto-switch focused category card to dedicated calculators view
        if (category !== 'all') {
            const targetCard = document.querySelector(`.service-card[data-category="${category}"]`);
            if (targetCard) {
                const calcsTab = targetCard.querySelector('.svc-tab-btn[data-view="calculators"]');
                if (calcsTab) calcsTab.click();
            }
        }

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cat = pill.getAttribute('data-filter');
            applyFilter(cat);
        });
    });

    // Handle clicks from "Four Pillars" explore links
    pillarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetFilter = link.getAttribute('data-filter');
            if (targetFilter) {
                applyFilter(targetFilter);
            }
        });
    });
}

/* ==========================================================================
   4A. Interactive Dedicated In-Card Calculators Switcher
   ========================================================================== */
function initServiceCardCalculators() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const catBar = card.querySelector('.service-cat-bar');
        const triggerPill = card.querySelector('.cat-pill-calc-trigger');
        const tabBtns = card.querySelectorAll('.svc-tab-btn');
        const viewServices = card.querySelector('.svc-view-services');
        const viewCalculators = card.querySelector('.svc-view-calculators');
        const actionBtn = card.querySelector('.btn-calc-expander-action');
        const backBtn = card.querySelector('.btn-back-services');

        function switchView(viewName) {
            tabBtns.forEach(btn => {
                const isActive = btn.getAttribute('data-view') === viewName;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            if (viewName === 'calculators') {
                if (viewServices) viewServices.classList.remove('active');
                if (viewCalculators) viewCalculators.classList.add('active');
            } else {
                if (viewCalculators) viewCalculators.classList.remove('active');
                if (viewServices) viewServices.classList.add('active');
            }
        }

        // Tab button clicks
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const view = btn.getAttribute('data-view');
                if (view) switchView(view);
            });
        });

        // Header bar click toggles view
        if (catBar) {
            catBar.addEventListener('click', (e) => {
                // If clicked on an action inside header, let it handle
                if (e.target.closest('a, button.open-enquiry-btn')) return;
                const isCalcsActive = viewCalculators && viewCalculators.classList.contains('active');
                switchView(isCalcsActive ? 'services' : 'calculators');
            });

            catBar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isCalcsActive = viewCalculators && viewCalculators.classList.contains('active');
                    switchView(isCalcsActive ? 'services' : 'calculators');
                }
            });
        }

        // Trigger pill click
        if (triggerPill) {
            triggerPill.addEventListener('click', (e) => {
                e.stopPropagation();
                switchView('calculators');
            });
        }

        // Explore calculators action button
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                switchView('calculators');
            });
        }

        // Back to services button
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                switchView('services');
            });
        }
    });
}

/* ==========================================================================
   5. "Enquire Now" Buttons Pre-populate Contact Form
   ========================================================================== */
function initEnquiryButtons() {
    const enquiryButtons = document.querySelectorAll('.open-enquiry-btn');
    const serviceSelect = document.getElementById('serviceSelect');
    const contactSection = document.getElementById('contact');
    const fullNameInput = document.getElementById('fullName');

    enquiryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service');
            if (serviceSelect && serviceName) {
                // Find matching option
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    if (serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase()) ||
                        serviceName.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
                        serviceSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    if (fullNameInput) fullNameInput.focus();
                }, 600);
            }
        });
    });
}

/* ==========================================================================
   6. Interactive EMI & SIP Calculators (Accurate Formulas & Indian Formatting)
   ========================================================================== */
function initCalculators() {
    if (!document.getElementById('tabBtnEmi')) return;
    // Tab switching
    const tabBtnEmi = document.getElementById('tabBtnEmi');
    const tabBtnSip = document.getElementById('tabBtnSip');
    const emiPane = document.getElementById('emiTab');
    const sipPane = document.getElementById('sipTab');

    function switchCalcTab(activeTab) {
        if (activeTab === 'emi') {
            tabBtnEmi.classList.add('active');
            tabBtnEmi.setAttribute('aria-selected', 'true');
            tabBtnSip.classList.remove('active');
            tabBtnSip.setAttribute('aria-selected', 'false');
            emiPane.classList.add('active');
            sipPane.classList.remove('active');
        } else {
            tabBtnSip.classList.add('active');
            tabBtnSip.setAttribute('aria-selected', 'true');
            tabBtnEmi.classList.remove('active');
            tabBtnEmi.setAttribute('aria-selected', 'false');
            sipPane.classList.add('active');
            emiPane.classList.remove('active');
        }
    }

    if (tabBtnEmi) tabBtnEmi.addEventListener('click', () => switchCalcTab('emi'));
    if (tabBtnSip) tabBtnSip.addEventListener('click', () => switchCalcTab('sip'));

    // --- Format in Indian Rupee format (e.g., 35,00,000) ---
    function formatINR(val) {
        const rounded = Math.round(val);
        return rounded.toLocaleString('en-IN');
    }

    function formatLakhCrore(val) {
        if (val >= 10000000) {
            return `₹${(val / 10000000).toFixed(2)} Cr`;
        } else if (val >= 100000) {
            return `₹${(val / 100000).toFixed(2)} Lakhs`;
        }
        return `₹${formatINR(val)}`;
    }

    // ================= EMI CALCULATOR =================
    const emiAmountInput = document.getElementById('emiAmountInput');
    const emiAmountRange = document.getElementById('emiAmountRange');
    const emiAmountDisplay = document.getElementById('emiAmountDisplayFormatted');

    const emiRateInput = document.getElementById('emiRateInput');
    const emiRateRange = document.getElementById('emiRateRange');
    const emiRateDisplay = document.getElementById('emiRateDisplayFormatted');

    const emiTenureInput = document.getElementById('emiTenureInput');
    const emiTenureRange = document.getElementById('emiTenureRange');
    const emiTenureDisplay = document.getElementById('emiTenureDisplayFormatted');

    const emiMonthlyResult = document.getElementById('emiMonthlyResult');
    const emiPrincipalResult = document.getElementById('emiPrincipalResult');
    const emiInterestResult = document.getElementById('emiInterestResult');
    const emiTotalPayableResult = document.getElementById('emiTotalPayableResult');
    const emiPrincipalBar = document.getElementById('emiPrincipalBar');
    const emiInterestBar = document.getElementById('emiInterestBar');
    const emiPrincipalPct = document.getElementById('emiPrincipalPct');
    const emiInterestPct = document.getElementById('emiInterestPct');

    function calculateEMI() {
        const P = parseFloat(emiAmountInput.value) || 0;
        const annualRate = parseFloat(emiRateInput.value) || 0;
        const years = parseFloat(emiTenureInput.value) || 0;

        const monthlyRate = (annualRate / 12) / 100;
        const totalMonths = years * 12;

        if (P <= 0 || monthlyRate <= 0 || totalMonths <= 0) return;

        // EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        const monthlyEMI = (P * monthlyRate * factor) / (factor - 1);
        const totalPayable = monthlyEMI * totalMonths;
        const totalInterest = totalPayable - P;

        const principalRatio = Math.round((P / totalPayable) * 100);
        const interestRatio = 100 - principalRatio;

        // Render values
        if (emiMonthlyResult) emiMonthlyResult.innerText = formatINR(monthlyEMI);
        if (emiPrincipalResult) emiPrincipalResult.innerText = `₹${formatINR(P)}`;
        if (emiInterestResult) emiInterestResult.innerText = `₹${formatINR(totalInterest)}`;
        if (emiTotalPayableResult) emiTotalPayableResult.innerText = `₹${formatINR(totalPayable)}`;

        if (emiPrincipalBar) emiPrincipalBar.style.width = `${principalRatio}%`;
        if (emiInterestBar) emiInterestBar.style.width = `${interestRatio}%`;
        if (emiPrincipalPct) emiPrincipalPct.innerText = `${principalRatio}%`;
        if (emiInterestPct) emiInterestPct.innerText = `${interestRatio}%`;

        // Update display formatted chips
        if (emiAmountDisplay) emiAmountDisplay.innerText = `${formatLakhCrore(P)} (₹${formatINR(P)})`;
        if (emiRateDisplay) emiRateDisplay.innerText = `${annualRate.toFixed(2)}% p.a.`;
        if (emiTenureDisplay) emiTenureDisplay.innerText = `${years} Years (${totalMonths} Months)`;
    }

    // Sync Range <-> Numeric Inputs for EMI
    if (emiAmountRange && emiAmountInput) {
        emiAmountRange.addEventListener('input', () => {
            emiAmountInput.value = emiAmountRange.value;
            calculateEMI();
        });
        emiAmountInput.addEventListener('input', () => {
            emiAmountRange.value = emiAmountInput.value;
            calculateEMI();
        });
    }

    if (emiRateRange && emiRateInput) {
        emiRateRange.addEventListener('input', () => {
            emiRateInput.value = emiRateRange.value;
            calculateEMI();
        });
        emiRateInput.addEventListener('input', () => {
            emiRateRange.value = emiRateInput.value;
            calculateEMI();
        });
    }

    if (emiTenureRange && emiTenureInput) {
        emiTenureRange.addEventListener('input', () => {
            emiTenureInput.value = emiTenureRange.value;
            calculateEMI();
        });
        emiTenureInput.addEventListener('input', () => {
            emiTenureRange.value = emiTenureInput.value;
            calculateEMI();
        });
    }

    // EMI Presets
    const emiPresets = document.querySelectorAll('.calc-preset-btn');
    emiPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            if (type === 'home') {
                emiAmountInput.value = 5000000;
                emiAmountRange.value = 5000000;
                emiRateInput.value = 8.4;
                emiRateRange.value = 8.4;
                emiTenureInput.value = 20;
                emiTenureRange.value = 20;
            } else if (type === 'lap') {
                emiAmountInput.value = 7500000;
                emiAmountRange.value = 7500000;
                emiRateInput.value = 9.2;
                emiRateRange.value = 9.2;
                emiTenureInput.value = 15;
                emiTenureRange.value = 15;
            } else if (type === 'personal') {
                emiAmountInput.value = 500000;
                emiAmountRange.value = 500000;
                emiRateInput.value = 11.5;
                emiRateRange.value = 11.5;
                emiTenureInput.value = 5;
                emiTenureRange.value = 5;
            }
            calculateEMI();
        });
    });

    // ================= SIP CALCULATOR =================
    const sipMonthlyInput = document.getElementById('sipMonthlyInput');
    const sipMonthlyRange = document.getElementById('sipMonthlyRange');
    const sipMonthlyDisplay = document.getElementById('sipMonthlyDisplayFormatted');

    const sipReturnInput = document.getElementById('sipReturnInput');
    const sipReturnRange = document.getElementById('sipReturnRange');
    const sipReturnDisplay = document.getElementById('sipReturnDisplayFormatted');

    const sipYearsInput = document.getElementById('sipYearsInput');
    const sipYearsRange = document.getElementById('sipYearsRange');
    const sipYearsDisplay = document.getElementById('sipYearsDisplayFormatted');

    const sipMaturityResult = document.getElementById('sipMaturityResult');
    const sipInvestedResult = document.getElementById('sipInvestedResult');
    const sipGrowthResult = document.getElementById('sipGrowthResult');
    const sipTotalValueResult = document.getElementById('sipTotalValueResult');
    const sipInvestedBar = document.getElementById('sipInvestedBar');
    const sipGrowthBar = document.getElementById('sipGrowthBar');
    const sipInvestedPct = document.getElementById('sipInvestedPct');
    const sipGrowthPct = document.getElementById('sipGrowthPct');

    function calculateSIP() {
        const P = parseFloat(sipMonthlyInput.value) || 0;
        const annualRate = parseFloat(sipReturnInput.value) || 0;
        const years = parseFloat(sipYearsInput.value) || 0;

        const i = (annualRate / 12) / 100; // Monthly rate
        const n = years * 12; // Total installments

        if (P <= 0 || i <= 0 || n <= 0) return;

        // SIP Compound Formula: M = P * [((1 + i)^n - 1) / i] * (1 + i)
        const maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const totalInvested = P * n;
        const estimatedGrowth = maturityValue - totalInvested;

        const investedRatio = Math.round((totalInvested / maturityValue) * 100);
        const growthRatio = 100 - investedRatio;

        if (sipMaturityResult) sipMaturityResult.innerText = formatINR(maturityValue);
        if (sipInvestedResult) sipInvestedResult.innerText = `₹${formatINR(totalInvested)}`;
        if (sipGrowthResult) sipGrowthResult.innerText = `₹${formatINR(estimatedGrowth)}`;
        if (sipTotalValueResult) sipTotalValueResult.innerText = `₹${formatINR(maturityValue)}`;

        if (sipInvestedBar) sipInvestedBar.style.width = `${investedRatio}%`;
        if (sipGrowthBar) sipGrowthBar.style.width = `${growthRatio}%`;
        if (sipInvestedPct) sipInvestedPct.innerText = `${investedRatio}%`;
        if (sipGrowthPct) sipGrowthPct.innerText = `${growthRatio}%`;

        // Update display text
        if (sipMonthlyDisplay) sipMonthlyDisplay.innerText = `₹${formatINR(P)} / month`;
        if (sipReturnDisplay) sipReturnDisplay.innerText = `${annualRate.toFixed(1)}% p.a.`;
        if (sipYearsDisplay) sipYearsDisplay.innerText = `${years} Years (${n} SIP Installments)`;
    }

    // Sync Range <-> Numeric Inputs for SIP
    if (sipMonthlyRange && sipMonthlyInput) {
        sipMonthlyRange.addEventListener('input', () => {
            sipMonthlyInput.value = sipMonthlyRange.value;
            calculateSIP();
        });
        sipMonthlyInput.addEventListener('input', () => {
            sipMonthlyRange.value = sipMonthlyInput.value;
            calculateSIP();
        });
    }

    if (sipReturnRange && sipReturnInput) {
        sipReturnRange.addEventListener('input', () => {
            sipReturnInput.value = sipReturnRange.value;
            calculateSIP();
        });
        sipReturnInput.addEventListener('input', () => {
            sipReturnRange.value = sipReturnInput.value;
            calculateSIP();
        });
    }

    if (sipYearsRange && sipYearsInput) {
        sipYearsRange.addEventListener('input', () => {
            sipYearsInput.value = sipYearsRange.value;
            calculateSIP();
        });
        sipYearsInput.addEventListener('input', () => {
            sipYearsRange.value = sipYearsInput.value;
            calculateSIP();
        });
    }

    // SIP Presets
    const sipPresets = document.querySelectorAll('.calc-preset-sip-btn');
    sipPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            const amt = parseFloat(btn.getAttribute('data-amt'));
            const ret = parseFloat(btn.getAttribute('data-ret'));
            const yrs = parseFloat(btn.getAttribute('data-yrs'));

            if (amt) {
                sipMonthlyInput.value = amt;
                sipMonthlyRange.value = amt;
            }
            if (ret) {
                sipReturnInput.value = ret;
                sipReturnRange.value = ret;
            }
            if (yrs) {
                sipYearsInput.value = yrs;
                sipYearsRange.value = yrs;
            }
            calculateSIP();
        });
    });

    // Initial calculations on page load
    calculateEMI();
    calculateSIP();
}

/* ==========================================================================
   7. FAQ Accordion Toggles
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const toggleIcon = item.querySelector('.faq-toggle-icon');

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const btn = otherItem.querySelector('.faq-question');
                const icon = otherItem.querySelector('.faq-toggle-icon');
                if (btn) btn.setAttribute('aria-expanded', 'false');
                if (icon) icon.innerHTML = '&#43;';
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                if (toggleIcon) toggleIcon.innerHTML = '&minus;';
            }
        });
    });
}

/* ==========================================================================
   8. FormSubmit.co Email Dispatcher & Contact Consultation Form
   ========================================================================== */

/**
 * Dispatch lead data to Mukesh Tiwari via FormSubmit.co AJAX API
 * Target Recipient: mmfsc09@gmail.com
 */
async function sendLeadToEmail(data, subject, replyToEmail) {
    try {
        const payload = Object.assign({
            _subject: subject || 'New Lead — MM Financial Services',
            _template: 'table',
            _captcha: 'false'
        }, data);

        if (replyToEmail) {
            payload._replyto = replyToEmail;
        }

        const response = await fetch('https://formsubmit.co/ajax/mmfsc09@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result;
    } catch (err) {
        console.warn('FormSubmit.co notification error (fallback to WhatsApp):', err);
        return { success: false, error: err };
    }
}

function initContactForm() {
    const form = document.getElementById('consultationForm');
    const fullName = document.getElementById('fullName');
    const phoneNum = document.getElementById('phoneNum');
    const serviceSelect = document.getElementById('serviceSelect');
    const approxAmount = document.getElementById('approxAmount');
    const messageText = document.getElementById('messageText');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const formStatusMsg = document.getElementById('formStatusMsg');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple client-side validation
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.form-field').forEach(field => field.classList.remove('has-error'));
        if (formStatusMsg) formStatusMsg.style.display = 'none';

        // Check Full Name
        if (!fullName.value.trim() || fullName.value.trim().length < 2) {
            fullName.closest('.form-field').classList.add('has-error');
            isValid = false;
        }

        // Check Phone (standard Indian 10 digits regex)
        const cleanPhone = phoneNum.value.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10) {
            phoneNum.closest('.form-field').classList.add('has-error');
            isValid = false;
        }

        // Check Service
        if (!serviceSelect.value) {
            serviceSelect.closest('.form-field').classList.add('has-error');
            isValid = false;
        }

        if (!isValid) return;

        // Button state during submission
        if (btnText) btnText.innerText = 'Connecting to Mukesh Tiwari...';
        if (submitBtn) submitBtn.disabled = true;

        const enteredName = fullName.value.trim();
        const enteredPhone = phoneNum.value.trim();
        const selectedService = serviceSelect.value;
        const enteredAmount = approxAmount.value.trim() || 'Not specified';
        const enteredMsg = messageText.value.trim() || 'No specific notes';

        // Build WhatsApp redirect link
        const whatsappText = `*New Consultation Request — MM Financial Services*%0A` +
            `*Name:* ${encodeURIComponent(enteredName)}%0A` +
            `*Phone:* ${encodeURIComponent(enteredPhone)}%0A` +
            `*Service:* ${encodeURIComponent(selectedService)}%0A` +
            `*Amount/Budget:* ${encodeURIComponent(enteredAmount)}%0A` +
            `*Notes:* ${encodeURIComponent(enteredMsg)}`;

        const whatsappUrl = `https://wa.me/919594736833?text=${whatsappText}`;

        // Dispatch lead notification email via FormSubmit.co
        sendLeadToEmail({
            "Applicant Name": enteredName,
            "Mobile / WhatsApp": `+91 ${cleanPhone}`,
            "Service Requested": selectedService,
            "Approx Budget / Amount": enteredAmount,
            "Notes / Requirements": enteredMsg,
            "Submitted At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
        }, `New Consultation Request: ${enteredName} (${selectedService})`);

        setTimeout(() => {
            if (formStatusMsg) {
                formStatusMsg.className = 'form-status-msg success';
                formStatusMsg.style.display = 'block';
                formStatusMsg.innerHTML = `&#10003; <strong>Thank you, ${enteredName}!</strong> Your consultation request has been received. Redirecting to WhatsApp for instant confirmation...`;
            }

            // Open WhatsApp after brief feedback
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                if (btnText) btnText.innerText = 'Consultation Request Sent!';
                form.reset();
                if (submitBtn) submitBtn.disabled = false;
            }, 1200);
        }, 600);
    });

    // Remove error class on user input
    [fullName, phoneNum, serviceSelect].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                const parent = input.closest('.form-field');
                if (parent) parent.classList.remove('has-error');
            });
        }
    });

    // Direct WhatsApp Chat button
    const directWaBtn = document.getElementById('homeDirectWaBtn');
    if (directWaBtn) {
        directWaBtn.addEventListener('click', () => {
            const enteredName = fullName ? fullName.value.trim() : '';
            const enteredPhone = phoneNum ? phoneNum.value.trim() : '';
            const selectedService = serviceSelect ? serviceSelect.value : '';
            const enteredAmount = approxAmount ? approxAmount.value.trim() : '';
            const enteredMsg = messageText ? messageText.value.trim() : '';

            let msg = `*Consultation Enquiry — Direct WhatsApp Chat*\n` +
                      `Hello Mukesh ji, I would like to consult with you.\n\n`;
            if (enteredName) msg += `*Name:* ${enteredName}\n`;
            if (enteredPhone) msg += `*Mobile:* ${enteredPhone}\n`;
            if (selectedService) msg += `*Service:* ${selectedService}\n`;
            if (enteredAmount) msg += `*Amount / Budget:* ${enteredAmount}\n`;
            if (enteredMsg) msg += `*Notes:* ${enteredMsg}\n`;

            const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
        });
    }
}

/* ==========================================================================
   9. COMPREHENSIVE GEN Z SCROLL ANIMATIONS — Mobile + Desktop
   ========================================================================== */
function initScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Ignore mobile address bar show/hide resize triggers
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });

    const isMobile = window.innerWidth <= 768;

    /* ── Helper: batch reveal with stagger ──────────────────────────── */
    function batchReveal(selector, fromVars, stagger = 0.1) {
        const els = gsap.utils.toArray(selector);
        if (!els.length) return;
        ScrollTrigger.batch(els, {
            onEnter: batch => {
                gsap.from(batch, {
                    ...fromVars,
                    stagger,
                    ease: fromVars.ease || 'power3.out',
                    duration: fromVars.duration || 0.65,
                    clearProps: 'all'
                });
            },
            start: isMobile ? 'top 96%' : 'top 90%',
            once: true
        });
    }

    /* ══════════════════════════════════════════════════════════════════
       ABOUT FOUNDER
    ══════════════════════════════════════════════════════════════════ */
    const founderCard = document.querySelector('.founder-card-wrapper');
    const founderBio  = document.querySelector('.founder-bio-col');
    if (founderCard && founderBio) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about-advisor-section',
                start: isMobile ? 'top 92%' : 'top 80%',
                once: true
            }
        });
        tl.from(founderCard, { 
            opacity: 0, 
            x: isMobile ? 0 : -45, 
            y: isMobile ? 20 : 0, 
            duration: 0.75, 
            ease: 'power3.out', 
            clearProps: 'all' 
        })
        .from(founderBio, { 
            opacity: 0, 
            x: isMobile ? 0 : 45, 
            y: isMobile ? 20 : 0, 
            duration: 0.75, 
            ease: 'power3.out', 
            clearProps: 'all' 
        }, isMobile ? '-=0.5' : '-=0.6')
        .from('.f-stat-num', {
            opacity: 0, 
            y: 14, 
            stagger: 0.06, 
            duration: 0.45, 
            ease: 'back.out(1.7)', 
            clearProps: 'all'
        }, '-=0.25');
    }

    /* ══════════════════════════════════════════════════════════════════
       STATS BAND
    ══════════════════════════════════════════════════════════════════ */
    batchReveal('.stat-card', { opacity: 0, y: 30, scale: 0.94, duration: 0.6 }, 0.08);

    /* ══════════════════════════════════════════════════════════════════
       THREE PILLARS — Mobile: gentle vertical fade; Desktop: subtle stagger
    ══════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.pillar-card').forEach((card, idx) => {
        const xDir = isMobile ? 0 : (idx === 0 ? -45 : idx === 2 ? 45 : 0);
        const yDir = isMobile ? 20 : (idx === 1 ? 40 : 0);
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: isMobile ? 'top 95%' : 'top 88%', once: true },
            opacity: 0,
            x: xDir,
            y: yDir,
            scale: 0.96,
            duration: 0.7,
            delay: isMobile ? 0 : idx * 0.1,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       SERVICES GRID — Mobile: vertical only (NO X-offset to prevent offscreen shift)
    ══════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.service-card').forEach((card, idx) => {
        const xOffset = isMobile ? 0 : (idx % 3 === 0 ? -35 : idx % 3 === 2 ? 35 : 0);
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: isMobile ? 'top 95%' : 'top 90%', once: true },
            opacity: 0,
            x: xOffset,
            y: isMobile ? 18 : 28,
            duration: 0.6,
            delay: isMobile ? 0 : (idx % 3) * 0.08,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       NJ WEALTH BAND
    ══════════════════════════════════════════════════════════════════ */
    gsap.from('.nj-card-banner', {
        scrollTrigger: { trigger: '#nj-wealth', start: isMobile ? 'top 92%' : 'top 82%', once: true },
        opacity: 0,
        x: isMobile ? 0 : 45,
        y: isMobile ? 20 : 0,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'all'
    });
    batchReveal('.nj-chip-box', { opacity: 0, y: 15, scale: 0.92, duration: 0.45 }, 0.06);

    /* ══════════════════════════════════════════════════════════════════
       CTA BANNER
    ══════════════════════════════════════════════════════════════════ */
    gsap.from('.cta-banner-box', {
        scrollTrigger: { trigger: '.cta-banner-section', start: 'top 88%', once: true },
        opacity: 0,
        scale: 0.94,
        y: 24,
        duration: 0.7,
        ease: 'back.out(1.4)',
        clearProps: 'all'
    });

    /* ══════════════════════════════════════════════════════════════════
       CALCULATOR
    ══════════════════════════════════════════════════════════════════ */
    const calcLeft  = document.querySelector('.calc-desc-col');
    const calcRight = document.querySelector('.calc-widget-col');
    if (calcLeft && calcRight) {
        const calcTl = gsap.timeline({
            scrollTrigger: { trigger: '#calculator', start: isMobile ? 'top 90%' : 'top 80%', once: true }
        });
        calcTl.from(calcLeft,  { opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 20 : 0, duration: 0.75, ease: 'power3.out', clearProps: 'all' })
              .from(calcRight, { opacity: 0, x: isMobile ? 0 :  40, y: isMobile ? 20 : 0, duration: 0.75, ease: 'power3.out', clearProps: 'all' }, isMobile ? '-=0.4' : '-=0.5');
    }

    /* ══════════════════════════════════════════════════════════════════
       HOW IT WORKS
    ══════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.step-card').forEach((step, idx) => {
        gsap.from(step, {
            scrollTrigger: { trigger: '#how-it-works', start: isMobile ? 'top 92%' : 'top 82%', once: true },
            opacity: 0,
            y: 35,
            scale: 0.94,
            duration: 0.65,
            delay: isMobile ? 0 : idx * 0.12,
            ease: 'back.out(1.3)',
            clearProps: 'all'
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       WHY US
    ══════════════════════════════════════════════════════════════════ */
    gsap.from('.why-left-col', {
        scrollTrigger: { trigger: '#why-us', start: isMobile ? 'top 92%' : 'top 82%', once: true },
        opacity: 0,
        x: isMobile ? 0 : -45,
        y: isMobile ? 20 : 0,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'all'
    });
    batchReveal('.checklist-item', { opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 12 : 0, duration: 0.45 }, 0.07);

    gsap.utils.toArray('.benefit-card').forEach((bCard, idx) => {
        gsap.from(bCard, {
            scrollTrigger: { trigger: '#why-us', start: isMobile ? 'top 92%' : 'top 78%', once: true },
            opacity: 0,
            x: isMobile ? 0 : 40,
            y: 20,
            scale: 0.94,
            duration: 0.65,
            delay: isMobile ? 0 : idx * 0.1,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       TESTIMONIALS
    ══════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.test-card').forEach((tCard, idx) => {
        gsap.from(tCard, {
            scrollTrigger: { trigger: tCard, start: isMobile ? 'top 94%' : 'top 90%', once: true },
            opacity: 0,
            x: isMobile ? 0 : (idx % 2 === 0 ? -35 : 35),
            y: 20,
            rotation: isMobile ? 0 : (idx % 2 === 0 ? -1.5 : 1.5),
            duration: 0.65,
            delay: isMobile ? 0 : idx * 0.08,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       FAQ
    ══════════════════════════════════════════════════════════════════ */
    batchReveal('.faq-item', { opacity: 0, y: 25, scale: 0.98, duration: 0.5 }, 0.06);

    /* ══════════════════════════════════════════════════════════════════
       CONTACT
    ══════════════════════════════════════════════════════════════════ */
    const contactLeft  = document.querySelector('.contact-left-card');
    const contactRight = document.querySelector('.contact-form-wrapper');
    if (contactLeft && contactRight) {
        const cTl = gsap.timeline({
            scrollTrigger: { trigger: '#contact', start: isMobile ? 'top 92%' : 'top 82%', once: true }
        });
        cTl.from(contactLeft,  { opacity: 0, x: isMobile ? 0 : -45, y: isMobile ? 20 : 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' })
           .from(contactRight, { opacity: 0, x: isMobile ? 0 :  45, y: isMobile ? 20 : 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' }, isMobile ? '-=0.4' : '-=0.5');
    }

    /* ══════════════════════════════════════════════════════════════════
       SECTION HEADINGS
    ══════════════════════════════════════════════════════════════════ */
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: isMobile ? 'top 96%' : 'top 90%', once: true },
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });
    gsap.utils.toArray('.section-badge').forEach(badge => {
        gsap.from(badge, {
            scrollTrigger: { trigger: badge, start: isMobile ? 'top 96%' : 'top 92%', once: true },
            opacity: 0,
            y: 10,
            scale: 0.9,
            duration: 0.5,
            ease: 'back.out(1.8)',
            clearProps: 'all'
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       FLOATING AMBIENT ANIMATIONS — Desktop only to preserve mobile frames
    ══════════════════════════════════════════════════════════════════ */
    if (!isMobile) {
        gsap.utils.toArray('.stat-card').forEach((card, i) => {
            gsap.to(card, {
                y: -5,
                duration: 2.2 + i * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.25
            });
        });

        gsap.utils.toArray('.pillar-card').forEach((card, i) => {
            gsap.to(card, {
                y: -5,
                duration: 2.8 + i * 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.4
            });
        });

        gsap.utils.toArray('.step-num').forEach((num, i) => {
            gsap.to(num, {
                scale: 1.06,
                duration: 1.8 + i * 0.15,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.5
            });
        });
    }

    // Refresh ScrollTrigger after assets finish rendering
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    /* ══════════════════════════════════════════════════════════════════
       SCROLL PROGRESS INDICATOR — thin gold line at top
    ══════════════════════════════════════════════════════════════════ */
    const progressBar = document.getElementById('scrollProgressBar');
    if (progressBar) {
        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: self => {
                progressBar.style.width = (self.progress * 100) + '%';
            }
        });
    }
}

/* ==========================================================================
   10. Dynamic Typewriter Animation for Founder Role Tag
   ========================================================================== */
function initTypewriterAnimation() {
    const el = document.getElementById('founderTypewriter');
    if (!el) return;

    const phrases = [
        "Authorized Partner • NJ Wealth",
        "MM Financial Services Consultant",
        "Loans & Investment Specialist",
        "Direct Advisory • Mumbai & MMR"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 70;

    function tick() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            charIndex--;
            el.textContent = currentPhrase.substring(0, charIndex);
            typeSpeed = 35;
        } else {
            charIndex++;
            el.textContent = currentPhrase.substring(0, charIndex);
            typeSpeed = 70;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause after full phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before typing next phrase
        }

        setTimeout(tick, typeSpeed);
    }

    // Start typing
    setTimeout(tick, 500);
}

/* ==========================================================================
   11. Founder Bio Mobile Expand / Collapse Toggle
   ========================================================================== */
function initBioToggle() {
    const btn = document.getElementById('bioToggleBtn');
    const more = document.getElementById('founderBioMore');
    if (!btn || !more) return;

    btn.addEventListener('click', () => {
        const isOpen = more.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        btn.innerHTML = isOpen 
            ? '<span>Show Less</span> &uarr;' 
            : '<span>Read Full Background</span> &darr;';
    });
}

/* ==========================================================================
   12. Mobile Testimonials Horizontal Carousel (2s Auto-Slide & Manual Swipe)
   ========================================================================== */
function initTestimonialsCarousel() {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.test-card');
    const dots = document.querySelectorAll('.test-dot');
    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoTimer = null;
    let resumeTimeout = null;
    let isUserInteracting = false;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function updateActiveDot(index) {
        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function scrollToCard(index, smooth = true) {
        if (!isMobile() || !cards[index]) return;
        currentIndex = index;
        const targetLeft = cards[index].offsetLeft - (grid.clientWidth - cards[index].clientWidth) / 2;
        grid.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: smooth ? 'smooth' : 'auto'
        });
        updateActiveDot(index);
    }

    function nextSlide() {
        if (!isMobile() || isUserInteracting) return;
        const nextIndex = (currentIndex + 1) % cards.length;
        scrollToCard(nextIndex, true);
    }

    function startAutoSlide() {
        stopAutoSlide();
        if (!isMobile()) return;
        autoTimer = setInterval(nextSlide, 2000);
    }

    function stopAutoSlide() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    function pauseAndResume() {
        stopAutoSlide();
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isUserInteracting = false;
            startAutoSlide();
        }, 2000);
    }

    // Touch & pointer events for manual interaction
    grid.addEventListener('touchstart', () => {
        isUserInteracting = true;
        stopAutoSlide();
    }, { passive: true });

    grid.addEventListener('touchend', () => {
        pauseAndResume();
    }, { passive: true });

    grid.addEventListener('touchcancel', () => {
        pauseAndResume();
    }, { passive: true });

    // Sync active dot on manual scroll
    let scrollDebounce;
    grid.addEventListener('scroll', () => {
        if (!isMobile()) return;
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(() => {
            const scrollCenter = grid.scrollLeft + grid.clientWidth / 2;
            let closestIndex = 0;
            let minDiff = Infinity;
            cards.forEach((card, idx) => {
                const cardCenter = card.offsetLeft + card.clientWidth / 2;
                const diff = Math.abs(scrollCenter - cardCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = idx;
                }
            });
            currentIndex = closestIndex;
            updateActiveDot(closestIndex);
        }, 60);
    }, { passive: true });

    // Dot navigation clicks
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            isUserInteracting = true;
            scrollToCard(idx, true);
            pauseAndResume();
        });
    });

    // Handle viewport resize
    window.addEventListener('resize', () => {
        if (isMobile()) {
            if (!autoTimer) startAutoSlide();
        } else {
            stopAutoSlide();
        }
    });

    // Start auto-slide if on mobile
    if (isMobile()) {
        startAutoSlide();
    }
}

/* ==========================================================================
   13. Dedicated Enquiry Forms (Loans, Mutual Funds, Insurance) + Direct WhatsApp
   ========================================================================== */
function initDedicatedEnquiryForms() {
    initFormChips();
    initLoanForm();
    initMfForm();
    initInsuranceForm();
}

function initFormChips() {
    const chips = document.querySelectorAll('.form-chip-pill');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = chip.getAttribute('data-target');
            const val = chip.getAttribute('data-val');
            if (!targetId || !val) return;
            const targetInput = document.getElementById(targetId);
            if (targetInput) {
                targetInput.value = val;
                targetInput.focus();
                const parentField = targetInput.closest('.form-field');
                if (parentField) parentField.classList.remove('has-error');
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const group = chip.closest('.form-chips-group');
            if (group) {
                group.querySelectorAll('.form-chip-pill').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   LOAN ELIGIBILITY CONFIGURATION (CLIENT EDITABLE)
   ========================================================================== */
const LOAN_ELIGIBILITY_CONFIG = {
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
    cibilSlabs: {
        '800+': { label: '800+ (Super Prime / 7.60% Lowest Rate)', roiAdjustment: -0.90, foirAdjustment: 0.0, eligible: true },
        '775-799': { label: '775 - 799 (Prime Special / 7.75% Rate)', roiAdjustment: -0.75, foirAdjustment: 0.0, eligible: true },
        '750-774': { label: '750 - 774 (Excellent / 8.50% Base)', roiAdjustment: 0.0, foirAdjustment: 0.0, eligible: true },
        '750+': { label: '750+ (Excellent / Lowest ROI)', roiAdjustment: 0.0, foirAdjustment: 0.0, eligible: true },
        '700-749': { label: '700 - 749 (Good / Prime Banking)', roiAdjustment: 0.25, foirAdjustment: 0.0, eligible: true },
        '650-699': { label: '650 - 699 (Fair / Standard NBFC)', roiAdjustment: 0.75, foirAdjustment: -0.05, eligible: true },
        'Below 650': { label: 'Below 650 (Advisory / Co-Applicant Needed)', roiAdjustment: 1.50, foirAdjustment: -0.10, eligible: false, advisory: true },
        'New to Credit': { label: 'New to Credit (No History)', roiAdjustment: 0.50, foirAdjustment: -0.05, eligible: true }
    },
    salariedFoirSlabs: [
        { min: 0, max: 29999, foir: 0.45, minFoir: 0.45, maxFoir: 0.45, label: '45% FOIR (Salary up to ₹30k)' },
        { min: 30000, max: 45000, foir: 0.50, minFoir: 0.45, maxFoir: 0.50, label: '45% - 50% FOIR (Salary ₹30k - ₹45k)' },
        { min: 45001, max: 49999, foir: 0.55, minFoir: 0.50, maxFoir: 0.60, label: '55% FOIR (Salary ₹45k - ₹50k)' },
        { min: 50000, max: 100000, foir: 0.65, minFoir: 0.60, maxFoir: 0.65, label: '60% - 65% FOIR (Salary ₹50k - ₹1L)' },
        { min: 100001, max: Infinity, foir: 0.70, minFoir: 0.60, maxFoir: 0.70, label: '60% - 70% FOIR (Salary > ₹1L / Company Cat)' }
    ],
    companyCategories: {
        'super_a': { label: 'Super A (Top MNC / Fortune 500 / PSUs)', foir: 0.70 },
        'cat_a': { label: 'Category A (Listed Corporate / Top Indian Firm)', foir: 0.68 },
        'cat_b': { label: 'Category B (Mid Corporate / Reputed Pvt Ltd)', foir: 0.65 },
        'cat_c': { label: 'Category C / Others (Standard Pvt Ltd / LLP)', foir: 0.60 }
    },
    businessFoirSlabs: [
        { min: 0, max: 50000, foir: 0.50, label: '50% FOIR' },
        { min: 50001, max: 100000, foir: 0.60, label: '60% FOIR' },
        { min: 100001, max: Infinity, foir: 0.65, label: '65% FOIR' }
    ],
    salariedAddBacks: {
        annualBonusPercent: 0.50,
        rentalIncomePercent: 0.50
    },
    businessAddBacks: {
        depreciationFactor: 1.00,
        directorRemunerationFactor: 1.00,
        termLoanInterestFactor: 1.00,
        rentalIncomeFactor: 0.50
    },
    emiPerLakhLookup: {
        6: 17079, 12: 8722, 18: 5936, 24: 4546, 36: 3157, 48: 2465,
        60: 2052, 72: 1778, 84: 1584, 120: 1240, 180: 985, 240: 868,
        300: 805, 360: 769
    },
    limits: {
        minLoanAmount: 50000,
        maxLoanAmount: 500000000,
        minSalariedMonthlySalary: 10000,
        minBusinessAnnualProfit: 50000
    },
    statutoryCharges: {
        stampDutyRate: 0.003,            // 0.3% (0.3 per 100) Loan Stamp Duty Fix Govt.
        noticeOfIntimationGovt: 15000,   // Notice of Intimation Govt up to 30 Lacs
        noticeVendorMin: 1800,           // Vendor fees 1,800 - 3,000 as per bank
        noticeVendorMax: 3000,
        notaryFrankingMin: 3500,         // Notary & Franking with Document Charges 3,500 - 10,000 as per bank
        notaryFrankingMax: 10000
    }
};

function formatIndianNumber(num) {
    if (!num || isNaN(num)) return '0';
    const val = Math.round(num);
    const s = val.toString();
    if (s.length <= 3) return s;
    let lastThree = s.substring(s.length - 3);
    let otherNumbers = s.substring(0, s.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

function parseTenureToMonthsLocal(tenureStr) {
    if (!tenureStr) return 240;
    const s = String(tenureStr).trim().toLowerCase();
    const numMatch = s.match(/\d+/);
    if (!numMatch) return 240;
    const val = parseInt(numMatch[0], 10);
    return (s.includes('year') || s.includes('yr')) ? val * 12 : val;
}

function calculateEmiPerLakhLocal(tenureMonths, annualRoi) {
    const P = 100000;
    const r = (annualRoi / 12) / 100;
    const n = Math.max(1, tenureMonths);
    if (r <= 0) return Math.round(P / n);
    const pow = Math.pow(1 + r, n);
    return Math.round((P * r * pow) / (pow - 1));
}

function computeLocalEligibility(params) {
    const empType = String(params.empType || '').trim();
    const loanType = String(params.loanType || 'Home Loan').trim();
    const reqAmount = Math.max(0, parseFloat(params.loanAmount) || 0);
    const existingEmi = Math.max(0, parseFloat(params.loanExistingEmi) || 0);
    const tenureMonths = parseTenureToMonthsLocal(params.loanTenure);
    const cibil = String(params.cibilScore || params.cibil || '750+').trim();
    
    const customRoi = parseFloat(params.customRoi || params.loanRoi);
    const categoryRoi = LOAN_ELIGIBILITY_CONFIG.roiByCategory[loanType] || LOAN_ELIGIBILITY_CONFIG.defaultRoi;
    const cibilInfo = LOAN_ELIGIBILITY_CONFIG.cibilSlabs[cibil] || LOAN_ELIGIBILITY_CONFIG.cibilSlabs['750+'];
    const roi = (!isNaN(customRoi) && customRoi >= 5.0 && customRoi <= 30.0) 
        ? customRoi 
        : parseFloat((categoryRoi + (cibilInfo.roiAdjustment || 0)).toFixed(2));
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

        const slab = LOAN_ELIGIBILITY_CONFIG.salariedFoirSlabs.find(
            s => grossMonthlyIncome >= s.min && grossMonthlyIncome <= s.max
        ) || LOAN_ELIGIBILITY_CONFIG.salariedFoirSlabs[LOAN_ELIGIBILITY_CONFIG.salariedFoirSlabs.length - 1];

        // Check if custom / manual company category FOIR is passed
        const customFoir = parseFloat(params.customFoir || params.salariedFoir);
        const compCat = String(params.companyCategory || params.employerCategory || '').toLowerCase();

        if (!isNaN(customFoir) && customFoir >= 0.40 && customFoir <= 0.75) {
            appliedFoir = customFoir;
            foirLabel = `${Math.round(appliedFoir * 100)}% FOIR (Custom Benchmarked)`;
        } else if (grossMonthlyIncome > 100000 && compCat && LOAN_ELIGIBILITY_CONFIG.companyCategories[compCat]) {
            appliedFoir = LOAN_ELIGIBILITY_CONFIG.companyCategories[compCat].foir;
            foirLabel = `${Math.round(appliedFoir * 100)}% FOIR (${LOAN_ELIGIBILITY_CONFIG.companyCategories[compCat].label})`;
        } else {
            appliedFoir = slab.foir;
            foirLabel = slab.label;
        }
    } else {
        const isTurnoverProg = (params.businessProgram === 'turnover');
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
        
        if (isTurnoverProg) {
            // Business Turnover program uses 85% FOIR benchmarking
            appliedFoir = 0.85;
            foirLabel = '85% FOIR (Turnover Cash Flow Norm)';
        } else {
            const slab = LOAN_ELIGIBILITY_CONFIG.businessFoirSlabs.find(
                s => grossMonthlyIncome >= s.min && grossMonthlyIncome <= s.max
            ) || LOAN_ELIGIBILITY_CONFIG.businessFoirSlabs[LOAN_ELIGIBILITY_CONFIG.businessFoirSlabs.length - 1];
            appliedFoir = slab.foir;
            foirLabel = slab.label;
        }
    }

    const maxAllowableEmi = Math.round(grossMonthlyIncome * appliedFoir);
    const eligibleEmiCapacity = Math.max(0, maxAllowableEmi - existingEmi);
    const emiPerLakh = calculateEmiPerLakhLocal(tenureMonths, roi);

    let maxEligibleLoan = 0;
    if (emiPerLakh > 0 && eligibleEmiCapacity > 0) {
        maxEligibleLoan = Math.round((eligibleEmiCapacity / emiPerLakh) * 100000);
    }

    const estimatedReqEmi = Math.round((reqAmount / 100000) * emiPerLakh);
    const isEligible = (maxEligibleLoan >= reqAmount) && (eligibleEmiCapacity > 0) && (grossMonthlyIncome > 0);

    // Statutory Charges as per Loan Amount
    const stampDuty = Math.round(reqAmount * LOAN_ELIGIBILITY_CONFIG.statutoryCharges.stampDutyRate);
    const noticeGovt = (reqAmount <= 3000000 && reqAmount > 0) ? LOAN_ELIGIBILITY_CONFIG.statutoryCharges.noticeOfIntimationGovt : 15000;
    const noticeVendor = '₹1,800 - ₹3,000';
    const notaryFranking = '₹3,500 - ₹10,000 (With Document Charges)';

    const tips = [];
    if (!isEligible) {
        if (maxEligibleLoan > 0) {
            tips.push(`Borrowing Capacity: Based on your current income and FOIR, you qualify for up to ₹${formatIndianNumber(maxEligibleLoan)}.`);
        }
        if (existingEmi > 0) {
            const potentialGain = Math.round((existingEmi / emiPerLakh) * 100000);
            tips.push(`Clear Existing EMIs: Paying off existing loans of ₹${formatIndianNumber(existingEmi)}/mo can increase your eligibility by approx ₹${formatIndianNumber(potentialGain)}.`);
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
        eligibleEmiCapacity,
        maxEligibleLoan,
        reqAmount,
        tenureMonths,
        roi,
        cibilScore: cibil,
        emiPerLakh,
        estimatedReqEmi,
        charges: {
            stampDuty,
            noticeGovt,
            noticeVendor,
            notaryFranking
        },
        tips
    };
}

/* ==========================================================================
   13. Two-Step Verified Loan Eligibility & Lead Generation Flow
   ========================================================================== */
function initLoanForm() {
    const step1Form = document.getElementById('loanEligibilityForm');
    const resultContainer = document.getElementById('eligibilityResultContainer');
    const leadMountPoint = document.getElementById('leadFormMountPoint');
    if (!step1Form) return;

    const empType = document.getElementById('loanEmpType');
    const loanType = document.getElementById('loanType');
    const amount = document.getElementById('loanAmount');
    const income = document.getElementById('loanIncome');
    const incomeLabel = document.getElementById('loanIncomeLabel');
    const incomeHint = document.getElementById('loanIncomeHint');
    const emi = document.getElementById('loanExistingEmi');
    const tenure = document.getElementById('loanTenure');
    const cibilSelect = document.getElementById('loanCibil');
    const cibilChips = step1Form.querySelectorAll('.form-chip-pill[data-target="loanCibil"]');
    const loanRoiInput = document.getElementById('loanRoi');
    const loanRoiBadge = document.getElementById('loanRoiBadge');
    const tenureFilterBtns = step1Form.querySelectorAll('.tenure-filter-btn');
    const optMonths = document.getElementById('optgroupMonths');
    const optYears = document.getElementById('optgroupYears');
    const tenureChips = step1Form.querySelectorAll('.form-chip-pill[data-target="loanTenure"]');
    const formStartTimeInput = document.getElementById('loanFormStartTime');
    const btnCheck = document.getElementById('btnCheckEligibility');
    const btnCheckText = document.getElementById('btnCheckEligibilityText');
    const badgeStep1 = document.getElementById('badgeStep1');
    const badgeStep2 = document.getElementById('badgeStep2');

    // Accordion elements
    const toggleAddIncomeBtn = document.getElementById('toggleAddIncomeBtn');
    const addIncomePanel = document.getElementById('addIncomePanel');
    const salariedAddFields = document.getElementById('salariedAddFields');
    const businessAddFields = document.getElementById('businessAddFields');
    const loanBonus = document.getElementById('loanBonus');
    const loanRentIncome = document.getElementById('loanRentIncome');
    const loanDepreciation = document.getElementById('loanDepreciation');
    const loanDirectorSalary = document.getElementById('loanDirectorSalary');

    // Track when user starts interacting for bot timing checks
    let userStartTime = Date.now();
    if (formStartTimeInput) formStartTimeInput.value = userStartTime;

    // Toggle additional income accordion
    if (toggleAddIncomeBtn && addIncomePanel) {
        toggleAddIncomeBtn.addEventListener('click', () => {
            const isExpanded = toggleAddIncomeBtn.getAttribute('aria-expanded') === 'true';
            toggleAddIncomeBtn.setAttribute('aria-expanded', !isExpanded);
            addIncomePanel.style.display = isExpanded ? 'none' : 'block';
            const icon = toggleAddIncomeBtn.querySelector('.toggle-icon');
            if (icon) icon.textContent = isExpanded ? '+' : '−';
        });
    }

    const bizProgramRow = document.getElementById('businessProgramRow');
    const bizProgramSelect = document.getElementById('loanBusinessProgram');
    const bizTurnoverRow = document.getElementById('businessTurnoverRow');
    const loanTurnoverAmount = document.getElementById('loanTurnoverAmount');
    const loanTurnoverMultiplier = document.getElementById('loanTurnoverMultiplier');
    const loanTurnoverMultiplierBadge = document.getElementById('loanTurnoverMultiplierBadge');
    const loanIncomeField = document.getElementById('loanIncomeField');

    // Dynamic Income Label & Turnover Program switching based on Employment Profile
    function updateIncomeLabel() {
        if (!empType) return;
        const empVal = empType.value.toLowerCase();
        const isSalaried = empVal.includes('salaried');
        const isDoctor = empVal.includes('doctor') || empVal.includes('professional');

        // Always show the assessment program selector so ANY profile (Salaried or Business) can choose
        if (bizProgramRow) bizProgramRow.style.display = 'flex';

        // Auto-select Doctor MBBS Gross Receipts if Doctor / Professional selected
        if (isDoctor && loanTurnoverMultiplier) {
            for (let i = 0; i < loanTurnoverMultiplier.options.length; i++) {
                if (loanTurnoverMultiplier.options[i].text.includes('Doctor MBBS')) {
                    loanTurnoverMultiplier.selectedIndex = i;
                    break;
                }
            }
            if (bizProgramSelect && bizProgramSelect.value !== 'turnover') {
                bizProgramSelect.value = 'turnover';
            }
            syncBenchmarkLimits();
        }

        if (isSalaried) {
            if (salariedAddFields) salariedAddFields.style.display = 'flex';
            if (businessAddFields) businessAddFields.style.display = 'none';
        } else {
            if (salariedAddFields) salariedAddFields.style.display = 'none';
            if (businessAddFields) businessAddFields.style.display = 'flex';
        }

        updateTurnoverView();
    }

    function updateTurnoverView() {
        const isTurnover = bizProgramSelect && bizProgramSelect.value === 'turnover';
        if (bizTurnoverRow) bizTurnoverRow.style.display = isTurnover ? 'block' : 'none';
        if (loanIncomeField) loanIncomeField.style.display = isTurnover ? 'none' : 'block';

        const empVal = (empType ? empType.value : '').toLowerCase();
        const isSalaried = empVal.includes('salaried');

        if (income) {
            income.required = !isTurnover;
            if (isSalaried) {
                if (incomeLabel) incomeLabel.innerHTML = 'Monthly Net Salary <span class="req">*</span>';
                if (income) income.placeholder = 'e.g. ₹85,000 / month';
                if (incomeHint) incomeHint.textContent = 'Net monthly take-home salary credited to bank account';
            } else {
                if (incomeLabel) incomeLabel.innerHTML = 'Annual Net Profit as per ITR <span class="req">*</span>';
                if (income) income.placeholder = 'e.g. ₹15,00,000 profit / year';
                if (incomeHint) incomeHint.textContent = 'Net business income / profit as per latest ITR computation sheet';
            }
        }

        // Toggle Company Category Row for Salaried earning > ₹1 Lakh
        updateSalariedCompanyCategoryView();

        // Update Turnover / Gross Receipts labels dynamically
        if (isTurnover) {
            const multOpt = loanTurnoverMultiplier ? loanTurnoverMultiplier.options[loanTurnoverMultiplier.selectedIndex] : null;
            const optText = multOpt ? multOpt.text : '';
            const isGrossReceipt = optText.includes('Gross Receipts') || optText.includes('Doctor') || optText.includes('CA') || optText.includes('CS');
            
            const amtLabel = document.getElementById('loanTurnoverAmountLabel');
            const amtLabelYear2 = document.getElementById('loanTurnoverAmountYear2Label');
            const avgLabel = document.getElementById('loanAvgTurnoverLabel');
            const amtHint = document.getElementById('loanTurnoverAmountHint');

            if (amtLabel) {
                amtLabel.innerHTML = isGrossReceipt 
                    ? 'Current Financial Year Gross Receipts / Fees (₹) <span class="req">*</span>' 
                    : 'Current Financial Year Gross Turnover (₹) <span class="req">*</span>';
            }
            if (amtLabelYear2) {
                amtLabelYear2.innerHTML = isGrossReceipt 
                    ? 'Previous Financial Year Gross Receipts / Fees (₹) <span class="req">*</span>' 
                    : 'Previous Financial Year Gross Turnover (₹) <span class="req">*</span>';
            }
            if (avgLabel) {
                avgLabel.textContent = isGrossReceipt
                    ? '2-Year Average Gross Receipts / Fees:'
                    : '2-Year Average Turnover / Receipts:';
            }
            if (amtHint) {
                amtHint.textContent = isGrossReceipt
                    ? 'Gross professional receipts/fees credited as per Form 26AS / Bank Statements'
                    : 'Annual business turnover as per GST returns / Audited P&L';
            }
        }
        updateLoansTurnoverAvg();
    }

    const salariedCompanyCatRow = document.getElementById('salariedCompanyCatRow');
    const loanSalariedCustomFoir = document.getElementById('loanSalariedCustomFoir');
    const loanSalariedFoirBadge = document.getElementById('loanSalariedFoirBadge');
    let loanSalariedFoirManual = false;

    function updateSalariedCompanyCategoryView() {
        const isTurnover = bizProgramSelect && bizProgramSelect.value === 'turnover';
        const empVal = (empType ? empType.value : '').toLowerCase();
        const isSalaried = empVal.includes('salaried');
        const numIncome = parseFloat(String(income ? income.value : '').replace(/[^0-9.]/g, '')) || 0;

        // Show manual Net Salary FOIR fit option for Salaried users
        if (isSalaried && !isTurnover) {
            if (salariedCompanyCatRow) salariedCompanyCatRow.style.display = 'grid';

            // Auto-select 50% - 70% FOIR on salary typing if user hasn't typed manually
            if (!loanSalariedFoirManual && numIncome > 0) {
                let autoF = 65;
                if (numIncome >= 100000) autoF = 70;
                else if (numIncome >= 50000) autoF = 65;
                else if (numIncome >= 30000) autoF = 50;
                else autoF = 45;

                if (loanSalariedCustomFoir) loanSalariedCustomFoir.value = autoF;
                if (loanSalariedFoirBadge) loanSalariedFoirBadge.textContent = `${autoF}% FOIR`;
            }
        } else {
            if (salariedCompanyCatRow) salariedCompanyCatRow.style.display = 'none';
        }
    }

    if (loanSalariedCustomFoir) {
        loanSalariedCustomFoir.addEventListener('input', () => {
            loanSalariedFoirManual = true;
            let v = parseFloat(loanSalariedCustomFoir.value);
            if (!isNaN(v) && loanSalariedFoirBadge) {
                if (v > 70) v = 70;
                loanSalariedFoirBadge.textContent = `${v}% FOIR`;
            }
        });
        loanSalariedCustomFoir.addEventListener('blur', () => {
            let v = parseFloat(loanSalariedCustomFoir.value);
            if (isNaN(v) || v < 45) v = 45;
            if (v > 70) v = 70;
            loanSalariedCustomFoir.value = v;
            if (loanSalariedFoirBadge) loanSalariedFoirBadge.textContent = `${v}% FOIR`;
        });
    }

    if (income) {
        income.addEventListener('input', () => {
            updateSalariedCompanyCategoryView();
        });
    }

    const loanTurnoverPctInput = document.getElementById('loanTurnoverPctInput');
    const loanTurnoverBracketTag = document.getElementById('loanTurnoverBracketTag');
    const loanTurnoverPctHint = document.getElementById('loanTurnoverPctHint');
    const loanTurnoverPctLabel = document.getElementById('loanTurnoverPctLabel');
    const loanTurnoverUnitSymbol = document.getElementById('loanTurnoverUnitSymbol');
    const loanMonthlyIncomeDisplay = document.getElementById('loanMonthlyIncomeDisplay');

    function syncBenchmarkLimits() {
        if (!loanTurnoverMultiplier) return;
        const opt = loanTurnoverMultiplier.options[loanTurnoverMultiplier.selectedIndex];
        const minVal = parseFloat(opt.dataset.min) || 1.0;
        const maxVal = parseFloat(opt.dataset.max) || 20.0;
        const defVal = parseFloat(opt.dataset.def) || (minVal === maxVal ? minVal : (minVal + maxVal) / 2);
        const isMultiplier = opt.dataset.isMultiplier === 'true' || opt.text.includes('Gross Receipts');

        if (loanTurnoverPctLabel) {
            loanTurnoverPctLabel.innerHTML = isMultiplier 
                ? 'Gross Receipts Multiplier (Times) <span class="req">*</span>' 
                : 'Manual Net Margin % (Editable) <span class="req">*</span>';
        }
        if (loanTurnoverUnitSymbol) {
            loanTurnoverUnitSymbol.textContent = isMultiplier ? 'x' : '%';
        }

        if (loanTurnoverBracketTag) {
            if (isMultiplier) {
                loanTurnoverBracketTag.textContent = minVal === maxVal ? `${minVal}x Multiplier` : `${minVal}x - ${maxVal}x Multiplier`;
            } else {
                loanTurnoverBracketTag.textContent = minVal === maxVal 
                    ? `${minVal.toFixed(1)}% Fixed` 
                    : `Min ${minVal.toFixed(1)}% - Max ${maxVal.toFixed(1)}%`;
            }
        }
        if (loanTurnoverPctHint) {
            loanTurnoverPctHint.textContent = isMultiplier
                ? `Standard bank benchmark: ${defVal} times of annual gross receipts`
                : (minVal === maxVal
                    ? `Standard bank benchmark: ${minVal.toFixed(1)}% of gross revenue`
                    : `Allowed range: ${minVal.toFixed(1)}% to ${maxVal.toFixed(1)}% (Bank benchmark)`);
        }
        if (loanTurnoverPctInput) {
            loanTurnoverPctInput.value = isMultiplier ? defVal.toString() : defVal.toFixed(1);
        }
        if (loanTurnoverMultiplierBadge) {
            loanTurnoverMultiplierBadge.textContent = isMultiplier ? `${defVal}x` : defVal.toFixed(1) + '%';
        }
        updateLoansTurnoverAvg();
    }

    function getAndValidatePct() {
        const opt = loanTurnoverMultiplier ? loanTurnoverMultiplier.options[loanTurnoverMultiplier.selectedIndex] : null;
        const minVal = opt ? (parseFloat(opt.dataset.min) || 1.0) : 1.0;
        const maxVal = opt ? (parseFloat(opt.dataset.max) || 20.0) : 20.0;
        const isMultiplier = opt && (opt.dataset.isMultiplier === 'true' || opt.text.includes('Gross Receipts'));
        
        let rawVal = parseFloat(String(loanTurnoverPctInput ? loanTurnoverPctInput.value : '').replace(/[^0-9.]/g, ''));
        if (isNaN(rawVal)) rawVal = minVal;
        
        // Clamp maximum immediately if user exceeds limit
        if (rawVal > maxVal) {
            rawVal = maxVal;
            if (loanTurnoverPctInput) loanTurnoverPctInput.value = isMultiplier ? maxVal.toString() : maxVal.toFixed(1);
        }
        
        if (loanTurnoverMultiplierBadge) {
            loanTurnoverMultiplierBadge.textContent = isMultiplier ? `${rawVal}x` : rawVal.toFixed(1) + '%';
        }
        return { val: rawVal, isMultiplier, foir: (opt && opt.dataset.foir ? parseFloat(opt.dataset.foir) : null) };
    }

    if (loanTurnoverMultiplier) {
        loanTurnoverMultiplier.addEventListener('change', () => {
            syncBenchmarkLimits();
            updateTurnoverView();
        });
    }

    if (loanTurnoverPctInput) {
        loanTurnoverPctInput.addEventListener('input', () => {
            getAndValidatePct();
            updateLoansTurnoverAvg();
        });
        loanTurnoverPctInput.addEventListener('blur', () => {
            const opt = loanTurnoverMultiplier ? loanTurnoverMultiplier.options[loanTurnoverMultiplier.selectedIndex] : null;
            const minVal = opt ? (parseFloat(opt.dataset.min) || 1.0) : 1.0;
            const maxVal = opt ? (parseFloat(opt.dataset.max) || 20.0) : 20.0;
            const isMultiplier = opt && (opt.dataset.isMultiplier === 'true' || opt.text.includes('Gross Receipts'));
            let v = parseFloat(loanTurnoverPctInput.value);
            if (isNaN(v) || v < minVal) v = minVal;
            if (v > maxVal) v = maxVal;
            loanTurnoverPctInput.value = isMultiplier ? v.toString() : v.toFixed(1);
            updateLoansTurnoverAvg();
        });
    }

    if (bizProgramSelect) {
        bizProgramSelect.addEventListener('change', updateTurnoverView);
    }

    if (empType) {
        empType.addEventListener('change', updateIncomeLabel);
    }

    // Format amount into clean Lakhs & Crores badge (e.g. ₹50 Lakh, ₹2.50 Cr)
    function badgeWordINR(val) {
        if (!isFinite(val) || val <= 0) return '₹0';
        if (val >= 1e7) {
            const cr = val / 1e7;
            return '₹' + cr.toFixed(2).replace(/\.?0+$/, '') + ' Cr';
        }
        if (val >= 1e5) {
            const lk = val / 1e5;
            return '₹' + lk.toFixed(2).replace(/\.?0+$/, '') + ' Lakh';
        }
        if (val >= 1e3) {
            const th = val / 1e3;
            return '₹' + th.toFixed(1).replace(/\.?0+$/, '') + ' K';
        }
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    // Live Indian Currency Formatting on Input & Dynamic Red Badge Display
    function formatCurrencyInput(input, badgeId) {
        if (!input) return;
        const updateBadge = () => {
            if (badgeId) {
                const badge = document.getElementById(badgeId);
                if (badge) {
                    const clean = input.value.replace(/[^0-9]/g, '');
                    const val = clean ? parseInt(clean, 10) : 0;
                    badge.textContent = badgeWordINR(val);
                }
            }
        };
        input.addEventListener('input', () => {
            const cleanVal = input.value.replace(/[^0-9]/g, '');
            if (cleanVal) {
                const formatted = '₹' + formatIndianNumber(parseInt(cleanVal, 10));
                input.value = formatted;
            }
            updateBadge();
        });
        input.addEventListener('change', updateBadge);
        updateBadge();
    }

    const loanTurnoverAmountYear2 = document.getElementById('loanTurnoverAmountYear2');
    const loanAvgTurnoverDisplay = document.getElementById('loanAvgTurnoverDisplay');
    const loanTurnoverFormulaHint = document.getElementById('loanTurnoverFormulaHint');
    const loanObligationDisplay = document.getElementById('loanObligationDisplay');
    const loanNetCapacityDisplay = document.getElementById('loanNetCapacityDisplay');
    const loanEmiPerLakhDisplay = document.getElementById('loanEmiPerLakhDisplay');
    const loanMaxEligibilityDisplay = document.getElementById('loanMaxEligibilityDisplay');

    function updateLoansTurnoverAvg() {
        const t1 = parseFloat(String(loanTurnoverAmount ? loanTurnoverAmount.value : '').replace(/[^0-9.]/g, '')) || 0;
        const t2 = parseFloat(String(loanTurnoverAmountYear2 ? loanTurnoverAmountYear2.value : '').replace(/[^0-9.]/g, '')) || 0;
        let avg = 0;
        if (t1 > 0 && t2 > 0) avg = Math.round((t1 + t2) / 2);
        else avg = t1 || t2;

        const info = getAndValidatePct();
        let annualDerived = 0;
        let monthlyIncome = 0;
        let appliedFoir = 0.85; // Standard 85% FOIR for business turnover program as specified

        if (info.isMultiplier) {
            // Doctor / Professional Program:
            // Multiplier on Gross Receipts (e.g. 50L * 3 = 1.5 Cr annual cash flow)
            // Monthly Income = Annual / 12
            annualDerived = Math.round(avg * info.val);
            monthlyIncome = Math.round(annualDerived / 12);
        } else {
            // Turnover Percentage Program (MFG / Services / Trader):
            // 1 Cr * 15% = 15,00,000 Annual Profit
            // 15,00,000 * 85% FOIR = 12,75,000
            // Per month income capacity = 12,75,000 / 12 = 1,06,250
            annualDerived = Math.round(avg * (info.val / 100));
            const annualFoirCapacity = Math.round(annualDerived * appliedFoir);
            monthlyIncome = Math.round(annualFoirCapacity / 12);
        }

        // Net Capacity = Monthly Income - Existing Obligations
        const obligation = parseFloat(String(emi ? emi.value : '').replace(/[^0-9.]/g, '')) || 0;
        const netCapacity = Math.max(0, monthlyIncome - obligation);

        const currentRoi = parseFloat(loanRoiInput ? loanRoiInput.value : 8.5) || 8.5;
        const currentTenureMonths = parseTenureToMonthsLocal(tenure ? tenure.value : '20 Years');
        const emiPerLakh = calculateEmiPerLakhLocal(currentTenureMonths, currentRoi);

        let maxLoanEligible = 0;
        if (emiPerLakh > 0 && netCapacity > 0) {
            maxLoanEligible = Math.round((netCapacity / emiPerLakh) * 100000);
        }

        if (loanAvgTurnoverDisplay) {
            loanAvgTurnoverDisplay.textContent = '₹' + formatIndianNumber(avg);
        }
        if (loanMonthlyIncomeDisplay) {
            loanMonthlyIncomeDisplay.textContent = '₹' + formatIndianNumber(monthlyIncome) + ' / month';
        }
        if (loanObligationDisplay) {
            loanObligationDisplay.textContent = obligation > 0 ? '- ₹' + formatIndianNumber(obligation) : '₹0';
        }
        if (loanNetCapacityDisplay) {
            loanNetCapacityDisplay.textContent = '₹' + formatIndianNumber(netCapacity) + ' / mo';
        }
        if (loanEmiPerLakhDisplay) {
            loanEmiPerLakhDisplay.textContent = '₹' + formatIndianNumber(emiPerLakh) + ' / Lakh';
        }
        if (loanMaxEligibilityDisplay) {
            loanMaxEligibilityDisplay.textContent = '₹' + formatIndianNumber(maxLoanEligible);
        }

        if (loanTurnoverFormulaHint) {
            loanTurnoverFormulaHint.textContent = '';
        }
        return { avg, monthlyDerived: monthlyIncome, annualDerived, obligation, netCapacity, emiPerLakh, maxLoanEligible };
    }

    if (loanTurnoverAmount) loanTurnoverAmount.addEventListener('input', updateLoansTurnoverAvg);
    if (loanTurnoverAmountYear2) loanTurnoverAmountYear2.addEventListener('input', updateLoansTurnoverAvg);
    if (emi) emi.addEventListener('input', updateLoansTurnoverAvg);
    if (loanRoiInput) loanRoiInput.addEventListener('input', updateLoansTurnoverAvg);
    if (tenure) tenure.addEventListener('change', updateLoansTurnoverAvg);

    const fieldBadgeMap = [
        { el: amount, badgeId: 'loanAmountBadge' },
        { el: income, badgeId: 'loanIncomeBadge' },
        { el: emi, badgeId: 'loanExistingEmiBadge' },
        { el: loanBonus, badgeId: 'loanBonusBadge' },
        { el: loanRentIncome, badgeId: 'loanRentIncomeBadge' },
        { el: loanDepreciation, badgeId: 'loanDepreciationBadge' },
        { el: loanDirectorSalary, badgeId: 'loanDirectorSalaryBadge' },
        { el: loanTurnoverAmount, badgeId: 'loanTurnoverAmountBadge' },
        { el: loanTurnoverAmountYear2, badgeId: 'loanTurnoverAmountYear2Badge' }
    ];

    fieldBadgeMap.forEach(item => {
        if (item.el) {
            formatCurrencyInput(item.el, item.badgeId);
        }
    });

    // Tenure chip and optgroup sync
    function syncTenureChips(selectedVal) {
        tenureChips.forEach(chip => {
            const chipVal = chip.getAttribute('data-val');
            chip.classList.toggle('active', chipVal === selectedVal);
        });
    }

    if (tenure) {
        const handleTenureChange = () => {
            syncTenureChips(tenure.value);
            if (tenure.value.includes('Month') && optMonths && optMonths.hidden) {
                optMonths.hidden = false;
                tenureFilterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
            } else if (tenure.value.includes('Year') && optYears && optYears.hidden) {
                optYears.hidden = false;
                tenureFilterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
            }
        };
        tenure.addEventListener('change', handleTenureChange);
        tenure.addEventListener('input', handleTenureChange);
    }

    tenureFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = btn.getAttribute('data-filter');
            tenureFilterBtns.forEach(b => b.classList.toggle('active', b === btn));
            if (!optMonths || !optYears || !tenure) return;

            if (filter === 'months') {
                optMonths.hidden = false;
                optYears.hidden = true;
                if (tenure.value.includes('Year')) {
                    tenure.value = '24 Months';
                    syncTenureChips('24 Months');
                }
            } else if (filter === 'years') {
                optMonths.hidden = true;
                optYears.hidden = false;
                if (tenure.value.includes('Month')) {
                    tenure.value = '20 Years';
                    syncTenureChips('20 Years');
                }
            } else {
                optMonths.hidden = false;
                optYears.hidden = false;
            }
        });
    });

    // CIBIL and ROI Dynamic Sync
    function updateBenchmarkRoi() {
        if (!loanRoiInput) return;
        const selType = loanType ? loanType.value : 'Home Loan';
        const selCibil = cibilSelect ? cibilSelect.value : '750-900';
        
        // For CIBIL 750-900, allow user to set their custom manual ROI or use benchmark
        if (selCibil === '750-900' || selCibil === '800+' || selCibil === '775-799' || selCibil === '750-774') {
            const currentVal = parseFloat(loanRoiInput.value);
            if (currentVal > 0) {
                if (loanRoiBadge) loanRoiBadge.textContent = `${currentVal.toFixed(2)}%`;
                return;
            }
        }
        
        const catRoi = LOAN_ELIGIBILITY_CONFIG.roiByCategory[selType] || LOAN_ELIGIBILITY_CONFIG.defaultRoi;
        const cibilObj = LOAN_ELIGIBILITY_CONFIG.cibilSlabs[selCibil] || LOAN_ELIGIBILITY_CONFIG.cibilSlabs['750+'];
        const suggestedRoi = (catRoi + (cibilObj ? (cibilObj.roiAdjustment || 0) : 0)).toFixed(2);
        
        loanRoiInput.value = suggestedRoi;
        if (loanRoiBadge) loanRoiBadge.textContent = `${suggestedRoi}%`;
    }

    if (loanType) {
        loanType.addEventListener('change', updateBenchmarkRoi);
    }

    if (cibilSelect) {
        cibilSelect.addEventListener('change', () => {
            cibilChips.forEach(chip => {
                chip.classList.toggle('active', chip.getAttribute('data-val') === cibilSelect.value);
            });
            updateBenchmarkRoi();
        });
    }

    cibilChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const val = chip.getAttribute('data-val');
            if (cibilSelect) {
                cibilSelect.value = val;
                cibilChips.forEach(c => c.classList.toggle('active', c === chip));
                updateBenchmarkRoi();
            }
        });
    });

    if (loanRoiInput) {
        loanRoiInput.addEventListener('input', () => {
            const val = parseFloat(loanRoiInput.value);
            if (!isNaN(val) && loanRoiBadge) {
                loanRoiBadge.textContent = `${val.toFixed(2)}%`;
            }
        });
    }

    function validateField(input, condition, errorMsgId) {
        const field = input ? input.closest('.form-field') : null;
        if (!condition) {
            if (field) field.classList.add('has-error');
            return false;
        }
        if (field) field.classList.remove('has-error');
        return true;
    }

    // Step 1: Submit Eligibility Check
    step1Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        step1Form.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-error'));

        let isValid = true;
        if (!validateField(empType, empType && empType.value.trim() !== '')) isValid = false;
        if (!validateField(loanType, loanType && loanType.value.trim() !== '')) isValid = false;

        const numAmount = parseFloat(String(amount ? amount.value : '').replace(/[^0-9.]/g, '')) || 0;
        if (!validateField(amount, numAmount >= LOAN_ELIGIBILITY_CONFIG.limits.minLoanAmount)) isValid = false;

        const isSalaried = empType && empType.value.toLowerCase().includes('salaried');
        const isTurnover = bizProgramSelect && bizProgramSelect.value === 'turnover';

        let effectiveIncome = 0;
        if (isTurnover) {
            const rawT1 = parseFloat(String(loanTurnoverAmount ? loanTurnoverAmount.value : '').replace(/[^0-9.]/g, '')) || 0;
            const rawT2 = parseFloat(String(loanTurnoverAmountYear2 ? loanTurnoverAmountYear2.value : '').replace(/[^0-9.]/g, '')) || 0;
            const avgTurnover = (rawT1 > 0 && rawT2 > 0) ? Math.round((rawT1 + rawT2) / 2) : (rawT1 || rawT2);
            const info = getAndValidatePct();

            if (!validateField(loanTurnoverAmount, rawT1 >= 500000 || avgTurnover >= 500000)) isValid = false;
            if (info.isMultiplier) {
                // Doctor / Professional: 3x Gross Receipts
                effectiveIncome = avgTurnover * info.val;
            } else {
                // MFG / Services / Trader: Turnover * Margin %
                effectiveIncome = avgTurnover * (info.val / 100);
            }
        } else {
            const numIncome = parseFloat(String(income ? income.value : '').replace(/[^0-9.]/g, '')) || 0;
            const minIncome = isSalaried 
                ? LOAN_ELIGIBILITY_CONFIG.limits.minSalariedMonthlySalary 
                : LOAN_ELIGIBILITY_CONFIG.limits.minBusinessAnnualProfit;
            if (!validateField(income, numIncome >= minIncome)) isValid = false;
            effectiveIncome = numIncome;
        }

        if (!isValid) {
            const firstErr = step1Form.querySelector('.form-field.has-error input, .form-field.has-error select');
            if (firstErr) firstErr.focus();
            return;
        }

        // Button Loading State
        if (btnCheckText) btnCheckText.textContent = 'Assessing Eligibility Across 25+ Lenders...';
        if (btnCheck) btnCheck.disabled = true;

        const payload = {
            loanEmpType: empType.value,
            loanType: loanType.value,
            loanAmount: numAmount,
            loanIncome: effectiveIncome,
            businessProgram: isTurnover ? 'turnover' : 'itr',
            turnoverAmount: isTurnover ? parseFloat(String(loanTurnoverAmount.value).replace(/[^0-9.]/g, '')) || 0 : 0,
            turnoverMultiplier: isTurnover ? parseFloat(loanTurnoverMultiplier.value) || 0.05 : 0,
            loanExistingEmi: parseFloat(String(emi ? emi.value : '').replace(/[^0-9.]/g, '')) || 0,
            loanTenure: tenure ? tenure.value : '20 Years',
            loanCibil: cibilSelect ? cibilSelect.value : '750+',
            loanRoi: parseFloat(loanRoiInput ? loanRoiInput.value : 8.5),
            bonusIncome: parseFloat(String(loanBonus ? loanBonus.value : '').replace(/[^0-9.]/g, '')) || 0,
            rentalIncome: parseFloat(String(loanRentIncome ? loanRentIncome.value : '').replace(/[^0-9.]/g, '')) || 0,
            depreciation: parseFloat(String(loanDepreciation ? loanDepreciation.value : '').replace(/[^0-9.]/g, '')) || 0,
            directorSalary: parseFloat(String(loanDirectorSalary ? loanDirectorSalary.value : '').replace(/[^0-9.]/g, '')) || 0,
            companyCategory: loanCompanyCategory ? loanCompanyCategory.value : 'super_a',
            customFoir: (isSalaried && loanSalariedCustomFoir) ? (parseFloat(loanSalariedCustomFoir.value) / 100) : null,
            formStartTime: userStartTime
        };

        let resultData = null;
        try {
            // Attempt serverless API call
            const response = await fetch('/api/check-eligibility', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const json = await response.json();
                if (json && json.data) {
                    resultData = json.data;
                }
            }
        } catch (apiErr) {
            console.warn('API call failed, running local eligibility calculation fallback:', apiErr);
        }

        // Fallback to local computation if API response not available
        if (!resultData) {
            const localCalc = computeLocalEligibility({
                empType: payload.loanEmpType,
                loanType: payload.loanType,
                loanAmount: payload.loanAmount,
                loanIncome: payload.loanIncome,
                loanExistingEmi: payload.loanExistingEmi,
                loanTenure: payload.loanTenure,
                cibilScore: payload.loanCibil,
                loanRoi: payload.loanRoi,
                bonusIncome: payload.bonusIncome,
                rentalIncome: payload.rentalIncome,
                depreciation: payload.depreciation,
                directorSalary: payload.directorSalary
            });
            resultData = {
                isEligible: localCalc.isEligible,
                isSalaried: localCalc.isSalaried,
                grossMonthlyIncome: localCalc.grossMonthlyIncome,
                formattedGrossIncome: `₹${formatIndianNumber(localCalc.grossMonthlyIncome)}`,
                foirUsed: localCalc.foirPercentText,
                foirLabel: localCalc.foirLabel,
                eligibleEmiCapacity: localCalc.eligibleEmiCapacity,
                formattedEmiCapacity: `₹${formatIndianNumber(localCalc.eligibleEmiCapacity)} / mo`,
                maxEligibleLoan: localCalc.maxEligibleLoan,
                formattedMaxLoan: `₹${formatIndianNumber(localCalc.maxEligibleLoan)}`,
                reqAmount: localCalc.reqAmount,
                formattedReqAmount: `₹${formatIndianNumber(localCalc.reqAmount)}`,
                estimatedReqEmi: localCalc.estimatedReqEmi,
                formattedEstimatedEmi: `₹${formatIndianNumber(localCalc.estimatedReqEmi)} / mo`,
                tenureMonths: localCalc.tenureMonths,
                roi: localCalc.roi,
                tips: localCalc.tips,
                token: btoa(JSON.stringify({ payload: { ...payload, timestamp: Date.now() }, signature: 'client_local_fallback' })),
                timestamp: Date.now()
            };
        }

        // Reset button state
        if (btnCheckText) btnCheckText.textContent = 'Check My Loan Eligibility';
        if (btnCheck) btnCheck.disabled = false;

        // Render Step 2 Results
        if (resultData.isEligible) {
            renderEligibleSuccess(resultData, payload);
        } else {
            renderIneligibleAdvisory(resultData, payload);
        }
    });

    // STEP 2A: RENDER ELIGIBLE RESULT & DYNAMICALLY MOUNT LEAD FORM (ANTI-BYPASS)
    function renderEligibleSuccess(data, originalPayload) {
        if (badgeStep1) {
            badgeStep1.classList.remove('active');
            badgeStep1.classList.add('completed');
            badgeStep1.textContent = '✓ 1. Eligible';
        }
        if (badgeStep2) {
            badgeStep2.classList.add('active');
        }

        // 1. Render Green Result Card
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = `
                <div class="eligibility-card-success">
                    <div class="eligibility-header-strip">
                        <div class="eligibility-icon-circle">✓</div>
                        <div class="eligibility-header-text">
                            <h4>Congratulations! You Are Eligible</h4>
                            <p>Your financial profile meets prime banking underwriting criteria across 25+ partner banks and NBFCs.</p>
                        </div>
                    </div>
                    <div class="eligibility-stats-grid">
                        <div class="eligibility-stat-box">
                            <span class="stat-label">Max Eligible Loan</span>
                            <span class="stat-val highlight">${data.formattedMaxLoan}</span>
                        </div>
                        <div class="eligibility-stat-box">
                            <span class="stat-label">Estimated Monthly EMI</span>
                            <span class="stat-val">${data.formattedEstimatedEmi}</span>
                        </div>
                        <div class="eligibility-stat-box">
                            <span class="stat-label">Approved FOIR Band</span>
                            <span class="stat-val">${data.foirUsed} Capacity</span>
                        </div>
                    </div>

                    <!-- Statutory Govt. & Bank Charges Breakdown Strip -->
                    <div class="statutory-charges-accordion" style="margin-top: 14px; background: #ffffff; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                            <span style="font-size: 0.8rem; font-weight: 700; color: #166534; display: flex; align-items: center; gap: 6px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                Indicative Govt. &amp; Bank Charges (As per Requested ₹${formatIndianNumber(originalPayload.loanAmount)})
                            </span>
                            <span style="font-size: 0.72rem; color: #15803d; font-weight: 600; background: #dcfce7; padding: 2px 8px; border-radius: 4px;">Govt. &amp; Bank Slabs</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; font-size: 0.76rem; color: #374151;">
                            <div style="background: #f0fdf4; padding: 6px 10px; border-radius: 6px; border: 1px solid #dcfce7;">
                                <strong style="color: #166534; display: block;">Stamp Duty (Govt. Fixed):</strong>
                                <span>0.3% of Loan = <strong>₹${formatIndianNumber(Math.round(originalPayload.loanAmount * 0.003))}</strong></span>
                            </div>
                            <div style="background: #f0fdf4; padding: 6px 10px; border-radius: 6px; border: 1px solid #dcfce7;">
                                <strong style="color: #166534; display: block;">Notice of Intimation (Govt.):</strong>
                                <span>₹15,000 (up to 30L) + Vendor (₹1,800 - ₹3,000)</span>
                            </div>
                            <div style="background: #f0fdf4; padding: 6px 10px; border-radius: 6px; border: 1px solid #dcfce7;">
                                <strong style="color: #166534; display: block;">Notary &amp; Franking with Document Charges:</strong>
                                <span>₹3,500 - ₹10,000 (As per bank &amp; loan documentation)</span>
                            </div>
                            <div style="background: #f0fdf4; padding: 6px 10px; border-radius: 6px; border: 1px solid #dcfce7;">
                                <strong style="color: #166534; display: block;">Processing Fee &amp; Insurance:</strong>
                                <span>As per lending bank / NBFC policy</span>
                            </div>
                        </div>
                    </div>

                    <div style="font-size: 0.8rem; color: #166534; font-weight: 600; margin-top: 10px;">
                        ✓ Complete Step 2 below to receive sanctioned quotes with zero hidden processing charges.
                    </div>
                </div>
            `;
        }

        // 2. STRICT ANTI-BYPASS: Inject Lead Submission Form Dynamically into DOM
        if (leadMountPoint) {
            leadMountPoint.innerHTML = `
                <form id="loanLeadApplicationForm" class="consultation-form" novalidate style="animation: fadeInSlideUp 0.35s ease-out;">
                    <div class="form-header" style="margin-bottom: 14px;">
                        <span class="form-tag" style="background: #15803d; color: #ffffff;">Step 2 of 2: Lead Submission</span>
                        <h4 style="font-size: 1.15rem; color: var(--color-navy); font-family: var(--font-heading); margin-top: 4px;">
                            Submit Application for Bank Sanction
                        </h4>
                        <p style="font-size: 0.84rem; color: var(--color-charcoal-subtle); margin-top: 2px;">
                            Provide your contact details. Senior Advisor Mukesh Tiwari will review eligibility and share personalized loan offers.
                        </p>
                    </div>

                    <!-- Verified Summary Badges (Read-Only) -->
                    <div class="summary-pill-strip">
                        <span class="summary-pill-item">Profile: <strong>${originalPayload.loanEmpType}</strong></span>
                        <span class="summary-pill-item">Loan: <strong>${originalPayload.loanType}</strong></span>
                        <span class="summary-pill-item">Requested: <strong>₹${formatIndianNumber(originalPayload.loanAmount)}</strong></span>
                        <span class="summary-pill-item">Tenure: <strong>${originalPayload.loanTenure}</strong></span>
                        <span class="summary-pill-item">ROI: <strong>${data.roi}% p.a.</strong></span>
                        <span class="summary-pill-item">CIBIL: <strong>${originalPayload.loanCibil || '750+'}</strong></span>
                        <span class="summary-pill-item">Monthly Income: <strong>${data.formattedGrossIncome}/mo</strong></span>
                        <span class="summary-pill-item" style="border-color: #86efac; color: #15803d;">Status: <strong>✓ Pre-Approved</strong></span>
                    </div>

                    <!-- Hidden Security Tokens & Verified Data -->
                    <input type="hidden" name="eligibilityToken" id="leadEligibilityToken" value="${data.token || ''}">
                    <input type="hidden" name="formStartTime" id="leadFormStartTime" value="${originalPayload.formStartTime}">
                    <input type="hidden" name="loanEmpType" value="${originalPayload.loanEmpType}">
                    <input type="hidden" name="loanType" value="${originalPayload.loanType}">
                    <input type="hidden" name="loanAmount" value="${originalPayload.loanAmount}">
                    <input type="hidden" name="loanIncome" value="${originalPayload.loanIncome}">
                    <input type="hidden" name="loanExistingEmi" value="${originalPayload.loanExistingEmi}">
                    <input type="hidden" name="loanTenure" value="${originalPayload.loanTenure}">
                    <input type="hidden" name="loanCibil" value="${originalPayload.loanCibil || '750+'}">
                    <input type="hidden" name="loanRoi" value="${data.roi}">
                    <input type="hidden" name="bonusIncome" value="${originalPayload.bonusIncome || 0}">
                    <input type="hidden" name="rentalIncome" value="${originalPayload.rentalIncome || 0}">
                    <input type="hidden" name="depreciation" value="${originalPayload.depreciation || 0}">
                    <input type="hidden" name="directorSalary" value="${originalPayload.directorSalary || 0}">
                    <input type="text" name="extra_loan_fax" style="display:none !important;" tabindex="-1" autocomplete="off" aria-hidden="true">

                    <!-- Applicant Full Name & Mobile Number -->
                    <div class="form-row">
                        <div class="form-field">
                            <label for="leadFullName">Applicant Full Name <span class="req">*</span></label>
                            <input type="text" id="leadFullName" name="loanFullName" placeholder="e.g. Rajesh Sharma" required class="form-input">
                            <span class="field-error" id="leadFullNameError">Please enter your full name (at least 2 characters)</span>
                        </div>
                        <div class="form-field">
                            <label for="leadPhone">Mobile / WhatsApp Number <span class="req">*</span></label>
                            <input type="tel" id="leadPhone" name="loanPhone" placeholder="e.g. 98200 12345" required class="form-input" maxlength="10">
                            <span class="field-error" id="leadPhoneError">Please enter a valid 10-digit Indian mobile number</span>
                        </div>
                    </div>

                    <!-- Email & City -->
                    <div class="form-row">
                        <div class="form-field">
                            <label for="leadEmail">Email Address <span class="req">*</span></label>
                            <input type="email" id="leadEmail" name="loanEmail" placeholder="e.g. rajesh@gmail.com" required class="form-input">
                            <span class="field-error" id="leadEmailError">Please enter a valid email address</span>
                        </div>
                        <div class="form-field">
                            <label for="leadCity">City / Location</label>
                            <input type="text" id="leadCity" name="loanCity" placeholder="e.g. Mumbai, Thane, Navi Mumbai" class="form-input">
                        </div>
                    </div>

                    <!-- Specific Requirements Notes -->
                    <div class="form-field mb-4">
                        <label for="leadMessage">Property Details or Specific Requirement <span class="optional">(Optional)</span></label>
                        <textarea id="leadMessage" name="loanMessage" rows="2" placeholder="e.g. Purchase of flat in Borivali, looking for balance transfer + top up..." class="form-textarea"></textarea>
                    </div>

                    <!-- Dual Action Buttons: Submit Form & Direct WhatsApp Chat -->
                    <div class="form-actions-split">
                        <button type="submit" class="btn btn-brick-lg" id="leadSubmitBtn">
                            <span id="leadSubmitBtnText">Submit Verified Loan Application</span>
                            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                        <button type="button" class="btn-wa-action" id="leadDirectWaBtn">
                            <svg class="wa-icon" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.182 8.182 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.64 4.2 3.7.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.3z"/></svg>
                            <span>Direct WhatsApp Chat</span>
                        </button>
                    </div>

                    <div class="form-status-msg" id="leadStatusMsg" style="display: none;"></div>
                </form>
            `;

            attachLeadFormListeners(data, originalPayload);
            leadMountPoint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // STEP 2B: RENDER INELIGIBLE ADVISORY & ENSURE LEAD FORM NEVER EXISTS IN DOM
    function renderIneligibleAdvisory(data, originalPayload) {
        if (badgeStep1) {
            badgeStep1.classList.add('active');
            badgeStep1.classList.remove('completed');
            badgeStep1.textContent = '1. Eligibility Assessment';
        }
        if (badgeStep2) {
            badgeStep2.classList.remove('active');
        }

        // STRICT ANTI-BYPASS: Remove any existing lead form from the DOM!
        if (leadMountPoint) {
            leadMountPoint.innerHTML = '';
        }

        if (resultContainer) {
            resultContainer.style.display = 'block';
            const tipsHtml = (data.tips || []).map(tip => `<li>${tip}</li>`).join('');

            resultContainer.innerHTML = `
                <div class="eligibility-card-advisory">
                    <div class="advisory-header-strip">
                        <div class="advisory-icon-circle">!</div>
                        <div class="advisory-header-text">
                            <h4>Eligibility Threshold Not Met Yet</h4>
                            <p>Based on standard lender FOIR norms, current income parameters fall short of the required borrowing amount.</p>
                        </div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.9); border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-bottom: 12px; font-size: 0.88rem; color: #78350f;">
                        <strong>Current Capacity:</strong> You qualify for approximately <strong>${data.formattedMaxLoan}</strong> (Requested: <strong>₹${formatIndianNumber(originalPayload.loanAmount)}</strong>).
                    </div>
                    <p style="font-size: 0.84rem; font-weight: 700; color: #92400e; margin-bottom: 6px;">How you can qualify for this loan:</p>
                    <ul class="advisory-tips-list">
                        ${tipsHtml}
                    </ul>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px;">
                        <button type="button" class="btn btn-gold-sm" id="btnRecalculateEligibility" style="padding: 9px 18px; font-weight: 700;">
                            &#8634; Recalculate / Modify Details
                        </button>
                        <a href="https://wa.me/919594736833?text=Hello%20Mukesh%20ji,%20I%20checked%20my%20loan%20eligibility%20on%20your%20website%20and%20need%20expert%20advisory%20for%20special%20bank%20FOIR%20relaxation." target="_blank" rel="noopener noreferrer" class="btn-wa-action" style="padding: 8px 16px; font-size: 0.82rem; text-decoration: none;">
                            <svg class="wa-icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.182 8.182 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.64 4.2 3.7.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.3z"/></svg>
                            <span>Speak to Mukesh Tiwari</span>
                        </a>
                    </div>
                </div>
            `;

            const btnRecalc = document.getElementById('btnRecalculateEligibility');
            if (btnRecalc) {
                btnRecalc.addEventListener('click', () => {
                    step1Form.scrollIntoView({ behavior: 'smooth' });
                    if (amount) amount.focus();
                });
            }
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Attach Submission Listeners to Dynamically Injected Lead Form
    function attachLeadFormListeners(eligibilityData, originalPayload) {
        const leadForm = document.getElementById('loanLeadApplicationForm');
        if (!leadForm) return;

        const leadFullName = document.getElementById('leadFullName');
        const leadPhone = document.getElementById('leadPhone');
        const leadEmail = document.getElementById('leadEmail');
        const leadCity = document.getElementById('leadCity');
        const leadMessage = document.getElementById('leadMessage');
        const leadSubmitBtn = document.getElementById('leadSubmitBtn');
        const leadBtnText = document.getElementById('leadSubmitBtnText');
        const leadDirectWaBtn = document.getElementById('leadDirectWaBtn');
        const leadStatusMsg = document.getElementById('leadStatusMsg');

        function buildLeadWhatsAppText() {
            const formattedAmount = `₹${formatIndianNumber(originalPayload.loanAmount)}`;
            const formattedIncome = `₹${formatIndianNumber(originalPayload.loanIncome)}`;
            const formattedMaxEligible = eligibilityData.formattedMaxLoan;
            const formattedEstEmi = eligibilityData.formattedEstimatedEmi;
            const roiVal = eligibilityData.roi || originalPayload.loanRoi || '8.5';
            const cibilVal = originalPayload.loanCibil || '750+';

            return `*New Verified Loan Application — MM Financial Services*\n` +
                   `----------------------------------------\n` +
                   `*Status:* 🟢 ELIGIBLE (System Verified)\n` +
                   `*Eligible Capacity:* Up to ${formattedMaxEligible}\n` +
                   `*Requested Loan:* ${formattedAmount}\n` +
                   `*Est. Monthly Installment:* ${formattedEstEmi}\n` +
                   `*Interest Rate:* ${roiVal}% p.a.\n` +
                   `*CIBIL Score Band:* ${cibilVal}\n` +
                   `*Applied FOIR:* ${eligibilityData.foirUsed}\n` +
                   `----------------------------------------\n` +
                   `*Applicant Name:* ${leadFullName && leadFullName.value.trim() ? leadFullName.value.trim() : 'Not specified'}\n` +
                   `*Contact Number:* ${leadPhone && leadPhone.value.trim() ? '+91 ' + leadPhone.value.trim() : 'Not specified'}\n` +
                   `*Email:* ${leadEmail && leadEmail.value.trim() ? leadEmail.value.trim() : 'Not specified'}\n` +
                   `*Location / City:* ${leadCity && leadCity.value.trim() ? leadCity.value.trim() : 'Mumbai MMR'}\n` +
                   `*Profile:* ${originalPayload.loanEmpType}\n` +
                   `*Loan Type:* ${originalPayload.loanType}\n` +
                   `*Monthly Income / Profit:* ${formattedIncome}\n` +
                   `*Existing EMIs:* ₹${formatIndianNumber(originalPayload.loanExistingEmi)}/mo\n` +
                   `*Preferred Tenure:* ${originalPayload.loanTenure}\n` +
                   `*Applicant Notes:* ${leadMessage && leadMessage.value.trim() ? leadMessage.value.trim() : 'None'}\n` +
                   `----------------------------------------\n` +
                   `Advisor: Mukesh Tiwari (+91 95947 36833)`;
        }

        if (leadDirectWaBtn) {
            leadDirectWaBtn.addEventListener('click', () => {
                const waText = buildLeadWhatsAppText();
                const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(waText)}`;
                window.open(waUrl, '_blank');
            });
        }

        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            leadForm.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-error'));
            if (leadStatusMsg) leadStatusMsg.style.display = 'none';

            let isValid = true;
            if (!validateField(leadFullName, leadFullName && leadFullName.value.trim().length >= 2)) isValid = false;

            const cleanPhone = leadPhone ? leadPhone.value.replace(/[^0-9]/g, '') : '';
            const indianPhoneRegex = /^[6-9]\d{9}$/;
            if (!validateField(leadPhone, indianPhoneRegex.test(cleanPhone))) isValid = false;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!validateField(leadEmail, emailRegex.test(leadEmail ? leadEmail.value.trim() : ''))) isValid = false;

            if (!isValid) {
                const firstErr = leadForm.querySelector('.form-field.has-error input');
                if (firstErr) firstErr.focus();
                return;
            }

            if (leadBtnText) leadBtnText.textContent = 'Verifying & Submitting to Mukesh Tiwari...';
            if (leadSubmitBtn) leadSubmitBtn.disabled = true;

            const submitPayload = {
                eligibilityToken: eligibilityData.token,
                formStartTime: originalPayload.formStartTime,
                loanEmpType: originalPayload.loanEmpType,
                loanType: originalPayload.loanType,
                loanAmount: originalPayload.loanAmount,
                loanIncome: originalPayload.loanIncome,
                loanExistingEmi: originalPayload.loanExistingEmi,
                loanTenure: originalPayload.loanTenure,
                loanCibil: originalPayload.loanCibil || '750+',
                loanRoi: eligibilityData.roi || originalPayload.loanRoi || 8.5,
                bonusIncome: originalPayload.bonusIncome,
                rentalIncome: originalPayload.rentalIncome,
                depreciation: originalPayload.depreciation,
                directorSalary: originalPayload.directorSalary,
                loanFullName: leadFullName.value.trim(),
                loanPhone: cleanPhone,
                loanEmail: leadEmail.value.trim(),
                loanCity: leadCity ? leadCity.value.trim() : '',
                loanMessage: leadMessage ? leadMessage.value.trim() : ''
            };

            let waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(buildLeadWhatsAppText())}`;

            try {
                const submitRes = await fetch('/api/submit-loan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submitPayload)
                });
                const resJson = await submitRes.json();
                if (!submitRes.ok) {
                    if (leadStatusMsg) {
                        leadStatusMsg.className = 'form-status-msg';
                        leadStatusMsg.style.backgroundColor = '#fef2f2';
                        leadStatusMsg.style.color = '#991b1b';
                        leadStatusMsg.style.border = '1px solid #fecaca';
                        leadStatusMsg.style.display = 'block';
                        leadStatusMsg.innerHTML = `<strong>Submission Rejected:</strong> ${resJson.message || 'Verification failed.'}`;
                    }
                    if (leadBtnText) leadBtnText.textContent = 'Submit Verified Loan Application';
                    if (leadSubmitBtn) leadSubmitBtn.disabled = false;
                    return;
                }
                if (resJson && resJson.waUrl) {
                    waUrl = resJson.waUrl;
                }
            } catch (err) {
                console.warn('API submission failed or offline, proceeding with WhatsApp sync fallback:', err);
            }

            // Dispatch verified loan lead notification email via FormSubmit.co to mmfsc09@gmail.com
            sendLeadToEmail({
                "Applicant Name": leadFullName.value.trim(),
                "Mobile / WhatsApp": `+91 ${cleanPhone}`,
                "Email Address": leadEmail.value.trim(),
                "City / Location": leadCity && leadCity.value.trim() ? leadCity.value.trim() : 'Mumbai MMR',
                "Eligibility Status": "🟢 ELIGIBLE (System Verified)",
                "Loan Category": originalPayload.loanType,
                "Employment Profile": originalPayload.loanEmpType,
                "Requested Loan Amount": `₹${formatIndianNumber(originalPayload.loanAmount)}`,
                "Max Eligible Capacity": eligibilityData.formattedMaxLoan,
                "Estimated Monthly EMI": eligibilityData.formattedEstimatedEmi,
                "Interest Rate": `${eligibilityData.roi || originalPayload.loanRoi || 8.5}% p.a.`,
                "CIBIL Score Band": originalPayload.loanCibil || '750+',
                "Applied FOIR": eligibilityData.foirUsed,
                "Monthly Net Income / Profit": `₹${formatIndianNumber(originalPayload.loanIncome)}`,
                "Existing Monthly EMIs": `₹${formatIndianNumber(originalPayload.loanExistingEmi)}`,
                "Preferred Tenure": originalPayload.loanTenure,
                "Applicant Requirements": leadMessage && leadMessage.value.trim() ? leadMessage.value.trim() : 'None',
                "Verified At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
            }, `New Verified Loan Lead: ${leadFullName.value.trim()} (₹${formatIndianNumber(originalPayload.loanAmount)})`, leadEmail.value.trim());

            // Success feedback
            if (leadStatusMsg) {
                leadStatusMsg.className = 'form-status-msg success';
                leadStatusMsg.style.display = 'block';
                leadStatusMsg.innerHTML = `&#10003; <strong>Application Verified &amp; Received, ${leadFullName.value.trim()}!</strong> Connecting you with Mukesh Tiwari on WhatsApp to process your sanction...`;
            }

            setTimeout(() => {
                window.open(waUrl, '_blank');
                if (leadBtnText) leadBtnText.textContent = 'Application Submitted!';
                if (leadSubmitBtn) leadSubmitBtn.disabled = false;
            }, 1200);
        });

        [leadFullName, leadPhone, leadEmail].forEach(el => {
            if (!el) return;
            el.addEventListener('input', () => {
                const f = el.closest('.form-field');
                if (f) f.classList.remove('has-error');
            });
        });
    }

    // Trigger initial label update
    updateIncomeLabel();
}


function initMfForm() {
    const form = document.getElementById('mfEnquiryForm');
    if (!form) return;

    const mode = document.getElementById('mfMode');
    const horizon = document.getElementById('mfHorizon');
    const amount = document.getElementById('mfAmount');
    const risk = document.getElementById('mfRisk');
    const fullName = document.getElementById('mfFullName');
    const phone = document.getElementById('mfPhone');
    const email = document.getElementById('mfEmail');
    const city = document.getElementById('mfCity');
    const message = document.getElementById('mfMessage');
    const submitBtn = document.getElementById('mfSubmitBtn');
    const btnText = document.getElementById('mfBtnText');
    const directWaBtn = document.getElementById('mfDirectWaBtn');
    const statusMsg = document.getElementById('mfStatusMsg');

    function buildWhatsAppText(isDirect = false) {
        const title = isDirect 
            ? '*Mutual Funds Consultation — Direct WhatsApp Chat*' 
            : '*New Mutual Fund & SIP Consultation — MM Financial Services*';

        let text = `${title}\n` +
                   `*(NJ Wealth Authorized Partner)*\n` +
                   `----------------------------------------\n` +
                   `*Investor Name:* ${fullName && fullName.value.trim() ? fullName.value.trim() : 'Not specified'}\n` +
                   `*Mobile Number:* ${phone && phone.value.trim() ? phone.value.trim() : 'Not specified'}\n` +
                   `*Investment Mode:* ${mode && mode.value ? mode.value : 'Not specified'}\n` +
                   `*Planned Investment:* ${amount && amount.value.trim() ? amount.value.trim() : 'Not specified'}\n` +
                   `*Time Horizon:* ${horizon && horizon.value ? horizon.value : 'Not specified'}\n` +
                   `*Risk Appetite:* ${risk && risk.value ? risk.value : 'Moderate'}\n` +
                   `*Email:* ${email && email.value.trim() ? email.value.trim() : 'Not specified'}\n` +
                   `*City / Location:* ${city && city.value.trim() ? city.value.trim() : 'Not specified'}\n` +
                   `*Goal / Notes:* ${message && message.value.trim() ? message.value.trim() : 'None'}\n` +
                   `----------------------------------------\n` +
                   `Advisor: Mukesh Tiwari (NJ Wealth Authorized Partner)`;
        return text;
    }

    if (directWaBtn) {
        directWaBtn.addEventListener('click', () => {
            const waText = buildWhatsAppText(true);
            const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
        });
    }

    function validateField(input, condition) {
        const field = input ? input.closest('.form-field') : null;
        if (!condition) {
            if (field) field.classList.add('has-error');
            return false;
        }
        if (field) field.classList.remove('has-error');
        return true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        form.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-error'));
        if (statusMsg) statusMsg.style.display = 'none';

        let isValid = true;
        if (mode && !validateField(mode, mode.value.trim() !== '')) isValid = false;
        if (horizon && !validateField(horizon, horizon.value.trim() !== '')) isValid = false;
        if (amount && !validateField(amount, amount.value.trim() !== '')) isValid = false;
        if (fullName && !validateField(fullName, fullName.value.trim().length >= 2)) isValid = false;

        const cleanPhone = phone ? phone.value.replace(/[^0-9]/g, '') : '';
        if (phone && !validateField(phone, cleanPhone.length >= 10)) isValid = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !validateField(email, emailRegex.test(email.value.trim()))) isValid = false;

        if (!isValid) {
            const firstErr = form.querySelector('.form-field.has-error input, .form-field.has-error select');
            if (firstErr) firstErr.focus();
            return;
        }

        if (btnText) btnText.textContent = 'Processing & Connecting...';
        if (submitBtn) submitBtn.disabled = true;

        const waText = buildWhatsAppText(false);
        const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(waText)}`;

        // Dispatch lead notification email via FormSubmit.co to mmfsc09@gmail.com
        sendLeadToEmail({
            "Investor Name": fullName.value.trim(),
            "Mobile / WhatsApp": `+91 ${cleanPhone}`,
            "Email Address": email && email.value.trim() ? email.value.trim() : 'Not specified',
            "City / Location": city && city.value.trim() ? city.value.trim() : 'Mumbai MMR',
            "Investment Mode": mode.value,
            "Planned Investment": amount.value.trim(),
            "Investment Time Horizon": horizon.value,
            "Risk Appetite Profile": risk.value,
            "Investment Goals / Notes": message && message.value.trim() ? message.value.trim() : 'None',
            "Platform": "NJ E-Wealth (Mukesh Tiwari Authorized Partner)",
            "Submitted At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
        }, `New Mutual Fund Consultation Lead: ${fullName.value.trim()} (${amount.value.trim()})`, email && email.value.trim() ? email.value.trim() : null);

        setTimeout(() => {
            if (statusMsg) {
                statusMsg.className = 'form-status-msg success';
                statusMsg.style.display = 'block';
                statusMsg.innerHTML = `&#10003; <strong>Investment Plan Received, ${fullName.value.trim()}!</strong> Connecting you directly with Mukesh Tiwari for NJ E-Wealth onboarding & scheme guidance...`;
            }

            setTimeout(() => {
                window.open(waUrl, '_blank');
                if (btnText) btnText.textContent = 'Investment Plan Submitted!';
                form.reset();
                form.querySelectorAll('.form-chip-pill').forEach(c => c.classList.remove('active'));
                if (submitBtn) submitBtn.disabled = false;
            }, 1200);
        }, 500);
    });

    [mode, horizon, amount, fullName, phone, email].forEach(el => {
        if (!el) return;
        el.addEventListener('input', () => {
            const f = el.closest('.form-field');
            if (f) f.classList.remove('has-error');
        });
        el.addEventListener('change', () => {
            const f = el.closest('.form-field');
            if (f) f.classList.remove('has-error');
        });
    });
}

function initInsuranceForm() {
    const form = document.getElementById('insuranceEnquiryForm');
    if (!form) return;

    const insType = document.getElementById('insType');
    const insCover = document.getElementById('insCover');
    const insAge = document.getElementById('insAge');
    const insTobacco = document.getElementById('insTobacco');
    const coverChips = form.querySelectorAll('.form-chip-pill[data-target="insCover"]');
    const ageChips = form.querySelectorAll('.form-chip-pill[data-target="insAge"]');

    function syncCoverChips(selectedVal) {
        coverChips.forEach(chip => {
            const chipVal = chip.getAttribute('data-val');
            chip.classList.toggle('active', chipVal === selectedVal);
        });
    }

    if (insCover) {
        insCover.addEventListener('change', () => syncCoverChips(insCover.value));
        insCover.addEventListener('input', () => syncCoverChips(insCover.value));
    }

    function syncAgeChips(selectedVal) {
        ageChips.forEach(chip => {
            const chipVal = chip.getAttribute('data-val');
            chip.classList.toggle('active', chipVal === selectedVal);
        });
    }

    if (insAge) {
        const handleAgeChange = () => {
            syncAgeChips(insAge.value);
            if (insAge.value.includes('Child') || insAge.value.includes('Newborn') || insAge.value.includes('Minor') || insAge.value.includes('Toddler')) {
                if (insTobacco) {
                    insTobacco.value = 'Not Applicable (Child / Minor)';
                }
            } else {
                if (insTobacco && insTobacco.value === 'Not Applicable (Child / Minor)') {
                    insTobacco.value = 'Non-Smoker / No Tobacco';
                }
            }
        };

        insAge.addEventListener('change', handleAgeChange);
        insAge.addEventListener('input', handleAgeChange);
    }

    const fullName = document.getElementById('insFullName');
    const phone = document.getElementById('insPhone');
    const email = document.getElementById('insEmail');
    const city = document.getElementById('insCity');
    const message = document.getElementById('insMessage');
    const submitBtn = document.getElementById('insSubmitBtn');
    const btnText = document.getElementById('insBtnText');
    const directWaBtn = document.getElementById('insDirectWaBtn');
    const statusMsg = document.getElementById('insStatusMsg');

    function buildWhatsAppText(isDirect = false) {
        const title = isDirect 
            ? '*Insurance Comparison — Direct WhatsApp Consultation*' 
            : '*New Insurance Consultation Request — MM Financial Services*';

        let text = `${title}\n` +
                   `----------------------------------------\n` +
                   `*Client Name:* ${fullName && fullName.value.trim() ? fullName.value.trim() : 'Not specified'}\n` +
                   `*Mobile Number:* ${phone && phone.value.trim() ? phone.value.trim() : 'Not specified'}\n` +
                   `*Insurance Category:* ${insType && insType.value ? insType.value : 'Not specified'}\n` +
                   `*Desired Sum Insured:* ${insCover && insCover.value ? insCover.value : 'Not specified'}\n` +
                   `*Age Group:* ${insAge && insAge.value ? insAge.value : 'Not specified'}\n` +
                   `*Tobacco / Smoking:* ${insTobacco && insTobacco.value ? insTobacco.value : 'Non-Smoker'}\n` +
                   `*Email:* ${email && email.value.trim() ? email.value.trim() : 'Not specified'}\n` +
                   `*City / Location:* ${city && city.value.trim() ? city.value.trim() : 'Not specified'}\n` +
                   `*Existing Policy / Notes:* ${message && message.value.trim() ? message.value.trim() : 'None'}\n` +
                   `----------------------------------------\n` +
                   `Advisor: Mukesh Tiwari (MM Financial Services Consultant)`;
        return text;
    }

    if (directWaBtn) {
        directWaBtn.addEventListener('click', () => {
            const waText = buildWhatsAppText(true);
            const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
        });
    }

    function validateField(input, condition) {
        const field = input ? input.closest('.form-field') : null;
        if (!condition) {
            if (field) field.classList.add('has-error');
            return false;
        }
        if (field) field.classList.remove('has-error');
        return true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        form.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-error'));
        if (statusMsg) statusMsg.style.display = 'none';

        let isValid = true;
        if (insType && !validateField(insType, insType.value.trim() !== '')) isValid = false;
        if (insCover && !validateField(insCover, insCover.value.trim() !== '')) isValid = false;
        if (insAge && !validateField(insAge, insAge.value.trim() !== '')) isValid = false;
        if (fullName && !validateField(fullName, fullName.value.trim().length >= 2)) isValid = false;

        const cleanPhone = phone ? phone.value.replace(/[^0-9]/g, '') : '';
        if (phone && !validateField(phone, cleanPhone.length >= 10)) isValid = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !validateField(email, emailRegex.test(email.value.trim()))) isValid = false;

        if (!isValid) {
            const firstErr = form.querySelector('.form-field.has-error input, .form-field.has-error select');
            if (firstErr) firstErr.focus();
            return;
        }

        if (btnText) btnText.textContent = 'Processing & Comparing...';
        if (submitBtn) submitBtn.disabled = true;

        const waText = buildWhatsAppText(false);
        const waUrl = `https://wa.me/919594736833?text=${encodeURIComponent(waText)}`;

        // Dispatch lead notification email via FormSubmit.co to mmfsc09@gmail.com
        sendLeadToEmail({
            "Client Name": fullName.value.trim(),
            "Mobile / WhatsApp": `+91 ${cleanPhone}`,
            "Email Address": email && email.value.trim() ? email.value.trim() : 'Not specified',
            "City / Location": city && city.value.trim() ? city.value.trim() : 'Mumbai MMR',
            "Insurance Category": insType.value,
            "Desired Sum Insured": insCover.value,
            "Age Group": insAge.value,
            "Tobacco / Smoking Status": insTobacco.value,
            "Existing Policy / Health Notes": message && message.value.trim() ? message.value.trim() : 'None',
            "Submitted At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
        }, `New Insurance Consultation Lead: ${fullName.value.trim()} (${insType.value} - ${insCover.value})`, email && email.value.trim() ? email.value.trim() : null);

        setTimeout(() => {
            if (statusMsg) {
                statusMsg.className = 'form-status-msg success';
                statusMsg.style.display = 'block';
                statusMsg.innerHTML = `&#10003; <strong>Request Received, ${fullName.value.trim()}!</strong> Connecting you directly with Mukesh Tiwari on WhatsApp with comparative quotes from top IRDAI insurers...`;
            }

            setTimeout(() => {
                window.open(waUrl, '_blank');
                if (btnText) btnText.textContent = 'Comparison Request Sent!';
                form.reset();
                form.querySelectorAll('.form-chip-pill').forEach(c => c.classList.remove('active'));
                syncCoverChips('₹1 - ₹2 Crore');
                syncAgeChips('26 - 35 Years');
                if (submitBtn) submitBtn.disabled = false;
            }, 1200);
        }, 500);
    });

    [insType, insCover, insAge, fullName, phone, email].forEach(el => {
        if (!el) return;
        el.addEventListener('input', () => {
            const f = el.closest('.form-field');
            if (f) f.classList.remove('has-error');
        });
        el.addEventListener('change', () => {
            const f = el.closest('.form-field');
            if (f) f.classList.remove('has-error');
        });
    });
}



