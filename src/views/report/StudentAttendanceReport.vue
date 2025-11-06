<template>
  <div class="attendance-report-container">
    <!-- Header -->
    <div class="report-header modern-card">
      <div class="card-body">
        <div class="header-content">
          <div class="logo-wrapper">
            <div class="logo-circle">
              <i class="fa fa-calendar-check"></i>
            </div>
          </div>
          <h3 class="college-name">{{ collegeName }}</h3>
          <h5 class="report-subtitle">
            <i class="fa fa-chart-line"></i>
            Student Attendance Report
          </h5>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="modern-label">
                <i class="fa fa-id-card mr-2"></i>Student ID
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
            <div class="col-md-2 mb-3">
              <label class="modern-label">
                <i class="fa fa-calendar mr-2"></i>Start Date
              </label>
              <input
                  v-model="filters.startDate"
                  type="date"
                  class="form-control modern-input"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label class="modern-label">
                <i class="fa fa-calendar-alt mr-2"></i>End Date
              </label>
              <input
                  v-model="filters.endDate"
                  type="date"
                  class="form-control modern-input"
              />
            </div>
            <div class="col-md-3 mb-3">
              <label class="modern-label">
                <i class="fa fa-credit-card mr-2"></i>Card Type
              </label>
              <select v-model="filters.cardTypeId" class="form-control modern-input">
                <option value="">All Cards</option>
                <option
                    v-for="card in cardTypes"
                    :key="card.id"
                    :value="card.id"
                >
                  {{ card.card_name }}
                </option>
              </select>
            </div>
            <div class="col-md-2 mb-3">
              <label class="modern-label">&nbsp;</label>
              <button
                  @click="fetchReport"
                  class="btn btn-block modern-btn"
                  :disabled="loading"
              >
                <i class="fa fa-search mr-2"></i>
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
      <p class="loading-text">Generating attendance report...</p>
    </div>

    <!-- Report Content -->
    <div v-if="!loading && reportData" class="report-content">

      <!-- Student Info Card -->
      <div class="modern-card student-info-card">
        <div class="card-header gradient-header">
          <i class="fa fa-user-graduate mr-2"></i>
          <h5 class="mb-0">Student Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-user"></i> Name
                </span>
                <span class="info-value">{{ reportData.student_info.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-id-badge"></i> Student ID
                </span>
                <span class="info-value">{{ reportData.student_info.student_id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-hashtag"></i> Roll No
                </span>
                <span class="info-value">{{ reportData.student_info.roll_no }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-calendar-alt"></i> Session
                </span>
                <span class="info-value">{{ reportData.student_info.session }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-layer-group"></i> Year & Semester
                </span>
                <span class="info-value">
                  {{ reportData.student_info.year }} Year, {{ reportData.student_info.semester }} Semester
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-building"></i> Department
                </span>
                <span class="info-value">{{ reportData.student_info.department }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div class="summary-stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-calendar-check"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Total Classes</h6>
            <h3 class="stat-value">{{ reportData.summary.total_classes }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-check-circle"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Present</h6>
            <h3 class="stat-value">{{ reportData.summary.present }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (reportData.summary.present / reportData.summary.total_classes * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-times-circle"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Absent</h6>
            <h3 class="stat-value">{{ reportData.summary.absent }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (reportData.summary.absent / reportData.summary.total_classes * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-clock"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Late</h6>
            <h3 class="stat-value">{{ reportData.summary.late }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (reportData.summary.late / reportData.summary.total_classes * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-5">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-user-check"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Excused</h6>
            <h3 class="stat-value">{{ reportData.summary.excused }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (reportData.summary.excused / reportData.summary.total_classes * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div :class="'stat-card stat-card-6 ' + getAttendanceCardClass(reportData.summary.attendance_percentage)">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-percentage"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Attendance Rate</h6>
            <h3 class="stat-value">{{ reportData.summary.attendance_percentage }}%</h3>
            <p class="stat-status">{{ reportData.summary.status }}</p>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: reportData.summary.attendance_percentage + '%'}"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row">
        <!-- Card Type Wise Chart -->
        <div class="col-md-6 mb-4">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-blue">
              <i class="fa fa-chart-bar mr-2"></i>
              <h6 class="mb-0">Card Type-wise Attendance</h6>
            </div>
            <div class="card-body">
              <canvas ref="cardTypeChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Class Type Wise Chart -->
        <div class="col-md-6 mb-4">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-green">
              <i class="fa fa-chart-pie mr-2"></i>
              <h6 class="mb-0">Class Type-wise Attendance</h6>
            </div>
            <div class="card-body">
              <canvas ref="classTypeChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="modern-card chart-card mb-4">
        <div class="card-header gradient-header-orange">
          <i class="fa fa-chart-line mr-2"></i>
          <h5 class="mb-0">Monthly Attendance Trend</h5>
        </div>
        <div class="card-body">
          <canvas ref="monthlyTrendChart" height="80"></canvas>
        </div>
      </div>

      <!-- Card Type Wise Table -->
      <div class="modern-card mb-4" v-if="reportData.card_type_wise && reportData.card_type_wise.length > 0">
        <div class="card-header gradient-header-purple">
          <i class="fa fa-table mr-2"></i>
          <h5 class="mb-0">Card Type-wise Summary</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="25%">Card Name</th>
                <th width="20%">Department</th>
                <th class="text-center" width="8%">Total</th>
                <th class="text-center" width="8%">Present</th>
                <th class="text-center" width="8%">Absent</th>
                <th class="text-center" width="8%">Late</th>
                <th class="text-center" width="8%">Excused</th>
                <th class="text-center" width="15%">Percentage</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(card, index) in reportData.card_type_wise" :key="'card-' + index" class="table-row">
                <td>
                  <strong class="card-name">{{ card.card_name }}</strong>
                </td>
                <td>
                  <span class="dept-badge">{{ card.department }}</span>
                </td>
                <td class="text-center">
                  <span class="count-badge">{{ card.total }}</span>
                </td>
                <td class="text-center">
                  <span class="count-badge present-count">{{ card.present }}</span>
                </td>
                <td class="text-center">
                  <span class="count-badge absent-count">{{ card.absent }}</span>
                </td>
                <td class="text-center">
                  <span class="count-badge late-count">{{ card.late }}</span>
                </td>
                <td class="text-center">
                  <span class="count-badge excused-count">{{ card.excused }}</span>
                </td>
                <td class="text-center">
                  <span :class="'modern-badge badge-' + getAttendanceBadge(card.percentage)">
                    {{ card.percentage }}%
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Detailed Records -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-dark">
          <i class="fa fa-list mr-2"></i>
          <h5 class="mb-0">Detailed Attendance Records</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table records-table">
              <thead>
              <tr>
                <th width="8%">Date</th>
                <th width="15%">Card Name</th>
                <th width="12%">Department</th>
                <th width="10%">Class Type</th>
                <th width="25%">Topic</th>
                <th width="12%">Conducted By</th>
                <th width="10%">Status</th>
                <th width="8%">Remarks</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(record, index) in reportData.records" :key="'rec-' + index" class="table-row">
                <td>
                  <span class="date-badge">{{ formatDate(record.date) }}</span>
                </td>
                <td>
                  <small class="text-muted">{{ record.card_name }}</small>
                </td>
                <td>
                  <small class="text-muted">{{ record.department }}</small>
                </td>
                <td>
                  <span class="type-badge">{{ record.class_type }}</span>
                </td>
                <td>
                  <small>{{ record.topic || '-' }}</small>
                </td>
                <td>
                  <small>{{ record.conducted_by || '-' }}</small>
                </td>
                <td>
                  <span :class="'status-badge status-' + record.status">
                    <i :class="getStatusIcon(record.status)"></i>
                    {{ record.status }}
                  </span>
                </td>
                <td>
                  <small class="remarks-text">{{ record.remarks || '-' }}</small>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
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

    <!-- No Data -->
    <div v-if="!loading && !reportData" class="no-data-container">
      <div class="no-data-icon">
        <i class="fa fa-calendar-times"></i>
      </div>
      <h4>No Report Generated</h4>
      <p>Please enter Student ID and click Generate to view attendance report</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'StudentAttendanceReport',

  data() {
    return {
      collegeName: 'Your Medical College Name',
      loading: false,
      reportData: null,
      cardTypes: [],
      filters: {
        studentId: '',
        startDate: '',
        endDate: '',
        cardTypeId: ''
      },
      charts: {
        cardType: null,
        classType: null,
        monthlyTrend: null
      }
    }
  },

  mounted() {
    this.loadCardTypes();
  },

  methods: {
    async loadCardTypes() {
      try {
        const response = await this.$api.get('/card-types');
        this.cardTypes = response.data.data.data;
      } catch (error) {
        console.error('Error loading card types:', error);
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

      try {
        const response = await this.$api.get(
            `/reports/attendance/student/${this.filters.studentId}`,
            { params: this.filters }
        );

        if (response.data.success) {
          this.reportData = response.data.data;
          this.$nextTick(() => {
            this.renderCharts();
          });
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load attendance report'
        });
      } finally {
        this.loading = false;
      }
    },

    renderCharts() {
      this.renderCardTypeChart();
      this.renderClassTypeChart();
      this.renderMonthlyTrendChart();
    },

    renderCardTypeChart() {
      if (this.charts.cardType) {
        this.charts.cardType.destroy();
      }

      const ctx = this.$refs.cardTypeChart.getContext('2d');
      const data = this.reportData.card_type_wise;

      this.charts.cardType = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.card_name),
          datasets: [{
            label: 'Present',
            data: data.map(item => item.present),
            backgroundColor: 'rgba(67, 233, 123, 0.8)',
            borderRadius: 10,
            borderSkipped: false,
          }, {
            label: 'Absent',
            data: data.map(item => item.absent),
            backgroundColor: 'rgba(240, 147, 251, 0.8)',
            borderRadius: 10,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
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
            }
          },
          scales: {
            y: {
              beginAtZero: true,
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

    renderClassTypeChart() {
      if (this.charts.classType) {
        this.charts.classType.destroy();
      }

      const ctx = this.$refs.classTypeChart.getContext('2d');
      const data = this.reportData.class_type_wise;

      this.charts.classType = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(item => item.type),
          datasets: [{
            data: data.map(item => item.percentage),
            backgroundColor: [
              'rgba(102, 126, 234, 0.8)',
              'rgba(250, 112, 154, 0.8)',
              'rgba(67, 233, 123, 0.8)',
              'rgba(79, 172, 254, 0.8)',
              'rgba(255, 159, 64, 0.8)',
            ],
            borderWidth: 4,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
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

    renderMonthlyTrendChart() {
      if (this.charts.monthlyTrend) {
        this.charts.monthlyTrend.destroy();
      }

      const ctx = this.$refs.monthlyTrendChart.getContext('2d');
      const data = this.reportData.monthly_trend;

      this.charts.monthlyTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.month),
          datasets: [{
            label: 'Attendance %',
            data: data.map(item => item.percentage),
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: 'rgb(102, 126, 234)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointHoverRadius: 8,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
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

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB');
    },

    getAttendanceCardClass(percentage) {
      if (percentage >= 90) return 'status-excellent';
      if (percentage >= 80) return 'status-good';
      if (percentage >= 75) return 'status-average';
      if (percentage >= 60) return 'status-poor';
      return 'status-critical';
    },

    getAttendanceBadge(percentage) {
      if (percentage >= 75) return 'success';
      if (percentage >= 60) return 'warning';
      return 'danger';
    },

    getStatusIcon(status) {
      const icons = {
        'present': 'fa fa-check',
        'absent': 'fa fa-times',
        'late': 'fa fa-clock',
        'excused': 'fa fa-info-circle'
      };
      return icons[status] || 'fa fa-question';
    },

    printReport() {
      window.print();
    },

    async exportPDF() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'PDF export will be implemented'
      });
    },

    async exportExcel() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Excel export will be implemented'
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

.attendance-report-container {
  /*padding: 30px;*/
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Report Header */
.report-header {
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

.header-content {
  text-align: center;
  margin-bottom: 35px;
}

.logo-wrapper {
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

.report-subtitle {
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
  background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%);
}

.gradient-header-dark {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
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

/* Summary Stats Grid */
.summary-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  transition: height 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.stat-card:hover::before {
  height: 100%;
  opacity: 0.1;
}

.stat-card-1::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card-2::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3::before { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card-5::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-6::before { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }

.status-excellent::before { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.status-good::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.status-average::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.status-poor::before { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.status-critical::before { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }

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
.stat-card-5 .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-6 .stat-icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }

.status-excellent .stat-icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.status-good .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.status-average .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.status-poor .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.status-critical .stat-icon { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }

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

.stat-status {
  color: #a0aec0;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 600;
  text-transform: uppercase;
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
.stat-card-5 .stat-bar-fill { background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-6 .stat-bar-fill { background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%); }

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

.card-name {
  color: #2d3748;
  font-size: 15px;
}

.dept-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #f7fafc;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #667eea;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: #edf2f7;
  font-weight: 700;
  font-size: 14px;
  color: #2d3748;
}

.present-count {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%);
  color: #22543d;
}

.absent-count {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%);
  color: #742a2a;
}

.late-count {
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.2) 0%, rgba(254, 225, 64, 0.2) 100%);
  color: #744210;
}

.excused-count {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%);
  color: #1e4e8c;
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

.badge-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.badge-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.date-badge {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #4a5568;
}

.type-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #edf2f7;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #667eea;
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

.status-present {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.status-absent {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.status-late {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.status-excused {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.remarks-text {
  color: #718096;
  font-style: italic;
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
  .attendance-report-container {
    padding: 20px 15px;
  }

  .report-header {
    padding: 25px 20px;
  }

  .college-name {
    font-size: 26px;
  }

  .report-subtitle {
    font-size: 18px;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  .summary-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-value {
    font-size: 28px;
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
  .summary-stats-grid {
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
  .attendance-report-container {
    background: white;
    padding: 0;
  }

  .report-header .filters-section,
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