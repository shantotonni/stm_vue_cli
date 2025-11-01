<template>
  <div class="term-exam-result-form">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-edit"></i>
          </div>
          <div>
            <h1>{{ isEdit ? 'Edit' : 'Add' }} Exam Result</h1>
            <p class="subtitle">{{ isEdit ? 'Update student examination result' : 'Record new student examination result' }}</p>
          </div>
        </div>
        <router-link to="/term-exam-results" class="btn-back">
          <i class="fa fa-arrow-left"></i>
          <span>Back to List</span>
        </router-link>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="form-card">
      <form @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="fa fa-info-circle"></i>
            </div>
            <h3>Basic Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <i class="fa fa-user-graduate"></i>
                Student Card Record
                <span class="required">*</span>
              </label>
              <select v-model="form.student_card_record_id" class="form-control" :class="{ 'is-invalid': errors.student_card_record_id }" required>
                <option value="">Select Student Card Record</option>
                <option v-for="record in cardRecords" :key="record.id" :value="record.id">
                  {{ record.card_number }} - {{ record.student ? record.student.name : 'N/A' }}
                </option>
              </select>
              <div v-if="errors.student_card_record_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.student_card_record_id[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa fa-book-open"></i>
                Term Exam
                <span class="required">*</span>
              </label>
              <select v-model="form.term_exam_id" @change="onExamChange" class="form-control" :class="{ 'is-invalid': errors.term_exam_id }" required>
                <option value="">Select Term Exam</option>
                <option v-for="term_exam in term_exams" :key="term_exam.id" :value="term_exam.id">
                  {{ term_exam.term_name }}
                </option>
              </select>
              <div v-if="errors.term_exam_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.term_exam_id[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa fa-calendar-alt"></i>
                Exam Date
              </label>
              <input
                  v-model="form.exam_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.exam_date }"
              />
              <div v-if="errors.exam_date" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.exam_date[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa fa-user-tie"></i>
                Examiner
              </label>
              <select v-model="form.examiner_id" class="form-control" :class="{ 'is-invalid': errors.examiner_id }">
                <option value="">Select Examiner (Optional)</option>
                <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                  {{ lecturer.name }}({{ lecturer.BMDC_NO }})
                </option>
              </select>
              <div v-if="errors.examiner_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.examiner_id[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Exam Details Alert -->
        <div v-if="selectedExam" class="exam-details-card">
          <div class="exam-details-icon">
            <i class="fa fa-info-circle"></i>
          </div>
          <div class="exam-details-content">
            <h4>{{ selectedExam.term_name }}</h4>
            <div class="exam-stats">
              <div class="exam-stat">
                <span class="stat-label">Total Marks:</span>
                <span class="stat-value">{{ selectedExam.total_marks }}</span>
              </div>
              <div class="exam-stat">
                <span class="stat-label">Pass Marks:</span>
                <span class="stat-value">{{ selectedExam.pass_marks }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Marks Information Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="fa fa-star"></i>
            </div>
            <h3>Marks Information</h3>
          </div>

          <div class="form-grid single-column">
            <div class="form-group">
              <label class="form-label">
                <i class="fa fa-trophy"></i>
                Marks Obtained
              </label>
              <input
                  v-model.number="form.marks_obtained"
                  type="number"
                  step="0.01"
                  min="0"
                  :max="selectedExam ? selectedExam.total_marks : 999"
                  class="form-control"
                  :class="{ 'is-invalid': errors.marks_obtained }"
                  placeholder="Enter marks obtained"
              />
              <div v-if="errors.marks_obtained" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.marks_obtained[0] }}
              </div>
            </div>

            <!-- Result Preview Card -->
            <div v-if="form.marks_obtained && selectedExam" class="result-preview-card" :class="isPassed ? 'pass' : 'fail'">
              <div class="result-preview-header">
                <i :class="isPassed ? 'fa fa-check-circle' : 'fa fa-times-circle'"></i>
                <h4>Result Preview</h4>
              </div>
              <div class="result-stats">
                <div class="result-stat">
                  <div class="stat-icon percentage">
                    <i class="fa fa-percentage"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Percentage</span>
                    <span class="stat-value">{{ calculatePercentage() }}%</span>
                  </div>
                </div>
                <div class="result-stat">
                  <div class="stat-icon result">
                    <i :class="isPassed ? 'fa fa-check' : 'fa fa-times'"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Result</span>
                    <span class="stat-value" :class="isPassed ? 'pass-text' : 'fail-text'">
                      {{ isPassed ? 'PASS' : 'FAIL' }}
                    </span>
                  </div>
                </div>
                <div class="result-stat">
                  <div class="stat-icon grade">
                    <i class="fa fa-award"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Grade</span>
                    <span class="stat-value">{{ calculateGrade() }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa fa-comment-alt"></i>
                Remarks
              </label>
              <textarea
                  v-model="form.remarks"
                  class="form-control textarea"
                  :class="{ 'is-invalid': errors.remarks }"
                  rows="4"
                  placeholder="Enter remarks or additional notes (optional)"
              ></textarea>
              <div v-if="errors.remarks" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.remarks[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link to="/term-exam-results" class="btn-cancel">
            <i class="fa fa-times"></i>
            <span>Cancel</span>
          </router-link>
          <button type="submit" class="btn-submit" :disabled="submitting">
            <i :class="submitting ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i>
            <span>{{ submitting ? 'Saving...' : (isEdit ? 'Update Result' : 'Save Result') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'TermExamResultForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        student_card_record_id: '',
        term_exam_id: '',
        marks_obtained: 0,
        remarks: '',
        examiner_id: '',
        exam_date: new Date().toISOString().split('T')[0]
      },
      selectedExam: null,
      errors: {},
      submitting: false,
      term_exams: [],
      students: [],
      lecturers: [],
      cardRecords: [],
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
    isPassed() {
      if (this.selectedExam && this.form.marks_obtained) {
        return this.form.marks_obtained >= this.selectedExam.pass_marks;
      }
      return false;
    }
  },
  mounted() {
    if (this.isEdit) {
      this.loadResult();
    }
    this.loadStudents()
    this.loadTermExams()
    this.loadLecturers()
    this.loadCardRecords()
  },
  methods: {
    async loadCardRecords() {
      try {
        const response = await api.studentCardRecords.getAll({ per_page: 1000 });
        this.cardRecords = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card records:', error);
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
        console.log(response)
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
      try {
        const response = await this.$api.get('/get-students');
        this.students = response.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadResult() {
      try {
        const response = await api.termExamResults.getById(this.id);
        const result = response.data;

        this.form = {
          student_card_record_id: result.student_card_record_id,
          term_exam_id: result.term_exam_id,
          marks_obtained: result.marks_obtained || 0,
          remarks: result.remarks || '',
          examiner_id: result.examiner_id || '',
          exam_date: result.exam_date.split('T')[0] || new Date().toISOString().split('T')[0]
        };

        if (result.term_exam) {
          this.selectedExam = result.term_exam;
        }
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load result',
          type: 'danger'
        });
        this.$router.push('/term-exam-results');
      }
    },
    onExamChange() {
      this.selectedExam = {
        id: this.form.term_exam_id,
        term_name: 'Sample Exam',
        total_marks: 100,
        pass_marks: 40
      };
    },
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.termExamResults.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Result updated successfully',
            type: 'success'
          });
        } else {
          await api.termExamResults.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Result saved successfully',
            type: 'success'
          });
        }

        this.$router.push('/term-exam-results');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors || {};
          this.$root.$emit('show-notification', {
            message: error.response.data.message || 'Validation failed',
            type: 'danger'
          });
        } else {
          this.$root.$emit('show-notification', {
            message: 'An error occurred',
            type: 'danger'
          });
        }
      } finally {
        this.submitting = false;
      }
    },
    calculatePercentage() {
      if (this.selectedExam && this.selectedExam.total_marks > 0) {
        return Math.round((this.form.marks_obtained / this.selectedExam.total_marks) * 100);
      }
      return 0;
    },
    calculateGrade() {
      const percentage = this.calculatePercentage();
      if (percentage >= 80) return 'A+';
      if (percentage >= 70) return 'A';
      if (percentage >= 60) return 'B';
      if (percentage >= 50) return 'C';
      if (percentage >= 40) return 'D';
      return 'F';
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.term-exam-result-form {
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

/* Form Card */
.form-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

/* Form Sections */
.form-section {
  margin-bottom: 35px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.section-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
}

.section-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-grid.single-column {
  grid-template-columns: 1fr;
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

/* Form Controls */
.form-control {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-control.is-invalid {
  border-color: #e53e3e;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1);
}

.form-control.textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 45px;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e53e3e;
  font-size: 13px;
  font-weight: 500;
  margin-top: -5px;
}

.error-message i {
  font-size: 14px;
}

/* Exam Details Card */
.exam-details-card {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  border: 2px solid #047857;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.exam-details-icon {
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

.exam-details-content {
  flex: 1;
}

.exam-details-content h4 {
  font-size: 20px;
  font-weight: 700;
  color: #065f46;
  margin: 0 0 12px 0;
}

.exam-stats {
  display: flex;
  gap: 25px;
}

.exam-stat {
  display: flex;
  gap: 8px;
  align-items: center;
}

.exam-stat .stat-label {
  font-size: 14px;
  color: #047857;
  font-weight: 600;
}

.exam-stat .stat-value {
  font-size: 16px;
  color: #065f46;
  font-weight: 700;
  padding: 4px 12px;
  background: white;
  border-radius: 8px;
}

/* Result Preview Card */
.result-preview-card {
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.result-preview-card.pass {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #10b981;
}

.result-preview-card.fail {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #ef4444;
}

.result-preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.result-preview-card.pass .result-preview-header {
  border-bottom-color: rgba(16, 185, 129, 0.3);
}

.result-preview-card.fail .result-preview-header {
  border-bottom-color: rgba(239, 68, 68, 0.3);
}

.result-preview-header i {
  font-size: 32px;
}

.result-preview-card.pass .result-preview-header i {
  color: #065f46;
}

.result-preview-card.fail .result-preview-header i {
  color: #991b1b;
}

.result-preview-header h4 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.result-preview-card.pass .result-preview-header h4 {
  color: #065f46;
}

.result-preview-card.fail .result-preview-header h4 {
  color: #991b1b;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.result-stat {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  flex-shrink: 0;
}

.stat-icon.percentage {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.result {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.stat-icon.grade {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-content .stat-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-content .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.stat-content .stat-value.pass-text {
  color: #065f46;
}

.stat-content .stat-value.fail-text {
  color: #991b1b;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 2px solid #e2e8f0;
}

.btn-cancel,
.btn-submit {
  padding: 15px 35px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .result-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .term-exam-result-form {
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

  .form-card {
    padding: 25px 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .exam-details-card {
    flex-direction: column;
  }

  .exam-stats {
    flex-direction: column;
    gap: 10px;
  }

  .result-stats {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .term-exam-result-form {
    padding: 15px 10px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .form-card {
    padding: 20px 15px;
  }

  .section-header h3 {
    font-size: 18px;
  }

  .section-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }

  .result-preview-header h4 {
    font-size: 18px;
  }

  .stat-content .stat-value {
    font-size: 20px;
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

.form-section {
  animation: slideIn 0.5s ease;
}

.form-section:nth-child(2) {
  animation-delay: 0.1s;
}

.exam-details-card {
  animation: slideIn 0.5s ease;
  animation-delay: 0.2s;
}

.result-preview-card {
  animation: slideIn 0.5s ease;
  animation-delay: 0.3s;
}

/* Scrollbar Styling */
.form-card::-webkit-scrollbar {
  width: 8px;
}

.form-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.form-card::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.form-card::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>