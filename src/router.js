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
import BookList from './views/Admin/book/Index';
import BookCard from './views/Admin/book/Show';


// Dashboard
// import StudentDashboard from '@/components/Dashboard/Dashboard.vue'


// Card Types
import CardTypeList from '@/components/CardTypes/CardTypeList.vue'
import CardTypeForm from '@/components/CardTypes/CardTypeForm.vue'
import CardTypeView from '@/components/CardTypes/CardTypeView.vue'
import CardStructureBuilder from '@/components/CardTypes/CardStructureBuilder.vue'

// Student Cards
import StudentCardList from '@/components/StudentCards/StudentCardList.vue'
import StudentCardView from '@/components/StudentCards/StudentCardView.vue'
import StudentCardAssign from '@/components/StudentCards/StudentCardAssign.vue'
import ProgressTracker from '@/components/StudentCards/ProgressTracker.vue'
import CardReport from '@/components/StudentCards/CardReport.vue'

// Attendance
import StudentAttendanceList from '@/components/Attendance/AttendanceList.vue'
import AttendanceForm from '@/components/Attendance/AttendanceForm.vue'
import AttendanceView from '@/components/Attendance/AttendanceView.vue'

// Term Exams
import TermExamList from '@/components/TermExams/TermExamList.vue'
import TermExamForm from '@/components/TermExams/TermExamForm.vue'
import TermExamResults from '@/components/TermExams/TermExamResults.vue'

// Reports
import ReportsDashboard from '@/components/Reports/ReportsDashboard.vue'

//report
import ResultReport from './views/Admin/report/ResultReport.vue';
import AttendanceReport from './views/Admin/report/AttendanceReport.vue';
import ClassScheduleReport from './views/Admin/report/ClassScheduleReport.vue';
import NoticeReport from './views/Admin/report/NoticeReport.vue';
import ExamScheduleReport from './views/Admin/report/ExamScheduleReport.vue';
import StudentSemesterReport from './views/Admin/report/StudentSemesterReport.vue';

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
                { path: 'book-list', name: 'BookList', component: BookList },
                { path: 'e-library', name: 'BookCard', component: BookCard },
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

                // Dashboard
                // {
                //     path: '',
                //     name: 'dashboard',
                //     component: StudentDashboard,
                //     meta: { title: 'Dashboard' }
                // },

                // Card Types
                {
                    path: 'card-types',
                    name: 'card-types',
                    component: CardTypeList,
                    meta: { title: 'Card Types' }
                },
                {
                    path: 'card-types/create',
                    name: 'card-types-create',
                    component: CardTypeForm,
                    meta: { title: 'Create Card Type' }
                },
                {
                    path: 'card-types/:id',
                    name: 'card-types-view',
                    component: CardTypeView,
                    meta: { title: 'Card Type Details' }
                },
                {
                    path: 'card-types/:id/edit',
                    name: 'card-types-edit',
                    component: CardTypeForm,
                    meta: { title: 'Edit Card Type' }
                },
                {
                    path: 'card-types/:id/structure',
                    name: 'card-types-structure',
                    component: CardStructureBuilder,
                    meta: { title: 'Build Card Structure' }
                },

                // Student Cards
                {
                    path: 'student-cards',
                    name: 'student-cards',
                    component: StudentCardList,
                    meta: { title: 'Student Cards' }
                },
                {
                    path: 'student-cards/assign',
                    name: 'student-cards-assign',
                    component: StudentCardAssign,
                    meta: { title: 'Assign Cards' }
                },
                {
                    path: 'student-cards/:id',
                    name: 'student-cards-view',
                    component: StudentCardView,
                    meta: { title: 'Student Card Details' }
                },
                {
                    path: 'student-cards/:id/progress',
                    name: 'student-cards-progress',
                    component: ProgressTracker,
                    meta: { title: 'Track Progress' }
                },
                {
                    path: 'student-cards/:id/report',
                    name: 'student-cards-report',
                    component: CardReport,
                    meta: { title: 'Card Report' }
                },

                // Attendance
                {
                    path: 'attendance',
                    name: 'attendance',
                    component: StudentAttendanceList,
                    meta: { title: 'Attendance' }
                },
                {
                    path: 'attendance/mark',
                    name: 'attendance-mark',
                    component: AttendanceForm,
                    meta: { title: 'Mark Attendance' }
                },
                {
                    path: 'attendance/:id',
                    name: 'attendance-view',
                    component: AttendanceView,
                    meta: { title: 'Attendance Details' }
                },
                {
                    path: 'attendance/:id/edit',
                    name: 'attendance-edit',
                    component: AttendanceForm,
                    meta: { title: 'Edit Attendance' }
                },

                // Term Exams
                {
                    path: 'term-exams',
                    name: 'term-exams',
                    component: TermExamList,
                    meta: { title: 'Term Exams' }
                },
                {
                    path: 'term-exams/create',
                    name: 'term-exams-create',
                    component: TermExamForm,
                    meta: { title: 'Create Term Exam' }
                },
                {
                    path: 'term-exams/:id/edit',
                    name: 'term-exams-edit',
                    component: TermExamForm,
                    meta: { title: 'Edit Term Exam' }
                },
                {
                    path: 'term-exams/:id/results',
                    name: 'term-exams-results',
                    component: TermExamResults,
                    meta: { title: 'Manage Results' }
                },

                // Reports
                {
                    path: 'reports',
                    name: 'reports',
                    component: ReportsDashboard,
                    meta: { title: 'Reports & Analytics' }
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
                {
                    path: 'student-semester-report',
                    name: 'StudentSemesterReport',
                    component: StudentSemesterReport,
                    meta: {
                        requiresAuth: true,
                        roles: ['admin', 'department_head', 'teacher', 'student'],
                        title: 'Student Semester Report',
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