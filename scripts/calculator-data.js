/**
 * CALCULATOR REGISTRY & METADATA
 * MM Financial Services Consultant (Mukesh Tiwari)
 */

const CALCULATORS = [
  {
    id: "home-loan-eligibility-calculator",
    slug: "home-loan-eligibility-calculator",
    name: "Home Loan Eligibility Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Most Popular Loan Tool",
    popular: true,
    h1: "Home Loan Eligibility Calculator",
    metaTitle: "Home Loan Eligibility Calculator | MM Financial Services Consultant",
    metaDescription: "Check your maximum home loan eligibility in seconds. Calculate borrowing capacity for salaried (60% FOIR) and business 2-Year ITR profiles with Mukesh Tiwari.",
    intro: "Calculate your maximum home loan eligibility in seconds based on your monthly in-hand salary, annual bonus, rental income, or audited 2-year business ITR profit. Our calculator uses a standard 60% FOIR (Fixed Obligation to Income Ratio) and adds back depreciation and partner remuneration for business profiles to give you an instant, realistic assessment before applying.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    widgetType: "eligibility",
    defaultRate: 8.75,
    defaultTenure: 20,
    maxTenure: 30,
    disclaimerExtra: "FOIR percentages (60% benchmark for Home Loan & LAP), income considerations and interest rates used are illustrative and subject to bank credit policy.",
    faqs: [
      {
        q: "How is home loan eligibility calculated by banks in India?",
        a: "Banks evaluate eligibility through the Fixed Obligation to Income Ratio (FOIR), capped at 60% of your net monthly income. Ongoing EMI obligations are deducted from this capacity, and the maximum loan amount is computed using prevailing interest rates and tenure."
      },
      {
        q: "How is loan eligibility assessed for Business and Self-Employed profiles?",
        a: "Banks evaluate business profiles based on the last 2 years audited ITR net profit (averaged over 24 months to arrive at monthly income). Non-cash expenses like annual depreciation, director/partner salary/remuneration drawn from the firm, and rental income are added back to cash flow, with a standard 60% FOIR applied after deducting existing obligations."
      },
      {
        q: "What is FOIR and how does it affect my loan amount?",
        a: "FOIR stands for Fixed Obligation to Income Ratio. It represents the maximum percentage of your monthly income (60% for Home Loans & LAP, 65% for Personal Loans) that lenders permit toward all EMI repayments combined."
      },
      {
        q: "Can adding a co-applicant increase my home loan eligibility?",
        a: "Yes. Adding an earning co-applicant—such as your spouse, parent, or working child—combines household income, significantly lowering the overall FOIR and allowing you to qualify for a substantially larger sanction."
      },
      {
        q: "How does credit score (CIBIL) impact my eligibility?",
        a: "A CIBIL score of 750 or higher unlocks benchmark interest rates and smoother sanctions. Scores below 700 may lead to conservative loan-to-value limits, stricter FOIR caps, or higher risk premiums."
      }
    ]
  },
  {
    id: "home-loan-emi-calculator",
    slug: "home-loan-emi-calculator",
    name: "Home Loan EMI Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Essential Borrowing Tool",
    popular: true,
    h1: "Home Loan EMI Calculator with Amortization Schedule",
    metaTitle: "Home Loan EMI Calculator with Amortization Schedule | MM Financial Services",
    metaDescription: "Calculate your exact monthly Home Loan EMI, total interest, and prepayment savings with our interactive calculator and complete amortization schedule.",
    intro: "Calculate your exact monthly home loan installment, total interest payable, and overall loan cost. Use our interactive part-prepayment planner to see how making a one-time principal payment can shave years off your loan tenure and save lakhs of rupees in interest.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    widgetType: "loan-emi",
    defaultAmount: 5000000,
    minAmount: 100000,
    maxAmount: 100000000,
    stepAmount: 50000,
    defaultRate: 8.75,
    minRate: 6.0,
    maxRate: 20.0,
    stepRate: 0.05,
    defaultTenure: 20,
    maxTenure: 30,
    hasPrepayment: true,
    faqs: [
      {
        q: "How is monthly Home Loan EMI calculated?",
        a: "EMI is calculated using the reducing balance formula: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P is Principal, r is monthly interest rate (annual rate / 12 / 100), and n is total number of monthly installments."
      },
      {
        q: "Does making part-prepayments reduce my loan tenure or EMI?",
        a: "By default, banks keep your EMI constant and reduce the outstanding loan tenure, saving substantial compounding interest. Alternatively, you can request your bank to keep tenure unchanged and reduce the monthly installment."
      },
      {
        q: "What is the difference between fixed and floating interest rate home loans?",
        a: "Floating interest rates fluctuate with RBI repo rate changes (External Benchmark Lending Rate), generally offering lower starting rates with no prepayment penalties for individuals. Fixed rate loans lock your EMI for a specified period, shielding you from rising interest cycles."
      },
      {
        q: "Are there any tax deductions on home loan EMI payments?",
        a: "Yes. Under Section 80C, principal repayments up to ₹1.5 Lakh per year are deductible. Under Section 24(b), interest paid up to ₹2.0 Lakh per year on a self-occupied residential property is eligible for deduction."
      },
      {
        q: "What charges are associated with home loan prepayment?",
        a: "Under RBI guidelines, banks and housing finance companies cannot charge any prepayment penalty or foreclosure fee on floating-rate home loans availed by individual borrowers."
      }
    ]
  },
  {
    id: "home-loan-comparison-calculator",
    slug: "home-loan-comparison-calculator",
    name: "Home Loan Comparison Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Smart Savings Tool",
    popular: false,
    h1: "Home Loan Comparison & Balance Transfer Calculator",
    metaTitle: "Home Loan Comparison & Balance Transfer Calculator | MM Financial Services",
    metaDescription: "Compare two home loan offers or calculate exact interest and EMI savings from a Home Loan Balance Transfer with MM Financial Services Consultant.",
    intro: "Compare two home loan offers side-by-side or calculate your exact net savings from transferring your existing home loan to a lower interest rate. Factor in processing fees and transfer charges to see your true break-even timeline.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    widgetType: "comparison",
    faqs: [
      {
        q: "When does a home loan balance transfer make financial sense?",
        a: "A balance transfer is beneficial when the interest rate difference is at least 0.50% to 0.75%, your remaining tenure is 10 years or more, and your total interest savings comfortably exceed processing fees and legal charges."
      },
      {
        q: "What fees and charges are involved in transferring a home loan?",
        a: "Typical costs include processing fees with the new lender (0.25% - 0.50% or flat offer), legal and technical valuation charges, stamp duty on mortgage deed, and MODT (Memorandum of Deposit of Title Deeds) charges."
      },
      {
        q: "How do processing fees impact the total cost of a loan?",
        a: "An upfront processing fee of 1% on a ₹50 Lakh loan equals ₹50,000. Comparing total borrowing cost (interest + upfront fee) ensures you don't overpay for an apparently lower headline rate."
      },
      {
        q: "Can I negotiate interest rates with my current lender instead of switching?",
        a: "Yes. Many banks offer an internal rate conversion (repricing) for a nominal conversion fee (₹1,000 to ₹5,000), reducing your rate without the paperwork of a full balance transfer."
      },
      {
        q: "How long does a home loan balance transfer process take?",
        a: "A balance transfer usually takes 10 to 18 working days, including document verification, property re-evaluation, foreclosure letter issuance from the existing lender, and new disbursement."
      }
    ]
  },
  {
    id: "personal-loan-eligibility-calculator",
    slug: "personal-loan-eligibility-calculator",
    name: "Personal Loan Eligibility Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Quick Unsecured Estimate",
    popular: false,
    h1: "Personal Loan Eligibility Calculator",
    metaTitle: "Personal Loan Eligibility Calculator | MM Financial Services Consultant",
    metaDescription: "Estimate your personal loan eligibility instantly based on net monthly salary and current EMI obligations. Free consultation with Mukesh Tiwari.",
    intro: "Find out how much personal loan you can qualify for with leading banks and NBFCs. Based on your net salary, employer category, and existing obligations, get an instant estimate of your borrowing capacity.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    widgetType: "eligibility",
    defaultRate: 11.0,
    defaultTenure: 5,
    maxTenure: 7,
    disclaimerExtra: "Personal loan sanctions depend on employer classification, credit score, and lender underwriting criteria.",
    faqs: [
      {
        q: "What is the minimum monthly salary needed for a personal loan in Mumbai?",
        a: "Most Tier-1 banks require a minimum monthly net salary of ₹25,000 to ₹30,000 in Mumbai and MMR, while select NBFCs accept ₹20,000 depending on credit profile."
      },
      {
        q: "How much personal loan can I get on a ₹50,000 salary?",
        a: "Assuming a 65% FOIR and zero existing obligations, your eligible EMI capacity is ₹32,500. At an 11% interest rate for a 5-year tenure, you can qualify for approximately ₹15 Lakh."
      },
      {
        q: "Do personal loans require any collateral or guarantor?",
        a: "No. Personal loans are 100% unsecured loans that require no property collateral, hypothecation, or third-party guarantor."
      },
      {
        q: "How does employer category impact personal loan eligibility?",
        a: "Banks categorize employers into Super A, Category A, B, and C based on stability and size. Employees of top MNCs and Fortune 500 firms receive higher FOIR caps and lowest interest rates."
      },
      {
        q: "Can self-employed professionals get personal loans?",
        a: "Yes. Self-employed professionals (doctors, CAs, architects) and business owners qualify based on 2-3 years of audited ITR statements and bank turnover."
      }
    ]
  },
  {
    id: "personal-loan-emi-calculator",
    slug: "personal-loan-emi-calculator",
    name: "Personal Loan EMI Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Instant Repayment Planner",
    popular: true,
    h1: "Personal Loan EMI Calculator",
    metaTitle: "Personal Loan EMI Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate your monthly personal loan EMI, total interest, and view month-by-month amortization schedule with MM Financial Services.",
    intro: "Plan your personal loan repayment accurately. Calculate your monthly installments, total interest burden, and download a complete amortisation schedule across tenures from 1 to 7 years.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="18"/></svg>`,
    widgetType: "loan-emi",
    defaultAmount: 500000,
    minAmount: 50000,
    maxAmount: 5000000,
    stepAmount: 10000,
    defaultRate: 11.0,
    minRate: 9.5,
    maxRate: 24.0,
    stepRate: 0.1,
    defaultTenure: 5,
    maxTenure: 7,
    faqs: [
      {
        q: "How is personal loan interest calculated?",
        a: "Reputed banks use reducing balance interest calculation where interest is charged only on the remaining unpaid principal each month, lowering interest burden over time."
      },
      {
        q: "Can I foreclose my personal loan before the tenure ends?",
        a: "Yes. Most lenders permit foreclosure after completing 6 to 12 regular EMIs, with foreclosure charges typically ranging from 2% to 4% on the outstanding principal."
      },
      {
        q: "What is the ideal tenure for a personal loan?",
        a: "A 3 to 4-year tenure offers the optimal balance between a manageable monthly installment and low cumulative interest payout."
      },
      {
        q: "Why is personal loan EMI higher than a home loan EMI for the same amount?",
        a: "Personal loans have shorter repayment periods (maximum 5 to 7 years vs 20 to 30 years for home loans) and higher interest rates due to unsecured credit risk."
      },
      {
        q: "Does missing a personal loan EMI impact CIBIL score?",
        a: "Yes. Even a single 30-day delay in personal loan repayment can drop your CIBIL score by 40 to 60 points and attract penal interest."
      }
    ]
  },
  {
    id: "car-loan-emi-calculator",
    slug: "car-loan-emi-calculator",
    name: "Car Loan EMI Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Auto Finance Planner",
    popular: false,
    h1: "Car Loan EMI Calculator",
    metaTitle: "Car Loan EMI Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate monthly installments for new and used car loans with customizable down payments, tenure, and amortization schedules.",
    intro: "Calculate exact monthly installments for your new or pre-owned car purchase. Adjust down payment, interest rates, and loan tenure up to 8 years to find an EMI that fits comfortably into your monthly budget.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    widgetType: "loan-emi",
    defaultAmount: 1000000,
    minAmount: 100000,
    maxAmount: 10000000,
    stepAmount: 25000,
    defaultRate: 9.0,
    minRate: 7.5,
    maxRate: 18.0,
    stepRate: 0.1,
    defaultTenure: 5,
    maxTenure: 8,
    faqs: [
      {
        q: "What percentage of the car's on-road price do banks finance?",
        a: "Most leading banks finance 80% to 90% of the on-road price for new cars, and select lenders offer up to 100% of ex-showroom value for top corporate profiles."
      },
      {
        q: "Is a higher down payment always better for a car loan?",
        a: "Yes. A larger down payment reduces the principal borrowed, lowers your monthly EMI, and significantly decreases total interest cost over the tenure."
      },
      {
        q: "Can I get a loan for a used or second-hand car?",
        a: "Yes. Used car loans are widely available for vehicles up to 8 to 10 years old, typically carrying interest rates 2% to 4% higher than new vehicle loans."
      },
      {
        q: "How does hypothecation work on a financed car?",
        a: "When a car is financed, the lender places a hypothecation charge on the vehicle registration certificate (RC). Once the loan is fully repaid, you receive an NOC to remove hypothecation at the RTO."
      },
      {
        q: "What are the typical tenure options for vehicle loans?",
        a: "New car loans range from 1 to 8 years, while pre-owned vehicle loans are generally capped between 3 and 5 years."
      }
    ]
  },
  {
    id: "two-wheeler-loan-emi-calculator",
    slug: "two-wheeler-loan-emi-calculator",
    name: "Two-Wheeler Loan EMI Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Bike & Scooter Financing",
    popular: false,
    h1: "Two-Wheeler & Bike Loan EMI Calculator",
    metaTitle: "Two-Wheeler Loan EMI Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate monthly installments for motorcycle and scooter financing across leading finance partners in Mumbai with Mukesh Tiwari.",
    intro: "Calculate exact monthly installments for your new motorcycle or scooter loan across leading finance partners in Mumbai and Maharashtra. Choose your loan tenure from 1 to 5 years.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M12 17h4l2-6H9l-3 6"/><line x1="12" y1="5" x2="15" y2="11"/></svg>`,
    widgetType: "loan-emi",
    defaultAmount: 100000,
    minAmount: 20000,
    maxAmount: 1000000,
    stepAmount: 5000,
    defaultRate: 11.0,
    minRate: 8.5,
    maxRate: 24.0,
    stepRate: 0.25,
    defaultTenure: 3,
    maxTenure: 5,
    faqs: [
      {
        q: "What is the minimum down payment needed for a bike loan?",
        a: "Down payments typically start from 10% to 20% of the on-road vehicle cost, with zero-down-payment schemes available for salaried applicants with excellent credit scores."
      },
      {
        q: "Can I get a two-wheeler loan without income proof?",
        a: "Select NBFCs and fintech lenders offer two-wheeler loans with simplified KYC and bank statement evaluation without requiring full salary slips or ITR."
      },
      {
        q: "What are typical interest rates for two-wheeler financing?",
        a: "Interest rates generally range from 9.5% to 18.0% per annum on reducing balance depending on your credit history and lender scheme."
      },
      {
        q: "How long does two-wheeler loan approval take?",
        a: "Digital two-wheeler loans are usually approved and sanctioned within 1 to 4 hours with instant Aadhaar KYC and bank verification."
      },
      {
        q: "How do I remove vehicle hypothecation after loan closure?",
        a: "After completing your final EMI, your lender issues Form 35 and a No Objection Certificate (NOC). Submit these to the local RTO to issue a clean RC."
      }
    ]
  },
  {
    id: "education-loan-emi-calculator",
    slug: "education-loan-emi-calculator",
    name: "Education Loan EMI Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Includes Section 80E Tax Benefits",
    popular: false,
    h1: "Education Loan EMI Calculator (with Section 80E Tax Benefits)",
    metaTitle: "Education Loan EMI Calculator with 80E Tax Benefits | MM Financial Services",
    metaDescription: "Calculate student loan EMI with moratorium periods, interest capitalization, and tax deductions under Section 80E of Income Tax Act.",
    intro: "Calculate higher education loan EMIs for domestic and overseas studies. Factor in course duration, moratorium grace periods, interest capitalization, and evaluate tax savings under Section 80E of the Income Tax Act.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    widgetType: "education-loan",
    defaultAmount: 2500000,
    minAmount: 100000,
    maxAmount: 15000000,
    defaultRate: 9.5,
    disclaimerExtra: "Tax benefits are subject to prevailing law and your individual situation; consult a qualified tax advisor.",
    faqs: [
      {
        q: "What is a moratorium period in an education loan?",
        a: "A moratorium is a repayment holiday during the course duration plus a grace period (typically 6 to 12 months after course completion or finding employment) before regular EMIs commence."
      },
      {
        q: "How does Section 80E tax deduction work on education loans?",
        a: "Under Section 80E, 100% of the interest paid on an education loan is eligible for tax deduction with no upper limit for up to 8 consecutive financial years."
      },
      {
        q: "What happens if I pay simple interest during the moratorium?",
        a: "Paying simple interest monthly during your studies prevents interest from being capitalized (added to principal), ensuring a significantly lower EMI when repayment starts."
      },
      {
        q: "Is collateral mandatory for education loans?",
        a: "Loans up to ₹7.5 Lakh under the Credit Guarantee Fund Scheme generally require no collateral. Loans above ₹7.5 Lakh for overseas studies typically require tangible collateral (residential property, FD)."
      },
      {
        q: "Can education loans cover living expenses and overseas travel?",
        a: "Yes. Comprehensive student loans cover tuition fees, examination and library charges, living accommodations, laptops, and return airfare for international universities."
      }
    ]
  },
  {
    id: "gold-loan-calculator",
    slug: "gold-loan-calculator",
    name: "Gold Loan Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Instant LTV Valuation",
    popular: false,
    h1: "Gold Loan Calculator (Instant LTV & Valuation)",
    metaTitle: "Gold Loan Calculator — Instant Value & Eligible Loan | MM Financial Services",
    metaDescription: "Calculate eligible loan against gold jewelry based on weight, carat purity (18K to 24K), live market rates, and RBI 75% LTV guidelines.",
    intro: "Calculate the maximum loan amount you can secure against your gold ornaments. Enter gold weight in grams, carat purity (18K, 20K, 22K, 24K), and evaluate instant eligibility under RBI's 75% Loan-to-Value (LTV) guidelines.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
    widgetType: "gold-loan",
    disclaimerExtra: "Gold valuation and LTV percentages vary by lender, purity verification, and daily market bullion rates.",
    faqs: [
      {
        q: "What is the maximum LTV (Loan-to-Value) permitted by RBI for gold loans?",
        a: "The Reserve Bank of India permits banks and NBFCs to lend up to 75% of the evaluated market value of pure gold in pledged ornaments."
      },
      {
        q: "Which gold purity levels are accepted by lenders?",
        a: "Banks accept gold jewelry ranging from 18 Karat to 22 Karat (and select bullion/coins up to 24K up to 50 grams). Stones and gems are excluded during appraisal."
      },
      {
        q: "How is the value of pledged gold calculated?",
        a: "Purity weight in grams is multiplied by the 30-day average closing price published by the India Bullion and Jewellers Association (IBJA) to determine total gold value."
      },
      {
        q: "What repayment options are available for gold loans?",
        a: "Options include bullet repayment (interest and principal paid together at maturity), monthly interest payment with principal at end, and regular EMI repayment."
      },
      {
        q: "Is my pledged gold safe with the lending institution?",
        a: "Yes. Pledged gold is sealed in tamper-proof vaults under high-security electronic surveillance and fully insured against fire, theft, or burglary."
      }
    ]
  },
  {
    id: "loan-against-property-calculator",
    slug: "loan-against-property-calculator",
    name: "Loan Against Property (LAP) Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Dual Eligibility & EMI",
    popular: false,
    h1: "Loan Against Property (LAP) Eligibility & EMI Calculator",
    metaTitle: "Loan Against Property (LAP) Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate Loan Against Property (LAP) eligibility and monthly EMIs for residential, commercial, and industrial properties in Mumbai.",
    intro: "Unlock the value of your residential, commercial, or industrial property. Our dual calculator assesses both your property-value LTV limit and income-based FOIR capacity to reveal your exact binding loan eligibility and monthly installments.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    widgetType: "lap",
    defaultRate: 9.5,
    defaultTenure: 15,
    maxTenure: 20,
    faqs: [
      {
        q: "What types of properties can be mortgaged for a Loan Against Property?",
        a: "Self-occupied residential houses/flats, rented residential units, commercial offices, retail shops, and industrial sheds with clear legal title deeds qualify."
      },
      {
        q: "How is LAP eligibility determined between property value and income?",
        a: "Lenders compute two limits: (1) Collateral limit (typically 55% to 65% of market value) and (2) Income limit (60% FOIR capacity). Your sanction is the lower of these two amounts."
      },
      {
        q: "Can LAP funds be used for business expansion and working capital?",
        a: "Yes. LAP funds are multi-purpose and can be used for business growth, machinery purchase, debt consolidation, property acquisitions, or major family commitments."
      },
      {
        q: "What is the typical interest rate and tenure for mortgage loans?",
        a: "Interest rates range between 9.0% and 12.5% per annum, with long tenures available up to 15 to 20 years, making monthly EMIs substantially lower than unsecured business loans."
      },
      {
        q: "Can co-owned properties be pledged for a Loan Against Property?",
        a: "Yes, provided all legal co-owners join as co-applicants in the loan application."
      }
    ]
  },
  {
    id: "emi-calculator",
    slug: "emi-calculator",
    name: "All-in-One Loan EMI Calculator",
    category: "Loans",
    categorySlug: "loans",
    badge: "Universal Financial Engine",
    popular: false,
    h1: "EMI Calculator — Comprehensive Loan Repayment Tool",
    metaTitle: "Universal Loan EMI Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate monthly installments for any loan with customizable principal, interest rate, tenure, interactive charts, and CSV schedule export.",
    intro: "Universal financial calculator for all types of loans. Compute monthly installments, total interest, and overall repayment cost with interactive SVG donut charts, balance trendlines, and downloadable amortization schedules.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    widgetType: "loan-emi",
    defaultAmount: 2500000,
    minAmount: 10000,
    maxAmount: 100000000,
    stepAmount: 10000,
    defaultRate: 10.0,
    minRate: 1.0,
    maxRate: 30.0,
    stepRate: 0.1,
    defaultTenure: 10,
    maxTenure: 30,
    faqs: [
      {
        q: "What formula is used to calculate loan EMI?",
        a: "Standard banking reducing-balance formula: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P is Principal, r is monthly interest, and n is total months."
      },
      {
        q: "Why does the interest component decrease each month?",
        a: "Because interest is computed on the remaining unpaid loan balance. As each EMI pays off some principal, the outstanding balance shrinks, meaning less interest is charged next month."
      },
      {
        q: "What is the difference between flat interest rate and reducing balance rate?",
        a: "A flat rate charges interest on the full original principal for the entire tenure, making the effective cost nearly double that of an equivalent reducing-balance rate."
      },
      {
        q: "Can I download my amortization schedule?",
        a: "Yes. Our tool provides a direct 'Download Schedule as CSV' button to save your entire month-by-month repayment schedule for your financial records."
      },
      {
        q: "What should I do if interest rates rise during my loan?",
        a: "You can make occasional partial prepayments, opt for a tenure extension if permissible, or explore a balance transfer to a more competitive lender with Mukesh Tiwari."
      }
    ]
  },
  {
    id: "fd-calculator",
    slug: "fd-calculator",
    name: "Fixed Deposit (FD) Calculator",
    category: "Deposits",
    categorySlug: "deposits",
    badge: "Guaranteed Return Tool",
    popular: true,
    h1: "Fixed Deposit (FD) Calculator",
    metaTitle: "Fixed Deposit (FD) Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate maturity amount and interest earned on bank and corporate fixed deposits with compounding frequency options and senior citizen rates.",
    intro: "Calculate exact maturity amounts and interest earnings on your fixed deposits. Supports Monthly, Quarterly, Half-Yearly, and Annual compounding, with dedicated Senior Citizen interest rate add-ons.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    widgetType: "fd",
    defaultPrincipal: 100000,
    defaultRate: 7.0,
    defaultYears: 5,
    defaultMonths: 0,
    disclaimerExtra: "Interest rates change from time to time; confirm current rates with the bank or relevant authority before investing.",
    faqs: [
      {
        q: "How does compounding frequency affect FD returns?",
        a: "More frequent compounding yields higher returns. In India, most bank FDs compound quarterly, meaning interest earned each quarter is added to principal for the next quarter's calculation."
      },
      {
        q: "Do senior citizens receive higher interest rates on fixed deposits?",
        a: "Yes. Indian banks typically offer senior citizens (aged 60+) an additional 0.50% per annum, and select super-senior citizen schemes (aged 80+) offer up to 0.75% to 0.80% extra."
      },
      {
        q: "What is the TDS threshold on bank fixed deposit interest?",
        a: "Under Section 194A, TDS is deducted if annual interest exceeds ₹40,000 for regular individuals (₹50,000 for senior citizens). Submitting Form 15G or 15H prevents TDS if your total income is below the taxable threshold."
      },
      {
        q: "Can I break or withdraw my fixed deposit prematurely?",
        a: "Yes, standard FDs can be withdrawn prematurely, usually subject to a 0.5% to 1.0% interest rate penalty. 5-year tax-saving FDs carry a mandatory lock-in and cannot be broken."
      },
      {
        q: "What is the difference between cumulative and non-cumulative FDs?",
        a: "Cumulative FDs reinvest interest until maturity for maximum compounding growth, whereas non-cumulative FDs payout interest monthly, quarterly, or annually for regular income."
      }
    ]
  },
  {
    id: "recurring-deposit-calculator",
    slug: "recurring-deposit-calculator",
    name: "Recurring Deposit (RD) Calculator",
    category: "Deposits",
    categorySlug: "deposits",
    badge: "Disciplined Savings Engine",
    popular: false,
    h1: "Recurring Deposit (RD) Calculator",
    metaTitle: "Recurring Deposit (RD) Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate maturity amount on monthly recurring deposits with standard Indian banking quarterly compounding rules and Mukesh Tiwari.",
    intro: "Calculate exact maturity amounts on your disciplined monthly bank recurring deposits. Uses the official Indian banking quarterly compounding algorithm to give you precise maturity values.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    widgetType: "rd",
    defaultDeposit: 5000,
    defaultRate: 6.5,
    defaultMonths: 24,
    disclaimerExtra: "Interest rates change from time to time; confirm current rates with the bank or relevant authority before investing.",
    faqs: [
      {
        q: "How is interest calculated on recurring deposits in Indian banks?",
        a: "Indian banks calculate RD interest on a quarterly compounding basis using the Indian Banks' Association (IBA) formula, where each installment earns compounding interest for its remaining tenure."
      },
      {
        q: "What is the minimum and maximum tenure for an RD account?",
        a: "Tenures range from 6 months up to 120 months (10 years) in multiples of 3 months across public and private sector banks."
      },
      {
        q: "Can I alter the monthly deposit amount in an active RD?",
        a: "Standard bank RDs require a fixed monthly commitment. For flexible monthly contributions, flexi-RD products or mutual fund SIPs provide superior flexibility."
      },
      {
        q: "What happens if I miss an RD installment?",
        a: "Banks typically levy a nominal penalty (e.g. ₹1.50 per ₹100 per month). Missing 3 or 4 consecutive installments may lead to premature account closure."
      },
      {
        q: "Is interest earned on recurring deposits taxable?",
        a: "Yes. RD interest is fully taxable as income from other sources at your applicable tax slab, and TDS applies if annual interest exceeds ₹40,000 (₹50,000 for seniors)."
      }
    ]
  },
  {
    id: "dream-builder-rd-calculator",
    slug: "dream-builder-rd-calculator",
    name: "Dream Builder Goal-Based RD Calculator",
    category: "Deposits",
    categorySlug: "deposits",
    badge: "Target Milestone Planner",
    popular: false,
    h1: "Dream Builder RD Calculator (Goal-Based Savings)",
    metaTitle: "Dream Builder Goal-Based RD Calculator | MM Financial Services",
    metaDescription: "Reverse-calculate the exact monthly deposit needed to reach your target savings goal with bank quarterly compounding rules.",
    intro: "Plan backward from your target goal. Whether it is a down payment for your dream home, your child's school fees, or a luxury vacation, discover the exact monthly deposit required to achieve your milestone on time.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    widgetType: "dream-rd",
    defaultTarget: 500000,
    defaultYears: 3,
    defaultRate: 6.5,
    disclaimerExtra: "Interest rates change from time to time; confirm current rates with the bank or relevant authority before investing.",
    faqs: [
      {
        q: "How does the Dream Builder reverse-RD calculator work?",
        a: "Instead of starting with monthly deposits, you input your target financial corpus and target year. The engine reverse-compounds the bank interest formula to tell you exactly how much to save monthly."
      },
      {
        q: "Can I use this goal calculator for short-term goals?",
        a: "Yes. It is ideal for capital-preservation goals spanning 1 to 5 years, such as vehicle down payments, gadget purchases, or annual insurance premiums."
      },
      {
        q: "How does an RD compare with a Mutual Fund SIP for 3-year goals?",
        a: "RDs offer 100% guaranteed principal safety and fixed returns. Mutual Fund SIPs (hybrid or short-duration funds) offer potential for inflation-beating returns with moderate market exposure."
      },
      {
        q: "Can I automate my monthly goal deposit?",
        a: "Yes. Setting up a monthly auto-debit standing instruction ensures you never miss a milestone installment."
      },
      {
        q: "What if I can save more than the required monthly deposit?",
        a: "Increasing your monthly contribution will help you achieve your dream milestone ahead of schedule or accumulate a larger surplus."
      }
    ]
  },
  {
    id: "sip-calculator",
    slug: "sip-calculator",
    name: "Mutual Fund SIP & Lumpsum Calculator",
    category: "Investments",
    categorySlug: "investments",
    badge: "Wealth Compounding Engine",
    popular: true,
    h1: "Mutual Fund SIP & Lumpsum Calculator (NJ Wealth Partner)",
    metaTitle: "Mutual Fund SIP & Lumpsum Calculator | NJ Wealth Partner Mukesh Tiwari",
    metaDescription: "Calculate wealth compounding from systematic monthly investments (SIP) and lumpsum mutual funds with step-up features. NJ Wealth Partner Mukesh Tiwari.",
    intro: "Project your long-term wealth compounding through systematic monthly investments (SIP), step-up increases, or one-time lumpsum allocations. Supported by NJ Wealth Authorized Partner Mukesh Tiwari.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    widgetType: "sip",
    defaultMonthly: 10000,
    minMonthly: 500,
    maxMonthly: 500000,
    stepMonthly: 500,
    defaultReturn: 12.0,
    minReturn: 6.0,
    maxReturn: 30.0,
    stepReturn: 0.5,
    defaultYears: 10,
    maxYears: 40,
    disclaimerExtra: "Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Past performance is not an indicator of future returns. Projected returns are not guaranteed.",
    faqs: [
      {
        q: "What is a Systematic Investment Plan (SIP) in mutual funds?",
        a: "A SIP allows you to invest a fixed amount regularly (monthly or quarterly) into selected mutual fund schemes, building wealth through Rupee Cost Averaging and the power of compounding."
      },
      {
        q: "What is the benefit of a Step-Up SIP?",
        a: "A Step-Up SIP automatically increases your monthly investment by a chosen percentage (e.g., 10%) each year aligned with salary increments, drastically multiplying your final maturity corpus."
      },
      {
        q: "What returns can I realistically expect from equity mutual funds?",
        a: "Over long investment horizons (7 to 10+ years), diversified Indian equity mutual funds have historically delivered 11% to 14% annualized CAGR, though returns are market-linked and not guaranteed."
      },
      {
        q: "Can I stop, pause, or withdraw my SIP at any time?",
        a: "Yes. Open-ended mutual funds provide complete liquidity. You can pause or stop your SIP mandate without penalty, and redeem funds to your bank account within 1 to 3 working days (subject to exit loads)."
      },
      {
        q: "How does Mukesh Tiwari (NJ Wealth Partner) assist with mutual funds?",
        a: "As an Authorized Partner of NJ Wealth, Mukesh Tiwari provides personalized portfolio allocation, zero-paperwork digital onboarding, automated SIP setup, and regular portfolio rebalancing."
      }
    ]
  },
  {
    id: "ppf-calculator",
    slug: "ppf-calculator",
    name: "Public Provident Fund (PPF) Calculator",
    category: "Investments",
    categorySlug: "investments",
    badge: "100% Tax-Free Government Scheme",
    popular: false,
    h1: "Public Provident Fund (PPF) Calculator",
    metaTitle: "PPF Calculator — 15 Year Tax-Free Maturity | MM Financial Services",
    metaDescription: "Calculate guaranteed tax-free returns and maturity wealth on your Government of India 15-year Public Provident Fund (PPF) account.",
    intro: "Calculate your guaranteed, 100% tax-free maturity corpus in the Government of India Public Provident Fund (PPF). Features start-of-year compounding rules and 5-year block extension options up to 30 years.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    widgetType: "ppf",
    defaultDeposit: 150000,
    minDeposit: 500,
    maxDeposit: 150000,
    stepDeposit: 500,
    defaultRate: 7.1,
    disclaimerExtra: "Interest rates change from time to time; confirm current rates with the bank or relevant authority before investing.",
    faqs: [
      {
        q: "What is the annual contribution limit for a PPF account?",
        a: "The minimum deposit is ₹500 and the maximum is ₹1,50,000 per financial year under Section 80C rules."
      },
      {
        q: "When is interest calculated and credited in a PPF account?",
        a: "Interest is calculated monthly on the lowest balance between the close of the 5th day and the end of the month, and compounded and credited annually on March 31st."
      },
      {
        q: "Can a PPF account be extended after 15 years?",
        a: "Yes. You can extend your PPF account in blocks of 5 years indefinitely, either with continuing contributions or without further deposits while continuing to earn interest."
      },
      {
        q: "Why is PPF classified under the EEE tax category?",
        a: "PPF enjoys Exempt-Exempt-Exempt tax status: investments qualify for Section 80C deduction, interest earned is completely exempt, and the entire maturity proceeds are 100% tax-free."
      },
      {
        q: "Can I take a loan against my PPF account balance?",
        a: "Yes. A loan can be taken from the 3rd to the 6th financial year up to 25% of the balance at the end of the 2nd preceding financial year."
      }
    ]
  },
  {
    id: "sukanya-samriddhi-yojana-calculator",
    slug: "sukanya-samriddhi-yojana-calculator",
    name: "Sukanya Samriddhi Yojana (SSY) Calculator",
    category: "Investments",
    categorySlug: "investments",
    badge: "Beti Bachao Savings Scheme",
    popular: false,
    h1: "Sukanya Samriddhi Yojana (SSY) Calculator",
    metaTitle: "Sukanya Samriddhi Yojana (SSY) Calculator | MM Financial Services Consultant",
    metaDescription: "Calculate government-backed tax-free maturity wealth for your daughter's higher education and marriage under Sukanya Samriddhi Yojana.",
    intro: "Calculate guaranteed, government-backed tax-free maturity wealth for your daughter's higher education and marriage under the Beti Bachao Beti Padhao initiative. Computes 15 years of deposits and 21 years of sovereign compounding.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    widgetType: "ssy",
    defaultDeposit: 150000,
    minDeposit: 250,
    maxDeposit: 150000,
    stepDeposit: 250,
    defaultRate: 8.2,
    defaultAge: 1,
    disclaimerExtra: "Interest rates change from time to time; confirm current rates with the bank or relevant authority before investing.",
    faqs: [
      {
        q: "What is the maximum age limit to open an SSY account?",
        a: "The girl child must be under 10 years of age at the time of account opening. A maximum of two accounts are permitted per family (three in case of twins/triplets)."
      },
      {
        q: "For how many years do deposits need to be made in SSY?",
        a: "Deposits are required only for the first 15 years from account opening. The account matures at 21 years, earning compound interest continuously through all 21 years."
      },
      {
        q: "Can partial withdrawals be made for higher education?",
        a: "Yes. Once the girl child attains 18 years of age or passes 10th standard, up to 50% of the balance at the end of the preceding financial year can be withdrawn for higher education expenses."
      },
      {
        q: "What are the tax benefits of Sukanya Samriddhi Yojana?",
        a: "SSY provides EEE tax benefits: deposits qualify for Section 80C deduction, interest earned is 100% tax-free, and final maturity withdrawal is completely exempt from income tax."
      },
      {
        q: "What is the current interest rate on SSY?",
        a: "The Government of India notifies quarterly interest rates, currently standing at a sovereign-backed 8.2% per annum, making it one of India's highest-yielding fixed-income instruments."
      }
    ]
  },
  {
    id: "life-insurance-calculator",
    slug: "life-insurance-calculator",
    name: "Life Insurance Need Calculator",
    category: "Insurance",
    categorySlug: "insurance",
    badge: "Human Life Value Assessment",
    popular: false,
    h1: "Life Insurance Cover Need Calculator",
    metaTitle: "Life Insurance Need & Human Life Value Calculator | MM Financial Services",
    metaDescription: "Calculate the exact term life insurance cover required to protect your family's future lifestyle, debt obligations, and milestones with Mukesh Tiwari.",
    intro: "Calculate the exact term life insurance coverage required to protect your family's future lifestyle, outstanding loan liabilities, and future milestones. Uses the actuarial Human Life Value (HLV) capital needs method.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    widgetType: "life-insurance",
    disclaimerExtra: "Insurance is a subject matter of solicitation. This is an indicative estimate and not a recommendation of any specific insurance policy.",
    faqs: [
      {
        q: "How much life insurance cover do I actually need?",
        a: "As a rule of thumb, life cover should be at least 10 to 15 times your annual income. However, a precise Human Life Value calculation accounts for inflation-adjusted living expenses, outstanding liabilities (home loans), and future children's goals minus existing investments."
      },
      {
        q: "Why is pure term insurance recommended over endowment or ULIPs?",
        a: "Pure term insurance provides maximum sum assured (e.g., ₹1 Crore to ₹2 Crore) for a nominal annual premium, allowing you to invest your remaining surplus in wealth-building mutual funds."
      },
      {
        q: "How do outstanding loans affect my life insurance requirement?",
        a: "In the event of an untimely demise, your outstanding debts (home loans, car loans, personal loans) must be paid off so your family isn't burdened with repayment or asset repossession."
      },
      {
        q: "Why should inflation be factored into life insurance calculations?",
        a: "A monthly family expense of ₹50,000 today will exceed ₹1,60,000 in 20 years at 6% annual inflation. Calculating present value with inflation ensures your family never runs out of capital."
      },
      {
        q: "How can Mukesh Tiwari assist in choosing term life insurance?",
        a: "Mukesh Tiwari evaluates claim settlement ratios, solvency margins, rider options (critical illness, accidental disability, waiver of premium), and identifies suitable insurers for your profile."
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CALCULATORS };
}
