import ContactForm from './modules/ContactForm.js';
import initMenuToggle from './modules/MenuToggle.js';
import initFormSteps from './modules/FormSteps.js';
import initPricingToggle from './modules/PricingToggle.js';
import initStatCounter from './modules/StatCounter.js';
import initNewsletterForm from './modules/NewsletterForm.js';
import initDemoForm from './modules/DemoForm.js';
import initVideoPlaceholder from './modules/VideoPlaceholder.js';

document.addEventListener('DOMContentLoaded', function () {
    new ContactForm('#contactForm', '/api/contact');
    initMenuToggle();
    initFormSteps();
    initPricingToggle();
    initStatCounter();
    initNewsletterForm();
    initDemoForm();
    initVideoPlaceholder();
});
