import Component from '../Component.js';


export default class ContactSection extends Component {
  // Eliminamos el constructor personalizado y usamos init()
  
  init() {
    // Inicializar todas las propiedades necesarias
    this.title = this.options.title || '¿Tienes <span>preguntas</span>?';
    this.subtitle = this.options.subtitle || 'Estamos aquí para ayudarte a ti y a tu perro.';
    this.contactInfo = this.options.contactInfo || this.getDefaultContactInfo();
    this.socialLinks = this.options.socialLinks || this.getDefaultSocialLinks();
    this.formTitle = this.options.formTitle || 'Envíanos un mensaje';
    this.formFields = this.options.formFields || this.getDefaultFormFields();
    this.submitButtonText = this.options.submitButtonText || 'Enviar mensaje';
    this.onSubmit = this.options.onSubmit || this.defaultSubmit.bind(this);
    
    // Opciones adicionales
    this.showSocialLinks = this.options.showSocialLinks !== false; // Por defecto, true
    this.animateIcons = this.options.animateIcons !== false; // Por defecto, true
  }
  
  // Métodos para obtener valores por defecto
  getDefaultContactInfo() {
    return [
      { 
        icon: 'phone-alt', 
        title: 'Llámanos', 
        lines: [
          '+51 910 731 863',
          'Lunes a Viernes, 9am - 6pm'
        ]
      },
      { 
        icon: 'envelope', 
        title: 'Escríbenos', 
        lines: [
          'smartpetsxplore@gmail.com',
          'Respondemos en menos de 24 horas'
        ]
      },
      { 
        icon: 'map-marker-alt', 
        title: 'Visítanos', 
        lines: [
          'Av. Universitaria, Tingo María, Leoncio Prado, Huánuco, Perú'
        ]
      }
    ];
  }
  
  getDefaultSocialLinks() {
    return [
      { icon: 'facebook-f', url: 'https://facebook.com/' },
      { icon: 'instagram', url: 'https://instagram.com/' },
      { icon: 'whatsapp', url: 'https://wa.me/51910731863' }
    ];
  }
  
  getDefaultFormFields() {
    return [
      { id: 'contact-name', type: 'text', label: 'Nombre', required: true },
      { id: 'contact-email', type: 'email', label: 'Correo electrónico', required: true },
      { id: 'contact-subject', type: 'text', label: 'Asunto', required: true },
      { id: 'contact-message', type: 'textarea', label: 'Mensaje', rows: 4, required: true }
    ];
  }
  
  render() {
    this.element.innerHTML = `
      <div class="container">
        <div class="contact-content">
          <h2>${this.title}</h2>
          <p class="subtitle">${this.subtitle}</p>
          
          <div class="contact-info">
            ${this.contactInfo.map(info => `
              <div class="contact-method">
                <i class="fas fa-${info.icon} ${this.animateIcons ? 'animated-icon' : ''}"></i>
                <h4>${info.title}</h4>
                ${info.lines.map(line => `<p>${line}</p>`).join('')}
              </div>
            `).join('')}
          </div>
          
          ${this.showSocialLinks ? `
            <div class="social-links">
              ${this.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title || ''}">
                  <i class="fab fa-${link.icon}"></i>
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="contact-form">
          <h3>${this.formTitle}</h3>
          <form id="contactForm">
            ${this.formFields.map(field => `
              <div class="form-group">
                <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                ${field.type === 'textarea' 
                  ? `<textarea id="${field.id}" rows="${field.rows || 4}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`
                  : `<input type="${field.type}" id="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`
                }
              </div>
            `).join('')}
            <button type="submit" class="btn btn-primary">${this.submitButtonText}</button>
          </form>
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.element.querySelector('#contactForm');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const formData = {};
        this.formFields.forEach(field => {
          const input = form.querySelector(`#${field.id}`);
          if (input) {
            formData[field.id] = input.value;
          }
        });
        
        // Validar formulario
        if (this.validateForm(form, formData)) {
          this.onSubmit(formData);
        }
      });
      
      // Validación en tiempo real al perder el foco
      this.formFields.forEach(field => {
        const input = form.querySelector(`#${field.id}`);
        if (input) {
          input.addEventListener('blur', () => {
            if (field.required && (!input.value || input.value.trim() === '')) {
              this.showError(input, 'Este campo es requerido');
            } else if (field.type === 'email' && input.value) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(input.value)) {
                this.showError(input, 'Por favor ingresa un email válido');
              } else {
                this.removeError(input);
              }
            } else {
              this.removeError(input);
            }
          });
        }
      });
    }
    
    // Animación al pasar el cursor sobre los métodos de contacto
    if (this.animateIcons) {
      const contactMethods = this.element.querySelectorAll('.contact-method');
      contactMethods.forEach(method => {
        method.addEventListener('mouseenter', () => {
          const icon = method.querySelector('i');
          icon.classList.add('pulse');
        });
        
        method.addEventListener('mouseleave', () => {
          const icon = method.querySelector('i');
          icon.classList.remove('pulse');
        });
      });
    }
  }
  
  validateForm(form, formData) {
    let isValid = true;
    
    // Validar campos requeridos
    this.formFields.forEach(field => {
      if (field.required) {
        const input = form.querySelector(`#${field.id}`);
        const value = formData[field.id];
        
        if (!value || value.trim() === '') {
          isValid = false;
          this.showError(input, 'Este campo es requerido');
        } else {
          this.removeError(input);
        }
      }
    });
    
    // Validar email si existe
    const emailField = this.formFields.find(field => field.type === 'email');
    if (emailField && formData[emailField.id]) {
      const emailInput = form.querySelector(`#${emailField.id}`);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(formData[emailField.id])) {
        isValid = false;
        this.showError(emailInput, 'Por favor ingresa un email válido');
      }
    }
    
    return isValid;
  }
  
  showError(input, message) {
    input.classList.add('error');
    
    // Buscar si ya existe un mensaje de error
    let errorElement = input.parentNode.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }
  
  removeError(input) {
    input.classList.remove('error');
    
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  defaultSubmit(formData) {
    console.log('Formulario enviado:', formData);
    
    // Mostrar mensaje de éxito con SweetAlert2 si está disponible
    if (window.Swal) {
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
        confirmButtonColor: 'var(--primary-color)'
      });
    } else {
      alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
    }
    
    // Resetear formulario
    const form = this.element.querySelector('#contactForm');
    if (form) form.reset();
  }
}