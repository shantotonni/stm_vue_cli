<template>
  <div class="student-card-records">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Student Card Records</h2>
        <p class="text-muted">Manage all student card records</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/student-card-records/create" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>New Card Record
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <input
                v-model="filters.search"
                @input="loadRecords"
                type="text"
                class="form-control"
                placeholder="Search by card number or student name..."
            />
          </div>
          <div class="col-md-3">
            <select v-model="filters.status" @change="loadRecords" class="form-select">
              <option value="">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.card_type_id" @change="loadRecords" class="form-select">
              <option value="">All Card Types</option>
              <!-- This should be dynamically populated -->
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Records Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
          <tr>
            <th>Card Number</th>
            <th>Student</th>
            <th>Card Type</th>
            <th>Academic Year</th>
            <th>Status</th>
            <th>Total Marks</th>
            <th>Attendance %</th>
            <th class="text-end">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="records.length === 0">
            <td colspan="8" class="text-center py-4 text-muted">
              No records found
            </td>
          </tr>
          <tr v-for="record in records" :key="record.id">
            <td>
              <strong>{{ record.card_number || 'N/A' }}</strong>
            </td>
            <td>
              {{ record.student ? record.student.name : 'N/A' }}
            </td>
            <td>
              {{ record.card_type ? record.card_type.name : 'N/A' }}
            </td>
            <td>
              {{ record.academic_year ? record.academic_year.name : 'N/A' }}
            </td>
            <td>
                <span
                    class="badge"
                    :class="getStatusClass(record.status)"
                >
                  {{ formatStatus(record.status) }}
                </span>
            </td>
            <td>{{ record.total_marks_obtained || 0 }}</td>
            <td>{{ record.attendance_percentage || 0 }}%</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <router-link
                    :to="`/student-card-records/${record.id}`"
                    class="btn btn-info"
                    title="View"
                >
                  <i class="bi bi-eye"></i>
                </router-link>
                <router-link
                    :to="`/student-card-records/${record.id}/edit`"
                    class="btn btn-warning"
                    title="Edit"
                >
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button
                    @click="confirmDelete(record)"
                    class="btn btn-danger"
                    title="Delete"
                >
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
                  <a class="page-link" @click.prevent="changePage(pagination.current_page - 1)" href="#">
                    Previous
                  </a>
                </li>
                <li
                    v-for="page in visiblePages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pagination.current_page }"
                >
                  <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
                </li>
                <li
                    class="page-item"
                    :class="{ disabled: pagination.current_page === pagination.last_page }"
                >
                  <a class="page-link" @click.prevent="changePage(pagination.current_page + 1)" href="#">
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
        v-if="deleteModal.show"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="deleteModal.show = false"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this card record?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteModal.show = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteRecord">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'StudentCardRecordList',
  data() {
    return {
      records: [],
      loading: false,
      filters: {
        search: '',
        status: '',
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
        record: null
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

      if (currentPage - delta > 2) {
        pages.unshift('...');
      }
      if (currentPage + delta < lastPage - 1) {
        pages.push('...');
      }

      pages.unshift(1);
      if (lastPage !== 1) {
        pages.push(lastPage);
      }

      return pages.filter((value, index, self) => self.indexOf(value) === index);
    }
  },
  mounted() {
    this.loadRecords();
  },
  methods: {
    async loadRecords() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.studentCardRecords.getAll(params);
        this.records = response.data.data;
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
          message: 'Failed to load records',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadRecords();
      }
    },
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        card_type_id: '',
        academic_year_id: ''
      };
      this.pagination.current_page = 1;
      this.loadRecords();
    },
    confirmDelete(record) {
      this.deleteModal = {
        show: true,
        record: record
      };
    },
    async deleteRecord() {
      try {
        await api.studentCardRecords.delete(this.deleteModal.record.id);
        this.$root.$emit('show-notification', {
          message: 'Record deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadRecords();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete record',
          type: 'danger'
        });
      }
    },
    getStatusClass(status) {
      const classes = {
        not_started: 'bg-secondary',
        in_progress: 'bg-info',
        completed: 'bg-success',
        failed: 'bg-danger'
      };
      return classes[status] || 'bg-secondary';
    },
    formatStatus(status) {
      return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
};
</script>

<style scoped>
.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>