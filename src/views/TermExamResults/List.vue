<template>
  <div class="term-exam-results-list">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-clipboard-check"></i>
          </div>
          <div>
            <h1>Term Exam Results</h1>
            <p class="subtitle">Comprehensive examination result tracking and analysis</p>
          </div>
        </div>
        <div class="action-buttons-header">
          <router-link to="/term-exam-results/bulk" class="btn-add secondary">
            <i class="fa fa-list-check"></i>
            <span>Bulk Entry</span>
          </router-link>
          <router-link to="/term-exam-results/create" class="btn-add">
            <i class="fa fa-plus-circle"></i>
            <span>Add Result</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card blue">
        <div class="stat-icon">
          <i class="fa fa-clipboard-list"></i>
        </div>
        <div class="stat-info">
          <h3>{{ pagination.total || 0 }}</h3>
          <p>Total Results</p>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ passedCount }}</h3>
          <p>Passed ({{ passRate }}%)</p>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">
          <i class="fa fa-times-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ failedCount }}</h3>
          <p>Failed ({{ failRate }}%)</p>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">
          <i class="fa fa-percentage"></i>
        </div>
        <div class="stat-info">
          <h3>{{ averagePercentage }}%</h3>
          <p>Average Score</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <div class="filter-item">
          <label><i class="fa fa-book-open"></i> Term Exam</label>
          <select v-model="filters.term_exam_id" @change="loadResults" class="filter-select">
            <option value="">All Term Exams</option>
            <option v-for="term_exam in term_exams" :key="term_exam.id" :value="term_exam.id">
              {{ term_exam.term_name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-user-graduate"></i> Student</label>
          <select v-model="filters.student_card_record_id" @change="loadResults" class="filter-select">
            <option value="">All Students</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }}({{ student.roll_no }})
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-sort-numeric-up"></i> Minimum Marks</label>
          <input
              v-model="filters.min_marks"
              @input="loadResults"
              type="number"
              class="filter-select"
              placeholder="Enter minimum marks"
          />
        </div>

        <div class="filter-item">
          <button @click="clearFilters" class="btn-clear">
            <i class="fa fa-sync-alt"></i>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Table Card -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fa fa-user-graduate"></i> Student</th>
            <th><i class="fa fa-book-open"></i> Term Exam</th>
            <th><i class="fa fa-calendar-alt"></i> Exam Date</th>
            <th><i class="fa fa-star"></i> Marks</th>
            <th><i class="fa fa-percentage"></i> Percentage</th>
            <th><i class="fa fa-check-circle"></i> Result</th>
            <th><i class="fa fa-user-tie"></i> Examiner</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="8" class="loading-cell">
              <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin"></i>
                <span>Loading exam results...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="8" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-inbox"></i>
                <p>No exam results found</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="result in results" :key="result.id" class="table-row">
            <td>
              <div class="student-cell">
                <span class="student-name">
                  {{ result.student_card_record && result.student_card_record.student
                    ? result.student_card_record.student.name
                    : 'N/A' }}
                </span>
                <small v-if="result.student_card_record" class="card-number">
                  Card: {{ result.student_card_record.card_number }}
                </small>
              </div>
            </td>
            <td>
              <span class="structure-badge">
                {{ result.term_exam ? result.term_exam.term_name : 'N/A' }}
              </span>
            </td>
            <td>{{ formatDate(result.exam_date) }}</td>
            <td>
              <span class="marks-display">
                <strong>{{ result.marks_obtained || 0 }}</strong> / {{ result.term_exam ? result.term_exam.total_marks : 0 }}
              </span>
            </td>
            <td>
              <span class="percentage-badge" :class="getPercentageClass(result.percentage)">
                {{ result.percentage || 0 }}%
              </span>
            </td>
            <td>
              <span class="status-badge" :class="result.passed ? 'passed' : 'failed'">
                <i :class="result.passed ? 'fa fa-check-circle' : 'fa fa-times-circle'"></i>
                {{ result.passed ? 'Pass' : 'Fail' }}
              </span>
            </td>
            <td>
              <span class="lecturer-name">
                {{ result.examiner ? result.examiner.name : 'N/A' }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <router-link
                    :to="`/term-exam-results/${result.id}/edit`"
                    class="btn-action btn-edit"
                    title="Edit"
                >
                  <i class="fa fa-edit"></i>
                </router-link>
                <button
                    @click="confirmDelete(result)"
                    class="btn-action btn-delete"
                    title="Delete"
                >
                  <i class="fa fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination -->
      <div class="pagination-wrapper" v-if="pagination.total > 0">
        <div class="pagination-info">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} records
        </div>
        <div class="pagination-controls">
          <button
              @click="changePage(1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
              title="First Page"
          >
            <i class="fa fa-angle-double-left"></i>
          </button>
          <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
          >
            <i class="fa fa-angle-left"></i>
          </button>

          <div class="page-numbers">
            <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="['page-number', { active: page === pagination.current_page }]"
                :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>

          <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
          >
            <i class="fa fa-angle-right"></i>
          </button>
          <button
              @click="changePage(pagination.last_page)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
              title="Last Page"
          >
            <i class="fa fa-angle-double-right"></i>
          </button>
        </div>
        <div class="per-page-selector">
          <select v-model="pagination.per_page" @change="loadResults" class="per-page-select">
            <option value="10">10 / page</option>
            <option value="15">15 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="deleteModal.show" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container small-modal">
          <div class="modal-header danger">
            <div class="modal-title">
              <i class="fa fa-exclamation-triangle"></i>
              <h2>Confirm Delete</h2>
            </div>
            <button @click="closeDeleteModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-form" v-if="deleteModal.result">
            <div class="delete-warning">
              <i class="fa fa-exclamation-circle"></i>
              <p>Are you sure you want to delete this exam result?</p>
              <div class="delete-info">
                <strong>{{ deleteModal.result.term_exam ? deleteModal.result.term_exam.term_name : 'Exam Result' }}</strong>
                <small v-if="deleteModal.result.student_card_record && deleteModal.result.student_card_record.student">
                  Student: {{ deleteModal.result.student_card_record.student.name }}
                </small>
              </div>
              <p class="warning-text">This action cannot be undone!</p>
            </div>

            <div class="modal-actions">
              <button @click="closeDeleteModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button @click="deleteResult" class="btn-delete-confirm" :disabled="deleting">
                <i :class="deleting ? 'fa fa-spinner fa-spin' : 'fa fa-trash-alt'"></i>
                <span>{{ deleting ? 'Deleting...' : 'Delete' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'TermExamResultList',
  data() {
    return {
      results: [],
      term_exams: [],
      students: [],
      loading: false,
      deleting: false,
      filters: {
        term_exam_id: '',
        student_card_record_id: '',
        min_marks: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      },
      deleteModal: {
        show: false,
        result: null
      }
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      const currentPage = this.pagination.current_page;
      const lastPage = this.pagination.last_page;
      const delta = 2;

      let start = Math.max(1, currentPage - delta);
      let end = Math.min(lastPage, currentPage + delta);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < lastPage) {
        if (end < lastPage - 1) pages.push('...');
        pages.push(lastPage);
      }

      return pages.filter((value, index, self) => self.indexOf(value) === index);
    },
    passedCount() {
      return this.results.filter(r => r.passed).length;
    },
    failedCount() {
      return this.results.filter(r => !r.passed).length;
    },
    passRate() {
      if (this.results.length === 0) return 0;
      return Math.round((this.passedCount / this.results.length) * 100);
    },
    failRate() {
      if (this.results.length === 0) return 0;
      return Math.round((this.failedCount / this.results.length) * 100);
    },
    averagePercentage() {
      if (this.results.length === 0) return 0;
      const total = this.results.reduce((sum, r) => sum + (r.percentage || 0), 0);
      return Math.round(total / this.results.length);
    }
  },
  mounted() {
    if (this.$route.query.term_exam_id) {
      this.filters.term_exam_id = this.$route.query.term_exam_id;
    }
    this.loadResults();
    this.loadStudents();
    this.loadTermExams();
  },
  methods: {
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
    async loadResults() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.termExamResults.getAll(params);
        this.results = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load results',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadResults();
      }
    },
    clearFilters() {
      this.filters = {
        term_exam_id: '',
        student_card_record_id: '',
        min_marks: ''
      };
      this.pagination.current_page = 1;
      this.loadResults();
    },
    confirmDelete(result) {
      this.deleteModal = { show: true, result: result };
    },
    async deleteResult() {
      this.deleting = true;
      try {
        await api.termExamResults.delete(this.deleteModal.result.id);
        this.$root.$emit('show-notification', {
          message: 'Result deleted successfully',
          type: 'success'
        });
        this.closeDeleteModal();
        this.loadResults();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete result',
          type: 'danger'
        });
      } finally {
        this.deleting = false;
      }
    },
    closeDeleteModal() {
      this.deleteModal = {
        show: false,
        result: null
      };
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    getPercentageClass(percentage) {
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.term-exam-results-list {
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

.action-buttons-header {
  display: flex;
  gap: 12px;
}

.btn-add {
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

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

.btn-add.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-add.secondary:hover {
  background: white;
  color: #10b981;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-card.blue .stat-icon {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.stat-card.green .stat-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.orange .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.purple .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-info h3 {
  font-size: 36px;
  color: #2d3748;
  font-weight: 700;
  margin: 0;
}

.stat-info p {
  font-size: 14px;
  color: #718096;
  margin: 5px 0 0 0;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.filter-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.filter-item label i {
  color: #667eea;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-clear {
  width: 100%;
  padding: 12px 16px;
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 28px;
}

.btn-clear:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

/* Modern Table Card */
.table-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.modern-table th {
  padding: 18px 15px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.8;
}

.modern-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modern-table tbody tr:hover {
  background: #f7fafc;
}

.modern-table td {
  padding: 18px 15px;
  font-size: 14px;
  color: #2d3748;
}

/* Loading & Empty States */
.loading-cell,
.empty-cell {
  text-align: center;
  padding: 60px 20px !important;
}

.loading-spinner,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #718096;
}

.loading-spinner i,
.empty-state i {
  font-size: 48px;
  opacity: 0.3;
}

/* Table Cell Styles */
.student-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-weight: 600;
  color: #2d3748;
}

.card-number {
  font-size: 12px;
  color: #718096;
  font-family: 'Courier New', monospace;
}

.structure-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #e6fffa;
  color: #047857;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.marks-display {
  color: #2d3748;
}

.marks-display strong {
  color: #667eea;
  font-size: 16px;
}

.percentage-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.percentage-badge.excellent {
  background: #d1fae5;
  color: #065f46;
}

.percentage-badge.good {
  background: #dbeafe;
  color: #1e40af;
}

.percentage-badge.average {
  background: #fef3c7;
  color: #92400e;
}

.percentage-badge.poor {
  background: #fee2e2;
  color: #991b1b;
}

.lecturer-name {
  font-style: italic;
  color: #4a5568;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge.passed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.failed {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-action.btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-action.btn-edit:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-2px);
}

.btn-action.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-action.btn-delete:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
}

/* Modern Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-top: 1px solid #e2e8f0;
  gap: 15px;
  flex-wrap: wrap;
}

.pagination-info {
  color: #4a5568;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 38px;
  height: 38px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-number:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.page-number:disabled {
  cursor: default;
  border-color: transparent;
}

.per-page-selector select {
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.per-page-selector select:focus {
  outline: none;
  border-color: #667eea;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-container.small-modal {
  max-width: 500px;
}

.modal-header {
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.modal-header.danger {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.modal-title i {
  font-size: 28px;
}

.modal-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-form {
  padding: 30px;
}

/* Delete Warning */
.delete-warning {
  text-align: center;
  padding: 20px;
}

.delete-warning > i {
  font-size: 64px;
  color: #e74c3c;
  margin-bottom: 20px;
  display: block;
}

.delete-warning p {
  font-size: 16px;
  color: #2d3748;
  margin: 15px 0;
}

.delete-info {
  padding: 20px;
  background: #fee2e2;
  border-radius: 12px;
  margin: 20px 0;
}

.delete-info strong {
  display: block;
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 5px;
}

.delete-info small {
  font-size: 14px;
  color: #991b1b;
}

.warning-text {
  font-weight: 600;
  color: #e74c3c;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-delete-confirm {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-delete-confirm {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
}

.btn-delete-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .term-exam-results-list {
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

  .action-buttons-header {
    width: 100%;
    flex-direction: column;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .filter-group {
    grid-template-columns: 1fr;
  }

  .btn-clear {
    margin-top: 0;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }

  .pagination-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-delete-confirm {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .term-exam-results-list {
    padding: 15px 10px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .stat-card {
    padding: 15px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

/* Scrollbar Styling */
.table-wrapper::-webkit-scrollbar,
.modal-container::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.table-wrapper::-webkit-scrollbar-track,
.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb,
.modal-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover,
.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>