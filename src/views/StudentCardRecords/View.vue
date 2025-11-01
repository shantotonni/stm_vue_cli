<template>
  <div class="student-card-record-view">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-file-alt"></i>
          </div>
          <div>
            <h1>Card Record Details</h1>
            <p class="subtitle">Complete student card record information</p>
          </div>
        </div>
        <div class="action-buttons">
          <router-link
              :to="`/student-card-records/${id}/edit`"
              class="btn-edit"
          >
            <i class="fa fa-edit"></i>
            <span>Edit</span>
          </router-link>
          <router-link to="/student-card-records" class="btn-back">
            <i class="fa fa-arrow-left"></i>
            <span>Back to List</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="fa fa-spinner fa-spin"></i>
        <p>Loading record details...</p>
      </div>
    </div>

    <!-- Record Details -->
    <div v-else-if="record">
      <!-- Progress Stats Cards -->
      <div class="stats-cards">
        <div class="stat-card purple">
          <div class="stat-icon">
            <i class="fa fa-star"></i>
          </div>
          <div class="stat-info">
            <h3>{{ record.total_marks_obtained || 0 }}</h3>
            <p>Total Marks</p>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">
            <i class="fa fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ record.total_attendance || 0 }}</h3>
            <p>Total Attendance</p>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-icon">
            <i class="fa fa-chart-line"></i>
          </div>
          <div class="stat-info">
            <h3>{{ record.attendance_percentage || 0 }}%</h3>
            <p>Attendance Rate</p>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">
            <i class="fa fa-tasks"></i>
          </div>
          <div class="stat-info">
            <h3>{{ record.structure_progress ? record.structure_progress.length : 0 }}</h3>
            <p>Structure Items</p>
          </div>
        </div>
      </div>

      <!-- Basic Information Card -->
      <div class="info-card">
        <div class="card-header purple">
          <i class="fa fa-info-circle"></i>
          <h3>Basic Information</h3>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <label>
                <i class="fa fa-barcode"></i>
                Card Number
              </label>
              <div class="value card-number">{{ record.card_number || 'N/A' }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-user-graduate"></i>
                Student
              </label>
              <div class="value">{{ record.student ? record.student.name : 'N/A' }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-id-card"></i>
                Card Type
              </label>
              <div class="value">{{ record.card_type ? record.card_type.card_name : 'N/A' }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-calendar-alt"></i>
                Academic Year
              </label>
              <div class="value">{{ record.academic_year ? record.academic_year.name : 'N/A' }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-info-circle"></i>
                Status
              </label>
              <div class="value">
                <span class="status-badge" :class="getStatusClass(record.status)">
                  {{ formatStatus(record.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Placement Information -->
      <div class="info-card">
        <div class="card-header blue">
          <i class="fa fa-map-marker-alt"></i>
          <h3>Placement Information</h3>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <label>
                <i class="fa fa-user-injured"></i>
                Cadaver
              </label>
              <div class="value">{{ record.cadaver ? record.cadaver.name : 'Not Assigned' }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-flask"></i>
                Specimen
              </label>
              <div class="value">{{ record.specimen ? record.specimen.name : 'Not Assigned' }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-calendar-check"></i>
                Start Date
              </label>
              <div class="value">{{ formatDate(record.placement_start_date) }}</div>
            </div>
            <div class="info-item">
              <label>
                <i class="fa fa-calendar-times"></i>
                End Date
              </label>
              <div class="value">{{ formatDate(record.placement_end_date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Structure Progress -->
      <div v-if="record.structure_progress && record.structure_progress.length > 0" class="table-card">
        <div class="card-header orange">
          <i class="fa fa-tasks"></i>
          <h3>Structure Progress</h3>
        </div>
        <div class="table-wrapper">
          <table class="modern-table">
            <thead>
            <tr>
              <th><i class="fa fa-sitemap"></i> Structure Level</th>
              <th><i class="fa fa-calendar-plus"></i> Date Started</th>
              <th><i class="fa fa-calendar-check"></i> Date Examined</th>
              <th><i class="fa fa-star"></i> Marks</th>
              <th><i class="fa fa-info-circle"></i> Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="progress in record.structure_progress" :key="progress.id">
              <td>
                  <span class="structure-title">
                    {{ progress.structure_level ? progress.structure_level.title : 'N/A' }}
                  </span>
              </td>
              <td>{{ formatDate(progress.date_of_beginning) }}</td>
              <td>{{ formatDate(progress.date_of_examination) }}</td>
              <td>
                  <span class="marks-display">
                    <strong>{{ progress.marks_obtained || 0 }}</strong> / {{ progress.max_marks || 0 }}
                  </span>
              </td>
              <td>
                  <span class="progress-badge" :class="progress.is_completed ? 'completed' : 'in-progress'">
                    <i :class="progress.is_completed ? 'fa fa-check-circle' : 'fa fa-spinner'"></i>
                    {{ progress.is_completed ? 'Completed' : 'In Progress' }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Term Exam Results -->
      <div v-if="record.term_exam_results && record.term_exam_results.length > 0" class="table-card">
        <div class="card-header red">
          <i class="fa fa-graduation-cap"></i>
          <h3>Term Exam Results</h3>
        </div>
        <div class="table-wrapper">
          <table class="modern-table">
            <thead>
            <tr>
              <th><i class="fa fa-book"></i> Term</th>
              <th><i class="fa fa-calendar"></i> Exam Date</th>
              <th><i class="fa fa-star"></i> Marks Obtained</th>
              <th><i class="fa fa-calculator"></i> Total Marks</th>
              <th><i class="fa fa-percentage"></i> Percentage</th>
              <th><i class="fa fa-comment"></i> Remarks</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="result in record.term_exam_results" :key="result.id">
              <td>
                  <span class="term-badge">
                    {{ result.term_exam ? result.term_exam.term_name : 'N/A' }}
                  </span>
              </td>
              <td>{{ formatDate(result.exam_date) }}</td>
              <td>
                <strong class="marks-obtained">{{ result.marks_obtained || 0 }}</strong>
              </td>
              <td>{{ result.term_exam ? result.term_exam.total_marks : 0 }}</td>
              <td>
                  <span class="percentage-badge" :class="getPercentageClass(result.percentage)">
                    {{ result.percentage || 0 }}%
                  </span>
              </td>
              <td>
                <span class="remarks">{{ result.remarks || '-' }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Overall Remarks -->
      <div v-if="record.overall_remarks" class="info-card">
        <div class="card-header green">
          <i class="fa fa-comment-alt"></i>
          <h3>Overall Remarks</h3>
        </div>
        <div class="card-body">
          <div class="remarks-content">
            <p>{{ record.overall_remarks }}</p>
          </div>
        </div>
      </div>

      <!-- Signatures -->
      <div class="info-card">
        <div class="card-header teal">
          <i class="fa fa-signature"></i>
          <h3>Signatures</h3>
        </div>
        <div class="card-body">
          <div class="signatures-grid">
            <div class="signature-item">
              <div class="signature-icon">
                <i class="fa fa-user-tie"></i>
              </div>
              <div class="signature-info">
                <label>Batch Teacher</label>
                <div v-if="record.batch_teacher_signature" class="signed">
                  <span class="status">
                    <i class="fa fa-check-circle"></i>
                    Signed
                  </span>
                  <small>{{ formatDate(record.batch_teacher_signed_at) }}</small>
                </div>
                <div v-else class="not-signed">
                  <span class="status">
                    <i class="fa fa-times-circle"></i>
                    Not Signed
                  </span>
                </div>
              </div>
            </div>
            <div class="signature-item">
              <div class="signature-icon">
                <i class="fa fa-user-shield"></i>
              </div>
              <div class="signature-info">
                <label>Head of Department</label>
                <div v-if="record.hod_signature" class="signed">
                  <span class="status">
                    <i class="fa fa-check-circle"></i>
                    Signed
                  </span>
                  <small>{{ formatDate(record.hod_signed_at) }}</small>
                </div>
                <div v-else class="not-signed">
                  <span class="status">
                    <i class="fa fa-times-circle"></i>
                    Not Signed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'StudentCardRecordView',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      record: null,
      loading: false
    };
  },
  mounted() {
    this.loadRecord();
  },
  methods: {
    async loadRecord() {
      this.loading = true;
      try {
        const response = await api.studentCardRecords.getById(this.id);
        this.record = response.data;
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load record',
          type: 'danger'
        });
        this.$router.push('/student-card-records');
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(status) {
      const classes = {
        not_started: 'status-not-started',
        in_progress: 'status-in-progress',
        completed: 'status-completed',
        failed: 'status-failed'
      };
      return classes[status] || 'status-not-started';
    },
    getPercentageClass(percentage) {
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    },
    formatStatus(status) {
      return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.student-card-record-view {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Modern Header with Gradient */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.title-section h1 {
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  margin: 5px 0 0 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-edit,
.btn-back {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-edit {
  background: white;
  color: #f59e0b;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  color: white;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner i {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 20px;
  display: block;
}

.loading-spinner p {
  color: #4a5568;
  font-size: 16px;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  width: 100%;
  opacity: 0.1;
}

.stat-card.purple::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.green::before {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.blue::before {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.stat-card.orange::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.stat-card.purple .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.green .stat-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.blue .stat-icon {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.stat-card.orange .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-info h3 {
  font-size: 36px;
  color: #2d3748;
  font-weight: 700;
  margin: 0;
}

.stat-info p {
  font-size: 14px;
  color: #718096;
  margin: 5px 0 0 0;
}

/* Info Cards */
.info-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.card-header {
  padding: 20px 25px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header.purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-header.blue {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.card-header.orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-header.red {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.card-header.green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.card-header.teal {
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
}

.card-header i {
  font-size: 24px;
}

.card-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.card-body {
  padding: 30px 25px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item label i {
  color: #667eea;
  font-size: 14px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.value.card-number {
  font-family: 'Courier New', monospace;
  color: #667eea;
  font-size: 18px;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-not-started {
  background: #e2e8f0;
  color: #4a5568;
}

.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.modern-table th {
  padding: 18px 15px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.8;
}

.modern-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modern-table tbody tr:hover {
  background: #f7fafc;
}

.modern-table td {
  padding: 18px 15px;
  font-size: 14px;
  color: #2d3748;
}

.structure-title {
  font-weight: 600;
  color: #667eea;
}

.marks-display {
  color: #2d3748;
}

.marks-display strong {
  color: #667eea;
  font-size: 16px;
}

.progress-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.progress-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.progress-badge.in-progress {
  background: #fef3c7;
  color: #92400e;
}

.term-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #e6fffa;
  color: #047857;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.marks-obtained {
  color: #667eea;
  font-size: 16px;
}

.percentage-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.percentage-badge.excellent {
  background: #d1fae5;
  color: #065f46;
}

.percentage-badge.good {
  background: #dbeafe;
  color: #1e40af;
}

.percentage-badge.average {
  background: #fef3c7;
  color: #92400e;
}

.percentage-badge.poor {
  background: #fee2e2;
  color: #991b1b;
}

.remarks {
  font-style: italic;
  color: #4a5568;
}

/* Remarks Content */
.remarks-content {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.remarks-content p {
  color: #2d3748;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
}

/* Signatures Grid */
.signatures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.signature-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.signature-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.signature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.signature-info {
  flex: 1;
}

.signature-info label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.signed .status,
.not-signed .status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
}

.signed .status {
  color: #065f46;
}

.signed .status i {
  color: #10b981;
}

.not-signed .status {
  color: #991b1b;
}

.not-signed .status i {
  color: #ef4444;
}

.signed small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #718096;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .student-card-record-view {
    padding: 20px 15px;
  }

  .header-section {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .title-section h1 {
    font-size: 26px;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-edit,
  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .signatures-grid {
    grid-template-columns: 1fr;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }
}

@media (max-width: 480px) {
  .student-card-record-view {
    padding: 15px 10px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .stat-info h3 {
    font-size: 28px;
  }

  .card-body {
    padding: 20px 15px;
  }
}

/* Scrollbar Styling */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Print Styles */
@media print {
  .header-section {
    background: white;
    color: black;
    box-shadow: none;
  }

  .action-buttons {
    display: none;
  }

  .stat-card,
  .info-card,
  .table-card {
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }
}
</style>