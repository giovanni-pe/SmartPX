export const APP_CONFIG = {
  // API y endpoints
  API_BASE_URL: 'https://api.smartpx.org/api',
  API_VERSION: 'v1',
  
  // Tiempo de caducidad del token JWT en minutos
  TOKEN_EXPIRY: 60 * 24, // 24 horas
  
  // Configuración de geolocalización
  GEOLOCATION_ENABLED: true,
  GEOLOCATION_TIMEOUT: 10000, // 10 segundos
  
  // Servicios de analítica
  GOOGLE_ANALYTICS_ID: 'G-K87D2Z15SP',
  
  // Redes sociales
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/smartpetsxplore',
    INSTAGRAM: 'https://instagram.com/smartpetsxplore',
    WHATSAPP: 'https://wa.me/51910731863'
  },
  
  // Contacto
  CONTACT_INFO: {
    PHONE: '+51 910 731 863',
    EMAIL: 'smartpetsxplore@gmail.com',
    ADDRESS: 'Av. Universitaria, Tingo María, Leoncio Prado, Huánuco, Perú'
  },
  
  // Cache y almacenamiento
  CACHE_TTL: 60 * 60 * 1000, // 1 hora en milisegundos
  LOCAL_STORAGE_PREFIX: 'smartpx_',
  
  // Mapas
  MAP_PROVIDER: 'google',
  GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY_HERE',
  DEFAULT_MAP_CENTER: {
    lat: -9.293444,
    lng: -76.003862
  },
  DEFAULT_MAP_ZOOM: 15,
  
  // Configuración de suscripciones
  SUBSCRIPTION_PLANS: {
    BASIC: {
      MONTHLY: 60,
      ANNUAL: 30 * 12
    },
    PREMIUM: {
      MONTHLY: 100,
      ANNUAL: 50 * 12
    },
    UNLIMITED: {
      MONTHLY: 249,
      ANNUAL: 199 * 12
    }
  },
  
  // Intervalos de actualización
  REFRESH_INTERVAL: 30000, // 30 segundos
  
  // Feature flags
  FEATURES: {
    ADOPTION_ENABLED: true,
    LOST_PETS_ENABLED: true,
    VOLUNTEERING_ENABLED: false,
    DONATIONS_ENABLED: false,
    LIVE_TRACKING_ENABLED: true
  }
};

// Funciones auxiliares para tokens
export const getToken = () => localStorage.getItem(`${APP_CONFIG.LOCAL_STORAGE_PREFIX}token`);
export const setToken = (token) => localStorage.setItem(`${APP_CONFIG.LOCAL_STORAGE_PREFIX}token`, token);
export const removeToken = () => localStorage.removeItem(`${APP_CONFIG.LOCAL_STORAGE_PREFIX}token`);

// Funciones para verificar características habilitadas
export const isFeatureEnabled = (featureName) => {
  return APP_CONFIG.FEATURES[featureName] === true;
};

// Función para obtener URLs de API
export const getApiUrl = (endpoint) => {
  return `${APP_CONFIG.API_BASE_URL}/${APP_CONFIG.API_VERSION}/${endpoint}`;
};

// Funciones de cache
export const cacheData = (key, data, ttl = APP_CONFIG.CACHE_TTL) => {
  const cacheItem = {
    data,
    expiry: Date.now() + ttl
  };
  localStorage.setItem(`${APP_CONFIG.LOCAL_STORAGE_PREFIX}cache_${key}`, JSON.stringify(cacheItem));
};

export const getCachedData = (key) => {
  const cachedItem = localStorage.getItem(`${APP_CONFIG.LOCAL_STORAGE_PREFIX}cache_${key}`);
  if (!cachedItem) return null;
  
  const { data, expiry } = JSON.parse(cachedItem);
  if (Date.now() > expiry) {
    localStorage.removeItem(`${APP_CONFIG.LOCAL_STORAGE_PREFIX}cache_${key}`);
    return null;
  }
  
  return data;
};

// utils/http.js - Utilidades para llamadas HTTP
import { APP_CONFIG, getToken } from '../config/config.js';

/**
 * Realiza peticiones HTTP con fetch
 * @param {string} endpoint - Ruta relativa de la API
 * @param {Object} options - Opciones para fetch (method, headers, body, etc.)
 * @returns {Promise} - Promesa con la respuesta
 */
export async function apiFetch(endpoint, options = {}) {
  // Construir la URL completa
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${APP_CONFIG.API_BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  
  // Configurar headers por defecto
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() && { 'Authorization': `Bearer ${getToken()}` }),
    ...options.headers
  };
  
  // Configurar la petición
  const config = {
    method: options.method || 'GET',
    headers,
    ...options
  };
  
  // Si hay body, convertir a JSON (si no lo está ya)
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // Manejar respuestas de error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error en la petición',
        status: response.status
      }));
      
      // Manejar error de autenticación
      if (response.status === 401) {
        // Podríamos limpiar el token y redirigir al login
        // removeToken();
        // window.location.href = '/login';
      }
      
      throw new Error(errorData.message || 'Error desconocido');
    }
    
    // Verificar si la respuesta contiene JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
}

/**
 * Función para peticiones GET
 */
export function get(endpoint, options = {}) {
  return apiFetch(endpoint, { ...options, method: 'GET' });
}

/**
 * Función para peticiones POST
 */
export function post(endpoint, data, options = {}) {
  return apiFetch(endpoint, { ...options, method: 'POST', body: data });
}

/**
 * Función para peticiones PUT
 */
export function put(endpoint, data, options = {}) {
  return apiFetch(endpoint, { ...options, method: 'PUT', body: data });
}

/**
 * Función para peticiones DELETE
 */
export function del(endpoint, options = {}) {
  return apiFetch(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Función para subir archivos
 */
export async function uploadFile(endpoint, file, additionalData = {}, options = {}) {
  const formData = new FormData();
  formData.append('file', file);
  
  // Añadir datos adicionales
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  // Configurar la petición (sin Content-Type para que el navegador establezca el boundary correcto)
  const config = {
    method: 'POST',
    headers: {
      'Authorization': getToken() ? `Bearer ${getToken()}` : undefined,
      ...options.headers
    },
    body: formData,
    ...options
  };
  
  // Eliminar Content-Type si existe
  delete config.headers['Content-Type'];
  
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error al subir el archivo',
        status: response.status
      }));
      
      throw new Error(errorData.message || 'Error desconocido');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
}