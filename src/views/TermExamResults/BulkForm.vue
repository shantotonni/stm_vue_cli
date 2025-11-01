<template>
  <div class="term-exam-results-bulk">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-list-check"></i>
          </div>
          <div>
            <h1>Bulk Entry - Exam Results</h1>
            <p class="subtitle">Enter examination results for multiple students efficiently</p>
          </div>
        </div>
        <router-link to="/term-exam-results" class="btn-back">
          <i class="fa fa-arrow-left"></i>
          <span>Back to List</span>
        </router-link>
      </div>
    </div>

    <!-- Exam Selection Card -->
    <div class="exam-selection-card">
      <div class="card-header">
        <div class="header-icon">
          <i class="fa fa-book-open"></i>
        </div>
        <h3>Select Exam & Load Students</h3>
      </div>
      <div class="card-body">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <i class="fa fa-clipboard-list"></i>
              Term Exam
              <span class="required">*</span>
            </label>
            <select v-model="examInfo.term_exam_id" @change="onExamChange" class="form-control" required>
              <option value="">Select Term Exam</option>
              <option v-for="term_exam in term_exams" :key="term_exam.id" :value="term_exam.id">
                {{ term_exam.term_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa fa-user-tie"></i>
              Examiner
            </label>
            <select v-model="examInfo.examiner_id" class="form-control">
              <option value="">Select Examiner (Optional)</option>
              <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                {{ lecturer.name }}({{ lecturer.BMDC_NO }})
              </option>
            </select>
          </div>
        </div>

        <!-- Exam Details Alert -->
        <div v-if="selectedExam" class="exam-details-alert">
          <div class="alert-icon">
            <i class="fa fa-info-circle"></i>
          </div>
          <div class="alert-content">
            <h4>{{ selectedExam.term_name }}</h4>
            <div class="exam-stats">
              <div class="stat-item">
                <span class="label">Card Type:</span>
                <span class="value">{{ selectedExam.card_type ? selectedExam.card_type.name : 'N/A' }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Total Marks:</span>
                <span class="value">{{ selectedExam.total_marks }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Pass Marks:</span>
                <span class="value">{{ selectedExam.pass_marks }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="load-button-wrapper">
          <button
              @click="loadStudents"
              type="button"
              class="btn-load"
              :disabled="!examInfo.term_exam_id || loading"
          >
            <i :class="loading ? 'fa fa-spinner fa-spin' : 'fa fa-users'"></i>
            <span>{{ loading ? 'Loading Students...' : 'Load Students' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="students.length > 0" class="stats-cards">
      <div class="stat-card blue">
        <div class="stat-icon">
          <i class="fa fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>{{ students.length }}</h3>
          <p>Total Students</p>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ passedCount }}</h3>
          <p>Passed</p>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">
          <i class="fa fa-times-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ failedCount }}</h3>
          <p>Failed</p>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">
          <i class="fa fa-percentage"></i>
        </div>
        <div class="stat-info">
          <h3>{{ averagePercentage }}%</h3>
          <p>Average Score</p>
        </div>
      </div>
    </div>

    <!-- Students Results Table -->
    <div v-if="students.length > 0" class="table-card">
      <div class="table-header">
        <div class="header-left">
          <i class="fa fa-edit"></i>
          <h3>Enter Student Marks</h3>
        </div>
        <div class="header-right">
          <span class="progress-badge">
            <i class="fa fa-check-double"></i>
            {{ filledCount }} / {{ students.length }} completed
          </span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th width="5%" class="text-center">#</th>
            <th width="25%">
              <i class="fa fa-user-graduate"></i>
              Student Details
            </th>
            <th width="15%">
              <i class="fa fa-star"></i>
              Marks Obtained *
            </th>
            <th width="10%" class="text-center">
              <i class="fa fa-percentage"></i>
              Percentage
            </th>
            <th width="10%" class="text-center">
              <i class="fa fa-check-circle"></i>
              Result
            </th>
            <th width="12%">
              <i class="fa fa-calendar-alt"></i>
              Exam Date
            </th>
            <th width="23%">
              <i class="fa fa-comment-alt"></i>
              Remarks
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(student, index) in students" :key="student.id" class="student-row">
            <td class="text-center">
              <span class="row-number">{{ index + 1 }}</span>
            </td>
            <td>
              <div class="student-info">
                <div class="student-avatar">
                  {{ getInitials(student.student ? student.student.name : 'NA') }}
                </div>
                <div class="student-details">
                  <span class="student-name">{{ student.student ? student.student.name : 'N/A' }}</span>
                  <span class="card-number">{{ student.card_number }}</span>
                </div>
              </div>
            </td>
            <td>
              <input
                  v-model.number="results[index].marks_obtained"
                  type="number"
                  step="0.01"
                  min="0"
                  :max="selectedExam.total_marks"
                  class="marks-input"
                  :class="{ 'filled': results[index].marks_obtained !== null && results[index].marks_obtained !== '' }"
                  placeholder="0.00"
                  required
              />
            </td>
            <td class="text-center">
                <span class="percentage-badge" :class="getPercentageClass(index)">
                  {{ calculatePercentage(index) }}%
                </span>
            </td>
            <td class="text-center">
                <span class="result-badge" :class="isPassed(index) ? 'pass' : 'fail'">
                  <i :class="isPassed(index) ? 'fa fa-check-circle' : 'fa fa-times-circle'"></i>
                  {{ isPassed(index) ? 'Pass' : 'Fail' }}
                </span>
            </td>
            <td>
              <input
                  v-model="results[index].exam_date"
                  type="date"
                  class="date-input"
              />
            </td>
            <td>
              <input
                  v-model="results[index].remarks"
                  type="text"
                  class="remarks-input"
                  placeholder="Optional remarks..."
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <div class="footer-left">
          <i class="fa fa-info-circle"></i>
          <span>* Marks Obtained is required for all students</span>
        </div>
        <div class="footer-right">
          <router-link to="/term-exam-results" class="btn-cancel">
            <i class="fa fa-times"></i>
            <span>Cancel</span>
          </router-link>
          <button
              @click="submitBulkResults"
              type="button"
              class="btn-submit"
              :disabled="submitting || !isFormValid"
          >
            <i :class="submitting ? 'fa fa-spinner fa-spin' : 'fa fa-check-double'"></i>
            <span>{{ submitting ? 'Submitting...' : `Submit Results (${students.length} students)` }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- No Students Message -->
    <div v-else-if="!loading && examInfo.term_exam_id" class="empty-state-card">
      <div class="empty-icon">
        <i class="fa fa-users"></i>
      </div>
      <h3>No Students Loaded</h3>
      <p>Click the "Load Students" button above to fetch students for this exam</p>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'TermExamResultsBulk',
  data() {
    return {
      examInfo: {
        term_exam_id: '',
        examiner_id: ''
      },
      selectedExam: null,
      students: [],
      results: [],
      lecturers: [],
      term_exams: [],
      loading: false,
      submitting: false
    };
  },
  computed: {
    passedCount() {
      if (!this.selectedExam) return 0;
      return this.results.filter((r, index) => this.isPassed(index)).length;
    },
    failedCount() {
      if (!this.selectedExam) return 0;
      return this.results.filter((r, index) => !this.isPassed(index) && r.marks_obtained !== null && r.marks_obtained !== '').length;
    },
    averagePercentage() {
      const validResults = this.results.filter(r => r.marks_obtained !== null && r.marks_obtained !== '');
      if (validResults.length === 0) return 0;
      const total = validResults.reduce((sum, r, index) => sum + this.calculatePercentage(index), 0);
      return Math.round(total / validResults.length);
    },
    filledCount() {
      return this.results.filter(r => r.marks_obtained !== null && r.marks_obtained !== '').length;
    },
    isFormValid() {
      return this.results.every(r => r.marks_obtained !== null && r.marks_obtained !== '');
    }
  },
  mounted() {
    this.loadLecturers()
    this.loadTermExams()
  },
  methods: {
    async onExamChange() {
      if (!this.examInfo.term_exam_id) {
        this.selectedExam = null;
        return;
      }

      try {
        const response = await api.termExams.getById(this.examInfo.term_exam_id);
        this.selectedExam = response.data;
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load exam details',
          type: 'danger'
        });
      }
    },
    async loadLecturers() {
      try {
        const response = await this.$api.get('/get-teacher');
        this.lecturers = response.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadTermExams() {
      try {
        const response = await this.$api.get('/get-term-exams');
        this.term_exams = response.data.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadStudents() {
      if (!this.examInfo.term_exam_id) {
        this.$root.$emit('show-notification', {
          message: 'Please select a term exam first',
          type: 'warning'
        });
        return;
      }

      this.loading = true;
      try {
        // Call API to load students for this term exam
        const response = await this.$api.get(`/term-exam-results/load-students/${this.examInfo.term_exam_id}`);

        if (response.data.success) {
          this.students = response.data.data.students;

          // Update exam info from response
          if (response.data.data.exam_info) {
            this.selectedExam = {
              ...this.selectedExam,
              ...response.data.data.exam_info
            };
          }

          // Initialize results array
          this.results = this.students.map(student => ({
            student_card_record_id: student.id,
            marks_obtained: null,
            exam_date: new Date().toISOString().split('T')[0],
            remarks: ''
          }));

          this.$root.$emit('show-notification', {
            message: `${this.students.length} students loaded successfully`,
            type: 'success'
          });
        } else {
          this.$root.$emit('show-notification', {
            message: response.data.message || 'Failed to load students',
            type: 'danger'
          });
        }
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: error.response?.data?.message || 'Failed to load students',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    calculatePercentage(index) {
      const result = this.results[index];
      if (result.marks_obtained && this.selectedExam && this.selectedExam.total_marks > 0) {
        return Math.round((result.marks_obtained / this.selectedExam.total_marks) * 100);
      }
      return 0;
    },
    isPassed(index) {
      const result = this.results[index];
      if (result.marks_obtained && this.selectedExam) {
        return result.marks_obtained >= this.selectedExam.pass_marks;
      }
      return false;
    },
    getPercentageClass(index) {
      const percentage = this.calculatePercentage(index);
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    },
    getInitials(name) {
      if (!name || name === 'N/A') return 'NA';
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    },
    async submitBulkResults() {
      if (!this.isFormValid) {
        this.$root.$emit('show-notification', {
          message: 'Please fill in marks for all students',
          type: 'warning'
        });
        return;
      }

      this.submitting = true;
      try {
        const data = {
          term_exam_id: this.examInfo.term_exam_id,
          examiner_id: this.examInfo.examiner_id || null,
          results: this.results
        };

        const response = await this.$api.post('/term-exam-results/bulk-store', data);

        if (response.data.success) {
          this.$root.$emit('show-notification', {
            message: response.data.message || `Results submitted successfully for ${this.students.length} students`,
            type: 'success'
          });

          // Show detailed feedback if there were any errors
          if (response.data.data.failed_count > 0) {
            console.warn('Some results failed:', response.data.data.errors);
          }

          this.$router.push('/term-exam-results');
        } else {
          this.$root.$emit('show-notification', {
            message: response.data.message || 'Failed to submit results',
            type: 'danger'
          });
        }
      } catch (error) {
        console.error('Failed to submit bulk results:', error);
        this.$root.$emit('show-notification', {
          message: error.response?.data?.message || 'Failed to submit results',
          type: 'danger'
        });
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.term-exam-results-bulk {
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
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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

.btn-back {
  padding: 15px 30px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

/* Exam Selection Card */
.exam-selection-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.exam-selection-card .card-header {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  padding: 20px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.exam-selection-card .card-header h3 {
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.card-body {
  padding: 30px;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.form-label i {
  color: #667eea;
  font-size: 16px;
}

.required {
  color: #e53e3e;
  font-weight: 700;
  margin-left: 2px;
}

.form-control {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 45px;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Exam Details Alert */
.exam-details-alert {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  border: 2px solid #047857;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}

.alert-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #047857;
  font-size: 28px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  font-size: 20px;
  font-weight: 700;
  color: #065f46;
  margin: 0 0 12px 0;
}

.exam-stats {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stat-item .label {
  font-size: 14px;
  color: #047857;
  font-weight: 600;
}

.stat-item .value {
  font-size: 16px;
  color: #065f46;
  font-weight: 700;
  padding: 4px 12px;
  background: white;
  border-radius: 8px;
}

/* Load Button */
.load-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.btn-load {
  padding: 15px 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-load:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.btn-load:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
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
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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
}

.stat-card.blue .stat-icon {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.stat-card.green .stat-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.orange .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.purple .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* Table Card */
.table-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.table-header {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.header-left i {
  font-size: 24px;
}

.header-left h3 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

.progress-badge {
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
  padding: 30px;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background: #f7fafc;
}

.modern-table th {
  padding: 16px 12px;
  text-align: left;
  color: #2d3748;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.modern-table th i {
  margin-right: 6px;
  color: #667eea;
}

.modern-table th.text-center {
  text-align: center;
}

.modern-table tbody .student-row {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modern-table tbody .student-row:hover {
  background: #f7fafc;
}

.modern-table td {
  padding: 16px 12px;
  font-size: 14px;
  color: #2d3748;
}

.modern-table td.text-center {
  text-align: center;
}

/* Row Number */
.row-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}

/* Student Info */
.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.card-number {
  font-size: 12px;
  color: #718096;
  font-family: 'Courier New', monospace;
}

/* Input Fields */
.marks-input,
.date-input,
.remarks-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3748;
  transition: all 0.3s ease;
  font-family: inherit;
}

.marks-input:focus,
.date-input:focus,
.remarks-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.marks-input.filled {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

/* Percentage Badge */
.percentage-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
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

/* Result Badge */
.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.result-badge.pass {
  background: #d1fae5;
  color: #065f46;
}

.result-badge.fail {
  background: #fee2e2;
  color: #991b1b;
}

/* Table Footer */
.table-footer {
  padding: 20px 30px;
  background: #f7fafc;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 14px;
}

.footer-left i {
  color: #667eea;
  font-size: 16px;
}

.footer-right {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-submit {
  padding: 12px 28px;
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

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Empty State */
.empty-state-card {
  background: white;
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #718096;
}

.empty-state-card h3 {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.empty-state-card p {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .exam-stats {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .term-exam-results-bulk {
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

  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .card-body {
    padding: 20px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .table-wrapper {
    padding: 20px;
  }

  .table-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-right {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }

  /* Make table scrollable on mobile */
  .modern-table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .term-exam-results-bulk {
    padding: 15px 10px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .card-body {
    padding: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .empty-state-card {
    padding: 60px 20px;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exam-selection-card,
.stats-cards,
.table-card {
  animation: slideIn 0.5s ease;
}

.stats-cards {
  animation-delay: 0.1s;
}

.table-card {
  animation-delay: 0.2s;
}

/* Scrollbar Styling */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
  width: 8px;
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
</style>