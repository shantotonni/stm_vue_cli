<template>
  <div class="report-container">
    <!-- Header Section -->
    <div class="report-header">
      <h1 class="report-title">Student Attendance Report</h1>
      <p class="report-subtitle">Track and monitor student attendance records</p>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <input
              type="text"
              v-model="filters.search"
              placeholder="Search by name or roll number..."
              class="search-input"
              @input="handleSearch"
          />
        </div>

        <div class="filter-item">
          <select v-model="filters.department_id" @change="fetchAttendance" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.month" @change="fetchAttendance" class="filter-select">
            <option value="">All Months</option>
            <option v-for="(month, index) in months" :key="index" :value="index + 1">
              {{ month }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.subject_id" @change="fetchAttendance" class="filter-select">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading attendance records...</p>
    </div>

    <!-- Attendance Grid -->
    <div v-else-if="attendanceRecords.length > 0" class="attendance-grid">
      <div
          v-for="record in attendanceRecords"
          :key="record.student_id"
          class="attendance-card"
      >
        <!-- Student Info -->
        <div class="card-header">
          <div class="student-avatar" :class="`avatar-${record.status_color}`">
            {{ getInitials(record.student_name) }}
          </div>
          <div class="student-info">
            <h3 class="student-name">{{ record.student_name }}</h3>
            <p class="student-details">Roll: {{ record.roll_number }}</p>
            <p class="student-details">{{ record.department }}</p>
          </div>
        </div>

        <!-- Circular Progress Bar -->
        <div class="progress-container">
          <svg class="progress-ring" width="140" height="140">
            <circle
                class="progress-ring-bg"
                stroke="#e5e7eb"
                stroke-width="10"
                fill="transparent"
                r="60"
                cx="70"
                cy="70"
            />
            <circle
                class="progress-ring-circle"
                :stroke="getProgressColor(record.percentage)"
                stroke-width="10"
                fill="transparent"
                r="60"
                cx="70"
                cy="70"
                :style="getProgressStyle(record.percentage)"
                stroke-linecap="round"
            />
          </svg>
          <div class="progress-text">
            <div class="percentage" :style="{ color: getProgressColor(record.percentage) }">
              {{ record.percentage }}%
            </div>
            <div class="percentage-label">Attendance</div>
          </div>
        </div>

        <!-- Attendance Stats -->
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value">{{ record.total_classes }}</div>
            <div class="stat-label">Total Classes</div>
          </div>
          <div class="stat-item stat-present">
            <div class="stat-value">{{ record.present }}</div>
            <div class="stat-label">Present</div>
          </div>
          <div class="stat-item stat-absent">
            <div class="stat-value">{{ record.absent }}</div>
            <div class="stat-label">Absent</div>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="status-badge-container">
          <span :class="['status-badge', `status-${record.status_color}`]">
            {{ getStatusText(record.percentage) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && attendanceRecords.length > 0" class="pagination">
      <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="pagination-btn"
      >
        ← Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ lastPage }}</span>
      <button
          @click="nextPage"
          :disabled="currentPage === lastPage"
          class="pagination-btn"
      >
        Next →
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No Attendance Records Found</h3>
      <p>Try adjusting your filters or check back later</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AttendanceReport',
  data() {
    return {
      attendanceRecords: [],
      departments: [],
      subjects: [],
      loading: false,
      filters: {
        search: '',
        department_id: '',
        month: new Date().getMonth() + 1,
        subject_id: '',
      },
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      currentPage: 1,
      lastPage: 1,
      searchTimeout: null,
    };
  },
  mounted() {
    this.fetchDepartments();
    this.fetchSubjects();
    this.fetchAttendance();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await axios.get('/api/departments');
        this.departments = response.data.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchSubjects() {
      try {
        const response = await axios.get('/api/subjects');
        this.subjects = response.data.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },
    async fetchAttendance() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          ...this.filters,
        };
        const response = await axios.get('/api/reports/attendance', { params });
        this.attendanceRecords = response.data.data.data;
        this.currentPage = response.data.data.current_page;
        this.lastPage = response.data.data.last_page;
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchAttendance();
      }, 500);
    },
    getInitials(name) {
      return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    },
    getProgressColor(percentage) {
      if (percentage >= 90) return '#10b981'; // Green
      if (percentage >= 75) return '#f59e0b'; // Yellow
      return '#ef4444'; // Red
    },
    getProgressStyle(percentage) {
      const circumference = 2 * Math.PI * 60;
      const offset = circumference - (percentage / 100) * circumference;
      return {
        strokeDasharray: `${circumference} ${circumference}`,
        strokeDashoffset: offset,
        transition: 'stroke-dashoffset 1s ease',
      };
    },
    getStatusText(percentage) {
      if (percentage >= 90) return 'Excellent';
      if (percentage >= 75) return 'Good';
      return 'Below Average';
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchAttendance();
      }
    },
    nextPage() {
      if (this.currentPage < this.lastPage) {
        this.currentPage++;
        this.fetchAttendance();
      }
    },
  },
};
</script>

<style scoped>
/* Main Container */
.report-container {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Header Section */
.report-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.report-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.report-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 220px;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Attendance Grid */
.attendance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.attendance-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.attendance-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.avatar-green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.avatar-yellow {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.avatar-red {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.student-info {
  flex: 1;
}

.student-name {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.student-details {
  margin: 2px 0;
  font-size: 13px;
  color: #6b7280;
}

/* Progress Container */
.progress-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 25px 0;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 1s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percentage {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 5px;
}

.percentage-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Stats Container */
.stats-container {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin: 25px 0;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 5px;
}

.stat-present .stat-value {
  color: #10b981;
}

.stat-absent .stat-value {
  color: #ef4444;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Status Badge */
.status-badge-container {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-green {
  background: #d1fae5;
  color: #065f46;
}

.status-yellow {
  background: #fef3c7;
  color: #92400e;
}

.status-red {
  background: #fee2e2;
  color: #991b1b;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.pagination-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pagination-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #111827;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .report-container {
    padding: 15px;
  }

  .report-header {
    padding: 25px;
  }

  .report-title {
    font-size: 24px;
  }

  .attendance-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }
}
</style>