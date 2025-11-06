<template>
  <div class="application-list-container">
    <!-- Modern Header with Gradient -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Hostel Seat Applications</h1>
          <p class="subtitle">Manage and track all hostel applications</p>
        </div>
        <button @click="createNewApplication" class="btn btn-create">
          <i class="fas fa-plus-circle"></i>
          <span>New Application</span>
        </button>
      </div>
    </div>

    <!-- Modern Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-pending">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ getStatusCount('pending') }}</h3>
          <p>Pending</p>
        </div>
      </div>
      <div class="stat-card stat-approved">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3>{{ getStatusCount('approved') }}</h3>
          <p>Approved</p>
        </div>
      </div>
      <div class="stat-card stat-rejected">
        <div class="stat-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <h3>{{ getStatusCount('rejected') }}</h3>
          <p>Rejected</p>
        </div>
      </div>
      <div class="stat-card stat-total">
        <div class="stat-icon">
          <i class="fas fa-list-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ pagination.total }}</h3>
          <p>Total Applications</p>
        </div>
      </div>
    </div>

    <!-- Modern Filters with Glass Morphism -->
    <div class="filters-card">
      <div class="filters-section">
        <div class="filter-group">
          <label>
            <i class="fas fa-filter"></i>
            Status
          </label>
          <select v-model="filters.status" @change="fetchApplications" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="filter-group search-group">
          <label>
            <i class="fas fa-search"></i>
            Search
          </label>
          <input
              type="text"
              v-model="filters.search"
              @input="debounceSearch"
              placeholder="Search by name, roll no, mobile..."
              class="filter-input"
          />
        </div>
      </div>
    </div>

    <!-- Loading State with Modern Spinner -->
    <div v-if="loading" class="loading-state">
      <div class="modern-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p>Loading applications...</p>
    </div>

    <!-- Modern Table Card -->
    <div v-else-if="applications.length > 0" class="table-card">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fas fa-hashtag"></i> App No</th>
            <th><i class="fas fa-user"></i> Student</th>
            <th><i class="fas fa-phone"></i> Mobile</th>
            <th><i class="fas fa-graduation-cap"></i> Batch/Year</th>
            <th><i class="fas fa-door-open"></i> Room</th>
            <th><i class="fas fa-info-circle"></i> Status</th>
            <th><i class="fas fa-calendar"></i> Date</th>
            <th><i class="fas fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="app in applications" :key="app.id" class="table-row">
            <td>
              <span class="app-no">{{ app.application_no }}</span>
            </td>
            <td>
              <div class="student-info">
                <div class="student-avatar">
                  {{ getInitials(app.student_name) }}
                </div>
                <span class="student-name">{{ app.student_name }}</span>
              </div>
            </td>
            <td>
              <span class="mobile-number">{{ app.student_mobile }}</span>
            </td>
            <td>
              <span class="batch-info">{{ app.college_batch }} / {{ app.present_year }}</span>
            </td>
            <td>
              <span class="room-badge" v-if="app.room_no">{{ app.room_no }}</span>
              <span class="room-badge empty" v-else>N/A</span>
            </td>
            <td>
              <span :class="['status-badge', `status-${app.status}`]">
                <i :class="getStatusIcon(app.status)"></i>
                {{ app.status }}
              </span>
            </td>
            <td>
              <span class="date-text">{{ formatDate(app.created_at) }}</span>
            </td>
            <td>
              <div class="actions-cell">
                <button @click="viewApplication(app.id)" class="action-btn view-btn" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editApplication(app.id)" class="action-btn edit-btn" title="Edit Application">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="printApplication(app.id)" class="action-btn print-btn" title="Print Application">
                  <i class="fas fa-print"></i>
                </button>
                <button @click="deleteApplication(app.id)" class="action-btn delete-btn" title="Delete Application">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modern Empty State -->
    <div v-else class="empty-state">
      <div class="empty-illustration">
        <i class="fas fa-inbox"></i>
      </div>
      <h2>No Applications Found</h2>
      <p>Get started by creating your first hostel seat application</p>
      <button @click="createNewApplication" class="btn btn-primary">
        <i class="fas fa-plus-circle"></i>
        Create First Application
      </button>
    </div>

    <!-- Modern Pagination -->
    <div v-if="pagination.total > pagination.per_page" class="pagination-container">
      <div class="pagination">
        <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i>
          Previous
        </button>

        <div class="page-numbers">
          <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="['page-number', { active: page === pagination.current_page }]"
          >
            {{ page }}
          </button>
        </div>

        <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="pagination-btn"
        >
          Next
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="pagination-info">
        Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} -
        {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
        of {{ pagination.total }} results
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ApplicationList',

  data() {
    return {
      applications: [],
      loading: false,
      filters: {
        status: '',
        search: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
      },
      searchTimeout: null
    };
  },

  computed: {
    visiblePages() {
      const pages = [];
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;

      if (last <= 7) {
        for (let i = 1; i <= last; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(last);
        } else if (current >= last - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = last - 4; i <= last; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(last);
        }
      }

      return pages;
    }
  },

  mounted() {
    this.fetchApplications();
  },

  methods: {
    async fetchApplications(page = 1) {
      this.loading = true;

      try {
        const params = {
          page,
          status: this.filters.status,
          search: this.filters.search
        };

        const response = await this.$api.get('/hostel-applications', { params });

        this.applications = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };

      } catch (error) {
        console.error('Error fetching applications:', error);
        // this.$notify({
        //   title: 'Error',
        //   message: 'Failed to load applications',
        //   type: 'error'
        // });
      } finally {
        this.loading = false;
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchApplications();
      }, 500);
    },

    changePage(page) {
      if (page === '...') return;
      this.fetchApplications(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    createNewApplication() {
      this.$router.push('/hostel-applications/create');
    },

    viewApplication(id) {
      this.$router.push(`/hostel-applications/${id}`);
    },

    editApplication(id) {
      this.$router.push(`/hostel-applications/${id}/edit`);
    },

    printApplication(id) {
      window.open(`/hostel-applications/${id}/print`, '_blank');
    },

    async deleteApplication(id) {
      if (!confirm('Are you sure you want to delete this application?')) {
        return;
      }

      try {
        await this.$api.delete(`/hostel-applications/${id}`);

        // this.$notify({
        //   title: 'Success',
        //   message: 'Application deleted successfully',
        //   type: 'success'
        // });

        this.fetchApplications();

      } catch (error) {
        console.error('Error deleting application:', error);
        this.$notify({
          title: 'Error',
          message: 'Failed to delete application',
          type: 'error'
        });
      }
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },

    getInitials(name) {
      if (!name) return '?';
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
    },

    getStatusIcon(status) {
      const icons = {
        pending: 'fas fa-clock',
        approved: 'fas fa-check-circle',
        rejected: 'fas fa-times-circle',
        cancelled: 'fas fa-ban'
      };
      return icons[status] || 'fas fa-info-circle';
    },

    getStatusCount(status) {
      return this.applications.filter(app => app.status === status).length;
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.application-list-container {
  /*max-width: 1600px;*/
  /*margin: 0 auto;*/
  padding: 30px 25px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Modern Page Header with Gradient */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-text h1 {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.9);
  margin: 0;
}

/* Modern Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.stat-card:hover::before {
  width: 100%;
  opacity: 0.05;
}

.stat-pending::before { background: #f39c12; }
.stat-approved::before { background: #27ae60; }
.stat-rejected::before { background: #e74c3c; }
.stat-total::before { background: #3498db; }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-pending .stat-icon {
  background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
  color: white;
}

.stat-approved .stat-icon {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
}

.stat-rejected .stat-icon {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.stat-total .stat-icon {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.stat-content h3 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.stat-content p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 500;
}

/* Modern Filters with Glass Morphism */
.filters-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.3);
}

.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label i {
  color: #667eea;
}

.filter-select,
.filter-input {
  padding: 12px 16px;
  border: 2px solid #e8eaf6;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-group {
  grid-column: span 2;
}

/* Modern Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.modern-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(2) {
  border-top-color: #764ba2;
  animation-delay: -0.5s;
}

.spinner-ring:nth-child(3) {
  border-top-color: #f093fb;
  animation-delay: -1s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 16px;
  color: #7f8c8d;
  font-weight: 500;
}

/* Modern Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modern-table th {
  padding: 18px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.8;
}

.modern-table td {
  padding: 18px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #2c3e50;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
  transform: scale(1.01);
}

/* Student Info with Avatar */
.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.student-name {
  font-weight: 600;
  color: #2c3e50;
}

.app-no {
  font-weight: 700;
  color: #667eea;
  font-size: 13px;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
}

.mobile-number {
  font-family: 'Courier New', monospace;
  color: #34495e;
}

.batch-info {
  font-weight: 500;
  color: #7f8c8d;
}

.room-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
}

.room-badge.empty {
  background: #ecf0f1;
  color: #95a5a6;
}

.date-text {
  color: #7f8c8d;
  font-size: 13px;
}

/* Modern Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge i {
  font-size: 11px;
}

.status-pending {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe4a3 100%);
  color: #856404;
}

.status-approved {
  background: linear-gradient(135deg, #d4edda 0%, #b7e4c7 100%);
  color: #155724;
}

.status-rejected {
  background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%);
  color: #721c24;
}

.status-cancelled {
  background: linear-gradient(135deg, #e2e3e5 0%, #d3d3d4 100%);
  color: #383d41;
}

/* Modern Action Buttons */
.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
}

.action-btn:hover::before {
  width: 100px;
  height: 100px;
  top: -25px;
  left: -25px;
}

.view-btn {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(23, 162, 184, 0.3);
}

.edit-btn {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #333;
  box-shadow: 0 4px 10px rgba(255, 193, 7, 0.3);
}

.print-btn {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
}

.action-btn:active {
  transform: translateY(0);
}

/* Modern Empty State */
.empty-state {
  text-align: center;
  padding: 100px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.empty-illustration {
  margin-bottom: 30px;
}

.empty-illustration i {
  font-size: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.3;
}

.empty-state h2 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.empty-state p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 30px 0;
}

/* Modern Pagination */
.pagination-container {
  margin-top: 30px;
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.pagination-btn {
  padding: 10px 20px;
  border: 2px solid #e8eaf6;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: #f5f5f5;
  color: #95a5a6;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  border: 2px solid #e8eaf6;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #667eea;
}

.page-number:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.pagination-info {
  text-align: center;
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

/* Modern Buttons */
.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
}

.btn-create,
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-create:hover,
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.btn i {
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .application-list-container {
    padding: 20px 15px;
  }

  .page-header {
    padding: 30px 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .header-text h1 {
    font-size: 26px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    grid-template-columns: 1fr;
  }

  .search-group {
    grid-column: span 1;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .modern-table {
    min-width: 1000px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 15px;
  }

  .actions-cell {
    flex-direction: column;
    gap: 6px;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-text h1 {
    font-size: 22px;
  }

  .subtitle {
    font-size: 14px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .stat-content h3 {
    font-size: 24px;
  }
}

/* Smooth Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>