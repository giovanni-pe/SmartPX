import Component from '../Component.js';


export default class NewsletterForm extends Component {
  constructor(selector, options = {}) {
    super(selector, options);
    
    this.onSubmit = options.onSubmit || this.defaultSubmit.bind(this);
  }
  
  render() {
    // No reemplazamos el HTML, solo aseguramos que tenga la estructura correcta
    if (!this.element) return;
    
    // Verificar que el formulario tenga al menos un input de email y un botón
    const emailInput = this.element.querySelector('input[type="email"]');
    const submitButton = this.element.querySelector('button[type="submit"]');
    
    if (!emailInput) {
      const input = document.createElement('input');
      input.type = 'email';
      input.placeholder = 'Tu correo electrónico';
      input.required = true;
      this.element.appendChild(input);
    }
    
    if (!submitButton) {
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'btn btn-primary';
      button.textContent = 'Suscribirse';
      this.element.appendChild(button);
    }
  }
  
  bindEvents() {
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = this.element.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        this.onSubmit(emailInput.value);
      }
    });
  }
  
  defaultSubmit(email) {
    console.log(`Suscripción con email: ${email}`);
    alert('¡Gracias por suscribirte a nuestro boletín!');
    this.element.reset();
  }
}
