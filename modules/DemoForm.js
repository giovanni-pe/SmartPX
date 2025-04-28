import { apiFetch } from './utils/http.js';

export default class DemoForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const payload = {
            name: this.form.querySelector('#name').value,
            email: this.form.querySelector('#email').value,
            phone: this.form.querySelector('#phone').value,
            dog_name: this.form.querySelector('#dog-name').value,
            dog_breed: this.form.querySelector('#dog-breed').value,
            dog_age: this.form.querySelector('#dog-age').value,
            dog_energy: this.form.querySelector('#dog-energy').value
        };

        try {
            const response = await apiFetch('/walk-reservations/demo', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Mostrar alerta
            await Swal.fire({
                icon: 'success',
                title: '¡Reserva recibida!',
                text: response.message || 'Te contactaremos pronto.',
                confirmButtonColor: '#FF6B6B'
            });

            // Pintar datos en el paso 3
            document.querySelector('#clientName').textContent = payload.name;
            document.querySelector('#dogName').textContent = payload.dog_name;

            // Mostrar paso 3
            this.form.querySelector('.form-step[data-step="2"]').classList.remove('active');
            this.form.querySelector('.form-step[data-step="3"]').classList.add('active');
            const indicators = document.querySelectorAll('.form-header .step-indicator');
            indicators.forEach(el => el.classList.remove('active'));
            indicators[2]?.classList.add('active'); // índ

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo enviar el formulario. Intenta más tarde.',
                confirmButtonColor: '#FF6B6B'
            });
        }
    }
}
