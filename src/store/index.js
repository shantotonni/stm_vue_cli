import Vue from "vue";
import Vuex from "vuex";
import api from "../plugins/api";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        token: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    actions: {
        async login({ commit }, { loginId, password }) {
            try {
                const res = await api.post("login", { loginId, password });
                if (res.data.token) {
                    commit("setToken", res.data.token);
                    commit("setUser", res.data.user);
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
                        commit("setUser", res.data.data);
                    }
                } catch (err) {
                    console.error("Login error:", err);
                }
            }
        },
        logout({ commit }) {
            commit("logout");
            localStorage.removeItem("token");
        },
    },
    getters: {
        currentUser(state) {
            return state.user;
        },
        isLoggedIn(state) {
            return !!state.token;
        },
    },
});
