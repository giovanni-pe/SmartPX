import Component from '../Component.js';


export default class StepsSection extends Component {
  // Ya no necesitamos un constructor especial
  // En su lugar, usamos el método init() para inicializar propiedades
  
  init() {
    // Inicializar los pasos desde opciones o usar valores por defecto
    this.steps = this.options.steps || [
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
    ];
    
    // Otras propiedades que podrían venir en options
    this.lineColor = this.options.lineColor || 'var(--primary-color)';
    this.animate = this.options.animate !== false; // Por defecto, true
  }
  
  render() {
    this.element.innerHTML = `
      <div class="steps">
        ${this.steps.map(step => `
          <div class="step">
            <div class="step-number">${step.number}</div>
            <div class="step-content">
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Si queremos añadir la línea de conexión entre pasos después de renderizar
    // podemos hacerlo aquí para tener más control sobre su estilo
    if (this.steps.length > 1) {
      const stepsContainer = this.element.querySelector('.steps');
      
      // Línea de progreso
      const progressLine = document.createElement('div');
      progressLine.className = 'steps-progress-line';
      progressLine.style.backgroundColor = this.lineColor;
      stepsContainer.appendChild(progressLine);
      
      // Posicionar correctamente la línea
      this.positionProgressLine();
    }
  }
  
  // Método para posicionar la línea de progreso entre los pasos
  positionProgressLine() {
    const stepsContainer = this.element.querySelector('.steps');
    const progressLine = this.element.querySelector('.steps-progress-line');
    const stepElements = this.element.querySelectorAll('.step');
    
    if (!stepsContainer || !progressLine || stepElements.length < 2) return;
    
    // En pantallas grandes, colocamos la línea horizontalmente
    if (window.innerWidth >= 768) {
      const firstStep = stepElements[0];
      const lastStep = stepElements[stepElements.length - 1];
      const firstStepNumber = firstStep.querySelector('.step-number');
      const lastStepNumber = lastStep.querySelector('.step-number');
      
      // Posición y dimensiones
      const firstRect = firstStepNumber.getBoundingClientRect();
      const lastRect = lastStepNumber.getBoundingClientRect();
      const containerRect = stepsContainer.getBoundingClientRect();
      
      // Altura (centrada con los círculos de números)
      const top = firstRect.top - containerRect.top + firstRect.height / 2;
      
      // Ancho (desde el primer al último círculo)
      const left = firstStepNumber.offsetLeft + firstRect.width / 2;
      const width = lastStepNumber.offsetLeft - firstStepNumber.offsetLeft + lastRect.width / 2;
      
      // Aplicar estilos
      progressLine.style.top = `${top}px`;
      progressLine.style.left = `${left}px`;
      progressLine.style.width = `${width}px`;
      progressLine.style.height = '3px';
    } 
    // En móviles, la línea es vertical
    else {
      progressLine.style.width = '3px';
      progressLine.style.height = 'calc(100% - 60px)'; // Altura total menos el diámetro de un círculo
      progressLine.style.left = `${stepElements[0].querySelector('.step-number').offsetLeft + 30}px`; // Centrado con los círculos
      progressLine.style.top = '30px'; // Desde abajo del primer círculo
    }
  }
  
  bindEvents() {
    // Recalcular la posición de la línea al cambiar el tamaño de la ventana
    window.addEventListener('resize', this.positionProgressLine.bind(this));
    
    // Animación al pasar el ratón sobre los pasos
    if (this.animate) {
      const steps = this.element.querySelectorAll('.step');
      
      steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
          const stepNumber = step.querySelector('.step-number');
          stepNumber.classList.add('pulse');
        });
        
        step.addEventListener('mouseleave', () => {
          const stepNumber = step.querySelector('.step-number');
          stepNumber.classList.remove('pulse');
        });
      });
    }
  }
}