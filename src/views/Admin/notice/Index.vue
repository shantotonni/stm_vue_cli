<template>
  <div class="notice-container">
    <!-- Header Section -->
    <div class="notice-header">
      <h1 class="page-title">📢 Notice Management</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <span class="btn-icon">+</span> Create Notice
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid" v-if="statistics">
      <div class="stat-card stat-total">
        <div class="stat-value">{{ statistics.total }}</div>
        <div class="stat-label">Total Notices</div>
      </div>
      <div class="stat-card stat-active">
        <div class="stat-value">{{ statistics.active }}</div>
        <div class="stat-label">Active Notices</div>
      </div>
      <div class="stat-card stat-urgent">
        <div class="stat-value">{{ statistics.by_type?.urgent || 0 }}</div>
        <div class="stat-label">Urgent</div>
      </div>
      <div class="stat-card stat-exam">
        <div class="stat-value">{{ statistics.by_type?.exam || 0 }}</div>
        <div class="stat-label">Exam Related</div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-grid">
        <!-- Search -->
        <div class="form-group">
          <input
              type="text"
              class="form-control"
              placeholder="🔍 Search notices..."
              v-model="filters.search"
              @input="debounceSearch"
          >
        </div>

        <!-- Type Filter -->
        <div class="form-group">
          <select class="form-control" v-model="filters.notice_type" @change="fetchNotices">
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="exam">Exam</option>
            <option value="event">Event</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <!-- Audience Filter -->
        <div class="form-group">
          <select class="form-control" v-model="filters.target_audience" @change="fetchNotices">
            <option value="">All Audiences</option>
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="department">Department</option>
          </select>
        </div>

        <!-- Year Filter -->
        <div class="form-group">
          <select class="form-control" v-model="filters.year" @change="fetchNotices">
            <option value="">All Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
            <option value="5th">5th Year</option>
          </select>
        </div>

        <!-- Active Only Toggle -->
        <div class="form-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="filters.active_only" @change="fetchNotices">
            <span class="checkbox-label">Active Only</span>
          </label>
        </div>

        <!-- Clear Filters -->
        <div class="form-group">
          <button class="btn btn-secondary btn-block" @click="clearFilters">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading notices...</p>
    </div>

    <!-- Notices Grid -->
    <div v-else-if="notices.length > 0" class="notices-grid">
      <div
          v-for="notice in notices"
          :key="notice.id"
          class="notice-card"
          :class="[
          `notice-${notice.notice_type}`,
          { 'notice-inactive': !notice.is_active }
        ]"
      >
        <!-- Notice Header -->
        <div class="notice-card-header">
          <div class="notice-badges">
            <span class="badge" :class="`badge-${notice.type_badge}`">
              {{ notice.notice_type }}
            </span>
            <span class="badge badge-outline">
              {{ notice.target_audience }}
            </span>
            <span v-if="notice.year" class="badge badge-year">
              {{ notice.year }} Year
            </span>
          </div>
          <div class="notice-actions">
            <button
                class="icon-btn"
                :class="{ 'active': notice.is_active }"
                @click="toggleStatus(notice)"
                :title="notice.is_active ? 'Deactivate' : 'Activate'"
            >
              {{ notice.is_active ? '👁️' : '🚫' }}
            </button>
          </div>
        </div>

        <!-- Notice Title -->
        <h3 class="notice-title" @click="viewNotice(notice)">
          {{ notice.title }}
        </h3>

        <!-- Notice Content Preview -->
        <p class="notice-content">
          {{ truncateContent(notice.content) }}
        </p>

        <!-- Notice Meta -->
        <div class="notice-meta">
          <div class="meta-item">
            <span class="meta-icon">📅</span>
            <span class="meta-text">{{ formatDate(notice.publish_date) }}</span>
          </div>
          <div class="meta-item" v-if="notice.expire_date">
            <span class="meta-icon">⏰</span>
            <span class="meta-text">Expires: {{ formatDate(notice.expire_date) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">👤</span>
            <span class="meta-text">{{ notice.creator?.name || 'Unknown' }}</span>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="notice-status" :class="`status-${notice.status_label}`">
          {{ notice.status_label }}
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <button class="btn btn-sm btn-view" @click="viewNotice(notice)">
            View
          </button>
          <button class="btn btn-sm btn-edit" @click="editNotice(notice)">
            Edit
          </button>
          <button class="btn btn-sm btn-delete" @click="deleteNotice(notice)">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No Notices Found</h3>
      <p>Create your first notice to get started!</p>
      <button class="btn btn-primary" @click="openCreateModal">
        Create Notice
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
          class="pagination-btn"
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
      >
        ← Previous
      </button>

      <div class="pagination-info">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
      </div>

      <button
          class="pagination-btn"
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
      >
        Next →
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <notice-form-modal
        v-if="showModal"
        :notice="selectedNotice"
        :is-edit="isEdit"
        @close="closeModal"
        @saved="handleSaved"
    />

    <!-- View Modal -->
    <notice-view-modal
        v-if="showViewModal"
        :notice="selectedNotice"
        @close="closeViewModal"
        @edit="editNotice"
        @delete="deleteNotice"
    />
  </div>
</template>

<script>
import NoticeFormModal from './NoticeFormModal.vue';
import NoticeViewModal from './NoticeViewModal.vue';

export default {
  name: 'NoticeList',
  components: {
    NoticeFormModal,
    NoticeViewModal
  },
  data() {
    return {
      notices: [],
      statistics: null,
      loading: false,
      showModal: false,
      showViewModal: false,
      selectedNotice: null,
      isEdit: false,
      searchTimeout: null,
      filters: {
        search: '',
        notice_type: '',
        target_audience: '',
        year: '',
        active_only: false
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
      }
    };
  },
  mounted() {
    this.fetchNotices();
    this.fetchStatistics();
  },
  methods: {
    async fetchNotices() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null) {
            delete params[key];
          }
        });

        const response = await this.$api.get('/notices', { params });
        this.notices = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };
      } catch (error) {
        console.error('Error fetching notices:', error);
        this.$toast.error('Failed to fetch notices');
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      try {
        const response = await this.$api.get('/notices/statistics');
        this.statistics = response.data;
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.fetchNotices();
      }, 500);
    },

    clearFilters() {
      this.filters = {
        search: '',
        notice_type: '',
        target_audience: '',
        year: '',
        active_only: false
      };
      this.pagination.current_page = 1;
      this.fetchNotices();
    },

    changePage(page) {
      this.pagination.current_page = page;
      this.fetchNotices();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    openCreateModal() {
      this.selectedNotice = null;
      this.isEdit = false;
      this.showModal = true;
    },

    editNotice(notice) {
      this.selectedNotice = notice;
      this.isEdit = true;
      this.showModal = true;
      this.showViewModal = false;
    },

    viewNotice(notice) {
      this.selectedNotice = notice;
      this.showViewModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedNotice = null;
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedNotice = null;
    },

    handleSaved() {
      this.closeModal();
      this.fetchNotices();
      this.fetchStatistics();
    },

    async toggleStatus(notice) {
      try {
        const response = await this.$api.patch(`/notices/${notice.id}/toggle-status`);
        notice.is_active = response.data.is_active;
        this.$toast.success('Status updated successfully');
        this.fetchStatistics();
      } catch (error) {
        console.error('Error toggling status:', error);
        this.$toast.error('Failed to update status');
      }
    },

    async deleteNotice(notice) {
      if (!confirm(`Are you sure you want to delete "${notice.title}"?`)) {
        return;
      }

      try {
        await this.$api.delete(`/notices/${notice.id}`);
        this.$toast.success('Notice deleted successfully');
        this.fetchNotices();
        this.fetchStatistics();
        this.closeViewModal();
      } catch (error) {
        console.error('Error deleting notice:', error);
        this.$toast.error('Failed to delete notice');
      }
    },

    truncateContent(content) {
      return content.length > 150 ? content.substring(0, 150) + '...' : content;
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
/* Container */
.notice-container {
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: #dfdfdf;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header */
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f1f3f5;
  color: #495057;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-view {
  background: #4dabf7;
  color: white;
}

.btn-edit {
  background: #51cf66;
  color: white;
}

.btn-delete {
  background: #ff6b6b;
  color: white;
}

.btn-view:hover,
.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn-block {
  width: 100%;
}

.btn-icon {
  font-size: 18px;
  line-height: 1;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.icon-btn.active {
  color: #51cf66;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #667eea;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-total { border-left-color: #667eea; }
.stat-active { border-left-color: #51cf66; }
.stat-urgent { border-left-color: #ff6b6b; }
.stat-exam { border-left-color: #ff922b; }

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #868e96;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px 0;
}

.checkbox-container input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Notices Grid */
.notices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

/* Notice Card */
.notice-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #dee2e6;
  position: relative;
}

.notice-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.notice-urgent {
  border-left-color: #ff6b6b;
  background: linear-gradient(to right, #fff5f5 0%, white 10%);
}

.notice-exam {
  border-left-color: #ff922b;
  background: linear-gradient(to right, #fff9f0 0%, white 10%);
}

.notice-academic {
  border-left-color: #4dabf7;
  background: linear-gradient(to right, #f0f8ff 0%, white 10%);
}

.notice-event {
  border-left-color: #51cf66;
  background: linear-gradient(to right, #f5fff5 0%, white 10%);
}

.notice-inactive {
  opacity: 0.6;
}

.notice-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.notice-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-red {
  background: #ffe0e0;
  color: #c92a2a;
}

.badge-orange {
  background: #ffe8cc;
  color: #e8590c;
}

.badge-blue {
  background: #e0f2ff;
  color: #1864ab;
}

.badge-green {
  background: #d3f9d8;
  color: #2b8a3e;
}

.badge-gray {
  background: #f1f3f5;
  color: #495057;
}

.badge-outline {
  background: transparent;
  border: 1px solid #dee2e6;
  color: #495057;
}

.badge-year {
  background: #f8f0ff;
  color: #7950f2;
}

.notice-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1.4;
}

.notice-title:hover {
  color: #667eea;
}

.notice-content {
  font-size: 14px;
  color: #495057;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.notice-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f5;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #868e96;
}

.meta-icon {
  font-size: 14px;
}

.notice-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.status-active {
  background: #d3f9d8;
  color: #2b8a3e;
}

.status-inactive {
  background: #f1f3f5;
  color: #868e96;
}

.status-expired {
  background: #ffe0e0;
  color: #c92a2a;
}

.status-scheduled {
  background: #e0f2ff;
  color: #1864ab;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f5;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: #868e96;
  margin: 0 0 24px 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notice-container {
    padding: 15px;
  }

  .page-title {
    font-size: 24px;
  }

  .notice-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .notices-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .btn-sm {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>