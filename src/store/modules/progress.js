import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        progressItems: [],
        statistics: null,
        loading: false
    },

    mutations: {
        SET_PROGRESS_ITEMS(state, items) {
            state.progressItems = items
        },

        SET_STATISTICS(state, stats) {
            state.statistics = stats
        },

        SET_LOADING(state, status) {
            state.loading = status
        },

        UPDATE_PROGRESS_ITEM(state, updatedItem) {
            const index = state.progressItems.findIndex(p => p.id === updatedItem.id)
            if (index !== -1) {
                Vue.set(state.progressItems, index, updatedItem)
            }
        }
    },

    actions: {
        async fetchProgress({ commit }, studentCardRecordId) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.get(`/progress/record/${studentCardRecordId}`)
                commit('SET_PROGRESS_ITEMS', response.data.data)
                return response.data.data
            } catch (error) {
                console.error('Error fetching progress:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateProgress({ commit }, { id, data }) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.put(`/progress/${id}`, data)
                commit('UPDATE_PROGRESS_ITEM', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error updating progress:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async bulkUpdateProgress({ commit }, data) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.post('/progress/bulk-update', data)
                return response.data
            } catch (error) {
                console.error('Error in bulk update:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async markStarted({ commit }, { id, data }) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.post(`/progress/${id}/mark-started`, data)
                commit('UPDATE_PROGRESS_ITEM', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error marking as started:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async markCompleted({ commit }, { id, data }) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.post(`/progress/${id}/mark-completed`, data)
                commit('UPDATE_PROGRESS_ITEM', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error marking as completed:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchStatistics({ commit }, studentCardRecordId) {
            try {
                const response = await Vue.prototype.$http.get(`/progress/statistics/${studentCardRecordId}`)
                commit('SET_STATISTICS', response.data.data)
                return response.data.data
            } catch (error) {
                console.error('Error fetching statistics:', error)
                throw error
            }
        }
    }
}