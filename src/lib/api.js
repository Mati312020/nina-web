const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        console.error("[API] Fetch Error:", error);
        throw error;
    }
};

export const api = {
    get: async (endpoint) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    post: async (endpoint, body) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    put: async (endpoint, body) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    patch: async (endpoint, body) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },
};
