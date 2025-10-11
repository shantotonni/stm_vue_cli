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
import TeacherList from './views/Admin/teacher/Index'
import StudentList from './views/Admin/student/Index'
import StudentCreate from './views/Admin/student/Create'
import StudentEdit from './views/Admin/student/Edit'
import StudentShow from './views/Admin/student/Show'
import DepartmentList from './views/Admin/department/Index'
import SubjectList from './views/Admin/subject/Index'
import ClassRoomList from './views/Admin/class-room/Index'
import ClassSchedules from './views/Admin/class-schedules/Index'
import ClassList from './views/Admin/class/Index'
import StudentEnrollments from './views/Admin/student-enrollments/Index'
import ExamScheduleList from './views/Admin/exam-schedule/Index'
import TeachersSubjectList from './views/Admin/teachers-subject/Index'
import AttendanceList from './views/Admin/attendance-list/Index'
import AttendanceMarkingComponent from './views/Admin/attendance-list/AttendanceMarkingComponent';
import AttendanceReportComponent from './views/Admin/attendance-list/Attendancereportcomponent';
import NoticeList from './views/Admin/notice/Index';

//report
import ResultReport from './views/Admin/report/ResultReport.vue';
import AttendanceReport from './views/Admin/report/AttendanceReport.vue';
import ClassScheduleReport from './views/Admin/report/ClassScheduleReport.vue';
import NoticeReport from './views/Admin/report/NoticeReport.vue';
import ExamScheduleReport from './views/Admin/report/ExamScheduleReport.vue';

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
                { path: 'teachers-list', name: 'TeacherList', component: TeacherList },
                { path: 'students-list', name: 'StudentList', component: StudentList },
                { path: 'student-create', name: 'StudentCreate', component: StudentCreate },
                { path: 'student-edit', name: 'StudentEdit', component: StudentEdit },
                { path: 'student-show', name: 'StudentShow', component: StudentShow },
                { path: 'department-list', name: 'DepartmentList', component: DepartmentList },
                { path: 'subject-list', name: 'SubjectList', component: SubjectList },
                { path: 'class-room-list', name: 'ClassRoomList', component: ClassRoomList },
                { path: 'class-list', name: 'ClassList', component: ClassList },
                { path: 'class-schedules', name: 'ClassSchedules', component: ClassSchedules },
                { path: 'student-enrollments', name: 'StudentEnrollments', component: StudentEnrollments },
                { path: 'exam-schedule-list', name: 'ExamScheduleList', component: ExamScheduleList },
                { path: 'teachers-subject-list', name: 'TeachersSubjectList', component: TeachersSubjectList },
                { path: 'attendance-list', name: 'AttendanceList', component: AttendanceList },
                { path: 'notice-list', name: 'NoticeList', component: NoticeList },
                {
                    path: '/attendance/mark/:classId',
                    name: 'MarkAttendance',
                    component: AttendanceMarkingComponent,
                    props: true,
                    meta: {
                        requiresAuth: true,
                        role: ['teacher', 'admin'],
                        title: 'Mark Attendance'
                    }
                },
                {
                    path: '/attendance/reports',
                    name: 'AttendanceReports',
                    component: AttendanceReportComponent,
                    meta: {
                        requiresAuth: true,
                        role: ['admin'],
                        title: 'Attendance Reports'
                    }
                },

                //report
                {
                    path: 'report/results',
                    name: 'StudentResults',
                    component: ResultReport,
                    meta: {
                        requiresAuth: true,
                        roles: ['admin', 'department_head', 'teacher', 'student'],
                        title: 'Student Results',
                    },
                },
                {
                    path: 'report/attendance',
                    name: 'StudentAttendance',
                    component: AttendanceReport,
                    meta: {
                        requiresAuth: true,
                        roles: ['admin', 'department_head', 'teacher', 'student'],
                        title: 'Student Attendance',
                    },
                },
                {
                    path: 'report/class-schedule',
                    name: 'ClassSchedule',
                    component: ClassScheduleReport,
                    meta: {
                        requiresAuth: true,
                        roles: ['admin', 'department_head', 'teacher', 'student'],
                        title: 'Class Schedule',
                    },
                },
                {
                    path: 'report/notices',
                    name: 'Notices',
                    component: NoticeReport,
                    meta: {
                        requiresAuth: true,
                        roles: ['admin', 'department_head', 'teacher', 'student'],
                        title: 'Notices',
                    },
                },
                {
                    path: 'report/exam-schedule',
                    name: 'ExamSchedule',
                    component: ExamScheduleReport,
                    meta: {
                        requiresAuth: true,
                        roles: ['admin', 'department_head', 'teacher', 'student'],
                        title: 'Exam Schedule',
                    },
                },

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