import Component from '../Component.js';


export default class PricingSection extends Component {
  // Eliminamos el constructor y usamos init()
  
  init() {
    // Inicializar el estado (ya no necesitamos asignarlo explícitamente en constructor)
    this.state = {
      showAnnual: this.options.showAnnual || false,
      ...this.state  // Preservar cualquier estado que pudiera haber sido definido en la clase base
    };
    
    // Inicializar propiedades desde opciones o usar valores por defecto
    this.title = this.options.title || 'Planes que se adaptan a <span>tu ritmo</span>';
    this.subtitle = this.options.subtitle || 'Elige la opción perfecta para las necesidades de tu mascota';
    this.annualDiscount = this.options.annualDiscount || '25% de descuento';
    this.plans = this.options.plans || this.getDefaultPlans();
    this.customPlanText = this.options.customPlanText || '¿Necesitas un plan personalizado para varios perros o necesidades especiales?';
    this.customPlanCta = this.options.customPlanCta || 'Contáctanos para un plan a medida';
    this.customPlanLink = this.options.customPlanLink || '#contact';
    
    // Callbacks opcionales
    this.onPlanSelect = this.options.onPlanSelect || null;
    this.onPricingToggle = this.options.onPricingToggle || null;
  }
  
  // Método auxiliar para obtener planes por defecto si no se proporcionan
  getDefaultPlans() {
    return [
      {
        id: 'basic',
        title: 'Básico',
        monthlyPrice: 'S/ 60',
        annualPrice: 'S/ 30',
        features: [
          { text: '4 paseos al mes', included: true },
          { text: 'Recomendaciones básicas de rutas', included: true },
          { text: 'Paseador preferido', included: false },
          { text: 'Rutas premium', included: false }
        ],
        ctaText: 'Elegir plan',
        popular: false
      },
      {
        id: 'premium',
        title: 'Premium',
        monthlyPrice: 'S/ 100',
        annualPrice: 'S/ 50',
        features: [
          { text: '8 paseos al mes', included: true },
          { text: 'Recomendaciones avanzadas de IA', included: true },
          { text: 'Seguimiento en tiempo real + fotos', included: true },
          { text: 'Paseador preferido', included: true },
          { text: 'Acceso a rutas premium', included: true }
        ],
        ctaText: 'Elegir plan',
        popular: true
      },
      {
        id: 'unlimited',
        title: 'Ilimitado',
        monthlyPrice: 'S/ 249',
        annualPrice: 'S/ 199',
        features: [
          { text: 'Paseos ilimitados', included: true },
          { text: 'Recomendaciones premium de IA', included: true },
          { text: 'Seguimiento en tiempo real + fotos y videos', included: true },
          { text: 'Paseador preferido garantizado', included: true },
          { text: 'Todas las rutas premium + nuevas primero', included: true }
        ],
        ctaText: 'Elegir plan',
        popular: false
      }
    ];
  }
  
  render() {
    this.element.innerHTML = `
      <div class="container">
        <h2>${this.title}</h2>
        <p class="section-subtitle">${this.subtitle}</p>
        
        <div class="pricing-switch">
          <span>Mensual</span>
          <label class="switch">
            <input type="checkbox" id="pricingToggle" ${this.state.showAnnual ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
          <span>Anual <span class="discount-badge">${this.annualDiscount}</span></span>
        </div>
        
        <div class="pricing-cards">
          ${this.plans.map(plan => `
            <div class="pricing-card ${plan.popular ? 'popular' : ''} ${plan.id}">
              ${plan.popular ? `<div class="popular-badge">MÁS POPULAR</div>` : ''}
              <div class="pricing-header">
                <h3>${plan.title}</h3>
                <div class="price">
                  <span class="monthly-price" style="${this.state.showAnnual ? 'display: none;' : ''}">${plan.monthlyPrice}<span>/mes</span></span>
                  <span class="annual-price" style="${this.state.showAnnual ? '' : 'display: none;'}">${plan.annualPrice}<span>/mes</span></span>
                </div>
              </div>
              <ul class="features-list">
                ${plan.features.map(feature => `
                  <li><i class="fas fa-${feature.included ? 'check' : 'times'}"></i> ${feature.text}</li>
                `).join('')}
              </ul>
              <a href="${plan.ctaLink || '#'}" class="btn ${plan.popular ? 'btn-primary' : 'btn-outline'}" data-plan-id="${plan.id}">${plan.ctaText}</a>
            </div>
          `).join('')}
        </div>
        
        <div class="custom-plan">
          <p>${this.customPlanText}</p>
          <a href="${this.customPlanLink}" class="btn btn-secondary">${this.customPlanCta}</a>
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    // Evento para alternar entre precios mensuales y anuales
    const pricingToggle = this.element.querySelector('#pricingToggle');
    
    if (pricingToggle) {
      pricingToggle.addEventListener('change', (e) => {
        this.togglePricing(e.target.checked);
      });
    }
    
    // Eventos para los botones de selección de plan
    const planButtons = this.element.querySelectorAll('.pricing-card .btn');
    
    planButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Si hay un callback de selección de plan, ejecutarlo
        if (this.onPlanSelect) {
          const planId = btn.getAttribute('data-plan-id');
          const plan = this.plans.find(p => p.id === planId);
          
          if (plan) {
            e.preventDefault(); // Prevenir navegación si hay un handler
            this.onPlanSelect(plan, this.state.showAnnual);
          }
        }
      });
    });
    
    // Animación al hacer hover en las tarjetas
    const cards = this.element.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Destacar solo la tarjeta actual
        cards.forEach(c => {
          if (c !== card) c.classList.add('fade');
        });
      });
      
      card.addEventListener('mouseleave', () => {
        // Restaurar todas las tarjetas
        cards.forEach(c => c.classList.remove('fade'));
      });
    });
  }
  
  togglePricing(showAnnual) {
    const monthlyPrices = this.element.querySelectorAll('.monthly-price');
    const annualPrices = this.element.querySelectorAll('.annual-price');
    
    monthlyPrices.forEach(el => {
      el.style.display = showAnnual ? 'none' : 'block';
    });
    
    annualPrices.forEach(el => {
      el.style.display = showAnnual ? 'block' : 'none';
    });
    
    // Actualizar estado
    this.setState({ showAnnual });
    
    // Si hay un callback para el cambio de precios, ejecutarlo
    if (this.onPricingToggle) {
      this.onPricingToggle(showAnnual);
    }
  }
  
  // Método público para cambiar programáticamente entre precios mensuales y anuales
  setAnnualPricing(showAnnual) {
    const pricingToggle = this.element.querySelector('#pricingToggle');
    
    if (pricingToggle) {
      pricingToggle.checked = showAnnual;
    }
    
    this.togglePricing(showAnnual);
  }
}