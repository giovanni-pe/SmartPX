export default class Component {
  constructor(selector, options = {}) {
    this.element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
      
    if (!this.element && typeof selector === 'string') {
      console.warn(`Elemento no encontrado para el selector: ${selector}`);
      return;
    }
    
    this.options = options;
    
    // Inicializar el estado del componente
    this.state = options.state || {};
    
    // Primera fase: inicialización de propiedades
    this.init();
    
    // Cargar estilos CSS del componente si existen
    this.loadStyles();
    
    // Segunda fase: renderizar y vincular eventos
    // (ahora esto ocurre DESPUÉS de init donde las subclases pueden configurar sus propiedades)
    this.render();
    this.bindEvents();
  }
  
  /**
   * Método para inicializar propiedades del componente
   * Las subclases deben sobrescribir este método en lugar de hacer inicializaciones en el constructor
   */
  init() {
    // Implementado por subclases
  }
  
  /**
   * Carga los estilos CSS asociados al componente
   * El nombre del archivo CSS se determina a partir del nombre de la clase
   */
  async loadStyles() {
    try {
      // Obtener el nombre del componente a partir del nombre de la clase
      const componentName = this.constructor.name;
      
      // Determinar la ruta del archivo CSS
      const cssPath = `./js/components/${componentName}/${componentName}.css`;
      
      // Cargar CSS solo si no existe ya
      const styleId = `component-style-${componentName}`;
      if (!document.getElementById(styleId)) {
        // Crear elemento link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = styleId;
        link.href = cssPath;
        
        // Añadir al DOM
        document.head.appendChild(link);
        
        // En desarrollo podríamos añadir un logger
        console.log(`Estilos cargados para: ${componentName}`);
      }
    } catch (error) {
      console.warn(`Error al cargar estilos para el componente:`, error);
    }
  }
  
  /**
   * Renderiza el HTML del componente
   * Este método debe ser sobrescrito por las subclases
   */
  render() {
    // Implementado por subclases
    console.warn(`El método render() debe ser implementado en ${this.constructor.name}`);
  }
  
  /**
   * Vincula los eventos del componente
   * Este método debe ser sobrescrito por las subclases si necesitan eventos
   */
  bindEvents() {
    // Implementado por subclases que necesiten eventos
  }
  
  /**
   * Actualiza el estado del componente y re-renderiza
   * @param {object} newState - Nuevo estado parcial
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.bindEvents();
  }
  
  /**
   * Crea un nuevo elemento HTML con clases y atributos
   * @param {string} tag - Nombre de la etiqueta HTML
   * @param {string} className - Clases CSS separadas por espacio
   * @param {object} attributes - Atributos HTML como objeto
   * @returns {HTMLElement} - Elemento creado
   */
  createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    return element;
  }
  
  /**
   * Crea un elemento HTML con contenido
   * @param {string} tag - Nombre de la etiqueta HTML
   * @param {string} content - Contenido HTML
   * @param {string} className - Clases CSS
   * @param {object} attributes - Atributos HTML
   * @returns {HTMLElement} - Elemento creado
   */
  createElementWithContent(tag, content, className = '', attributes = {}) {
    const element = this.createElement(tag, className, attributes);
    element.innerHTML = content;
    return element;
  }
  
  /**
   * Añade clases a un elemento
   * @param {HTMLElement} element - Elemento a modificar
   * @param {string|string[]} classes - Clase o clases a añadir
   */
  addClass(element, classes) {
    if (Array.isArray(classes)) {
      element.classList.add(...classes);
    } else {
      element.classList.add(classes);
    }
  }
  
  /**
   * Elimina clases de un elemento
   * @param {HTMLElement} element - Elemento a modificar
   * @param {string|string[]} classes - Clase o clases a eliminar
   */
  removeClass(element, classes) {
    if (Array.isArray(classes)) {
      element.classList.remove(...classes);
    } else {
      element.classList.remove(classes);
    }
  }
  
  /**
   * Alterna una clase en un elemento
   * @param {HTMLElement} element - Elemento a modificar
   * @param {string} className - Clase a alternar
   * @param {boolean} force - Forzar añadir o eliminar
   */
  toggleClass(element, className, force) {
    element.classList.toggle(className, force);
  }
  
  /**
   * Comprueba si un elemento tiene una clase
   * @param {HTMLElement} element - Elemento a comprobar
   * @param {string} className - Clase a buscar
   * @returns {boolean} - Verdadero si tiene la clase
   */
  hasClass(element, className) {
    return element.classList.contains(className);
  }
}