import Component from '../Component.js';


export default class PetAdoptionSection extends Component {
  // Eliminamos el constructor y usamos init()
  init() {
    // Inicializamos el estado aquí en lugar de en el constructor
    this.state = {
      pets: this.options.pets || this.getDummyPets(),
      loading: false,
      filter: {
        type: 'all',
        size: 'all',
        age: 'all'
      },
      selectedPet: null,
      modalOpen: false
    };
    
    // Opciones adicionales
    this.title = this.options.title || 'Encuentra tu <span>compañero ideal</span>';
    this.subtitle = this.options.subtitle || 'Estos amigos peludos buscan un hogar lleno de amor';
    this.volunteerEnabled = this.options.volunteerEnabled !== false;
    this.donateEnabled = this.options.donateEnabled !== false;
    
    // Callbacks
    this.onPetSelect = this.options.onPetSelect || null;
    this.onFilterChange = this.options.onFilterChange || null;
  }
  
  render() {
    this.element.innerHTML = `
      <div class="container">
        <h2>${this.title}</h2>
        <p class="section-subtitle">${this.subtitle}</p>
        
        <div class="adoption-filters">
          <div class="filter-group">
            <label>Tipo de mascota</label>
            <select class="filter-select" data-filter="type">
              <option value="all">Todos</option>
              <option value="dog" ${this.state.filter.type === 'dog' ? 'selected' : ''}>Perros</option>
              <option value="cat" ${this.state.filter.type === 'cat' ? 'selected' : ''}>Gatos</option>
              <option value="other" ${this.state.filter.type === 'other' ? 'selected' : ''}>Otros</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Tamaño</label>
            <select class="filter-select" data-filter="size">
              <option value="all">Todos</option>
              <option value="small" ${this.state.filter.size === 'small' ? 'selected' : ''}>Pequeño</option>
              <option value="medium" ${this.state.filter.size === 'medium' ? 'selected' : ''}>Mediano</option>
              <option value="large" ${this.state.filter.size === 'large' ? 'selected' : ''}>Grande</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Edad</label>
            <select class="filter-select" data-filter="age">
              <option value="all">Todas</option>
              <option value="puppy" ${this.state.filter.age === 'puppy' ? 'selected' : ''}>Cachorro</option>
              <option value="young" ${this.state.filter.age === 'young' ? 'selected' : ''}>Joven</option>
              <option value="adult" ${this.state.filter.age === 'adult' ? 'selected' : ''}>Adulto</option>
              <option value="senior" ${this.state.filter.age === 'senior' ? 'selected' : ''}>Senior</option>
            </select>
          </div>
        </div>
        
        <div class="pets-grid">
          ${this.state.loading ? 
            '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>' : 
            this.renderPets()
          }
        </div>
        
        <div class="adoption-cta">
          <p>¿Quieres ayudar pero no puedes adoptar?</p>
          <div class="cta-buttons">
            ${this.volunteerEnabled ? 
              '<a href="#volunteer" class="btn btn-outline">Voluntariado</a>' : ''}
            ${this.donateEnabled ? 
              '<a href="#donate" class="btn btn-primary">Donar</a>' : ''}
          </div>
        </div>
      </div>
      
      <!-- Modal para detalles de mascota -->
      <div id="pet-details-modal" class="pet-modal ${this.state.modalOpen ? 'active' : ''}">
        <div class="pet-modal-content">
          <span class="close-modal">&times;</span>
          <div class="pet-modal-body">
            ${this.renderPetDetails()}
          </div>
        </div>
      </div>
    `;
  }
  
  renderPets() {
    const filteredPets = this.filterPets();
    
    if (filteredPets.length === 0) {
      return `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>No se encontraron mascotas con los filtros seleccionados</p>
          <button class="btn btn-outline reset-filters">Restablecer filtros</button>
        </div>
      `;
    }
    
    return filteredPets.map(pet => `
      <div class="pet-card" data-id="${pet.id}">
        <div class="pet-image">
          <img src="${pet.image}" alt="${pet.name}" loading="lazy">
          ${pet.urgent ? '<div class="urgent-badge">Urgente</div>' : ''}
        </div>
        <div class="pet-info">
          <h3>${pet.name}</h3>
          <div class="pet-tags">
            <span class="pet-tag">${this.getPetTypeLabel(pet.type)}</span>
            <span class="pet-tag">${this.getPetSizeLabel(pet.size)}</span>
            <span class="pet-tag">${this.getPetAgeLabel(pet.age)}</span>
          </div>
          <p class="pet-description">${pet.description}</p>
          <button class="btn btn-primary pet-details-btn">Ver detalles</button>
        </div>
      </div>
    `).join('');
  }
  
  renderPetDetails() {
    const pet = this.state.selectedPet;
    if (!pet) return '';
    
    return `
      <div class="pet-detail-content">
        <div class="pet-detail-image">
          <img src="${pet.image}" alt="${pet.name}">
          ${pet.urgent ? '<div class="urgent-badge large">Urgente</div>' : ''}
        </div>
        <div class="pet-detail-info">
          <h2>${pet.name}</h2>
          <div class="pet-info-grid">
            <div class="pet-info-item">
              <strong>Tipo:</strong>
              <span>${this.getPetTypeLabel(pet.type)}</span>
            </div>
            <div class="pet-info-item">
              <strong>Raza:</strong>
              <span>${pet.breed}</span>
            </div>
            <div class="pet-info-item">
              <strong>Tamaño:</strong>
              <span>${this.getPetSizeLabel(pet.size)}</span>
            </div>
            <div class="pet-info-item">
              <strong>Edad:</strong>
              <span>${this.getPetAgeLabel(pet.age)}</span>
            </div>
          </div>
          <div class="pet-description-full">
            <h3>Sobre ${pet.name}</h3>
            <p>${pet.description}</p>
            ${pet.additionalInfo ? `<p>${pet.additionalInfo}</p>` : ''}
          </div>
          <div class="pet-adoption-action">
            <button class="btn btn-primary adopt-btn" data-id="${pet.id}">Quiero adoptar</button>
            <button class="btn btn-outline sponsor-btn" data-id="${pet.id}">Apadrinar</button>
          </div>
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    // Filtros de mascotas
    const filterSelects = this.element.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', () => {
        const filterType = select.getAttribute('data-filter');
        this.applyFilter(filterType, select.value);
      });
    });
    
    // Botón para restablecer filtros
    const resetButton = this.element.querySelector('.reset-filters');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.resetFilters();
      });
    }
    
    // Delegación de eventos para botones de detalles de mascota
    this.element.addEventListener('click', (e) => {
      // Botón de ver detalles
      if (e.target.classList.contains('pet-details-btn')) {
        const petCard = e.target.closest('.pet-card');
        if (petCard) {
          const petId = petCard.getAttribute('data-id');
          this.openPetDetails(petId);
        }
      }
      
      // Botón de adopción en el modal
      if (e.target.classList.contains('adopt-btn')) {
        const petId = e.target.getAttribute('data-id');
        this.adoptPet(petId);
      }
      
      // Botón de apadrinamiento en el modal
      if (e.target.classList.contains('sponsor-btn')) {
        const petId = e.target.getAttribute('data-id');
        this.sponsorPet(petId);
      }
      
      // Cerrar modal
      if (e.target.classList.contains('close-modal') || 
          (e.target.classList.contains('pet-modal') && this.state.modalOpen)) {
        this.closeModal();
      }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.modalOpen) {
        this.closeModal();
      }
    });
  }
  
  applyFilter(filterType, value) {
    this.setState({
      loading: true,
      filter: {
        ...this.state.filter,
        [filterType]: value
      }
    });
    
    // Simular carga con un pequeño retraso para mejor UX
    setTimeout(() => {
      this.setState({ loading: false });
      
      // Llamar al callback si existe
      if (this.onFilterChange) {
        this.onFilterChange(this.state.filter);
      }
    }, 300);
  }
  
  resetFilters() {
    this.setState({
      loading: true,
      filter: {
        type: 'all',
        size: 'all',
        age: 'all'
      }
    });
    
    // Simular carga con un pequeño retraso para mejor UX
    setTimeout(() => {
      this.setState({ loading: false });
    }, 300);
  }
  
  filterPets() {
    return this.state.pets.filter(pet => {
      const typeMatch = this.state.filter.type === 'all' || pet.type === this.state.filter.type;
      const sizeMatch = this.state.filter.size === 'all' || pet.size === this.state.filter.size;
      const ageMatch = this.state.filter.age === 'all' || pet.age === this.state.filter.age;
      
      return typeMatch && sizeMatch && ageMatch;
    });
  }
  
  openPetDetails(petId) {
    const pet = this.state.pets.find(p => p.id === petId);
    if (!pet) return;
    
    this.setState({
      selectedPet: pet,
      modalOpen: true
    });
    
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.setState({
      modalOpen: false
    });
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }
  
  adoptPet(petId) {
    const pet = this.state.pets.find(p => p.id === petId);
    if (!pet) return;
    
    // Aquí iría la lógica para iniciar el proceso de adopción
    // Por ahora, solo mostramos un mensaje
    alert(`¡Genial! Has iniciado el proceso de adopción para ${pet.name}. Te contactaremos pronto.`);
    
    // Llamar al callback si existe
    if (this.onPetSelect) {
      this.onPetSelect(pet, 'adopt');
    }
    
    this.closeModal();
  }
  
  sponsorPet(petId) {
    const pet = this.state.pets.find(p => p.id === petId);
    if (!pet) return;
    
    // Aquí iría la lógica para iniciar el proceso de apadrinamiento
    // Por ahora, solo mostramos un mensaje
    alert(`¡Gracias! Has decidido apadrinar a ${pet.name}. Te mostraremos las opciones de apadrinamiento.`);
    
    // Llamar al callback si existe
    if (this.onPetSelect) {
      this.onPetSelect(pet, 'sponsor');
    }
    
    this.closeModal();
  }
  
  getPetTypeLabel(type) {
    const types = {
      dog: 'Perro',
      cat: 'Gato',
      other: 'Otro'
    };
    return types[type] || 'Desconocido';
  }
  
  getPetSizeLabel(size) {
    const sizes = {
      small: 'Pequeño',
      medium: 'Mediano',
      large: 'Grande'
    };
    return sizes[size] || 'Desconocido';
  }
  
  getPetAgeLabel(age) {
    const ages = {
      puppy: 'Cachorro',
      young: 'Joven',
      adult: 'Adulto',
      senior: 'Senior'
    };
    return ages[age] || 'Desconocido';
  }
  
  getDummyPets() {
    return [
      {
        id: '1',
        name: 'Max',
        type: 'dog',
        breed: 'Mestizo',
        size: 'medium',
        age: 'young',
        description: 'Max es un perro muy cariñoso y juguetón que busca una familia activa.',
        additionalInfo: 'Está vacunado, desparasitado y esterilizado. Se lleva bien con otros perros y con niños.',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        urgent: false
      },
      {
        id: '2',
        name: 'Luna',
        type: 'cat',
        breed: 'Siamés',
        size: 'small',
        age: 'adult',
        description: 'Luna es una gata tranquila y elegante que disfruta de la tranquilidad.',
        additionalInfo: 'Está vacunada, desparasitada y esterilizada. Prefiere hogares tranquilos sin otros animales.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        urgent: true
      },
      {
        id: '3',
        name: 'Rocky',
        type: 'dog',
        breed: 'Labrador',
        size: 'large',
        age: 'puppy',
        description: 'Rocky es un cachorro muy energético que necesita espacio para correr.',
        additionalInfo: 'Está vacunado y desparasitado. Necesita una familia activa que pueda darle el ejercicio que necesita.',
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        urgent: false
      },
      {
        id: '4',
        name: 'Mia',
        type: 'cat',
        breed: 'Mestizo',
        size: 'small',
        age: 'senior',
        description: 'Mia es una gatita senior muy dulce que busca un hogar tranquilo.',
        additionalInfo: 'Está vacunada, desparasitada y esterilizada. Es muy tranquila y cariñosa, ideal para personas mayores.',
        image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        urgent: true
      }
    ];
  }
}