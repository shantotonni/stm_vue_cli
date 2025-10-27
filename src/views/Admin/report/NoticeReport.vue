<template>
  <div class="report-container">
    <!-- Header Section -->
    <div class="report-header">
      <h1 class="report-title">Notice Board</h1>
      <p class="report-subtitle">Stay updated with latest announcements and notices</p>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <input
              type="text"
              v-model="filters.search"
              placeholder="Search notices..."
              class="search-input"
              @input="handleSearch"
          />
        </div>

        <div class="filter-item">
          <select v-model="filters.department_id" @change="fetchNotices" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
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
          :class="{ 'urgent-notice': notice.is_urgent }"
          @click="viewNotice(notice)"
      >

        <!-- Notice Content -->
        <div class="notice-content">
          <h3 class="notice-title">{{ notice.title }}</h3>

          <div class="notice-meta">
            <span class="meta-item">
              <span class="meta-icon">🏢</span>
              {{ notice.department }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">👤</span>
              {{ notice.publisher }}
            </span>
          </div>

          <p class="notice-preview">{{ notice.preview }}</p>

          <!-- Expiry Info -->
          <div v-if="notice.days_remaining !== null" class="expiry-info">
            <span class="expiry-icon">⏰</span>
            {{ notice.days_remaining }} days remaining
          </div>
        </div>

        <!-- Read More Button -->
        <div class="read-more-container">
          <button class="read-more-btn">
            Read More <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && notices.length > 0" class="pagination">
      <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="pagination-btn"
      >
        ← Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ lastPage }}</span>
      <button
          @click="nextPage"
          :disabled="currentPage === lastPage"
          class="pagination-btn"
      >
        Next →
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state">
      <div class="empty-icon">📢</div>
      <h3>No Notices Available</h3>
      <p>There are no notices to display at the moment</p>
    </div>

    <!-- Notice Detail Modal -->
    <div v-if="selectedNotice" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>

        <div class="modal-header">
          <h2>{{ selectedNotice.title }}</h2>
          <div class="modal-meta">
            <span class="meta-item">
              <span class="meta-icon">🏢</span>
              {{ selectedNotice.department }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              {{ formatDate(selectedNotice.publish_date) }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">👤</span>
              {{ selectedNotice.publisher }}
            </span>
          </div>
        </div>

        <div class="modal-body">
          <p>{{ selectedNotice.content }}</p>
        </div>

        <div v-if="selectedNotice.expiry_date" class="modal-footer">
          <span class="expiry-info">
            <span class="expiry-icon">⏰</span>
            Valid until: {{ formatDate(selectedNotice.expiry_date) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NoticeReport',
  data() {
    return {
      notices: [],
      departments: [],
      loading: false,
      filters: {
        search: '',
        department_id: '',
      },
      currentPage: 1,
      lastPage: 1,
      selectedNotice: null,
      searchTimeout: null,
    };
  },
  mounted() {
    this.fetchDepartments();
    this.fetchNotices();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchNotices() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          ...this.filters,
        };
        const response = await this.$api.get('/reports/notices', { params });
        this.notices = response.data.data.data;
        this.currentPage = response.data.data.current_page;
        this.lastPage = response.data.data.last_page;
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchNotices();
      }, 500);
    },
    async viewNotice(notice) {
      try {
        const response = await this.$api.get(`/reports/notices/${notice.id}`);
        this.selectedNotice = response.data.data;
      } catch (error) {
        console.error('Error fetching notice details:', error);
      }
    },
    closeModal() {
      this.selectedNotice = null;
    },
    formatDay(dateString) {
      const date = new Date(dateString);
      return date.getDate();
    },
    formatMonth(dateString) {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[date.getMonth()];
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchNotices();
      }
    },
    nextPage() {
      if (this.currentPage < this.lastPage) {
        this.currentPage++;
        this.fetchNotices();
      }
    },
  },
};
</script>

<style scoped>
/* Main Container */
.report-container {
  padding: 30px;
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: #f5f7fa;
  min-height: 100vh;
}

/* Header Section */
.report-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.report-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.report-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 250px;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Notices Grid */
.notices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.notice-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notice-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.notice-card:hover .read-more-btn {
  background: #2563eb;
  padding-right: 30px;
}

.notice-card:hover .arrow {
  transform: translateX(5px);
}

.urgent-notice {
  border: 2px solid #ef4444;
  background: linear-gradient(to bottom, #fff 0%, #fef2f2 100%);
}

/* Date Badge */
.date-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.priority-urgent {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.priority-high {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.priority-normal {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.priority-low {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.badge-day {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.badge-month {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 2px;
}

/* Urgent Badge */
.urgent-badge {
  display: inline-block;
  background: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Notice Content */
.notice-content {
  margin-bottom: 20px;
}

.notice-title {
  margin: 0 80px 15px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.notice-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
}

.meta-icon {
  font-size: 14px;
}

.notice-preview {
  margin: 15px 0 0 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.expiry-info {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #f59e0b;
  font-weight: 600;
  margin-top: 10px;
  padding: 5px 10px;
  background: #fef3c7;
  border-radius: 6px;
}

.expiry-icon {
  font-size: 14px;
}

/* Read More Button */
.read-more-container {
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
}

.read-more-btn {
  width: 100%;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.arrow {
  transition: transform 0.3s ease;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.pagination-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pagination-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #111827;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  position: relative;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 28px;
  line-height: 1;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #111827;
  transform: rotate(90deg);
}

.modal-header {
  padding: 40px 40px 25px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0 0 15px 0;
  font-size: 24px;
  color: #111827;
  padding-right: 40px;
}

.modal-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.modal-body {
  padding: 30px 40px;
}

.modal-body p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
}

.modal-footer {
  padding: 20px 40px 30px;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .report-container {
    padding: 15px;
  }

  .report-header {
    padding: 25px;
  }

  .report-title {
    font-size: 24px;
  }

  .notices-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }

  .modal-content {
    max-height: 90vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 25px;
    padding-right: 25px;
  }
}
</style>