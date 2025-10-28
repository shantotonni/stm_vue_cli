<template>
  <div class="term-exams-list">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Term Exams</h2>
        <p class="text-muted">Manage term examinations</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/term-exams/create" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>New Term Exam
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <select v-model="filters.card_type_id" @change="loadExams" class="form-select">
              <option value="">All Card Types</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="filters.academic_year_id" @change="loadExams" class="form-select">
              <option value="">All Academic Years</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-4">
            <button @click="clearFilters" class="btn btn-secondary w-100">
              <i class="bi bi-arrow-clockwise me-2"></i>Clear Filters
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
            <th>Term #</th>
            <th>Term Name</th>
            <th>Card Type</th>
            <th>Academic Year</th>
            <th>Exam Date</th>
            <th>Total Marks</th>
            <th>Pass Marks</th>
            <th>Results</th>
            <th class="text-end">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="exams.length === 0">
            <td colspan="9" class="text-center py-4 text-muted">No exams found</td>
          </tr>
          <tr v-for="exam in exams" :key="exam.id">
            <td><strong>{{ exam.term_number }}</strong></td>
            <td>{{ exam.term_name }}</td>
            <td>{{ exam.card_type ? exam.card_type.name : 'N/A' }}</td>
            <td>{{ exam.academic_year ? exam.academic_year.name : 'N/A' }}</td>
            <td>{{ formatDate(exam.exam_date) }}</td>
            <td>{{ exam.total_marks || 0 }}</td>
            <td>{{ exam.pass_marks || 0 }}</td>
            <td>
                <span class="badge bg-info">
                  {{ exam.student_results ? exam.student_results.length : 0 }} students
                </span>
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <router-link :to="`/term-exams/${exam.id}/edit`" class="btn btn-warning" title="Edit">
                  <i class="bi bi-pencil"></i>
                </router-link>
                <router-link :to="`/term-exam-results?term_exam_id=${exam.id}`" class="btn btn-info" title="View Results">
                  <i class="bi bi-eye"></i>
                </router-link>
                <button @click="confirmDelete(exam)" class="btn btn-danger" title="Delete">
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
            Are you sure you want to delete this term exam?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteModal.show = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteExam">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'TermExamList',
  data() {
    return {
      exams: [],
      loading: false,
      filters: {
        card_type_id: '',
        academic_year_id: ''
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
        exam: null
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
    this.loadExams();
  },
  methods: {
    async loadExams() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.termExams.getAll(params);
        this.exams = response.data.data;
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
          message: 'Failed to load exams',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadExams();
      }
    },
    clearFilters() {
      this.filters = {
        card_type_id: '',
        academic_year_id: ''
      };
      this.pagination.current_page = 1;
      this.loadExams();
    },
    confirmDelete(exam) {
      this.deleteModal = { show: true, exam: exam };
    },
    async deleteExam() {
      try {
        await api.termExams.delete(this.deleteModal.exam.id);
        this.$root.$emit('show-notification', {
          message: 'Term exam deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadExams();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete exam',
          type: 'danger'
        });
      }
    }
  }
};
</script>