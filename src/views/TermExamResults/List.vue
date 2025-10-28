<template>
  <div class="term-exam-results-list">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Term Exam Results</h2>
        <p class="text-muted">Manage student exam results</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/term-exam-results/bulk" class="btn btn-success me-2">
          <i class="bi bi-list-check me-2"></i>Bulk Entry
        </router-link>
        <router-link to="/term-exam-results/create" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Add Result
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select v-model="filters.term_exam_id" @change="loadResults" class="form-select">
              <option value="">All Term Exams</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.student_card_record_id" @change="loadResults" class="form-select">
              <option value="">All Students</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-3">
            <input v-model="filters.min_marks" @input="loadResults" type="number" class="form-control" placeholder="Min Marks" />
          </div>
          <div class="col-md-3">
            <button @click="clearFilters" class="btn btn-secondary w-100">
              <i class="bi bi-arrow-clockwise me-2"></i>Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
          <tr>
            <th>Student</th>
            <th>Term Exam</th>
            <th>Exam Date</th>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
            <th>Percentage</th>
            <th>Result</th>
            <th>Examiner</th>
            <th class="text-end">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="results.length === 0">
            <td colspan="9" class="text-center py-4 text-muted">No results found</td>
          </tr>
          <tr v-for="result in results" :key="result.id">
            <td>
              <strong>{{ result.student_card_record && result.student_card_record.student ? result.student_card_record.student.name : 'N/A' }}</strong>
            </td>
            <td>{{ result.term_exam ? result.term_exam.term_name : 'N/A' }}</td>
            <td>{{ formatDate(result.exam_date) }}</td>
            <td>{{ result.marks_obtained || 0 }}</td>
            <td>{{ result.term_exam ? result.term_exam.total_marks : 0 }}</td>
            <td>
              <strong>{{ result.percentage || 0 }}%</strong>
            </td>
            <td>
                <span class="badge" :class="result.passed ? 'bg-success' : 'bg-danger'">
                  {{ result.passed ? 'Pass' : 'Fail' }}
                </span>
            </td>
            <td>{{ result.examiner ? result.examiner.name : 'N/A' }}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <router-link :to="`/term-exam-results/${result.id}/edit`" class="btn btn-warning">
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button @click="confirmDelete(result)" class="btn btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="card-footer">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0 text-muted">
              Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} records
            </p>
          </div>
          <div class="col-md-6">
            <nav>
              <ul class="pagination pagination-sm mb-0 justify-content-end">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <a class="page-link" @click.prevent="changePage(pagination.current_page - 1)" href="#">Previous</a>
                </li>
                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
                  <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <a class="page-link" @click.prevent="changePage(pagination.current_page + 1)" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteModal.show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="deleteModal.show = false"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this exam result?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteModal.show = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteResult">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'TermExamResultList',
  data() {
    return {
      results: [],
      loading: false,
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

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(lastPage - 1, currentPage + delta); i++) {
        pages.push(i);
      }

      if (currentPage - delta > 2) pages.unshift('...');
      if (currentPage + delta < lastPage - 1) pages.push('...');

      pages.unshift(1);
      if (lastPage !== 1) pages.push(lastPage);

      return pages.filter((value, index, self) => self.indexOf(value) === index);
    }
  },
  mounted() {
    // Check for query parameters
    if (this.$route.query.term_exam_id) {
      this.filters.term_exam_id = this.$route.query.term_exam_id;
    }
    this.loadResults();
  },
  methods: {
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
      try {
        await api.termExamResults.delete(this.deleteModal.result.id);
        this.$root.$emit('show-notification', {
          message: 'Result deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadResults();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete result',
          type: 'danger'
        });
      }
    }
  }
};
</script>