<template>
  <div class="academic-summary-container">
    <!-- Hero Header -->
    <div class="hero-header">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <i class="fas fa-graduation-cap"></i>
          Student Academic Summary
        </h1>
        <p class="hero-subtitle">Complete Academic Performance Overview</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input
            v-model="studentId"
            type="text"
            placeholder="Enter Student ID to generate comprehensive report"
            class="search-input"
            @keyup.enter="fetchSummary"
        />
        <button
            @click="fetchSummary"
            class="search-button"
            :disabled="loading"
        >
          <i class="fas fa-chart-line"></i>
          Generate Report
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading comprehensive academic data...</p>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading && summaryData" class="summary-content">

      <!-- Student Profile Card -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="profile-info">
            <h2>{{ summaryData.student_info.name }}</h2>
            <div class="profile-meta">
              <span class="meta-item">
                <i class="fas fa-id-badge"></i>
                {{ summaryData.student_info.student_id }}
              </span>
              <span class="meta-item">
                <i class="fas fa-hashtag"></i>
                Roll: {{ summaryData.student_info.roll_no }}
              </span>
              <span class="meta-item">
                <i class="fas fa-hospital"></i>
                {{ summaryData.student_info.department }}
              </span>
              <span class="meta-item">
                <i class="fas fa-user-graduate"></i>
                {{ summaryData.student_info.program }}
              </span>
            </div>
            <div class="profile-details">
              <div class="detail">
                <span class="label">Session:</span>
                <span class="value">{{ summaryData.student_info.session }}</span>
              </div>
              <div class="detail">
                <span class="label">Year:</span>
                <span class="value">{{ summaryData.student_info.year }}</span>
              </div>
              <div class="detail">
                <span class="label">Semester:</span>
                <span class="value">{{ summaryData.student_info.semester }}</span>
              </div>
              <div class="detail">
                <span class="label">Admission Date:</span>
                <span class="value">{{ formatDate(summaryData.student_info.admission_date) }}</span>
              </div>
              <div class="detail">
                <span class="label">Blood Group:</span>
                <span class="value">{{ summaryData.student_info.blood_group || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Cards -->
      <div class="dashboard-grid">
        <!-- Overall Statistics -->
        <div class="dashboard-card card-primary">
          <div class="card-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.overall_statistics.overall_percentage }}%</h3>
            <p>Overall Percentage</p>
            <span class="card-grade">Grade: {{ summaryData.overall_statistics.overall_grade }}</span>
          </div>
        </div>

        <div class="dashboard-card card-success">
          <div class="card-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.overall_statistics.overall_cgpa }}</h3>
            <p>Cumulative GPA</p>
            <div class="mini-progress">
              <div class="mini-progress-fill" :style="{ width: (summaryData.overall_statistics.overall_cgpa / 5 * 100) + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="dashboard-card card-info">
          <div class="card-icon">
            <i class="fas fa-clipboard-check"></i>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.overall_statistics.total_exams }}</h3>
            <p>Total Examinations</p>
            <div class="card-stats">
              <span class="stat-pass">✓ {{ summaryData.overall_statistics.passed_exams }}</span>
              <span class="stat-fail">✗ {{ summaryData.overall_statistics.failed_exams }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-card card-warning">
          <div class="card-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.attendance_summary.attendance_percentage }}%</h3>
            <p>Attendance Rate</p>
            <span class="card-badge" :class="'badge-' + getAttendanceBadge(summaryData.attendance_summary.attendance_percentage)">
              {{ summaryData.attendance_summary.attendance_status }}
            </span>
          </div>
        </div>

        <div class="dashboard-card card-purple">
          <div class="card-icon">
            <i class="fas fa-id-card"></i>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.card_completion.completion_rate }}%</h3>
            <p>Card Completion</p>
            <small>{{ summaryData.card_completion.completed }}/{{ summaryData.card_completion.total_cards }} Cards</small>
          </div>
        </div>

        <div class="dashboard-card card-teal">
          <div class="card-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.achievements.total_distinctions }}</h3>
            <p>Total Distinctions</p>
            <small>80%+ Marks</small>
          </div>
        </div>
      </div>

      <!-- Achievements Section -->
      <div class="achievements-section" v-if="summaryData.achievements.awards.length > 0">
        <h3 class="section-title">
          <i class="fas fa-award"></i> Achievements & Awards
        </h3>
        <div class="achievements-grid">
          <div
              v-for="(award, index) in summaryData.achievements.awards"
              :key="'award-' + index"
              class="achievement-badge"
          >
            <div class="badge-icon">
              <i class="fas fa-medal"></i>
            </div>
            <span>{{ award }}</span>
          </div>
        </div>
        <div class="achievement-highlights">
          <div class="highlight-item">
            <i class="fas fa-chart-line"></i>
            <div>
              <strong>Highest Score</strong>
              <span>{{ summaryData.achievements.highest_percentage }}%</span>
            </div>
          </div>
          <div class="highlight-item">
            <i class="fas fa-star"></i>
            <div>
              <strong>Best GPA</strong>
              <span>{{ summaryData.achievements.highest_gpa }}</span>
            </div>
          </div>
          <div class="highlight-item">
            <i class="fas fa-calendar-check"></i>
            <div>
              <strong>Perfect Attendance</strong>
              <span>{{ summaryData.achievements.perfect_attendance_months }} Months</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Overview -->
      <div class="performance-overview">
        <h3 class="section-title">
          <i class="fas fa-chart-area"></i> Academic Performance Overview
        </h3>
        <div class="row">
          <div class="col-md-8">
            <div class="chart-wrapper">
              <canvas ref="performanceTrendChart" height="100"></canvas>
            </div>
          </div>
          <div class="col-md-4">
            <div class="performance-stats">
              <div class="stat-row">
                <span class="stat-label">Total Marks Obtained</span>
                <span class="stat-value">{{ summaryData.overall_statistics.total_marks_obtained }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Total Marks</span>
                <span class="stat-value">{{ summaryData.overall_statistics.total_marks }}</span>
              </div>
              <div class="stat-row highlight">
                <span class="stat-label">Success Rate</span>
                <span class="stat-value">
                  {{ calculateSuccessRate() }}%
                </span>
              </div>
              <div class="circular-progress">
                <svg viewBox="0 0 100 100">
                  <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                  <circle
                      class="progress-bar"
                      cx="50"
                      cy="50"
                      r="45"
                      :stroke-dasharray="getCircleProgress(summaryData.overall_statistics.overall_percentage)"
                  ></circle>
                </svg>
                <div class="progress-text">
                  <strong>{{ summaryData.overall_statistics.overall_percentage }}%</strong>
                  <small>Overall</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Performance Timeline -->
      <div class="timeline-section" v-if="summaryData.academic_performance.length > 0">
        <h3 class="section-title">
          <i class="fas fa-history"></i> Academic Journey Timeline
        </h3>
        <div class="timeline">
          <div
              v-for="(period, index) in summaryData.academic_performance"
              :key="'period-' + index"
              class="timeline-item"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>{{ period.period }}</h4>
              <div class="timeline-stats">
                <span><i class="fas fa-book"></i> {{ period.total_subjects }} Subjects</span>
                <span><i class="fas fa-file-alt"></i> {{ period.total_exams }} Exams</span>
                <span><i class="fas fa-percentage"></i> {{ period.percentage }}%</span>
                <span><i class="fas fa-star"></i> GPA: {{ period.average_gpa }}</span>
              </div>
              <div class="timeline-result">
                <span class="result-pass">Passed: {{ period.passed }}</span>
                <span class="result-fail">Failed: {{ period.failed }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject-wise Performance -->
      <div class="subjects-section">
        <h3 class="section-title">
          <i class="fas fa-book-open"></i> Subject-wise Cumulative Performance
        </h3>
        <div class="subjects-table-wrapper">
          <table class="subjects-table">
            <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Department</th>
              <th class="text-center">Exams</th>
              <th class="text-center">Marks</th>
              <th class="text-center">%</th>
              <th class="text-center">GPA</th>
              <th class="text-center">Grade</th>
              <th class="text-center">Performance</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(subject, index) in summaryData.subject_wise_cumulative"
                :key="'subj-' + index"
                class="subject-row"
            >
              <td>
                <strong>{{ subject.subject_name }}</strong>
              </td>
              <td>
                <span class="subject-code">{{ subject.subject_code }}</span>
              </td>
              <td>
                <small>{{ subject.department }}</small>
              </td>
              <td class="text-center">
                {{ subject.total_exams }}
              </td>
              <td class="text-center">
                <strong>{{ subject.marks_obtained }}</strong> / {{ subject.total_marks }}
              </td>
              <td class="text-center">
                  <span :class="'percentage-pill pill-' + getPercentagePill(subject.percentage)">
                    {{ subject.percentage }}%
                  </span>
              </td>
              <td class="text-center">
                <strong>{{ subject.average_gpa }}</strong>
              </td>
              <td class="text-center">
                <span class="grade-badge">{{ subject.grade }}</span>
              </td>
              <td class="text-center">
                <div class="performance-bar">
                  <div
                      class="performance-fill"
                      :style="{
                        width: subject.percentage + '%',
                        background: getPerformanceColor(subject.percentage)
                      }"
                  ></div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Attendance Analysis -->
      <div class="attendance-section">
        <h3 class="section-title">
          <i class="fas fa-user-check"></i> Attendance Analysis
        </h3>
        <div class="row">
          <div class="col-md-4">
            <div class="attendance-summary-card">
              <div class="attendance-circle">
                <svg viewBox="0 0 100 100">
                  <circle class="circle-bg" cx="50" cy="50" r="40"></circle>
                  <circle
                      class="circle-progress"
                      cx="50"
                      cy="50"
                      r="40"
                      :stroke-dasharray="getCircleProgress(summaryData.attendance_summary.attendance_percentage)"
                  ></circle>
                </svg>
                <div class="circle-text">
                  <h2>{{ summaryData.attendance_summary.attendance_percentage }}%</h2>
                  <p>{{ summaryData.attendance_summary.attendance_status }}</p>
                </div>
              </div>
              <div class="attendance-breakdown">
                <div class="breakdown-item">
                  <span class="icon present"><i class="fas fa-check"></i></span>
                  <span class="label">Present</span>
                  <span class="count">{{ summaryData.attendance_summary.present }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="icon absent"><i class="fas fa-times"></i></span>
                  <span class="label">Absent</span>
                  <span class="count">{{ summaryData.attendance_summary.absent }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="icon late"><i class="fas fa-clock"></i></span>
                  <span class="label">Late</span>
                  <span class="count">{{ summaryData.attendance_summary.late }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="icon excused"><i class="fas fa-user-check"></i></span>
                  <span class="label">Excused</span>
                  <span class="count">{{ summaryData.attendance_summary.excused }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card-attendance-chart">
              <h5>Card Type-wise Attendance</h5>
              <canvas ref="cardAttendanceChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Completion Status -->
      <div class="cards-completion-section">
        <h3 class="section-title">
          <i class="fas fa-tasks"></i> Card Completion Status
        </h3>
        <div class="completion-summary">
          <div class="completion-stat">
            <div class="stat-circle completed">{{ summaryData.card_completion.completed }}</div>
            <span>Completed</span>
          </div>
          <div class="completion-stat">
            <div class="stat-circle in-progress">{{ summaryData.card_completion.in_progress }}</div>
            <span>In Progress</span>
          </div>
          <div class="completion-stat">
            <div class="stat-circle not-started">{{ summaryData.card_completion.not_started }}</div>
            <span>Not Started</span>
          </div>
          <div class="completion-stat">
            <div class="stat-circle total">{{ summaryData.card_completion.total_cards }}</div>
            <span>Total Cards</span>
          </div>
        </div>
        <div class="cards-grid">
          <div
              v-for="(card, index) in summaryData.card_completion.cards"
              :key="'card-' + index"
              class="card-item"
          >
            <div class="card-header-bar">
              <h5>{{ card.card_name }}</h5>
              <span :class="'status-tag status-' + card.status">{{ card.status }}</span>
            </div>
            <div class="card-details-bar">
              <span><strong>Code:</strong> {{ card.card_code }}</span>
              <span><strong>Dept:</strong> {{ card.department }}</span>
            </div>
            <div class="completion-progress-bar">
              <div
                  class="completion-fill"
                  :style="{
                  width: card.completion_percentage + '%',
                  background: getCompletionColor(card.completion_percentage)
                }"
              >
                <span v-if="card.completion_percentage > 20">{{ card.completion_percentage }}%</span>
              </div>
            </div>
            <div class="card-marks">
              <small>Marks: {{ card.total_marks_obtained }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Visualizations -->
      <div class="visualizations-section">
        <div class="row">
          <div class="col-md-6">
            <div class="viz-card">
              <h5 class="viz-title">
                <i class="fas fa-chart-pie"></i> Grade Distribution
              </h5>
              <canvas ref="gradeDistChart"></canvas>
            </div>
          </div>
          <div class="col-md-6">
            <div class="viz-card">
              <h5 class="viz-title">
                <i class="fas fa-chart-bar"></i> Subject Performance Comparison
              </h5>
              <canvas ref="subjectCompChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-section">
        <button @click="printReport" class="action-btn btn-primary">
          <i class="fas fa-print"></i>
          <span>Print Report</span>
        </button>
        <button @click="downloadPDF" class="action-btn btn-danger">
          <i class="fas fa-file-pdf"></i>
          <span>Download PDF</span>
        </button>
        <button @click="downloadExcel" class="action-btn btn-success">
          <i class="fas fa-file-excel"></i>
          <span>Download Excel</span>
        </button>
        <button @click="shareReport" class="action-btn btn-info">
          <i class="fas fa-share-alt"></i>
          <span>Share Report</span>
        </button>
        <button @click="emailReport" class="action-btn btn-warning">
          <i class="fas fa-envelope"></i>
          <span>Email Report</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !summaryData" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <h3>No Academic Data Available</h3>
      <p>Enter a Student ID to view comprehensive academic summary</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'StudentAcademicSummary',

  data() {
    return {
      studentId: '',
      loading: false,
      summaryData: null,
      charts: {}
    }
  },

  methods: {
    async fetchSummary() {
      if (!this.studentId) {
        this.$notify({
          type: 'warning',
          title: 'Warning',
          text: 'Please enter Student ID'
        });
        return;
      }

      this.loading = true;
      this.summaryData = null;

      try {
        const response = await this.$api.get(
            `/reports/academic-summary/student/${this.studentId}`
        );

        if (response.data.success) {
          this.summaryData = response.data.data;
          this.$nextTick(() => {
            this.renderAllCharts();
          });

          this.$notify({
            type: 'success',
            title: 'Success',
            text: 'Academic summary generated successfully'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load academic summary'
        });
      } finally {
        this.loading = false;
      }
    },

    renderAllCharts() {
      this.renderPerformanceTrendChart();
      this.renderCardAttendanceChart();
      this.renderGradeDistChart();
      this.renderSubjectCompChart();
    },

    renderPerformanceTrendChart() {
      if (this.charts.performanceTrend) {
        this.charts.performanceTrend.destroy();
      }

      const ctx = this.$refs.performanceTrendChart.getContext('2d');
      const data = this.summaryData.performance_trend;

      this.charts.performanceTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.month),
          datasets: [{
            label: 'Percentage',
            data: data.map(item => item.percentage),
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7
          }, {
            label: 'GPA (×20)',
            data: data.map(item => item.gpa * 20),
            borderColor: 'rgb(118, 75, 162)',
            backgroundColor: 'rgba(118, 75, 162, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    },

    renderCardAttendanceChart() {
      if (this.charts.cardAttendance) {
        this.charts.cardAttendance.destroy();
      }

      const ctx = this.$refs.cardAttendanceChart.getContext('2d');
      const data = this.summaryData.attendance_summary.card_type_wise;

      this.charts.cardAttendance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.card_name),
          datasets: [{
            label: 'Attendance %',
            data: data.map(item => item.percentage),
            backgroundColor: data.map(item => this.getAttendanceChartColor(item.percentage)),
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    },

    renderGradeDistChart() {
      if (this.charts.gradeDist) {
        this.charts.gradeDist.destroy();
      }

      const ctx = this.$refs.gradeDistChart.getContext('2d');
      const subjects = this.summaryData.subject_wise_cumulative;

      // Count grades
      const gradeCounts = {};
      subjects.forEach(subject => {
        gradeCounts[subject.grade] = (gradeCounts[subject.grade] || 0) + 1;
      });

      this.charts.gradeDist = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(gradeCounts),
          datasets: [{
            data: Object.values(gradeCounts),
            backgroundColor: [
              'rgba(40, 167, 69, 0.8)',
              'rgba(23, 162, 184, 0.8)',
              'rgba(255, 193, 7, 0.8)',
              'rgba(253, 126, 20, 0.8)',
              'rgba(220, 53, 69, 0.8)',
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    },

    renderSubjectCompChart() {
      if (this.charts.subjectComp) {
        this.charts.subjectComp.destroy();
      }

      const ctx = this.$refs.subjectCompChart.getContext('2d');
      const subjects = this.summaryData.subject_wise_cumulative.slice(0, 10); // Top 10

      this.charts.subjectComp = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: subjects.map(s => s.subject_code),
          datasets: [{
            label: 'Percentage',
            data: subjects.map(s => s.percentage),
            backgroundColor: subjects.map(s => this.getPerformanceColor(s.percentage)),
            borderRadius: 5
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    },

    calculateSuccessRate() {
      const total = this.summaryData.overall_statistics.total_exams;
      const passed = this.summaryData.overall_statistics.passed_exams;
      return total > 0 ? Math.round((passed / total) * 100) : 0;
    },

    getCircleProgress(percentage) {
      const circumference = 2 * Math.PI * 45; // r=45
      const progress = (percentage / 100) * circumference;
      return `${progress} ${circumference}`;
    },

    getPercentagePill(percentage) {
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 50) return 'average';
      if (percentage >= 40) return 'below-average';
      return 'poor';
    },

    getPerformanceColor(percentage) {
      if (percentage >= 80) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      if (percentage >= 60) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      if (percentage >= 50) return 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)';
      if (percentage >= 40) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      return 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)';
    },

    getCompletionColor(percentage) {
      if (percentage >= 90) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      if (percentage >= 70) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      if (percentage >= 50) return 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)';
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    },

    getAttendanceChartColor(percentage) {
      if (percentage >= 90) return 'rgba(40, 167, 69, 0.8)';
      if (percentage >= 75) return 'rgba(23, 162, 184, 0.8)';
      if (percentage >= 60) return 'rgba(255, 193, 7, 0.8)';
      return 'rgba(220, 53, 69, 0.8)';
    },

    getAttendanceBadge(percentage) {
      if (percentage >= 90) return 'success';
      if (percentage >= 80) return 'primary';
      if (percentage >= 75) return 'info';
      if (percentage >= 60) return 'warning';
      return 'danger';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-GB');
    },

    printReport() {
      window.print();
    },

    async downloadPDF() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'PDF download will be implemented'
      });
    },

    async downloadExcel() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Excel download will be implemented'
      });
    },

    async shareReport() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Share functionality will be implemented'
      });
    },

    async emailReport() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Email functionality will be implemented'
      });
    }
  },

  beforeDestroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
  }
}
</script>

<style scoped>
.academic-summary-container {
  min-height: 100vh;
  background: #f0f2f5;
}

/* Hero Header */
.hero-header {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  background-position: bottom;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Search Section */
.search-section {
  padding: 40px 20px;
  max-width: 800px;
  margin: -80px auto 40px;
  position: relative;
  z-index: 10;
}

.search-box {
  background: white;
  border-radius: 50px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
}

.search-icon {
  font-size: 1.5rem;
  color: #667eea;
  padding: 0 20px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 15px 0;
}

.search-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-progress {
  width: 300px;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 20px;
}

.progress-bar {
  height: 100%;
  background: white;
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0%, 100% { width: 0; }
  50% { width: 100%; }
}

/* Summary Content */
.summary-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 60px;
  animation: fadeInUp 0.6s ease;
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

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.profile-header {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.profile-avatar {
  font-size: 6rem;
  color: #667eea;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 700;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
}

.meta-item i {
  color: #667eea;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail .label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.detail .value {
  color: #2c3e50;
  font-weight: 500;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.card-primary::before { background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); }
.card-success::before { background: linear-gradient(180deg, #11998e 0%, #38ef7d 100%); }
.card-info::before { background: linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%); }
.card-warning::before { background: linear-gradient(180deg, #ffa751 0%, #ffe259 100%); }
.card-purple::before { background: linear-gradient(180deg, #a044ff 0%, #6a3093 100%); }
.card-teal::before { background: linear-gradient(180deg, #13547a 0%, #80d0c7 100%); }

.card-icon {
  font-size: 2.5rem;
  opacity: 0.2;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 5px 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.card-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.card-grade, .card-badge {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 15px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.card-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.stat-pass {
  color: #28a745;
  font-weight: 600;
}

.stat-fail {
  color: #dc3545;
  font-weight: 600;
}

.mini-progress {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin-top: 10px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 1s ease;
}

.badge-success { background: #28a745; color: white; }
.badge-primary { background: #007bff; color: white; }
.badge-info { background: #17a2b8; color: white; }
.badge-warning { background: #ffc107; color: #333; }
.badge-danger { background: #dc3545; color: white; }

/* Achievements */
.achievements-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.section-title {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
  display: flex;
  align-items: center;
  gap: 10px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.achievement-badge {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.achievement-badge:hover {
  transform: scale(1.05);
}

.badge-icon {
  font-size: 2rem;
}

.achievement-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.highlight-item i {
  font-size: 2rem;
  color: #667eea;
}

.highlight-item div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.highlight-item strong {
  color: #2c3e50;
}

.highlight-item span {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 700;
}

/* Performance Overview */
.performance-overview {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.chart-wrapper {
  height: 300px;
}

.performance-stats {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  height: 100%;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #dee2e6;
}

.stat-row.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  border: none;
}

.stat-label {
  color: #666;
  font-weight: 600;
}

.stat-value {
  color: #2c3e50;
  font-weight: 700;
}

.stat-row.highlight .stat-label,
.stat-row.highlight .stat-value {
  color: white;
}

.circular-progress {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 30px auto 0;
}

.circular-progress svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: #e9ecef;
  stroke-width: 8;
}

.progress-bar {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-text strong {
  display: block;
  font-size: 2rem;
  color: #667eea;
}

.progress-text small {
  color: #666;
}

/* Timeline */
.timeline-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-marker {
  position: absolute;
  left: -33px;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 4px solid #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
}

.timeline-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #667eea;
}

.timeline-content h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.timeline-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.timeline-stats span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
}

.timeline-stats i {
  color: #667eea;
}

.timeline-result {
  display: flex;
  gap: 20px;
}

.result-pass {
  color: #28a745;
  font-weight: 600;
}

.result-fail {
  color: #dc3545;
  font-weight: 600;
}

/* Subjects Table */
.subjects-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.subjects-table-wrapper {
  overflow-x: auto;
}

.subjects-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.subjects-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.subjects-table th {
  padding: 15px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

.subjects-table tbody tr {
  transition: background 0.3s ease;
}

.subjects-table tbody tr:hover {
  background: #f8f9fa;
}

.subjects-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.subject-code {
  display: inline-block;
  padding: 4px 10px;
  background: #e9ecef;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 600;
}

.percentage-pill {
  display: inline-block;
  padding: 6px 15px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
}

.pill-excellent { background: #28a745; color: white; }
.pill-good { background: #17a2b8; color: white; }
.pill-average { background: #ffc107; color: #333; }
.pill-below-average { background: #fd7e14; color: white; }
.pill-poor { background: #dc3545; color: white; }

.grade-badge {
  display: inline-block;
  padding: 8px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
}

.performance-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.performance-fill {
  height: 100%;
  transition: width 1s ease;
}

/* Attendance Section */
.attendance-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.attendance-summary-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  height: 100%;
}

.attendance-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
}

.attendance-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #e9ecef;
  stroke-width: 10;
}

.circle-progress {
  fill: none;
  stroke: url(#attendanceGradient);
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.circle-text h2 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
}

.circle-text p {
  margin: 5px 0 0;
  color: #666;
}

.attendance-breakdown {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 10px;
}

.breakdown-item .icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
}

.icon.present { background: #28a745; }
.icon.absent { background: #dc3545; }
.icon.late { background: #ffc107; }
.icon.excused { background: #17a2b8; }

.breakdown-item .label {
  flex: 1;
  color: #666;
  font-weight: 600;
}

.breakdown-item .count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.card-attendance-chart {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
}

.card-attendance-chart h5 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-weight: 600;
}

/* Cards Completion */
.cards-completion-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
}

.completion-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.completion-stat {
  text-align: center;
}

.stat-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 auto 10px;
}

.stat-circle.completed { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.stat-circle.in-progress { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-circle.not-started { background: linear-gradient(135deg, #ffa751 0%, #ffe259 100%); }
.stat-circle.total { background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%); }

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card-item {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header-bar h5 {
  margin: 0;
  color: #2c3e50;
  font-weight: 700;
}

.status-tag {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-completed { background: #28a745; color: white; }
.status-in_progress { background: #667eea; color: white; }
.status-not_started { background: #ffc107; color: #333; }

.card-details-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: #666;
}

.completion-progress-bar {
  height: 30px;
  background: #e9ecef;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 10px;
}

.completion-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
  color: white;
  font-weight: 700;
  transition: width 1s ease;
}

.card-marks {
  text-align: right;
  color: #666;
}

/* Visualizations */
.visualizations-section {
  margin-bottom: 30px;
}

.viz-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.viz-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

/* Action Section */
.action-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 40px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 30px;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.action-btn i {
  font-size: 1.5rem;
}

.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.btn-danger { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }
.btn-success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.btn-info { background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%); }
.btn-warning { background: linear-gradient(135deg, #ffa751 0%, #ffe259 100%); color: #333; }

/* Empty State */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
  /*max-width: 600px;*/
  margin: 0 auto;
}

.empty-icon {
  font-size: 6rem;
  color: #667eea;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .search-box {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .completion-summary {
    flex-direction: column;
  }
}

@media print {
  .hero-header,
  .search-section,
  .action-section {
    display: none !important;
  }

  .academic-summary-container {
    background: white;
  }

  .summary-content {
    padding: 0;
  }
}
</style>