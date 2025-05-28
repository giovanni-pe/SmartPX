import Component from '../Component.js';


export default class MobileNavBar extends Component {
  // Reemplazamos el constructor por init()
  init() {
    // Inicializar opciones del componente
    this.links = this.options.links || [
      { icon: 'home', label: 'Inicio', url: '#' },
      { icon: 'search', label: 'Buscar', url: '#search' },
      { icon: 'paw', label: 'Paseos', url: '#pricing' },
      { icon: 'heart', label: 'Adoptar', url: '#adoption' },
      { icon: 'user', label: 'Perfil', url: '#profile' }
    ];
    
    // Opciones adicionales
    this.activeIndex = this.options.activeIndex || 0;
    this.useActiveClass = this.options.useActiveClass !== false;
    this.showLabels = this.options.showLabels !== false;
    this.fixed = this.options.fixed !== false;
    this.onNavItemClick = this.options.onNavItemClick || null;
    
    // Determinar la página actual para destacar el link correspondiente
    this.detectActivePage();
  }
  
  render() {
    // Añadir clases de posicionamiento
    if (this.fixed) {
      this.element.classList.add('fixed');
    }
    
    this.element.innerHTML = `
      <nav class="mobile-navbar${this.showLabels ? '' : ' icons-only'}">
        ${this.links.map((link, index) => `
          <a href="${link.url}" class="nav-item${index === this.activeIndex ? ' active' : ''}" data-index="${index}">
            <i class="${link.iconClass || 'fas fa-' + link.icon}"></i>
            ${this.showLabels ? `<span>${link.label}</span>` : ''}
          </a>
        `).join('')}
      </nav>
    `;
  }
  
  bindEvents() {
    const navItems = this.element.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Activar el elemento clickeado
        if (this.useActiveClass) {
          navItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        }
        
        // Actualizar índice activo
        const index = parseInt(item.getAttribute('data-index'));
        this.activeIndex = index;
        
        // Ejecutar callback si existe
        if (this.onNavItemClick) {
          const link = this.links[index];
          
          // Si el callback devuelve false, prevenir la navegación
          if (this.onNavItemClick(e, link, index) === false) {
            e.preventDefault();
          }
        }
      });
    });
    
    // Escuchar cambios de hash para actualizar estado activo
    window.addEventListener('hashchange', () => {
      if (this.useActiveClass) {
        this.detectActivePage();
        this.updateActiveItem();
      }
    });
  }
  
  // Método para detectar qué página está activa basado en la URL
  detectActivePage() {
    const hash = window.location.hash || '#';
    
    // Encontrar el link que coincide con el hash actual
    const matchingIndex = this.links.findIndex(link => 
      link.url === hash || 
      (link.url.includes('#') && hash.includes(link.url.split('#')[1]))
    );
    
    if (matchingIndex !== -1) {
      this.activeIndex = matchingIndex;
    }
  }
  
  // Método para actualizar visualmente el item activo
  updateActiveItem() {
    const navItems = this.element.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
      if (index === this.activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  // Método público para establecer el item activo
  setActiveItem(index) {
    if (index >= 0 && index < this.links.length) {
      this.activeIndex = index;
      this.updateActiveItem();
    }
  }
  
  // Método público para agregar una notificación a un item
  addNotification(index, count = null) {
    if (index >= 0 && index < this.links.length) {
      const navItem = this.element.querySelector(`.nav-item[data-index="${index}"]`);
      
      if (navItem) {
        let notification = navItem.querySelector('.notification-badge');
        
        if (!notification) {
          notification = document.createElement('span');
          notification.className = 'notification-badge';
          navItem.appendChild(notification);
        }
        
        // Si se proporciona un contador, mostrarlo
        if (count !== null && count > 0) {
          notification.textContent = count > 99 ? '99+' : count;
          notification.classList.add('with-count');
        } else {
          notification.textContent = '';
          notification.classList.remove('with-count');
        }
        
        notification.style.display = 'block';
      }
    }
  }
  
  // Método público para eliminar una notificación
  removeNotification(index) {
    if (index >= 0 && index < this.links.length) {
      const navItem = this.element.querySelector(`.nav-item[data-index="${index}"]`);
      
      if (navItem) {
        const notification = navItem.querySelector('.notification-badge');
        
        if (notification) {
          notification.style.display = 'none';
        }
      }
    }
  }
}