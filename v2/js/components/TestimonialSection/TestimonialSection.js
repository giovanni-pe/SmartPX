import Component from '../Component.js';


export default class TestimonialSection extends Component {
  // Eliminamos el constructor y usamos init() para configurar el componente
  
  init() {
    // Inicializar propiedades desde options o usar valores por defecto
    this.title = this.options.title || 'Dueños felices, <span>perros felices</span>';
    this.subtitle = this.options.subtitle || 'Lo que dicen nuestros clientes sobre la experiencia Smart Pets Explore';
    this.testimonials = this.options.testimonials || this.getDefaultTestimonials();
    this.ctaText = this.options.ctaText || '¿Listo para que tu perro tenga la mejor experiencia de paseo?';
    this.ctaButtonText = this.options.ctaButtonText || 'Empieza gratis hoy';
    this.ctaLink = this.options.ctaLink || '#demo';
    
    // Opciones para la visualización de testimonios
    this.showNavigation = this.options.showNavigation !== false;
    this.autoScroll = this.options.autoScroll || false;
    this.autoScrollInterval = this.options.autoScrollInterval || 5000; // ms
    
    // Referencia al intervalo de auto-scroll (si está activo)
    this.autoScrollTimer = null;
    
    // Estado del slider
    this.state = {
      ...this.state,
      currentSlide: 0,
      isDragging: false
    };
  }
  
  getDefaultTestimonials() {
    return [
      {
        text: '"Desde que uso Smart Pets Explore, mi golden retriever Max está mucho más tranquilo en casa. Las rutas que recomienda la IA son perfectas para su energía."',
        rating: 5,
        author: {
          name: 'María G.',
          role: 'Dueña de Max',
          avatar: 'https://randomuser.me/api/portraits/women/43.jpg'
        }
      },
      {
        text: '"El paseador que nos asignaron es increíble con mi perro reactivo. La plataforma tuvo en cuenta sus necesidades especiales desde el primer día."',
        rating: 5,
        author: {
          name: 'Carlos R.',
          role: 'Dueño de Rocky',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        }
      },
      {
        text: '"La facturación automática me ahorra tanto tiempo! Y a mis 3 perros les encantan los diferentes paseadores que les asignan según su personalidad."',
        rating: 4.5,
        author: {
          name: 'Lucía T.',
          role: 'Dueña de Luna, Sol y Nube',
          avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
        }
      }
    ];
  }
  
  render() {
    // Verificar que tengamos testimonios para mostrar
    if (!this.testimonials || this.testimonials.length === 0) {
      console.warn('No hay testimonios para mostrar en TestimonialSection');
      this.testimonials = this.getDefaultTestimonials();
    }
    
    // Construir la navegación si está habilitada
    const navigation = this.showNavigation ? `
      <div class="testimonials-navigation">
        <button class="nav-button prev-button" aria-label="Testimonio anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="nav-dots">
          ${this.testimonials.map((_, index) => `
            <span class="nav-dot ${index === this.state.currentSlide ? 'active' : ''}" data-index="${index}"></span>
          `).join('')}
        </div>
        <button class="nav-button next-button" aria-label="Testimonio siguiente">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    ` : '';
    
    this.element.innerHTML = `
      <div class="container">
        <h2>${this.title}</h2>
        <p class="section-subtitle">${this.subtitle}</p>
        
        <div class="testimonials-container">
          <div class="testimonials-slider">
            ${this.testimonials.map((testimonial, index) => `
              <div class="testimonial-card ${index === this.state.currentSlide ? 'active' : ''}" data-index="${index}">
                <div class="testimonial-rating">
                  ${this.renderRatingStars(testimonial.rating)}
                </div>
                <p class="testimonial-text">${testimonial.text}</p>
                <div class="testimonial-author">
                  <img src="${testimonial.author.avatar}" alt="${testimonial.author.name}" 
                       onerror="this.onerror=null;this.src='https://randomuser.me/api/portraits/lego/0.jpg';">
                  <div class="author-info">
                    <h4>${testimonial.author.name}</h4>
                    <p>${testimonial.author.role}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          ${navigation}
        </div>
        
        <div class="testimonials-cta">
          <p>${this.ctaText}</p>
          <a href="${this.ctaLink}" class="btn btn-primary">${this.ctaButtonText}</a>
        </div>
      </div>
    `;
  }
  
  renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Media estrella
    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
  }
  
  bindEvents() {
    // Configurar el slider táctil
    this.setupTouchSlider();
    
    // Configurar navegación si está habilitada
    if (this.showNavigation) {
      // Botones de navegación
      const prevButton = this.element.querySelector('.prev-button');
      const nextButton = this.element.querySelector('.next-button');
      
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          this.prevSlide();
        });
      }
      
      if (nextButton) {
        nextButton.addEventListener('click', () => {
          this.nextSlide();
        });
      }
      
      // Navegación por puntos
      const dots = this.element.querySelectorAll('.nav-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-index'));
          this.goToSlide(index);
        });
      });
    }
    
    // Configurar auto-scroll si está habilitado
    if (this.autoScroll) {
      this.startAutoScroll();
      
      // Pausar cuando el mouse está sobre el slider
      const sliderContainer = this.element.querySelector('.testimonials-container');
      if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
          this.pauseAutoScroll();
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
          this.startAutoScroll();
        });
      }
    }
  }
  
  setupTouchSlider() {
    const slider = this.element.querySelector('.testimonials-slider');
    
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let startTime;
    let endTime;
    
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      this.state.isDragging = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      startTime = new Date().getTime();
    });
    
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      this.state.isDragging = false;
      slider.classList.remove('active');
    });
    
    slider.addEventListener('mouseup', (e) => {
      isDown = false;
      slider.classList.remove('active');
      endTime = new Date().getTime();
      
      // Detectar si fue un clic o un arrastre basado en tiempo y distancia
      const timeDiff = endTime - startTime;
      const finalX = e.pageX - slider.offsetLeft;
      const distance = Math.abs(finalX - startX);
      
      if (distance < 10 && timeDiff < 200) {
        // Fue un clic, no hacer nada
      } else {
        // Fue un arrastre, determinar dirección
        if (finalX < startX) {
          this.nextSlide();
        } else if (finalX > startX) {
          this.prevSlide();
        }
      }
      
      this.state.isDragging = false;
    });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Velocidad de scroll
      slider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events para móviles
    slider.addEventListener('touchstart', (e) => {
      isDown = true;
      this.state.isDragging = true;
      slider.classList.add('active');
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      startTime = new Date().getTime();
    });
    
    slider.addEventListener('touchend', (e) => {
      isDown = false;
      slider.classList.remove('active');
      endTime = new Date().getTime();
      
      // Detectar swipe
      const timeDiff = endTime - startTime;
      const finalX = e.changedTouches[0].pageX - slider.offsetLeft;
      const distance = Math.abs(finalX - startX);
      
      if (distance > 50 && timeDiff < 300) {
        // Fue un swipe
        if (finalX < startX) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      this.state.isDragging = false;
    });
    
    slider.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  }
  
  // Métodos para navegación de slides
  nextSlide() {
    const totalSlides = this.testimonials.length;
    const newIndex = (this.state.currentSlide + 1) % totalSlides;
    this.goToSlide(newIndex);
  }
  
  prevSlide() {
    const totalSlides = this.testimonials.length;
    const newIndex = (this.state.currentSlide - 1 + totalSlides) % totalSlides;
    this.goToSlide(newIndex);
  }
  
  goToSlide(index) {
    // Validar el índice
    if (index < 0 || index >= this.testimonials.length) return;
    
    // Actualizar estado
    this.setState({ currentSlide: index });
    
    // Actualizar UI
    const cards = this.element.querySelectorAll('.testimonial-card');
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    // Actualizar dots de navegación
    const dots = this.element.querySelectorAll('.nav-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Hacer scroll al testimonial seleccionado
    const slider = this.element.querySelector('.testimonials-slider');
    if (slider) {
      const activeCard = this.element.querySelector(`.testimonial-card[data-index="${index}"]`);
      if (activeCard) {
        slider.scrollLeft = activeCard.offsetLeft - (slider.offsetWidth / 2) + (activeCard.offsetWidth / 2);
      }
    }
  }
  
  // Métodos para auto-scroll
  startAutoScroll() {
    if (this.autoScrollTimer) return;
    
    this.autoScrollTimer = setInterval(() => {
      if (!this.state.isDragging) {
        this.nextSlide();
      }
    }, this.autoScrollInterval);
  }
  
  pauseAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }
  
  // Limpiar recursos al finalizar
  dispose() {
    // Detener el auto-scroll si está activo
    this.pauseAutoScroll();
    
    // Eliminar eventos si es necesario
    // (en este caso no hace falta porque usamos bind y el GC se encargará)
  }
}