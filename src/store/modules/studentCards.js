import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        studentCards: [],
        currentCard: null,
        loading: false,
        pagination: {
            current_page: 1,
            per_page: 15,
            total: 0
        }
    },

    mutations: {
        SET_STUDENT_CARDS(state, data) {
            state.studentCards = data.data
            state.pagination = {
                current_page: data.current_page,
                per_page: data.per_page,
                total: data.total
            }
        },

        SET_CURRENT_CARD(state, card) {
            state.currentCard = card
        },

        SET_LOADING(state, status) {
            state.loading = status
        },

        ADD_STUDENT_CARD(state, card) {
            state.studentCards.unshift(card)
        },

        UPDATE_STUDENT_CARD(state, updatedCard) {
            const index = state.studentCards.findIndex(c => c.id === updatedCard.id)
            if (index !== -1) {
                Vue.set(state.studentCards, index, updatedCard)
            }
        },

        REMOVE_STUDENT_CARD(state, id) {
            state.studentCards = state.studentCards.filter(c => c.id !== id)
        }
    },

    actions: {
        async fetchStudentCards({ commit }, params = {}) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.get('/student-cards', { params })
                commit('SET_STUDENT_CARDS', response.data)
                return response.data
            } catch (error) {
                console.error('Error fetching student cards:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchStudentCard({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.get(`/student-cards/${id}`)
                commit('SET_CURRENT_CARD', response.data.data)
                return response.data.data
            } catch (error) {
                console.error('Error fetching student card:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async createStudentCard({ commit }, data) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.post('/student-cards', data)
                commit('ADD_STUDENT_CARD', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error creating student card:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateStudentCard({ commit }, { id, data }) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.put(`/student-cards/${id}`, data)
                commit('UPDATE_STUDENT_CARD', response.data.data)
                return response.data
            } catch (error) {
                console.error('Error updating student card:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async deleteStudentCard({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                await Vue.prototype.$http.delete(`/student-cards/${id}`)
                commit('REMOVE_STUDENT_CARD', id)
            } catch (error) {
                console.error('Error deleting student card:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async bulkAssignStudents({ commit }, data) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.post('/student-cards/bulk-assign', data)
                return response.data
            } catch (error) {
                console.error('Error in bulk assign:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchCardReport({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                const response = await Vue.prototype.$http.get(`/student-cards/${id}/report`)
                return response.data.data
            } catch (error) {
                console.error('Error fetching card report:', error)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
}