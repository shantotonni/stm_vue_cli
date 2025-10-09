<template>
  <div v-if="show && exam" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title">
            <i class="fas fa-chart-line"></i>
            Exam Results - {{ exam.title }}
          </h5>
          <button type="button" class="close text-white" @click="close">
            <span>&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Statistics Cards -->
          <div v-if="results.length > 0" class="row mb-4">
            <div class="col-md-3">
              <div class="card bg-primary text-white">
                <div class="card-body text-center">
                  <h3>{{ statistics.total_students }}</h3>
                  <small>Total Students</small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-success text-white">
                <div class="card-body text-center">
                  <h3>{{ statistics.passed }}</h3>
                  <small>Passed</small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-danger text-white">
                <div class="card-body text-center">
                  <h3>{{ statistics.failed }}</h3>
                  <small>Failed</small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-info text-white">
                <div class="card-body text-center">
                  <h3>{{ statistics.average_marks ? statistics.average_marks.toFixed(2) : '0' }}</h3>
                  <small>Average Marks</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mb-3">
            <button
                v-if="results.length === 0"
                class="btn btn-primary mr-2"
                @click="showBulkEntry = true"
            >
              <i class="fas fa-edit"></i> Enter Results
            </button>
            <button
                v-else
                class="btn btn-success mr-2"
                @click="exportResults"
            >
              <i class="fas fa-file-excel"></i> Export to Excel
            </button>
            <button
                v-if="results.length > 0"
                class="btn btn-info"
                @click="printResults"
            >
              <i class="fas fa-print"></i> Print
            </button>
          </div>

          <!-- Bulk Results Entry -->
          <div v-if="showBulkEntry" class="card mb-3">
            <div class="card-header">
              <h6 class="mb-0">Bulk Results Entry</h6>
            </div>
            <div class="card-body">
              <div class="alert alert-info">
                <strong>Instructions:</strong> Enter marks for each student. Total Marks: {{ exam.total_marks }}, Passing Marks: {{ exam.passing_marks }}
              </div>

              <form @submit.prevent="saveBulkResults">
                <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                  <table class="table table-sm table-bordered">
                    <thead class="thead-light sticky-top">
                    <tr>
                      <th style="width: 20%;">Student ID</th>
                      <th style="width: 30%;">Name</th>
                      <th style="width: 20%;">Marks Obtained</th>
                      <th style="width: 15%;">Grade</th>
                      <th style="width: 15%;">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(student, index) in students" :key="student.id">
                      <td>{{ student.student_id }}</td>
                      <td>{{ student.name }}</td>
                      <td>
                        <input
                            type="number"
                            class="form-control form-control-sm"
                            v-model.number="bulkResults[index].marks_obtained"
                            :max="exam.total_marks"
                            min="0"
                            step="0.5"
                            required
                            @input="calculateGrade(index)"
                        >
                      </td>
                      <td>
                          <span class="badge badge-info">
                            {{ bulkResults[index].grade }}
                          </span>
                      </td>
                      <td>
                          <span
                              :class="getPassFailClass(bulkResults[index].marks_obtained)"
                          >
                            {{ getPassFailText(bulkResults[index].marks_obtained) }}
                          </span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <div class="text-right mt-3">
                  <button type="button" class="btn btn-secondary mr-2" @click="showBulkEntry = false">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="submitting">
                    <span v-if="submitting">
                      <i class="fas fa-spinner fa-spin"></i> Submitting...
                    </span>
                    <span v-else>
                      <i class="fas fa-save"></i> Submit All Results
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Results Table -->
          <div v-if="results.length > 0 && !showBulkEntry">
            <h6 class="mb-3">Published Results</h6>
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead class="thead-dark">
                <tr>
                  <th>Rank</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Marks Obtained</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(result, index) in results" :key="result.id">
                  <td>
                    <strong>
                      <span v-if="index === 0" class="text-warning">🥇</span>
                      <span v-else-if="index === 1" class="text-secondary">🥈</span>
                      <span v-else-if="index === 2" class="text-warning">🥉</span>
                      <span v-else>{{ index + 1 }}</span>
                    </strong>
                  </td>
                  <td>{{ result.student.student_id }}</td>
                  <td>{{ result.student.name }}</td>
                  <td>
                    <strong>{{ result.marks_obtained }}</strong> / {{ exam.total_marks }}
                  </td>
                  <td>
                    <span class="badge badge-info badge-lg">{{ result.grade }}</span>
                  </td>
                  <td>
                      <span
                          class="badge"
                          :class="result.marks_obtained >= exam.passing_marks ? 'badge-success' : 'badge-danger'"
                      >
                        {{ result.marks_obtained >= exam.passing_marks ? 'PASS' : 'FAIL' }}
                      </span>
                  </td>
                  <td>{{ calculatePercentage(result.marks_obtained) }}%</td>
                  <td>
                    <button
                        class="btn btn-sm btn-warning"
                        @click="editResult(result)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Grade Distribution -->
            <div class="card mt-4">
              <div class="card-header">
                <h6 class="mb-0">Grade Distribution</h6>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <div v-for="grade in gradeDistribution" :key="grade.name" class="mb-2">
                      <div class="d-flex justify-content-between">
                        <span><strong>{{ grade.name }}</strong> ({{ grade.min }}% - {{ grade.max }}%)</span>
                        <span>{{ grade.count }} students</span>
                      </div>
                      <div class="progress">
                        <div
                            class="progress-bar bg-info"
                            :style="{ width: grade.percentage + '%' }"
                        >
                          {{ grade.percentage.toFixed(1) }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="results.length === 0 && !showBulkEntry" class="text-center py-5">
            <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
            <p class="text-muted">No results entered yet</p>
            <button class="btn btn-primary" @click="showBulkEntry = true">
              <i class="fas fa-plus"></i> Enter Results Now
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExamResultsModal',

  props: {
    show: Boolean,
    exam: Object
  },

  data() {
    return {
      results: [],
      students: [],
      bulkResults: [],
      statistics: {
        total_students: 0,
        passed: 0,
        failed: 0,
        average_marks: 0,
        highest_marks: 0,
        lowest_marks: 0
      },
      showBulkEntry: false,
      submitting: false
    };
  },

  computed: {
    gradeDistribution() {
      const grades = [
        { name: 'A+', min: 80, max: 100, count: 0 },
        { name: 'A', min: 75, max: 79, count: 0 },
        { name: 'A-', min: 70, max: 74, count: 0 },
        { name: 'B+', min: 65, max: 69, count: 0 },
        { name: 'B', min: 60, max: 64, count: 0 },
        { name: 'B-', min: 55, max: 59, count: 0 },
        { name: 'C+', min: 50, max: 54, count: 0 },
        { name: 'C', min: 45, max: 49, count: 0 },
        { name: 'D', min: 40, max: 44, count: 0 },
        { name: 'F', min: 0, max: 39, count: 0 }
      ];

      this.results.forEach(result => {
        const percentage = (result.marks_obtained / this.exam.total_marks) * 100;
        const grade = grades.find(g => percentage >= g.min && percentage <= g.max);
        if (grade) grade.count++;
      });

      return grades.map(g => ({
        ...g,
        percentage: this.results.length > 0 ? (g.count / this.results.length) * 100 : 0
      }));
    }
  },

  watch: {
    show(val) {
      if (val && this.exam) {
        this.fetchResults();
        this.fetchStudents();
      }
    }
  },

  methods: {
    async fetchResults() {
      try {
        const response = await axios.get(`/api/results/exam/${this.exam.id}`);
        this.results = response.data.results || [];
        this.statistics = response.data.statistics || this.statistics;
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    },

    async fetchStudents() {
      try {
        const response = await axios.get(`/api/exams/${this.exam.id}/students`);
        this.students = response.data.data || response.data;

        this.bulkResults = this.students.map(student => ({
          student_id: student.id,
          marks_obtained: 0,
          grade: 'F'
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },

    calculateGrade(index) {
      const marks = this.bulkResults[index].marks_obtained;
      const percentage = (marks / this.exam.total_marks) * 100;

      if (percentage >= 80) this.bulkResults[index].grade = 'A+';
      else if (percentage >= 75) this.bulkResults[index].grade = 'A';
      else if (percentage >= 70) this.bulkResults[index].grade = 'A-';
      else if (percentage >= 65) this.bulkResults[index].grade = 'B+';
      else if (percentage >= 60) this.bulkResults[index].grade = 'B';
      else if (percentage >= 55) this.bulkResults[index].grade = 'B-';
      else if (percentage >= 50) this.bulkResults[index].grade = 'C+';
      else if (percentage >= 45) this.bulkResults[index].grade = 'C';
      else if (percentage >= 40) this.bulkResults[index].grade = 'D';
      else this.bulkResults[index].grade = 'F';
    },

    async saveBulkResults() {
      this.submitting = true;

      try {
        await axios.post('/api/results/bulk', {
          exam_id: this.exam.id,
          evaluated_by: 1,
          results: this.bulkResults
        });

        this.$toast.success('Results submitted successfully!');
        this.showBulkEntry = false;
        this.fetchResults();
      } catch (error) {
        console.error('Error submitting results:', error);
        this.$toast.error('Failed to submit results');
      } finally {
        this.submitting = false;
      }
    },

    calculatePercentage(marks) {
      return ((marks / this.exam.total_marks) * 100).toFixed(2);
    },

    getPassFailText(marks) {
      return marks >= this.exam.passing_marks ? 'PASS' : 'FAIL';
    },

    getPassFailClass(marks) {
      return marks >= this.exam.passing_marks ? 'badge badge-success' : 'badge badge-danger';
    },

    editResult(result) {
      console.log(result)
      this.$toast.info('Edit result feature coming soon!');
    },

    exportResults() {
      this.$toast.info('Export feature coming soon!');
    },

    printResults() {
      window.print();
    },

    close() {
      this.showBulkEntry = false;
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}

.badge-lg {
  font-size: 1rem;
  padding: 5px 10px;
}
</style>