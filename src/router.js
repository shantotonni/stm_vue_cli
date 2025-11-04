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
import StudentImport from './views/Admin/student/Import'
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

//report
import ResultReport from './views/Admin/report/ResultReport.vue';
import AttendanceReport from './views/Admin/report/AttendanceReport.vue';
import ClassScheduleReport from './views/Admin/report/ClassScheduleReport.vue';
import NoticeReport from './views/Admin/report/NoticeReport.vue';
import ExamScheduleReport from './views/Admin/report/ExamScheduleReport.vue';
import StudentSemesterReport from './views/Admin/report/StudentSemesterReport.vue';

import StudentProgressCardReport from './views/report/StudentProgressCardReport.vue';

//StudentProgressCardReport

//card
import CardType from './views/Admin/card-type/CardType.vue';
import Cadavers from './views/Admin/cadaver/CadaverManagement.vue';
import Specimens from './views/Admin/specimens/SpecimenIndex.vue';

// Card Structure Levels
import CardStructureLevelList from '@/views/CardStructureLevels/List.vue';
import CardStructureLevelForm from '@/views/CardStructureLevels/Form.vue';

// Student Card Records
import StudentCardRecordList from '@/views/StudentCardRecords/List.vue';
import StudentCardRecordForm from '@/views/StudentCardRecords/Form.vue';
import StudentCardRecordView from '@/views/StudentCardRecords/View.vue';

// Student Structure Progress
import StudentStructureProgressList from '@/views/StudentStructureProgress/List.vue';
import StudentStructureProgressForm from '@/views/StudentStructureProgress/Form.vue';

// Attendance
import StudentCardAttendanceList from '@/views/Attendance/List.vue';
import AttendanceForm from '@/views/Attendance/Form.vue';
import AttendanceBulkMark from '@/views/Attendance/BulkMark.vue';

// Term Exams
import TermExamList from '@/views/TermExams/List.vue';
import TermExamForm from '@/views/TermExams/Form.vue';

// Term Exam Results
import TermExamResultList from '@/views/TermExamResults/List.vue';
import TermExamResultForm from '@/views/TermExamResults/Form.vue';
import TermExamResultBulk from '@/views/TermExamResults/BulkForm.vue';

//calender
import AcademicCalender from '@/views/Admin/academic-calendar/Academiccalendar';

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
                { path: 'student-edit/:id', name: 'StudentEdit', component: StudentEdit },
                { path: 'student-show', name: 'StudentShow', component: StudentShow },
                { path: 'student-import', name: 'StudentImport', component: StudentImport },
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
                { path: 'academic-calender', name: 'AcademicCalender', component: AcademicCalender },

                //card
                { path: 'card-types', name: 'CardType', component: CardType },
                { path: 'cadavers', name: 'Cadavers', component: Cadavers },
                { path: 'specimens', name: 'Specimens', component: Specimens },

                // Card Structure Levels Routes
                {
                    path: '/card-structure-levels',
                    name: 'CardStructureLevelList',
                    component: CardStructureLevelList
                },
                {
                    path: '/card-structure-levels/create',
                    name: 'CardStructureLevelCreate',
                    component: CardStructureLevelForm
                },
                {
                    path: '/card-structure-levels/:id/edit',
                    name: 'CardStructureLevelEdit',
                    component: CardStructureLevelForm,
                    props: true
                },

                // Student Card Records Routes
                {
                    path: '/student-card-records',
                    name: 'StudentCardRecordList',
                    component: StudentCardRecordList
                },
                {
                    path: '/student-card-records/create',
                    name: 'StudentCardRecordCreate',
                    component: StudentCardRecordForm
                },
                {
                    path: '/student-card-records/:id',
                    name: 'StudentCardRecordView',
                    component: StudentCardRecordView,
                    props: true
                },
                {
                    path: '/student-card-records/:id/edit',
                    name: 'StudentCardRecordEdit',
                    component: StudentCardRecordForm,
                    props: true
                },

                // Student Structure Progress Routes
                {
                    path: '/student-structure-progress',
                    name: 'StudentStructureProgressList',
                    component: StudentStructureProgressList
                },
                {
                    path: '/student-structure-progress/create',
                    name: 'StudentStructureProgressCreate',
                    component: StudentStructureProgressForm
                },
                {
                    path: '/student-structure-progress/:id/edit',
                    name: 'StudentStructureProgressEdit',
                    component: StudentStructureProgressForm,
                    props: true
                },

                // Attendance Routes
                {
                    path: '/attendance',
                    name: 'StudentCardAttendanceList',
                    component: StudentCardAttendanceList
                },
                {
                    path: '/attendance/create',
                    name: 'AttendanceCreate',
                    component: AttendanceForm
                },
                {
                    path: '/attendance/:id/edit',
                    name: 'AttendanceEdit',
                    component: AttendanceForm,
                    props: true
                },
                {
                    path: '/attendance/bulk-mark',
                    name: 'AttendanceBulkMark',
                    component: AttendanceBulkMark
                },

                // Term Exams Routes
                {
                    path: '/term-exams',
                    name: 'TermExamList',
                    component: TermExamList
                },
                {
                    path: '/term-exams/create',
                    name: 'TermExamCreate',
                    component: TermExamForm
                },
                {
                    path: '/term-exams/:id/edit',
                    name: 'TermExamEdit',
                    component: TermExamForm,
                    props: true
                },

                // Term Exam Results Routes
                {
                    path: '/term-exam-results',
                    name: 'TermExamResultList',
                    component: TermExamResultList
                },
                {
                    path: '/term-exam-results/create',
                    name: 'TermExamResultCreate',
                    component: TermExamResultForm
                },
                {
                    path: '/term-exam-results/:id/edit',
                    name: 'TermExamResultEdit',
                    component: TermExamResultForm,
                    props: true
                },
                {
                    path: '/term-exam-results/bulk',
                    name: 'TermExamResultBulk',
                    component: TermExamResultBulk
                },


                {path: '/attendance/mark/:classId', name: 'MarkAttendance', component: AttendanceMarkingComponent, props: true,
                    meta: {
                        requiresAuth: true,
                    }
                },
                {path: '/attendance/reports', name: 'AttendanceReports', component: AttendanceReportComponent,
                    meta: {
                        requiresAuth: true,
                    }
                },

                //report
                {path: 'report/results', name: 'StudentResults', component: ResultReport,
                    meta: {
                        requiresAuth: true,
                    },
                },
                {path: 'report/attendance', name: 'StudentAttendance', component: AttendanceReport,
                    meta: {
                        requiresAuth: true,
                    },
                },
                {path: 'report/class-schedule', name: 'ClassSchedule', component: ClassScheduleReport,
                    meta: {
                        requiresAuth: true,
                    },
                },
                {path: 'report/notices', name: 'Notices', component: NoticeReport,
                    meta: {
                        requiresAuth: true,
                    },
                },
                {path: 'report/exam-schedule', name: 'ExamSchedule', component: ExamScheduleReport,
                    meta: {
                        requiresAuth: true,
                    },
                },
                {path: 'student-semester-report', name: 'StudentSemesterReport', component: StudentSemesterReport,
                    meta: {
                        requiresAuth: true,
                    },
                },
                {path: 'student-progress-card-report', name: 'StudentProgressCardReport', component: StudentProgressCardReport,
                    meta: {
                        requiresAuth: true,
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