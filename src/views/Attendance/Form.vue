<template>
  <div class="attendance-form">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">{{ isEdit ? 'Edit' : 'Mark' }} Attendance</h2>
        <p class="text-muted">{{ isEdit ? 'Update' : 'Record' }} student attendance</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/attendance" class="btn btn-secondary">
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
              <select v-model="form.student_id" class="form-select" :class="{ 'is-invalid': errors.student_id }" required>
                <option value="">Select Student</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.student_id" class="invalid-feedback">{{ errors.student_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Card Type</label>
              <select v-model="form.card_type_id" class="form-select" :class="{ 'is-invalid': errors.card_type_id }" required>
                <option value="">Select Card Type</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.card_type_id" class="invalid-feedback">{{ errors.card_type_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Class Date</label>
              <input v-model="form.class_date" type="date" class="form-control" :class="{ 'is-invalid': errors.class_date }" required />
              <div v-if="errors.class_date" class="invalid-feedback">{{ errors.class_date[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Class Type</label>
              <select v-model="form.class_type" class="form-select" :class="{ 'is-invalid': errors.class_type }" required>
                <option value="">Select Type</option>
                <option value="lecture">Lecture</option>
                <option value="tutorial">Tutorial</option>
                <option value="practical">Practical</option>
                <option value="demonstration">Demonstration</option>
                <option value="integrated">Integrated</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.class_type" class="invalid-feedback">{{ errors.class_type[0] }}</div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Class Topic</label>
              <input v-model="form.class_topic" type="text" class="form-control" :class="{ 'is-invalid': errors.class_topic }" placeholder="Enter class topic" />
              <div v-if="errors.class_topic" class="invalid-feedback">{{ errors.class_topic[0] }}</div>
            </div>
          </div>

          <!-- Attendance Status -->
          <h5 class="mb-3 pb-2 border-bottom">Attendance Status</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-12">
              <label class="form-label required">Status</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input v-model="form.status" type="radio" class="form-check-input" value="present" id="statusPresent" required />
                  <label class="form-check-label" for="statusPresent">
                    <span class="badge bg-success">Present</span>
                  </label>
                </div>
                <div class="form-check">
                  <input v-model="form.status" type="radio" class="form-check-input" value="absent" id="statusAbsent" />
                  <label class="form-check-label" for="statusAbsent">
                    <span class="badge bg-danger">Absent</span>
                  </label>
                </div>
                <div class="form-check">
                  <input v-model="form.status" type="radio" class="form-check-input" value="late" id="statusLate" />
                  <label class="form-check-label" for="statusLate">
                    <span class="badge bg-warning">Late</span>
                  </label>
                </div>
                <div class="form-check">
                  <input v-model="form.status" type="radio" class="form-check-input" value="excused" id="statusExcused" />
                  <label class="form-check-label" for="statusExcused">
                    <span class="badge bg-info">Excused</span>
                  </label>
                </div>
              </div>
              <div v-if="errors.status" class="invalid-feedback d-block">{{ errors.status[0] }}</div>
            </div>
          </div>

          <!-- Teacher Information -->
          <h5 class="mb-3 pb-2 border-bottom">Teacher Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Conducted By</label>
              <select v-model="form.conducted_by_teacher_id" class="form-select" :class="{ 'is-invalid': errors.conducted_by_teacher_id }">
                <option value="">Select Teacher (Optional)</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.conducted_by_teacher_id" class="invalid-feedback">{{ errors.conducted_by_teacher_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Marked By</label>
              <select v-model="form.marked_by_teacher_id" class="form-select" :class="{ 'is-invalid': errors.marked_by_teacher_id }">
                <option value="">Select Teacher (Optional)</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.marked_by_teacher_id" class="invalid-feedback">{{ errors.marked_by_teacher_id[0] }}</div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Remarks</label>
              <textarea v-model="form.remarks" class="form-control" :class="{ 'is-invalid': errors.remarks }" rows="3" placeholder="Enter any remarks"></textarea>
              <div v-if="errors.remarks" class="invalid-feedback">{{ errors.remarks[0] }}</div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-between">
            <router-link to="/attendance" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Update' : 'Mark' }} Attendance
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
  name: 'AttendanceForm',
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
        class_date: new Date().toISOString().split('T')[0],
        class_type: '',
        class_topic: '',
        status: 'present',
        remarks: '',
        conducted_by_teacher_id: '',
        marked_by_teacher_id: ''
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
      this.loadAttendance();
    }
  },
  methods: {
    async loadAttendance() {
      try {
        const response = await api.attendance.getById(this.id);
        const attendance = response.data;

        this.form = {
          student_id: attendance.student_id,
          card_type_id: attendance.card_type_id,
          class_date: attendance.class_date,
          class_type: attendance.class_type,
          class_topic: attendance.class_topic || '',
          status: attendance.status,
          remarks: attendance.remarks || '',
          conducted_by_teacher_id: attendance.conducted_by_teacher_id || '',
          marked_by_teacher_id: attendance.marked_by_teacher_id || ''
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load attendance',
          type: 'danger'
        });
        this.$router.push('/attendance');
      }
    },
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.attendance.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Attendance updated successfully',
            type: 'success'
          });
        } else {
          await api.attendance.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Attendance marked successfully',
            type: 'success'
          });
        }

        this.$router.push('/attendance');
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