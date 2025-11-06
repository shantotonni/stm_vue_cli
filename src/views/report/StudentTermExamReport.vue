<template>
  <div class="term-exam-report-container">
    <!-- Header -->
    <div class="header-section">
      <div class="header-content">
        <h2 class="college-title">{{ collegeName }}</h2>
        <h4 class="report-title">
          <i class="fas fa-clipboard-list"></i> Student Term Examination Report
        </h4>
      </div>

      <!-- Filters -->
      <div class="filters-wrapper">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label><i class="fas fa-user"></i> Student ID <span class="required">*</span></label>
              <input
                  v-model="filters.studentId"
                  type="text"
                  class="form-control-modern"
                  placeholder="Enter Student ID"
                  @keyup.enter="fetchReport"
              />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label><i class="fas fa-calendar-alt"></i> Academic Year</label>
              <select v-model="filters.academicYearId" class="form-control-modern">
                <option value="1">2024-2025</option>
                <option value="2">2023-2024</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label><i class="fas fa-book"></i> Card Type</label>
              <select v-model="filters.cardTypeId" class="form-control-modern">
                <option value="">All Cards</option>
                <option v-for="card in cardTypes" :key="card.id" :value="card.id">
                  {{ card.card_name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>&nbsp;</label>
              <button
                  @click="fetchReport"
                  class="btn-generate"
                  :disabled="loading"
              >
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-screen">
      <div class="loader"></div>
      <p>Generating report...</p>
    </div>

    <!-- Report Content -->
    <div v-if="!loading && reportData" class="report-container">

      <!-- Student Info Banner -->
      <div class="student-banner">
        <div class="student-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="student-details">
          <h3>{{ reportData.student_info.name }}</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">ID:</span>
              <span class="value">{{ reportData.student_info.student_id }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Roll:</span>
              <span class="value">{{ reportData.student_info.roll_no }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Session:</span>
              <span class="value">{{ reportData.student_info.session }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Year:</span>
              <span class="value">{{ reportData.student_info.year }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Department:</span>
              <span class="value">{{ reportData.student_info.department }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="stats-grid">
        <div class="stat-box stat-primary">
          <div class="stat-icon">
            <i class="fas fa-clipboard-check"></i>
          </div>
          <div class="stat-info">
            <h4>{{ reportData.summary.total_cards }}</h4>
            <p>Total Cards</p>
          </div>
        </div>
        <div class="stat-box stat-success">
          <div class="stat-icon">
            <i class="fas fa-check-double"></i>
          </div>
          <div class="stat-info">
            <h4>{{ reportData.summary.passed_cards }}</h4>
            <p>Passed Cards</p>
          </div>
        </div>
        <div class="stat-box stat-danger">
          <div class="stat-icon">
            <i class="fas fa-times-circle"></i>
          </div>
          <div class="stat-info">
            <h4>{{ reportData.summary.failed_cards }}</h4>
            <p>Failed Cards</p>
          </div>
        </div>
        <div class="stat-box stat-info">
          <div class="stat-icon">
            <i class="fas fa-percentage"></i>
          </div>
          <div class="stat-info">
            <h4>{{ reportData.summary.pass_rate }}%</h4>
            <p>Pass Rate</p>
          </div>
        </div>
      </div>

      <!-- Term Comparison Chart -->
      <div class="comparison-section">
        <h5 class="section-header">
          <i class="fas fa-chart-line"></i> Term Comparison Analysis
        </h5>
        <div class="comparison-content">
          <div class="row">
            <div class="col-md-8">
              <div class="chart-container">
                <canvas ref="termComparisonChart" height="100"></canvas>
              </div>
            </div>
            <div class="col-md-4">
              <div class="comparison-stats">
                <div class="term-stat term-1">
                  <h6>1st Term</h6>
                  <div class="term-detail">
                    <span>Average:</span>
                    <strong>{{ reportData.term_comparison.term_1.avg_percentage }}%</strong>
                  </div>
                  <div class="term-detail">
                    <span>Passed:</span>
                    <strong class="text-success">{{ reportData.term_comparison.term_1.passed }}</strong>
                  </div>
                  <div class="term-detail">
                    <span>Failed:</span>
                    <strong class="text-danger">{{ reportData.term_comparison.term_1.failed }}</strong>
                  </div>
                </div>
                <div class="term-stat term-2">
                  <h6>2nd Term</h6>
                  <div class="term-detail">
                    <span>Average:</span>
                    <strong>{{ reportData.term_comparison.term_2.avg_percentage }}%</strong>
                  </div>
                  <div class="term-detail">
                    <span>Passed:</span>
                    <strong class="text-success">{{ reportData.term_comparison.term_2.passed }}</strong>
                  </div>
                  <div class="term-detail">
                    <span>Failed:</span>
                    <strong class="text-danger">{{ reportData.term_comparison.term_2.failed }}</strong>
                  </div>
                </div>
                <div class="improvement-indicator" v-if="reportData.term_comparison.improvement !== 0">
                  <i :class="reportData.term_comparison.improvement > 0 ? 'fas fa-arrow-up text-success' : 'fas fa-arrow-down text-danger'"></i>
                  <span>{{ Math.abs(reportData.term_comparison.improvement) }}%</span>
                  <small>{{ reportData.term_comparison.improvement > 0 ? 'Improvement' : 'Decline' }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card-wise Results -->
      <div class="cards-results-section">
        <h5 class="section-header">
          <i class="fas fa-id-card"></i> Card-wise Term Results
        </h5>
        <div v-for="(card, index) in reportData.card_wise_results" :key="'card-' + index" class="card-result-item">
          <div class="card-header-section" @click="toggleCard(index)">
            <div class="card-title">
              <h6>{{ card.card_name }}</h6>
              <span class="card-code">{{ card.card_code }}</span>
            </div>
            <div class="card-stats">
              <span class="stat-badge">
                {{ card.overall_marks_obtained }} / {{ card.overall_total_marks }}
              </span>
              <span :class="'status-badge status-' + card.overall_status">
                {{ card.overall_status }}
              </span>
              <span class="percentage-badge" :style="{ background: getPercentageColor(card.overall_percentage) }">
                {{ card.overall_percentage }}%
              </span>
            </div>
            <i :class="expandedCards.includes(index) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>

          <transition name="slide-fade">
            <div v-if="expandedCards.includes(index)" class="card-details-section">
              <div class="card-info-bar">
                <span><strong>Card Number:</strong> {{ card.card_number }}</span>
                <span><strong>Department:</strong> {{ card.department }}</span>
              </div>

              <div class="terms-grid">
                <div v-for="term in card.term_results" :key="'term-' + term.term_number" class="term-card">
                  <div class="term-header">
                    <h6>{{ term.term_name }}</h6>
                    <span class="exam-date">
                      <i class="far fa-calendar"></i> {{ formatDate(term.exam_date) }}
                    </span>
                  </div>
                  <div class="term-body">
                    <div class="marks-display">
                      <div class="marks-number">
                        <span class="obtained">{{ term.marks_obtained }}</span>
                        <span class="separator">/</span>
                        <span class="total">{{ term.total_marks }}</span>
                      </div>
                      <div class="percentage-circle" :style="{ background: getPercentageColor(term.percentage) }">
                        {{ term.percentage }}%
                      </div>
                    </div>
                    <div class="term-status">
                      <span :class="'term-status-badge status-' + term.status">
                        <i :class="term.status === 'pass' ? 'fas fa-check' : 'fas fa-times'"></i>
                        {{ term.status.toUpperCase() }}
                      </span>
                    </div>
                    <div class="term-remarks" v-if="term.remarks">
                      <i class="fas fa-comment-alt"></i>
                      <small>{{ term.remarks }}</small>
                    </div>
                    <div class="examiner-info" v-if="term.examiner">
                      <i class="fas fa-user-tie"></i>
                      <small>Examiner: {{ term.examiner }}</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress Bar for Card -->
              <div class="card-progress">
                <div class="progress-bar-wrapper">
                  <div
                      class="progress-bar-fill"
                      :style="{
                      width: card.overall_percentage + '%',
                      background: getPercentageColor(card.overall_percentage)
                    }"
                  >
                    <span>{{ card.overall_percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Performance Visualization -->
      <div class="visualization-section">
        <div class="row">
          <div class="col-md-6">
            <div class="chart-box">
              <h5 class="section-header">
                <i class="fas fa-chart-bar"></i> Card-wise Performance
              </h5>
              <canvas ref="cardPerformanceChart"></canvas>
            </div>
          </div>
          <div class="col-md-6">
            <div class="chart-box">
              <h5 class="section-header">
                <i class="fas fa-chart-pie"></i> Pass/Fail Distribution
              </h5>
              <canvas ref="passFailDistChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-bar">
        <button @click="printReport" class="action-btn btn-print">
          <i class="fas fa-print"></i> Print
        </button>
        <button @click="exportPDF" class="action-btn btn-pdf">
          <i class="fas fa-file-pdf"></i> PDF
        </button>
        <button @click="exportExcel" class="action-btn btn-excel">
          <i class="fas fa-file-excel"></i> Excel
        </button>
        <button @click="emailReport" class="action-btn btn-email">
          <i class="fas fa-envelope"></i> Email
        </button>
      </div>
    </div>

    <!-- No Data -->
    <div v-if="!loading && !reportData" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <h4>No Report Data</h4>
      <p>Enter Student ID and select filters to generate the term exam report</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'StudentTermExamReport',

  data() {
    return {
      collegeName: 'Your Medical College Name',
      loading: false,
      reportData: null,
      cardTypes: [],
      filters: {
        studentId: '',
        academicYearId: '1',
        cardTypeId: ''
      },
      expandedCards: [],
      charts: {}
    }
  },

  mounted() {
    this.loadCardTypes();
  },

  methods: {
    async loadCardTypes() {
      try {
        const response = await this.$api.get('/card-types');
        console.log(response)
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
      this.reportData = null;

      try {
        const response = await this.$api.get(
            `/reports/term-exam/student/${this.filters.studentId}`,
            { params: this.filters }
        );

        if (response.data.success) {
          this.reportData = response.data.data;
          this.expandedCards = []; // Reset expanded cards
          this.$nextTick(() => {
            this.renderCharts();
          });

          // this.$notify({
          //   type: 'success',
          //   title: 'Success',
          //   text: 'Report generated successfully'
          // });
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

    toggleCard(index) {
      const pos = this.expandedCards.indexOf(index);
      if (pos > -1) {
        this.expandedCards.splice(pos, 1);
      } else {
        this.expandedCards.push(index);
      }
    },

    renderCharts() {
      this.renderTermComparisonChart();
      this.renderCardPerformanceChart();
      this.renderPassFailChart();
    },

    renderTermComparisonChart() {
      if (this.charts.termComparison) {
        this.charts.termComparison.destroy();
      }

      const ctx = this.$refs.termComparisonChart.getContext('2d');
      const comparison = this.reportData.term_comparison;

      this.charts.termComparison = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1st Term', '2nd Term'],
          datasets: [{
            label: 'Average Percentage',
            data: [comparison.term_1.avg_percentage, comparison.term_2.avg_percentage],
            backgroundColor: [
              'rgba(102, 126, 234, 0.8)',
              'rgba(118, 75, 162, 0.8)'
            ],
            borderRadius: 10,
            borderWidth: 2,
            borderColor: [
              'rgb(102, 126, 234)',
              'rgb(118, 75, 162)'
            ]
          }, {
            label: 'Passed',
            data: [comparison.term_1.passed, comparison.term_2.passed],
            backgroundColor: 'rgba(40, 167, 69, 0.6)',
            borderRadius: 10
          }, {
            label: 'Failed',
            data: [comparison.term_1.failed, comparison.term_2.failed],
            backgroundColor: 'rgba(220, 53, 69, 0.6)',
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 15,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    renderCardPerformanceChart() {
      if (this.charts.cardPerformance) {
        this.charts.cardPerformance.destroy();
      }

      const ctx = this.$refs.cardPerformanceChart.getContext('2d');
      const cards = this.reportData.card_wise_results;

      this.charts.cardPerformance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: cards.map(c => c.card_code),
          datasets: [{
            label: 'Overall Percentage',
            data: cards.map(c => c.overall_percentage),
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgb(102, 126, 234)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(102, 126, 234)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(102, 126, 234)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    },

    renderPassFailChart() {
      if (this.charts.passFail) {
        this.charts.passFail.destroy();
      }

      const ctx = this.$refs.passFailDistChart.getContext('2d');
      const passed = this.reportData.summary.passed_cards;
      const failed = this.reportData.summary.failed_cards;

      this.charts.passFail = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed'],
          datasets: [{
            data: [passed, failed],
            backgroundColor: [
              'rgba(40, 167, 69, 0.8)',
              'rgba(220, 53, 69, 0.8)'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    },

    getPercentageColor(percentage) {
      if (percentage >= 80) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      if (percentage >= 60) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      if (percentage >= 50) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      if (percentage >= 40) return 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)';
      return 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-GB');
    },

    printReport() {
      window.print();
    },

    async exportPDF() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'PDF export functionality'
      });
    },

    async exportExcel() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Excel export functionality'
      });
    },

    async emailReport() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Email functionality'
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
.term-exam-report-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /*padding: 30px;*/
}

.header-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.header-content {
  text-align: center;
  margin-bottom: 25px;
}

.college-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.report-title {
  color: #667eea;
  font-weight: 600;
  margin: 0;
}

.filters-wrapper {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

.form-control-modern {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control-modern:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.required {
  color: #dc3545;
}

.btn-generate {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading */
.loading-screen {
  background: white;
  border-radius: 20px;
  padding: 100px 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Report Container */
.report-container {
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

/* Student Banner */
.student-banner {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.student-avatar {
  font-size: 5rem;
  color: #667eea;
}

.student-details h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 700;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  gap: 10px;
}

.detail-item .label {
  color: #666;
  font-weight: 600;
}

.detail-item .value {
  color: #2c3e50;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-box {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.3;
}

.stat-info h4 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-info p {
  margin: 5px 0 0;
  color: #666;
}

.stat-primary { border-left: 5px solid #667eea; }
.stat-success { border-left: 5px solid #28a745; }
.stat-danger { border-left: 5px solid #dc3545; }
.stat-info { border-left: 5px solid #17a2b8; }

/* Comparison Section */
.comparison-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.section-header {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
}

.chart-container {
  height: 300px;
}

.comparison-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.term-stat {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

.term-stat h6 {
  color: #667eea;
  font-weight: 700;
  margin-bottom: 15px;
}

.term-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.improvement-indicator {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
}

.improvement-indicator i {
  font-size: 2rem;
  margin-bottom: 10px;
}

.improvement-indicator span {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Card Results */
.cards-results-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.card-result-item {
  background: #f8f9fa;
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header-section {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.card-header-section:hover {
  background: #e9ecef;
}

.card-title h6 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-weight: 700;
}

.card-code {
  color: #666;
  font-size: 0.85rem;
}

.card-stats {
  display: flex;
  gap: 15px;
  align-items: center;
}

.stat-badge {
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.status-badge {
  padding: 6px 15px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.status-pass {
  background: #28a745;
  color: white;
}

.status-fail {
  background: #dc3545;
  color: white;
}

.percentage-badge {
  padding: 8px 15px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
}

.card-details-section {
  padding: 20px;
  border-top: 2px solid #dee2e6;
}

.card-info-bar {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 10px;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.term-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.term-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
}

.term-header h6 {
  margin: 0 0 5px 0;
  font-weight: 700;
}

.exam-date {
  font-size: 0.85rem;
  opacity: 0.9;
}

.term-body {
  padding: 20px;
}

.marks-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.marks-number {
  font-size: 1.5rem;
  font-weight: 700;
}

.marks-number .obtained {
  color: #667eea;
}

.marks-number .separator {
  color: #999;
  margin: 0 10px;
}

.marks-number .total {
  color: #666;
}

.percentage-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.term-status {
  margin-bottom: 15px;
}

.term-status-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.term-remarks, .examiner-info {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
}

.card-progress {
  margin-top: 20px;
}

.progress-bar-wrapper {
  height: 30px;
  background: #e9ecef;
  border-radius: 15px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
  color: white;
  font-weight: 700;
  transition: width 1s ease;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Visualization */
.visualization-section {
  margin-bottom: 30px;
}

.chart-box {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.btn-print { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.btn-pdf { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }
.btn-excel { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.btn-email { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

/* Empty State */
.empty-state {
  background: white;
  border-radius: 20px;
  padding: 100px 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.empty-icon {
  font-size: 5rem;
  color: #667eea;
  margin-bottom: 20px;
}

.empty-state h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .term-exam-report-container {
    padding: 15px;
  }

  .student-banner {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .terms-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

@media print {
  .filters-wrapper,
  .action-bar {
    display: none !important;
  }

  .term-exam-report-container {
    background: white;
    padding: 0;
  }

  .card-header-section {
    pointer-events: none;
  }
}
</style>