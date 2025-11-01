<template>
  <div class="student-structure-progress-form">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i :class="isEdit ? 'fa fa-edit' : 'fa fa-plus-circle'"></i>
          </div>
          <div>
            <h1>{{ isEdit ? 'Edit' : 'Create' }} Progress Record</h1>
            <p class="subtitle">{{ isEdit ? 'Update existing' : 'Add new' }} student structure progress</p>
          </div>
        </div>
        <router-link to="/student-structure-progress" class="btn-back">
          <i class="fa fa-arrow-left"></i>
          <span>Back to List</span>
        </router-link>
      </div>
    </div>

    <!-- Form Card -->
    <div class="form-card">
      <form @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-info-circle"></i>
            <h3>Basic Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-id-card"></i>
                Student Card Record <span class="required">*</span>
              </label>
              <select
                  v-model="form.student_card_record_id"
                  class="field-select"
                  :class="{ 'error': errors.student_card_record_id }"
                  required
              >
                <option value="">Select Student Card Record</option>
                <option v-for="record in cardRecords" :key="record.id" :value="record.id">
                  {{ record.card_number }} - {{ record.student ? record.student.name : 'N/A' }}
                </option>
              </select>
              <span v-if="errors.student_card_record_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.student_card_record_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-sitemap"></i>
                Structure Level <span class="required">*</span>
              </label>
              <select
                  v-model="form.structure_level_id"
                  class="field-select"
                  :class="{ 'error': errors.structure_level_id }"
                  required
              >
                <option value="">Select Structure Level</option>
                <option v-for="level in structureLevels" :key="level.id" :value="level.id">
                  {{ level.title }}
                </option>
              </select>
              <span v-if="errors.structure_level_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.structure_level_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-user-tie"></i>
                Lecturer
              </label>
              <select v-model="form.lecturer_id" class="field-select" :class="{ 'error': errors.lecturer_id }">
                <option value="">Select Lecturer (Optional)</option>
                <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                  {{ lecturer.name }}
                </option>
              </select>
              <span v-if="errors.lecturer_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.lecturer_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-redo"></i>
                Attempt Number
              </label>
              <input
                  v-model.number="form.attempt_number"
                  type="number"
                  min="1"
                  class="field-input"
                  :class="{ 'error': errors.attempt_number }"
                  placeholder="Enter attempt number"
              />
              <span v-if="errors.attempt_number" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.attempt_number[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Date Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-calendar-alt"></i>
            <h3>Date Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calendar-plus"></i>
                Date of Beginning
              </label>
              <input
                  v-model="form.date_of_beginning"
                  type="date"
                  class="field-input"
                  :class="{ 'error': errors.date_of_beginning }"
              />
              <span v-if="errors.date_of_beginning" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.date_of_beginning[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calendar-check"></i>
                Date of Examination
              </label>
              <input
                  v-model="form.date_of_examination"
                  type="date"
                  class="field-input"
                  :class="{ 'error': errors.date_of_examination }"
              />
              <span v-if="errors.date_of_examination" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.date_of_examination[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Marks Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-star"></i>
            <h3>Marks Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-check-circle"></i>
                Marks Obtained
              </label>
              <input
                  v-model.number="form.marks_obtained"
                  type="number"
                  step="0.01"
                  min="0"
                  class="field-input"
                  :class="{ 'error': errors.marks_obtained }"
                  placeholder="0.00"
              />
              <span v-if="errors.marks_obtained" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.marks_obtained[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calculator"></i>
                Maximum Marks
              </label>
              <input
                  v-model.number="form.max_marks"
                  type="number"
                  step="0.01"
                  min="0"
                  class="field-input"
                  :class="{ 'error': errors.max_marks }"
                  placeholder="0.00"
              />
              <span v-if="errors.max_marks" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.max_marks[0] }}
              </span>
            </div>

            <div class="form-field full-width" v-if="form.marks_obtained && form.max_marks">
              <div class="percentage-display" :class="getPercentageClass(calculatePercentage())">
                <div class="percentage-icon">
                  <i class="fa fa-percentage"></i>
                </div>
                <div class="percentage-info">
                  <h4>{{ calculatePercentage() }}%</h4>
                  <p>Calculated Percentage</p>
                </div>
                <div class="percentage-badge" :class="getPercentageClass(calculatePercentage())">
                  {{ getPercentageLabel(calculatePercentage()) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status & Remarks Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-flag"></i>
            <h3>Status & Remarks</h3>
          </div>

          <div class="form-grid">
            <div class="form-field full-width">
              <div class="checkbox-wrapper">
                <input
                    v-model="form.is_completed"
                    type="checkbox"
                    class="checkbox-input"
                    id="isCompleted"
                />
                <label class="checkbox-label" for="isCompleted">
                  <span class="checkbox-box">
                    <i class="fa fa-check"></i>
                  </span>
                  <span class="checkbox-text">
                    <strong>Mark as Completed</strong>
                    <small>Check this box when the student has completed this structure level</small>
                  </span>
                </label>
              </div>
            </div>

            <div class="form-field full-width">
              <label class="field-label">
                <i class="fa fa-comment-alt"></i>
                Remarks
              </label>
              <textarea
                  v-model="form.remarks"
                  class="field-textarea"
                  :class="{ 'error': errors.remarks }"
                  rows="4"
                  placeholder="Enter remarks or notes (optional)"
              ></textarea>
              <span v-if="errors.remarks" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.remarks[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link to="/student-structure-progress" class="btn-cancel">
            <i class="fa fa-times"></i>
            <span>Cancel</span>
          </router-link>
          <button type="submit" class="btn-submit" :disabled="submitting">
            <i :class="submitting ? 'fa fa-spinner fa-spin' : (isEdit ? 'fa fa-save' : 'fa fa-plus-circle')"></i>
            <span>{{ submitting ? 'Saving...' : (isEdit ? 'Update Progress' : 'Create Progress') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';
// import moment from 'moment'

export default {
  name: 'StudentStructureProgressForm',
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
        structure_level_id: '',
        date_of_beginning: '',
        date_of_examination: '',
        marks_obtained: 0,
        max_marks: 0,
        remarks: '',
        lecturer_id: '',
        is_completed: false,
        attempt_number: 1
      },
      cardRecords: [],
      structureLevels: [],
      lecturers: [],
      errors: {},
      submitting: false,
      loading: false
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  mounted() {
    this.loadCardRecords();
    this.loadStructureLevels();
    this.loadLecturers();

    if (this.isEdit) {
      this.loadProgress();
    }
  },
  methods: {
    async loadCardRecords() {
      try {
        const response = await api.studentCardRecords.getAll({ per_page: 1000 });
        this.cardRecords = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card records:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load card records',
          type: 'danger'
        });
      }
    },

    async loadStructureLevels() {
      try {
        const response = await api.cardStructureLevels.getAll({ per_page: 1000 });
        this.structureLevels = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load structure levels:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load structure levels',
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


    async loadProgress() {
      this.loading = true;
      try {
        const response = await api.studentStructureProgress.getById(this.id);
        const progress = response.data;
        console.log(progress.date_of_beginning.split('T')[0])
        this.form = {
          student_card_record_id: progress.student_card_record_id,
          structure_level_id: progress.structure_level_id,
          date_of_beginning: progress.date_of_beginning.split('T')[0] || '',
          date_of_examination: progress.date_of_examination.split('T')[0] || '',
          marks_obtained: progress.marks_obtained || 0,
          max_marks: progress.max_marks || 0,
          remarks: progress.remarks || '',
          lecturer_id: progress.lecturer_id || '',
          is_completed: progress.is_completed,
          attempt_number: progress.attempt_number || 1
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load progress',
          type: 'danger'
        });
        this.$router.push('/student-structure-progress');
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.studentStructureProgress.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Progress updated successfully',
            type: 'success'
          });
        } else {
          await api.studentStructureProgress.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Progress created successfully',
            type: 'success'
          });
        }

        this.$router.push('/student-structure-progress');
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
      if (this.form.max_marks > 0) {
        return Math.round((this.form.marks_obtained / this.form.max_marks) * 100);
      }
      return 0;
    },

    getPercentageClass(percentage) {
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    },

    getPercentageLabel(percentage) {
      if (percentage >= 80) return 'Excellent';
      if (percentage >= 60) return 'Good';
      if (percentage >= 40) return 'Average';
      return 'Poor';
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.student-structure-progress-form {
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

.btn-back {
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 15px;
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
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
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

/* Form Sections */
.form-section {
  padding: 35px 40px;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header i {
  font-size: 24px;
  color: #667eea;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.field-label i {
  color: #667eea;
  font-size: 14px;
}

.required {
  color: #e53e3e;
  font-weight: 700;
}

/* Form Inputs */
.field-input,
.field-select,
.field-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.field-input:hover,
.field-select:hover,
.field-textarea:hover {
  border-color: #cbd5e0;
}

.field-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 14px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 45px;
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

/* Error States */
.field-input.error,
.field-select.error,
.field-textarea.error {
  border-color: #fc8181;
  background: #fff5f5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #e53e3e;
  font-size: 13px;
  font-weight: 500;
}

.error-message i {
  font-size: 14px;
}

/* Percentage Display */
.percentage-display {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  border-radius: 15px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.percentage-display.excellent {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #10b981;
}

.percentage-display.good {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
}

.percentage-display.average {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.percentage-display.poor {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
}

.percentage-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.percentage-display.excellent .percentage-icon {
  color: #10b981;
}

.percentage-display.good .percentage-icon {
  color: #3b82f6;
}

.percentage-display.average .percentage-icon {
  color: #f59e0b;
}

.percentage-display.poor .percentage-icon {
  color: #ef4444;
}

.percentage-info {
  flex: 1;
}

.percentage-info h4 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.percentage-display.excellent .percentage-info h4 {
  color: #065f46;
}

.percentage-display.good .percentage-info h4 {
  color: #1e40af;
}

.percentage-display.average .percentage-info h4 {
  color: #92400e;
}

.percentage-display.poor .percentage-info h4 {
  color: #991b1b;
}

.percentage-info p {
  font-size: 14px;
  margin: 5px 0 0 0;
}

.percentage-display.excellent .percentage-info p {
  color: #047857;
}

.percentage-display.good .percentage-info p {
  color: #1d4ed8;
}

.percentage-display.average .percentage-info p {
  color: #b45309;
}

.percentage-display.poor .percentage-info p {
  color: #b91c1c;
}

.percentage-badge {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: white;
}

.percentage-display.excellent .percentage-badge {
  color: #065f46;
}

.percentage-display.good .percentage-badge {
  color: #1e40af;
}

.percentage-display.average .percentage-badge {
  color: #92400e;
}

.percentage-display.poor .percentage-badge {
  color: #991b1b;
}

/* Checkbox Styles */
.checkbox-wrapper {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.checkbox-wrapper:hover {
  border-color: #cbd5e0;
  background: #f1f5f9;
}

.checkbox-input {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  user-select: none;
}

.checkbox-box {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-box i {
  font-size: 14px;
  color: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-label .checkbox-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-label .checkbox-box i {
  opacity: 1;
  transform: scale(1);
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkbox-text strong {
  font-size: 15px;
  color: #2d3748;
}

.checkbox-text small {
  font-size: 13px;
  color: #718096;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  background: #f8fafc;
  gap: 15px;
}

.btn-cancel,
.btn-submit {
  padding: 14px 32px;
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
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
  color: #4a5568;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-submit i,
.btn-cancel i {
  font-size: 16px;
}

/* Loading State */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Placeholder Styling */
.field-input::placeholder,
.field-textarea::placeholder {
  color: #a0aec0;
}

/* Focus Visible */
.field-input:focus-visible,
.field-select:focus-visible,
.field-textarea:focus-visible {
  outline: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .student-structure-progress-form {
    padding: 20px;
  }

  .form-section {
    padding: 25px 30px;
  }

  .form-actions {
    padding: 20px 30px;
  }
}

@media (max-width: 768px) {
  .student-structure-progress-form {
    padding: 15px;
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

  .subtitle {
    font-size: 14px;
  }

  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .form-section {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .section-header i {
    font-size: 20px;
  }

  .section-header h3 {
    font-size: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .percentage-display {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    flex-direction: column-reverse;
    padding: 20px;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .student-structure-progress-form {
    padding: 10px;
  }

  .header-section {
    padding: 15px;
    border-radius: 15px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .form-section {
    padding: 15px;
  }

  .field-input,
  .field-select,
  .field-textarea {
    padding: 12px 14px;
    font-size: 14px;
  }

  .btn-cancel,
  .btn-submit {
    padding: 12px 24px;
    font-size: 15px;
  }

  .percentage-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .percentage-info h4 {
    font-size: 28px;
  }
}

/* Nice Touches */
.form-card {
  position: relative;
  overflow: hidden;
}

.form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

/* Smooth Transitions */
* {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Custom Scrollbar */
.field-textarea::-webkit-scrollbar {
  width: 8px;
}

.field-textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.field-textarea::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.field-textarea::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Auto-fill Styling */
.field-input:-webkit-autofill,
.field-select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #2d3748 !important;
}

/* Disabled State */
.field-input:disabled,
.field-select:disabled,
.field-textarea:disabled {
  background: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

/* Print Styles */
@media print {
  .header-section,
  .form-actions {
    display: none;
  }

  .form-card {
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }
}
</style>