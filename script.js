document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if(this.getAttribute('href') === '#') return;
            
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if(navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if(window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Pricing toggle
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const monthlyTexts = document.querySelectorAll('.monthly-text');
    const annualTexts = document.querySelectorAll('.annual-text');
    
    pricingToggle.addEventListener('change', function() {
        if(this.checked) {
            // Show annual prices
            monthlyPrices.forEach(price => price.style.display = 'none');
            annualPrices.forEach(price => price.style.display = 'block');
            monthlyTexts.forEach(text => text.style.display = 'none');
            annualTexts.forEach(text => text.style.display = 'inline');
        } else {
            // Show monthly prices
            monthlyPrices.forEach(price => price.style.display = 'block');
            annualPrices.forEach(price => price.style.display = 'none');
            monthlyTexts.forEach(text => text.style.display = 'inline');
            annualTexts.forEach(text => text.style.display = 'none');
        }
    });

    // Demo form steps
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    if(formSteps.length && nextButtons.length && prevButtons.length) {
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = this.closest('.form-step');
                const nextStep = currentStep.nextElementSibling;
                
                if(nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                    
                    // Update step indicator
                    const currentIndicator = document.querySelector(`.step-indicator:nth-child(${Array.from(formSteps).indexOf(currentStep) + 1}`);
                    const nextIndicator = currentIndicator.nextElementSibling;
                    
                    if(currentIndicator && nextIndicator) {
                        currentIndicator.classList.remove('active');
                        nextIndicator.classList.add('active');
                    }
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = this.closest('.form-step');
                const prevStep = currentStep.previousElementSibling;
                
                if(prevStep) {
                    currentStep.classList.remove('active');
                    prevStep.classList.add('active');
                    
                    // Update step indicator
                    const currentIndicator = document.querySelector(`.step-indicator:nth-child(${Array.from(formSteps).indexOf(currentStep) + 1}`);
                    const prevIndicator = currentIndicator.previousElementSibling;
                    
                    if(currentIndicator && prevIndicator) {
                        currentIndicator.classList.remove('active');
                        prevIndicator.classList.add('active');
                    }
                }
            });
        });
    }

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const increment = () => {
                current += step;
                if(current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(increment);
                } else {
                    stat.textContent = target;
                }
            };
            
            increment();
        });
    }
    
    // Intersection Observer for stats animation
    const statsSection = document.querySelector('.stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if(statsSection) {
        observer.observe(statsSection);
    }

    // Form submissions
    const demoForm = document.getElementById('demoForm');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if(demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to your server
            alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
        });
    }
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to your server
            alert('Mensaje enviado con éxito. ¡Gracias por contactarnos!');
            this.reset();
        });
    }
    
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to your server
            alert('¡Gracias por suscribirte a nuestro boletín!');
            this.reset();
        });
    }

    // Video placeholder click
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if(videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // In a real implementation, this would open a modal with the video
            alert('Aquí se mostraría un video demostrativo de la plataforma.');
        });
    }
});