<template>
  <div class="semester-results-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading results...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="fetchResults" class="btn-retry">Retry</button>
    </div>

    <!-- Results Display -->
    <div v-else-if="results" class="results-content">
      <!-- Student Header -->
      <div class="student-header">
        <div class="student-info">
          <h1><i class="fas fa-file-alt"></i> Semester Exam Results</h1>
          <div class="info-grid">
            <div class="info-item">
              <span class="label"><i class="fas fa-user"></i> Student Name:</span>
              <span class="value">{{ results.student.name }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-id-card"></i> Roll Number:</span>
              <span class="value">{{ results.student.roll }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-building"></i> Department:</span>
              <span class="value">{{ results.student.department }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-calendar-alt"></i> Session:</span>
              <span class="value">{{ results.session.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subjects Results -->
      <div class="subjects-container">
        <div
            v-for="(subject) in results.subjects"
            :key="subject.subject_id"
            class="subject-card"
        >
          <!-- Subject Header -->
          <div class="subject-header">
            <div class="subject-title-section">
              <h2><i class="fas fa-book"></i> {{ subject.subject_name }}</h2>
              <div class="subject-meta">
                <span class="subject-code">
                  <i class="fas fa-tag"></i> {{ subject.subject_code }}
                </span>
                <span class="subject-dept">
                  <i class="fas fa-university"></i> {{ subject.department }}
                </span>
              </div>
            </div>
            <div class="subject-summary-badge">
              <div class="badge-item">
                <span class="badge-label">Grade</span>
                <span class="badge-value grade" :class="'grade-' + subject.subject_grade.replace('+', 'plus').replace('-', 'minus')">
                  {{ subject.subject_grade }}
                </span>
              </div>
              <div class="badge-item">
                <span class="badge-label">CGPA</span>
                <span class="badge-value">{{ subject.subject_cgpa }}</span>
              </div>
              <div class="badge-item">
                <span class="badge-label">Percentage</span>
                <span class="badge-value">{{ subject.subject_percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Exam Types Loop -->
          <div class="exam-types-container">
            <div
                v-for="(examType) in subject.exam_types"
                :key="examType.exam_type_id"
                class="exam-type-section"
            >
              <!-- Exam Type Header -->
              <div class="exam-type-header">
                <h3>
                  <i class="fas fa-clipboard-list"></i>
                  {{ examType.exam_type_name }}
                </h3>
                <div class="exam-type-stats">
                  <span class="stat-item">
                    <strong>{{ examType.type_total_marks_obtained }}</strong> / {{ examType.type_total_max_marks }}
                  </span>
                  <span class="stat-divider">|</span>
                  <span class="stat-item">
                    {{ examType.type_percentage }}%
                  </span>
                  <span class="stat-divider">|</span>
                  <span class="stat-item grade-badge-inline" :class="'grade-' + examType.type_grade.replace('+', 'plus').replace('-', 'minus')">
                    {{ examType.type_grade }}
                  </span>
                  <span class="stat-divider">|</span>
                  <span class="stat-item">
                    GPA: {{ examType.type_gpa }}
                  </span>
                </div>
              </div>

              <!-- Exams Table for this Type -->
              <div class="table-responsive">
                <table class="exams-table">
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>GPA</th>
                    <th>Status</th>
                    <th>Teacher</th>
                    <th>Classroom</th>
                    <th>Remarks</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(exam) in examType.exams"
                      :key="exam.exam_id"
                      :class="getStatusClass(exam.status)"
                  >
                    <td data-label="Date">{{ exam.date }}</td>
                    <td data-label="Marks Obtained" class="marks-obtained">
                      {{ exam.marks_obtained }}
                    </td>
                    <td data-label="Total Marks">{{ exam.total_marks.toFixed(2) }}</td>
                    <td data-label="Percentage">{{ exam.percentage.toFixed(2) }}%</td>
                    <td data-label="Grade">
                        <span class="grade-badge" :class="'grade-' + exam.grade.replace('+', 'plus').replace('-', 'minus')">
                          {{ exam.grade }}
                        </span>
                    </td>
                    <td data-label="GPA">{{ exam.gpa }}</td>
                    <td data-label="Status">
                        <span class="status-badge" :class="'status-' + exam.status.toLowerCase()">
                          {{ exam.status }}
                        </span>
                    </td>
                    <td data-label="Teacher">{{ exam.teacher }}</td>
                    <td data-label="Classroom">{{ exam.classroom }}</td>
                    <td data-label="Remarks">{{ exam.remarks || '-' }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Subject Overall Summary -->
          <div class="subject-overall-summary">
            <div class="summary-title">
              <i class="fas fa-chart-bar"></i> Subject Overall Summary
            </div>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Total Marks Obtained</span>
                <span class="summary-value">{{ subject.subject_total_marks_obtained }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Maximum Marks</span>
                <span class="summary-value">{{ subject.subject_total_max_marks }}</span>
              </div>
              <div class="summary-item highlight">
                <span class="summary-label">Percentage</span>
                <span class="summary-value">{{ subject.subject_percentage }}%</span>
              </div>
              <div class="summary-item highlight">
                <span class="summary-label">Subject CGPA</span>
                <span class="summary-value">{{ subject.subject_cgpa }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Semester Summary -->
      <div class="semester-summary">
        <h2><i class="fas fa-trophy"></i> Semester Overall Summary</h2>
        <div class="summary-grid-main">
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-books"></i>
            </div>
            <div class="summary-content">
              <p class="summary-title">Total Subjects</p>
              <p class="summary-number">{{ results.semester_summary.total_subjects }}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="summary-content">
              <p class="summary-title">Total Marks Obtained</p>
              <p class="summary-number">{{ results.semester_summary.total_marks_obtained }}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="summary-content">
              <p class="summary-title">Total Maximum Marks</p>
              <p class="summary-number">{{ results.semester_summary.total_max_marks }}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-percent"></i>
            </div>
            <div class="summary-content">
              <p class="summary-title">Overall Percentage</p>
              <p class="summary-number highlight">{{ results.semester_summary.percentage }}%</p>
            </div>
          </div>
          <div class="summary-card primary">
            <div class="summary-icon">
              <i class="fas fa-award"></i>
            </div>
            <div class="summary-content">
              <p class="summary-title">Overall CGPA</p>
              <p class="summary-number highlight">{{ results.semester_summary.cgpa }}</p>
              <p class="summary-grade">Grade: {{ results.semester_summary.grade }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="printResults" class="btn btn-primary">
          <i class="fas fa-print"></i> Print Results
        </button>
        <button @click="downloadPDF" class="btn btn-secondary">
          <i class="fas fa-file-pdf"></i> Download PDF
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="fas fa-inbox"></i>
      <p>No results found. Please select a student and semester.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentSemesterResults',

  props: {
    studentId: {
      type: [Number, String],
      required: true
    },
    sessionId: {
      type: [Number, String],
      required: true
    }
  },

  data() {
    return {
      results: null,
      loading: false,
      error: null
    };
  },

  mounted() {
    this.fetchResults();
  },

  watch: {
    studentId() {
      this.fetchResults();
    },
    sessionId() {
      this.fetchResults();
    }
  },

  methods: {
    async fetchResults() {
      if (!this.studentId || !this.sessionId) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await this.$api.get(`/reports/student-results/semester?student_id=${this.studentId}&session_id=${this.sessionId}`);

        this.results = response.data.data;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching results:', err);
      } finally {
        this.loading = false;
      }
    },

    getStatusClass(status) {
      return {
        'status-pass': status === 'Pass',
        'status-fail': status === 'Fail',
        'status-absent': status === 'Absent'
      };
    },

    printResults() {
      window.print();
    },

    downloadPDF() {
      alert('PDF download functionality can be implemented using libraries like jsPDF or html2pdf');
    }
  }
};
</script>

<style scoped>
.semester-results-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f7fa;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  color: #c33;
  max-width: 600px;
  margin: 50px auto;
}

.error-message i {
  font-size: 48px;
  margin-bottom: 15px;
}

.btn-retry {
  margin-top: 15px;
  padding: 10px 25px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-retry:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

/* Student Header */
.student-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.student-header h1 {
  margin: 0 0 20px 0;
  font-size: 30px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item .label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item .value {
  font-size: 20px;
  font-weight: 700;
}

/* Subjects Container */
.subjects-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
}

/* Subject Card */
.subject-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.subject-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Subject Header */
.subject-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.subject-title-section h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.subject-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.subject-code,
.subject-dept {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.subject-summary-badge {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.badge-label {
  font-size: 11px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-value {
  font-size: 26px;
  font-weight: 700;
}

.badge-value.grade {
  padding: 8px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
}

/* Exam Types Container */
.exam-types-container {
  padding: 0;
}

.exam-type-section {
  border-bottom: 2px solid #f0f0f0;
}

.exam-type-section:last-child {
  border-bottom: none;
}

/* Exam Type Header */
.exam-type-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 18px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.exam-type-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.exam-type-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
  font-weight: 600;
}

.stat-item {
  display: inline-flex;
  align-items: center;
}

.stat-divider {
  opacity: 0.5;
}

.grade-badge-inline {
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 700;
}

/* Exams Table */
.table-responsive {
  overflow-x: auto;
  padding: 20px 30px;
}

.exams-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.exams-table thead {
  background: #f8f9fa;
}

.exams-table th {
  padding: 15px 12px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.exams-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.exams-table tbody tr:hover {
  background: #f8f9fa;
}

.exams-table tbody tr.status-fail {
  background: #ffebee;
}

.exams-table tbody tr.status-absent {
  background: #fff8e1;
}

.exams-table tbody tr.status-pass {
  background: #f1f8f4;
}

.exams-table td {
  padding: 15px 12px;
  font-size: 14px;
  color: #333;
}

.marks-obtained {
  font-weight: 700;
  color: #2196f3;
  font-size: 16px;
}

/* Grade Badge */
.grade-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
}

.grade-Aplus, .grade-badge.grade-Aplus {
  background: #c8e6c9;
  color: #1b5e20;
}

.grade-A, .grade-badge.grade-A {
  background: #c8e6c9;
  color: #2e7d32;
}

.grade-Aminus, .grade-badge.grade-Aminus {
  background: #dcedc8;
  color: #558b2f;
}

.grade-Bplus, .grade-badge.grade-Bplus {
  background: #fff9c4;
  color: #f57f17;
}

.grade-B, .grade-badge.grade-B {
  background: #ffe0b2;
  color: #e65100;
}

.grade-Bminus, .grade-badge.grade-Bminus {
  background: #ffccbc;
  color: #d84315;
}

.grade-Cplus, .grade-badge.grade-Cplus {
  background: #ffccbc;
  color: #bf360c;
}

.grade-C, .grade-badge.grade-C {
  background: #ffccbc;
  color: #bf360c;
}

.grade-D, .grade-badge.grade-D {
  background: #ffcdd2;
  color: #c62828;
}

.grade-F, .grade-badge.grade-F {
  background: #f44336;
  color: white;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
}

.status-badge.status-pass {
  background: #c8e6c9;
  color: #1b5e20;
}

.status-badge.status-fail {
  background: #ffcdd2;
  color: #c62828;
}

.status-badge.status-absent {
  background: #fff9c4;
  color: #f57f17;
}

/* Subject Overall Summary */
.subject-overall-summary {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  padding: 25px 30px;
  border-top: 3px solid #ff9a76;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #d84315;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.summary-item.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.summary-item.highlight .summary-label {
  color: rgba(255, 255, 255, 0.9);
}

.summary-value {
  font-size: 18px;
  font-weight: 800;
  color: #333;
}

.summary-item.highlight .summary-value {
  color: white;
}

/* Semester Summary */
.semester-summary {
  background: white;
  border-radius: 15px;
  padding: 35px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.semester-summary h2 {
  margin: 0 0 30px 0;
  font-size: 26px;
  color: #333;
  text-align: center;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.summary-grid-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.summary-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  gap: 20px;
  align-items: center;
  transition: transform 0.3s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.summary-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-icon {
  font-size: 40px;
  color: #667eea;
}

.summary-card.primary .summary-icon {
  color: white;
}

.summary-content {
  flex: 1;
}

.summary-title {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.summary-card.primary .summary-title {
  color: rgba(255, 255, 255, 0.9);
}

.summary-number {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #333;
}

.summary-card.primary .summary-number {
  color: white;
}

.summary-grade {
  margin: 5px 0 0 0;
  font-size: 15px;
  opacity: 0.95;
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.btn {
  padding: 14px 35px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  color: #ccc;
}

/* Responsive Design */
@media screen and (max-width: 1024px) {
  .exams-table {
    font-size: 13px;
  }

  .exams-table th,
  .exams-table td {
    padding: 12px 8px;
  }
}

@media screen and (max-width: 768px) {
  .semester-results-container {
    padding: 15px;
  }

  .student-header {
    padding: 20px;
  }

  .student-header h1 {
    font-size: 22px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .subject-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .subject-title-section h2 {
    font-size: 20px;
  }

  .exam-type-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .exam-type-stats {
    width: 100%;
  }

  /* Responsive Table for Mobile */
  .exams-table thead {
    display: none;
  }

  .exams-table,
  .exams-table tbody,
  .exams-table tr,
  .exams-table td {
    display: block;
    width: 100%;
  }

  .exams-table tr {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background: white;
  }

  .exams-table td {
    padding: 8px 0;
    border: none;
    position: relative;
    padding-left: 50%;
    text-align: right;
  }

  .exams-table td:before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: 700;
    text-align: left;
    color: #666;
  }

  .summary-grid,
  .summary-grid-main {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Print Styles */
@media print {
  .action-buttons {
    display: none;
  }

  .subject-card {
    page-break-inside: avoid;
  }

  .semester-summary {
    page-break-before: always;
  }

  body {
    background: white;
  }

  .semester-results-container {
    background: white;
  }
}
</style>