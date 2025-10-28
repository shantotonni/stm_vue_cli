<template>
  <div class="attendance-list">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Attendance Management</h2>
        <p class="text-muted">Track and manage student attendance</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/attendance/bulk-mark" class="btn btn-success me-2">
          <i class="bi bi-list-check me-2"></i>Bulk Mark
        </router-link>
        <router-link to="/attendance/create" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Mark Attendance
        </router-link>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Student</label>
            <select v-model="filters.student_id" @change="loadAttendance" class="form-select">
              <option value="">All Students</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Class Type</label>
            <select v-model="filters.class_type" @change="loadAttendance" class="form-select">
              <option value="">All Types</option>
              <option value="lecture">Lecture</option>
              <option value="tutorial">Tutorial</option>
              <option value="practical">Practical</option>
              <option value="demonstration">Demonstration</option>
              <option value="integrated">Integrated</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Status</label>
            <select v-model="filters.status" @change="loadAttendance" class="form-select">
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Start Date</label>
            <input
                v-model="filters.start_date"
                @change="loadAttendance"
                type="date"
                class="form-control"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">End Date</label>
            <input
                v-model="filters.end_date"
                @change="loadAttendance"
                type="date"
                class="form-control"
            />
          </div>
          <div class="col-md-1 d-flex align-items-end">
            <button @click="clearFilters" class="btn btn-secondary w-100">
              <i class="bi bi-arrow-clockwise"></i>
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

    <!-- Attendance Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Class Type</th>
            <th>Topic</th>
            <th>Status</th>
            <th>Conducted By</th>
            <th class="text-end">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="attendance.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">
              No attendance records found
            </td>
          </tr>
          <tr v-for="record in attendance" :key="record.id">
            <td>
              <strong>{{ formatDate(record.class_date) }}</strong>
            </td>
            <td>{{ record.student ? record.student.name : 'N/A' }}</td>
            <td>
                <span class="badge bg-info">
                  {{ formatClassType(record.class_type) }}
                </span>
            </td>
            <td>{{ record.class_topic || '-' }}</td>
            <td>
                <span class="badge" :class="getStatusBadgeClass(record.status)">
                  {{ formatStatus(record.status) }}
                </span>
            </td>
            <td>
              {{ record.conducted_by ? record.conducted_by.name : 'N/A' }}
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <router-link
                    :to="`/attendance/${record.id}/edit`"
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

    <!-- Delete Modal -->
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
            Are you sure you want to delete this attendance record?
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
  name: 'AttendanceList',
  data() {
    return {
      attendance: [],
      loading: false,
      filters: {
        student_id: '',
        class_type: '',
        status: '',
        start_date: '',
        end_date: ''
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

      if (currentPage - delta > 2) pages.unshift('...');
      if (currentPage + delta < lastPage - 1) pages.push('...');

      pages.unshift(1);
      if (lastPage !== 1) pages.push(lastPage);

      return pages.filter((value, index, self) => self.indexOf(value) === index);
    }
  },
  mounted() {
    this.loadAttendance();
  },
  methods: {
    async loadAttendance() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.attendance.getAll(params);
        this.attendance = response.data.data;
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
          message: 'Failed to load attendance records',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadAttendance();
      }
    },
    clearFilters() {
      this.filters = {
        student_id: '',
        class_type: '',
        status: '',
        start_date: '',
        end_date: ''
      };
      this.pagination.current_page = 1;
      this.loadAttendance();
    },
    confirmDelete(record) {
      this.deleteModal = {
        show: true,
        record: record
      };
    },
    async deleteRecord() {
      try {
        await api.attendance.delete(this.deleteModal.record.id);
        this.$root.$emit('show-notification', {
          message: 'Attendance record deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadAttendance();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete record',
          type: 'danger'
        });
      }
    },
    getStatusBadgeClass(status) {
      const classes = {
        present: 'bg-success',
        absent: 'bg-danger',
        late: 'bg-warning',
        excused: 'bg-info'
      };
      return classes[status] || 'bg-secondary';
    },
    formatStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    formatClassType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
};
</script>