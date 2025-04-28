import { API_BASE_URL, getToken } from '../../config/config.js';

export async function apiFetch(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
    };

    const config = {
        method: 'GET',
        headers,
        ...options
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
}
