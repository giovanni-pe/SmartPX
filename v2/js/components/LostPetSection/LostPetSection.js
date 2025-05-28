import Component from '../Component.js';


export default class LostPetSection extends Component {
  constructor(selector, options = {}) {
    super(selector, options);
    
    this.state = {
      pets: options.pets || this.getDummyLostPets(),
      view: 'list', // 'list' o 'form'
      loading: false
    };
  }
  
  render() {
    this.element.innerHTML = `
      <div class="container">
        <h2>Mascotas <span>perdidas y encontradas</span></h2>
        <p class="section-subtitle">Ayudemos a reunir estas mascotas con sus familias</p>
        
        <div class="section-tabs">
          <button class="tab-btn ${this.state.view === 'list' ? 'active' : ''}" data-view="list">
            <i class="fas fa-list"></i> Ver mascotas perdidas
          </button>
          <button class="tab-btn ${this.state.view === 'form' ? 'active' : ''}" data-view="form">
            <i class="fas fa-plus"></i> Reportar mascota
          </button>
        </div>
        
        <div class="section-content">
          ${this.state.view === 'list' ? this.renderLostPetsList() : this.renderReportForm()}
        </div>
      </div>
    `;
  }
  
  renderLostPetsList() {
    if (this.state.loading) {
      return '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    }
    
    if (this.state.pets.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <p>No hay mascotas perdidas registradas en este momento</p>
          <button class="btn btn-primary" data-view="form">Reportar mascota perdida</button>
        </div>
      `;
    }
    
    return `
      <div class="lost-pets-grid">
        ${this.state.pets.map(pet => `
          <div class="lost-pet-card" data-id="${pet.id}">
            <div class="pet-image">
              <img src="${pet.image}" alt="${pet.name}">
              <div class="status-badge ${pet.status === 'lost' ? 'lost' : 'found'}">${pet.status === 'lost' ? 'Perdido' : 'Encontrado'}</div>
              <div class="date-badge">${pet.date}</div>
            </div>
            <div class="pet-info">
              <h3>${pet.name}</h3>
              <p class="pet-location"><i class="fas fa-map-marker-alt"></i> ${pet.location}</p>
              <p class="pet-description">${pet.description}</p>
              <div class="pet-contact">
                <button class="btn btn-primary contact-btn">Contactar</button>
                <button class="btn btn-outline share-btn"><i class="fas fa-share-alt"></i></button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  renderReportForm() {
    return `
      <div class="report-form-container">
        <div class="report-options">
          <div class="report-option-card ${this.state.reportType === 'lost' ? 'active' : ''}" data-type="lost">
            <i class="fas fa-search"></i>
            <h3>Mi mascota se perdió</h3>
            <p>Reporta a tu mascota para que la comunidad te ayude a encontrarla</p>
          </div>
          <div class="report-option-card ${this.state.reportType === 'found' ? 'active' : ''}" data-type="found">
            <i class="fas fa-paw"></i>
            <h3>Encontré una mascota</h3>
            <p>Ayuda a esta mascota a reencontrarse con su familia</p>
          </div>
        </div>
        
        <form id="reportPetForm" class="report-pet-form">
          <div class="form-group">
            <label for="pet-name">Nombre de la mascota ${this.state.reportType === 'found' ? '(si lo conoces)' : ''}</label>
            <input type="text" id="pet-name" name="name" ${this.state.reportType === 'lost' ? 'required' : ''}>
          </div>
          
          <div class="form-group">
            <label for="pet-type">Tipo de mascota</label>
            <select id="pet-type" name="type" required>
              <option value="">Selecciona</option>
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
              <option value="other">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="pet-description">Descripción</label>
            <textarea id="pet-description" name="description" rows="4" required placeholder="Color, tamaño, características distintivas, etc."></textarea>
          </div>
          
          <div class="form-group">
            <label for="pet-location">Lugar donde se ${this.state.reportType === 'lost' ? 'perdió' : 'encontró'}</label>
            <input type="text" id="pet-location" name="location" required>
          </div>
          
          <div class="form-group">
            <label for="pet-date">Fecha</label>
            <input type="date" id="pet-date" name="date" required>
          </div>
          
          <div class="form-group">
            <label for="pet-image">Foto</label>
            <input type="file" id="pet-image" name="image" accept="image/*">
            <p class="field-note">Una foto clara ayudará a identificar a la mascota</p>
          </div>
          
          <div class="form-group">
            <label for="contact-name">Tu nombre</label>
            <input type="text" id="contact-name" name="contactName" required>
          </div>
          
          <div class="form-group">
            <label for="contact-phone">Teléfono de contacto</label>
            <input type="tel" id="contact-phone" name="contactPhone" required>
          </div>
          
          <div class="form-group">
            <label for="contact-email">Correo electrónico</label>
            <input type="email" id="contact-email" name="contactEmail" required>
          </div>
          
          <div class="form-group checkbox-group">
            <input type="checkbox" id="terms-agreement" name="termsAgreement" required>
            <label for="terms-agreement">Acepto los términos y condiciones de publicación</label>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-outline cancel-btn" data-view="list">Cancelar</button>
            <button type="submit" class="btn btn-primary">Publicar</button>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    // Cambio de vista
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn') || e.target.getAttribute('data-view')) {
        const view = e.target.getAttribute('data-view');
        if (view) {
          this.setState({ view });
        }
      }
    });
    
    // Selección de tipo de reporte (perdido/encontrado)
    this.element.addEventListener('click', (e) => {
      const reportOption = e.target.closest('.report-option-card');
      if (reportOption) {
        const reportType = reportOption.getAttribute('data-type');
        this.setState({ reportType });
      }
    });
    
    // Envío del formulario
    this.element.addEventListener('submit', (e) => {
      if (e.target.id === 'reportPetForm') {
        e.preventDefault();
        this.handleFormSubmit(e.target);
      }
    });
    
    // Contactar al dueño
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('contact-btn')) {
        const petCard = e.target.closest('.lost-pet-card');
        if (petCard) {
          const petId = petCard.getAttribute('data-id');
          this.handleContact(petId);
        }
      }
    });
    
    // Compartir
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('share-btn')) {
        const petCard = e.target.closest('.lost-pet-card');
        if (petCard) {
          const petId = petCard.getAttribute('data-id');
          this.handleShare(petId);
        }
      }
    });
  }
  
  handleFormSubmit(form) {
    const formData = new FormData(form);
    const petData = {};
    
    formData.forEach((value, key) => {
      petData[key] = value;
    });
    
    // Simulamos el envío al servidor
    this.setState({ loading: true });
    
    setTimeout(() => {
      alert('¡Gracias por tu reporte! Ha sido publicado correctamente.');
      form.reset();
      this.setState({ 
        loading: false,
        view: 'list' 
      });
    }, 1500);
  }
  
  handleContact(petId) {
    const pet = this.state.pets.find(p => p.id === petId);
    if (!pet) return;
    
    // Aquí podríamos mostrar un modal con la información de contacto
    alert(`Contacta al ${pet.status === 'lost' ? 'dueño' : 'rescatista'} de ${pet.name}:\nTeléfono: ${pet.contactPhone}\nEmail: ${pet.contactEmail}`);
  }
  
  handleShare(petId) {
    const pet = this.state.pets.find(p => p.id === petId);
    if (!pet) return;
    
    // Aquí implementaríamos la funcionalidad de compartir
    // Por simplicidad, mostramos una alerta
    alert(`Compartiendo información de ${pet.name}...`);
  }
  
  getDummyLostPets() {
    return [
      {
        id: '1',
        name: 'Toby',
        type: 'dog',
        status: 'lost',
        description: 'Perro pequeño de color marrón, con collar azul. Responde al nombre de Toby.',
        location: 'Parque Kennedy, Miraflores',
        date: '15/05/2025',
        image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d',
        contactPhone: '+51 912 345 678',
        contactEmail: 'dueño@ejemplo.com'
      },
      {
        id: '2',
        name: 'Desconocido',
        type: 'cat',
        status: 'found',
        description: 'Gato blanco y negro, muy dócil. Encontrado sin collar ni identificación.',
        location: 'Av. Arequipa, Lince',
        date: '12/05/2025',
        image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13',
        contactPhone: '+51 987 654 321',
        contactEmail: 'rescatista@ejemplo.com'
      }
    ];
  }
}
