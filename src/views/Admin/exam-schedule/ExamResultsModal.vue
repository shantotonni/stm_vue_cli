<template>
  <transition name="modal-fade">
    <div v-if="show && exam" class="modal-overlay" @click.self="close">
      <div class="modern-results-modal">
        <!-- Header -->
        <div class="modal-header-results">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-title">Exam Results</h2>
              <p class="modal-subtitle">{{ exam.title }}</p>
              <div class="exam-info">
                <span class="info-badge">
                  <i class="fas fa-star"></i>
                  Total Marks: {{ exam.total_marks }}
                </span>
                <span class="info-badge">
                  <i class="fas fa-check-circle"></i>
                  Passing: {{ exam.passing_marks }}
                </span>
              </div>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-results">
          <!-- Statistics Cards -->
          <div v-if="results.length > 0" class="stats-grid">
            <div class="stat-card stat-total">
              <div class="stat-icon-wrapper">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.total_students }}</div>
                <div class="stat-label">Total Students</div>
              </div>
              <div class="stat-sparkline">
                <div class="sparkline-bar"></div>
              </div>
            </div>

            <div class="stat-card stat-passed">
              <div class="stat-icon-wrapper">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.passed }}</div>
                <div class="stat-label">Passed</div>
                <div class="stat-percentage">
                  {{ getPassPercentage() }}% Pass Rate
                </div>
              </div>
              <div class="stat-trend positive">
                <i class="fas fa-arrow-up"></i>
              </div>
            </div>

            <div class="stat-card stat-failed">
              <div class="stat-icon-wrapper">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.failed }}</div>
                <div class="stat-label">Failed</div>
                <div class="stat-percentage">
                  {{ getFailPercentage() }}% Fail Rate
                </div>
              </div>
              <div class="stat-trend negative">
                <i class="fas fa-arrow-down"></i>
              </div>
            </div>

            <div class="stat-card stat-average">
              <div class="stat-icon-wrapper">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">
                  {{ statistics.average_marks ? statistics.average_marks.toFixed(2) : '0' }}
                </div>
                <div class="stat-label">Average Marks</div>
                <div class="stat-range">
                  Highest: {{ statistics.highest_marks }} | Lowest: {{ statistics.lowest_marks }}
                </div>
              </div>
              <div class="circular-progress">
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path class="circle-bg"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path class="circle"
                        :stroke-dasharray="`${getAveragePercentage()}, 100`"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons-section">
            <button
                v-if="results.length === 0"
                class="action-btn btn-primary-action"
                @click="showBulkEntry = true"
            >
              <i class="fas fa-edit"></i>
              <span>Enter Results</span>
            </button>

            <div v-else class="action-group">
              <button class="action-btn btn-success-action" @click="exportResults">
                <i class="fas fa-file-excel"></i>
                <span>Export Excel</span>
              </button>
              <button class="action-btn btn-info-action" @click="printResults">
                <i class="fas fa-print"></i>
                <span>Print Results</span>
              </button>
              <button class="action-btn btn-secondary-action" @click="showBulkEntry = true">
                <i class="fas fa-plus"></i>
                <span>Add More</span>
              </button>
            </div>
          </div>

          <!-- Bulk Results Entry -->
          <transition name="slide-down">
            <div v-if="showBulkEntry" class="bulk-entry-container">
              <div class="bulk-entry-header">
                <div class="header-left">
                  <i class="fas fa-edit"></i>
                  <h3>Bulk Results Entry</h3>
                </div>
                <button class="close-bulk-btn" @click="showBulkEntry = false">
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="bulk-entry-body">
                <div class="info-alert">
                  <i class="fas fa-info-circle"></i>
                  <div class="alert-content">
                    <strong>Instructions:</strong>
                    <p>Enter marks for each student. Total Marks: <strong>{{ exam.total_marks }}</strong>, Passing Marks: <strong>{{ exam.passing_marks }}</strong></p>
                  </div>
                </div>

                <form @submit.prevent="saveBulkResults">
                  <div class="results-table-container">
                    <table class="results-entry-table">
                      <thead>
                      <tr>
                        <th class="col-id">Student ID</th>
                        <th class="col-name">Name</th>
                        <th class="col-marks">Marks Obtained</th>
                        <th class="col-grade">Grade</th>
                        <th class="col-status">Status</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(student, index) in students" :key="student.id">
                        <td>
                          <span class="student-id-badge">{{ student.student_id }}</span>
                        </td>
                        <td>
                          <div class="student-name-cell">
                            <div class="student-avatar">
                              {{ getInitials(student.name) }}
                            </div>
                            <span>{{ student.name }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="marks-input-wrapper">
                            <input
                                type="number"
                                class="marks-input"
                                v-model.number="bulkResults[index].marks_obtained"
                                :max="exam.total_marks"
                                min="0"
                                step="0.5"
                                required
                                @input="calculateGrade(index)"
                                placeholder="0.0"
                            >
                            <span class="marks-total">/ {{ exam.total_marks }}</span>
                          </div>
                        </td>
                        <td>
                          <span class="grade-badge" :class="'grade-' + bulkResults[index].grade.replace('+', 'plus').replace('-', 'minus')">
                            {{ bulkResults[index].grade }}
                          </span>
                        </td>
                        <td>
                          <span
                              class="status-badge"
                              :class="bulkResults[index].marks_obtained >= exam.passing_marks ? 'status-pass' : 'status-fail'"
                          >
                            <i class="fas" :class="bulkResults[index].marks_obtained >= exam.passing_marks ? 'fa-check' : 'fa-times'"></i>
                            {{ getPassFailText(bulkResults[index].marks_obtained) }}
                          </span>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="form-actions">
                    <button type="button" class="btn-cancel" @click="showBulkEntry = false">
                      <i class="fas fa-times-circle"></i>
                      Cancel
                    </button>
                    <button type="submit" class="btn-submit" :disabled="submitting">
                      <span v-if="submitting">
                        <i class="fas fa-spinner fa-spin"></i>
                        Submitting...
                      </span>
                      <span v-else>
                        <i class="fas fa-save"></i>
                        Submit All Results
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <!-- Results Table -->
          <div v-if="results.length > 0 && !showBulkEntry" class="results-section">
            <div class="section-header">
              <h3>
                <i class="fas fa-trophy"></i>
                Published Results
              </h3>
              <div class="result-count">
                {{ results.length }} Students
              </div>
            </div>

            <div class="results-table-wrapper">
              <table class="results-table">
                <thead>
                <tr>
                  <th class="rank-col">Rank</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(result, index) in results" :key="result.id" class="result-row">
                  <td class="rank-cell">
                    <div class="rank-badge" :class="'rank-' + (index + 1)">
                      <span v-if="index === 0" class="medal gold">🥇</span>
                      <span v-else-if="index === 1" class="medal silver">🥈</span>
                      <span v-else-if="index === 2" class="medal bronze">🥉</span>
                      <span v-else class="rank-number">{{ index + 1 }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="student-id-text">{{ result.student.student_id }}</span>
                  </td>
                  <td>
                    <div class="student-info-cell">
                      <div class="student-avatar-small">
                        {{ getInitials(result.student.name) }}
                      </div>
                      <span class="student-name-text">{{ result.student.name }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="marks-display">
                      <span class="marks-obtained">{{ result.marks_obtained }}</span>
                      <span class="marks-divider">/</span>
                      <span class="marks-total-display">{{ exam.total_marks }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="grade-badge-result" :class="'grade-' + result.grade.replace('+', 'plus').replace('-', 'minus')">
                      {{ result.grade }}
                    </span>
                  </td>
                  <td>
                    <span
                        class="status-badge-result"
                        :class="result.marks_obtained >= exam.passing_marks ? 'status-pass' : 'status-fail'"
                    >
                      <i class="fas" :class="result.marks_obtained >= exam.passing_marks ? 'fa-check-circle' : 'fa-times-circle'"></i>
                      {{ result.marks_obtained >= exam.passing_marks ? 'PASS' : 'FAIL' }}
                    </span>
                  </td>
                  <td>
                    <div class="percentage-cell">
                      <div class="percentage-bar">
                        <div class="percentage-fill" :style="{ width: calculatePercentage(result.marks_obtained) + '%' }"></div>
                      </div>
                      <span class="percentage-text">{{ calculatePercentage(result.marks_obtained) }}%</span>
                    </div>
                  </td>
                  <td>
                    <button class="action-icon-btn btn-edit-result" @click="editResult(result)" title="Edit Result">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Grade Distribution -->
            <div class="grade-distribution-card">
              <div class="card-header-grade">
                <i class="fas fa-chart-pie"></i>
                <h3>Grade Distribution</h3>
              </div>
              <div class="card-body-grade">
                <div class="grade-grid">
                  <div v-for="grade in gradeDistribution" :key="grade.name" class="grade-item">
                    <div class="grade-item-header">
                      <div class="grade-label">
                        <span class="grade-name">{{ grade.name }}</span>
                        <span class="grade-range">({{ grade.min }}% - {{ grade.max }}%)</span>
                      </div>
                      <div class="grade-stats">
                        <span class="grade-count">{{ grade.count }}</span>
                        <span class="grade-students">students</span>
                      </div>
                    </div>
                    <div class="grade-progress">
                      <div
                          class="grade-progress-bar"
                          :class="'grade-bar-' + grade.name.replace('+', 'plus').replace('-', 'minus')"
                          :style="{ width: grade.percentage + '%' }"
                      >
                        <span class="progress-label">{{ grade.percentage.toFixed(1) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="results.length === 0 && !showBulkEntry" class="empty-state-results">
            <div class="empty-icon-wrapper">
              <div class="empty-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="empty-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
                <div class="ring ring-3"></div>
              </div>
            </div>
            <h3 class="empty-title">No Results Yet</h3>
            <p class="empty-text">Get started by entering exam results for your students</p>
            <button class="btn-start-entry" @click="showBulkEntry = true">
              <i class="fas fa-plus-circle"></i>
              Enter Results Now
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-results">
          <div class="footer-info">
            <i class="fas fa-info-circle"></i>
            <span>{{ results.length }} result{{ results.length !== 1 ? 's' : '' }} recorded</span>
          </div>
          <button class="btn-close-footer" @click="close">
            <i class="fas fa-times-circle"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ExamResultsModal',

  props: {
    show: Boolean,
    exam: Object
  },

  data() {
    return {
      results: [],
      students: [],
      bulkResults: [],
      statistics: {
        total_students: 0,
        passed: 0,
        failed: 0,
        average_marks: 0,
        highest_marks: 0,
        lowest_marks: 0
      },
      showBulkEntry: false,
      submitting: false
    };
  },

  computed: {
    gradeDistribution() {
      const grades = [
        { name: 'A+', min: 80, max: 100, count: 0 },
        { name: 'A', min: 75, max: 79, count: 0 },
        { name: 'A-', min: 70, max: 74, count: 0 },
        { name: 'B+', min: 65, max: 69, count: 0 },
        { name: 'B', min: 60, max: 64, count: 0 },
        { name: 'B-', min: 55, max: 59, count: 0 },
        { name: 'C+', min: 50, max: 54, count: 0 },
        { name: 'C', min: 45, max: 49, count: 0 },
        { name: 'D', min: 40, max: 44, count: 0 },
        { name: 'F', min: 0, max: 39, count: 0 }
      ];

      this.results.forEach(result => {
        const percentage = (result.marks_obtained / this.exam.total_marks) * 100;
        const grade = grades.find(g => percentage >= g.min && percentage <= g.max);
        if (grade) grade.count++;
      });

      return grades.map(g => ({
        ...g,
        percentage: this.results.length > 0 ? (g.count / this.results.length) * 100 : 0
      }));
    }
  },

  watch: {
    show(val) {
      if (val && this.exam) {
        this.fetchResults();
        this.fetchStudents();
      }
    }
  },

  methods: {
    async fetchResults() {
      try {
        const response = await this.$api.get(`/results/exam/${this.exam.id}`);
        this.results = response.data.results || [];
        this.statistics = response.data.statistics || this.statistics;
      } catch (error) {
        console.error('Error fetching results:', error);
        this.$toast.error('Failed to load results');
      }
    },

    async fetchStudents() {
      try {
        const response = await this.$api.get(`/exams/${this.exam.id}/students`);
        this.students = response.data.data || response.data;

        this.bulkResults = this.students.map(student => ({
          student_id: student.id,
          marks_obtained: 0,
          grade: 'F'
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
        this.$toast.error('Failed to load students');
      }
    },

    calculateGrade(index) {
      const marks = this.bulkResults[index].marks_obtained;
      const percentage = (marks / this.exam.total_marks) * 100;

      if (percentage >= 80) this.bulkResults[index].grade = 'A+';
      else if (percentage >= 75) this.bulkResults[index].grade = 'A';
      else if (percentage >= 70) this.bulkResults[index].grade = 'A-';
      else if (percentage >= 65) this.bulkResults[index].grade = 'B+';
      else if (percentage >= 60) this.bulkResults[index].grade = 'B';
      else if (percentage >= 55) this.bulkResults[index].grade = 'B-';
      else if (percentage >= 50) this.bulkResults[index].grade = 'C+';
      else if (percentage >= 45) this.bulkResults[index].grade = 'C';
      else if (percentage >= 40) this.bulkResults[index].grade = 'D';
      else this.bulkResults[index].grade = 'F';
    },

    async saveBulkResults() {
      this.submitting = true;

      try {
        const response = await this.$api.post('/results/bulk', {
          exam_id: this.exam.id,
          evaluated_by: this.$store.state.user?.id || 1,
          results: this.bulkResults
        });

        if (response.data.success) {
          this.$toast.success('Results submitted successfully!');
          this.showBulkEntry = false;
          this.fetchResults();
        }
      } catch (error) {
        console.error('Error submitting results:', error);
        const message = error.response?.data?.message || 'Failed to submit results';
        this.$toast.error(message);
      } finally {
        this.submitting = false;
      }
    },

    calculatePercentage(marks) {
      return ((marks / this.exam.total_marks) * 100).toFixed(2);
    },

    getPassFailText(marks) {
      return marks >= this.exam.passing_marks ? 'PASS' : 'FAIL';
    },

    getPassPercentage() {
      if (this.statistics.total_students === 0) return 0;
      return ((this.statistics.passed / this.statistics.total_students) * 100).toFixed(1);
    },

    getFailPercentage() {
      if (this.statistics.total_students === 0) return 0;
      return ((this.statistics.failed / this.statistics.total_students) * 100).toFixed(1);
    },

    getAveragePercentage() {
      return ((this.statistics.average_marks / this.exam.total_marks) * 100).toFixed(0);
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    },

    editResult(result) {
      console.log(result)
      this.$toast.info('Edit result feature coming soon!');
    },

    exportResults() {
      this.$toast.info('Export feature coming soon!');
    },

    printResults() {
      window.print();
    },

    close() {
      this.showBulkEntry = false;
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modern-results-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1600px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.modal-header-results {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  position: relative;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
}

.modal-header-results::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.modal-subtitle {
  margin: 0.5rem 0 0.75rem 0;
  opacity: 0.95;
  font-size: 1rem;
}

.exam-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg) scale(1.1);
}

/* Body */
.modal-body-results {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  transition: width 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.stat-card:hover::before {
  width: 100%;
  opacity: 0.05;
}

.stat-total::before { background: #667eea; }
.stat-passed::before { background: #38ef7d; }
.stat-failed::before { background: #f5576c; }
.stat-average::before { background: #4facfe; }

.stat-icon-wrapper {
  width: 65px;
  height: 65px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
}

.stat-total .stat-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-passed .stat-icon-wrapper {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-failed .stat-icon-wrapper {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.stat-average .stat-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-percentage,
.stat-range {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

.stat-trend {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stat-trend.positive {
  background: rgba(56, 239, 125, 0.15);
  color: #38ef7d;
}

.stat-trend.negative {
  background: rgba(245, 87, 108, 0.15);
  color: #f5576c;
}

.circular-progress {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 60px;
  height: 60px;
}

.circular-chart {
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #f1f1f1;
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke: #4facfe;
  stroke-width: 3;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  from {
    stroke-dasharray: 0 100;
  }
}

/* Action Buttons */
.action-buttons-section {
  margin-bottom: 2rem;
}

.action-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 1rem 1.75rem;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-success-action {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-info-action {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-secondary-action {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Bulk Entry Container */
.bulk-entry-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.bulk-entry-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left i {
  font-size: 1.5rem;
}

.header-left h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-bulk-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-bulk-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.bulk-entry-body {
  padding: 2rem;
}

.info-alert {
  background: linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%);
  border-left: 4px solid #4facfe;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-alert i {
  color: #4facfe;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.25rem;
}

.alert-content p {
  margin: 0;
  color: #4a5568;
  font-size: 0.95rem;
}

/* Results Entry Table */
.results-table-container {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.results-entry-table {
  width: 100%;
  border-collapse: collapse;
}

.results-entry-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.results-entry-table th {
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 3px solid #e2e8f0;
}

.results-entry-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f1f1;
}

.results-entry-table tbody tr:hover {
  background: #f8f9fa;
}

.results-entry-table td {
  padding: 1.25rem 1rem;
}

.student-id-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
}

.student-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #667eea;
  font-size: 0.85rem;
}

.marks-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.marks-input-wrapper:focus-within {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.marks-input {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  width: 80px;
  outline: none;
}

.marks-total {
  color: #a0aec0;
  font-weight: 600;
}

.grade-badge {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-block;
  text-align: center;
  min-width: 60px;
}

.grade-Aplus {
  background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%);
  color: #11998e;
  border: 2px solid #38ef7d;
}

.grade-A {
  background: linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%);
  color: #4facfe;
  border: 2px solid #00f2fe;
}

.grade-Aminus {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
  border: 2px solid #764ba2;
}

.grade-Bplus, .grade-B, .grade-Bminus {
  background: linear-gradient(135deg, #fbbf2415 0%, #f59e0b15 100%);
  color: #f59e0b;
  border: 2px solid #fbbf24;
}

.grade-Cplus, .grade-C {
  background: linear-gradient(135deg, #fad96115 0%, #f76b1c15 100%);
  color: #f76b1c;
  border: 2px solid #fad961;
}

.grade-D, .grade-F {
  background: linear-gradient(135deg, #eb334915 0%, #f45c4315 100%);
  color: #eb3349;
  border: 2px solid #f45c43;
}

.status-badge {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-pass {
  background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%);
  color: #11998e;
  border: 2px solid #38ef7d;
}

.status-fail {
  background: linear-gradient(135deg, #eb334915 0%, #f45c4315 100%);
  color: #eb3349;
  border: 2px solid #f45c43;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel,
.btn-submit {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Results Section */
.results-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #e2e8f0;
}

.section-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-header i {
  color: #fbbf24;
}

.result-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Results Table */
.results-table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  margin-bottom: 2rem;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table thead {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
}

.results-table th {
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.results-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f1f1;
}

.results-table tbody tr:hover {
  background: #f8f9fa;
  transform: scale(1.01);
}

.results-table td {
  padding: 1.25rem 1rem;
}

.rank-cell {
  text-align: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.2rem;
}

.rank-1 {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
}

.rank-2 {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  box-shadow: 0 4px 15px rgba(148, 163, 184, 0.3);
}

.rank-3 {
  background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
}

.medal {
  font-size: 2rem;
}

.rank-number {
  color: #2d3748;
}

.student-id-text {
  color: #667eea;
  font-weight: 700;
  font-size: 0.9rem;
}

.student-info-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-avatar-small {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #667eea;
  font-size: 0.8rem;
}

.student-name-text {
  font-weight: 600;
  color: #2d3748;
}

.marks-display {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.marks-obtained {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3748;
}

.marks-divider {
  color: #a0aec0;
  font-weight: 600;
}

.marks-total-display {
  color: #718096;
  font-size: 1rem;
  font-weight: 600;
}

.grade-badge-result {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  display: inline-block;
  min-width: 65px;
  text-align: center;
}

.status-badge-result {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.percentage-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.percentage-bar {
  width: 80px;
  height: 8px;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
}

.percentage-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.6s ease;
}

.percentage-text {
  font-weight: 700;
  color: #2d3748;
  min-width: 55px;
}

.action-icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-edit-result {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.btn-edit-result:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
}

/* Grade Distribution Card */
.grade-distribution-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.card-header-grade {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.card-header-grade i {
  color: #667eea;
  font-size: 1.5rem;
}

.card-header-grade h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.card-body-grade {
  padding: 2rem;
}

.grade-grid {
  display: grid;
  gap: 1.5rem;
}

.grade-item {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.grade-item:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transform: translateX(5px);
}

.grade-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.grade-label {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.grade-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2d3748;
}

.grade-range {
  font-size: 0.85rem;
  color: #718096;
}

.grade-stats {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.grade-count {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3748;
}

.grade-students {
  font-size: 0.85rem;
  color: #a0aec0;
}

.grade-progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.grade-progress-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
}

.progress-label {
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.grade-bar-Aplus {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.grade-bar-A {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.grade-bar-Aminus {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.grade-bar-Bplus,
.grade-bar-B,
.grade-bar-Bminus {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.grade-bar-Cplus,
.grade-bar-C {
  background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
}

.grade-bar-D,
.grade-bar-F {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

/* Empty State */
.empty-state-results {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  position: relative;
}

.empty-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.empty-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3.5rem;
  position: relative;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring {
  position: absolute;
  border: 3px solid #667eea;
  border-radius: 50%;
  opacity: 0;
  animation: ripple 2s infinite;
}

.ring-1 {
  width: 140px;
  height: 140px;
  animation-delay: 0s;
}

.ring-2 {
  width: 170px;
  height: 170px;
  animation-delay: 0.5s;
}

.ring-3 {
  width: 200px;
  height: 200px;
  animation-delay: 1s;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.empty-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.empty-text {
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 2rem;
}

.btn-start-entry {
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-start-entry:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

/* Footer */
.modal-footer-results {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 24px 24px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.95rem;
  font-weight: 600;
}

.footer-info i {
  color: #667eea;
  font-size: 1.1rem;
}

.btn-close-footer {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  background: #e2e8f0;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-close-footer:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-enter,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Scrollbar */
.modal-body-results::-webkit-scrollbar,
.results-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.modal-body-results::-webkit-scrollbar-track,
.results-table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-body-results::-webkit-scrollbar-thumb,
.results-table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modern-results-modal {
    max-height: 98vh;
  }

  .modal-header-results {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-body-results {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-group {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .results-table-container,
  .results-table-wrapper {
    overflow-x: auto;
  }

  .results-entry-table,
  .results-table {
    min-width: 900px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }

  .modal-footer-results {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-close-footer {
    width: 100%;
    justify-content: center;
  }
}

@media print {
  .modal-overlay {
    background: white;
  }

  .close-btn,
  .action-buttons-section,
  .form-actions,
  .modal-footer-results,
  .action-icon-btn {
    display: none !important;
  }

  .modal-body-results {
    padding: 0;
  }
}
</style>