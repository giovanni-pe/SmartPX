export default function initDemoForm() {
    const form = document.getElementById('demoForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
        form.reset();
    });
}
