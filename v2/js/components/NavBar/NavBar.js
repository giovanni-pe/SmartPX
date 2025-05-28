import Component from '../Component.js';

export default class NavBar extends Component {
  constructor(selector, options = {}) {
    super(selector, options);
    
    this.state = {
      isMenuOpen: false
    };
  }
  
  render() {
    if (!this.element.innerHTML) {
      this.element.innerHTML = `
        <div class="container">
          <nav class="navbar">
            <div class="logo">
              <i class="fas fa-paw"></i>
              <span>Smart Pets Xplore</span>
            </div>
            <ul class="nav-links ${this.state.isMenuOpen ? 'active' : ''}">
              <li><a href="#features">Beneficios</a></li>
              <li><a href="#how-it-works">Cómo funciona</a></li>
              <li><a href="#pricing">Planes</a></li>
              <li><a href="#testimonials">Testimonios</a></li>
              <li><a href="#contact">Contacto</a></li>
            </ul>
            <div class="cta-buttons">
              <a href="#pricing" class="btn btn-outline">Suscribirse</a>
              <a href="#demo" class="btn btn-primary">Prueba Gratis</a>
            </div>
            <div class="mobile-menu-btn">
              <i class="fas fa-${this.state.isMenuOpen ? 'times' : 'bars'}"></i>
            </div>
          </nav>
        </div>
      `;
    } else {
      // Solo actualiza el estado del menú
      const navLinks = this.element.querySelector('.nav-links');
      if (navLinks) {
        navLinks.classList.toggle('active', this.state.isMenuOpen);
      }
      
      const menuIcon = this.element.querySelector('.mobile-menu-btn i');
      if (menuIcon) {
        menuIcon.className = `fas fa-${this.state.isMenuOpen ? 'times' : 'bars'}`;
      }
    }
  }
  
  bindEvents() {
    const menuBtn = this.element.querySelector('.mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
      });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = this.element.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.setState({ isMenuOpen: false });
      });
    });
  }
}


