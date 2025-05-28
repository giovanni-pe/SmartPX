import Component from '../Component.js';


export default class FormWizard extends Component {
  // Eliminamos el constructor y movemos la inicialización a init()
  
  init() {
    // Inicializar el estado del componente
    this.state = {
      currentStep: 1,
      formData: {},
      totalSteps: this.options.steps?.length || 3,
      steps: this.options.steps || [],
      onSubmit: this.options.onSubmit || this.defaultSubmit.bind(this),
      // Nuevas opciones que podríamos añadir
      showStepIndicators: this.options.showStepIndicators !== false,
      allowSkipSteps: this.options.allowSkipSteps || false,
      validateOnChange: this.options.validateOnChange || false,
      customSuccessStep: this.options.customSuccessStep || null,
      successData: {
        title: this.options.successTitle || '¡Hola {name}! 🐾',
        message: this.options.successMessage || 'Hemos recibido la solicitud de paseo para <strong>{dogName}</strong>.',
        submessage: this.options.successSubmessage || 'Un asesor se pondrá en contacto contigo en las próximas 24 horas.',
        primaryBtn: {
          text: this.options.successPrimaryBtnText || 'Ver demostración',
          url: this.options.successPrimaryBtnUrl || '#'
        },
        secondaryBtn: {
          text: this.options.successSecondaryBtnText || 'Comparar planes',
          url: this.options.successSecondaryBtnUrl || '#pricing'
        }
      }
    };
    
    // Inicializar historial de navegación para implementar "atrás"
    this.history = [];
    
    // Para depuración
    console.log('FormWizard inicializado con steps:', this.state.steps);
  }
  
  render() {
    // Validar que haya pasos antes de intentar renderizar
    if (!this.state.steps || this.state.steps.length === 0) {
      console.warn('No se han definido pasos para el FormWizard');
      this.element.innerHTML = `
        <div class="form-wizard-error">
          <p>No se han configurado los pasos del formulario correctamente.</p>
        </div>
      `;
      return;
    }
    
    // Generar los indicadores de pasos (si están habilitados)
    const stepsIndicators = this.state.showStepIndicators 
      ? `
        <div class="form-header">
          ${Array.from({ length: this.state.totalSteps }, (_, i) => {
            const stepNum = i + 1;
            return `
              <div class="step-indicator ${stepNum === this.state.currentStep ? 'active' : ''} ${stepNum < this.state.currentStep ? 'completed' : ''}" data-step="${stepNum}">
                ${stepNum}
              </div>
            `;
          }).join('')}
        </div>
      `
      : '';
    
    // Generar los pasos del formulario
    const formSteps = this.state.steps.map((step, index) => {
      const stepNum = index + 1;
      return `
        <div class="form-step ${stepNum === this.state.currentStep ? 'active' : ''}" data-step="${stepNum}">
          ${step.title ? `<h3 class="step-title">${step.title}</h3>` : ''}
          ${step.description ? `<p class="step-description">${step.description}</p>` : ''}
          
          ${step.fields.map(field => this.renderField(field)).join('')}
          
          <div class="form-actions">
            ${stepNum > 1 ? `<button type="button" class="btn btn-outline prev-step">Atrás</button>` : ''}
            ${stepNum < this.state.totalSteps ? 
              `<button type="button" class="btn btn-primary next-step">Siguiente</button>` : 
              `<button type="submit" class="btn btn-primary">Enviar</button>`
            }
          </div>
        </div>
      `;
    }).join('');
    
    // Paso de éxito (personalizado o por defecto)
    const successStep = this.state.customSuccessStep || `
      <div class="form-step" data-step="${this.state.totalSteps + 1}">
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          <h3>${this.state.successData.title}</h3>
          <p>${this.state.successData.message}</p>
          <p>${this.state.successData.submessage}</p>
        </div>
        
        <div class="success-actions">
          <a href="${this.state.successData.primaryBtn.url}" class="btn btn-primary">${this.state.successData.primaryBtn.text}</a>
          <a href="${this.state.successData.secondaryBtn.url}" class="btn btn-outline">${this.state.successData.secondaryBtn.text}</a>
        </div>
      </div>
    `;
    
    // Renderizar el formulario completo
    this.element.innerHTML = `
      ${stepsIndicators}
      
      <form id="wizardForm" class="form-wizard">
        ${formSteps}
        ${successStep}
      </form>
    `;
  }
  
  renderField(field) {
    let fieldHTML = '';
    
    // Obtener el valor actual del campo desde formData (si existe)
    const fieldName = field.name || field.id;
    const fieldValue = field.value || (this.state.formData[fieldName] !== undefined ? this.state.formData[fieldName] : '');
    
    switch(field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
      case 'password':
        fieldHTML = `
          <div class="form-group">
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
            <input 
              type="${field.type}" 
              id="${field.id}" 
              name="${fieldName}"
              placeholder="${field.placeholder || ''}"
              ${field.required ? 'required' : ''}
              value="${fieldValue}"
              ${field.min ? `min="${field.min}"` : ''}
              ${field.max ? `max="${field.max}"` : ''}
              ${field.pattern ? `pattern="${field.pattern}"` : ''}
              ${field.autocomplete ? `autocomplete="${field.autocomplete}"` : ''}
              ${field.disabled ? 'disabled' : ''}
            >
            ${field.helpText ? `<small class="help-text">${field.helpText}</small>` : ''}
          </div>
        `;
        break;
      
      case 'select':
        fieldHTML = `
          <div class="form-group">
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
            <select 
              id="${field.id}" 
              name="${fieldName}"
              ${field.required ? 'required' : ''}
              ${field.disabled ? 'disabled' : ''}
            >
              <option value="">${field.placeholder || 'Seleccione una opción'}</option>
              ${field.options.map(option => `
                <option value="${option.value}" ${fieldValue === option.value ? 'selected' : ''}>
                  ${option.label}
                </option>
              `).join('')}
            </select>
            ${field.helpText ? `<small class="help-text">${field.helpText}</small>` : ''}
          </div>
        `;
        break;
        
      case 'textarea':
        fieldHTML = `
          <div class="form-group">
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
            <textarea 
              id="${field.id}" 
              name="${fieldName}"
              placeholder="${field.placeholder || ''}"
              rows="${field.rows || 4}"
              ${field.required ? 'required' : ''}
              ${field.disabled ? 'disabled' : ''}
            >${fieldValue}</textarea>
            ${field.helpText ? `<small class="help-text">${field.helpText}</small>` : ''}
          </div>
        `;
        break;
        
      case 'checkbox':
        fieldHTML = `
          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="${field.id}" 
              name="${fieldName}"
              ${field.required ? 'required' : ''}
              ${fieldValue === true || field.checked ? 'checked' : ''}
              ${field.disabled ? 'disabled' : ''}
            >
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
            ${field.helpText ? `<small class="help-text">${field.helpText}</small>` : ''}
          </div>
        `;
        break;
        
      case 'radio':
        fieldHTML = `
          <div class="form-group radio-group">
            <span class="radio-label">${field.label}${field.required ? ' *' : ''}</span>
            <div class="radio-options">
              ${field.options.map(option => `
                <div class="radio-option">
                  <input 
                    type="radio" 
                    id="${option.id || `${field.id}_${option.value}`}" 
                    name="${fieldName}"
                    value="${option.value}"
                    ${fieldValue === option.value || option.checked ? 'checked' : ''}
                    ${field.required ? 'required' : ''}
                    ${field.disabled ? 'disabled' : ''}
                  >
                  <label for="${option.id || `${field.id}_${option.value}`}">${option.label}</label>
                </div>
              `).join('')}
            </div>
            ${field.helpText ? `<small class="help-text">${field.helpText}</small>` : ''}
          </div>
        `;
        break;
        
      case 'file':
        fieldHTML = `
          <div class="form-group">
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
            <input 
              type="file" 
              id="${field.id}" 
              name="${fieldName}"
              ${field.required ? 'required' : ''}
              ${field.accept ? `accept="${field.accept}"` : ''}
              ${field.multiple ? 'multiple' : ''}
              ${field.disabled ? 'disabled' : ''}
            >
            ${field.helpText ? `<small class="help-text">${field.helpText}</small>` : ''}
          </div>
        `;
        break;
        
      default:
        console.warn(`Tipo de campo no soportado: ${field.type}`);
    }
    
    return fieldHTML;
  }
  
  bindEvents() {
    const form = this.element.querySelector('form');
    
    // Eventos para los indicadores de paso (si están habilitados)
    if (this.state.showStepIndicators && this.state.allowSkipSteps) {
      const indicators = this.element.querySelectorAll('.step-indicator');
      indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
          const step = parseInt(indicator.getAttribute('data-step'));
          // Solo permitir saltos a pasos ya completados o el siguiente
          if (step <= this.state.currentStep || step === this.state.currentStep + 1) {
            this.goToStep(step);
          }
        });
      });
    }
    
    // Botones de siguiente paso
    const nextButtons = this.element.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        const currentStep = button.closest('.form-step');
        const nextStep = currentStep.nextElementSibling;
        
        if (this.validateStep(currentStep) && nextStep) {
          this.saveStepData(currentStep);
          // Guardar historial para navegación
          this.history.push(this.state.currentStep);
          // Ir al siguiente paso
          this.goToStep(this.state.currentStep + 1);
        }
      });
    });
    
    // Botones de paso anterior
    const prevButtons = this.element.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Si hay historial, usar el último paso visitado
        if (this.history.length > 0) {
          const previousStep = this.history.pop();
          this.goToStep(previousStep);
        } else {
          // Si no hay historial, simplemente retroceder
          this.goToStep(this.state.currentStep - 1);
        }
      });
    });
    
    // Validación en cambio si está habilitada
    if (this.state.validateOnChange) {
      const inputs = this.element.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          this.validateField(input);
        });
        
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    }
    
    // Envío del formulario
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentStep = this.element.querySelector(`.form-step[data-step="${this.state.currentStep}"]`);
        if (this.validateStep(currentStep)) {
          this.saveStepData(currentStep);
          // Reemplazar variables en el mensaje de éxito antes de enviarlo
          this.prepareSuccessStep();
          // Llamar al callback de envío
          this.state.onSubmit(this.state.formData);
        }
      });
    }
  }
  
  // Validar un campo individual
  validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // Comprobar si es requerido
    if (field.required && !field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es requerido';
    } 
    // Validación específica por tipo
    else if (field.value.trim()) {
      switch(field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingrese un email válido';
          }
          break;
          
        case 'tel':
          const phoneRegex = /^[0-9\+\-\s\(\)]{7,20}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingrese un número telefónico válido';
          }
          break;
          
        // Más validaciones específicas podrían añadirse aquí
      }
    }
    
    // Actualizar UI según validación
    if (!isValid) {
      field.classList.add('error');
      
      // Añadir mensaje de error
      let errorEl = field.parentNode.querySelector('.error-message');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        field.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = errorMessage;
    } else {
      field.classList.remove('error');
      
      // Eliminar mensaje de error si existe
      const errorEl = field.parentNode.querySelector('.error-message');
      if (errorEl) errorEl.remove();
    }
    
    return isValid;
  }
  
  // Validar todos los campos en un paso
  validateStep(stepElement) {
    // Validar todos los campos requeridos en el paso actual
    const formElements = stepElement.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    formElements.forEach(field => {
      // Ignorar campos ocultos o deshabilitados
      if (field.type === 'hidden' || field.disabled) {
        return;
      }
      
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Guardar datos del paso actual
  saveStepData(stepElement) {
    // Guardar todos los valores del paso actual
    const formElements = stepElement.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
      // Ignorar elementos sin nombre
      if (!element.name && !element.id) return;
      
      const name = element.name || element.id;
      
      if (element.type === 'checkbox') {
        this.state.formData[name] = element.checked;
      } else if (element.type === 'radio') {
        if (element.checked) {
          this.state.formData[name] = element.value;
        }
      } else if (element.type === 'file') {
        if (element.files.length > 0) {
          this.state.formData[name] = element.files;
        }
      } else {
        this.state.formData[name] = element.value;
      }
    });
  }
  
  // Preparar paso de éxito con datos reales
  prepareSuccessStep() {
    // Reemplazar variables en mensajes de éxito
    const clientName = this.state.formData.name || '';
    const dogName = this.state.formData.dog_name || '';
    
    // Reemplazar placeholders con valores reales
    const titleWithVars = this.state.successData.title.replace('{name}', clientName);
    const messageWithVars = this.state.successData.message.replace('{dogName}', dogName);
    
    // Actualizar elementos en el DOM
    const titleEl = this.element.querySelector('.success-message h3');
    const messageEl = this.element.querySelector('.success-message p:nth-child(2)');
    
    if (titleEl) titleEl.innerHTML = titleWithVars;
    if (messageEl) messageEl.innerHTML = messageWithVars;
  }
  
  // Navegar a un paso específico
  goToStep(step) {
    if (step < 1 || step > this.state.totalSteps + 1) return;
    
    // Ocultar paso actual
    const currentStepEl = this.element.querySelector(`.form-step[data-step="${this.state.currentStep}"]`);
    if (currentStepEl) currentStepEl.classList.remove('active');
    
    // Mostrar nuevo paso
    const newStepEl = this.element.querySelector(`.form-step[data-step="${step}"]`);
    if (newStepEl) newStepEl.classList.add('active');
    
    // Actualizar indicadores
    const indicators = this.element.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      
      if (stepNum < step) {
        // Pasos anteriores están completados
        indicator.classList.add('completed');
        indicator.classList.remove('active');
      } else if (stepNum === step) {
        // Paso actual
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else {
        // Pasos futuros
        indicator.classList.remove('active', 'completed');
      }
    });
    
    // Actualizar estado
    this.setState({ currentStep: step });
    
    // Hacer scroll al inicio del formulario
    const formTop = this.element.getBoundingClientRect().top + window.scrollY - 80; // Offset por navbar
    window.scrollTo({ top: formTop, behavior: 'smooth' });
    
    // Trigger evento personalizado para hooks externos
    this.element.dispatchEvent(new CustomEvent('stepChange', { 
      detail: { step, formData: this.state.formData }
    }));
  }
  
  // Método por defecto para enviar formulario
  defaultSubmit(formData) {
    console.log('Form submitted with data:', formData);
    // Mostrar paso de éxito
    this.goToStep(this.state.totalSteps + 1);
  }
  
  // API pública para resetear el formulario
  reset() {
    this.state.formData = {};
    this.state.currentStep = 1;
    this.history = [];
    this.render();
    this.bindEvents();
  }
  
  // API pública para obtener los datos actuales
  getData() {
    return {...this.state.formData};
  }
  
  // API pública para establecer datos
  setData(formData) {
    this.state.formData = {...formData};
    this.render();
    this.bindEvents();
  }
}