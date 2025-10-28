<template>
  <div class="term-exam-results-bulk">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Bulk Entry - Exam Results</h2>
        <p class="text-muted">Enter results for multiple students</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/term-exam-results" class="btn btn-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to List
        </router-link>
      </div>
    </div>

    <!-- Exam Selection Card -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Select Exam</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label required">Term Exam</label>
            <select v-model="examInfo.term_exam_id" @change="onExamChange" class="form-select" required>
              <option value="">Select Term Exam</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Examiner</label>
            <select v-model="examInfo.examiner_id" class="form-select">
              <option value="">Select Examiner (Optional)</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-12" v-if="selectedExam">
            <div class="alert alert-info mb-0">
              <strong>Exam Details:</strong>
              {{ selectedExam.term_name }} |
              Card Type: {{ selectedExam.card_type ? selectedExam.card_type.name : 'N/A' }} |
              Total Marks: {{ selectedExam.total_marks }} |
              Pass Marks: {{ selectedExam.pass_marks }}
            </div>
          </div>
          <div class="col-md-12">
            <button @click="loadStudents" type="button" class="btn btn-primary" :disabled="!examInfo.term_exam_id || loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Load Students
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Students Results Table -->
    <div v-if="students.length > 0" class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Enter Marks</h5>
        <div>
          <span class="badge bg-info me-2">Total Students: {{ students.length }}</span>
          <span class="badge bg-success me-2">Passed: {{ passedCount }}</span>
          <span class="badge bg-danger">Failed: {{ failedCount }}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
            <tr>
              <th width="5%">#</th>
              <th width="25%">Student Name</th>
              <th width="15%">Marks Obtained *</th>
              <th width="10%">Percentage</th>
              <th width="10%">Result</th>
              <th width="10%">Exam Date</th>
              <th width="25%">Remarks</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(student, index) in students" :key="student.id">
              <td>{{ index + 1 }}</td>
              <td>
                <strong>{{ student.student ? student.student.name : 'N/A' }}</strong>
                <br />
                <small class="text-muted">{{ student.card_number }}</small>
              </td>
              <td>
                <input
                    v-model.number="results[index].marks_obtained"
                    type="number"
                    step="0.01"
                    min="0"
                    :max="selectedExam.total_marks"
                    class="form-control form-control-sm"
                    placeholder="0.00"
                    required
                />
              </td>
              <td>
                <strong :class="getPercentageClass(index)">
                  {{ calculatePercentage(index) }}%
                </strong>
              </td>
              <td>
                  <span class="badge" :class="isPassed(index) ? 'bg-success' : 'bg-danger'">
                    {{ isPassed(index) ? 'Pass' : 'Fail' }}
                  </span>
              </td>
              <td>
                <input
                    v-model="results[index].exam_date"
                    type="date"
                    class="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                    v-model="results[index].remarks"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Optional"
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <small class="text-muted">* Required fields</small>
          </div>
          <div>
            <router-link to="/term-exam-results" class="btn btn-secondary me-2">Cancel</router-link>
            <button @click="submitBulkResults" type="button" class="btn btn-primary" :disabled="submitting || !isFormValid">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              Submit Results ({{ students.length }} students)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Students Message -->
    <div v-else-if="!loading && examInfo.term_exam_id" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      Click "Load Students" to fetch students for this exam.
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
      return this.results.filter((r, index) => !this.isPassed(index) && r.marks_obtained !== null).length;
    },
    isFormValid() {
      return this.results.every(r => r.marks_obtained !== null && r.marks_obtained !== '');
    }
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
    async loadStudents() {
      this.loading = true;
      try {
        // This should fetch student card records for the selected exam
        // For now using placeholder
        // const response = await api.studentCardRecords.getByCardType(this.selectedExam.card_type_id);
        // this.students = response.data;

        // Placeholder - replace with actual API call
        this.students = [
          {
            id: 1,
            student: { name: 'Student 1' },
            card_number: 'CARD001'
          },
          {
            id: 2,
            student: { name: 'Student 2' },
            card_number: 'CARD002'
          }
        ];

        // Initialize results array
        this.results = this.students.map(student => ({
          student_card_record_id: student.id,
          marks_obtained: null,
          exam_date: new Date().toISOString().split('T')[0],
          remarks: ''
        }));
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
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
      return this.isPassed(index) ? 'text-success' : 'text-danger';
    },
    async submitBulkResults() {
      this.submitting = true;
      try {
        const data = {
          term_exam_id: this.examInfo.term_exam_id,
          examiner_id: this.examInfo.examiner_id || null,
          results: this.results
        };

        await api.termExamResults.bulkStore(data);

        this.$root.$emit('show-notification', {
          message: `Results submitted successfully for ${this.students.length} students`,
          type: 'success'
        });

        this.$router.push('/term-exam-results');
      } catch (error) {
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
.required::after {
  content: ' *';
  color: red;
}

.table input {
  font-size: 0.875rem;
}
</style>