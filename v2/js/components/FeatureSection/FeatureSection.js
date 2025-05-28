import Component from '../Component.js';

export default class FeatureSection extends Component {
  // Ya no es necesario duplicar configuraciones en el constructor
  init() {
    // Aquí inicializamos todas las propiedades necesarias
    this.features = this.options.features || [
      {
        icon: 'brain',
        iconClass: 'ai',
        title: 'Rutas con IA',
        description: 'Nuestra inteligencia artificial analiza raza, tamaño y energía de tu perro para recomendar las rutas perfectas.'
      },
      {
        icon: 'user-friends',
        iconClass: 'walker',
        title: 'Paseadores ideales',
        description: 'Te conectamos con paseadores que coinciden con el ritmo y necesidades de tu perro.'
      },
      {
        icon: 'map-marked-alt',
        iconClass: 'tracking',
        title: 'Seguimiento en tiempo real',
        description: 'Recibe actualizaciones y ubicación durante todo el paseo de tu mascota.'
      },
      {
        icon: 'crown',
        iconClass: 'subscription',
        title: 'Beneficios exclusivos',
        description: 'Descuentos y rutas premium para suscriptores frecuentes.'
      },
      {
        icon: 'shield-alt',
        iconClass: 'safety',
        title: 'Seguridad garantizada',
        description: 'Paseadores verificados y rutas seguras seleccionadas cuidadosamente.'
      }
    ];
    
    // También podemos inicializar otros valores
    this.title = this.options.title || 'La experiencia de paseo más <span>avanzada</span> para tu perro';
    this.subtitle = this.options.subtitle || 'Nuestra tecnología hace que cada paseo sea perfecto para las necesidades de tu mascota';
  }
  
  render() {
    this.element.innerHTML = `
      <div class="container">
        <h2>${this.title}</h2>
        <p class="section-subtitle">${this.subtitle}</p>
        
        <div class="features-grid">
          ${this.features.map(feature => `
            <div class="feature-card">
              <div class="feature-icon ${feature.iconClass}">
                <i class="fas fa-${feature.icon}"></i>
              </div>
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // También podemos añadir eventos y animaciones
  bindEvents() {
    const featureCards = this.element.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });
  }
}