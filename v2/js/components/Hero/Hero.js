
import Component from '../Component.js';
export default class Hero extends Component {
  render() {
    this.element.innerHTML = `
      <div class="container">
        <div class="hero-content">
          <h1>Paseos personalizados para tu perro con <span>Inteligencia Artificial</span></h1>
          <p class="subtitle">La primera plataforma que adapta cada paseo a las necesidades únicas de tu mascota</p>
          <div class="cta-container">
            <a href="#demo" class="btn btn-primary btn-large">Reserva tu primer paseo GRATIS</a>
            <p class="cta-note">Sin tarjeta requerida - Cancela cuando quieras</p>
          </div>
          <div class="trust-badges">
            <div class="badge">
              <i class="fas fa-shield-alt"></i>
              <span>Pagos 100% seguros</span>
            </div>
            <div class="badge">
              <i class="fas fa-heart"></i>
              <span>+5,000 perros felices</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=800&q=80" alt="Perro feliz siendo paseado">
          <div class="ai-feature-tag">
            <div class="pulse-animation"></div>
            <span>Nuestra IA recomienda rutas ideales para tu perro</span>
          </div>
        </div>
      </div>
    `;
  }
}