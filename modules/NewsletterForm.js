export default function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('¡Gracias por suscribirte a nuestro boletín!');
        form.reset();
    });
}