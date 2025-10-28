<template>
  <div class="student-structure-progress-list">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Student Structure Progress</h2>
        <p class="text-muted">Track student learning progress</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/student-structure-progress/create" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Add Progress
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select v-model="filters.student_card_record_id" @change="loadProgress" class="form-select">
              <option value="">All Card Records</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.structure_level_id" @change="loadProgress" class="form-select">
              <option value="">All Structure Levels</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.is_completed" @change="loadProgress" class="form-select">
              <option value="">All Status</option>
              <option value="1">Completed</option>
              <option value="0">In Progress</option>
            </select>
          </div>
          <div class="col-md-3">
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
            <th>Student</th>
            <th>Structure Level</th>
            <th>Date Started</th>
            <th>Date Examined</th>
            <th>Marks</th>
            <th>Percentage</th>
            <th>Lecturer</th>
            <th>Status</th>
            <th class="text-end">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="progressList.length === 0">
            <td colspan="9" class="text-center py-4 text-muted">No progress records found</td>
          </tr>
          <tr v-for="progress in progressList" :key="progress.id">
            <td>{{ progress.student_card_record && progress.student_card_record.student ? progress.student_card_record.student.name : 'N/A' }}</td>
            <td>{{ progress.structure_level ? progress.structure_level.title : 'N/A' }}</td>
            <td>{{ formatDate(progress.date_of_beginning) }}</td>
            <td>{{ formatDate(progress.date_of_examination) }}</td>
            <td>{{ progress.marks_obtained || 0 }} / {{ progress.max_marks || 0 }}</td>
            <td>
              <strong>{{ calculatePercentage(progress.marks_obtained, progress.max_marks) }}%</strong>
            </td>
            <td>{{ progress.lecturer ? progress.lecturer.name : 'N/A' }}</td>
            <td>
                <span class="badge" :class="progress.is_completed ? 'bg-success' : 'bg-warning'">
                  {{ progress.is_completed ? 'Completed' : 'In Progress' }}
                </span>
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <router-link :to="`/student-structure-progress/${progress.id}/edit`" class="btn btn-warning">
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button v-if="!progress.is_completed" @click="showCompleteModal(progress)" class="btn btn-success" title="Mark Complete">
                  <i class="bi bi-check-circle"></i>
                </button>
                <button @click="confirmDelete(progress)" class="btn btn-danger">
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

    <!-- Complete Modal -->
    <div v-if="completeModal.show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Mark as Completed</h5>
            <button type="button" class="btn-close" @click="completeModal.show = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Marks Obtained *</label>
              <input v-model.number="completeModal.marks_obtained" type="number" step="0.01" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Examination Date *</label>
              <input v-model="completeModal.date_of_examination" type="date" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Remarks</label>
              <textarea v-model="completeModal.remarks" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="completeModal.show = false">Cancel</button>
            <button type="button" class="btn btn-success" @click="markComplete">Mark Complete</button>
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
            Are you sure you want to delete this progress record?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteModal.show = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteProgress">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'StudentStructureProgressList',
  data() {
    return {
      progressList: [],
      loading: false,
      filters: {
        student_card_record_id: '',
        structure_level_id: '',
        is_completed: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      },
      completeModal: {
        show: false,
        progress: null,
        marks_obtained: 0,
        date_of_examination: '',
        remarks: ''
      },
      deleteModal: {
        show: false,
        progress: null
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
    this.loadProgress();
  },
  methods: {
    async loadProgress() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.studentStructureProgress.getAll(params);
        this.progressList = response.data.data;
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
          message: 'Failed to load progress records',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadProgress();
      }
    },
    clearFilters() {
      this.filters = {
        student_card_record_id: '',
        structure_level_id: '',
        is_completed: ''
      };
      this.pagination.current_page = 1;
      this.loadProgress();
    },
    showCompleteModal(progress) {
      this.completeModal = {
        show: true,
        progress: progress,
        marks_obtained: progress.marks_obtained || 0,
        date_of_examination: new Date().toISOString().split('T')[0],
        remarks: progress.remarks || ''
      };
    },
    async markComplete() {
      try {
        await api.studentStructureProgress.markCompleted(this.completeModal.progress.id, {
          marks_obtained: this.completeModal.marks_obtained,
          date_of_examination: this.completeModal.date_of_examination,
          remarks: this.completeModal.remarks
        });
        this.$root.$emit('show-notification', {
          message: 'Progress marked as completed',
          type: 'success'
        });
        this.completeModal.show = false;
        this.loadProgress();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to mark as complete',
          type: 'danger'
        });
      }
    },
    confirmDelete(progress) {
      this.deleteModal = { show: true, progress: progress };
    },
    async deleteProgress() {
      try {
        await api.studentStructureProgress.delete(this.deleteModal.progress.id);
        this.$root.$emit('show-notification', {
          message: 'Progress record deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadProgress();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete record',
          type: 'danger'
        });
      }
    },
    calculatePercentage(obtained, max) {
      if (max > 0) {
        return Math.round((obtained / max) * 100);
      }
      return 0;
    }
  }
};
</script>