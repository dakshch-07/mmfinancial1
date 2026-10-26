const fs = require('fs');
const files = [
  'calculators/car-loan-emi-calculator.html',
  'calculators/dream-builder-rd-calculator.html',
  'calculators/education-loan-emi-calculator.html',
  'calculators/emi-calculator.html',
  'calculators/fd-calculator.html',
  'calculators/gold-loan-calculator.html',
  'calculators/home-loan-comparison-calculator.html',
  'calculators/home-loan-eligibility-calculator.html',
  'calculators/home-loan-emi-calculator.html',
  'calculators/life-insurance-calculator.html',
  'calculators/loan-against-property-calculator.html',
  'calculators/personal-loan-eligibility-calculator.html',
  'calculators/personal-loan-emi-calculator.html',
  'calculators/ppf-calculator.html',
  'calculators/recurring-deposit-calculator.html',
  'calculators/sip-calculator.html',
  'calculators/sukanya-samriddhi-yojana-calculator.html',
  'calculators/two-wheeler-loan-emi-calculator.html'
];

const lamfCard = `    <a href="/calculators/loan-against-mutual-funds-calculator" class="other-calc-card">
        <div class="other-calc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/><polyline points="8 16 12 12 16 14 20 10"/></svg></div>
        <div class="other-calc-info">
            <span class="other-calc-cat">Loans</span>
            <h4 class="other-calc-title">Loan Against Mutual Funds (LAMF)</h4>
        </div>
        <span class="other-calc-arrow">&rarr;</span>
    </a>\n`;

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('loan-against-mutual-funds-calculator')) continue;
  const target = '<div class="other-calcs-grid">';
  if (content.includes(target)) {
    content = content.replace(target, target + '\n' + lamfCard);
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}
console.log(`Updated ${count} calculator pages with LAMF card.`);
