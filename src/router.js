import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import StudentLayout from './components/layouts/StudentLayout.vue';
import Dashboard  from './views/Dashboard.vue'
import SurveyForm from './views/SurveyForm.vue'
import OneTimePasswordChange from './views/OneTimeChangePassword.vue'
import PasswordChange from './views/PasswordChange.vue'
import Academics from './views/academics/Academics.vue'

import ELearning from './views/elearning/ELearning.vue'
import Menu from './views/Admin/Menu/Index'
//setup route
import UserList from './views/Admin/user/Index'

// settings
import Profile from './views/settings/Profile'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        { path: '/login', name: 'Login', component: Login },
        {
            path: '/',
            component: StudentLayout,
            redirect: {name: 'Dashboard'},
            children: [
                { path: 'dashboard', name: 'Dashboard', component: Dashboard },
                { path: 'survey', name: 'SurveyForm', component: SurveyForm },
                { path: 'one-time-password-change', name: 'OneTimePasswordChange', component: OneTimePasswordChange },
                { path: 'change-password', name: 'PasswordChange', component: PasswordChange },
                { path: 'academics', name: 'Academics', component: Academics },
                { path: 'e-learning', name: 'ELearning', component: ELearning },
                { path: 'menu', name: 'Menu', component: Menu },
                //SETUP ROUTE
                { path: 'users-list', name: 'UserList', component: UserList },

                { path: 'profile', name: 'Profile', component: Profile },
            ],
            meta: { requiresAuth: true },
        },
    ],
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("token")
    const is_change_password = localStorage.getItem("is_change_password")

    if ((to.name === "Dashboard" || to.name === "SurveyForm" || to.name === "OneTimePasswordChange") && !isAuthenticated) {
        return next({ name: "Login" })
    }
    if (to.name === "Login" && isAuthenticated) {
        if (is_change_password === "N") {
            return next({ name: "OneTimePasswordChange" })
        }
        if (is_change_password === "Y") {
            return next({ name: "Dashboard" })
        }
    }
    if (isAuthenticated && is_change_password === "N" && to.name !== "OneTimePasswordChange") {
        return next({ name: "OneTimePasswordChange" })
    }
    if (isAuthenticated && is_change_password === "Y" && to.name === "OneTimePasswordChange") {
        return next({ name: "Dashboard" })
    }
    return next()
})

export default router