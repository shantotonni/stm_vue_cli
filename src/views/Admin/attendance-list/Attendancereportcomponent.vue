<template>
  <div class="report-container">
    <!-- Header -->
    <div class="page-header">
      <h1>📊 Attendance Reports & Analytics</h1>
      <p>Comprehensive attendance tracking and analysis</p>
    </div>

    <!-- Filter Card -->
    <div class="filter-card">
      <div class="filter-header">
        <h2>🔍 Filters</h2>
        <button @click="resetFilters" class="btn-link">Reset All</button>
      </div>

      <div class="filter-grid">
        <div class="filter-group">
          <label>Report Type</label>
          <select v-model="reportType" @change="loadReport" class="select-input">
            <option value="dashboard">📈 Dashboard Analytics</option>
            <option value="students">👥 Student Summary</option>
            <option value="subjects">📚 Subject-wise</option>
            <option value="departments">🏢 Department-wise</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Department</label>
          <select v-model="filters.department_id" class="select-input">
            <option :value="null">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Subject</label>
          <select v-model="filters.subject_id" class="select-input">
            <option :value="null">All Subjects</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Start Date</label>
          <input type="date" v-model="filters.start_date" class="date-input" />
        </div>

        <div class="filter-group">
          <label>End Date</label>
          <input type="date" v-model="filters.end_date" class="date-input" />
        </div>

        <div class="filter-group filter-actions">
          <button @click="loadReport" class="btn btn-primary">
            🔍 Search
          </button>
          <button @click="exportReport" class="btn btn-success">
            📥 Export
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-large"></div>
      <p>Loading report data...</p>
    </div>

    <!-- Dashboard View -->
    <div v-else-if="reportType === 'dashboard'" class="dashboard-view">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-box stat-primary">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">{{ dashboardData.overview?.total_classes || 0 }}</div>
            <div class="stat-label">Total Classes</div>
          </div>
        </div>

        <div class="stat-box stat-success">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-value">{{ dashboardData.overview?.present_count || 0 }}</div>
            <div class="stat-label">Present</div>
          </div>
        </div>

        <div class="stat-box stat-warning">
          <div class="stat-icon">⚠️</div>
          <div class="stat-info">
            <div class="stat-value">{{ dashboardData.low_attendance_students?.count || 0 }}</div>
            <div class="stat-label">Low Attendance</div>
          </div>
        </div>

        <div class="stat-box stat-info">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">{{ dashboardData.overview?.overall_attendance_rate || 0 }}%</div>
            <div class="stat-label">Attendance Rate</div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <h3>📈 Daily Attendance Trend</h3>
          <canvas ref="trendChart"></canvas>
        </div>

        <div class="chart-card">
          <h3>🎯 Attendance Distribution</h3>
          <canvas ref="pieChart"></canvas>
        </div>
      </div>

      <!-- Low Attendance Students -->
      <div v-if="dashboardData.low_attendance_students?.students?.length > 0" class="table-card">
        <div class="table-header">
          <h3>⚠️ Students Below 75% Attendance</h3>
          <span class="badge badge-danger">
            {{ dashboardData.low_attendance_students.count }} Students
          </span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Attendance %</th>
              <th>Attended</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="student in dashboardData.low_attendance_students.students" :key="student.student_id">
              <td>{{ student.student_name }}</td>
              <td>{{ student.roll_number }}</td>
              <td>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="{ width: student.percentage + '%', background: getProgressColor(student.percentage) }"
                  ></div>
                  <span class="progress-text">{{ student.percentage }}%</span>
                </div>
              </td>
              <td>{{ student.attended_classes }}</td>
              <td>{{ student.total_classes }}</td>
              <td>
                <span class="badge badge-danger">Not Eligible</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student Summary View -->
    <div v-else-if="reportType === 'students'" class="report-view">
      <div class="table-card">
        <div class="table-header">
          <h3>👥 Student Attendance Summary</h3>
          <div class="header-badges">
            <span class="badge badge-success">Eligible: {{ studentSummary.eligible_count }}</span>
            <span class="badge badge-danger">Not Eligible: {{ studentSummary.not_eligible_count }}</span>
            <span class="badge badge-info">Avg: {{ studentSummary.average_attendance }}%</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Attendance %</th>
              <th>Attended</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="student in studentData" :key="student.student_id">
              <td><strong>{{ student.student_name }}</strong></td>
              <td>{{ student.roll_number }}</td>
              <td>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="{ width: student.percentage + '%', background: getProgressColor(student.percentage) }"
                  ></div>
                  <span class="progress-text">{{ student.percentage }}%</span>
                </div>
              </td>
              <td>{{ student.attended_classes }}</td>
              <td>{{ student.total_classes }}</td>
              <td>
                  <span :class="['badge', student.is_eligible ? 'badge-success' : 'badge-danger']">
                    {{ student.is_eligible ? '✅ Eligible' : '❌ Not Eligible' }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Subject-wise Report -->
    <div v-else-if="reportType === 'subjects'" class="report-view">
      <div class="table-card">
        <div class="table-header">
          <h3>📚 Subject-wise Attendance Report</h3>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
            <tr>
              <th>Subject</th>
              <th>Classes</th>
              <th>Students</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance Rate</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="subject in subjectData" :key="subject.subject_id">
              <td><strong>{{ subject.subject_name }}</strong></td>
              <td>{{ subject.total_classes }}</td>
              <td>{{ subject.total_students }}</td>
              <td>{{ subject.present_count }}</td>
              <td>{{ subject.absent_count }}</td>
              <td>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="{ width: subject.attendance_rate + '%', background: getProgressColor(subject.attendance_rate) }"
                  ></div>
                  <span class="progress-text">{{ subject.attendance_rate }}%</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Department-wise Report -->
    <div v-else-if="reportType === 'departments'" class="report-view">
      <div class="table-card">
        <div class="table-header">
          <h3>🏢 Department-wise Attendance Report</h3>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
            <tr>
              <th>Department</th>
              <th>Classes</th>
              <th>Students</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance Rate</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="dept in departmentData" :key="dept.department_id">
              <td><strong>{{ dept.department_name }}</strong></td>
              <td>{{ dept.total_classes }}</td>
              <td>{{ dept.total_students }}</td>
              <td>{{ dept.present_count }}</td>
              <td>{{ dept.absent_count }}</td>
              <td>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="{ width: dept.attendance_rate + '%', background: getProgressColor(dept.attendance_rate) }"
                  ></div>
                  <span class="progress-text">{{ dept.attendance_rate }}%</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
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
  name: 'AttendanceReportComponent',

  data() {
    return {
      loading: false,
      reportType: 'dashboard',
      filters: {
        department_id: null,
        subject_id: null,
        start_date: null,
        end_date: null
      },
      departments: [],
      subjects: [],
      dashboardData: {},
      studentData: [],
      studentSummary: {},
      subjectData: [],
      departmentData: [],
      trendChart: null,
      pieChart: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
    };
  },

  mounted() {
    this.loadDepartments();
    this.loadSubjects();
    this.loadReport();
  },

  beforeDestroy() {
    if (this.trendChart) this.trendChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
  },

  methods: {
    // Get auth token
    getAuthToken() {
      return localStorage.getItem('auth_token');
    },
    async loadDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async loadSubjects() {
      try {
        const response = await this.$api.get('/get-subjects');
        this.subjects = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    // Load report based on type
    async loadReport() {
      this.loading = true;
      try {
        const params = {
          ...this.filters,
        };

        switch (this.reportType) {
          case 'dashboard':
            await this.loadDashboard(params);
            break;
          case 'students':
            await this.loadStudentSummary(params);
            break;
          case 'subjects':
            await this.loadSubjectReport(params);
            break;
          case 'departments':
            await this.loadDepartmentReport(params);
            break;
        }
      } catch (error) {
        this.showToast('Failed to load report', 'error');
        console.error('Error loading report:', error);
      } finally {
        this.loading = false;
      }
    },

    // Load dashboard data
    async loadDashboard(params) {
      try {
        const response = await this.$api.get(`/attendance/reports/dashboard`, {params});
        this.dashboardData = response.data.data;

        this.$nextTick(() => {
          this.renderTrendChart();
          this.renderPieChart();
        });
      } catch (error) {
        console.error('Dashboard load error:', error);
      }
    },

    // Load student summary
    async loadStudentSummary(params) {
      try {
        const response = await this.$api.get(`/attendance/reports/students`, {params});

        this.studentData = response.data.data.students;
        this.studentSummary = response.data.data.summary;
      } catch (error) {
        console.error('Student summary load error:', error);
      }
    },

    // Load subject report
    async loadSubjectReport(params) {
      try {
        const response = await this.$api.get(`/attendance/reports/subjects`, {params});
        this.subjectData = response.data.data;
      } catch (error) {
        console.error('Subject report load error:', error);
      }
    },

    // Load department report
    async loadDepartmentReport(params) {
      try {
        const response = await this.$api.get(`/attendance/reports/departments`, {params});

        this.departmentData = response.data.data;
      } catch (error) {
        console.error('Department report load error:', error);
      }
    },

    // Render trend chart
    renderTrendChart() {
      if (this.trendChart) this.trendChart.destroy();

      const canvas = this.$refs.trendChart;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const dailyTrend = this.dashboardData.daily_trend || [];

      // Simple chart without Chart.js library
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = 300;

      ctx.clearRect(0, 0, width, height);

      if (dailyTrend.length === 0) {
        ctx.fillStyle = '#cbd5e0';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', width / 2, height / 2);
        return;
      }

      // Draw simple line chart
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const maxRate = 100;

      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 3;
      ctx.beginPath();

      dailyTrend.forEach((point, index) => {
        const x = padding + (chartWidth / (dailyTrend.length - 1)) * index;
        const y = height - padding - (point.rate / maxRate) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      dailyTrend.forEach((point, index) => {
        const x = padding + (chartWidth / (dailyTrend.length - 1)) * index;
        const y = height - padding - (point.rate / maxRate) * chartHeight;

        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    },

    // Render pie chart
    renderPieChart() {
      if (this.pieChart) this.pieChart.destroy();

      const canvas = this.$refs.pieChart;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const overview = this.dashboardData.overview || {};

      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = 300;

      ctx.clearRect(0, 0, width, height);

      const present = overview.present_count || 0;
      const late = overview.late_count || 0;
      const absent = (overview.total_records || 0) - present - late;
      const total = present + late + absent;

      if (total === 0) {
        ctx.fillStyle = '#cbd5e0';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', width / 2, height / 2);
        return;
      }

      // Draw pie chart
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;

      const data = [
        { value: present, color: '#48bb78', label: 'Present' },
        { value: late, color: '#ed8936', label: 'Late' },
        { value: absent, color: '#f56565', label: 'Absent' }
      ];

      let currentAngle = -Math.PI / 2;

      data.forEach(item => {
        const sliceAngle = (item.value / total) * Math.PI * 2;

        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        currentAngle += sliceAngle;
      });

      // Draw legend
      let legendY = height - 40;
      data.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.fillRect(20, legendY, 15, 15);
        ctx.fillStyle = '#2d3748';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${item.label}: ${item.value}`, 40, legendY + 12);
        legendY += 20;
      });
    },

    // Get progress color based on percentage
    getProgressColor(percentage) {
      if (percentage >= 75) return '#48bb78';
      if (percentage >= 60) return '#ed8936';
      return '#f56565';
    },

    // Reset filters
    resetFilters() {
      this.filters = {
        department_id: null,
        subject_id: null,
        start_date: null,
        end_date: null
      };
      this.loadReport();
    },

    // Export report
    exportReport() {
      this.showToast('Export functionality coming soon!', 'success');
    },

    // Show toast.js notification
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

.report-container {
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

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.btn-link:hover {
  text-decoration: underline;
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

.select-input,
.date-input {
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  background: white;
}

.select-input:focus,
.date-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 80px 20px;
  color: white;
}

.spinner-large {
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-box {
  background: white;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 600;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.chart-card h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
}

.chart-card canvas {
  width: 100% !important;
  height: 300px !important;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 25px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.table-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.header-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.badge-success { background: #48bb78; }
.badge-danger { background: #f56565; }
.badge-info { background: #4299e1; }
.badge-warning { background: #ed8936; }

/* Table */
.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f7fafc;
}

.data-table th {
  padding: 15px;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 14px;
}

.data-table tbody tr:hover {
  background: #f7fafc;
}

/* Progress Bar */
.progress-bar {
  position: relative;
  width: 100%;
  height: 28px;
  background: #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 14px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
  color: #2d3748;
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

.toast-success { background: #48bb78; }
.toast-error { background: #f56565; }

.toast-icon {
  font-size: 20px;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s;
}

.toast-enter, .toast-leave-to {
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

  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .data-table {
    font-size: 13px;
  }

  .data-table th,
  .data-table td {
    padding: 10px;
  }

  .toast {
    left: 10px;
    right: 10px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .report-container {
    padding: 10px;
  }

  .filter-card,
  .table-card,
  .chart-card {
    padding: 15px;
  }

  .stat-box {
    padding: 15px;
  }

  .stat-icon {
    font-size: 36px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>