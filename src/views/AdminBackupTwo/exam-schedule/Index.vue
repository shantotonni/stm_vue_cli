<template>
  <div class="exam-management">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-clipboard-list"></i>
            Exam Management
          </h1>
          <p class="page-subtitle">Schedule, manage and monitor all examinations</p>
        </div>
        <button class="btn-create" @click="showCreateModal">
          <i class="fas fa-plus-circle"></i>
          Schedule New Exam
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-upcoming">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.upcoming }}</div>
          <div class="stat-label">Upcoming</div>
        </div>
      </div>
      <div class="stat-card stat-today">
        <div class="stat-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.today }}</div>
          <div class="stat-label">Today</div>
        </div>
      </div>
      <div class="stat-card stat-ongoing">
        <div class="stat-icon">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.ongoing }}</div>
          <div class="stat-label">Ongoing</div>
        </div>
      </div>
      <div class="stat-card stat-completed">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="quick-filters">
        <button
            v-for="filter in quickFilters"
            :key="filter.value"
            class="quick-filter-btn"
            :class="{ active: quickFilter === filter.value }"
            @click="setQuickFilter(filter.value)"
        >
          <i :class="filter.icon"></i>
          {{ filter.label }}
        </button>
      </div>

      <div class="advanced-filters" v-show="showAdvancedFilters">
        <div class="filter-row">
          <div class="filter-group">
            <label>Department</label>
            <select class="filter-input" v-model="filters.department_id" @change="applyFilters">
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Exam Type</label>
            <select class="filter-input" v-model="filters.exam_type_id" @change="applyFilters">
              <option value="">All Types</option>
              <option v-for="type in examTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Year</label>
            <select class="filter-input" v-model="filters.year" @change="applyFilters">
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Status</label>
            <select class="filter-input" v-model="filters.status" @change="applyFilters">
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <label>Start Date</label>
            <input
                type="date"
                class="filter-input"
                v-model="filters.start_date"
                @change="applyFilters"
            >
          </div>

          <div class="filter-group">
            <label>End Date</label>
            <input
                type="date"
                class="filter-input"
                v-model="filters.end_date"
                @change="applyFilters"
            >
          </div>

          <div class="filter-group search-group">
            <label>Search</label>
            <div class="search-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                  type="text"
                  class="filter-input search-input"
                  placeholder="Search exams..."
                  v-model="searchQuery"
                  @input="searchExams"
              >
            </div>
          </div>
        </div>
      </div>

      <button class="toggle-filters-btn" @click="showAdvancedFilters = !showAdvancedFilters">
        <i class="fas" :class="showAdvancedFilters ? 'fa-chevron-up' : 'fa-filter'"></i>
        {{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading exams...</p>
    </div>

    <!-- Exam Cards -->
    <div v-else class="exam-grid">
      <div v-if="exams.length === 0" class="empty-state">
        <i class="fas fa-calendar-times"></i>
        <h3>No Exams Found</h3>
        <p>Try adjusting your filters or create a new exam</p>
      </div>

      <div v-for="exam in exams" :key="exam.id" class="exam-card">
        <div class="exam-card-header" :class="'status-' + exam.status">
          <div class="exam-date-badge">
            <div class="date-month">{{ getMonth(exam.exam_date) }}</div>
            <div class="date-day">{{ getDay(exam.exam_date) }}</div>
          </div>
          <div class="exam-title-section">
            <h3 class="exam-title">{{ exam.title }}</h3>
            <div class="exam-meta">
              <span class="meta-item">
                <i class="fas fa-book"></i>
                {{ exam.subject ? exam.subject.name : 'N/A' }}
              </span>
              <span class="meta-item">
                <i class="fas fa-graduation-cap"></i>
                Year {{ exam.year }} - Sem {{ exam.semester }}
              </span>
            </div>
          </div>
          <div class="status-badge" :class="'badge-' + exam.status">
            {{ exam.status }}
          </div>
        </div>

        <div class="exam-card-body">
          <div class="info-grid">
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <div class="info-content">
                <span class="info-label">Time</span>
                <span class="info-value">
                  {{ formatTime(exam.start_time) }} - {{ formatTime(exam.end_time) }}
                </span>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-tag"></i>
              <div class="info-content">
                <span class="info-label">Type</span>
                <span class="info-value">
                  {{ exam.exam_type ? exam.exam_type.name : 'N/A' }}
                </span>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-chalkboard-teacher"></i>
              <div class="info-content">
                <span class="info-label">Teacher</span>
                <span class="info-value">
                  {{ exam.teacher ? exam.teacher.name : 'N/A' }}
                </span>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div class="info-content">
                <span class="info-label">Venue</span>
                <span class="info-value">
                  {{exam.classroom.name || 'TBA' }}
                </span>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-star"></i>
              <div class="info-content">
                <span class="info-label">Total Marks</span>
                <span class="info-value">{{ exam.total_marks }}</span>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-users"></i>
              <div class="info-content">
                <span class="info-label">Students</span>
                <span class="info-value">{{ exam.exam_students_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="exam-card-footer">
          <button class="action-btn btn-primary" @click="viewExam(exam)">
            <i class="fas fa-eye"></i>
            View Details
          </button>

          <button
              v-if="exam.status === 'scheduled'"
              class="action-btn btn-edit"
              @click="editExam(exam)"
          >
            <i class="fas fa-edit"></i>
            Edit
          </button>
          <button
              v-if="exam.status === 'scheduled'"
              class="action-btn btn-start"
              @click="startExam(exam)"
          >
            <i class="fas fa-play"></i>
            Start Exam
          </button>

          <!-- Complete Exam Button (ongoing → completed) -->
          <button
              v-if="exam.status === 'ongoing'"
              class="action-btn btn-complete"
              @click="completeExam(exam)"
          >
            <i class="fas fa-check-circle"></i>
            Complete Exam
          </button>

          <button class="action-btn btn-success" @click="manageAttendance(exam)">
            <i class="fas fa-user-check"></i>
            Attendance
          </button>

          <button class="action-btn btn-students" @click="manageStudents(exam)">
            <i class="fas fa-users"></i>
            Students
          </button>
          <button class="action-btn btn-students" @click="manageSupervisors(exam)">
            <i class="fas fa-users"></i>
            Supervisor
          </button>
          <button
              v-if="exam.status === 'completed' || exam.status === 'ongoing'"
              class="action-btn btn-results"
              @click="manageResults(exam)"
          >
            <i class="fas fa-chart-line"></i>
            Results
          </button>
          <button
              v-if="exam.status === 'scheduled'"
              class="action-btn btn-danger"
              @click="confirmCancel(exam)"
          >
            <i class="fas fa-ban"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="exams.length > 0" class="pagination-section">
      <div class="pagination-info">
        Showing {{ exams.length }} exam{{ exams.length !== 1 ? 's' : '' }}
      </div>
      <div class="pagination">
        <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
            v-for="page in displayPages"
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Modals (keeping original modal components) -->
    <exam-form-modal
        :show="showModal"
        :exam="selectedExam"
        :is-edit="isEdit"
        :departments="departments"
        :exam-types="examTypes"
        @close="closeModal"
        @saved="onExamSaved"
    />

    <exam-view-modal
        :show="showViewModal"
        :exam="selectedExam"
        @close="closeViewModal"
        @edit="editFromView"
    />

    <exam-attendance-modal
        :show="showAttendanceModal"
        :exam="selectedExam"
        @close="closeAttendanceModal"
    />

    <exam-students-modal
        :show="showStudentsModal"
        :exam="selectedExam"
        @close="closeStudentsModal"
    />

    <exam-supervisors-modal
        :show="showSupervisorsModal"
        :exam="selectedExam"
        @close="closeSupervisorsModal"
    />

    <exam-results-modal
        :show="showResultsModal"
        :exam="selectedExam"
        @close="closeResultsModal"
    />
  </div>
</template>

<script>

import ExamFormModal from './ExamFormModal.vue';
import ExamViewModal from './ExamViewModal.vue';
import ExamAttendanceModal from './ExamAttendanceModal.vue';
import ExamStudentsModal from './ExamStudentsModal.vue';
import ExamSupervisorsModal from './ExamSupervisorsModal.vue';
import ExamResultsModal from './ExamResultsModal.vue';

export default {
  name: 'ExamManagement',

  components: {
    ExamFormModal,
    ExamViewModal,
    ExamAttendanceModal,
    ExamStudentsModal,
    ExamSupervisorsModal,
    ExamResultsModal
  },

  data() {
    return {
      exams: [],
      departments: [],
      examTypes: [],
      loading: false,
      searchQuery: '',
      showAdvancedFilters: false,
      filters: {
        department_id: '',
        exam_type_id: '',
        year: '',
        semester: '',
        status: '',
        start_date: '',
        end_date: ''
      },
      quickFilter: 'upcoming',
      quickFilters: [
        { value: 'upcoming', label: 'Upcoming', icon: 'fas fa-calendar-plus' },
        { value: 'today', label: 'Today', icon: 'fas fa-calendar-day' },
        { value: 'thisweek', label: 'This Week', icon: 'fas fa-calendar-week' },
        { value: 'all', label: 'All Exams', icon: 'fas fa-calendar-alt' }
      ],
      stats: {
        upcoming: 0,
        today: 0,
        ongoing: 0,
        completed: 0
      },
      showModal: false,
      showViewModal: false,
      showAttendanceModal: false,
      showStudentsModal: false,
      showSupervisorsModal: false,
      showResultsModal: false,
      selectedExam: null,
      isEdit: false,
      currentPage: 1,
      totalPages: 1
    };
  },

  computed: {
    displayPages() {
      const pages = [];
      const maxPages = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
      let end = Math.min(this.totalPages, start + maxPages - 1);

      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },

  mounted() {
    this.fetchDepartments();
    this.fetchExamTypes();
    this.setQuickFilter('upcoming');
    this.updateStats();
  },

  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$api.get('/departments');
        this.departments = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    async fetchExamTypes() {
      try {
        const response = await this.$api.get('/get-exam-types');
        this.examTypes = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching exam types:', error);
      }
    },

    async fetchExams() {
      this.loading = true;
      try {
        const response = await this.$api.get('/exams', {
          params: {
            page: this.currentPage,
            search: this.searchQuery,
            ...this.filters
          }
        });

        this.exams = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
        this.updateStats();
      } catch (error) {
        console.error('Error fetching exams:', error);
        this.$toast.error('Failed to load exams');
      } finally {
        this.loading = false;
      }
    },

    async startExam(exam) {
      if (!confirm(`Start exam "${exam.title}"? This will allow attendance and mark the exam as ongoing.`)) {
        return;
      }

      try {
        const response = await this.$api.post(`/exams/${exam.id}/start`);

        if (response.data.success) {
          this.$toast.success('Exam started successfully');
          // Update local exam object
          exam.status = 'ongoing';
          // Or refresh the list
          this.fetchExams();
        }
      } catch (error) {
        console.error('Error starting exam:', error);
        const message = error.response?.data?.message || 'Failed to start exam';
        this.$toast.error(message);
      }
    },

    async completeExam(exam) {
      if (!confirm(`Mark exam "${exam.title}" as completed? This action will finalize the exam.`)) {
        return;
      }

      try {
        const response = await this.$api.post(`/exams/${exam.id}/complete`);

        if (response.data.success) {
          this.$toast.success('Exam completed successfully');
          exam.status = 'completed';
          this.fetchExams();
        }
      } catch (error) {
        console.error('Error completing exam:', error);
        const message = error.response?.data?.message || 'Failed to complete exam';
        this.$toast.error(message);
      }
    },

    updateStats() {
      // Calculate stats from exams
      this.stats = {
        upcoming: this.exams.filter(e => e.status === 'scheduled').length,
        today: this.exams.filter(e => this.isToday(e.exam_date)).length,
        ongoing: this.exams.filter(e => e.status === 'ongoing').length,
        completed: this.exams.filter(e => e.status === 'completed').length
      };
    },

    isToday(date) {
      const today = new Date().toISOString().split('T')[0];
      return date === today;
    },

    setQuickFilter(filter) {
      this.quickFilter = filter;
      const today = new Date().toISOString().split('T')[0];

      switch(filter) {
        case 'upcoming':
          this.filters.start_date = null;
          this.filters.end_date = '';
          this.filters.status = 'scheduled';
          break;
        case 'today':
          this.filters.start_date = today;
          this.filters.end_date = today;
          this.filters.status = '';
          break;
        case 'thisweek':
          this.filters.start_date = today;
          var nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          this.filters.end_date = nextWeek.toISOString().split('T')[0];
          this.filters.status = 'scheduled';
          break;
        case 'all':
          this.filters.start_date = '';
          this.filters.end_date = '';
          this.filters.status = '';
          break;
      }

      this.fetchExams();
    },

    searchExams() {
      this.currentPage = 1;
      this.fetchExams();
    },

    applyFilters() {
      this.currentPage = 1;
      this.quickFilter = null;
      this.fetchExams();
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchExams();
      }
    },

    showCreateModal() {
      this.selectedExam = null;
      this.isEdit = false;
      this.showModal = true;
    },

    editExam(exam) {
      this.selectedExam = { ...exam };
      this.isEdit = true;
      this.showModal = true;
    },

    viewExam(exam) {
      this.selectedExam = exam;
      this.showViewModal = true;
    },

    editFromView(exam) {
      this.closeViewModal();
      this.editExam(exam);
    },

    manageAttendance(exam) {
      this.selectedExam = exam;
      this.showAttendanceModal = true;
    },

    manageStudents(exam) {
      this.selectedExam = exam;
      this.showStudentsModal = true;
    },

    manageSupervisors(exam) {
      this.selectedExam = exam;
      this.showSupervisorsModal = true;
    },

    manageResults(exam) {
      this.selectedExam = exam;
      this.showResultsModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedExam = null;
    },

    closeViewModal() {
      this.showViewModal = false;
    },

    closeAttendanceModal() {
      this.showAttendanceModal = false;
    },

    closeStudentsModal() {
      this.showStudentsModal = false;
    },

    closeSupervisorsModal() {
      this.showSupervisorsModal = false;
    },

    closeResultsModal() {
      this.showResultsModal = false;
    },

    onExamSaved() {
      this.closeModal();
      this.fetchExams();
      this.$toast.success('Exam saved successfully!');
    },

    async confirmCancel(exam) {
      if (confirm(`Are you sure you want to cancel "${exam.title}"?`)) {
        await this.cancelExam(exam.id);
      }
    },

    async cancelExam(id) {
      try {
        await this.$api.post(`/exams/${id}/cancel`);
        this.$toast.success('Exam cancelled successfully!');
        this.fetchExams();
      } catch (error) {
        console.error('Error cancelling exam:', error);
        this.$toast.error('Failed to cancel exam');
      }
    },

    getMonth(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    },

    getDay(date) {
      if (!date) return '';
      return new Date(date).getDate();
    },

    formatTime(time) {
      if (!time) return '';
      return new Date('2000-01-01 ' + time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.exam-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* Header Section */
.page-header {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  color: #667eea;
}

.page-subtitle {
  color: #718096;
  margin: 0;
  font-size: 1rem;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-upcoming .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-today .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-ongoing .stat-icon {
  background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
  color: white;
}

.stat-completed .stat-icon {
  background: linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%);
  color: white;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.quick-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.quick-filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.quick-filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.advanced-filters {
  margin-top: 1.5rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.filter-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-input {
  padding-left: 2.5rem;
}

.toggle-filters-btn {
  background: #f7fafc;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.toggle-filters-btn:hover {
  background: #edf2f7;
}

/* Loading State */
.loading-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Exam Grid */
.exam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.exam-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.exam-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.exam-card-header {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  position: relative;
}

.exam-card-header.status-scheduled {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.exam-card-header.status-ongoing {
  background: linear-gradient(135deg, #fad96115 0%, #f76b1c15 100%);
}

.exam-card-header.status-completed {
  background: linear-gradient(135deg, #48c6ef15 0%, #6f86d615 100%);
}

.exam-card-header.status-cancelled {
  background: linear-gradient(135deg, #f5576c15 0%, #f093fb15 100%);
}

.exam-date-badge {
  background: white;
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 70px;
}

.date-month {
  font-size: 0.75rem;
  font-weight: 700;
  color: #667eea;
}

.date-day {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.exam-title-section {
  flex: 1;
}

.exam-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.exam-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  font-size: 0.85rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-scheduled {
  background: #667eea;
  color: white;
}

.badge-ongoing {
  background: #f76b1c;
  color: white;
}

.badge-completed {
  background: #48c6ef;
  color: white;
}

.badge-cancelled {
  background: #f5576c;
  color: white;
}

.exam-card-body {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.info-item i {
  color: #667eea;
  margin-top: 0.25rem;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 600;
}

.exam-card-footer {
  padding: 1rem 1.5rem;
  background: #f7fafc;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  min-width: calc(50% - 0.25rem);
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-edit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
}

.btn-students {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-students:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.btn-results {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.btn-results:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(235, 51, 73, 0.4);
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  grid-column: 1 / -1;
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
}

/* Pagination */
.pagination-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pagination-info {
  color: #718096;
  font-weight: 600;
}

.pagination {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .exam-management {
    padding: 1rem;
  }

  .page-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .exam-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .pagination-section {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>