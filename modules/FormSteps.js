export default function initFormSteps() {
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    if (!formSteps.length) return;

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const nextStep = currentStep.nextElementSibling;

            if (nextStep) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');

                const index = [...formSteps].indexOf(currentStep);
                const currentIndicator = document.querySelector(`.step-indicator:nth-child(${index + 1})`);
                const nextIndicator = currentIndicator?.nextElementSibling;

                if (currentIndicator && nextIndicator) {
                    currentIndicator.classList.remove('active');
                    nextIndicator.classList.add('active');
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const prevStep = currentStep.previousElementSibling;

            if (prevStep) {
                currentStep.classList.remove('active');
                prevStep.classList.add('active');

                const index = [...formSteps].indexOf(currentStep);
                const currentIndicator = document.querySelector(`.step-indicator:nth-child(${index + 1})`);
                const prevIndicator = currentIndicator?.previousElementSibling;

                if (currentIndicator && prevIndicator) {
                    currentIndicator.classList.remove('active');
                    prevIndicator.classList.add('active');
                }
            }
        });
    });
}