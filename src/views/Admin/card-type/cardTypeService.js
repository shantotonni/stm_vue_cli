import api from '../../../plugins/api';

const API_URL = '/card-types';

class CardTypeService {
    async getAll(params = {}) {
        try {
            const response = await api.get(API_URL, { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async getById(id) {
        try {
            const response = await api.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async create(data) {
        try {
            const response = await api.post(API_URL, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async update(id, data) {
        try {
            const response = await api.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async delete(id) {
        try {
            const response = await api.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async getDepartments() {
        try {
            const response = await api.get(`${API_URL}/departments/list`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async getStatistics() {
        try {
            const response = await api.get(`${API_URL}/statistics/all`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async updateSequences(sequences) {
        try {
            const response = await api.post(`${API_URL}/sequences/update`, { sequences });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async toggleActive(id) {
        try {
            const response = await api.patch(`${API_URL}/${id}/toggle-active`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (error.response) {
            // Server responded with error
            const message = error.response.data.message || 'An error occurred';
            const errors = error.response.data.errors || {};
            return { message, errors, status: error.response.status };
        } else if (error.request) {
            // Request made but no response
            return { message: 'No response from server', errors: {}, status: 0 };
        } else {
            // Error in request setup
            return { message: error.message, errors: {}, status: 0 };
        }
    }
}

export default new CardTypeService();