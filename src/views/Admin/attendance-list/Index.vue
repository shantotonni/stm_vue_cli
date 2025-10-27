<template>
  <div class="class-selection-container">
    <!-- Header -->
    <div class="page-header">
      <h1>📚 Select Class for Attendance</h1>
      <p>Choose a class to mark attendance</p>
    </div>

    <!-- Filter Section -->
    <div class="filter-card">
      <div class="filter-grid">
        <div class="filter-group">
          <label>📂 Department</label>
          <select v-model="selectedDepartmentId" @change="loadSubjects" class="select-input">
            <option :value="null">Select Department</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>📖 Subject</label>
          <select v-model="selectedSubjectId" @change="loadClasses" class="select-input" :disabled="!selectedDepartmentId">
            <option :value="null">Select Subject</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>📅 Date Range</label>
          <select v-model="dateFilter" @change="loadClasses" class="select-input">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Status</label>
          <select v-model="statusFilter" @change="filterClasses" class="select-input">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading classes...</p>
    </div>

    <!-- Classes Grid -->
    <div v-else-if="filteredClasses.length > 0" class="classes-grid">
      <div v-for="classItem in filteredClasses" :key="classItem.id" class="class-card" @click="goToAttendance(classItem.id)">
        <div class="class-header">
          <div class="class-date">
            <div class="date-day">{{ formatDay(classItem.class_date) }}</div>
            <div class="date-month">{{ formatMonth(classItem.class_date) }}</div>
          </div>
          <div class="class-status">
            <span :class="['status-badge', `status-${classItem.status}`]">
              {{ getStatusText(classItem.status) }}
            </span>
          </div>
        </div>

        <div class="class-body">
          <h3>{{ classItem.topic }}</h3>
          <div class="class-info">
            <div class="info-item">
              <span class="icon">📖</span>
              <span>{{ classItem.subject_name }}</span>
            </div>
            <div class="info-item">
              <span class="icon">🏢</span>
              <span>{{ classItem.department_name }}</span>
            </div>
            <div class="info-item" v-if="classItem.actual_start_time">
              <span class="icon">🕒</span>
              <span>{{ classItem.actual_start_time }}</span>
            </div>
            <div class="info-item">
              <span class="icon">👥</span>
              <span>{{ classItem.total_students || 0 }} Students</span>
            </div>
          </div>

          <div v-if="classItem.attendance_marked" class="attendance-info">
            <div class="attendance-stats">
              <span class="stat-success">✅ {{ classItem.present_count || 0 }}</span>
              <span class="stat-danger">❌ {{ classItem.absent_count || 0 }}</span>
              <span class="stat-warning">⏰ {{ classItem.late_count || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="class-footer">
          <button class="btn btn-primary">
            {{ classItem.attendance_marked ? '✏️ Edit Attendance' : '📝 Mark Attendance' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No Classes Found</h3>
      <p v-if="!selectedDepartmentId">Please select a department and subject</p>
      <p v-else>No classes available for the selected filters</p>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'ClassSelectionPage',

  data() {
    return {
      loading: false,
      selectedDepartmentId: null,
      selectedSubjectId: null,
      dateFilter: 'week',
      statusFilter: 'all',
      departments: [],
      subjects: [],
      classes: [],
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
    };
  },

  computed: {
    filteredClasses() {
      if (this.statusFilter === 'all') {
        return this.classes;
      }
      return this.classes.filter(c => c.status === this.statusFilter);
    }
  },

  mounted() {
    this.loadDepartments();
  },

  methods: {
    // Get auth token
    getAuthToken() {
      return localStorage.getItem('auth_token');
    },

    // Load departments
    async loadDepartments() {
      try {
        // Replace with your actual API endpoint
        const response = await this.$api.get(`/get-departments`);
        this.departments = response.data.data || response.data;
      } catch (error) {
        console.error('Error loading departments:', error);
        this.showToast('Failed to load departments', 'error');
      }
    },

    // Load subjects based on department
    async loadSubjects() {
      if (!this.selectedDepartmentId) {
        this.subjects = [];
        this.classes = [];
        return;
      }

      try {
        // Replace with your actual API endpoint
        const response = await this.$api.get(`/departments/${this.selectedDepartmentId}/subjects`);
        this.subjects = response.data.data || response.data;
        this.selectedSubjectId = null;
        this.classes = [];
      } catch (error) {
        console.error('Error loading subjects:', error);
        this.showToast('Failed to load subjects', 'error');
      }
    },

    // Load classes
    async loadClasses() {
      if (!this.selectedSubjectId) {
        this.classes = [];
        return;
      }

      this.loading = true;
      try {
        const params = {
          department_id: this.selectedDepartmentId,
          subject_id: this.selectedSubjectId,
          date_filter: this.dateFilter
        };

        // Replace with your actual API endpoint
        const response = await this.$api.get(`/classes`, {params});

        this.classes = response.data.data || response.data;
      } catch (error) {
        console.error('Error loading classes:', error);
        this.showToast('Failed to load classes', 'error');
      } finally {
        this.loading = false;
      }
    },

    // Filter classes
    filterClasses() {
      // Already handled in computed property
    },

    // Navigate to attendance marking page
    goToAttendance(classId) {
      this.$router.push({
        name: 'MarkAttendance',
        params: { classId }
      });
    },

    // Format date
    formatDay(dateString) {
      const date = new Date(dateString);
      return date.getDate();
    },

    formatMonth(dateString) {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[date.getMonth()];
    },

    // Get status text
    getStatusText(status) {
      const statusMap = {
        scheduled: '📅 Scheduled',
        completed: '✅ Completed',
        cancelled: '❌ Cancelled',
        rescheduled: '🔄 Rescheduled'
      };
      return statusMap[status] || status;
    },

    // Show toast.js
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      };

      setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.class-selection-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* Page Header */
.page-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.page-header p {
  font-size: 18px;
  opacity: 0.9;
}

/* Filter Card */
.filter-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.select-input {
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  background: white;
}

.select-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-input:disabled {
  background: #f7fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 80px 20px;
  color: white;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Classes Grid */
.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.class-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  cursor: pointer;
}

.class-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.class-date {
  text-align: center;
}

.date-day {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 4px;
}

.class-status {
  text-align: right;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
}

.status-scheduled {
  background: rgba(66, 153, 225, 0.3);
}

.status-completed {
  background: rgba(72, 187, 120, 0.3);
}

.status-cancelled {
  background: rgba(245, 101, 101, 0.3);
}

.class-body {
  padding: 20px;
}

.class-body h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4a5568;
}

.info-item .icon {
  font-size: 16px;
}

.attendance-info {
  padding: 12px;
  background: #f7fafc;
  border-radius: 10px;
  margin-top: 15px;
}

.attendance-stats {
  display: flex;
  gap: 15px;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.stat-success {
  color: #48bb78;
}

.stat-danger {
  color: #f56565;
}

.stat-warning {
  color: #ed8936;
}

.class-footer {
  padding: 15px 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: white;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 28px;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 16px;
  opacity: 0.9;
}

/* Toast */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
}

.toast-success {
  background: #48bb78;
}

.toast-error {
  background: #f56565;
}

.toast-icon {
  font-size: 20px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .classes-grid {
    grid-template-columns: 1fr;
  }

  .class-card {
    margin-bottom: 15px;
  }

  .toast {
    left: 10px;
    right: 10px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .class-selection-container {
    padding: 10px;
  }

  .filter-card {
    padding: 15px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .date-day {
    font-size: 24px;
  }

  .class-body h3 {
    font-size: 18px;
  }
}
</style>