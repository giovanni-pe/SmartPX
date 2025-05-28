import Component from '../Component.js';

export default class StatCounter extends Component {
  constructor(selector, options = {}) {
    super(selector, options);
    
    this.animated = false;
    this.duration = options.duration || 2000;
    this.initObserver();
  }
  
  render() {
    // No necesitamos renderizar HTML, usamos los elementos existentes
  }
  
  initObserver() {
    // Crear un observador para detectar cuando las estadísticas son visibles en la pantalla
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animateStats();
          this.animated = true;
          observer.disconnect(); // Desconectar después de animar una vez
        }
      });
    }, { threshold: 0.5 });
    
    // Si el selector es para múltiples elementos, observar el contenedor padre
    if (typeof this.element === 'string') {
      const elements = document.querySelectorAll(this.element);
      if (elements.length > 0) {
        // Observar el padre común de los elementos
        const parent = elements[0].closest('section');
        if (parent) {
          observer.observe(parent);
        }
      }
    } else if (this.element) {
      // Si es un solo elemento, observar su contenedor
      const parent = this.element.closest('section');
      if (parent) {
        observer.observe(parent);
      }
    }
  }
  
  animateStats() {
    const statElements = typeof this.element === 'string' 
      ? document.querySelectorAll(this.element)
      : [this.element];
    
    statElements.forEach(statElement => {
      const target = parseInt(statElement.getAttribute('data-count'));
      const step = target / (this.duration / 16); // 60fps aproximadamente
      let current = 0;
      
      const increment = () => {
        current += step;
        if (current < target) {
          statElement.textContent = Math.floor(current);
          requestAnimationFrame(increment);
        } else {
          statElement.textContent = target;
        }
      };
      
      increment();
    });
  }
}
