<template>
  <div class="report-container">
    <!-- Header Section -->
    <div class="report-header">
      <h1 class="report-title">Exam Schedule Report</h1>
      <p class="report-subtitle">View upcoming and completed examination schedules</p>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <input
              type="text"
              v-model="filters.search"
              placeholder="Search by exam or subject..."
              class="search-input"
              @input="handleSearch"
          />
        </div>

        <div class="filter-item">
          <select v-model="filters.department_id" @change="fetchSchedule" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.exam_type" @change="fetchSchedule" class="filter-select">
            <option value="">All Exam Types</option>
            <option v-for="type in exam_types" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.status" @change="fetchSchedule" class="filter-select">
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="date-range-row">
        <div class="date-item">
          <label>From Date:</label>
          <input
              type="date"
              v-model="filters.from_date"
              @change="fetchSchedule"
              class="date-input"
          />
        </div>
        <div class="date-item">
          <label>To Date:</label>
          <input
              type="date"
              v-model="filters.to_date"
              @change="fetchSchedule"
              class="date-input"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading exam schedule...</p>
    </div>

    <!-- Exam Schedule Table -->
    <div v-else-if="examSchedules.length > 0" class="schedule-card">
      <div class="table-container">
        <table class="schedule-table">
          <thead>
          <tr>
            <th>Exam Title</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Date & Time</th>
            <th>Duration</th>
            <th>Department</th>
            <th>Teacher</th>
            <th>Room</th>
            <th>Marks</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="exam in examSchedules"
              :key="exam.id"
              class="schedule-row"
              :class="{ 'today-exam': exam.is_today, 'completed-exam': exam.status === 'completed' }"
          >
            <td class="exam-title-cell">
              <div class="exam-title">{{ exam.exam_title }}</div>
              <div v-if="exam.is_today" class="today-badge">TODAY</div>
            </td>

            <td>
              <div class="subject-name">{{ exam.subject }}</div>
              <div class="subject-code">{{ exam.subject_code }}</div>
            </td>

            <td>
                <span class="type-badge" :class="`type-${exam.exam_type}`">
                  {{ exam.exam_type }}
                </span>
            </td>

            <td class="datetime-cell">
              <div class="exam-date">
                <span class="date-icon">📅</span>
                {{ formatDate(exam.exam_date) }}
              </div>
              <div class="exam-time">
                <span class="time-icon">🕐</span>
                {{ formatTime(exam.start_time) }} - {{ formatTime(exam.end_time) }}
              </div>
            </td>

            <td class="duration-cell">{{ exam.duration }} mins</td>

            <td>{{ exam.department }}</td>

            <td class="teacher-cell">
              <span class="teacher-icon">👨‍🏫</span>
              {{ exam.teacher }}
            </td>

            <td class="room-cell">
              <div class="room-number">{{ exam.classroom }}</div>
              <div class="building">{{ exam.building }}</div>
            </td>

            <td class="marks-cell">{{ exam.total_marks }}</td>

            <td>
                <span :class="['status-badge', `status-${exam.status}`]">
                  {{ exam.status.toUpperCase() }}
                </span>
              <div v-if="exam.days_until !== null && exam.status === 'upcoming'" class="days-info">
                in {{ exam.days_until }} days
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
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
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>No Exam Schedules Found</h3>
      <p>Try adjusting your filters or date range</p>
    </div>

    <!-- Quick Stats -->
    <div v-if="!loading && examSchedules.length > 0" class="stats-section">
      <div class="stat-card stat-upcoming">
        <div class="stat-icon">🔜</div>
        <div class="stat-value">{{ upcomingCount }}</div>
        <div class="stat-label">Upcoming Exams</div>
      </div>

      <div class="stat-card stat-today">
        <div class="stat-icon">📌</div>
        <div class="stat-value">{{ todayCount }}</div>
        <div class="stat-label">Exams Today</div>
      </div>

      <div class="stat-card stat-completed">
        <div class="stat-icon">✅</div>
        <div class="stat-value">{{ completedCount }}</div>
        <div class="stat-label">Completed</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ExamScheduleReport',
  data() {
    return {
      examSchedules: [],
      departments: [],
      exam_types: [],
      loading: false,
      filters: {
        search: '',
        department_id: '',
        exam_type: '',
        status: '',
        from_date: '',
        to_date: '',
      },
      currentPage: 1,
      lastPage: 1,
      searchTimeout: null,
    };
  },
  computed: {
    upcomingCount() {
      return this.examSchedules.filter(exam => exam.status === 'upcoming').length;
    },
    todayCount() {
      return this.examSchedules.filter(exam => exam.is_today).length;
    },
    completedCount() {
      return this.examSchedules.filter(exam => exam.status === 'completed').length;
    },
  },
  mounted() {
    this.fetchDepartments();
    this.fetchSchedule();
    this.fetchExamTypes();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchExamTypes() {
      try {
        const response = await this.$api.get('/get-exam-types');
        this.exam_types = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchSchedule() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          ...this.filters,
        };
        const response = await this.$api.get('/reports/exam-schedule', { params });
        this.examSchedules = response.data.data.data;
        this.currentPage = response.data.data.current_page;
        this.lastPage = response.data.data.last_page;
      } catch (error) {
        console.error('Error fetching exam schedule:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchSchedule();
      }, 500);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
    formatTime(time) {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchSchedule();
      }
    },
    nextPage() {
      if (this.currentPage < this.lastPage) {
        this.currentPage++;
        this.fetchSchedule();
      }
    },
  },
};
</script>

<style scoped>
/* Main Container */
.report-container {
  padding: 30px;
  /*max-width: 1600px;*/
  /*margin: 0 auto;*/
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
  margin-bottom: 15px;
}

.date-range-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item,
.date-item {
  flex: 1;
  min-width: 200px;
}

.date-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 5px;
}

.search-input,
.filter-select,
.date-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus,
.filter-select:focus,
.date-input:focus {
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

/* Schedule Card */
.schedule-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 25px;
}

.table-container {
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.schedule-table thead {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-bottom: 2px solid #e5e7eb;
}

.schedule-table th {
  padding: 18px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.schedule-row {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.schedule-row:hover {
  background: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.today-exam {
  background: rgba(59, 130, 246, 0.05);
  border-left: 4px solid #3b82f6;
}

.completed-exam {
  opacity: 0.7;
  background: #fafafa;
}

.schedule-table td {
  padding: 18px 16px;
  font-size: 14px;
  color: #1f2937;
}

/* Exam Title Cell */
.exam-title-cell {
  min-width: 200px;
}

.exam-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 5px;
}

.today-badge {
  display: inline-block;
  padding: 3px 8px;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Subject Cell */
.subject-name {
  font-weight: 600;
  color: #111827;
}

.subject-code {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Type Badge */
.type-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.type-midterm {
  background: #dbeafe;
  color: #1e40af;
}

.type-final {
  background: #fce7f3;
  color: #9f1239;
}

.type-quiz {
  background: #fef3c7;
  color: #92400e;
}

.type-practical {
  background: #d1fae5;
  color: #065f46;
}

/* DateTime Cell */
.datetime-cell {
  min-width: 180px;
}

.exam-date,
.exam-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.exam-date {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.exam-time {
  color: #6b7280;
}

.date-icon,
.time-icon {
  font-size: 14px;
}

/* Duration Cell */
.duration-cell {
  font-weight: 600;
  color: #7c3aed;
}

/* Teacher Cell */
.teacher-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.teacher-icon {
  font-size: 16px;
}

/* Room Cell */
.room-cell {
  min-width: 120px;
}

.room-number {
  font-weight: 600;
  color: #111827;
}

.building {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Marks Cell */
.marks-cell {
  font-weight: 700;
  color: #059669;
  text-align: center;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-upcoming {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.days-info {
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
  font-weight: 500;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 25px;
  border-top: 1px solid #e5e7eb;
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

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-upcoming {
  border-left: 4px solid #3b82f6;
}

.stat-today {
  border-left: 4px solid #f59e0b;
}

.stat-completed {
  border-left: 4px solid #10b981;
}

.stat-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
}

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

  .filter-row,
  .date-range-row {
    flex-direction: column;
  }

  .filter-item,
  .date-item {
    width: 100%;
  }

  .table-container {
    overflow-x: scroll;
  }
}
</style>