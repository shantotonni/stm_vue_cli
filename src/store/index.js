import Vue from "vue";
import Vuex from "vuex";
import api from "../plugins/api";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || null,
        user: null,
        userMenus: [],
        loading: false
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
            if (token) {
                localStorage.setItem('token', token)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            } else {
                localStorage.removeItem('token')
                delete api.defaults.headers.common['Authorization']
            }
        },
        setUserMenus(state, menus) {
            state.userMenus = menus
        },
        SET_LOADING(state, loading) {
            state.loading = loading
        },
        logout(state) {
            state.token = null
            state.user = null
            state.userMenus = []
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
        },
    },
    actions: {
        async login({ commit }, { loginId, password }) {
            try {
                const res = await api.post("login", { loginId, password });
                if (res.data.token) {
                    commit("setToken", res.data.token);
                    commit("setUser", res.data.user);
                    commit("setUserMenus", res.data.menus);
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("is_change_password", res.data.user.is_change_password);
                }
                return res.data;
            } catch (err) {
                console.error("Login error:", err);
            }
        },
        async loadUser({ commit }) {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await api.get("me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (res) {
                        commit("setUser", res.data.user);
                        commit('setUserMenus', res.data.menus)
                    }
                } catch (err) {
                    console.error("Login error:", err);
                }
            }
        },
        async fetchUserMenus({ commit }) {
            try {
                const response = await api.get('/get-user-menu')
                commit('setUserMenus', response.data.menus)
            } catch (error) {
                console.error('Failed to fetch user menus:', error)
            }
        },
        async refreshToken({ commit, state }) {
            if (!state.token) return
            try {
                const response = await api.post('/auth/refresh')
                commit('setToken', response.data.token)
                return response.data
            } catch (error) {
                commit('logout')
                throw error
            }
        },
        logout({ commit }) {
            commit("logout");
            localStorage.removeItem("token");
        },
    },
    getters: {
        isAuthenticated: state => !!state.token,
        token: state => state.token,
        loading: state => state.loading,
        hasPermission: (state) => (permission) => {
            return state.user && state.user.permissions.includes(permission)
        },
        hasRole: (state) => (role) => {
            return state.user && state.user.role === role
        },
        userType: state => state.user ? state.user.user_type : null,
        currentUser(state) {
            return state.user;
        },
        userMenus(state) {
            return state.userMenus;
        },
        isLoggedIn(state) {
            return !!state.token;
        },
    },
});
