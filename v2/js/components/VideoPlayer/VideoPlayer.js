import Component from '../Component.js';


export default class VideoPlayer extends Component {
  constructor(selector, options = {}) {
    super(selector, options);
    
    this.thumbnail = options.thumbnail || '';
    this.videoUrl = options.videoUrl || '';
    this.title = options.title || 'Video';
    this.isPlaying = false;
  }
  
  render() {
    // No reemplazamos todo el HTML para evitar problemas con la imagen existente
    const element = this.element;
    
    // Asegurar que el elemento tenga la clase correcta
    element.classList.add('video-placeholder');
    
    // Mantener la estructura actual, solo asegurar que el ícono de play esté presente
    const playIcon = element.querySelector('.fa-play');
    if (!playIcon) {
      const icon = document.createElement('i');
      icon.className = 'fas fa-play';
      element.appendChild(icon);
    }
    
    // Si hay una imagen en las opciones pero no hay en el DOM, añadirla
    if (this.thumbnail && !element.querySelector('img')) {
      const img = document.createElement('img');
      img.src = this.thumbnail;
      img.alt = this.title;
      element.appendChild(img);
    }
  }
  
  bindEvents() {
    this.element.addEventListener('click', () => {
      this.playVideo();
    });
  }
  
  playVideo() {
    if (this.isPlaying) return;
    
    // Crear modal de video
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    
    videoModal.innerHTML = `
      <div class="video-modal-content">
        <span class="close-video">&times;</span>
        <iframe 
          src="${this.videoUrl}?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `;
    
    document.body.appendChild(videoModal);
    document.body.style.overflow = 'hidden'; // Evitar scroll del body
    
    // Evento de cierre
    const closeBtn = videoModal.querySelector('.close-video');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(videoModal);
      document.body.style.overflow = ''; // Restaurar scroll
      this.isPlaying = false;
    });
    
    // Cerrar al hacer clic fuera del video
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        document.body.removeChild(videoModal);
        document.body.style.overflow = '';
        this.isPlaying = false;
      }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.contains(videoModal)) {
        document.body.removeChild(videoModal);
        document.body.style.overflow = '';
        this.isPlaying = false;
      }
    });
    
    this.isPlaying = true;
  }
}