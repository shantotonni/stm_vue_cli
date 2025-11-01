<template>
  <div class="student-card-records">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-id-card-alt"></i>
          </div>
          <div>
            <h1>Student Card Records</h1>
            <p class="subtitle">Manage and track all student card records efficiently</p>
          </div>
        </div>
        <router-link to="/student-card-records/create" class="btn-add">
          <i class="fa fa-plus-circle"></i>
          <span>New Card Record</span>
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards" v-if="statistics">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa fa-clipboard-list"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.total_records || 0 }}</h3>
          <p>Total Records</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.completed || 0 }}</h3>
          <p>Completed</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fa fa-spinner"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.in_progress || 0 }}</h3>
          <p>In Progress</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">
          <i class="fa fa-times-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.failed || 0 }}</h3>
          <p>Failed</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-container">
        <i class="fa fa-search search-icon"></i>
        <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search by card number or student name..."
            class="search-input"
        />
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label><i class="fa fa-info-circle"></i> Status</label>
          <select v-model="filters.status" @change="loadRecords" class="filter-select">
            <option value="">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-id-card"></i> Card Type</label>
          <select v-model="filters.card_type_id" @change="loadRecords" class="filter-select">
            <option value="">All Card Types</option>
            <option v-for="type in cardTypes" :key="type.id" :value="type.id">
              {{ type.card_name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-calendar"></i> Academic Year</label>
          <select v-model="filters.academic_year_id" @change="loadRecords" class="filter-select">
            <option value="">All Years</option>
            <option v-for="year in academicYears" :key="year.id" :value="year.id">
              {{ year.name }}
            </option>
          </select>
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
            <th><i class="fa fa-barcode"></i> Card Number</th>
            <th><i class="fa fa-user-graduate"></i> Student</th>
            <th><i class="fa fa-id-card"></i> Card Type</th>
            <th><i class="fa fa-calendar-alt"></i> Academic Year</th>
            <th><i class="fa fa-info-circle"></i> Status</th>
            <th><i class="fa fa-star"></i> Total Marks</th>
            <th><i class="fa fa-chart-line"></i> Attendance</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="8" class="loading-cell">
              <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin"></i>
                <span>Loading records...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="records.length === 0">
            <td colspan="8" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-inbox"></i>
                <p>No records found</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="record in records" :key="record.id" class="table-row">
            <td>
              <span class="card-number-badge">{{ record.card_number || 'N/A' }}</span>
            </td>
            <td>
              <div class="student-cell">
                <span class="student-name">{{ record.student ? record.student.name : 'N/A' }}</span>
                <small v-if="record.student && record.student.roll" class="student-roll">
                  Roll: {{ record.student.roll }}
                </small>
              </div>
            </td>
            <td>
                <span class="card-type-badge">
                  {{ record.card_type ? record.card_type.card_name : 'N/A' }}
                </span>
            </td>
            <td>
                <span class="year-badge">
                  {{ record.academic_year ? record.academic_year.name : 'N/A' }}
                </span>
            </td>
            <td>
                <span class="status-badge" :class="getStatusClass(record.status)">
                  {{ formatStatus(record.status) }}
                </span>
            </td>
            <td>
                <span class="marks-display">
                  <i class="fa fa-star"></i>
                  {{ record.total_marks_obtained || 0 }}
                </span>
            </td>
            <td>
                <span class="attendance-display" :class="getAttendanceClass(record.attendance_percentage)">
                  <i class="fa fa-chart-line"></i>
                  {{ record.attendance_percentage || 0 }}%
                </span>
            </td>
            <td>
              <div class="action-buttons">
                <router-link
                    :to="`/student-card-records/${record.id}`"
                    class="btn-action btn-view"
                    title="View"
                >
                  <i class="fa fa-eye"></i>
                </router-link>
                <router-link
                    :to="`/student-card-records/${record.id}/edit`"
                    class="btn-action btn-edit"
                    title="Edit"
                >
                  <i class="fa fa-edit"></i>
                </router-link>
                <button
                    @click="confirmDelete(record)"
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
          <select v-model="pagination.per_page" @change="loadRecords" class="per-page-select">
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

          <div class="modal-form" v-if="deleteModal.record">
            <div class="delete-warning">
              <i class="fa fa-exclamation-circle"></i>
              <p>Are you sure you want to delete this card record?</p>
              <div class="delete-info">
                <strong>{{ deleteModal.record.card_number || 'Card Record' }}</strong>
                <small v-if="deleteModal.record.student">
                  Student: {{ deleteModal.record.student.name }}
                </small>
              </div>
              <p class="warning-text">This action cannot be undone!</p>
            </div>

            <div class="modal-actions">
              <button @click="closeDeleteModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button @click="deleteRecord" class="btn-delete-confirm" :disabled="deleting">
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
import cardTypeService from '../Admin/card-type/cardTypeService';

export default {
  name: 'StudentCardRecordList',
  data() {
    return {
      records: [],
      cardTypes: [],
      academicYears: [],
      statistics: null,
      loading: false,
      deleting: false,
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
      },
      searchTimeout: null
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
    }
  },
  mounted() {
    this.loadCardTypes();
    this.loadAcademicYears();
    this.loadRecords();
    //this.loadStatistics();
  },
  methods: {
    async loadCardTypes() {
      try {
        const response = await cardTypeService.getAll({ per_page: 100, is_active: 1 });
        this.cardTypes = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card types:', error);
      }
    },

    async loadAcademicYears() {
      try {
        const response = await this.$api.get('/get-academic-year');
        this.academicYears = response.data;
      } catch (error) {
        console.error('Failed to load stats');
      }
    },

    async loadStatistics() {
      try {
        const response = await api.studentCardRecords.getStatistics();
        this.statistics = response.data;
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.loadRecords();
      }, 500);
    },

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
      this.deleting = true;
      try {
        await api.studentCardRecords.delete(this.deleteModal.record.id);
        this.$root.$emit('show-notification', {
          message: 'Record deleted successfully',
          type: 'success'
        });
        this.closeDeleteModal();
        this.loadRecords();
        this.loadStatistics();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete record',
          type: 'danger'
        });
      } finally {
        this.deleting = false;
      }
    },

    closeDeleteModal() {
      this.deleteModal = {
        show: false,
        record: null
      };
    },

    getStatusClass(status) {
      const classes = {
        not_started: 'status-not-started',
        in_progress: 'status-in-progress',
        completed: 'status-completed',
        failed: 'status-failed'
      };
      return classes[status] || 'status-not-started';
    },

    getAttendanceClass(percentage) {
      if (percentage >= 75) return 'attendance-good';
      if (percentage >= 50) return 'attendance-average';
      return 'attendance-poor';
    },

    formatStatus(status) {
      return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.student-card-records {
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

.stat-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.red {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
.card-number-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.student-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-weight: 600;
  color: #2d3748;
}

.student-roll {
  font-size: 12px;
  color: #718096;
}

.card-type-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #e6fffa;
  color: #047857;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.year-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-not-started {
  background: #e2e8f0;
  color: #4a5568;
}

.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

/* Marks & Attendance Display */
.marks-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.marks-display i {
  font-size: 12px;
}

.attendance-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.attendance-display i {
  font-size: 12px;
}

.attendance-good {
  background: #d1fae5;
  color: #065f46;
}

.attendance-average {
  background: #fef3c7;
  color: #92400e;
}

.attendance-poor {
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

.btn-action.btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.btn-action.btn-view:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  .student-card-records {
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

  .table-card {
    margin: 0 -20px;
    border-radius: 0;
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
  .student-card-records {
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