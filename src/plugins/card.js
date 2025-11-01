import axios from "axios";
// import router from "@/router";
const api = axios.create({
    //baseURL: "https://backendevaluation.mcwh.online/api/",
     baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            // router.push("/login");
        }
        return Promise.reject(error);
    }
);



export default {
    // Card Structure Levels
    cardStructureLevels: {
        getAll(params = {}) {
            return api.get('/card-structure-levels', { params });
        },
        getById(id) {
            return api.get(`/card-structure-levels/${id}`);
        },
        create(data) {
            return api.post('/card-structure-levels', data);
        },
        update(id, data) {
            return api.put(`/card-structure-levels/${id}`, data);
        },
        delete(id) {
            return api.delete(`/card-structure-levels/${id}`);
        },
        getTree(cardTypeId) {
            return api.get(`/card-structure-levels/tree/${cardTypeId}`);
        }
    },

    // Student Card Records
    studentCardRecords: {
        getAll(params = {}) {
            return api.get('/student-card-records', { params });
        },
        getById(id) {
            return api.get(`/student-card-records/${id}`);
        },
        create(data) {
            return api.post('/student-card-records', data);
        },
        update(id, data) {
            return api.put(`/student-card-records/${id}`, data);
        },
        delete(id) {
            return api.delete(`/student-card-records/${id}`);
        },
        sign(id, data) {
            return api.post(`/student-card-records/${id}/sign`, data);
        }
    },

    // Student Structure Progress
    studentStructureProgress: {
        getAll(params = {}) {
            return api.get('/student-structure-progress', { params });
        },
        getById(id) {
            return api.get(`/student-structure-progress/${id}`);
        },
        create(data) {
            return api.post('/student-structure-progress', data);
        },
        update(id, data) {
            return api.put(`/student-structure-progress/${id}`, data);
        },
        delete(id) {
            return api.delete(`/student-structure-progress/${id}`);
        },
        markCompleted(id, data) {
            return api.post(`/student-structure-progress/${id}/complete`, data);
        },
    },

    // Attendance
    attendance: {
        getAll(params = {}) {
            return api.get('/card-attendance', { params });
        },
        getById(id) {
            return api.get(`/card-attendance/${id}`);
        },
        create(data) {
            return api.post('/card-attendance', data);
        },
        update(id, data) {
            return api.put(`/card-attendance/${id}`, data);
        },
        delete(id) {
            return api.delete(`/card-attendance/${id}`);
        },
        bulkMark(data) {
            return api.post('/card-attendance/bulk-mark', data);
        },
        getSummary(params) {
            return api.get('/card-attendance/summary/stats', { params });
        }
    },
    students: {
        getByCardType(cardTypeId) {
            return api.get(`/card-attendance/students/by-card-type/${cardTypeId}`);
        },
    },
    // Term Exams
    termExams: {
        getAll(params = {}) {
            return api.get('/term-exams', { params });
        },
        getById(id) {
            return api.get(`/term-exams/${id}`);
        },
        create(data) {
            return api.post('/term-exams', data);
        },
        update(id, data) {
            return api.put(`/term-exams/${id}`, data);
        },
        delete(id) {
            return api.delete(`/term-exams/${id}`);
        }
    },

    // Term Exam Results
    termExamResults: {
        getAll(params = {}) {
            return api.get('/term-exam-results', { params });
        },
        getById(id) {
            return api.get(`/term-exam-results/${id}`);
        },
        create(data) {
            return api.post('/term-exam-results', data);
        },
        update(id, data) {
            return api.put(`/term-exam-results/${id}`, data);
        },
        delete(id) {
            return api.delete(`/term-exam-results/${id}`);
        },
        bulkStore(data) {
            return api.post('/term-exam-results/bulk-store', data);
        }
    }
};