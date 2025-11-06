<template>
  <div class="semester-result-container">
    <!-- Header Card -->
    <div class="header-card">
      <div class="college-header">
        <div class="logo-container">
          <div class="logo-circle">
            <i class="fas fa-graduation-cap"></i>
          </div>
        </div>
        <h2 class="college-name">{{ collegeName }}</h2>
        <h4 class="report-title">
          <i class="fas fa-chart-line"></i>
          Student Semester/Year Result Report
        </h4>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="row">
          <div class="col-md-3 mb-3">
            <div class="form-group">
              <label class="modern-label">
                <i class="fas fa-id-card mr-2"></i>Student ID
                <span class="text-danger">*</span>
              </label>
              <input
                  v-model="filters.studentId"
                  type="text"
                  class="form-control modern-input"
                  placeholder="Enter Student ID"
                  @keyup.enter="fetchReport"
              />
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="form-group">
              <label class="modern-label">
                <i class="fas fa-calendar mr-2"></i>Session
              </label>
              <select v-model="filters.sessionId" class="form-control modern-input">
                <option value="">Select Session</option>
                <option v-for="session in sessions" :key="session.id" :value="session.id">
                  {{ session.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-2 mb-3">
            <div class="form-group">
              <label class="modern-label">
                <i class="fas fa-layer-group mr-2"></i>Year
              </label>
              <select v-model="filters.year" class="form-control modern-input">
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
              </select>
            </div>
          </div>
          <div class="col-md-2 mb-3">
            <div class="form-group">
              <label class="modern-label">
                <i class="fas fa-book-open mr-2"></i>Semester
              </label>
              <select v-model="filters.semester" class="form-control modern-input">
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
              </select>
            </div>
          </div>
          <div class="col-md-2 mb-3">
            <div class="form-group">
              <label class="modern-label">&nbsp;</label>
              <button
                  @click="fetchReport"
                  class="btn btn-primary btn-block modern-btn"
                  :disabled="loading"
              >
                <i class="fas fa-search mr-2"></i>
                <span v-if="!loading">Generate</span>
                <span v-else>Loading...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="modern-spinner">
        <div class="spinner"></div>
      </div>
      <p class="loading-text">Generating your report...</p>
    </div>

    <!-- Report Content -->
    <div v-if="!loading && reportData" class="report-content">

      <!-- Student Info Card -->
      <div class="modern-card student-info-card">
        <div class="card-header gradient-header">
          <i class="fas fa-user-graduate mr-2"></i>
          <h5 class="mb-0">Student Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fas fa-user"></i> Name
                </span>
                <span class="info-value">{{ reportData.student_info.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fas fa-id-badge"></i> Student ID
                </span>
                <span class="info-value">{{ reportData.student_info.student_id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fas fa-hashtag"></i> Roll No
                </span>
                <span class="info-value">{{ reportData.student_info.roll_no }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fas fa-calendar-alt"></i> Session
                </span>
                <span class="info-value">{{ reportData.student_info.session }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fas fa-layer-group"></i> Year & Semester
                </span>
                <span class="info-value">
                  {{ reportData.student_info.year }}, {{ reportData.student_info.semester }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fas fa-building"></i> Department
                </span>
                <span class="info-value">{{ reportData.student_info.department }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Summary Cards -->
      <div class="summary-cards-grid">
        <div class="summary-card stat-card-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-book-open"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Total Subjects</h6>
            <h3 class="stat-value">{{ reportData.result_summary.total_subjects }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="summary-card stat-card-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Passed Subjects</h6>
            <h3 class="stat-value">{{ reportData.result_summary.passed_subjects }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="summary-card stat-card-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-times-circle"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Failed Subjects</h6>
            <h3 class="stat-value">{{ reportData.result_summary.failed_subjects }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="summary-card stat-card-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-percentage"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Overall Percentage</h6>
            <h3 class="stat-value">{{ reportData.result_summary.overall_percentage }}%</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: reportData.result_summary.overall_percentage + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="summary-card stat-card-5">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-medal"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Grade</h6>
            <h3 class="stat-value">{{ reportData.result_summary.overall_grade }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="summary-card stat-card-6">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">CGPA</h6>
            <h3 class="stat-value">{{ reportData.result_summary.cgpa }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (reportData.result_summary.cgpa / 4 * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="summary-card stat-card-7">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-trophy"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Class Rank</h6>
            <h3 class="stat-value">{{ reportData.result_summary.class_rank || 'N/A' }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div :class="'summary-card stat-card-8 ' + (reportData.result_summary.status === 'pass' ? 'status-pass-card' : 'status-fail-card')">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Result Status</h6>
            <h3 class="stat-value status-text">{{ reportData.result_summary.status.toUpperCase() }}</h3>
            <p class="stat-subtext">{{ reportData.result_summary.result_status }}</p>
          </div>
        </div>
      </div>

      <!-- Marks Summary -->
      <div class="modern-card marks-summary-card">
        <div class="card-header gradient-header-purple">
          <i class="fas fa-chart-bar mr-2"></i>
          <h5 class="mb-0">Marks Summary</h5>
        </div>
        <div class="card-body">
          <div class="marks-display">
            <div class="marks-circle">
              <div class="marks-inner">
                <span class="marks-obtained">{{ reportData.result_summary.total_marks_obtained }}</span>
                <span class="marks-separator">/</span>
                <span class="marks-total">{{ reportData.result_summary.total_marks }}</span>
              </div>
              <svg class="progress-ring" width="200" height="200">
                <circle
                    class="progress-ring-circle-bg"
                    stroke="#e9ecef"
                    stroke-width="15"
                    fill="transparent"
                    r="85"
                    cx="100"
                    cy="100"
                />
                <circle
                    class="progress-ring-circle"
                    stroke="url(#gradient)"
                    stroke-width="15"
                    fill="transparent"
                    r="85"
                    cx="100"
                    cy="100"
                    :stroke-dasharray="circumference + ' ' + circumference"
                    :stroke-dashoffset="strokeDashoffset"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="marks-stats">
              <div class="stat-box">
                <span class="stat-number">{{ reportData.result_summary.overall_percentage }}%</span>
                <span class="stat-text">Percentage</span>
              </div>
              <div class="stat-box">
                <span class="stat-number">{{ reportData.result_summary.overall_grade }}</span>
                <span class="stat-text">Grade</span>
              </div>
              <div class="stat-box">
                <span class="stat-number">{{ reportData.result_summary.cgpa }}</span>
                <span class="stat-text">CGPA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject-wise Results Table -->
      <div class="modern-card results-table-card">
        <div class="card-header gradient-header-green">
          <i class="fas fa-list-alt mr-2"></i>
          <h5 class="mb-0">Subject-wise Performance</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="5%">SL</th>
                <th width="20%">Subject Name</th>
                <th width="10%">Code</th>
                <th width="12%">Department</th>
                <th class="text-center" width="8%">Credit</th>
                <th class="text-center" width="8%">Exams</th>
                <th class="text-center" width="10%">Marks</th>
                <th class="text-center" width="8%">%</th>
                <th class="text-center" width="8%">Grade</th>
                <th class="text-center" width="6%">GPA</th>
                <th class="text-center" width="8%">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(subject, index) in reportData.subject_wise_results" :key="'subj-' + index" class="table-row">
                <td>
                  <span class="sl-number">{{ index + 1 }}</span>
                </td>
                <td>
                  <strong class="subject-name">{{ subject.subject_name }}</strong>
                </td>
                <td>
                  <span class="subject-code">{{ subject.subject_code }}</span>
                </td>
                <td>
                  <small class="text-muted">{{ subject.department }}</small>
                </td>
                <td class="text-center">
                  <span class="credit-badge">{{ subject.credit_hours }}</span>
                </td>
                <td class="text-center">{{ subject.total_exams }}</td>
                <td class="text-center">
                  <div class="marks-cell">
                    <strong>{{ subject.marks_obtained }}</strong>
                    <span class="text-muted"> / {{ subject.total_marks }}</span>
                  </div>
                </td>
                <td class="text-center">
                  <span :class="'modern-badge badge-' + getPercentageBadge(subject.percentage)">
                    {{ subject.percentage }}%
                  </span>
                </td>
                <td class="text-center">
                  <span class="grade-badge">{{ subject.grade }}</span>
                </td>
                <td class="text-center">
                  <strong class="gpa-value">{{ subject.gpa }}</strong>
                </td>
                <td class="text-center">
                  <span :class="'status-badge status-' + subject.status">
                    <i :class="subject.status === 'pass' ? 'fas fa-check' : 'fas fa-times'"></i>
                    {{ subject.status }}
                  </span>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr class="total-row">
                <td colspan="5" class="text-right">
                  <strong><i class="fas fa-calculator mr-2"></i>Overall Summary:</strong>
                </td>
                <td class="text-center">
                  <strong>{{ reportData.subject_wise_results.length }}</strong>
                </td>
                <td class="text-center">
                  <strong>{{ reportData.result_summary.total_marks_obtained }}</strong>
                  <span class="text-muted"> / {{ reportData.result_summary.total_marks }}</span>
                </td>
                <td class="text-center">
                  <strong class="highlight-value">{{ reportData.result_summary.overall_percentage }}%</strong>
                </td>
                <td class="text-center">
                  <strong class="highlight-value">{{ reportData.result_summary.overall_grade }}</strong>
                </td>
                <td class="text-center">
                  <strong class="highlight-value">{{ reportData.result_summary.cgpa }}</strong>
                </td>
                <td class="text-center">
                  <strong class="highlight-value">{{ reportData.result_summary.status }}</strong>
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Subject Performance Chart -->
      <div class="modern-card chart-card">
        <div class="card-header gradient-header-blue">
          <i class="fas fa-chart-line mr-2"></i>
          <h5 class="mb-0">Subject Performance Visualization</h5>
        </div>
        <div class="card-body">
          <canvas ref="subjectPerformanceChart" height="100"></canvas>
        </div>
      </div>

      <!-- Grade Distribution -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-orange">
              <i class="fas fa-chart-pie mr-2"></i>
              <h5 class="mb-0">Grade Distribution</h5>
            </div>
            <div class="card-body">
              <canvas ref="gradeDistChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-teal">
              <i class="fas fa-chart-bar mr-2"></i>
              <h5 class="mb-0">Pass/Fail Analysis</h5>
            </div>
            <div class="card-body">
              <canvas ref="passFailChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="printReport" class="action-btn print-btn">
          <i class="fas fa-print"></i>
          <span>Print Report</span>
        </button>
        <button @click="exportPDF" class="action-btn pdf-btn">
          <i class="fas fa-file-pdf"></i>
          <span>Export PDF</span>
        </button>
        <button @click="exportExcel" class="action-btn excel-btn">
          <i class="fas fa-file-excel"></i>
          <span>Export Excel</span>
        </button>
        <button @click="shareReport" class="action-btn share-btn">
          <i class="fas fa-share-alt"></i>
          <span>Share</span>
        </button>
      </div>
    </div>

    <!-- No Data -->
    <div v-if="!loading && !reportData" class="no-data-container">
      <div class="no-data-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <h4>No Report Generated</h4>
      <p>Please enter Student ID and select filters to generate the semester result report</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'StudentSemesterResult',

  data() {
    return {
      collegeName: '',//'Medical College for Women and Hospital',
      loading: false,
      reportData: null,
      sessions: [],
      filters: {
        studentId: '',
        sessionId: '',
        year: '',
        semester: ''
      },
      charts: {},
      circumference: 2 * Math.PI * 85
    }
  },

  computed: {
    strokeDashoffset() {
      if (!this.reportData) return this.circumference;
      const percentage = this.reportData.result_summary.overall_percentage;
      return this.circumference - (percentage / 100) * this.circumference;
    }
  },

  mounted() {
    this.loadSessions();
  },

  methods: {
    async loadSessions() {
      try {
        const response = await this.$api.get('/get-session');
        this.sessions = response.data;
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    },

    async fetchReport() {
      if (!this.filters.studentId) {
        this.$notify({
          type: 'warning',
          title: 'Warning',
          text: 'Please enter Student ID'
        });
        return;
      }

      this.loading = true;
      this.reportData = null;

      try {
        const response = await this.$api.get(
            `/reports/semester-result/student/${this.filters.studentId}`,
            { params: this.filters }
        );

        if (response.data.success) {
          this.reportData = response.data.data;
          this.$nextTick(() => {
            this.renderCharts();
          });

          this.$notify({
            type: 'success',
            title: 'Success',
            text: 'Report generated successfully'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load report'
        });
      } finally {
        this.loading = false;
      }
    },

    renderCharts() {
      this.renderSubjectPerformanceChart();
      this.renderGradeDistribution();
      this.renderPassFailChart();
    },

    renderSubjectPerformanceChart() {
      if (this.charts.subjectPerformance) {
        this.charts.subjectPerformance.destroy();
      }

      const ctx = this.$refs.subjectPerformanceChart.getContext('2d');
      const data = this.reportData.subject_wise_results;

      this.charts.subjectPerformance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(s => s.subject_code),
          datasets: [{
            label: 'Percentage',
            data: data.map(s => s.percentage),
            backgroundColor: data.map(s => this.getChartColor(s.percentage)),
            borderRadius: 10,
            borderSkipped: false,
          }, {
            label: 'GPA (×20)',
            data: data.map(s => s.gpa * 20),
            type: 'line',
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(102, 126, 234)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 20,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.dataset.type === 'line') {
                    label += (context.parsed.y / 20).toFixed(2) + ' GPA';
                  } else {
                    label += context.parsed.y.toFixed(2) + '%';
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },

    renderGradeDistribution() {
      if (this.charts.gradeDist) {
        this.charts.gradeDist.destroy();
      }

      const ctx = this.$refs.gradeDistChart.getContext('2d');
      const data = this.reportData.subject_wise_results;

      // Count grades
      const gradeCounts = {};
      data.forEach(subject => {
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
            ],
            borderWidth: 4,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          }
        }
      });
    },

    renderPassFailChart() {
      if (this.charts.passFail) {
        this.charts.passFail.destroy();
      }

      const ctx = this.$refs.passFailChart.getContext('2d');
      const passed = this.reportData.result_summary.passed_subjects;
      const failed = this.reportData.result_summary.failed_subjects;

      this.charts.passFail = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Pass', 'Fail'],
          datasets: [{
            label: 'Number of Subjects',
            data: [passed, failed],
            backgroundColor: [
              'rgba(40, 167, 69, 0.8)',
              'rgba(220, 53, 69, 0.8)'
            ],
            borderRadius: 10,
            borderSkipped: false,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },

    getChartColor(percentage) {
      if (percentage >= 80) return 'rgba(40, 167, 69, 0.8)';
      if (percentage >= 60) return 'rgba(23, 162, 184, 0.8)';
      if (percentage >= 50) return 'rgba(255, 193, 7, 0.8)';
      if (percentage >= 40) return 'rgba(253, 126, 20, 0.8)';
      return 'rgba(220, 53, 69, 0.8)';
    },

    getPercentageBadge(percentage) {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'primary';
      if (percentage >= 50) return 'info';
      if (percentage >= 40) return 'warning';
      return 'danger';
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
    },

    async shareReport() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Share functionality will be implemented'
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
* {
  box-sizing: border-box;
}

.semester-result-container {
  /*padding: 30px;*/
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Header Card */
.header-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.college-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 42px;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 20px 50px rgba(102, 126, 234, 0.6);
  }
}

.college-name {
  color: #2d3748;
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.report-title {
  color: #4a5568;
  font-weight: 600;
  font-size: 22px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Filters Section */
.filters-section {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 30px;
  border-radius: 20px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.modern-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.modern-input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  font-weight: 500;
}

.modern-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.modern-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 14px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
}

.modern-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading */
.loading-container {
  background: white;
  border-radius: 24px;
  padding: 80px 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modern-spinner {
  display: inline-block;
  margin-bottom: 20px;
}

.spinner {
  width: 70px;
  height: 70px;
  border: 6px solid #e2e8f0;
  border-top: 6px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #4a5568;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* Report Content */
.report-content {
  animation: fadeInUp 0.6s ease-out;
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

/* Modern Card */
.modern-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.modern-card:hover {
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.card-header {
  padding: 25px 35px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-header-purple {
  background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%);
}

.gradient-header-green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.gradient-header-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-header-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-header-teal {
  background: linear-gradient(135deg, #13547a 0%, #80d0c7 100%);
}

.card-body {
  padding: 35px;
}

/* Info Items */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 12px;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.info-label {
  font-weight: 600;
  color: #718096;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label i {
  color: #667eea;
  font-size: 16px;
}

.info-value {
  color: #2d3748;
  font-weight: 700;
  font-size: 15px;
}

/* Summary Cards Grid */
.summary-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  transition: height 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.summary-card:hover::before {
  height: 100%;
  opacity: 0.1;
}

.stat-card-1::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card-2::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3::before { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card-5::before { background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%); }
.stat-card-6::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-7::before { background: linear-gradient(135deg, #f12711 0%, #f5af19 100%); }
.stat-card-8::before { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }

.status-fail-card::before { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%) !important; }

.stat-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.stat-card-1 .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card-2 .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3 .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4 .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card-5 .stat-icon { background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%); }
.stat-card-6 .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-7 .stat-icon { background: linear-gradient(135deg, #f12711 0%, #f5af19 100%); }
.stat-card-8 .stat-icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }

.status-fail-card .stat-icon { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }

.stat-content {
  text-align: center;
}

.stat-label {
  color: #718096;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  margin: 10px 0;
  line-height: 1;
}

.stat-value.status-text {
  font-size: 28px;
}

.stat-subtext {
  color: #a0aec0;
  font-size: 12px;
  margin-top: 8px;
}

.stat-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 15px;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  width: 70%;
  animation: barFill 1.5s ease-out;
}

@keyframes barFill {
  from { width: 0; }
}

.stat-card-1 .stat-bar-fill { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.stat-card-2 .stat-bar-fill { background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3 .stat-bar-fill { background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4 .stat-bar-fill { background: linear-gradient(90deg, #fa709a 0%, #fee140 100%); }
.stat-card-5 .stat-bar-fill { background: linear-gradient(90deg, #a044ff 0%, #6a3093 100%); }
.stat-card-6 .stat-bar-fill { background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-7 .stat-bar-fill { background: linear-gradient(90deg, #f12711 0%, #f5af19 100%); }
.stat-card-8 .stat-bar-fill { background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%); }

/* Marks Summary */
.marks-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 40px;
}

.marks-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.marks-inner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.marks-obtained {
  font-size: 42px;
  font-weight: 800;
  color: #667eea;
  line-height: 1;
}

.marks-separator {
  font-size: 24px;
  color: #cbd5e0;
  margin: 5px 0;
}

.marks-total {
  font-size: 28px;
  color: #718096;
  font-weight: 600;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 1.5s ease-out;
  stroke-linecap: round;
}

.marks-stats {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 35px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 8px;
}

.stat-text {
  font-size: 13px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Table */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.modern-table th {
  padding: 20px 15px;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 3px solid #e2e8f0;
}

.modern-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.modern-table tbody tr:hover {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  transform: scale(1.01);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.modern-table td {
  padding: 18px 15px;
  color: #4a5568;
  font-size: 14px;
}

.sl-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.subject-name {
  color: #2d3748;
  font-size: 15px;
}

.subject-code {
  display: inline-block;
  padding: 6px 12px;
  background: #f7fafc;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #667eea;
}

.credit-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.marks-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.modern-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.badge-success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.badge-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.grade-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%);
  color: white;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 5px 15px rgba(160, 68, 255, 0.3);
}

.gpa-value {
  color: #667eea;
  font-size: 16px;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.status-pass {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.status-fail {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.total-row {
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  font-weight: 700;
}

.total-row td {
  padding: 25px 15px;
  font-size: 15px;
  color: #2d3748;
  border-top: 3px solid #cbd5e0;
}

.highlight-value {
  color: #667eea;
  font-size: 16px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
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

.share-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* No Data */
.no-data-container {
  background: white;
  border-radius: 24px;
  padding: 100px 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
}

.no-data-icon {
  font-size: 100px;
  color: #cbd5e0;
  margin-bottom: 25px;
}

.no-data-container h4 {
  color: #2d3748;
  font-weight: 700;
  font-size: 28px;
  margin-bottom: 15px;
}

.no-data-container p {
  color: #718096;
  font-size: 16px;
  max-width: 500px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .semester-result-container {
    padding: 20px 15px;
  }

  .header-card {
    padding: 25px 20px;
  }

  .college-name {
    font-size: 26px;
  }

  .report-title {
    font-size: 18px;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  .summary-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-value {
    font-size: 28px;
  }

  .marks-display {
    flex-direction: column;
  }

  .marks-stats {
    justify-content: center;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .card-body {
    padding: 25px 20px;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 12px 8px;
  }
}

@media (max-width: 576px) {
  .summary-cards-grid {
    grid-template-columns: 1fr;
  }

  .filters-section .col-md-3,
  .filters-section .col-md-2 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Print Styles */
@media print {
  .semester-result-container {
    background: white;
    padding: 0;
  }

  .header-card .filters-section,
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

/* Utility Classes */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: #a0aec0; }
.text-danger { color: #f56565; }

.mb-0 { margin-bottom: 0 !important; }
.mb-3 { margin-bottom: 1rem !important; }
.mb-4 { margin-bottom: 1.5rem !important; }
.mr-2 { margin-right: 0.5rem !important; }

.p-0 { padding: 0 !important; }

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-2, .col-md-3, .col-md-6 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px) {
  .col-md-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
  .col-md-3 { flex: 0 0 25%; max-width: 25%; }
  .col-md-6 { flex: 0 0 50%; max-width: 50%; }
}
</style>