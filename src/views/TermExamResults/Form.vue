<template>
  <div class="term-exam-result-form">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">{{ isEdit ? 'Edit' : 'Add' }} Exam Result</h2>
        <p class="text-muted">{{ isEdit ? 'Update' : 'Record' }} student exam result</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/term-exam-results" class="btn btn-secondary">
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
                <option value="">Select Student</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.student_card_record_id" class="invalid-feedback">{{ errors.student_card_record_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Term Exam</label>
              <select v-model="form.term_exam_id" @change="onExamChange" class="form-select" :class="{ 'is-invalid': errors.term_exam_id }" required>
                <option value="">Select Term Exam</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.term_exam_id" class="invalid-feedback">{{ errors.term_exam_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Exam Date</label>
              <input v-model="form.exam_date" type="date" class="form-control" :class="{ 'is-invalid': errors.exam_date }" />
              <div v-if="errors.exam_date" class="invalid-feedback">{{ errors.exam_date[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Examiner</label>
              <select v-model="form.examiner_id" class="form-select" :class="{ 'is-invalid': errors.examiner_id }">
                <option value="">Select Examiner (Optional)</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.examiner_id" class="invalid-feedback">{{ errors.examiner_id[0] }}</div>
            </div>
          </div>

          <!-- Marks Information -->
          <h5 class="mb-3 pb-2 border-bottom">Marks Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-12" v-if="selectedExam">
              <div class="alert alert-info">
                <strong>Exam Details:</strong>
                {{ selectedExam.term_name }} |
                Total Marks: {{ selectedExam.total_marks }} |
                Pass Marks: {{ selectedExam.pass_marks }}
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Marks Obtained</label>
              <input v-model.number="form.marks_obtained" type="number" step="0.01" min="0" :max="selectedExam ? selectedExam.total_marks : 999" class="form-control" :class="{ 'is-invalid': errors.marks_obtained }" placeholder="0.00" />
              <div v-if="errors.marks_obtained" class="invalid-feedback">{{ errors.marks_obtained[0] }}</div>
            </div>

            <div class="col-md-12" v-if="form.marks_obtained && selectedExam">
              <div class="card" :class="isPassed ? 'border-success' : 'border-danger'">
                <div class="card-body">
                  <div class="row text-center">
                    <div class="col-md-4">
                      <h5>Percentage</h5>
                      <h3 :class="isPassed ? 'text-success' : 'text-danger'">{{ calculatePercentage() }}%</h3>
                    </div>
                    <div class="col-md-4">
                      <h5>Result</h5>
                      <h3>
                        <span class="badge" :class="isPassed ? 'bg-success' : 'bg-danger'">
                          {{ isPassed ? 'PASS' : 'FAIL' }}
                        </span>
                      </h3>
                    </div>
                    <div class="col-md-4">
                      <h5>Grade</h5>
                      <h3>{{ calculateGrade() }}</h3>
                    </div>
                  </div>
                </div>
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
            <router-link to="/term-exam-results" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Update' : 'Save' }} Result
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
      submitting: false
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
  },
  methods: {
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
          exam_date: result.exam_date || new Date().toISOString().split('T')[0]
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
      // Load exam details when exam is selected
      // This should fetch the exam details to show total marks and pass marks
      // For now using placeholder
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
.required::after {
  content: ' *';
  color: red;
}
</style>