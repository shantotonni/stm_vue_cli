<template>
  <div class="student-progress-card-report">
    <!-- Header Section -->
    <div class="report-header">
      <div class="college-info text-center mb-4">
        <div class="logo-wrapper">
          <div class="logo-circle">
            <i class="fa fa-graduation-cap"></i>
          </div>
        </div>
        <h2 class="college-name">{{ collegeName }}</h2>
        <h4 class="report-title">Student Progress Card Report</h4>
      </div>

      <!-- Student Selection -->
      <div class="row filter-section">
        <div class="col-md-4 mb-3">
          <label class="form-label">
            <i class="fa fa-id-card mr-2"></i>Student ID
          </label>
          <input
              v-model="filters.studentId"
              type="text"
              class="form-control modern-input"
              placeholder="Enter Student ID"
          />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">
            <i class="fa fa-credit-card mr-2"></i>Card Type
          </label>
          <select v-model="filters.cardTypeId" class="form-control modern-input">
            <option value="">Select Card Type</option>
            <option
                v-for="card in availableCards"
                :key="card.card_type_id"
                :value="card.card_type_id"
            >
              {{ card.card_name }}
            </option>
          </select>
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">&nbsp;</label>
          <button @click="fetchReport" class="btn btn-primary btn-block modern-btn">
            <i class="fa fa-search mr-2"></i>Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="modern-spinner">
        <div class="spinner"></div>
        <p class="mt-3 text-muted">Loading report data...</p>
      </div>
    </div>

    <!-- Report Content -->
    <div v-if="!loading && reportData" class="report-content">

      <!-- Student Info Card -->
      <div class="modern-card info-card mb-4">
        <div class="card-header gradient-header">
          <i class="fa fa-user-graduate mr-2"></i>
          <h5 class="mb-0">Student Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">{{ reportData.student_info.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Student ID</span>
                <span class="info-value">{{ reportData.student_info.student_id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Roll No</span>
                <span class="info-value">{{ reportData.student_info.roll_no }}</span>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="info-item">
                <span class="info-label">Session</span>
                <span class="info-value">{{ reportData.student_info.session }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Year</span>
                <span class="info-value">{{ reportData.student_info.year }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Department</span>
                <span class="info-value">{{ reportData.student_info.department }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Info -->
      <div class="modern-card info-card mb-4">
        <div class="card-header gradient-header-blue">
          <i class="fa fa-credit-card mr-2"></i>
          <h5 class="mb-0">Card Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="info-item">
                <span class="info-label">Card Name</span>
                <span class="info-value">{{ reportData.card_info.card_name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Card Code</span>
                <span class="info-value">{{ reportData.card_info.card_code }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Card Number</span>
                <span class="info-value">{{ reportData.card_info.card_number }}</span>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="info-item">
                <span class="info-label">Department</span>
                <span class="info-value">{{ reportData.card_info.department }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Marks</span>
                <span class="info-value">{{ reportData.card_info.total_marks }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Pass Marks</span>
                <span class="info-value">{{ reportData.card_info.pass_marks }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Summary -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card completion-card">
            <div class="stat-icon">
              <i class="fa fa-tasks"></i>
            </div>
            <div class="stat-content">
              <h6 class="stat-label">Completion</h6>
              <h3 class="stat-value">{{ reportData.statistics.completion_percentage }}%</h3>
              <p class="stat-detail">
                {{ reportData.statistics.completed_items }}/{{ reportData.statistics.total_items }} Items
              </p>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill completion"
                     :style="{width: reportData.statistics.completion_percentage + '%'}">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card marks-card">
            <div class="stat-icon">
              <i class="fa fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <h6 class="stat-label">Marks Obtained</h6>
              <h3 class="stat-value">{{ reportData.statistics.total_marks_obtained }}</h3>
              <p class="stat-detail">Out of {{ reportData.statistics.total_max_marks }}</p>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill marks"
                     :style="{width: (reportData.statistics.total_marks_obtained / reportData.statistics.total_max_marks * 100) + '%'}">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card percentage-card">
            <div class="stat-icon">
              <i class="fa fa-percent"></i>
            </div>
            <div class="stat-content">
              <h6 class="stat-label">Percentage</h6>
              <h3 class="stat-value" :class="getPercentageClass(reportData.statistics.marks_percentage)">
                {{ reportData.statistics.marks_percentage }}%
              </h3>
              <p class="stat-detail">Performance</p>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill"
                     :class="getProgressBarClass(reportData.statistics.marks_percentage)"
                     :style="{width: reportData.statistics.marks_percentage + '%'}">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card status-card">
            <div class="stat-icon">
              <i class="fa fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h6 class="stat-label">Status</h6>
              <h3 class="stat-value">
                <span :class="'modern-badge badge-' + getStatusColor(reportData.statistics.status)">
                  {{ formatStatus(reportData.statistics.status) }}
                </span>
              </h3>
              <p class="stat-detail">Overall Status</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Structure Progress Table -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-green">
          <i class="fa fa-list-check mr-2"></i>
          <h5 class="mb-0">Item-wise Progress</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="5%">SL</th>
                <th width="25%">Item Title</th>
                <th width="12%">Date of Beginning</th>
                <th width="12%">Date of Exam</th>
                <th width="10%">Marks</th>
                <th width="8%">%</th>
                <th width="15%">Lecturer</th>
                <th width="8%">Status</th>
                <th width="5%">Attempt</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(item, index) in reportData.structure_progress"
                  :key="item.id"
                  class="table-row"
              >
                <td><span class="sl-number">{{ index + 1 }}</span></td>
                <td><strong>{{ item.item_title }}</strong></td>
                <td>{{ formatDate(item.date_of_beginning) }}</td>
                <td>{{ formatDate(item.date_of_examination) }}</td>
                <td>
                  <span class="marks-display">
                    <strong>{{ item.marks_obtained || '-' }}</strong> / {{ item.max_marks }}
                  </span>
                </td>
                <td>
                  <span :class="'modern-badge badge-' + getPercentageBadgeColor(item.percentage)">
                    {{ item.percentage }}%
                  </span>
                </td>
                <td><small>{{ item.lecturer_name || '-' }}</small></td>
                <td>
                  <span v-if="item.is_completed" class="modern-badge badge-success">
                    <i class="fa fa-check"></i> Completed
                  </span>
                  <span v-else class="modern-badge badge-warning">
                    <i class="fa fa-clock"></i> Pending
                  </span>
                </td>
                <td>
                  <span class="attempt-badge">{{ item.attempt_number }}</span>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr class="total-row">
                <th colspan="4" class="text-right">Total:</th>
                <th>
                  <strong>{{ reportData.statistics.total_marks_obtained }}</strong> /
                  {{ reportData.statistics.total_max_marks }}
                </th>
                <th>
                  <strong>{{ reportData.statistics.marks_percentage }}%</strong>
                </th>
                <th colspan="3"></th>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Remarks Section -->
      <div class="modern-card mb-4" v-if="reportData.structure_progress.length > 0">
        <div class="card-header gradient-header-orange">
          <i class="fa fa-comment-dots mr-2"></i>
          <h5 class="mb-0">Remarks</h5>
        </div>
        <div class="card-body">
          <div class="remarks-container">
            <div
                v-for="item in reportData.structure_progress"
                :key="'remark-' + item.id"
                class="remark-item"
            >
              <div class="remark-title">
                <i class="fa fa-chevron-right mr-2"></i>
                <strong>{{ item.item_title }}</strong>
              </div>
              <div class="remark-text">
                {{ item.remarks || 'No remarks available' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Section -->
      <div class="modern-card mb-4" v-if="reportData.attendance">
        <div class="card-header gradient-header-purple">
          <i class="fa fa-calendar-check mr-2"></i>
          <h5 class="mb-0">Attendance Summary</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div
                v-for="(att, index) in reportData.attendance"
                :key="'att-' + index"
                class="col-md-4 mb-3"
            >
              <div class="attendance-card">
                <div class="attendance-header">
                  <i class="fa fa-user-check"></i>
                  <h6>{{ att.type }}</h6>
                </div>
                <div class="attendance-body">
                  <div class="attendance-stats">
                    <div class="stat-box">
                      <span class="stat-number">{{ att.held }}</span>
                      <span class="stat-text">Held</span>
                    </div>
                    <div class="stat-divider">/</div>
                    <div class="stat-box">
                      <span class="stat-number">{{ att.attended }}</span>
                      <span class="stat-text">Attended</span>
                    </div>
                  </div>
                  <div class="attendance-percentage">
                    <span :class="'modern-badge badge-' + getAttendanceBadgeColor(att.percentage)">
                      {{ att.percentage }}%
                    </span>
                  </div>
                  <div class="progress-bar-wrapper mt-2">
                    <div
                        class="progress-bar-fill"
                        :class="getAttendanceProgressClass(att.percentage)"
                        :style="{width: att.percentage + '%'}">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Term Exam Results -->
      <div class="modern-card mb-4" v-if="reportData.term_exams && reportData.term_exams.length > 0">
        <div class="card-header gradient-header-red">
          <i class="fa fa-file-alt mr-2"></i>
          <h5 class="mb-0">Term Examination Results</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th>Term</th>
                <th>Exam Date</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Remarks</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="exam in reportData.term_exams" :key="'exam-' + exam.term_number" class="table-row">
                <td><strong>{{ exam.term_name }}</strong></td>
                <td>{{ formatDate(exam.exam_date) }}</td>
                <td><strong>{{ exam.marks_obtained }}</strong></td>
                <td>{{ exam.total_marks }}</td>
                <td>
                  <span :class="'modern-badge badge-' + getPercentageBadgeColor(exam.percentage)">
                    {{ exam.percentage }}%
                  </span>
                </td>
                <td>{{ exam.remarks }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Cadaver/Specimen Info -->
      <div class="row mb-4">
        <div class="col-md-6 mb-3" v-if="reportData.cadaver_info">
          <div class="modern-card info-card">
            <div class="card-header gradient-header-teal">
              <i class="fa fa-microscope mr-2"></i>
              <h4 class="mb-0">Cadaver Information</h4>
            </div>
            <div class="card-body">
              <div class="info-item">
                <span class="info-label">Number</span>
                <span class="info-value">{{ reportData.cadaver_info.number }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gender</span>
                <span class="info-value">{{ reportData.cadaver_info.gender }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location</span>
                <span class="info-value">{{ reportData.cadaver_info.location }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3" v-if="reportData.specimen_info">
          <div class="modern-card info-card">
            <div class="card-header gradient-header-teal">
              <i class="fa fa-flask mr-2"></i>
              <h6 class="mb-0">Specimen Information</h6>
            </div>
            <div class="card-body">
              <div class="info-item">
                <span class="info-label">Number</span>
                <span class="info-value">{{ reportData.specimen_info.number }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">{{ reportData.specimen_info.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Type</span>
                <span class="info-value">{{ reportData.specimen_info.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons text-center mb-4">
        <button @click="printReport" class="action-btn print-btn">
          <i class="fa fa-print"></i>
          <span>Print Report</span>
        </button>
        <button @click="exportPDF" class="action-btn pdf-btn">
          <i class="fa fa-file-pdf"></i>
          <span>Export PDF</span>
        </button>
        <button @click="exportExcel" class="action-btn excel-btn">
          <i class="fa fa-file-excel"></i>
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-if="!loading && !reportData" class="no-data-message">
      <div class="no-data-icon">
        <i class="fa fa-inbox"></i>
      </div>
      <h5>No Report Generated</h5>
      <p>Please select student ID and card type to generate the progress report</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StudentProgressCardReport',

  data() {
    return {
      collegeName: 'Medical College for Women and Hospital',
      loading: false,
      reportData: null,
      availableCards: [],
      filters: {
        studentId: '',
        cardTypeId: '',
        academicYearId: 1
      }
    }
  },

  mounted() {
    this.loadAvailableCards();
  },

  methods: {
    async loadAvailableCards() {
      if (!this.filters.studentId) return;

      try {
        const response = await this.$api.get(
            `/reports/student-progress-card/student/${this.filters.studentId}/cards`
        );

        if (response.data.success) {
          this.availableCards = response.data.data;
        }
      } catch (error) {
        console.error('Error loading cards:', error);
      }
    },

    async fetchReport() {
      if (!this.filters.studentId || !this.filters.cardTypeId) {
        this.$notify({
          type: 'warning',
          title: 'Warning',
          text: 'Please select student and card type'
        });
        return;
      }

      this.loading = true;

      try {
        const response = await this.$api.get(
            `/reports/student-progress-card/${this.filters.studentId}/${this.filters.cardTypeId}`,
            { params: { academic_year_id: this.filters.academicYearId } }
        );

        if (response.data.success) {
          this.reportData = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'Failed to load report data'
        });
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-GB');
    },

    formatStatus(status) {
      return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    getPercentageClass(percentage) {
      if (percentage >= 80) return 'text-success';
      if (percentage >= 60) return 'text-primary';
      if (percentage >= 40) return 'text-warning';
      return 'text-danger';
    },

    getProgressBarClass(percentage) {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'primary';
      if (percentage >= 40) return 'warning';
      return 'danger';
    },

    getPercentageBadgeColor(percentage) {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'info';
      if (percentage >= 40) return 'warning';
      return 'danger';
    },

    getAttendanceBadgeColor(percentage) {
      if (percentage >= 75) return 'success';
      if (percentage >= 60) return 'warning';
      return 'danger';
    },

    getAttendanceProgressClass(percentage) {
      if (percentage >= 75) return 'success';
      if (percentage >= 60) return 'warning';
      return 'danger';
    },

    getStatusColor(status) {
      const colors = {
        'completed': 'success',
        'in_progress': 'primary',
        'not_started': 'secondary',
        'failed': 'danger'
      };
      return colors[status] || 'secondary';
    },

    printReport() {
      window.print();
    },

    async exportPDF() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'PDF export functionality will be implemented'
      });
    },

    async exportExcel() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Excel export functionality will be implemented'
      });
    }
  },

  watch: {
    'filters.studentId': function(newVal) {
      if (newVal) {
        this.loadAvailableCards();
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.student-progress-card-report {
  /*padding: 20px;*/
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Header Section */
.report-header {
  background: white;
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.college-info {
  margin-bottom: 30px;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.college-name {
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.report-title {
  color: #4a5568;
  font-weight: 600;
  font-size: 20px;
  position: relative;
  padding-bottom: 10px;
}

.report-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* Filter Section */
.filter-section {
  margin-top: 30px;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  display: block;
  font-size: 14px;
}

.modern-input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.modern-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modern-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Loading Spinner */
.modern-spinner {
  padding: 60px 20px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #e2e8f0;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modern Card */
.modern-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 20px 30px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-header-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-header-green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.gradient-header-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-header-purple {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #4a5568;
}

.gradient-header-red {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-header-teal {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-body {
  padding: 30px;
}

/* Info Items */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #718096;
  font-size: 14px;
}

.info-value {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

/* Stat Cards */
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 15px;
  color: white;
}

.completion-card .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.marks-card .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.percentage-card .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.status-card .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #718096;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin: 10px 0;
  color: #2d3748;
}

.stat-detail {
  color: #a0aec0;
  font-size: 13px;
  margin-bottom: 15px;
}

/* Progress Bar */
.progress-bar-wrapper {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg,
  rgba(255,255,255,0) 0%,
  rgba(255,255,255,0.3) 50%,
  rgba(255,255,255,0) 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-bar-fill.completion {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.progress-bar-fill.marks {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.progress-bar-fill.success {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.progress-bar-fill.primary {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.progress-bar-fill.warning {
  background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
}

.progress-bar-fill.danger {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

/* Modern Table */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.modern-table th {
  padding: 18px 15px;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.modern-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.modern-table tbody tr:hover {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  transform: scale(1.01);
}

.modern-table td {
  padding: 16px 15px;
  color: #4a5568;
  font-size: 14px;
}

.modern-table tfoot {
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  font-weight: 700;
}

.modern-table tfoot th {
  padding: 20px 15px;
  color: #2d3748;
  border-top: 2px solid #cbd5e0;
}

.sl-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.marks-display {
  display: inline-block;
  padding: 6px 12px;
  background: #f7fafc;
  border-radius: 8px;
  font-size: 13px;
}

.attempt-badge {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #edf2f7;
  color: #4a5568;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* Modern Badge */
.modern-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.badge-success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.badge-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.badge-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.badge-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.badge-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-secondary {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
  color: white;
}

/* Remarks */
.remarks-container {
  display: grid;
  gap: 15px;
}

.remark-item {
  padding: 15px;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.remark-item:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.remark-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.remark-text {
  color: #718096;
  font-size: 14px;
  line-height: 1.6;
}

/* Attendance Card */
.attendance-card {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  height: 100%;
}

.attendance-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.attendance-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #2d3748;
}

.attendance-header i {
  font-size: 24px;
  color: #667eea;
}

.attendance-header h6 {
  margin: 0;
  font-weight: 700;
}

.attendance-body {
  text-align: center;
}

.attendance-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.stat-box {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.stat-text {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
}

.stat-divider {
  font-size: 24px;
  color: #cbd5e0;
  font-weight: 300;
}

.attendance-percentage {
  margin: 15px 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.print-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pdf-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.excel-btn {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* No Data Message */
.no-data-message {
  background: white;
  border-radius: 20px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.no-data-icon {
  font-size: 80px;
  color: #cbd5e0;
  margin-bottom: 20px;
}

.no-data-message h5 {
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 10px;
}

.no-data-message p {
  color: #718096;
}

/* Responsive Design */
@media (max-width: 768px) {
  .student-progress-card-report {
    padding: 15px;
  }

  .report-header {
    padding: 25px 20px;
  }

  .college-name {
    font-size: 24px;
  }

  .report-title {
    font-size: 16px;
  }

  .logo-circle {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .stat-value {
    font-size: 24px;
  }

  .card-body {
    padding: 20px;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .stat-card {
    margin-bottom: 15px;
  }

  .attendance-card {
    margin-bottom: 15px;
  }
}

/* Print Styles */
@media print {
  .student-progress-card-report {
    background: white;
    padding: 0;
  }

  .report-header .filter-section,
  .action-buttons,
  .modern-btn {
    display: none !important;
  }

  .modern-card {
    box-shadow: none;
    page-break-inside: avoid;
  }

  .card-header {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* Color Classes */
.text-success {
  color: #38a169 !important;
}

.text-primary {
  color: #667eea !important;
}

.text-warning {
  color: #ed8936 !important;
}

.text-danger {
  color: #e53e3e !important;
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mb-0 { margin-bottom: 0 !important; }
.mb-2 { margin-bottom: 0.5rem !important; }
.mb-3 { margin-bottom: 1rem !important; }
.mb-4 { margin-bottom: 1.5rem !important; }
.mt-2 { margin-top: 0.5rem !important; }
.mt-3 { margin-top: 1rem !important; }
.mr-2 { margin-right: 0.5rem !important; }

.p-0 { padding: 0 !important; }

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-3, .col-md-4, .col-md-6, .col-lg-3 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px) {
  .col-md-3 { flex: 0 0 25%; max-width: 25%; }
  .col-md-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
  .col-md-6 { flex: 0 0 50%; max-width: 50%; }
}

@media (min-width: 992px) {
  .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
}
</style>