import Vue from 'vue'
import api from '@/plugins/axios'


export default {
    namespaced: true,

    state: {
        cardTypes: [],
        currentCardType: null,
        loading: false,
        pagination: {
            current_page: 1,
            per_page: 15,
            total: 0
        }
    },

    mutations: {
        SET_CARD_TYPES(state, data) {
            state.cardTypes = data.data
            state.pagination = {
                current_page: data.current_page,
                per_page: data.per_page,
                total: data.total
            }
        },

        SET_CURRENT_CARD_TYPE(state, cardType) {
            state.currentCardType = cardType
        },

        SET_LOADING(state, status) {
            state.loading = status
        },

        ADD_CARD_TYPE(state, cardType) {
            state.cardTypes.unshift(cardType)
        },

        UPDATE_CARD_TYPE(state, updatedCardType) {
            const index = state.cardTypes.findIndex(ct => ct.id === updatedCardType.id)
            if (index !== -1) {
                Vue.set(state.cardTypes, index, updatedCardType)
            }
        },

        REMOVE_CARD_TYPE(state, id) {
            state.cardTypes = state.cardTypes.filter(ct => ct.id !== id)
        }
    },

    actions: {
        async fetchCardTypes({ commit }, params = {}) {
            commit('SET_LOADING', true)
            try {
                const response = await api.get('/card-types', { params })
                commit('SET_CARD_TYPES', response.data)
                return response.data
            } catch (error) {
                console.error('Error fetching card types:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchCardType({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                const response = await this.$api.get(`/card-types/${id}`)
                commit('SET_CURRENT_CARD_TYPE', response.data.data)
                return response.data.data
            } catch (error) {
                console.error('Error fetching card type:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async createCardType({ commit }, data) {
            commit('SET_LOADING', true)
            try {
                const response = await this.$api.post('/card-types', data)
                commit('ADD_CARD_TYPE', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error creating card type:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateCardType({ commit }, { id, data }) {
            commit('SET_LOADING', true)
            try {
                const response = await this.$api.put(`/card-types/${id}`, data)
                commit('UPDATE_CARD_TYPE', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error updating card type:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async deleteCardType({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                await this.$api.delete(`/card-types/${id}`)
                commit('REMOVE_CARD_TYPE', id)
            } catch (error) {
                console.error('Error deleting card type:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async toggleActive({ commit }, id) {
            try {
                const response = await this.$api.post(`/card-types/${id}/toggle-active`)
                commit('UPDATE_CARD_TYPE', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error toggling active status:', error)
                throw error
            }
        },

        async duplicateCardType({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                const response = await this.$api.post(`/card-types/${id}/duplicate`)
                commit('ADD_CARD_TYPE', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error duplicating card type:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        }
    },

    getters: {
        cardTypesByDepartment: (state) => (departmentId) => {
            return state.cardTypes.filter(ct => ct.department_id === departmentId)
        },

        cardTypesByYear: (state) => (year) => {
            return state.cardTypes.filter(ct => ct.applicable_year === year)
        },

        activeCardTypes: (state) => {
            return state.cardTypes.filter(ct => ct.is_active)
        }
    }
}