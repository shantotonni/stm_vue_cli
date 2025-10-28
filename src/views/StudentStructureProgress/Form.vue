<template>
  <div class="student-structure-progress-form">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">{{ isEdit ? 'Edit' : 'Create' }} Progress Record</h2>
        <p class="text-muted">{{ isEdit ? 'Update' : 'Add new' }} student structure progress</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/student-structure-progress" class="btn btn-secondary">
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
              <label class="form-label required">Student Card Record</label>
              <select v-model="form.student_card_record_id" class="form-select" :class="{ 'is-invalid': errors.student_card_record_id }" required>
                <option value="">Select Student Card Record</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.student_card_record_id" class="invalid-feedback">{{ errors.student_card_record_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Structure Level</label>
              <select v-model="form.structure_level_id" class="form-select" :class="{ 'is-invalid': errors.structure_level_id }" required>
                <option value="">Select Structure Level</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.structure_level_id" class="invalid-feedback">{{ errors.structure_level_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Lecturer</label>
              <select v-model="form.lecturer_id" class="form-select" :class="{ 'is-invalid': errors.lecturer_id }">
                <option value="">Select Lecturer (Optional)</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.lecturer_id" class="invalid-feedback">{{ errors.lecturer_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Attempt Number</label>
              <input v-model.number="form.attempt_number" type="number" min="1" class="form-control" :class="{ 'is-invalid': errors.attempt_number }" />
              <div v-if="errors.attempt_number" class="invalid-feedback">{{ errors.attempt_number[0] }}</div>
            </div>
          </div>

          <!-- Date Information -->
          <h5 class="mb-3 pb-2 border-bottom">Date Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Date of Beginning</label>
              <input v-model="form.date_of_beginning" type="date" class="form-control" :class="{ 'is-invalid': errors.date_of_beginning }" />
              <div v-if="errors.date_of_beginning" class="invalid-feedback">{{ errors.date_of_beginning[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Date of Examination</label>
              <input v-model="form.date_of_examination" type="date" class="form-control" :class="{ 'is-invalid': errors.date_of_examination }" />
              <div v-if="errors.date_of_examination" class="invalid-feedback">{{ errors.date_of_examination[0] }}</div>
            </div>
          </div>

          <!-- Marks Information -->
          <h5 class="mb-3 pb-2 border-bottom">Marks Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Marks Obtained</label>
              <input v-model.number="form.marks_obtained" type="number" step="0.01" min="0" class="form-control" :class="{ 'is-invalid': errors.marks_obtained }" placeholder="0.00" />
              <div v-if="errors.marks_obtained" class="invalid-feedback">{{ errors.marks_obtained[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Maximum Marks</label>
              <input v-model.number="form.max_marks" type="number" step="0.01" min="0" class="form-control" :class="{ 'is-invalid': errors.max_marks }" placeholder="0.00" />
              <div v-if="errors.max_marks" class="invalid-feedback">{{ errors.max_marks[0] }}</div>
            </div>

            <div class="col-md-12" v-if="form.marks_obtained && form.max_marks">
              <div class="alert alert-info">
                <strong>Percentage:</strong> {{ calculatePercentage() }}%
              </div>
            </div>
          </div>

          <!-- Status & Remarks -->
          <h5 class="mb-3 pb-2 border-bottom">Status & Remarks</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-12">
              <div class="form-check">
                <input v-model="form.is_completed" type="checkbox" class="form-check-input" id="isCompleted" />
                <label class="form-check-label" for="isCompleted">
                  Mark as Completed
                </label>
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Remarks</label>
              <textarea v-model="form.remarks" class="form-control" :class="{ 'is-invalid': errors.remarks }" rows="3" placeholder="Enter remarks"></textarea>
              <div v-if="errors.remarks" class="invalid-feedback">{{ errors.remarks[0] }}</div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-between">
            <router-link to="/student-structure-progress" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Update' : 'Create' }} Progress
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
    if (this.isEdit) {
      this.loadProgress();
    }
  },
  methods: {
    async loadProgress() {
      try {
        const response = await api.studentStructureProgress.getById(this.id);
        const progress = response.data;

        this.form = {
          student_card_record_id: progress.student_card_record_id,
          structure_level_id: progress.structure_level_id,
          date_of_beginning: progress.date_of_beginning || '',
          date_of_examination: progress.date_of_examination || '',
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