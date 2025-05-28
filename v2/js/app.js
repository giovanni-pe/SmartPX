import NavBar from './components/NavBar/NavBar.js';
import Hero from './components/Hero/Hero.js';
import FeatureSection from './components/FeatureSection/FeatureSection.js';
import StepsSection from './components/StepsSection/StepsSection.js';
import PricingSection from './components/PricingSection/PricingSection.js';
import TestimonialSection from './components/TestimonialSection/TestimonialSection.js';
import ContactSection from './components/ContactSection/ContactSection.js';
import FormWizard from './components/FormWizard/FormWizard.js';
import PetAdoptionSection from './components/PetAdoptionSection/PetAdoptionSection.js';
import LostPetSection from './components/LostPetSection/LostPetSection.js';
import MobileNavBar from './components/MobileNavBar/MobileNavBar.js';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton.js';
import VideoPlayer from './components/VideoPlayer/VideoPlayer.js';
import StatCounter from './components/StatCounter/StatCounter.js';
import NewsletterForm from './components/NewsletterForm/NewsletterForm.js';

class App {
  constructor() {
    // Estado global de la aplicación
    this.state = {
      user: null,
      isLoggedIn: false,
      theme: 'light'
    };
    
    // Contenedor para todos los componentes
    this.components = {};
    
    // Inicializar componentes cuando el DOM esté listo
    this.initComponents();
    this.initEventListeners();
  }
  
  initComponents() {
    // Componentes principales de UI
    this.components.navbar = new NavBar('#header', {
      onMenuToggle: this.handleMobileMenuToggle.bind(this)
    });
    
    this.components.hero = new Hero('#hero', {
      title: 'Paseos personalizados para tu perro con <span>Inteligencia Artificial</span>',
      subtitle: 'La primera plataforma que adapta cada paseo a las necesidades únicas de tu mascota',
      ctaText: 'Reserva tu primer paseo GRATIS',
      ctaLink: '#demo',
      ctaNote: 'Sin tarjeta requerida - Cancela cuando quieras',
      badges: [
        { icon: 'shield-alt', text: 'Pagos 100% seguros' },
        { icon: 'heart', text: '+5,000 perros felices' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Perro feliz siendo paseado',
      featureTag: 'Nuestra IA recomienda rutas ideales para tu perro'
    });
    
    this.components.features = new FeatureSection('#features', {
      title: 'La experiencia de paseo más <span>avanzada</span> para tu perro',
      subtitle: 'Nuestra tecnología hace que cada paseo sea perfecto para las necesidades de tu mascota',
      features: [
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
      ]
    });
    
    this.components.steps = new StepsSection('#steps-container', {
      steps: [
        {
          number: 1,
          title: 'Registra a tu perro',
          description: 'Cuéntanos sobre tu mascota: raza, tamaño, edad y nivel de energía.'
        },
        {
          number: 2,
          title: 'Recibe recomendaciones',
          description: 'Nuestra IA analizará los datos y sugerirá rutas y paseadores ideales.'
        },
        {
          number: 3,
          title: 'Reserva y disfruta',
          description: 'Elige fecha y hora, realiza el pago y prepárate para ver a tu perro feliz.'
        }
      ]
    });
    
    this.components.videoPlayer = new VideoPlayer('.video-placeholder', {
      thumbnail: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Video demostrativo de la plataforma'
    });
    
    this.components.pricing = new PricingSection('#pricing', {
      title: 'Planes que se adaptan a <span>tu ritmo</span>',
      subtitle: 'Elige la opción perfecta para las necesidades de tu mascota',
      annualDiscount: '25% de descuento',
      plans: [
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
      ],
      customPlanText: '¿Necesitas un plan personalizado para varios perros o necesidades especiales?',
      customPlanCta: 'Contáctanos para un plan a medida',
      customPlanLink: '#contact'
    });
    
    // Componente de formulario de demo
    this.components.demoForm = new FormWizard('#demoForm', {
      steps: [
        {
          fields: [
            { type: 'text', id: 'name', label: 'Tu nombre', placeholder: 'Ej: Juan Pérez', required: true },
            { type: 'email', id: 'email', label: 'Correo electrónico', placeholder: 'ejemplo@mail.com', required: true },
            { type: 'tel', id: 'phone', label: 'Teléfono (opcional)', placeholder: '+51 999 999 999' }
          ]
        },
        {
          fields: [
            { type: 'text', id: 'dog-name', label: 'Nombre de tu perro', placeholder: 'Ej: Toby', required: true },
            { type: 'text', id: 'dog-breed', label: 'Raza (o mezcla)', placeholder: 'Ej: Labrador, Criollo, etc.', required: true },
            { type: 'text', id: 'dog-age', label: 'Edad aproximada', placeholder: 'Ej: 3 años', required: true },
            { 
              type: 'select', 
              id: 'dog-energy', 
              label: 'Nivel de energía', 
              required: true,
              options: [
                { value: '', label: 'Selecciona' },
                { value: 'low', label: 'Bajo (paseos tranquilos)' },
                { value: 'medium', label: 'Medio (algo de ejercicio)' },
                { value: 'high', label: 'Alto (mucho ejercicio)' }
              ]
            }
          ]
        }
      ],
      onSubmit: this.handleDemoFormSubmit.bind(this)
    });
    
    // Componentes de testimonios
    this.components.testimonials = new TestimonialSection('#testimonials', {
      title: 'Dueños felices, <span>perros felices</span>',
      subtitle: 'Lo que dicen nuestros clientes sobre la experiencia Smart Pets Explore',
      testimonials: [
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
      ],
      ctaText: '¿Listo para que tu perro tenga la mejor experiencia de paseo?',
      ctaButtonText: 'Empieza gratis hoy',
      ctaLink: '#demo'
    });
    
    // Inicializar componente de estadísticas
    this.components.statCounter = new StatCounter('.stats .stat-number');
    
    // Componente de contacto
    this.components.contact = new ContactSection('#contact', {
      title: '¿Tienes <span>preguntas</span>?',
      subtitle: 'Estamos aquí para ayudarte a ti y a tu perro.',
      contactInfo: [
        { 
          icon: 'phone-alt', 
          title: 'Llámanos', 
          lines: [
            '+51 910 731 863',
            'Lunes a Viernes, 9am - 6pm'
          ]
        },
        { 
          icon: 'envelope', 
          title: 'Escríbenos', 
          lines: [
            'smartpetsxplore@gmail.com',
            'Respondemos en menos de 24 horas'
          ]
        },
        { 
          icon: 'map-marker-alt', 
          title: 'Visítanos', 
          lines: [
            'Av. Universitaria, Tingo María, Leoncio Prado, Huánuco, Perú'
          ]
        }
      ],
      socialLinks: [
        { icon: 'facebook-f', url: 'https://facebook.com/' },
        { icon: 'instagram', url: 'https://instagram.com/' },
        { icon: 'whatsapp', url: 'https://wa.me/51910731863' }
      ],
      formTitle: 'Envíanos un mensaje',
      formFields: [
        { id: 'contact-name', type: 'text', label: 'Nombre', required: true },
        { id: 'contact-email', type: 'email', label: 'Correo electrónico', required: true },
        { id: 'contact-subject', type: 'text', label: 'Asunto', required: true },
        { id: 'contact-message', type: 'textarea', label: 'Mensaje', rows: 4, required: true }
      ],
      submitButtonText: 'Enviar mensaje',
      onSubmit: this.handleContactFormSubmit.bind(this)
    });
    
    // Componentes de adopción y mascotas perdidas
    this.components.petAdoption = new PetAdoptionSection('#adoption');
    this.components.lostPets = new LostPetSection('#lost-pets');
    
    // Formulario de newsletter
    this.components.newsletterForm = new NewsletterForm('#newsletterForm', {
      onSubmit: this.handleNewsletterSubmit.bind(this)
    });
    
    // Componentes móviles
    this.components.mobileNavBar = new MobileNavBar('#mobile-navbar', {
      links: [
        { icon: 'home', label: 'Inicio', url: '#' },
        { icon: 'search', label: 'Buscar', url: '#features' },
        { icon: 'paw', label: 'Paseos', url: '#pricing' },
        { icon: 'heart', label: 'Adoptar', url: '#adoption' },
        { icon: 'user', label: 'Mi Perfil', url: '#profile' }
      ]
    });
    
    this.components.whatsAppButton = new WhatsAppButton('#whatsapp-button', {
      phoneNumber: '+51910731863',
      message: '¡Hola! Me interesa conocer más sobre SmartPx y sus servicios de paseo para perros.'
    });
  }
  
  initEventListeners() {
    // Escuchar evento de scroll para efectos en la navbar
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Inicialización del smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });
  }
  
  // Manejadores de eventos
  handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  handleResize() {
    // Ajustes responsivos adicionales si son necesarios
    const isMobile = window.innerWidth < 768;
    // Actualizar estado si es necesario
  }
  
  handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset para la navbar fija
        behavior: 'smooth'
      });
    }
  }
  
  handleMobileMenuToggle(isOpen) {
    // Manejar apertura/cierre del menú móvil
    console.log('Mobile menu is now', isOpen ? 'open' : 'closed');
  }
  
  async handleDemoFormSubmit(formData) {
    try {
      console.log('Procesando solicitud de demo:', formData);
      
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      this.components.demoForm.goToStep(3);
      
      // Actualizar datos en el mensaje de éxito
      const clientNameEl = document.querySelector('#clientName');
      const dogNameEl = document.querySelector('#dogName');
      
      if (clientNameEl) clientNameEl.textContent = formData.name || '';
      if (dogNameEl) dogNameEl.textContent = formData.dog_name || '';
    } catch (error) {
      console.error('Error al procesar solicitud de demo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo procesar tu solicitud. Por favor, intenta nuevamente.',
        confirmButtonColor: 'rgb(228, 168, 83)'
      });
    }
  }
  
  async handleContactFormSubmit(formData) {
    try {
      console.log('Enviando formulario de contacto:', formData);
      
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarnos. Te responderemos a la brevedad.',
        confirmButtonColor: 'rgb(228, 168, 83)'
      });
      
      // Resetear formulario
      document.getElementById('contactForm').reset();
    } catch (error) {
      console.error('Error al enviar formulario de contacto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo enviar tu mensaje. Por favor, intenta nuevamente.',
        confirmButtonColor: 'rgb(228, 168, 83)'
      });
    }
  }
  
  async handleNewsletterSubmit(email) {
    try {
      console.log('Suscribiendo al newsletter:', email);
      
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Suscripción exitosa!',
        text: 'Gracias por suscribirte a nuestro boletín.',
        confirmButtonColor: 'rgb(228, 168, 83)'
      });
      
      // Resetear formulario
      document.getElementById('newsletterForm').reset();
    } catch (error) {
      console.error('Error al suscribirse al newsletter:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se completó la suscripción. Por favor, intenta nuevamente.',
        confirmButtonColor: 'rgb(228, 168, 83)'
      });
    }
  }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});