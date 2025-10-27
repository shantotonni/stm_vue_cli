<template>
  <div class="student-management">
    <!-- Top Header with Stats -->
    <div class="page-header-section">
      <div class="header-content">
        <div class="title-area">
          <h1 class="main-title">
            <span class="icon-wrapper">
              <i class="fas fa-users"></i>
            </span>
            Students Management
          </h1>
          <p class="subtitle">Manage and monitor all student records</p>
        </div>

        <button @click="openCreateModal" class="btn-add-new">
          <i class="fas fa-plus-circle"></i>
          <span>Add New Student</span>
        </button>
      </div>

      <!-- Quick Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon">
            <i class="fas fa-user-graduate"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Students</p>
            <h3 class="stat-value">{{ students.total || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card stat-success">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Active Students</p>
            <h3 class="stat-value">{{ activeCount }}</h3>
          </div>
        </div>

        <div class="stat-card stat-info">
          <div class="stat-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Departments</p>
            <h3 class="stat-value">{{ departments.length }}</h3>
          </div>
        </div>

        <div class="stat-card stat-warning">
          <div class="stat-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-info">
            <p class="stat-label">Current Session</p>
            <h3 class="stat-value">2024-25</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-section">
      <div class="filter-card">
        <div class="filter-header">
          <h3 class="filter-title">
            <i class="fas fa-filter"></i>
            Search & Filter
          </h3>
          <button @click="resetFilters" class="btn-reset">
            <i class="fas fa-redo"></i>
            <span class="reset-text">Reset</span>
          </button>
        </div>

        <div class="filter-grid">
          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-search"></i>
              Search Students
            </label>
            <input
                v-model="filters.search"
                @input="debounceSearch"
                type="text"
                class="filter-input"
                placeholder="Search by name, ID, roll number..."
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-building"></i>
              Department
            </label>
            <select v-model="filters.department_id" @change="fetchStudents" class="filter-select">
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-graduation-cap"></i>
              Academic Year
            </label>
            <select v-model="filters.year" @change="fetchStudents" class="filter-select">
              <option value="">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="5th">5th Year</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-toggle-on"></i>
              Status
            </label>
            <select v-model="filters.status" @change="fetchStudents" class="filter-select">
              <option value="">All Status</option>
              <option value="Y">Active</option>
              <option value="N">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading students data...</p>
      </div>
    </div>

    <!-- Students Table -->
    <div v-else class="data-table-section">
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-list"></i>
            <span>Student Records</span>
          </h3>
          <div class="table-actions">
            <button class="btn-icon-action" title="Export to Excel">
              <i class="fas fa-file-excel"></i>
            </button>
            <button class="btn-icon-action" title="Export to PDF">
              <i class="fas fa-file-pdf"></i>
            </button>
            <button class="btn-icon-action" title="Print">
              <i class="fas fa-print"></i>
            </button>
          </div>
        </div>

        <div class="table-container" >
          <table class="data-table">
            <thead>
            <tr>
              <th @click="sortBy('student_id_number')" class="sortable">
                <div class="th-content">
                  <i class="fas fa-id-badge"></i>
                  <span class="th-text">Student ID</span>
                  <span class="sort-indicator" v-if="sortField === 'student_id_number'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                </div>
              </th>
              <th @click="sortBy('name')" class="sortable">
                <div class="th-content">
                  <i class="fas fa-user"></i>
                  <span class="th-text">Student Name</span>
                  <span class="sort-indicator" v-if="sortField === 'name'">
                      <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                    </span>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <i class="fas fa-hashtag"></i>
                  <span class="th-text">Roll No</span>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <i class="fas fa-building"></i>
                  <span class="th-text">Department</span>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <i class="fas fa-layer-group"></i>
                  <span class="th-text">Year</span>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <i class="fas fa-calendar"></i>
                  <span class="th-text">Semester</span>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <i class="fas fa-phone"></i>
                  <span class="th-text">Mobile</span>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <i class="fas fa-info-circle"></i>
                  <span class="th-text">Status</span>
                </div>
              </th>
              <th class="text-center">
                <div class="th-content">
                  <i class="fas fa-cog"></i>
                  <span class="th-text">Actions</span>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="student in students.data" :key="student.id" class="table-row">
              <td data-label="Student ID">
                <div class="student-id-badge">
                  {{ student.student_id_number }}
                </div>
              </td>
              <td data-label="Name">
                <div class="student-profile">
                  <div class="student-avatar">
                    {{ getInitials(student.name) }}
                  </div>
                  <div class="student-details">
                    <span class="student-name">{{ student.name }}</span>
                    <span class="student-session">{{ student.session }}</span>
                  </div>
                </div>
              </td>
              <td data-label="Roll No">
                <span class="roll-number">{{ student.roll_no }}</span>
              </td>
              <td data-label="Department">
                  <span class="department-name">
                    {{ student.department ? student.department.name : 'N/A' }}
                  </span>
              </td>
              <td data-label="Year">
                  <span class="year-badge">
                    <i class="fas fa-graduation-cap"></i>
                    {{ student.year }}
                  </span>
              </td>
              <td data-label="Semester">
                  <span class="semester-badge">
                    <i class="fas fa-book"></i>
                    {{ student.semester }}
                  </span>
              </td>
              <td data-label="Mobile">
                <span class="mobile-text">{{ student.mobile || 'N/A' }}</span>
              </td>
              <td data-label="Status">
                  <span :class="['status-pill', student.status === 'Y' ? 'status-active' : 'status-inactive']">
                    <i :class="student.status === 'Y' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                    {{ student.status === 'Y' ? 'Active' : 'Inactive' }}
                  </span>
              </td>
              <td data-label="Actions">
                <div class="action-buttons-group">
                  <button @click="viewStudent(student.id)" class="action-btn view-btn" title="View Details">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="editStudent(student.id)" class="action-btn edit-btn" title="Edit Student">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDelete(student.id)" class="action-btn delete-btn" title="Delete Student">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            <i class="fas fa-info-circle"></i>
            <span class="pagination-text">
              Showing <strong>{{ students.from }}</strong> to <strong>{{ students.to }}</strong> of <strong>{{ students.total }}</strong> students
            </span>
          </div>
          <div class="pagination-controls">
            <button
                @click="changePage(students.current_page - 1)"
                :disabled="!students.prev_page_url"
                class="pagination-btn prev-btn"
            >
              <i class="fas fa-chevron-left"></i>
              <span class="btn-text">Previous</span>
            </button>

            <div class="page-numbers">
              <button
                  v-for="page in paginationPages"
                  :key="page"
                  @click="changePage(page)"
                  :class="['page-btn', { 'active': page === students.current_page }]"
              >
                {{ page }}
              </button>
            </div>

            <button
                @click="changePage(students.current_page + 1)"
                :disabled="!students.next_page_url"
                class="pagination-btn next-btn"
            >
              <span class="btn-text">Next</span>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentList',

  data() {
    return {
      students: {
        data: [],
        total: 0,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0
      },
      departments: [],
      loading: false,
      filters: {
        search: '',
        department_id: '',
        year: '',
        status: ''
      },
      sortField: 'created_at',
      sortOrder: 'desc',
      debounceTimer: null
    };
  },

  computed: {
    paginationPages() {
      const pages = [];
      const current = this.students.current_page;
      const last = this.students.last_page;

      for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
        pages.push(i);
      }

      return pages;
    },

    activeCount() {
      return this.students.data.filter(s => s.status === 'Y').length;
    }
  },

  mounted() {
    this.fetchStudents();
    this.fetchDepartments();
  },

  methods: {
    async fetchStudents(page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          search: this.filters.search,
          department_id: this.filters.department_id,
          year: this.filters.year,
          status: this.filters.status,
          sort_by: this.sortField,
          sort_order: this.sortOrder,
          per_page: 15
        };

        const response = await this.$api.get('/students', { params });
        this.students = response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        this.$toasted.error('Failed to load students');
      } finally {
        this.loading = false;
      }
    },

    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.fetchStudents();
      }, 500);
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }
      this.fetchStudents();
    },

    changePage(page) {
      if (page >= 1 && page <= this.students.last_page) {
        this.fetchStudents(page);
      }
    },

    resetFilters() {
      this.filters = {
        search: '',
        department_id: '',
        year: '',
        status: ''
      };
      this.fetchStudents();
    },

    openCreateModal() {
      this.$router.push({ name: 'StudentCreate' });
    },

    viewStudent(id) {
      this.$router.push({ name: 'StudentShow', params: { id } });
    },

    editStudent(id) {
      this.$router.push({ name: 'StudentEdit', params: { id } });
    },

    async confirmDelete(id) {
      if (confirm('Are you sure you want to delete this student?')) {
        try {
          await this.$api.delete(`/api/students/${id}`);
          this.$toasted.success('Student deleted successfully');
          this.fetchStudents();
        } catch (error) {
          console.error('Error deleting student:', error);
          this.$toasted.error('Failed to delete student');
        }
      }
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.student-management {
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* ===== Page Header Section ===== */
.page-header-section {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.title-area {
  flex: 1;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.subtitle {
  font-size: 15px;
  color: #718096;
  margin: 0;
}

.btn-add-new {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-add-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* ===== Stats Grid ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-primary { border-left-color: #667eea; }
.stat-success { border-left-color: #10b981; }
.stat-info { border-left-color: #3b82f6; }
.stat-warning { border-left-color: #f59e0b; }

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-primary .stat-icon {
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
}

.stat-success .stat-icon {
  background: linear-gradient(135deg, #10b98120 0%, #10b98120 100%);
  color: #10b981;
}

.stat-info .stat-icon {
  background: linear-gradient(135deg, #3b82f620 0%, #3b82f620 100%);
  color: #3b82f6;
}

.stat-warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b20 0%, #f59e0b20 100%);
  color: #f59e0b;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 6px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* ===== Filter Section ===== */
.filter-section {
  margin-bottom: 30px;
}

.filter-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-reset {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  background: #e2e8f0;
  color: #475569;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-input,
.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* ===== Loading State ===== */
.loading-wrapper {
  background: white;
  border-radius: 16px;
  padding: 80px 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f1f5f9;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Data Table Section ===== */
.data-table-section {
  margin-bottom: 30px;
}

.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  flex-wrap: wrap;
  gap: 12px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.btn-icon-action {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #64748b;
  transition: all 0.2s ease;
}

.btn-icon-action:hover {
  background: #f8fafc;
  border-color: #667eea;
  color: #667eea;
}

.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.data-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
}

.data-table th {
  padding: 16px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  border-bottom: 2px solid #e2e8f0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.sortable:hover {
  background: #e2e8f0;
}

.sort-indicator {
  color: #667eea;
  font-size: 14px;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table td {
  padding: 18px 20px;
  font-size: 14px;
  color: #334155;
}

.student-id-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
  font-weight: 700;
  font-size: 13px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  border: 2px solid #667eea30;
}

.student-profile {
  display: flex;
  align-items: center;
  gap: 14px;
}

.student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.student-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.student-session {
  font-size: 12px;
  color: #94a3b8;
}

.roll-number {
  font-weight: 600;
  color: #475569;
}

.department-name {
  color: #64748b;
  font-weight: 500;
}

.year-badge,
.semester-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.year-badge {
  background: linear-gradient(135deg, #10b98115 0%, #10b98115 100%);
  color: #059669;
  border: 2px solid #10b98130;
}

.semester-badge {
  background: linear-gradient(135deg, #f59e0b15 0%, #f59e0b15 100%);
  color: #d97706;
  border: 2px solid #f59e0b30;
}

.email-text,
.mobile-text {
  color: #64748b;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status-active {
  background: linear-gradient(135deg, #10b98115 0%, #10b98115 100%);
  color: #059669;
  border: 2px solid #10b98130;
}

.status-inactive {
  background: linear-gradient(135deg, #ef444415 0%, #ef444415 100%);
  color: #dc2626;
  border: 2px solid #ef444430;
}

.action-buttons-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.view-btn {
  background: linear-gradient(135deg, #3b82f615 0%, #3b82f615 100%);
  color: #2563eb;
  border: 2px solid #3b82f630;
}

.view-btn:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.edit-btn {
  background: linear-gradient(135deg, #f59e0b15 0%, #f59e0b15 100%);
  color: #d97706;
  border: 2px solid #f59e0b30;
}

.edit-btn:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #ef444415 0%, #ef444415 100%);
  color: #dc2626;
  border: 2px solid #ef444430;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* ===== Pagination ===== */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-info strong {
  color: #1e293b;
  font-weight: 700;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 10px 18px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.page-btn:hover {
  background: #f8fafc;
  border-color: #667eea;
  color: #667eea;
}

.page-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* ===== Responsive Design ===== */

/* Large Tablets and Small Laptops (1024px - 1200px) */
@media (max-width: 1200px) {
  .student-management {
    padding: 20px;
  }

  .main-title {
    font-size: 28px;
  }

  .icon-wrapper {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 24px;
  }

  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets (768px - 1023px) */
@media (max-width: 1023px) {
  .student-management {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .btn-add-new {
    width: 100%;
    justify-content: center;
  }

  .main-title {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    padding: 18px;
  }

  .stat-icon {
    width: 52px;
    height: 52px;
    font-size: 24px;
  }

  .stat-value {
    font-size: 22px;
  }

  .filter-card {
    padding: 20px;
  }

  .filter-grid {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .table-header {
    padding: 16px 20px;
  }

  .table-title {
    font-size: 16px;
  }

  .data-table th,
  .data-table td {
    padding: 14px 16px;
    font-size: 13px;
  }

  .pagination-wrapper {
    padding: 16px 20px;
  }

  .page-btn {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
}

/* Mobile Devices (481px - 767px) */
@media (max-width: 767px) {
  .student-management {
    padding: 12px;
  }

  .main-title {
    font-size: 20px;
    gap: 8px;
  }

  .icon-wrapper {
    width: 36px;
    height: 36px;
    font-size: 18px;
    border-radius: 8px;
  }

  .subtitle {
    font-size: 13px;
  }

  .btn-add-new {
    padding: 12px 20px;
    font-size: 14px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    gap: 14px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-label {
    font-size: 13px;
  }

  .stat-value {
    font-size: 20px;
  }

  .filter-card {
    padding: 16px;
  }

  .filter-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  .filter-title {
    font-size: 16px;
  }

  .btn-reset {
    padding: 6px 12px;
    font-size: 13px;
  }

  .reset-text {
    display: none;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .filter-input,
  .filter-select {
    padding: 10px 14px;
    font-size: 13px;
  }

  .loading-wrapper {
    padding: 50px 20px;
  }

  .table-header {
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .table-title {
    font-size: 15px;
    width: 100%;
  }

  .table-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .btn-icon-action {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  /* Mobile Table Styling */
  .data-table {
    min-width: 100%;
  }

  .data-table thead {
    display: none;
  }

  .data-table tbody tr {
    display: block;
    margin-bottom: 16px;
    border: 2px solid #f1f5f9;
    border-radius: 12px;
    padding: 16px;
    background: white;
  }

  .data-table tbody tr:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .data-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    text-align: right;
  }

  .data-table td:last-child {
    border-bottom: none;
    margin-top: 8px;
    padding-top: 12px;
    border-top: 2px solid #f1f5f9;
  }

  .data-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #475569;
    text-align: left;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .data-table td[data-label="Actions"] {
    justify-content: center;
  }

  .data-table td[data-label="Actions"]::before {
    display: none;
  }

  .student-profile {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  .student-avatar {
    width: 38px;
    height: 38px;
    font-size: 13px;
  }

  .student-details {
    align-items: flex-end;
  }

  .student-name {
    font-size: 13px;
  }

  .student-session {
    font-size: 11px;
  }

  .action-buttons-group {
    justify-content: center;
    width: 100%;
  }

  .action-btn {
    width: 40px;
    height: 40px;
  }

  /* Pagination Mobile */
  .pagination-wrapper {
    flex-direction: column;
    padding: 14px 16px;
    gap: 12px;
  }

  .pagination-info {
    width: 100%;
    justify-content: center;
    font-size: 13px;
  }

  .pagination-controls {
    width: 100%;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .pagination-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .btn-text {
    display: none;
  }

  .page-numbers {
    gap: 4px;
  }

  .page-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

/* Small Mobile Devices (320px - 480px) */
@media (max-width: 480px) {
  .student-management {
    padding: 10px;
  }

  .main-title {
    font-size: 18px;
    gap: 6px;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .subtitle {
    font-size: 12px;
  }

  .btn-add-new {
    padding: 10px 16px;
    font-size: 13px;
    gap: 6px;
  }

  .stat-card {
    padding: 14px;
    gap: 12px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .filter-card {
    padding: 14px;
  }

  .filter-title {
    font-size: 15px;
    gap: 6px;
  }

  .btn-reset {
    padding: 6px 10px;
  }

  .filter-label {
    font-size: 13px;
  }

  .filter-input,
  .filter-select {
    padding: 9px 12px;
    font-size: 13px;
  }

  .loading-wrapper {
    padding: 40px 15px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }

  .table-card {
    border-radius: 12px;
  }

  .table-header {
    padding: 12px 14px;
  }

  .table-title {
    font-size: 14px;
  }

  .btn-icon-action {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }

  .data-table tbody tr {
    padding: 14px;
    margin-bottom: 12px;
    border-radius: 10px;
  }

  .data-table td {
    padding: 8px 0;
    font-size: 13px;
  }

  .data-table td::before {
    font-size: 11px;
  }

  .student-id-badge {
    padding: 4px 10px;
    font-size: 11px;
  }

  .student-avatar {
    width: 34px;
    height: 34px;
    font-size: 12px;
  }

  .year-badge,
  .semester-badge {
    padding: 4px 10px;
    font-size: 11px;
    gap: 4px;
  }

  .status-pill {
    padding: 4px 10px;
    font-size: 11px;
    gap: 4px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .pagination-wrapper {
    padding: 12px 14px;
  }

  .pagination-info {
    font-size: 12px;
  }

  .pagination-btn {
    padding: 7px 10px;
    font-size: 12px;
  }

  .page-btn {
    width: 30px;
    height: 30px;
    font-size: 11px;
  }
}

/* Extra Small Devices (below 360px) */
@media (max-width: 359px) {
  .student-management {
    padding: 8px;
  }

  .main-title {
    font-size: 16px;
  }

  .icon-wrapper {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .btn-add-new {
    font-size: 12px;
    padding: 8px 12px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .stat-value {
    font-size: 16px;
  }

  .filter-title {
    font-size: 14px;
  }

  .table-title span {
    display: none;
  }

  .action-buttons-group {
    gap: 6px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .page-btn {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }
}
</style>