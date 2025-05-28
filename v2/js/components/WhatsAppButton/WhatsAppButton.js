import Component from '../Component.js';



export default class WhatsAppButton extends Component {
  // Eliminamos el constructor y movemos la inicialización a init()
  
  init() {
    // Inicializar propiedades desde opciones o usar valores por defecto
    this.phoneNumber = this.options.phoneNumber || '+51910731863';
    this.message = this.options.message || 'Hola! Me interesa saber más sobre SmartPx';
    
    // Opciones adicionales con valores predeterminados
    this.position = this.options.position || 'right'; // 'right' o 'left'
    this.showTooltip = this.options.showTooltip !== false; // Por defecto true
    this.tooltipText = this.options.tooltipText || '¿Necesitas ayuda? ¡Escríbenos!';
    this.buttonColor = this.options.buttonColor || '#25D366'; // Color de WhatsApp por defecto
    this.animate = this.options.animate !== false; // Por defecto true
    this.mobile = this.options.mobile !== false; // Por defecto true (mostrar en móvil)
    this.size = this.options.size || 'medium'; // 'small', 'medium', 'large'
    
    // Estado interno del componente
    this.state = {
      tooltipVisible: false,
      ...this.state
    };
  }
  
  render() {
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${this.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(this.message)}`;
    
    // Clases CSS basadas en opciones
    const buttonClasses = [
      'whatsapp-button',
      `position-${this.position}`,
      `size-${this.size}`,
      this.animate ? 'animated' : ''
    ].filter(Boolean).join(' ');
    
    this.element.innerHTML = `
      <a href="${whatsappUrl}" 
         class="${buttonClasses}" 
         target="_blank" 
         rel="noopener noreferrer"
         aria-label="Contactar por WhatsApp"
         style="background-color: ${this.buttonColor}">
        <i class="fab fa-whatsapp"></i>
        ${this.showTooltip ? `
          <span class="whatsapp-tooltip ${this.state.tooltipVisible ? 'visible' : ''}">
            ${this.tooltipText}
          </span>
        ` : ''}
      </a>
    `;
    
    // Ocultar en móvil si está configurado así
    if (!this.mobile && window.innerWidth < 768) {
      this.element.style.display = 'none';
    }
  }
  
  bindEvents() {
    const button = this.element.querySelector('.whatsapp-button');
    
    if (button && this.showTooltip) {
      // Mostrar tooltip al hacer hover
      button.addEventListener('mouseenter', () => {
        this.setState({ tooltipVisible: true });
      });
      
      button.addEventListener('mouseleave', () => {
        this.setState({ tooltipVisible: false });
      });
      
      // En móvil, mostrar tooltip al tocar el botón durante un tiempo
      let touchTimer;
      
      button.addEventListener('touchstart', (e) => {
        touchTimer = setTimeout(() => {
          this.setState({ tooltipVisible: true });
        }, 500); // Mostrar después de 500ms de tocar
      });
      
      button.addEventListener('touchend', () => {
        clearTimeout(touchTimer);
        // No ocultamos inmediatamente para que el usuario pueda leerlo
        setTimeout(() => {
          this.setState({ tooltipVisible: false });
        }, 2000); // Ocultar después de 2 segundos
      });
      
      // Rastrear clics para analíticas
      button.addEventListener('click', () => {
        this.trackClick();
      });
    }
    
    // Escuchar cambios de tamaño de ventana para ajustar visibilidad en móvil
    if (!this.mobile) {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }
  
  handleResize() {
    if (window.innerWidth < 768) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }
  
  // Método para rastrear clics (para analíticas)
  trackClick() {
    // Si existe Google Analytics
    if (window.gtag) {
      window.gtag('event', 'click', {
        'event_category': 'WhatsApp',
        'event_label': this.message,
        'value': 1
      });
    }
    
    // Callback personalizado si se proporciona
    if (typeof this.options.onButtonClick === 'function') {
      this.options.onButtonClick();
    }
    
    console.log('WhatsApp button clicked');
  }
  
  // Métodos públicos para controlar el componente desde fuera
  showButton() {
    this.element.style.display = 'block';
  }
  
  hideButton() {
    this.element.style.display = 'none';
  }
  
  updateMessage(newMessage) {
    this.message = newMessage;
    this.render();
  }
  
  updatePhoneNumber(newPhoneNumber) {
    this.phoneNumber = newPhoneNumber;
    this.render();
  }
}