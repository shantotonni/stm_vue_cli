<template>
  <div class="student-card-record-form">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">{{ isEdit ? 'Edit' : 'Create' }} Student Card Record</h2>
        <p class="text-muted">{{ isEdit ? 'Update' : 'Add new' }} student card record information</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/student-card-records" class="btn btn-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to List
        </router-link>
      </div>
    </div>

    <!-- Form Card -->
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Basic Information -->
          <h5 class="mb-3 pb-2 border-bottom">Basic Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label required">Student</label>
              <select
                  v-model="form.student_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.student_id }"
                  required
              >
                <option value="">Select Student</option>
                <!-- This should be dynamically populated -->
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.name }}
                </option>
              </select>
              <div v-if="errors.student_id" class="invalid-feedback">{{ errors.student_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Card Type</label>
              <select
                  v-model="form.card_type_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.card_type_id }"
                  required
              >
                <option value="">Select Card Type</option>
                <!-- This should be dynamically populated -->
                <option v-for="cardType in cardTypes" :key="cardType.id" :value="cardType.id">
                  {{ cardType.name }}
                </option>
              </select>
              <div v-if="errors.card_type_id" class="invalid-feedback">{{ errors.card_type_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Academic Year</label>
              <select
                  v-model="form.academic_year_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.academic_year_id }"
                  required
              >
                <option value="">Select Academic Year</option>
                <!-- This should be dynamically populated -->
                <option v-for="year in academicYears" :key="year.id" :value="year.id">
                  {{ year.name }}
                </option>
              </select>
              <div v-if="errors.academic_year_id" class="invalid-feedback">{{ errors.academic_year_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Card Number</label>
              <input
                  v-model="form.card_number"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.card_number }"
                  placeholder="Enter card number"
              />
              <div v-if="errors.card_number" class="invalid-feedback">{{ errors.card_number[0] }}</div>
            </div>
          </div>

          <!-- Placement Information -->
          <h5 class="mb-3 pb-2 border-bottom">Placement Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Cadaver</label>
              <select
                  v-model="form.cadaver_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.cadaver_id }"
              >
                <option value="">Select Cadaver (Optional)</option>
                <!-- This should be dynamically populated -->
              </select>
              <div v-if="errors.cadaver_id" class="invalid-feedback">{{ errors.cadaver_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Specimen</label>
              <select
                  v-model="form.specimen_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.specimen_id }"
              >
                <option value="">Select Specimen (Optional)</option>
                <!-- This should be dynamically populated -->
              </select>
              <div v-if="errors.specimen_id" class="invalid-feedback">{{ errors.specimen_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Placement Start Date</label>
              <input
                  v-model="form.placement_start_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.placement_start_date }"
              />
              <div v-if="errors.placement_start_date" class="invalid-feedback">
                {{ errors.placement_start_date[0] }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Placement End Date</label>
              <input
                  v-model="form.placement_end_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.placement_end_date }"
              />
              <div v-if="errors.placement_end_date" class="invalid-feedback">
                {{ errors.placement_end_date[0] }}
              </div>
            </div>
          </div>

          <!-- Progress Information -->
          <h5 class="mb-3 pb-2 border-bottom">Progress Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label">Status</label>
              <select
                  v-model="form.status"
                  class="form-select"
                  :class="{ 'is-invalid': errors.status }"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <div v-if="errors.status" class="invalid-feedback">{{ errors.status[0] }}</div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Total Marks Obtained</label>
              <input
                  v-model.number="form.total_marks_obtained"
                  type="number"
                  step="0.01"
                  class="form-control"
                  :class="{ 'is-invalid': errors.total_marks_obtained }"
                  placeholder="0.00"
              />
              <div v-if="errors.total_marks_obtained" class="invalid-feedback">
                {{ errors.total_marks_obtained[0] }}
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Total Attendance</label>
              <input
                  v-model.number="form.total_attendance"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.total_attendance }"
                  placeholder="0"
              />
              <div v-if="errors.total_attendance" class="invalid-feedback">
                {{ errors.total_attendance[0] }}
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Overall Remarks</label>
              <textarea
                  v-model="form.overall_remarks"
                  class="form-control"
                  :class="{ 'is-invalid': errors.overall_remarks }"
                  rows="3"
                  placeholder="Enter overall remarks"
              ></textarea>
              <div v-if="errors.overall_remarks" class="invalid-feedback">
                {{ errors.overall_remarks[0] }}
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-between">
            <router-link to="/student-card-records" class="btn btn-secondary">
              Cancel
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Update' : 'Create' }} Record
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

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
      errors: {},
      submitting: false
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  mounted() {
    // Load necessary data
    this.loadStudents();
    this.loadCardTypes();
    this.loadAcademicYears();

    if (this.isEdit) {
      this.loadRecord();
    }
  },
  methods: {
    async loadStudents() {
      // This should load students from your API
      // For now, it's a placeholder
      this.students = [];
    },
    async loadCardTypes() {
      // This should load card types from your API
      this.cardTypes = [];
    },
    async loadAcademicYears() {
      // This should load academic years from your API
      this.academicYears = [];
    },
    async loadRecord() {
      try {
        const response = await api.studentCardRecords.getById(this.id);
        const record = response.data;

        // Populate form with record data
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
      }
    },
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.studentCardRecords.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Record updated successfully',
            type: 'success'
          });
        } else {
          await api.studentCardRecords.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Record created successfully',
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
.required::after {
  content: ' *';
  color: red;
}
</style>