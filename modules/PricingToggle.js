export default function initPricingToggle() {
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const monthlyTexts = document.querySelectorAll('.monthly-text');
    const annualTexts = document.querySelectorAll('.annual-text');

    if (!pricingToggle) return;

    pricingToggle.addEventListener('change', function () {
        const showAnnual = this.checked;

        monthlyPrices.forEach(el => el.style.display = showAnnual ? 'none' : 'block');
        annualPrices.forEach(el => el.style.display = showAnnual ? 'block' : 'none');
        monthlyTexts.forEach(el => el.style.display = showAnnual ? 'none' : 'inline');
        annualTexts.forEach(el => el.style.display = showAnnual ? 'inline' : 'none');
    });
}