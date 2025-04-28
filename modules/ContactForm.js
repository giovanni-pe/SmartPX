import { apiFetch } from './utils/http.js';

export default class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();

        const payload = {
            name: this.form.querySelector('#contact-name').value,
            email: this.form.querySelector('#contact-email').value,
            subject: this.form.querySelector('#contact-subject').value,
            message: this.form.querySelector('#contact-message').value,
        };

        try {
            await apiFetch('/contact', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            await Swal.fire({
                icon: 'success',
                title: 'Mensaje enviado',
                text: '¡Gracias! Pronto nos pondremos en contacto contigo.',
                confirmButtonColor: 'rgb(228, 168, 83)', // ✨ botón dorado
                background: '#243344',
                color: '#F5F5F5',
            });

            this.form.reset();

        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo enviar el mensaje. Intenta más tarde.',
                confirmButtonColor: 'rgb(228, 168, 83)', // ✨ botón dorado
                background: '#243344',
                color: '#F5F5F5',
            });
        }
    }
}
