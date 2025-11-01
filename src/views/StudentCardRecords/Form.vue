<template>
  <div class="student-card-record-form">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i :class="isEdit ? 'fa fa-edit' : 'fa fa-plus-circle'"></i>
          </div>
          <div>
            <h1>{{ isEdit ? 'Edit' : 'Create' }} Card Record</h1>
            <p class="subtitle">{{ isEdit ? 'Update existing' : 'Add new' }} student card record information</p>
          </div>
        </div>
        <router-link to="/student-card-records" class="btn-back">
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
                <i class="fa fa-user-graduate"></i>
                Student <span class="required">*</span>
              </label>
              <select v-model="form.student_id" class="field-select" :class="{ 'error': errors.student_id }" required>
                <option value="">Select Student</option>
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.name }} {{ student.roll ? `(Roll: ${student.roll})` : '' }}
                </option>
              </select>
              <span v-if="errors.student_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.student_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-id-card"></i>
                Card Type <span class="required">*</span>
              </label>
              <select
                  v-model="form.card_type_id"
                  class="field-select"
                  :class="{ 'error': errors.card_type_id }"
                  required
              >
                <option value="">Select Card Type</option>
                <option v-for="cardType in cardTypes" :key="cardType.id" :value="cardType.id">
                  {{ cardType.card_name }}
                </option>
              </select>
              <span v-if="errors.card_type_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.card_type_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calendar-alt"></i>
                Academic Year <span class="required">*</span>
              </label>
              <select v-model="form.academic_year_id" class="field-select" :class="{ 'error': errors.academic_year_id }" required>
                <option value="">Select Academic Year</option>
                <option v-for="year in academicYears" :key="year.id" :value="year.id">
                  {{ year.name }}
                </option>
              </select>
              <span v-if="errors.academic_year_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.academic_year_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-barcode"></i>
                Card Number
              </label>
              <input
                  v-model="form.card_number"
                  type="text"
                  class="field-input"
                  :class="{ 'error': errors.card_number }"
                  placeholder="Enter card number"
              />
              <span v-if="errors.card_number" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.card_number[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Placement Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-map-marker-alt"></i>
            <h3>Placement Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-user-injured"></i>
                Cadaver
              </label>
              <select
                  v-model="form.cadaver_id"
                  class="field-select"
                  :class="{ 'error': errors.cadaver_id }"
              >
                <option value="">Select Cadaver (Optional)</option>
                <option v-for="cadaver in cadavers" :key="cadaver.id" :value="cadaver.id">
                  {{ cadaver.cadaver_number }}
                </option>
              </select>
              <span v-if="errors.cadaver_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.cadaver_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-flask"></i>
                Specimen
              </label>
              <select
                  v-model="form.specimen_id"
                  class="field-select"
                  :class="{ 'error': errors.specimen_id }"
              >
                <option value="">Select Specimen (Optional)</option>
                <option v-for="specimen in specimens" :key="specimen.id" :value="specimen.id">
                  {{ specimen.specimen_name }}({{ specimen.specimen_number }})
                </option>
              </select>
              <span v-if="errors.specimen_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.specimen_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calendar-check"></i>
                Placement Start Date
              </label>
              <input
                  v-model="form.placement_start_date"
                  type="date"
                  class="field-input"
                  :class="{ 'error': errors.placement_start_date }"
              />
              <span v-if="errors.placement_start_date" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.placement_start_date[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calendar-times"></i>
                Placement End Date
              </label>
              <input
                  v-model="form.placement_end_date"
                  type="date"
                  class="field-input"
                  :class="{ 'error': errors.placement_end_date }"
              />
              <span v-if="errors.placement_end_date" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.placement_end_date[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-chart-line"></i>
            <h3>Progress Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-info-circle"></i>
                Status
              </label>
              <select
                  v-model="form.status"
                  class="field-select"
                  :class="{ 'error': errors.status }"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <span v-if="errors.status" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.status[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-star"></i>
                Total Marks Obtained
              </label>
              <input
                  v-model.number="form.total_marks_obtained"
                  type="number"
                  step="0.01"
                  class="field-input"
                  :class="{ 'error': errors.total_marks_obtained }"
                  placeholder="0.00"
              />
              <span v-if="errors.total_marks_obtained" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.total_marks_obtained[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-calendar-check"></i>
                Total Attendance
              </label>
              <input
                  v-model.number="form.total_attendance"
                  type="number"
                  class="field-input"
                  :class="{ 'error': errors.total_attendance }"
                  placeholder="0"
              />
              <span v-if="errors.total_attendance" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.total_attendance[0] }}
              </span>
            </div>

            <div class="form-field full-width">
              <label class="field-label">
                <i class="fa fa-comment-alt"></i>
                Overall Remarks
              </label>
              <textarea
                  v-model="form.overall_remarks"
                  class="field-textarea"
                  :class="{ 'error': errors.overall_remarks }"
                  rows="4"
                  placeholder="Enter overall remarks (optional)"
              ></textarea>
              <span v-if="errors.overall_remarks" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.overall_remarks[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link to="/student-card-records" class="btn-cancel">
            <i class="fa fa-times"></i>
            <span>Cancel</span>
          </router-link>
          <button type="submit" class="btn-submit" :disabled="submitting">
            <i :class="submitting ? 'fa fa-spinner fa-spin' : (isEdit ? 'fa fa-save' : 'fa fa-plus-circle')"></i>
            <span>{{ submitting ? 'Saving...' : (isEdit ? 'Update Record' : 'Create Record') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';
import cardTypeService from '../Admin/card-type/cardTypeService';

export default {
  name: 'StudentCardRecordForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        student_id: '',
        card_type_id: '',
        academic_year_id: '',
        card_number: '',
        cadaver_id: '',
        specimen_id: '',
        placement_start_date: '',
        placement_end_date: '',
        status: 'not_started',
        total_marks_obtained: 0,
        total_attendance: 0,
        overall_remarks: ''
      },
      students: [],
      cardTypes: [],
      academicYears: [],
      cadavers: [],
      specimens: [],
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
    this.loadStudents();
    this.loadCardTypes();
    this.loadAcademicYears();
    this.loadCadavers();
    this.loadSpecimens();

    if (this.isEdit) {
      this.loadRecord();
    }
  },
  methods: {
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
    async loadCardTypes() {
      try {
        const response = await cardTypeService.getAll({ per_page: 100, is_active: 1 });
        this.cardTypes = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card types:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load card types',
          type: 'danger'
        });
      }
    },
    async loadAcademicYears() {
      try {
        const response = await this.$api.get('/get-academic-year');
        this.academicYears = response.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadCadavers() {
      try {
        const response = await this.$api.get('/get-cadavers');
        this.cadavers = response.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadSpecimens() {
      try {
        const response = await this.$api.get('/get-specimens');
        this.specimens = response.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadRecord() {
      this.loading = true;
      try {
        const response = await api.studentCardRecords.getById(this.id);
        const record = response.data;

        this.form = {
          student_id: record.student_id,
          card_type_id: record.card_type_id,
          academic_year_id: record.academic_year_id,
          card_number: record.card_number || '',
          cadaver_id: record.cadaver_id || '',
          specimen_id: record.specimen_id || '',
          placement_start_date: record.placement_start_date || '',
          placement_end_date: record.placement_end_date || '',
          status: record.status,
          total_marks_obtained: record.total_marks_obtained || 0,
          total_attendance: record.total_attendance || 0,
          overall_remarks: record.overall_remarks || ''
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load record',
          type: 'danger'
        });
        this.$router.push('/student-card-records');
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.studentCardRecords.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Card record updated successfully',
            type: 'success'
          });
        } else {
          await api.studentCardRecords.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Card record created successfully',
            type: 'success'
          });
        }

        this.$router.push('/student-card-records');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors || {};
          this.$root.$emit('show-notification', {
            message: error.response.data.message || 'Validation failed',
            type: 'danger'
          });
        } else {
          this.$root.$emit('show-notification', {
            message: 'An error occurred while saving the record',
            type: 'danger'
          });
        }
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.student-card-record-form {
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

/* Date Input Styling */
.field-input[type="date"] {
  position: relative;
}

.field-input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  filter: invert(0.5);
}

.field-input[type="date"]:hover::-webkit-calendar-picker-indicator {
  opacity: 1;
}

/* Number Input Styling */
.field-input[type="number"]::-webkit-inner-spin-button,
.field-input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
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
  .student-card-record-form {
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
  .student-card-record-form {
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
  .student-card-record-form {
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

/* Success State (for future use) */
.field-input.success,
.field-select.success,
.field-textarea.success {
  border-color: #48bb78;
  background: #f0fff4;
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

/* Select Option Styling */
.field-select option {
  padding: 10px;
}

/* Enhanced Date Picker */
.field-input[type="date"]::-webkit-datetime-edit {
  padding: 0;
}

.field-input[type="date"]::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

/* Status Select Custom Styling */
.field-select option[value="not_started"] {
  color: #4a5568;
}

.field-select option[value="in_progress"] {
  color: #1e40af;
}

.field-select option[value="completed"] {
  color: #065f46;
}

.field-select option[value="failed"] {
  color: #991b1b;
}
</style>